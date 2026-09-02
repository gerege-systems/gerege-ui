'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from 'react';
import { version as reactVersion } from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { formatString } from '@/lib/strings';
import { IconButton } from './IconButton';

// `inert` is a boolean attribute. React 19 renders `inert={true}` as `inert=""`;
// React 18 has no knowledge of it and only forwards a string, so pass `''`
// there (it would drop `true` with a warning). Typed loosely for both.
const INERT_PROPS = {
  inert: Number(reactVersion.split('.')[0]) >= 19 ? true : '',
} as Record<string, unknown>;

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];

interface CarouselContextValue {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  canPrev: boolean;
  canNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  orientation: 'horizontal' | 'vertical';
  slideCount: number;
  /** Indices of slides currently in view (others are inert). */
  inView: number[];
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel components must be used inside <Carousel>');
  return ctx;
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
}

/**
 * Embla-backed carousel. Compose with `<CarouselContent>`, `<CarouselItem>`,
 * `<CarouselPrevious>`, and `<CarouselNext>`.
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  {
    opts,
    orientation = 'horizontal',
    setApi,
    className,
    children,
    onKeyDown,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...props
  },
  ref,
) {
  const strings = useStrings();
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === 'horizontal' ? 'x' : 'y',
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [slideCount, setSlideCount] = useState(0);
  const [inView, setInView] = useState<number[]>([]);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
    setInView(api.slidesInView());
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (event.key === prevKey) {
      event.preventDefault();
      api?.scrollPrev();
    } else if (event.key === nextKey) {
      event.preventDefault();
      api?.scrollNext();
    }
  };

  useEffect(() => {
    if (!api) return;
    setApi?.(api);
    onSelect(api);
    api.on('reInit', onSelect).on('select', onSelect).on('slidesInView', onSelect);
    return () => {
      api.off('reInit', onSelect).off('select', onSelect).off('slidesInView', onSelect);
    };
  }, [api, onSelect, setApi]);

  useEffect(() => {
    if (!api) return;
    const count = () => setSlideCount(api.slideNodes().length);
    count();
    api.on('reInit', count);
    return () => {
      api.off('reInit', count);
    };
  }, [api]);

  return (
    <CarouselContext.Provider
      data-slot="carousel"
      value={{
        carouselRef,
        api,
        canPrev,
        canNext,
        scrollPrev: () => api?.scrollPrev(),
        scrollNext: () => api?.scrollNext(),
        orientation,
        slideCount,
        inView,
      }}
    >
      {/* Arrow keys act only while focus is inside the region (it is not itself
          focusable); the buttons remain the primary control. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={ref}
        className={cn('relative isolate', className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel ?? (ariaLabelledby ? undefined : strings.carousel.label)}
        aria-labelledby={ariaLabelledby}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
});
Carousel.displayName = 'Carousel';

export const CarouselContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CarouselContent({ className, ...props }, ref) {
    const { carouselRef, orientation } = useCarousel();
    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = 'CarouselContent';

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  /** 0-based position, used for the default "{i+1} of {n}" label. */
  index?: number;
}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(function CarouselItem(
  { className, index, 'aria-label': ariaLabel, ...props },
  ref,
) {
  const strings = useStrings();
  const { orientation, slideCount, inView } = useCarousel();
  const defaultLabel =
    index !== undefined && slideCount > 0
      ? formatString(strings.carousel.slide, { index: index + 1, count: slideCount })
      : undefined;
  // Off-screen slides are inert: not in the tab order, not read by AT. Only
  // possible when `index` is provided (unknown index → always live).
  const offscreen = index !== undefined && inView.length > 0 && !inView.includes(index);
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={ariaLabel ?? defaultLabel}
      aria-hidden={offscreen || undefined}
      {...(offscreen ? INERT_PROPS : undefined)}
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

type CarouselButtonProps = Omit<
  ComponentPropsWithoutRef<typeof IconButton>,
  'icon' | 'aria-label'
> & { 'aria-label'?: string };

export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  function CarouselPrevious({ className, 'aria-label': ariaLabel, ...props }, ref) {
    const { canPrev, scrollPrev, orientation } = useCarousel();
    const strings = useStrings();
    return (
      <IconButton
        ref={ref}
        aria-label={ariaLabel ?? strings.carousel.previous}
        variant="outline"
        disabled={!canPrev}
        onClick={scrollPrev}
        icon={<ChevronLeft />}
        className={cn(
          'absolute z-10',
          orientation === 'horizontal'
            ? 'top-1/2 -left-12 -translate-y-1/2'
            : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
          className,
        )}
        {...props}
      />
    );
  },
);
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  function CarouselNext({ className, 'aria-label': ariaLabel, ...props }, ref) {
    const { canNext, scrollNext, orientation } = useCarousel();
    const strings = useStrings();
    return (
      <IconButton
        ref={ref}
        aria-label={ariaLabel ?? strings.carousel.next}
        variant="outline"
        disabled={!canNext}
        onClick={scrollNext}
        icon={<ChevronRight />}
        className={cn(
          'absolute z-10',
          orientation === 'horizontal'
            ? 'top-1/2 -right-12 -translate-y-1/2'
            : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
          className,
        )}
        {...props}
      />
    );
  },
);
CarouselNext.displayName = 'CarouselNext';

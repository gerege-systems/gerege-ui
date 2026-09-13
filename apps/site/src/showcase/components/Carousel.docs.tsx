import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/Carousel';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'carousel',
  name: 'Carousel',
  group: 'Data Display',
  description:
    'Slide gallery powered by Embla. Renders prev/next buttons and dot indicators. Use sparingly — most content reads better as a vertical list.',
  i18n: 'Reads `carousel.label`, `carousel.previous`, `carousel.next` and `carousel.slide` ("{index} of {count}").',
  exports: ['Carousel', 'CarouselContent', 'CarouselItem'],
  sourceFile: 'Carousel.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {[1, 2, 3, 4].map((i) => (
              <CarouselItem key={i}>
                <div className="border-border bg-card flex aspect-video items-center justify-center rounded-md border text-xl font-medium">
                  Slide {i}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ),
      code: `<Carousel>
  <CarouselContent>
    {slides.map((s) => (
      <CarouselItem key={s.id}>
        <img src={s.src} alt={s.alt} />
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'opts',
          type: 'EmblaOptionsType',
          description: 'Embla options (loop, align, dragFree, …).',
        },
        {
          name: 'orientation',
          type: `'horizontal' | 'vertical'`,
          default: `'horizontal'`,
          description: 'Scroll direction.',
        },
      ],
    },
  ],
  accessibility: [
    'Prev / Next buttons have aria-label and are disabled at bounds.',
    'Drag is supported on touch; keyboard arrows move between slides.',
  ],
  keyboard: [
    {
      key: 'Tab / Shift+Tab',
      action: 'Move to the Previous / Next buttons (the carousel region itself is not focusable).',
    },
    { key: 'Enter / Space', action: 'Activate the focused Previous / Next button.' },
    {
      key: 'ArrowLeft / ArrowRight',
      action: 'Previous / next slide while focus is anywhere inside a horizontal carousel.',
    },
    {
      key: 'ArrowUp / ArrowDown',
      action: 'Previous / next slide in a vertical carousel (`orientation="vertical"`).',
    },
  ],
};

export default doc;

'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { useFieldIds } from '@/hooks/use-field-ids';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label above the field. */
  label?: ReactNode;
  /** Hint below the field. Hidden when `error` is set. */
  helperText?: ReactNode;
  /** Validation message. Sets `aria-invalid`. */
  error?: ReactNode;
  /** Grow vertically as content is added. */
  autoResize?: boolean;
  /** Minimum rows when `autoResize`. Defaults to 3. */
  minRows?: number;
  /** Maximum rows before scrolling when `autoResize`. Defaults to 12. */
  maxRows?: number;
  /** Visually hide the label while keeping it accessible. */
  hideLabel?: boolean;
}

/**
 * Multi-line text input. With `autoResize`, height tracks content from
 * `minRows` to `maxRows`. Without it, behaves like a native `<textarea>`.
 *
 * @example Comment box
 *   <Textarea label="Note" autoResize minRows={3} maxRows={10} />
 *
 * @example With error
 *   <Textarea label="Description"
 *             error={errors.description?.message}
 *             {...register('description')} />
 *
 * @do Default to `autoResize` for multi-line free-form input.
 * @dont Add `resize-none` without auto-resize — users will be stuck with a
 *       3-line box for long content.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    label,
    helperText,
    error,
    autoResize,
    minRows = 3,
    maxRows = 12,
    hideLabel,
    id,
    onChange,
    value,
    defaultValue,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
) {
  const isError = Boolean(error) || ariaInvalid === true || ariaInvalid === 'true';
  const { fieldId, helperId, errorId, describedBy } = useFieldIds(id, {
    hasHelper: Boolean(helperText),
    hasError: Boolean(error),
    extra: ariaDescribedby,
  });
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  // Stash a ref locally and forward to the consumer.
  const setRef = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
  };

  const recompute = useCallback(() => {
    const el = innerRef.current;
    if (!el || !autoResize) return;
    const cs = getComputedStyle(el);
    const lineHeight = parseFloat(cs.lineHeight) || 20;
    // scrollHeight includes padding but not borders; the element is border-box.
    const padding = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const border = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
    const minH = lineHeight * minRows + padding + border;
    const maxH = lineHeight * maxRows + padding + border;
    el.style.height = 'auto';
    const content = el.scrollHeight + border;
    el.style.height = `${Math.min(Math.max(content, minH), maxH)}px`;
    el.style.overflowY = content > maxH ? 'auto' : 'hidden';
  }, [autoResize, minRows, maxRows]);

  useEffect(() => {
    if (autoResize) recompute();
  }, [autoResize, recompute, value, defaultValue]);

  // Width changes re-wrap the text, so recompute on resize too.
  useEffect(() => {
    const el = innerRef.current;
    if (!autoResize || !el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);
    return () => ro.disconnect();
  }, [autoResize, recompute]);

  return (
    <div data-slot="textarea-field" className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn('text-foreground text-sm font-medium', hideLabel && 'sr-only')}
        >
          {label}
        </label>
      )}
      <textarea
        ref={setRef}
        id={fieldId}
        rows={minRows}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          onChange?.(e);
          if (autoResize) recompute();
        }}
        aria-invalid={isError ? true : ariaInvalid}
        aria-describedby={describedBy}
        className={cn(
          'bg-card text-foreground rounded-md border px-3 py-2 text-lg md:text-sm',
          'placeholder:text-foreground-subtle',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
          'outline-none',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'border-border-input focus-visible:border-accent',
          'aria-invalid:border-danger aria-invalid:focus-visible:border-danger aria-invalid:focus-visible:ring-danger',
          autoResize ? 'resize-none' : 'min-h-20 resize-y',
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-danger-text text-xs">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-foreground-subtle text-xs">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

'use client';

import { forwardRef, useCallback, useState, type KeyboardEvent, type ReactNode } from 'react';
import { X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { formatString } from '@/lib/strings';
import { useFieldIds } from '@/hooks/use-field-ids';

export interface TagInputProps {
  /** Controlled list of tags. */
  value?: string[];
  /** Default tags when uncontrolled. */
  defaultValue?: string[];
  /** Called when the tag list changes. */
  onChange?: (tags: string[]) => void;
  /** Visible label rendered above the field. */
  label?: ReactNode;
  /** Visually conceal the label while keeping it for screen readers. */
  hideLabel?: boolean;
  /** Hint below the field. Hidden while `error` is set. */
  description?: ReactNode;
  /** Placeholder shown inside the inline input. */
  placeholder?: string;
  /** Maximum number of tags. */
  max?: number;
  /** Disable the editor. */
  disabled?: boolean;
  /**
   * Validation state. `true` only paints the danger border; a ReactNode also
   * renders the message below the field and wires `aria-describedby`.
   */
  error?: boolean | ReactNode;
  /** Treat these characters as separators (default: Enter + comma). */
  separators?: string[];
  /** Consumer-supplied id for the inline input. */
  id?: string;
  /** Extra ids to append to `aria-describedby`. */
  'aria-describedby'?: string;
  'aria-label'?: string;
  className?: string;
}

/**
 * Chip-based multi-value input. Press Enter or comma to add. Backspace on an
 * empty input removes the last tag.
 */
export const TagInput = forwardRef<HTMLDivElement, TagInputProps>(function TagInput(
  {
    value,
    defaultValue = [],
    onChange,
    label,
    hideLabel,
    description,
    placeholder: placeholderProp,
    max,
    disabled,
    error,
    separators = ['Enter', ','],
    id,
    'aria-describedby': ariaDescribedby,
    'aria-label': ariaLabel,
    className,
  },
  ref,
) {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState('');
  const tags = value ?? internal;

  const strings = useStrings();
  const placeholder = placeholderProp ?? strings.tagInput.placeholder;
  const isError = Boolean(error);
  const hasErrorMessage = isError && error !== true;
  const { fieldId, helperId, errorId, describedBy } = useFieldIds(id, {
    hasHelper: Boolean(description),
    hasError: hasErrorMessage,
    extra: ariaDescribedby,
  });

  const update = useCallback(
    (next: string[]) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const commit = (raw: string) => {
    const t = raw.trim();
    if (!t || tags.includes(t) || (max !== undefined && tags.length >= max)) return;
    update([...tags, t]);
  };

  const remove = (idx: number) => update(tags.filter((_, i) => i !== idx));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (separators.includes(e.key)) {
      e.preventDefault();
      commit(draft);
      setDraft('');
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      remove(tags.length - 1);
    }
  };

  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          data-slot="tag-input"
          htmlFor={fieldId}
          className={cn('text-foreground text-sm font-medium', hideLabel && 'sr-only')}
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          // Cap growth at ~3 chip rows and scroll inside — an unbounded field
          // pushes the surrounding layout around as tags are added.
          'bg-card flex max-h-24 min-h-9 w-full flex-wrap items-center gap-1.5 overflow-y-auto rounded-md border px-2 py-1.5',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
          'focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
          isError
            ? 'border-danger focus-within:border-danger focus-within:ring-danger'
            : 'border-border-input focus-within:border-accent focus-within:ring-ring',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        {tags.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="bg-background-muted inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs"
          >
            {t}
            <button
              type="button"
              onClick={() => remove(i)}
              // 16px glyph box + halo → ≥24px hit area (WCAG 2.5.8) without growing the chip.
              className="text-foreground-muted hover:bg-background-subtle hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background relative rounded-sm p-0.5 outline-none before:absolute before:-inset-1.5 before:content-[''] focus-visible:ring-2 focus-visible:ring-offset-1"
              aria-label={formatString(strings.tagInput.remove, { tag: t })}
            >
              <X className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={fieldId}
          value={draft}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => {
            if (draft) {
              commit(draft);
              setDraft('');
            }
          }}
          placeholder={tags.length === 0 ? placeholder : undefined}
          // Unlabelled field: fall back to the placeholder. A consumer `id`
          // implies an external <label htmlFor>.
          aria-label={ariaLabel ?? (label || id ? undefined : placeholder)}
          aria-invalid={isError || undefined}
          aria-describedby={describedBy}
          className="placeholder:text-foreground-subtle min-w-[8ch] flex-1 bg-transparent text-lg outline-none md:text-sm"
        />
      </div>
      {hasErrorMessage ? (
        <p id={errorId} className="text-danger-text text-xs">
          {error}
        </p>
      ) : description ? (
        <p id={helperId} className="text-foreground-subtle text-xs">
          {description}
        </p>
      ) : null}
    </div>
  );
});
TagInput.displayName = 'TagInput';

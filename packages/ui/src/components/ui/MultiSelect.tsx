'use client';

import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown, X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { formatString } from '@/lib/strings';
import { useFieldIds } from '@/hooks/use-field-ids';

export interface MultiSelectOption {
  /** Stable, unique value submitted in `onChange`. */
  value: string;
  /** Visible label shown both in the menu and in the selected chip. */
  label: string;
  /** Optional secondary text shown after the label in the menu. */
  description?: string;
  /** Disable selecting this option. */
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** All possible options. */
  options: MultiSelectOption[];
  /** Currently selected values. Controlled. */
  value: string[];
  /** Called whenever the selection changes. */
  onChange: (next: string[]) => void;
  /** Visible label above the field. */
  label?: ReactNode;
  /** Hint below the field. Hidden when `error` is set. */
  helperText?: ReactNode;
  /** Validation message. */
  error?: ReactNode;
  /** Empty-state placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Text shown when no options match the search. */
  emptyText?: string;
  /** Max number of chips rendered inline; remainder shown as "+N more". */
  maxVisibleChips?: number;
  /** Whether the user can clear all selections with a single click. */
  clearable?: boolean;
  /** Disable the entire field. */
  disabled?: boolean;
  /** Consumer-supplied id for the search input (label association). */
  id?: string;
  className?: string;
}

/**
 * Chip-based multi-select with a searchable menu (cmdk under the hood).
 *
 * Keyboard:
 *   - Backspace on the input with empty query removes the last chip
 *   - ArrowUp / ArrowDown move the highlight, Enter toggles the highlighted option
 *   - Escape closes the menu
 *
 * @example Tag picker
 *   <MultiSelect label="Tags"
 *                options={tags}
 *                value={selected}
 *                onChange={setSelected}
 *                placeholder="Pick tags" />
 *
 * @example Bounded with overflow chip
 *   <MultiSelect options={users}
 *                value={value}
 *                onChange={setValue}
 *                maxVisibleChips={3} />
 *
 * @do Cap `maxVisibleChips` (3–5) on narrow surfaces so the field doesn't
 *      reflow as the user adds selections.
 * @dont Use MultiSelect for fewer than ~6 options. CheckboxGroup is clearer.
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(function MultiSelect(
  {
    options,
    value,
    onChange,
    label,
    helperText,
    error,
    placeholder: placeholderProp,
    emptyText: emptyTextProp,
    maxVisibleChips = 3,
    clearable = true,
    disabled,
    id,
    className,
  },
  ref,
) {
  const strings = useStrings();
  const placeholder = placeholderProp ?? strings.multiSelect.placeholder;
  const emptyText = emptyTextProp ?? strings.multiSelect.empty;
  const isError = Boolean(error);
  const { fieldId, helperId, errorId, describedBy } = useFieldIds(id, {
    hasHelper: Boolean(helperText),
    hasError: isError,
  });

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  // cmdk assigns its own id to the list (ours is ignored), so read it back
  // from the node once the portal mounts to keep aria-controls truthful.
  const [listId, setListId] = useState<string | undefined>(undefined);
  const listRef = useCallback((el: HTMLDivElement | null) => setListId(el?.id), []);

  const selected = useMemo(() => options.filter((o) => value.includes(o.value)), [options, value]);

  const toggle = useCallback(
    (v: string) => {
      if (value.includes(v)) onChange(value.filter((x) => x !== v));
      else onChange([...value, v]);
    },
    [value, onChange],
  );

  const clear = useCallback(() => onChange([]), [onChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && query === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !open) {
      setOpen(true);
    }
  };

  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  const visibleChips = selected.slice(0, maxVisibleChips);
  const overflow = selected.length - visibleChips.length;

  return (
    // min-w-0: as a grid or flex child the trigger's chips would otherwise
    // set a min-content width and push the field past its column.
    <div ref={ref} className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      {label && (
        <label
          id={`${fieldId}-label`}
          htmlFor={fieldId}
          className="text-foreground text-sm font-medium"
        >
          {label}
        </label>
      )}

      {/* The Command root wraps the whole field so cmdk's root keydown handler
          (ArrowUp/Down/Enter) sees the input even though the list is portaled.
          A plain <input> is used instead of Command.Input because cmdk forces
          its own id / aria-* on that element, breaking the label association. */}
      <CommandPrimitive shouldFilter={false} className="flex w-full flex-col">
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Anchor asChild>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- click-to-focus wrapper; the <input role="combobox"> inside owns keyboard handling */}
            <div
              ref={fieldRef}
              aria-disabled={disabled || undefined}
              className={cn(
                'bg-card flex h-9 w-full cursor-text items-center gap-1.5 overflow-hidden rounded-md border px-2 py-1 text-sm',
                'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
                'focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
                isError
                  ? 'border-danger focus-within:border-danger focus-within:ring-danger'
                  : 'border-border-input focus-within:border-accent focus-within:ring-ring',
                disabled && 'pointer-events-none opacity-50',
              )}
              onClick={() => {
                inputRef.current?.focus();
                if (!disabled) setOpen(true);
              }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
                {visibleChips.map((opt) => (
                  <span
                    key={opt.value}
                    className="bg-accent-soft text-on-accent-soft inline-flex max-w-[10rem] shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium"
                  >
                    <span className="truncate" title={opt.label}>
                      {opt.label}
                    </span>
                    <button
                      type="button"
                      aria-label={formatString(strings.multiSelect.remove, { label: opt.label })}
                      className="text-on-accent-soft hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background relative inline-flex items-center rounded-sm outline-none before:absolute before:-inset-1.5 before:content-[''] focus-visible:ring-2 focus-visible:ring-offset-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(opt.value);
                      }}
                    >
                      <X className="size-3" aria-hidden />
                    </button>
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="bg-background-muted text-foreground-muted shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium">
                    +{overflow}
                  </span>
                )}
                <input
                  ref={inputRef}
                  id={fieldId}
                  type="text"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder={visibleChips.length === 0 ? placeholder : undefined}
                  role="combobox"
                  aria-expanded={open}
                  aria-controls={open ? listId : undefined}
                  aria-haspopup="listbox"
                  aria-autocomplete="list"
                  // Unlabelled field: name the input after the placeholder. A
                  // consumer `id` implies an external <label htmlFor>.
                  aria-labelledby={label ? `${fieldId}-label` : undefined}
                  aria-label={label || id ? undefined : placeholder}
                  aria-invalid={isError || undefined}
                  aria-describedby={describedBy}
                  className="placeholder:text-foreground-subtle min-w-[6ch] flex-1 bg-transparent text-lg outline-none md:text-sm"
                  disabled={disabled}
                />
              </div>
              <span className="flex shrink-0 items-center gap-1 pl-1">
                {clearable && selected.length > 0 && (
                  <button
                    type="button"
                    aria-label={strings.multiSelect.clearAll}
                    onClick={(e) => {
                      e.stopPropagation();
                      clear();
                    }}
                    className="text-foreground-subtle hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex size-6 shrink-0 items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                )}
                <ChevronsUpDown className="text-foreground-subtle size-4" aria-hidden />
              </span>
            </div>
          </PopoverPrimitive.Anchor>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              sideOffset={4}
              // Radix gives the content role="dialog"; a dialog needs a name.
              aria-label={strings.command.suggestions}
              className={cn(
                'border-border bg-popover text-popover-foreground z-[var(--z-popover)] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border shadow-md',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              )}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => {
                // Clicks inside the anchor (chips, clear) must not close the menu.
                const target = e.target as Node | null;
                if (target && fieldRef.current?.contains(target)) e.preventDefault();
              }}
            >
              <CommandPrimitive.List
                ref={listRef}
                label={strings.command.suggestions}
                className="max-h-64 overflow-y-auto p-1"
              >
                {filtered.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <CommandPrimitive.Item
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      onSelect={() => toggle(opt.value)}
                      className={cn(
                        'text-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
                        'data-[selected=true]:bg-background-muted',
                        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'flex size-4 items-center justify-center rounded-sm border',
                          isSelected
                            ? 'border-accent bg-accent text-on-accent'
                            : 'border-border-input',
                        )}
                      >
                        {isSelected && <Check className="size-3" aria-hidden />}
                      </span>
                      <span className="flex-1">{opt.label}</span>
                      {opt.description && (
                        <span className="text-foreground-subtle text-xs">{opt.description}</span>
                      )}
                    </CommandPrimitive.Item>
                  );
                })}
                {filtered.length === 0 && (
                  <CommandPrimitive.Empty className="text-foreground-subtle px-2 py-6 text-center text-sm">
                    {emptyText}
                  </CommandPrimitive.Empty>
                )}
              </CommandPrimitive.List>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </CommandPrimitive>

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

MultiSelect.displayName = 'MultiSelect';

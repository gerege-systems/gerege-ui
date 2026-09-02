'use client';

import {
  forwardRef,
  useRef,
  useState,
  type ComponentProps,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { Eye, EyeOff, Search, X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { cva, type VariantProps } from '@/lib/cva';
import { useFieldIds } from '@/hooks/use-field-ids';

/* -----------------------------------------------------------------------------
 *  Field-shell variants. The inner <input> is unstyled background and gets all
 *  its visual treatment from this wrapper so prefix / suffix / clear slots
 *  share the same border + focus state with no double rings.
 * --------------------------------------------------------------------------- */
const field = cva(
  [
    'group inline-flex items-center w-full',
    'rounded-md border border-border-input bg-card text-sm',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]',
    'has-disabled:opacity-50 has-disabled:pointer-events-none',
    'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-background',
    // Invalid state comes from the input's aria-invalid so Form wiring needs no extra prop.
    'has-aria-invalid:border-danger has-aria-invalid:focus-within:border-danger has-aria-invalid:focus-within:ring-danger',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 gap-1.5',
        md: 'h-9 px-3 gap-2',
        lg: 'h-10 px-3.5 gap-2',
      },
      tone: {
        default: 'focus-within:border-accent focus-within:ring-ring',
        error: 'border-danger focus-within:border-danger focus-within:ring-danger',
      },
    },
    defaultVariants: {
      size: 'md',
      tone: 'default',
    },
  },
);

const innerInput = cva([
  'flex-1 min-w-0 bg-transparent outline-none',
  // Fill the field's height so the focusable target is the full control
  // (32/36/40px), not the ~20px text box. Below 24px axe's target-size
  // rule only passes while nothing sits close by, which is a trap for
  // consumers packing a toolbar.
  'self-stretch',
  'placeholder:text-foreground-subtle',
  'text-foreground',
  // 16px below md so iOS Safari does not zoom the page on focus; --text-lg = 1rem.
  'text-lg md:text-sm',
  'disabled:cursor-not-allowed',
  // `type="search"` draws a native clear button in WebKit/Chromium. We render
  // our own via `clearable`, so suppress the native one or both show at once.
  '[&::-webkit-search-cancel-button]:appearance-none',
  '[&::-webkit-search-decoration]:appearance-none',
]);

type InputType = NonNullable<InputHTMLAttributes<HTMLInputElement>['type']>;

// Inline clear / password buttons: 24px box (WCAG 2.5.8 minimum) with a halo
// that extends the hit area without growing the field.
const innerButton = cn(
  'text-foreground-subtle hover:text-foreground relative -m-1 flex size-6 shrink-0 items-center justify-center rounded-sm',
  'before:absolute before:-inset-0.5 before:content-[""]',
  'focus-visible:ring-ring focus-visible:ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'disabled:pointer-events-none',
);

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'value'>,
    VariantProps<typeof field> {
  /** Controlled value. `null` is treated as an empty controlled value (no React warning). */
  value?: InputHTMLAttributes<HTMLInputElement>['value'] | null;
  /** Field type. `password` enables a show/hide toggle; `search` adds a clear button. */
  type?: InputType;
  /** Visible label rendered above the input. */
  label?: ReactNode;
  /** Hint below the input. Hidden while `error` is set. */
  helperText?: ReactNode;
  /** Validation message. Renders in `danger` colour and sets `aria-invalid`. */
  error?: ReactNode;
  /** Content rendered inside the field, before the input — icon or short text. */
  prefix?: ReactNode;
  /** Content rendered inside the field, after the input. */
  suffix?: ReactNode;
  /** Show an inline clear (×) button when the input has a value. */
  clearable?: boolean;
  /**
   * Fires when the clear button is pressed. Controlled inputs own their state
   * and should reset `value` here; uncontrolled inputs are cleared for you.
   */
  onClear?: () => void;
  /** Visually conceal the label while keeping it for screen readers. */
  hideLabel?: boolean;
}

/**
 * Text-style input with optional label, helper / error, prefix / suffix,
 * clear, and password show-hide. Wraps a single native `<input>` so it works
 * with `react-hook-form` and any controlled / uncontrolled pattern.
 *
 * @example Email with helper
 *   <Input type="email" label="Work email" helperText="We never share this." />
 *
 * @example Password with show/hide
 *   <Input type="password" label="Password" autoComplete="current-password" />
 *
 * @example Search with clear
 *   <Input type="search" placeholder="Search…" value={q} onChange={…}
 *          clearable onClear={() => setQ('')} />
 *
 * @do Always pair an input with a visible label. If space forces hiding it,
 *      use `hideLabel` so the label stays in the accessibility tree.
 * @dont Use placeholder as the only label — placeholders disappear on input
 *       and fail accessibility.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    type = 'text',
    size,
    tone,
    label,
    helperText,
    error,
    prefix,
    suffix,
    clearable,
    onClear,
    hideLabel,
    id,
    disabled,
    value: valueProp,
    defaultValue,
    onInput,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    ...props
  },
  ref,
) {
  const strings = useStrings();
  const isError = Boolean(error) || ariaInvalid === true || ariaInvalid === 'true';
  const { fieldId, helperId, errorId, describedBy } = useFieldIds(id, {
    hasHelper: Boolean(helperText),
    hasError: Boolean(error),
    extra: ariaDescribedby,
  });
  // `null` (nullable form state) is a controlled empty value, not "uncontrolled".
  const value = valueProp === null ? '' : valueProp;
  const innerRef = useRef<HTMLInputElement | null>(null);
  const setRefs = (el: HTMLInputElement | null) => {
    innerRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  const [showPassword, setShowPassword] = useState(false);
  const effectiveType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const effectiveTone = isError ? 'error' : tone;

  // Pre-fill prefix slot for search type.
  const renderedPrefix =
    prefix ??
    (type === 'search' ? <Search className="text-foreground-subtle size-4" aria-hidden /> : null);

  // Track the value of uncontrolled inputs so `clearable` can show/hide the
  // button without the consumer wiring state.
  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = useState<string>(
    defaultValue === undefined || defaultValue === null ? '' : String(defaultValue),
  );
  const current = isControlled ? value : localValue;
  const hasValue = current !== undefined && current !== '' && current !== null;

  // React 19 types `onInput` as `InputEventHandler`; `ComponentProps` keeps this portable.
  const handleInput: NonNullable<ComponentProps<'input'>['onInput']> = (e) => {
    if (!isControlled) setLocalValue(e.currentTarget.value);
    onInput?.(e);
  };

  const handleClear = () => {
    if (!isControlled && innerRef.current) {
      // Use the native setter so React's onChange/onInput listeners fire.
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(innerRef.current, '');
      innerRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      setLocalValue('');
    }
    onClear?.();
    innerRef.current?.focus();
  };

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn('text-foreground text-sm font-medium', hideLabel && 'sr-only')}
        >
          {label}
        </label>
      )}

      <div data-slot="input-field" className={cn(field({ size, tone: effectiveTone }))}>
        {renderedPrefix && (
          <span className="text-foreground-subtle flex items-center [&_svg]:size-4">
            {renderedPrefix}
          </span>
        )}

        <input
          ref={setRefs}
          id={fieldId}
          type={effectiveType}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onInput={handleInput}
          aria-invalid={isError ? true : ariaInvalid}
          aria-describedby={describedBy}
          className={cn(innerInput())}
          {...props}
        />

        {clearable && hasValue && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
            aria-label={strings.input.clear}
            className={innerButton}
          >
            <X className="size-4" aria-hidden />
          </button>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
            aria-label={showPassword ? strings.input.hidePassword : strings.input.showPassword}
            aria-pressed={showPassword}
            className={innerButton}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        )}

        {suffix && (
          <span className="text-foreground-subtle flex items-center [&_svg]:size-4">{suffix}</span>
        )}
      </div>

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

Input.displayName = 'Input';

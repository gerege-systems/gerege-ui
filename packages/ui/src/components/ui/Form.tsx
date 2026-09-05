'use client';

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type FormProviderProps,
} from 'react-hook-form';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 *  react-hook-form bindings + accessible label / description / error wiring.
 *
 *  Usage:
 *    const form = useForm<Values>(…);
 *    <Form {...form}>
 *      <FormField
 *        control={form.control}
 *        name="email"
 *        render={({ field }) => (
 *          <FormItem>
 *            <FormLabel>Email</FormLabel>
 *            <FormControl><Input type="email" {...field} /></FormControl>
 *            <FormDescription>We never share this.</FormDescription>
 *            <FormError />
 *          </FormItem>
 *        )}
 *      />
 *    </Form>
 *
 *  Ids: `<item>-item` (control), `<item>-desc`, `<item>-error` — the same
 *  `-desc` / `-error` suffixes the standalone fields use (useFieldIds).
 *  Invalid styling is driven purely by `aria-invalid` on the control; no
 *  `aria-invalid` is set on the control; style from `aria-invalid:` (no `tone` injection).
 * --------------------------------------------------------------------------- */

function collectMessages(errors: FieldErrors | undefined, out: string[] = []): string[] {
  if (!errors) return out;
  for (const value of Object.values(errors)) {
    if (!value || typeof value !== 'object') continue;
    const message = (value as { message?: unknown }).message;
    if (typeof message === 'string' && message) out.push(message);
    else if (!('type' in value)) collectMessages(value as FieldErrors, out);
  }
  return out;
}

/**
 * Single polite live region per form. Field-level `FormError` elements are
 * plain text wired via `aria-describedby`; this region announces the current
 * error set once instead of one `role="alert"` per field firing in parallel.
 */
function FormLiveRegion() {
  const { formState } = useFormContext();
  const messages = collectMessages(formState.errors);
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {messages.join('. ')}
    </div>
  );
}

/**
 * Form context provider. Spread the `useForm()` return value into it, exactly
 * like react-hook-form's `FormProvider` — plus one shared live region for
 * validation announcements.
 */
export function Form<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({ children, ...form }: FormProviderProps<TFieldValues, TContext, TTransformedValues>) {
  return (
    <FormProvider {...form}>
      {children}
      <FormLiveRegion />
    </FormProvider>
  );
}
Form.displayName = 'Form';

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name as string }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

interface FormItemContextValue {
  id: string;
  /** Whether a <FormDescription> is rendered — drives aria-describedby. */
  hasDescription: boolean;
}
const FormItemContext = createContext<FormItemContextValue | null>(null);

export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  if (!fieldContext) {
    throw new Error('useFormField must be used inside <FormField>');
  }
  const fieldState = getFieldState(fieldContext.name, formState);
  const id = itemContext?.id ?? '';
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-item`,
    formDescriptionId: `${id}-desc`,
    formMessageId: `${id}-error`,
    hasDescription: itemContext?.hasDescription ?? false,
    ...fieldState,
  };
}

/** Synchronous scan for a <FormDescription> among the item's children (through fragments / host elements). */
function containsDescription(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    if (child.type === FormDescription) return true;
    const nested = (child.props as { children?: ReactNode }).children;
    // Only descend into host elements / fragments — custom components own their subtree.
    return (typeof child.type === 'string' || typeof child.type === 'symbol') && nested
      ? containsDescription(nested)
      : false;
  });
}

export const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function FormItem({ className, children, ...props }, ref) {
    const id = useId();
    // Derived during render (no effect → no second pass / hydration flip).
    const hasDescription = containsDescription(children);
    return (
      <FormItemContext.Provider value={{ id, hasDescription }}>
        <div ref={ref} className={cn('flex flex-col gap-1.5', className)} {...props}>
          {children}
        </div>
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

export const FormLabel = forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function FormLabel({ className, ...props }, ref) {
  const { formItemId, error } = useFormField();
  return (
    <LabelPrimitive.Root
      ref={ref}
      htmlFor={formItemId}
      className={cn('text-foreground text-sm font-medium', error && 'text-danger-text', className)}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

export const FormControl = forwardRef<HTMLElement, React.ComponentPropsWithoutRef<typeof Slot>>(
  function FormControl(props, ref) {
    const { error, formItemId, formDescriptionId, formMessageId, hasDescription } = useFormField();
    // Only reference ids that actually render: the description when mounted,
    // the message only while there is an error (FormError returns null otherwise).
    const describedBy =
      [hasDescription ? formDescriptionId : null, error ? formMessageId : null]
        .filter(Boolean)
        .join(' ') || undefined;
    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = 'FormControl';

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function FormDescription({ className, ...props }, ref) {
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-foreground-subtle text-xs', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

/**
 * Field-level validation message. Not a live region on its own — it is
 * referenced from the control via `aria-describedby`, and the form's single
 * live region announces changes.
 */
export const FormError = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function FormError({ className, children, ...props }, ref) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? '') : children;
    if (!body) return null;
    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn('text-danger-text text-xs', className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormError.displayName = 'FormError';

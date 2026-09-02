'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type Dispatch,
  type ElementRef,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

/* -----------------------------------------------------------------------------
 *  CommandPalette is a Dialog hosting a `cmdk` Command. It supports grouped
 *  items, keyboard navigation (handled by cmdk), an empty state, and a
 *  pluggable list of "recent" items shown when the search input is empty.
 * --------------------------------------------------------------------------- */

export const Command = forwardRef<
  ElementRef<typeof CommandPrimitive>,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(function Command({ className, ...props }, ref) {
  return (
    <CommandPrimitive
      data-slot="command"
      ref={ref}
      className={cn(
        'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-lg',
        className,
      )}
      {...props}
    />
  );
});
Command.displayName = 'Command';

export const CommandInput = forwardRef<
  ElementRef<typeof CommandPrimitive.Input>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(function CommandInput({ className, ...props }, ref) {
  return (
    <div className="border-border flex items-center gap-2 border-b px-3" cmdk-input-wrapper="">
      <Search className="text-foreground-subtle size-4 shrink-0" aria-hidden />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          'flex h-11 w-full bg-transparent py-3 text-lg outline-none md:text-sm',
          'placeholder:text-foreground-subtle disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = 'CommandInput';

export const CommandList = forwardRef<
  ElementRef<typeof CommandPrimitive.List>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(function CommandList({ className, label, ...props }, ref) {
  const strings = useStrings();
  return (
    <CommandPrimitive.List
      ref={ref}
      label={label ?? strings.command.suggestions}
      className={cn('max-h-[320px] overflow-y-auto p-1', className)}
      {...props}
    />
  );
});
CommandList.displayName = 'CommandList';

export const CommandEmpty = forwardRef<
  ElementRef<typeof CommandPrimitive.Empty>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(function CommandEmpty({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      className={cn('text-foreground-subtle py-8 text-center text-sm', className)}
      {...props}
    />
  );
});
CommandEmpty.displayName = 'CommandEmpty';

export const CommandGroup = forwardRef<
  ElementRef<typeof CommandPrimitive.Group>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(function CommandGroup({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        'text-foreground overflow-hidden p-1',
        '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5',
        '[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
        '[&_[cmdk-group-heading]]:text-foreground-subtle',
        className,
      )}
      {...props}
    />
  );
});
CommandGroup.displayName = 'CommandGroup';

export const CommandSeparator = forwardRef<
  ElementRef<typeof CommandPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(function CommandSeparator({ className, ...props }, ref) {
  // cmdk hard-codes role="separator", which is not a permitted child of the
  // listbox. asChild lets the child's role win: the divider is purely visual.
  return (
    <CommandPrimitive.Separator ref={ref} asChild {...props}>
      <div role="none" className={cn('bg-border -mx-1 my-1 h-px', className)} />
    </CommandPrimitive.Separator>
  );
});
CommandSeparator.displayName = 'CommandSeparator';

export const CommandItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(function CommandItem({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        'text-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none',
        'data-[selected=true]:bg-background-muted data-[selected=true]:text-foreground',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
        '[&_svg]:text-foreground-subtle [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
});
CommandItem.displayName = 'CommandItem';

export function CommandShortcut({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-foreground-subtle ml-auto inline-flex items-center gap-0.5 font-mono text-xs tracking-widest',
        className,
      )}
    >
      {children}
    </span>
  );
}
CommandShortcut.displayName = 'CommandShortcut';

/* -----------------------------------------------------------------------------
 *  Dialog wrapper — a ready-to-use ⌘K palette.
 * --------------------------------------------------------------------------- */

export interface CommandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Visible label for screen readers. */
  title?: string;
}

export function CommandDialog({ open, onOpenChange, children, title }: CommandDialogProps) {
  const strings = useStrings();
  // The palette has no DialogTrigger (⌘K / any button opens it), so Radix has
  // no trigger to return focus to and would drop it on <body>. Remember what
  // was focused when the dialog opened and restore it on close.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'bg-overlay fixed inset-0 z-[var(--z-overlay)]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
          )}
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            returnFocusRef.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
            returnFocusRef.current = null;
          }}
          className={cn(
            'fixed top-[20%] left-1/2 z-[var(--z-modal)] -translate-x-1/2',
            'w-[calc(100%-2rem)] max-w-[640px] overflow-hidden',
            'border-border bg-popover text-popover-foreground rounded-lg border shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
            'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {title ?? strings.commandDialog.title}
          </DialogPrimitive.Title>
          <Command>{children}</Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * Hook that wires ⌘K / Ctrl+K to a setter — the canonical way to mount the
 * palette in an app shell.
 *
 * @example
 *   const [open, setOpen] = useState(false);
 *   useCommandPaletteShortcut(setOpen);
 *   …
 *   <CommandDialog open={open} onOpenChange={setOpen}>
 *     <CommandInput placeholder="Type a command…" />
 *     <CommandList>
 *       <CommandEmpty>No results.</CommandEmpty>
 *       <CommandGroup heading="Suggestions">
 *         <CommandItem>Create project</CommandItem>
 *         <CommandItem>Invite teammate</CommandItem>
 *       </CommandGroup>
 *     </CommandList>
 *   </CommandDialog>
 *
 * @do Group items by category. Show "Recent" first when the query is empty.
 * @dont Hide essential actions behind the palette only — keep at least one
 *       button entry in the UI.
 */
export function useCommandPaletteShortcut(setOpen: Dispatch<SetStateAction<boolean>>): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey) && !e.altKey) {
        e.preventDefault();
        // Functional update: ⌘K toggles without the hook tracking open state.
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);
}

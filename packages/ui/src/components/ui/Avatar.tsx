'use client';

import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { formatString } from '@/lib/strings';
import { cva, type VariantProps } from '@/lib/cva';

const sizeMap = {
  xs: 'size-5 text-xs',
  sm: 'size-6 text-xs',
  md: 'size-8 text-xs',
  lg: 'size-10 text-sm',
  xl: 'size-12 text-base',
} as const;

// The wrapper sets size — Root sits inside and clips image/fallback only.
const avatarWrapper = cva('relative inline-flex shrink-0', {
  variants: { size: sizeMap },
  defaultVariants: { size: 'md' },
});

export interface AvatarProps
  extends
    ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarWrapper> {
  /** Image URL. If absent or fails to load, fallback initials are shown. */
  src?: string;
  /** Alt text for the image; falls back to fallback when there's no `src`. */
  alt?: string;
  /** Initials shown when image is missing or loading. Pass at most 2 characters. */
  fallback?: string;
  /** Status dot rendered on the bottom-right. */
  status?: 'online' | 'busy' | 'away' | 'offline';
}

const statusColour: Record<NonNullable<AvatarProps['status']>, string> = {
  online: 'bg-success',
  busy: 'bg-danger',
  away: 'bg-warning',
  offline: 'bg-foreground-subtle',
};

/**
 * Avatar with image, initials fallback, and optional status dot.
 *
 * @example
 *   <Avatar src={user.photo} alt={user.name} fallback={getInitials(user.name)} status="online" />
 *
 * @example AvatarGroup
 *   <AvatarGroup max={3}>
 *     {users.map(u => <Avatar key={u.id} src={u.photo} fallback={getInitials(u.name)} />)}
 *   </AvatarGroup>
 *
 * @do Provide `alt` for image avatars and meaningful initials for the
 *      fallback so screen readers announce something useful.
 * @dont Use the status dot without a tooltip explaining what it means.
 */
export const Avatar = forwardRef<ComponentRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  function Avatar({ className, size, src, alt, fallback, status, ...props }, ref) {
    const strings = useStrings();
    return (
      <span className={cn(avatarWrapper({ size }), className)}>
        <AvatarPrimitive.Root
          data-slot="avatar"
          ref={ref}
          className="bg-background-muted text-foreground-muted block size-full overflow-hidden rounded-full"
          {...props}
        >
          {src && (
            <AvatarPrimitive.Image
              src={src}
              alt={alt ?? ''}
              className="aspect-square size-full object-cover"
            />
          )}
          <AvatarPrimitive.Fallback
            delayMs={src ? 200 : 0}
            className="bg-background-muted flex size-full items-center justify-center font-medium uppercase"
          >
            {fallback ?? '?'}
          </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
        {status && (
          <span
            role="img"
            aria-label={formatString(strings.avatar.status, { status })}
            className={cn(
              'ring-background absolute right-0 bottom-0 block size-[28%] rounded-full ring-2',
              statusColour[status],
            )}
          />
        )}
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum visible avatars before showing a "+N" overflow chip. */
  max?: number;
  /** Avatar size applied to children (unless a child sets its own) + overflow. */
  size?: keyof typeof sizeMap;
  /** Children — Avatars. */
  children: ReactNode;
}

/**
 * Overlapping avatars with overflow indicator. Pass plain `<Avatar>` children.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max = 4, size = 'md', className, children, ...props },
  ref,
) {
  const strings = useStrings();
  const items = Children.toArray(children);
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <div ref={ref} className={cn('flex items-center -space-x-2', className)} {...props}>
      {visible.map((child, i) => (
        <div key={i} className="ring-background rounded-full ring-2">
          {isValidElement<AvatarProps>(child) && child.props.size === undefined
            ? cloneElement(child, { size })
            : child}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            'bg-background-muted text-foreground-muted ring-background inline-flex items-center justify-center rounded-full ring-2',
            sizeMap[size],
            'font-medium',
          )}
          aria-label={formatString(strings.avatar.more, { n: overflow })}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
});
AvatarGroup.displayName = 'AvatarGroup';

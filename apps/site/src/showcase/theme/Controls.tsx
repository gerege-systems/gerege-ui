import { Check, ChevronDown, Moon, Sun } from '@/icons';
import { IconButton } from '@/components/ui/IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import { BRANDS } from '../site.config';
import { useTheme } from './theme-context';

/** Lucide `monitor` outline — not in the library's curated icon set, so drawn inline. */
export function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

export const THEME_LABEL = { light: 'Light', dark: 'Dark', system: 'System' } as const;
export const NEXT_THEME = { light: 'dark', dark: 'system', system: 'light' } as const;

/** Theme cycle (light → dark → system) — shares the same look in the top bar and the preview chrome. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <IconButton
      aria-label={`Theme: ${THEME_LABEL[theme]}. Switch to ${THEME_LABEL[NEXT_THEME[theme]].toLowerCase()}`}
      icon={theme === 'light' ? <Sun /> : theme === 'dark' ? <Moon /> : <MonitorIcon />}
      size="sm"
      variant="ghost"
      onClick={toggleTheme}
      className={className}
    />
  );
}

/** Coloured dot used in the brand menu + trigger. A plain CSS colour so it
 *  always reads correctly regardless of the active brand tokens. */
function Swatch({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-3 shrink-0 rounded-full ring-1 ring-black/10 ring-inset',
        className,
      )}
      style={{ backgroundColor: color }}
    />
  );
}

/**
 * On-page brand-code switcher. Re-themes the whole site live (including
 * portalled overlays and any open template-preview tab) by writing the chosen
 * preset's CSS variables to <html>.
 */
export function BrandSwitcher({ compact = false }: { compact?: boolean }) {
  const { brand, setBrand } = useTheme();
  const active = BRANDS.find((b) => b.name === brand) ?? BRANDS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'border-border bg-card text-foreground-muted hover:bg-background-muted hover:text-foreground inline-flex h-8 items-center gap-2 rounded-md border px-2.5 text-sm transition-colors',
          )}
          aria-label={`Accent colour: ${active.label}`}
        >
          <Swatch color={active.swatch} />
          {!compact && <span className="hidden lg:inline">{active.label}</span>}
          <ChevronDown className="size-3.5 opacity-60" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Accent colour</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {BRANDS.map((b) => (
          <DropdownMenuItem
            key={b.name}
            onSelect={() => setBrand(b.name)}
            className="flex items-start gap-2.5"
          >
            <Swatch color={b.swatch} className="mt-0.5" />
            <span className="flex min-w-0 flex-col">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                {b.label}
                {b.name === brand && <Check className="text-accent size-3.5" aria-hidden />}
              </span>
              <span className="text-foreground-subtle text-xs">{b.description}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

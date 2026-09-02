import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils';
import { AlertTriangle, Check } from '@/icons';
import {
  ACCENT_PRESETS,
  DEFAULT_STATE,
  MAX_CHROMA,
  accentContrast,
  hexToOklch,
  oklchToHex,
  radiusScale,
  type ThemeState,
} from './editor-model';
import { BASE_COLORS, CHART_PALETTES, STYLES, findPreset, type NamedPreset } from './presets';
import { FONTS, MONO_FONTS, findFont, type FontChoice } from './fonts';

const HUES = Array.from({ length: 12 }, (_, i) => i * 30);
const RADII: { value: number; label: string }[] = [
  { value: 0, label: 'None' },
  { value: 4, label: 'Small' },
  { value: 6, label: 'Medium' },
  { value: 10, label: 'Large' },
  { value: 9999, label: 'Full' },
];

interface Props {
  state: ThemeState;
  onChange: (patch: Partial<ThemeState>) => void;
  onReset: () => void;
  changed: number;
}

/**
 * The rail: four named dropdowns that each move a whole group of tokens, then
 * the fine-tune controls under them. Everything writes into the shared state,
 * so the wall and the Get code snippet can never disagree.
 */
export function ThemeControls({ state, onChange, onReset, changed }: Props) {
  const hex = oklchToHex(state.lightness, state.chroma, state.hue);
  const light = accentContrast(state, 'light');
  const dark = accentContrast(state, 'dark');
  const styleRadius = radiusScale(state.radius ?? 6);
  const activeAccent = ACCENT_PRESETS.find(
    (p) => p.l === state.lightness && p.c === state.chroma && p.h === state.hue,
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Sticks to the top of the panel's own scrollport (hence the negative
          offsets, which bleed it out to the panel's padding edges) so the
          token count and Reset stay reachable while the rail is scrolled. */}
      <div className="bg-card border-border sticky -top-5 z-10 -mx-5 -mt-5 flex items-center gap-2 border-b px-5 pt-5 pb-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="text-sm font-semibold">Customise</h2>
          <p className="text-foreground-subtle text-xs">
            {changed === 0
              ? 'Library defaults'
              : `${changed} token${changed === 1 ? '' : 's'} changed`}
          </p>
        </div>
        <span className="grow" />
        {changed > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>

      <PresetSelect
        label="Style"
        list={STYLES}
        value={state.style}
        onValue={(v) => onChange({ style: v, radius: null })}
        preview={(p) => (
          // A radius square, not a colour dot: Style moves shape and type only.
          <span
            aria-hidden
            className="border-foreground-subtle size-4 border-2"
            style={{ borderRadius: p.swatch }}
          />
        )}
      />

      <PresetSelect
        label="Base Color"
        list={BASE_COLORS}
        value={state.base}
        onValue={(v) => onChange({ base: v })}
      />

      {/* Theme = the accent. A named row plus the fine-tune underneath. */}
      <div className="flex flex-col gap-2.5">
        <Row
          label="Theme"
          value={activeAccent?.label ?? 'Custom'}
          hint={activeAccent?.hint ?? 'Custom values'}
          swatch={hex}
        >
          <div className="grid grid-cols-3 gap-2">
            {ACCENT_PRESETS.map((p) => {
              const active = activeAccent?.name === p.name;
              return (
                <button
                  key={p.name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ lightness: p.l, chroma: p.c, hue: p.h })}
                  className={cn(
                    'focus-visible:ring-ring flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:outline-none',
                    active
                      ? 'border-accent text-foreground font-medium'
                      : 'border-border text-foreground-muted hover:border-border-strong',
                  )}
                >
                  <span
                    aria-hidden
                    className="size-3.5 shrink-0 rounded-full"
                    style={{ background: oklchToHex(p.l, p.c, p.h) }}
                  />
                  <span className="truncate">{p.label}</span>
                </button>
              );
            })}
          </div>
        </Row>

        <div>
          <p className="text-foreground-subtle mb-1.5 text-xs">Hue</p>
          <div className="grid grid-cols-12 gap-1">
            {HUES.map((h) => {
              const active = Math.round(state.hue / 30) * 30 === h;
              return (
                <button
                  key={h}
                  type="button"
                  aria-label={`Hue ${h}°`}
                  aria-pressed={active}
                  onClick={() => onChange({ hue: h })}
                  className={cn(
                    'focus-visible:ring-ring h-5 rounded-sm focus-visible:ring-2 focus-visible:outline-none',
                    active && 'ring-foreground ring-2 ring-offset-2',
                  )}
                  /* Fixed lightness: at the dark end of the L slider several
                     hues clip out of sRGB and the strip stops reading as a hue
                     wheel. Clicking still keeps the chosen L and C. */
                  style={{ background: oklchToHex(0.58, Math.min(state.chroma, 0.16), h) }}
                />
              );
            })}
          </div>
        </div>

        <Slider
          label="Lightness"
          showValue
          min={0.3}
          max={0.8}
          step={0.005}
          value={[state.lightness]}
          onValueChange={([v]) => onChange({ lightness: v })}
          formatValue={(v) => v.toFixed(3)}
        />
        <Slider
          label="Chroma"
          showValue
          min={0}
          max={MAX_CHROMA}
          step={0.005}
          value={[state.chroma]}
          onValueChange={([v]) => onChange({ chroma: v })}
          formatValue={(v) => v.toFixed(3)}
        />
        <Input
          label="HEX"
          value={hex}
          spellCheck={false}
          onChange={(e) => {
            const next = hexToOklch(e.target.value);
            if (next) onChange({ lightness: next[0], chroma: next[1], hue: next[2] });
          }}
          className="font-mono"
        />
        <ContrastLine mode="Light" ratio={light.ratio} passes={light.passes} />
        <ContrastLine mode="Dark" ratio={dark.ratio} passes={dark.passes} />
      </div>

      <PresetSelect
        label="Chart Color"
        list={CHART_PALETTES}
        value={state.chart}
        onValue={(v) => onChange({ chart: v })}
        preview={(p) => (
          <div className="flex gap-1" aria-hidden>
            {['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'chart-6'].map((k) => (
              <span
                key={k}
                className="border-border size-3 rounded-[2px] border"
                style={{ background: p.tokens.light[k] ?? `var(--${k})` }}
              />
            ))}
          </div>
        )}
      />

      <Separator />

      <section className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Radius</h3>
          {state.radius !== null && (
            <span aria-hidden className="bg-accent size-1.5 rounded-full" />
          )}
          <span className="grow" />
          {state.radius !== null && (
            <button
              type="button"
              onClick={() => onChange({ radius: null })}
              className="text-accent focus-visible:ring-ring rounded-sm text-xs focus-visible:ring-2 focus-visible:outline-none"
            >
              Follow style
            </button>
          )}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {RADII.map((r) => (
            <Button
              key={r.value}
              size="sm"
              variant={state.radius === r.value ? 'primary' : 'secondary'}
              onClick={() => onChange({ radius: r.value })}
              aria-pressed={state.radius === r.value}
            >
              {r.label}
            </Button>
          ))}
        </div>
        {state.radius !== null && (
          <p className="text-foreground-subtle text-xs">
            Control {styleRadius.md}px · card {styleRadius.lg}px · modal {styleRadius.xl}px
          </p>
        )}
      </section>

      <Separator />

      <FontSelect
        label="Font"
        list={FONTS}
        value={state.fontSans}
        changed={state.fontSans !== DEFAULT_STATE.fontSans}
        onValue={(v) => onChange({ fontSans: v })}
      />
      <FontSelect
        label="Heading"
        list={FONTS}
        value={state.fontHeading}
        changed={state.fontHeading !== DEFAULT_STATE.fontHeading}
        onValue={(v) => onChange({ fontHeading: v })}
      />
      <FontSelect
        label="Mono"
        list={MONO_FONTS}
        value={state.fontMono}
        changed={state.fontMono !== DEFAULT_STATE.fontMono}
        onValue={(v) => onChange({ fontMono: v })}
      />
    </div>
  );
}

/** A named dropdown with a swatch — Style, Base Color, Chart Color. */
function PresetSelect({
  label,
  list,
  value,
  onValue,
  preview,
}: {
  label: string;
  list: NamedPreset[];
  value: string;
  onValue: (v: string) => void;
  preview?: (p: NamedPreset) => React.ReactNode;
}) {
  const active = findPreset(list, value);
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="grow" />
        {preview ? (
          preview(active)
        ) : (
          <span
            aria-hidden
            className="border-border size-4 rounded-full border"
            style={{ background: active.swatch }}
          />
        )}
      </div>
      <Select value={value} onValueChange={onValue}>
        <SelectTrigger aria-label={label} />
        <SelectContent>
          {list.map((p) => (
            <SelectItem key={p.name} value={p.name}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-foreground-subtle text-xs">{active.hint}</p>
    </section>
  );
}

function Row({
  label,
  value,
  hint,
  swatch,
  children,
}: {
  label: string;
  value: string;
  hint: string;
  swatch: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        <span className="text-foreground-subtle text-xs">{value}</span>
        <span className="grow" />
        <span
          aria-hidden
          className="border-border size-4 rounded-full border"
          style={{ background: swatch }}
        />
      </div>
      {children}
      <p className="text-foreground-subtle text-xs">{hint}</p>
    </div>
  );
}

function ContrastLine({ mode, ratio, passes }: { mode: string; ratio: number; passes: boolean }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-md border px-2.5 py-2 text-xs',
        passes
          ? 'border-success-border bg-success-subtle text-success-foreground'
          : 'border-warning-border bg-warning-subtle text-warning-foreground',
      )}
    >
      {passes ? (
        <Check aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      ) : (
        <AlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      )}
      <span>
        {mode}: button text {ratio.toFixed(2)}:1 —{' '}
        {passes ? 'passes AA (4.5:1)' : 'fails AA (4.5:1)'}
      </span>
    </div>
  );
}

/** A font dropdown that says whether the family covers Cyrillic. */
function FontSelect({
  label,
  list,
  value,
  changed,
  onValue,
}: {
  label: string;
  list: FontChoice[];
  value: string;
  changed: boolean;
  onValue: (v: string) => void;
}) {
  const active = findFont(list, value);
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">{label}</h3>
        {changed && <span aria-hidden className="bg-accent size-1.5 rounded-full" />}
        <span className="grow" />
        <span aria-hidden className="text-lg leading-none" style={{ fontFamily: active.stack }}>
          Aa
        </span>
      </div>
      <Select value={value} onValueChange={onValue}>
        <SelectTrigger aria-label={`${label} font`} />
        <SelectContent>
          {list.map((f) => (
            <SelectItem key={f.name} value={f.name}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-foreground-subtle text-xs">
        {active.cyrillic
          ? 'Covers Cyrillic — Өө Үү render as themselves.'
          : 'No Cyrillic subset: Өө Үү fall back to another face.'}
      </p>
    </section>
  );
}

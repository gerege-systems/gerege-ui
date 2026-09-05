import { useState } from 'react';
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
  PILL,
  accentContrast,
  formatRadius,
  hexToOklch,
  oklchToHex,
  radiusScale,
  styleOwnsRadius,
  type ContrastReport,
  type ThemeState,
} from './editor-model';
import {
  BASE_COLORS,
  CHART_PALETTES,
  DEPTHS,
  STYLES,
  baseRamp,
  findPreset,
  type SwatchOption,
} from './presets';
import { FONTS, MONO_FONTS, findFont, type FontChoice } from './fonts';

const HUES = Array.from({ length: 12 }, (_, i) => i * 30);
const RADII: { value: number; label: string }[] = [
  { value: 0, label: 'None' },
  { value: 4, label: 'Small' },
  { value: 6, label: 'Medium' },
  { value: 10, label: 'Large' },
  { value: PILL, label: 'Full' },
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
  // The field is controlled from state, but a hex is only valid once all six
  // digits are in — so the keystrokes in between live here, or React would
  // snap the field back to the old value after every one.
  const [hexDraft, setHexDraft] = useState<string | null>(null);
  const hexInvalid = hexDraft !== null && hexToOklch(hexDraft) === null;
  const light = accentContrast(state, 'light');
  const dark = accentContrast(state, 'dark');
  const styleRadius = radiusScale(state.radius ?? 6);
  const radiusOwnedByStyle = styleOwnsRadius(state.style);
  const styleName = findPreset(STYLES, state.style).label;
  // Style and Depth move no tokens, so a token count cannot tell whether the
  // rail has been touched — Reset would vanish after changing either one.
  const dirty = (Object.keys(DEFAULT_STATE) as (keyof ThemeState)[]).some(
    (k) => state[k] !== DEFAULT_STATE[k],
  );
  const activeAccent = ACCENT_PRESETS.find(
    (p) => p.l === state.lightness && p.c === state.chroma && p.h === state.hue,
  );
  const accentOptions: SwatchOption[] = ACCENT_PRESETS.map((p) => ({
    name: p.name,
    label: p.label,
    hint: p.hint,
    swatch: oklchToHex(p.l, p.c, p.h),
  }));
  // A hand-tuned accent has no name, and Select needs its value to exist in the
  // list — so the list grows a "Custom" row only while that is the case.
  if (!activeAccent) {
    accentOptions.push({
      name: 'custom',
      label: 'Custom',
      hint: 'Tuned by hand — the controls below own this value.',
      swatch: hex,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Sticks to the top of the panel's own scrollport (hence the negative
          offsets, which bleed it out to the panel's padding edges) so the
          token count and Reset stay reachable while the rail is scrolled. */}
      <div className="bg-card border-border sticky -top-5 z-10 -mx-5 -mt-5 flex items-center gap-2 border-b px-5 pt-5 pb-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="text-sm font-semibold">Customise</h2>
          <p className="text-foreground-subtle text-xs">
            {changed > 0
              ? `${changed} token${changed === 1 ? '' : 's'} changed`
              : dirty
                ? 'Attributes only — no tokens changed'
                : 'Library defaults'}
          </p>
        </div>
        <span className="grow" />
        {dirty && (
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
        preview={(p) => (
          // Three tones, not one dot: these neutrals differ by a couple of
          // percent at the pale end, so a single chip read as "nothing changed".
          <div className="flex gap-1" aria-hidden>
            {baseRamp(p).map((c) => (
              <span
                key={c}
                className="border-border size-3 rounded-full border"
                style={{ background: c }}
              />
            ))}
          </div>
        )}
      />

      {/* The accent. Same dropdown as the other three, then the fine-tune
          underneath for anything the twelve names do not cover. */}
      <div className="flex flex-col gap-2.5">
        <PresetSelect
          label="Accent"
          list={accentOptions}
          value={activeAccent?.name ?? 'custom'}
          onValue={(v) => {
            const p = ACCENT_PRESETS.find((a) => a.name === v);
            if (p) onChange({ lightness: p.l, chroma: p.c, hue: p.h });
          }}
        />

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
          value={hexDraft ?? hex}
          spellCheck={false}
          error={hexInvalid ? 'Six hex digits, e.g. #3e43bb' : undefined}
          onChange={(e) => {
            const v = e.target.value;
            setHexDraft(v);
            const next = hexToOklch(v);
            if (next) onChange({ lightness: next[0], chroma: next[1], hue: next[2] });
          }}
          onBlur={() => setHexDraft(null)}
          className="font-mono"
        />
        <ContrastLine mode="Light" report={light} />
        <ContrastLine mode="Dark" report={dark} />
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
          {state.radius !== null && !radiusOwnedByStyle && (
            <span aria-hidden className="bg-accent size-1.5 rounded-full" />
          )}
          <span className="grow" />
          {state.radius !== null && !radiusOwnedByStyle && (
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
              disabled={radiusOwnedByStyle}
            >
              {r.label}
            </Button>
          ))}
        </div>
        {radiusOwnedByStyle ? (
          <p className="text-foreground-subtle text-xs">
            {styleName} sets its own shape — radius follows the style.
          </p>
        ) : (
          state.radius !== null && (
            <p className="text-foreground-subtle text-xs">
              Control {formatRadius(state.radius === PILL ? PILL : styleRadius.md)} · card{' '}
              {formatRadius(styleRadius.lg)} · modal {formatRadius(styleRadius.xl)}
            </p>
          )
        )}
      </section>

      <PresetSelect
        label="Depth"
        list={DEPTHS}
        value={state.depth}
        onValue={(v) => onChange({ depth: v })}
        preview={(p) => (
          // A card-coloured chip lifted off the rail — a colour dot would say
          // nothing about elevation. The shadow is chip-scale (see presets).
          <span
            aria-hidden
            className="bg-card border-border size-5 rounded-[3px] border"
            style={{ boxShadow: p.swatch }}
          />
        )}
      />

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

/** A named dropdown with a swatch — Style, Base Color, Theme, Chart Color. */
function PresetSelect<T extends SwatchOption>({
  label,
  list,
  value,
  onValue,
  preview,
}: {
  label: string;
  list: T[];
  value: string;
  onValue: (v: string) => void;
  preview?: (p: T) => React.ReactNode;
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

/**
 * The three pairs the library holds every accent to. One line per mode: the
 * failing pairs are named, so the fix (usually lightness) is obvious.
 */
function ContrastLine({ mode, report }: { mode: string; report: ContrastReport }) {
  const failing = report.checks.filter((c) => !c.passes).map((c) => c.label);
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-md border px-2.5 py-2 text-xs',
        report.passes
          ? 'border-success-border bg-success-subtle text-success-foreground'
          : 'border-warning-border bg-warning-subtle text-warning-foreground',
      )}
    >
      {report.passes ? (
        <Check aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      ) : (
        <AlertTriangle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      )}
      <span>
        {mode}: {report.checks.map((c) => `${c.label} ${c.ratio.toFixed(2)}:1`).join(' · ')} —{' '}
        {report.passes ? 'passes AA (4.5:1)' : `${failing.join(', ')} below AA (4.5:1)`}
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

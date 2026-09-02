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
  SURFACES,
  accentChanged,
  accentContrast,
  hexToOklch,
  oklchToHex,
  radiusScale,
  type FontChoice,
  type ThemeState,
} from './editor-model';

const HUES = Array.from({ length: 12 }, (_, i) => i * 30);
const RADII = [0, 4, 6, 8];

interface Props {
  state: ThemeState;
  onChange: (patch: Partial<ThemeState>) => void;
  onReset: () => void;
  changed: number;
}

/**
 * The right-hand rail. Every control writes straight into the shared state, so
 * the wall on the left and the snippet behind "Get code" always agree.
 */
export function ThemeControls({ state, onChange, onReset, changed }: Props) {
  const hex = oklchToHex(state.lightness, state.chroma, state.hue);
  const light = accentContrast(state, 'light');
  const dark = accentContrast(state, 'dark');
  const r = radiusScale(state.radius);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold">Тохиргоо</h2>
        <span className="text-foreground-subtle text-xs">
          {changed === 0 ? 'default хэвээр' : `${changed} токен өөрчлөгдсөн`}
        </span>
        <span className="grow" />
        {changed > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            Сэргээх
          </Button>
        )}
      </div>

      <Section title="Preset">
        <div className="grid grid-cols-3 gap-2">
          {ACCENT_PRESETS.map((p) => {
            const active = state.lightness === p.l && state.chroma === p.c && state.hue === p.h;
            return (
              <button
                key={p.name}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ lightness: p.l, chroma: p.c, hue: p.h })}
                className={cn(
                  'focus-visible:ring-ring flex flex-col items-center gap-1.5 rounded-md border p-2 focus-visible:ring-2 focus-visible:outline-none',
                  active
                    ? 'border-accent text-foreground font-medium'
                    : 'border-border text-foreground-muted hover:border-border-strong',
                )}
              >
                <span
                  aria-hidden
                  className="size-5 rounded-full"
                  style={{ background: oklchToHex(p.l, p.c, p.h) }}
                />
                <span className="text-xs">{p.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Separator />

      <Section
        title="Accent"
        changed={accentChanged(state)}
        onReset={() =>
          onChange({
            lightness: DEFAULT_STATE.lightness,
            chroma: DEFAULT_STATE.chroma,
            hue: DEFAULT_STATE.hue,
          })
        }
      >
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-foreground-subtle mb-1.5 text-xs">Өнгөний тон</p>
            <div className="grid grid-cols-12 gap-1">
              {HUES.map((h) => {
                const active = Math.round(state.hue / 30) * 30 === h;
                return (
                  <button
                    key={h}
                    type="button"
                    aria-label={`Тон ${h}°`}
                    aria-pressed={active}
                    onClick={() => onChange({ hue: h })}
                    className={cn(
                      'focus-visible:ring-ring h-5 rounded-sm focus-visible:ring-2 focus-visible:outline-none',
                      active && 'ring-foreground ring-2 ring-offset-2',
                    )}
                    style={{ background: oklchToHex(state.lightness, state.chroma, h) }}
                  />
                );
              })}
            </div>
          </div>

          <Slider
            label="Гэрэлтэлт"
            showValue
            min={0.3}
            max={0.8}
            step={0.005}
            value={[state.lightness]}
            onValueChange={([v]) => onChange({ lightness: v })}
            formatValue={(v) => v.toFixed(3)}
          />
          <Slider
            label="Ханалт"
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
      </Section>

      <Separator />

      <Section
        title="Радиус"
        changed={state.radius !== DEFAULT_STATE.radius}
        onReset={() => onChange({ radius: DEFAULT_STATE.radius })}
      >
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-4 gap-2">
            {RADII.map((v) => (
              <Button
                key={v}
                size="sm"
                variant={state.radius === v ? 'primary' : 'secondary'}
                onClick={() => onChange({ radius: v })}
                aria-pressed={state.radius === v}
              >
                {v}
              </Button>
            ))}
          </div>
          <p className="text-foreground-subtle text-xs">
            Товч/input {r.md}px · карт {r.lg}px · modal {r.xl}px
          </p>
        </div>
      </Section>

      <Section
        title="Гадаргуу"
        changed={state.surface !== DEFAULT_STATE.surface}
        onReset={() => onChange({ surface: DEFAULT_STATE.surface })}
      >
        <div className="grid grid-cols-3 gap-2">
          {SURFACES.map((s) => (
            <Button
              key={s.name}
              size="sm"
              variant={state.surface === s.name ? 'primary' : 'secondary'}
              onClick={() => onChange({ surface: s.name })}
              aria-pressed={state.surface === s.name}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </Section>

      <Section
        title="Фонт"
        changed={
          state.fontSans !== DEFAULT_STATE.fontSans || state.fontMono !== DEFAULT_STATE.fontMono
        }
        onReset={() =>
          onChange({
            fontSans: DEFAULT_STATE.fontSans,
            fontMono: DEFAULT_STATE.fontMono,
            customSans: '',
            customMono: '',
          })
        }
      >
        <div className="flex flex-col gap-3">
          <FontPicker
            label="Sans"
            value={state.fontSans}
            custom={state.customSans}
            onValue={(v) => onChange({ fontSans: v })}
            onCustom={(v) => onChange({ customSans: v })}
          />
          <FontPicker
            label="Mono"
            value={state.fontMono}
            custom={state.customMono}
            onValue={(v) => onChange({ fontMono: v })}
            onCustom={(v) => onChange({ customMono: v })}
          />
          <p className="text-foreground-subtle text-xs">
            Өөрийн фонт сонговол түүнийг төсөлдөө өөрөө ачаална — энэ хуудсанд Geist л ачаалагдсан.
            Кирилл ажиллуулах бол `cyrillic-ext` subset шаардлагатай.
          </p>
        </div>
      </Section>

      <Separator />

      <p className="text-foreground-subtle text-xs">
        Chart өнгө (`--chart-1…6`) энд байхгүй — цуваа нь товчтой андуурагдахгүй байхын тулд
        accent-аас тусдаа байх ёстой (design-research 12-data-viz).
      </p>
    </div>
  );
}

function Section({
  title,
  changed,
  onReset,
  children,
}: {
  title: string;
  changed?: boolean;
  onReset?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        {changed && <span aria-hidden className="bg-accent size-1.5 rounded-full" />}
        {changed && <span className="sr-only">(өөрчлөгдсөн)</span>}
        <span className="grow" />
        {changed && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-accent focus-visible:ring-ring rounded-sm text-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            Сэргээх
          </button>
        )}
      </div>
      {children}
    </section>
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
        {mode}: товчны текст {ratio.toFixed(2)}:1 —{' '}
        {passes ? 'AA (4.5:1) давсан' : 'AA (4.5:1) хүрэхгүй'}
      </span>
    </div>
  );
}

function FontPicker({
  label,
  value,
  custom,
  onValue,
  onCustom,
}: {
  label: string;
  value: FontChoice;
  custom: string;
  onValue: (v: FontChoice) => void;
  onCustom: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Select value={value} onValueChange={(v) => onValue(v as FontChoice)}>
        <SelectTrigger size="sm" aria-label={`${label} фонт`} />
        <SelectContent>
          <SelectItem value="geist">{label === 'Sans' ? 'Geist' : 'Geist Mono'}</SelectItem>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="custom">Өөрийн…</SelectItem>
        </SelectContent>
      </Select>
      {value === 'custom' && (
        <Input
          aria-label={`${label} фонтын нэр`}
          placeholder="Жишээ нь: Inter"
          value={custom}
          maxLength={60}
          onChange={(e) => onCustom(e.target.value)}
        />
      )}
    </div>
  );
}

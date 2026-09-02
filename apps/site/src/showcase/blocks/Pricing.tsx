import type { ReactNode } from 'react';
import { Check } from '@/icons';
import { Badge } from '@gerege-systems/ui';
import { Button } from '@gerege-systems/ui';
import { cn } from '@gerege-systems/ui';
import { useT } from '../i18n/locale';
import { landingDict } from '../i18n/landing';

/* -----------------------------------------------------------------------------
 *  Pricing — N-tier comparison grid. Tiers are declared as data so consumers
 *  can change copy, count, and CTA behavior without touching the layout.
 * --------------------------------------------------------------------------- */

export interface PricingTier {
  name: string;
  /** Price string. Pre-formatted — render '$0', '$20', 'Custom', '¥1,200', etc. */
  price: string;
  /** Cadence label rendered next to the price ('per user / month'). */
  cadence?: string;
  description?: string;
  features: string[];
  /** CTA label. */
  cta: string;
  /** Mark this tier as the recommended one — adds accent border + badge. */
  highlighted?: boolean;
  /** Click handler for the CTA. */
  onSelect?: () => void;
}

export interface PricingProps {
  /** Top heading. */
  title?: ReactNode;
  /** Subtitle under the heading. */
  subtitle?: ReactNode;
  /** Tier descriptors. */
  tiers?: PricingTier[];
  /** Label shown on the highlighted tier badge. */
  highlightedLabel?: string;
  /** Fallback CTA handler for tiers that don't define their own onSelect. */
  onTierSelect?: (tier: PricingTier) => void;
  className?: string;
}

type LandingT = ReturnType<typeof useT<(typeof landingDict)['en']>>;

/** Demo tiers — USD in EN, ₮ (suffix) in MN. */
const defaultTiers = (t: LandingT): PricingTier[] => [
  {
    name: t('tierStarter'),
    price: t('tierStarterPrice'),
    cadence: t('tierStarterCadence'),
    description: t('tierStarterDesc'),
    features: [t('tierStarterF1'), t('tierStarterF2'), t('tierStarterF3')],
    cta: t('cta'),
  },
  {
    name: t('tierTeam'),
    price: t('tierTeamPrice'),
    cadence: t('tierTeamCadence'),
    description: t('tierTeamDesc'),
    features: [t('tierTeamF1'), t('tierTeamF2'), t('tierTeamF3'), t('tierTeamF4')],
    cta: t('cta'),
    highlighted: true,
  },
  {
    name: t('tierEnterprise'),
    price: t('tierEnterprisePrice'),
    cadence: t('tierEnterpriseCadence'),
    description: t('tierEnterpriseDesc'),
    features: [
      t('tierEnterpriseF1'),
      t('tierEnterpriseF2'),
      t('tierEnterpriseF3'),
      t('tierEnterpriseF4'),
      t('tierEnterpriseF5'),
    ],
    cta: t('talkToSales'),
  },
];

/**
 * Pricing grid. Defaults to a 3-tier demo if `tiers` is omitted. Renders an
 * `h2` so it slots into a landing page under the single `h1`; tiers are `h3`.
 *
 * @example
 *   <Pricing
 *     title="Plans"
 *     tiers={[
 *       { name: 'Free', price: '$0', features: ['…'], cta: 'Start' },
 *       { name: 'Pro', price: '$12', features: ['…'], cta: 'Upgrade', highlighted: true },
 *     ]}
 *   />
 */
export function Pricing({
  title,
  subtitle,
  tiers,
  highlightedLabel,
  onTierSelect,
  className,
}: PricingProps = {}) {
  const t = useT(landingDict);
  title ??= t('pricingTitle');
  subtitle ??= t('pricingBody');
  tiers ??= defaultTiers(t);
  highlightedLabel ??= t('mostPopular');
  const cols = tiers.length;
  return (
    <section
      aria-labelledby="pricing-title"
      className={cn('mx-auto max-w-5xl space-y-8 px-6 py-16', className)}
    >
      <header className="space-y-3 text-center">
        <h2 id="pricing-title" className="text-foreground text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="text-foreground-muted mx-auto max-w-xl text-sm">{subtitle}</p>}
      </header>

      <div
        className={cn(
          'grid gap-4',
          cols === 2 && 'md:grid-cols-2',
          cols === 3 && 'md:grid-cols-3',
          cols === 4 && 'md:grid-cols-2 lg:grid-cols-4',
          cols > 4 && 'md:grid-cols-3',
        )}
      >
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              'bg-card flex flex-col gap-6 rounded-lg border p-6',
              tier.highlighted ? 'border-accent shadow-sm' : 'border-border',
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground text-base font-semibold">{tier.name}</h3>
                {tier.highlighted && <Badge tone="accent">{highlightedLabel}</Badge>}
              </div>
              {tier.description && (
                <p className="text-foreground-muted text-sm">{tier.description}</p>
              )}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="tabular text-foreground text-3xl font-semibold">{tier.price}</span>
              {tier.cadence && (
                <span className="text-foreground-subtle text-sm">{tier.cadence}</span>
              )}
            </div>

            <ul className="space-y-2 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="text-foreground flex items-start gap-2">
                  <Check className="text-accent mt-0.5 size-4 shrink-0" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={tier.highlighted ? 'primary' : 'outline'}
              className="mt-auto w-full"
              onClick={tier.onSelect ?? (onTierSelect && (() => onTierSelect(tier)))}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

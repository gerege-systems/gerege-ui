import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ComponentDoc } from '../registry/types';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/Alert';

const doc: ComponentDoc = {
  slug: 'card',
  name: 'Card',
  group: 'Layout',
  description:
    'Container surface for grouped content. Compose with CardHeader / CardTitle / CardDescription / CardContent / CardFooter — none are required, but the structure keeps spacing consistent across the app.',
  exports: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter'],
  sourceFile: 'Card.tsx',
  examples: [
    {
      title: 'Default',
      preview: (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Project Atlas</CardTitle>
            <CardDescription>4 contributors · updated 2 hours ago</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground-muted text-sm">
              A small dashboard project tracking team activity across repos.
            </p>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" size="sm">
              Open
            </Button>
            <Button size="sm">View report</Button>
          </CardFooter>
        </Card>
      ),
      code: `<Card>
  <CardHeader>
    <CardTitle>Project Atlas</CardTitle>
    <CardDescription>4 contributors · updated 2 hours ago</CardDescription>
  </CardHeader>
  <CardContent>
    <p>A small dashboard project tracking team activity across repos.</p>
  </CardContent>
  <CardFooter className="justify-end gap-2">
    <Button variant="ghost">Open</Button>
    <Button>View report</Button>
  </CardFooter>
</Card>`,
    },
    {
      title: 'Interactive',
      description:
        'variant="interactive" adds hover + focus-visible affordances so the whole card reads as a link target. Wrap an <a> inside for proper link semantics.',
      preview: (
        <a href="#components/card" className="block w-full max-w-sm no-underline">
          <Card variant="interactive">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Beacon
                <Badge tone="warning">Paused</Badge>
              </CardTitle>
              <CardDescription>Open dashboard ↗</CardDescription>
            </CardHeader>
          </Card>
        </a>
      ),
      code: `<a href="/projects/beacon" className="block no-underline">
  <Card variant="interactive">
    <CardHeader>
      <CardTitle>Project Beacon</CardTitle>
      <CardDescription>Open dashboard ↗</CardDescription>
    </CardHeader>
  </Card>
</a>`,
    },
    {
      title: 'asChild (card as link)',
      description:
        'Instead of nesting an <a> around the card, `asChild` merges the card styles onto your own element — one DOM node, native link semantics, and the interactive hover/focus ring land on the <a> itself. Works with router <Link> too.',
      preview: (
        <Card asChild variant="interactive" className="block w-full max-w-sm no-underline">
          <a href="#components/card">
            <CardHeader>
              <CardTitle>Project Beacon</CardTitle>
              <CardDescription>Open dashboard ↗</CardDescription>
            </CardHeader>
          </a>
        </Card>
      ),
      code: `<Card asChild variant="interactive">
  <Link to="/projects/beacon">
    <CardHeader>
      <CardTitle>Project Beacon</CardTitle>
      <CardDescription>Open dashboard ↗</CardDescription>
    </CardHeader>
  </Link>
</Card>`,
    },
    {
      title: 'Compact / no padding',
      preview: (
        <Card padding="none" className="w-full max-w-sm">
          <img
            alt=""
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'><rect width='400' height='200' fill='%23eef2ff'/><text x='200' y='105' fill='%236366f1' text-anchor='middle' font-family='sans-serif' font-size='14'>Cover image</text></svg>"
            className="block w-full"
          />
          <div className="p-4">
            <CardTitle>Edge-to-edge media</CardTitle>
            <CardDescription>padding="none" + manual inner padding.</CardDescription>
          </div>
        </Card>
      ),
      code: `<Card padding="none">
  <img src="…" className="block w-full" />
  <div className="p-4">
    <CardTitle>Edge-to-edge media</CardTitle>
    <CardDescription>padding="none" + manual inner padding.</CardDescription>
  </div>
</Card>`,
    },
    {
      title: 'States',
      description:
        'Loading mirrors the final silhouette with Skeletons; a disabled card is muted and `aria-disabled`; an error card surfaces an Alert with a retry action.',
      preview: (
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <Card aria-busy>
            <CardHeader>
              <Skeleton variant="text" className="w-2/3" />
              <Skeleton variant="text" className="w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-5/6" />
            </CardContent>
          </Card>
          <Card aria-disabled className="opacity-60">
            <CardHeader>
              <CardTitle>Archived project</CardTitle>
              <CardDescription>Read-only · restore to edit</CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
              <Button size="sm" variant="outline" disabled>
                Open
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="danger" title="Couldn't load usage">
                Check your connection and try again.
              </Alert>
            </CardContent>
            <CardFooter className="justify-end">
              <Button size="sm" variant="outline">
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      ),
      code: `{/* Loading */}
<Card aria-busy>
  <CardHeader>
    <Skeleton variant="text" className="w-2/3" />
    <Skeleton variant="text" className="w-1/2" />
  </CardHeader>
  <CardContent className="space-y-2">
    <Skeleton variant="text" />
    <Skeleton variant="text" className="w-5/6" />
  </CardContent>
</Card>

{/* Disabled */}
<Card aria-disabled className="opacity-60">…</Card>

{/* Error */}
<Card>
  <CardContent>
    <Alert variant="danger" title="Couldn't load usage">Check your connection and try again.</Alert>
  </CardContent>
  <CardFooter className="justify-end"><Button size="sm" variant="outline">Retry</Button></CardFooter>
</Card>`,
    },
  ],
  api: [
    {
      title: 'Card',
      rows: [
        {
          name: 'variant',
          type: `'default' | 'interactive'`,
          default: `'default'`,
          description: 'Interactive adds hover + focus-visible affordance.',
        },
        {
          name: 'padding',
          type: `'none' | 'sm' | 'md' | 'lg'`,
          default: `'md'`,
          description: 'Inner padding preset.',
        },
      ],
    },
    {
      title: 'Sub-components',
      rows: [
        {
          name: 'CardHeader',
          type: 'component',
          description: 'Top region — wraps Title / Description.',
        },
        { name: 'CardTitle', type: 'component', description: 'h3 by default.' },
        {
          name: 'CardDescription',
          type: 'component',
          description: 'Muted body line under the title.',
        },
        { name: 'CardContent', type: 'component', description: 'Main body region.' },
        { name: 'CardFooter', type: 'component', description: 'Bottom action region.' },
      ],
    },
  ],
  accessibility: [
    'Wrap an interactive Card in an <a> or <button> for correct link / button semantics — do not put an onClick on the Card div alone.',
  ],
  guidelines: {
    do: [
      'Use a 1 px border on page-level cards; reserve shadows for floating surfaces.',
      'Keep one primary action per card, in `CardFooter`, aligned right.',
      'Use `variant="interactive"` when the whole card is a link and wrap it in an `<a>` / button.',
      'Group related information; a card should answer one question.',
    ],
    dont: [
      'Nest cards inside cards — use Separator or spacing instead.',
      'Use `rounded-2xl` or heavier shadows; the system is hairlines and `rounded-lg` at most.',
      'Tint a card with the accent to make it "stand out" — use placement and typography.',
      'Make a card clickable without a visible focus ring and keyboard activation.',
    ],
  },
  related: [{ slug: 'separator', reason: 'For dividing sections inside a Card.' }],
};

export default doc;

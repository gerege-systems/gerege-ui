import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  DesignSystemProvider,
  brandPresets,
  type BrandName,
} from '@/components/ui/DesignSystemProvider';
import { BRANDS } from '../site.config';
import { CodeBlock } from '../widgets/CodeBlock';

function BrandSwapDemo() {
  const [brand, setBrand] = useState<BrandName>('default');
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {BRANDS.map((b) => (
          <Button
            key={b.name}
            size="sm"
            variant={brand === b.name ? 'primary' : 'outline'}
            onClick={() => setBrand(b.name)}
          >
            {b.label}
          </Button>
        ))}
      </div>
      <DesignSystemProvider tokens={brandPresets[brand]}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              All primitives inside this card switch their accent colour live.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Primary action</Button>
              <Button size="sm" variant="outline">
                Secondary
              </Button>
              <Badge tone="accent">v1.0</Badge>
              <Badge tone="success" dot>
                Live
              </Badge>
            </div>
            <Input label="Email" placeholder="you@company.com" hideLabel />
          </CardContent>
        </Card>
      </DesignSystemProvider>
    </div>
  );
}

export function ThemingBody() {
  return (
    <div className="prose-block">
      <h2>Per-subtree override (live)</h2>
      <p>
        <code>DesignSystemProvider</code> applies token overrides to a scoped subtree only. Pick a
        brand below — every primitive inside the preview card updates instantly.
      </p>
      <BrandSwapDemo />

      <h2>Built-in presets</h2>
      <p>
        Use the included presets as drop-in starters, or fork them. Each preset is just a record
        mapping CSS variable names to values.
      </p>
      <CodeBlock
        code={`import { DesignSystemProvider, brandPresets } from '@gerege-systems/ui';

<DesignSystemProvider tokens={brandPresets.violet}>
  <App />
</DesignSystemProvider>`}
      />

      <h2>Custom tokens</h2>
      <p>
        Pass any record of CSS variable names → values. The leading <code>--</code> is optional; the
        provider normalises both forms.
      </p>
      <CodeBlock
        code={`<DesignSystemProvider
  tokens={{
    accent: 'oklch(0.62 0.21 260)',
    'accent-subtle': 'oklch(0.94 0.04 260)',
    'radius-md': '4px',
    'font-sans': 'Geist, Inter, system-ui, sans-serif',
  }}
>
  <App />
</DesignSystemProvider>`}
      />

      <h2>Global override</h2>
      <p>
        For app-wide branding, override the same CSS variables in your own stylesheet — loaded after{' '}
        <code>@gerege-systems/ui/styles.css</code>:
      </p>
      <CodeBlock
        language="css"
        code={`:root {
  --accent: oklch(0.62 0.21 260);
  --accent-subtle: oklch(0.94 0.04 260);
  --radius-sm: 4px;
  --font-sans: 'Geist', 'Inter', system-ui, sans-serif;
}`}
      />
    </div>
  );
}

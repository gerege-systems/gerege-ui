import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { useMediaQuery } from '@/hooks/use-media-query';
import { CodeBlock } from '../widgets/CodeBlock';

function BreakpointIndicator() {
  const sm = useMediaQuery('(min-width: 640px)');
  const md = useMediaQuery('(min-width: 768px)');
  const lg = useMediaQuery('(min-width: 1024px)');
  const xl = useMediaQuery('(min-width: 1280px)');
  const xxl = useMediaQuery('(min-width: 1536px)');

  const active = xxl ? '2xl' : xl ? 'xl' : lg ? 'lg' : md ? 'md' : sm ? 'sm' : 'base';

  return (
    <Card>
      <CardContent className="space-y-3 py-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-foreground-subtle text-xs tracking-wider uppercase">
            Active breakpoint
          </span>
          <Badge tone="accent" className="text-base">
            {active}
          </Badge>
        </div>
        <p className="text-foreground-muted text-xs">
          Resize your browser. The hook returns booleans for each min-width media query — chain them
          or render layout variants directly.
        </p>
        <div className="grid grid-cols-5 gap-1 text-center text-xs tracking-wider uppercase">
          {[
            { label: 'sm', on: sm },
            { label: 'md', on: md },
            { label: 'lg', on: lg },
            { label: 'xl', on: xl },
            { label: '2xl', on: xxl },
          ].map((b) => (
            <div
              key={b.label}
              className={
                b.on
                  ? 'bg-accent-soft text-on-accent-soft rounded-sm px-2 py-1'
                  : 'bg-background-muted text-foreground-subtle rounded-sm px-2 py-1'
              }
            >
              {b.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ResponsiveBody() {
  return (
    <div className="prose-block">
      <h2>Breakpoints (Tailwind v4 defaults)</h2>
      <ul>
        <li>
          <code>sm</code> — 640px
        </li>
        <li>
          <code>md</code> — 768px
        </li>
        <li>
          <code>lg</code> — 1024px
        </li>
        <li>
          <code>xl</code> — 1280px
        </li>
        <li>
          <code>2xl</code> — 1536px
        </li>
      </ul>

      <h2>Live breakpoint indicator</h2>
      <BreakpointIndicator />

      <h2>Components with built-in responsive behavior</h2>
      <ul>
        <li>
          <b>Sidebar</b> — collapses to icon-only at <code>md</code>. Use <code>useSidebar()</code>{' '}
          to react to collapsed state.
        </li>
        <li>
          <b>Dialog</b> — full-screen on mobile (~&lt; 640 px), centered modal on larger.
        </li>
        <li>
          <b>Sheet vs Drawer</b> — switch by intent: right-side sheets often become bottom drawers
          on touch.
        </li>
        <li>
          <b>AppShell TopBar</b> — collapses to a hamburger + mobile sheet at <code>md</code>.
        </li>
        <li>
          <b>DataGrid</b> — its container scrolls horizontally; cells don't reflow.
        </li>
      </ul>

      <h2>useMediaQuery hook</h2>
      <CodeBlock
        code={`import { useMediaQuery } from '@gerege-systems/ui';

const isMobile = useMediaQuery('(max-width: 640px)');

return isMobile ? <Drawer>{children}</Drawer> : <Sheet>{children}</Sheet>;`}
      />

      <h2>prefers-reduced-motion</h2>
      <p>
        The library respects <code>prefers-reduced-motion</code> automatically. To branch on it in
        your own code:
      </p>
      <CodeBlock
        code={`import { usePrefersReducedMotion } from '@gerege-systems/ui';

const reduced = usePrefersReducedMotion();
return <motion.div animate={reduced ? undefined : { y: 0 }} />;`}
      />
    </div>
  );
}

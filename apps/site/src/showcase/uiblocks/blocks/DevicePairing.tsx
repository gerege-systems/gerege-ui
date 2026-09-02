import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Icons,
  Kbd,
} from '@gerege-systems/ui';

const MODULES: [number, number][] = [
  [9, 0],
  [12, 0],
  [8, 1],
  [12, 1],
  [10, 2],
  [11, 2],
  [12, 2],
  [8, 3],
  [10, 5],
  [11, 6],
  [1, 8],
  [3, 8],
  [10, 8],
  [12, 8],
  [14, 8],
  [16, 8],
  [18, 8],
  [0, 9],
  [11, 9],
  [12, 9],
  [13, 9],
  [14, 9],
  [15, 9],
  [2, 10],
  [5, 10],
  [8, 10],
  [11, 10],
  [14, 10],
  [17, 10],
  [20, 10],
  [2, 11],
  [6, 11],
  [9, 11],
  [10, 11],
  [13, 11],
  [17, 11],
  [0, 12],
  [1, 12],
  [2, 12],
  [8, 12],
  [9, 12],
  [15, 12],
  [16, 12],
  [17, 12],
  [9, 13],
  [11, 13],
  [13, 13],
  [20, 13],
  [8, 14],
  [9, 14],
  [10, 14],
  [9, 15],
  [12, 15],
  [15, 15],
  [18, 15],
  [8, 16],
  [12, 16],
  [16, 16],
  [19, 16],
  [20, 16],
  [10, 17],
  [11, 17],
  [12, 17],
  [18, 17],
  [19, 17],
  [8, 18],
  [15, 18],
  [17, 18],
  [19, 18],
  [16, 19],
  [17, 19],
  [18, 19],
  [19, 19],
  [20, 19],
  [10, 20],
  [13, 20],
  [16, 20],
  [19, 20],
];

export function DevicePairing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan to link your phone</CardTitle>
        <p className="text-foreground-subtle text-xs">
          Open the mobile app and scan this code to pair the device.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 py-2">
        {/* Placeholder mark, drawn as one SVG: a CSS grid of empty cells
            collapses to nothing and the pattern falls apart. Not scannable on
            purpose — a real code implies a pairing endpoint behind it. */}
        <svg
          viewBox="0 0 21 21"
          role="img"
          aria-label="Pairing code placeholder"
          className="border-border bg-card text-foreground size-36 rounded-lg border p-3"
          shapeRendering="crispEdges"
        >
          {/* Three finder squares, as a real code has. */}
          {[
            [0, 0],
            [14, 0],
            [0, 14],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`} fill="currentColor">
              <rect x={x} y={y} width="7" height="7" />
              <rect x={x + 1} y={y + 1} width="5" height="5" fill="var(--card)" />
              <rect x={x + 2} y={y + 2} width="3" height="3" />
            </g>
          ))}
          {MODULES.map(([x, y]) => (
            <rect key={`${x}.${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
          ))}
        </svg>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-foreground-subtle text-xs">Can’t scan? Enter this code</span>
          <div className="flex items-center gap-1.5">
            <Kbd>7F2K</Kbd>
            <span className="text-foreground-subtle">—</span>
            <Kbd>9QD1</Kbd>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center gap-2">
        <Button size="sm" variant="secondary">
          <Icons.Copy aria-hidden />
          Copy code
        </Button>
        <Button size="sm" variant="ghost">
          Send by email
        </Button>
      </CardFooter>
    </Card>
  );
}

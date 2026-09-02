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
  [10, 0],
  [11, 0],
  [12, 0],
  [12, 1],
  [8, 2],
  [12, 2],
  [11, 3],
  [8, 4],
  [10, 4],
  [11, 4],
  [12, 4],
  [11, 5],
  [9, 6],
  [10, 6],
  [12, 6],
  [8, 7],
  [9, 7],
  [1, 8],
  [5, 8],
  [7, 8],
  [9, 8],
  [10, 8],
  [12, 8],
  [14, 8],
  [15, 8],
  [19, 8],
  [20, 8],
  [2, 9],
  [3, 9],
  [6, 9],
  [8, 9],
  [9, 9],
  [11, 9],
  [14, 9],
  [19, 9],
  [2, 10],
  [4, 10],
  [5, 10],
  [9, 10],
  [11, 10],
  [12, 10],
  [13, 10],
  [14, 10],
  [19, 10],
  [4, 11],
  [6, 11],
  [7, 11],
  [9, 11],
  [13, 11],
  [15, 11],
  [16, 11],
  [17, 11],
  [19, 11],
  [20, 11],
  [2, 12],
  [6, 12],
  [7, 12],
  [10, 12],
  [12, 12],
  [14, 12],
  [16, 12],
  [17, 12],
  [19, 12],
  [8, 13],
  [11, 13],
  [12, 13],
  [13, 13],
  [14, 13],
  [16, 13],
  [18, 13],
  [19, 13],
  [8, 14],
  [9, 14],
  [14, 14],
  [16, 14],
  [17, 14],
  [18, 14],
  [19, 14],
  [20, 14],
  [8, 15],
  [11, 15],
  [15, 15],
  [17, 15],
  [20, 15],
  [8, 16],
  [10, 16],
  [14, 16],
  [15, 16],
  [17, 16],
  [18, 16],
  [8, 17],
  [9, 17],
  [10, 17],
  [15, 17],
  [16, 17],
  [18, 17],
  [9, 18],
  [12, 18],
  [14, 18],
  [15, 18],
  [16, 18],
  [17, 18],
  [12, 19],
  [14, 19],
  [15, 19],
  [16, 19],
  [19, 19],
  [8, 20],
  [10, 20],
  [13, 20],
  [14, 20],
  [16, 20],
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
          className="text-foreground size-44"
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

import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { routeToHash } from '../routing';

export function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-6 py-16 outline-hidden">
      <ErrorState
        variant="404"
        // The only heading on this route: it is the page title, not a section.
        headingLevel={1}
        title="Page not found"
        description="The page you are looking for does not exist."
        action={
          <Button asChild>
            <a href={`#${routeToHash({ kind: 'home' })}`}>Back to overview</a>
          </Button>
        }
      />
    </main>
  );
}

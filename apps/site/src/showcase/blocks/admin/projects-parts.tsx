import { useEffect, useState, type ReactNode } from 'react';
import { X } from '@/icons';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@gerege-systems/ui';
import { STATUSES, STATUS_KEY, type Project, type ProjectStatus } from './data';
import { adminDict } from '../../i18n/admin';
import { useT } from '../../i18n/locale';

/* =============================================================================
 *  Admin template — Projects page parts: debounce hook, create/edit dialog,
 *  filter chip.
 * ========================================================================== */

/** 300ms debounce — search fires after the user pauses, not per keystroke. */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ---------------------------------------------------------------------------
 *  Create / edit dialog (2–3 fields → modal)
 * ------------------------------------------------------------------------ */

export function ProjectDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: Project | null;
  onSave: (p: { name: string; status: ProjectStatus; owner: string }) => void;
}) {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const t = useT(adminDict);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setOwner(initial?.owner ?? '');
      setStatus(initial?.status ?? 'Active');
    }
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? t('dialog.editTitle') : t('dialog.newTitle')}</DialogTitle>
          <DialogDescription>
            {initial ? t('dialog.editDesc') : t('dialog.newDesc')}
          </DialogDescription>
        </DialogHeader>
        <form
          id="project-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            onSave({ name: name.trim(), status, owner: owner.trim() || t('owner.unassigned') });
            onOpenChange(false);
          }}
        >
          <Input
            label={t('field.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('field.namePlaceholder')}
            required
          />
          <Input
            label={t('field.owner')}
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder={t('field.ownerPlaceholder')}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="project-status" className="text-foreground text-sm font-medium">
              {t('field.status')}
            </label>
            <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
              <SelectTrigger id="project-status" placeholder={t('field.status')} />
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(STATUS_KEY[s])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter>
          <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="project-form" disabled={!name.trim()}>
            {initial ? t('common.saveChanges') : t('dialog.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------------------------------------------------------------
 *  Filter chip
 * ------------------------------------------------------------------------ */

export function FilterChip({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  const t = useT(adminDict);
  return (
    <span className="border-border bg-card text-foreground inline-flex h-7 items-center gap-1 rounded-full border pr-1 pl-2.5 text-xs">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label={t('filter.remove')}
        className="text-foreground-subtle hover:bg-background-muted hover:text-foreground focus-visible:ring-ring inline-flex size-5 items-center justify-center rounded-full outline-none focus-visible:ring-2"
      >
        <X className="size-3" aria-hidden />
      </button>
    </span>
  );
}

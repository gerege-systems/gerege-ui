import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  Copy,
  Download,
  Folder,
  Inbox,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from '@/icons';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmationDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortHeader,
  Tooltip,
  cn,
  formatNumber,
  useStrings,
  useToast,
} from '@gerege/ui';
import {
  SEED_PROJECTS,
  STATUSES,
  STATUS_KEY,
  STATUS_TONE,
  formatRelative,
  type Project,
  type ProjectStatus,
} from './data';
import { readHashParams, useHashParams } from './use-hash-params';
import { PageHeader, StatusIcon, useDemo } from './shell';
import { FilterChip, ProjectDialog, useDebounced } from './projects-parts';
import { adminDict } from '../../i18n/admin';
import { useT } from '../../i18n/locale';

/* =============================================================================
 *  Admin template — Projects: the list→detail table pattern in full.
 *  Sort (asc → desc → none) · filter chips with applied count · debounced
 *  search with clear · 25/50/100 pagination · checkbox selection + sticky bulk
 *  bar · ≤2 inline row actions + overflow menu (Delete last, destructive) ·
 *  confirm before delete · first-run vs filtered empty states · skeleton.
 * ========================================================================== */

const PAGE_SIZES = [25, 50, 100];
type SortKey = 'name' | 'status' | 'owner' | 'updatedAt';
type Sort = { key: SortKey; direction: 'asc' | 'desc' } | null;
type StatusFilter = 'all' | ProjectStatus;
const DEFAULT_SORT: NonNullable<Sort> = { key: 'updatedAt', direction: 'desc' };
/** URL ↔ sort key (`updated` reads better than `updatedAt` in a link). */
const SORT_PARAM: Record<SortKey, string> = {
  name: 'name',
  status: 'status',
  owner: 'owner',
  updatedAt: 'updated',
};

/** Initial list state from the hash tail: `?q=&status=&owner=&sort=&dir=&p=&size=`. */
function readInitialState() {
  const params = readHashParams();
  const statusParam = params.get('status')?.toLowerCase();
  const status = STATUSES.find((s) => s.toLowerCase() === statusParam) ?? 'all';
  const sortKey = (Object.keys(SORT_PARAM) as SortKey[]).find(
    (k) => SORT_PARAM[k] === params.get('sort'),
  );
  const dir = params.get('dir') === 'asc' ? 'asc' : 'desc';
  const sort: Sort =
    params.get('sort') === 'none'
      ? null
      : sortKey
        ? { key: sortKey, direction: dir }
        : DEFAULT_SORT;
  const p = Number(params.get('p'));
  const size = Number(params.get('size'));
  return {
    query: params.get('q') ?? '',
    status: status as StatusFilter,
    owner: params.get('owner') ?? 'all',
    sort,
    page: Number.isInteger(p) && p > 1 ? p : 1,
    pageSize: PAGE_SIZES.includes(size) ? size : PAGE_SIZES[0],
  };
}

/**
 * Below md the table scrolls horizontally; the checkbox + name cells stick to
 * the left edge so each row keeps its identity. Solid `bg-card` (the table
 * surface) hides the cells scrolling underneath; selected rows use the row tint.
 */
const STICKY_CHECK =
  'max-md:sticky max-md:left-0 max-md:z-10 max-md:w-12 max-md:bg-card max-md:group-data-[selected]:bg-accent-soft';
const STICKY_NAME =
  'max-md:sticky max-md:left-12 max-md:z-10 max-md:bg-card max-md:group-data-[selected]:bg-accent-soft';

/* ---------------------------------------------------------------------------
 *  Page
 * ------------------------------------------------------------------------ */

export interface ProjectsHandle {
  /** Open the "new project" dialog (used by the ⌘K palette). */
  create: () => void;
}

export const Projects = forwardRef<
  ProjectsHandle,
  { onNavigate: (key: string) => void; globalQuery: string }
>(function Projects({ onNavigate, globalQuery }, ref) {
  const { push } = useToast();
  const t = useT(adminDict);
  const { relativeTime } = useStrings();
  const [items, setItems] = useState<Project[]>(SEED_PROJECTS);
  // Filter/sort/page state seeds from the URL and is written back on change,
  // so a filtered view survives reload and can be shared as a link.
  const [initial] = useState(readInitialState);
  const [query, setQuery] = useState(initial.query);
  const debouncedQuery = useDebounced(query.trim().toLowerCase());
  const [status, setStatus] = useState<StatusFilter>(initial.status);
  const [owner, setOwner] = useState<string>(initial.owner);
  const [sort, setSort] = useState<Sort>(initial.sort);
  const [page, setPage] = useState(initial.page);
  const [pageSize, setPageSize] = useState(initial.pageSize);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Project[] | null>(null);
  // Loading / empty / error come from the shell's demo menu; in a real app
  // they are your query's status.
  const demo = useDemo();
  const loading = demo.state === 'loading';

  useImperativeHandle(ref, () => ({
    create: () => {
      setEditing(null);
      setDialogOpen(true);
    },
  }));

  // The top-bar search feeds this page's query (skip mount so a `?q=` deep
  // link isn't wiped by the empty top-bar field).
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) setQuery(globalQuery);
    mounted.current = true;
  }, [globalQuery]);

  useHashParams({
    q: query.trim() || undefined,
    status: status === 'all' ? undefined : status.toLowerCase(),
    owner: owner === 'all' ? undefined : owner,
    sort: sort === null ? 'none' : sort.key === DEFAULT_SORT.key ? undefined : SORT_PARAM[sort.key],
    dir:
      sort && !(sort.key === DEFAULT_SORT.key && sort.direction === DEFAULT_SORT.direction)
        ? sort.direction
        : undefined,
    p: page > 1 ? page : undefined,
    size: pageSize === PAGE_SIZES[0] ? undefined : pageSize,
  });

  const owners = useMemo(() => Array.from(new Set(items.map((p) => p.owner))).sort(), [items]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.length >= 2 ? debouncedQuery : '';
    const rows = items.filter(
      (p) =>
        (status === 'all' || p.status === status) &&
        (owner === 'all' || p.owner === owner) &&
        (!q || p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q)),
    );
    if (!sort) return rows;
    const dir = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key])) * dir);
  }, [items, debouncedQuery, status, owner, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize);

  const appliedFilters =
    (status !== 'all' ? 1 : 0) + (owner !== 'all' ? 1 : 0) + (debouncedQuery.length >= 2 ? 1 : 0);
  const clearFilters = () => {
    setStatus('all');
    setOwner('all');
    setQuery('');
    setPage(1);
  };

  // Sort cycle: asc → desc → none. TableSortHeader asks for asc after desc;
  // we read that third click as "clear".
  const onSort = (key: string, direction: 'asc' | 'desc') => {
    if (sort?.key === key && sort.direction === 'desc' && direction === 'asc') setSort(null);
    else setSort({ key: key as NonNullable<Sort>['key'], direction });
  };

  const pageIds = rows.map((r) => r.id);
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someOnPage = pageIds.some((id) => selected.has(id));
  const toggleAll = (checked: boolean) =>
    setSelected((s) => {
      const next = new Set(s);
      pageIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  const toggleOne = (id: number, checked: boolean) =>
    setSelected((s) => {
      const next = new Set(s);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  const save = (data: { name: string; status: ProjectStatus; owner: string }) => {
    const now = new Date().toISOString();
    if (editing) {
      setItems((xs) =>
        xs.map((x) => (x.id === editing.id ? { ...x, ...data, updatedAt: now } : x)),
      );
      push({ variant: 'success', title: t('toast.projectUpdated'), description: data.name });
    } else {
      setItems((xs) => [
        { id: Math.max(0, ...xs.map((x) => x.id)) + 1, updatedAt: now, ...data },
        ...xs,
      ]);
      push({ variant: 'success', title: t('toast.projectCreated'), description: data.name });
    }
  };
  const duplicate = (p: Project) => {
    const name = t('projects.copy', { name: p.name });
    setItems((xs) => [
      {
        ...p,
        id: Math.max(0, ...xs.map((x) => x.id)) + 1,
        name,
        updatedAt: new Date().toISOString(),
      },
      ...xs,
    ]);
    push({ variant: 'success', title: t('toast.projectDuplicated'), description: name });
  };
  // Archive is reversible: the toast carries a 5s Undo (10s for bulk) that
  // restores the previous rows. Delete stays behind a confirm — it's permanent.
  const archive = (ps: Project[]) => {
    const ids = new Set(ps.map((p) => p.id));
    const snapshot = items;
    setItems((xs) => xs.map((x) => (ids.has(x.id) ? { ...x, status: 'Archived' } : x)));
    setSelected(new Set());
    const bulk = ps.length > 1;
    push({
      title: bulk ? t('toast.projectsArchived', { n: ps.length }) : t('toast.projectArchived'),
      description: bulk ? undefined : ps[0].name,
      duration: bulk ? 10000 : 5000,
      action: {
        label: t('common.undo'),
        altText: bulk
          ? t('undo.archiveN', { n: ps.length })
          : t('undo.archive', { name: ps[0].name }),
        onClick: () => setItems(snapshot),
      },
    });
  };
  const confirmDelete = () => {
    if (!pendingDelete) return;
    const ids = new Set(pendingDelete.map((p) => p.id));
    setItems((xs) => xs.filter((x) => !ids.has(x.id)));
    setSelected((s) => new Set([...s].filter((id) => !ids.has(id))));
    push({
      variant: 'success',
      title:
        pendingDelete.length === 1
          ? t('toast.projectDeleted')
          : t('toast.projectsDeleted', { n: pendingDelete.length }),
      description: pendingDelete.length === 1 ? pendingDelete[0].name : undefined,
    });
    setPendingDelete(null);
  };

  const selectedRows = items.filter((p) => selected.has(p.id));
  const firstRun = items.length === 0 || demo.state === 'empty';
  const filteredEmpty = !firstRun && filtered.length === 0;

  if (demo.state === 'error')
    return (
      <div>
        <PageHeader page="projects" title={t('projects.title')} onNavigate={onNavigate} />
        <ErrorState
          variant="500"
          title={t('projects.errorTitle')}
          description={t('projects.errorDesc')}
          onRetry={() => demo.setState('normal')}
          live
        />
      </div>
    );

  return (
    <div>
      <PageHeader
        page="projects"
        title={t('projects.title')}
        subtitle={
          <span aria-live="polite">
            {firstRun
              ? t('projects.none')
              : filtered.length === items.length
                ? t('projects.count', { n: items.length })
                : t('projects.countOf', { n: filtered.length, total: items.length })}
          </span>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              leadingIcon={<Download />}
              className="hidden sm:inline-flex"
            >
              {t('common.export')}
            </Button>
            <Button
              size="sm"
              variant={firstRun ? 'secondary' : 'primary'}
              leadingIcon={<Plus />}
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              {t('projects.new')}
            </Button>
          </>
        }
        onNavigate={onNavigate}
      />

      {firstRun ? (
        <EmptyState
          title={t('projects.emptyTitle')}
          description={t('projects.emptyDesc')}
          action={
            <Button
              leadingIcon={<Plus />}
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              {t('projects.new')}
            </Button>
          }
          secondaryAction={
            <Button
              variant="outline"
              leadingIcon={<Upload />}
              onClick={() => {
                setItems(SEED_PROJECTS);
                demo.setState('normal');
              }}
            >
              {t('common.import')}
            </Button>
          }
          className="min-h-[320px]"
        />
      ) : (
        <>
          {/* Toolbar: search + filters + applied-count */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Input
              type="search"
              label={t('projects.search')}
              hideLabel
              size="sm"
              placeholder={t('projects.searchPlaceholder')}
              prefix={<Search className="size-4" aria-hidden />}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              clearable
              onClear={() => setQuery('')}
              className="w-full max-w-xs"
            />
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as StatusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger
                size="sm"
                aria-label={t('filter.status')}
                placeholder={t('filter.status')}
                className="w-36"
              />
              <SelectContent>
                <SelectItem value="all">{t('filter.allStatuses')}</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(STATUS_KEY[s])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={owner}
              onValueChange={(v) => {
                setOwner(v);
                setPage(1);
              }}
            >
              <SelectTrigger
                size="sm"
                aria-label={t('filter.owner')}
                placeholder={t('filter.owner')}
                className="w-36"
              />
              <SelectContent>
                <SelectItem value="all">{t('filter.allOwners')}</SelectItem>
                {owners.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {appliedFilters > 0 && (
              <Badge tone="accent" className="tabular">
                {t('filter.count', { n: appliedFilters })}
              </Badge>
            )}
          </div>

          {/* Applied filter chips */}
          {appliedFilters > 0 && (
            <div
              className="mb-3 flex flex-wrap items-center gap-2"
              aria-label={t('filter.applied')}
            >
              {status !== 'all' && (
                <FilterChip onRemove={() => setStatus('all')}>
                  {t('filter.statusChip', { value: t(STATUS_KEY[status]) })}
                </FilterChip>
              )}
              {owner !== 'all' && (
                <FilterChip onRemove={() => setOwner('all')}>
                  {t('filter.ownerChip', { value: owner })}
                </FilterChip>
              )}
              {debouncedQuery.length >= 2 && (
                <FilterChip onRemove={() => setQuery('')}>
                  {t('filter.searchChip', { query })}
                </FilterChip>
              )}
              {appliedFilters >= 2 && (
                <Button variant="link" size="sm" onClick={clearFilters}>
                  {t('filter.clearAll')}
                </Button>
              )}
            </div>
          )}

          <Card padding="none" className="relative overflow-hidden">
            {/* Sticky bulk-action bar replaces the header while rows are selected. */}
            {selected.size > 0 && (
              <div
                role="toolbar"
                aria-label={t('bulk.label')}
                className="border-border bg-accent-soft text-on-accent-soft sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b px-3 py-2 text-sm"
              >
                <Checkbox
                  aria-label={t('bulk.deselectAll')}
                  checked={allOnPage ? true : someOnPage ? 'indeterminate' : false}
                  onCheckedChange={(c) => toggleAll(c === true)}
                />
                <span className="tabular font-medium">
                  {t('bulk.selected', { n: selected.size })}
                </span>
                <div className="ml-2 flex items-center gap-1">
                  <Button variant="outline" size="sm" leadingIcon={<Download />}>
                    {t('common.export')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leadingIcon={<Inbox />}
                    onClick={() => archive(selectedRows)}
                  >
                    {t('common.archive')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    leadingIcon={<Trash2 />}
                    onClick={() => setPendingDelete(selectedRows)}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
                {selected.size < filtered.length && (
                  <Button
                    variant="link"
                    size="sm"
                    className="ml-auto"
                    onClick={() => setSelected(new Set(filtered.map((p) => p.id)))}
                  >
                    {t('bulk.selectAll', { n: filtered.length })}
                  </Button>
                )}
                <IconButton
                  aria-label={t('bulk.clear')}
                  icon={<X />}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(new Set())}
                />
              </div>
            )}

            <Table>
              <TableHeader className={cn(selected.size > 0 && 'sr-only')}>
                <TableRow>
                  <TableHead className={STICKY_CHECK}>
                    <Checkbox
                      aria-label={t('table.selectAllPage')}
                      checked={allOnPage ? true : someOnPage ? 'indeterminate' : false}
                      onCheckedChange={(c) => toggleAll(c === true)}
                      disabled={loading || rows.length === 0}
                    />
                  </TableHead>
                  <TableSortHeader
                    sortKey="name"
                    currentSort={sort}
                    onSortChange={onSort}
                    className={STICKY_NAME}
                  >
                    {t('col.name')}
                  </TableSortHeader>
                  <TableSortHeader sortKey="status" currentSort={sort} onSortChange={onSort}>
                    {t('col.status')}
                  </TableSortHeader>
                  <TableSortHeader
                    sortKey="owner"
                    currentSort={sort}
                    onSortChange={onSort}
                    className="hidden md:table-cell"
                  >
                    {t('col.owner')}
                  </TableSortHeader>
                  <TableSortHeader
                    sortKey="updatedAt"
                    currentSort={sort}
                    onSortChange={onSort}
                    className="hidden sm:table-cell [&>button]:justify-end"
                  >
                    {t('col.updated')}
                  </TableSortHeader>
                  <TableHead className="w-24 text-right">
                    <span className="sr-only">{t('common.actions')}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 6 }, (_, i) => (
                      <TableRow key={`sk-${i}`} aria-hidden>
                        <TableCell>
                          <Skeleton className="size-4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" className="w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton variant="text" className="w-24" />
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Skeleton variant="text" className="ml-auto w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="ml-auto size-8" />
                        </TableCell>
                      </TableRow>
                    ))
                  : rows.map((p) => {
                      const rel = formatRelative(p.updatedAt, relativeTime);
                      const isSelected = selected.has(p.id);
                      return (
                        <TableRow key={p.id} selected={isSelected} className="group">
                          <TableCell className={STICKY_CHECK}>
                            <Checkbox
                              aria-label={t('row.select', { name: p.name })}
                              checked={isSelected}
                              onCheckedChange={(c) => toggleOne(p.id, c === true)}
                            />
                          </TableCell>
                          <TableCell
                            className={cn(
                              'text-foreground max-w-[280px] truncate font-medium',
                              STICKY_NAME,
                            )}
                            title={p.name}
                          >
                            {p.name}
                          </TableCell>
                          <TableCell>
                            <Badge tone={STATUS_TONE[p.status]}>
                              <StatusIcon tone={STATUS_TONE[p.status]} />
                              {t(STATUS_KEY[p.status])}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground-muted hidden md:table-cell">
                            {p.owner || '—'}
                          </TableCell>
                          <TableCell
                            className="tabular text-foreground-subtle hidden text-right sm:table-cell"
                            title={rel.title}
                          >
                            {rel.label}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-0.5">
                              <Tooltip label={t('common.edit')}>
                                <IconButton
                                  aria-label={t('row.edit', { name: p.name })}
                                  icon={<Pencil />}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditing(p);
                                    setDialogOpen(true);
                                  }}
                                />
                              </Tooltip>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <IconButton
                                    aria-label={t('row.more', { name: p.name })}
                                    icon={<MoreHorizontal />}
                                    variant="ghost"
                                    size="sm"
                                  />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onSelect={() => duplicate(p)}>
                                    <Copy className="size-4" aria-hidden /> {t('common.duplicate')}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onSelect={() => archive([p])}
                                    disabled={p.status === 'Archived'}
                                  >
                                    <Inbox className="size-4" aria-hidden /> {t('common.archive')}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    destructive
                                    onSelect={() => setPendingDelete([p])}
                                  >
                                    <Trash2 className="size-4" aria-hidden /> {t('common.delete')}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                {!loading && filteredEmpty && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      {/* Filtered-empty: header + chips stay so the filter can be undone. */}
                      <EmptyState
                        icon={<Folder />}
                        title={t('projects.noMatch')}
                        description={
                          debouncedQuery.length >= 2
                            ? t('projects.noMatchQuery', { query })
                            : t('projects.noMatchDesc')
                        }
                        action={
                          <Button variant="outline" size="sm" onClick={clearFilters}>
                            {t('filter.clear')}
                          </Button>
                        }
                        className="min-h-[200px] rounded-none border-0 bg-transparent"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {!filteredEmpty && (
            <Pagination
              className="mt-4"
              page={current}
              pageCount={pageCount}
              onPageChange={setPage}
              totalItems={filtered.length}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZES}
              labels={{
                showing: (from, to, total) => `${from}–${to} / ${formatNumber(total)}`,
              }}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(1);
              }}
            />
          )}
        </>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSave={save}
      />

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title={
          pendingDelete && pendingDelete.length === 1
            ? t('delete.titleOne', { name: pendingDelete[0].name })
            : t('delete.titleN', { n: pendingDelete?.length ?? 0 })
        }
        description={t('delete.desc')}
        confirmLabel={
          pendingDelete && pendingDelete.length === 1
            ? t('delete.confirmOne')
            : t('delete.confirmN')
        }
        confirmVariant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
});

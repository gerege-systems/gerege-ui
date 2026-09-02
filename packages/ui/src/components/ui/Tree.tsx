'use client';

import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChevronRight, File as FileIcon, Folder, FolderOpen } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';

export interface TreeNode {
  id: string;
  label: ReactNode;
  /** If undefined the node is a leaf; if empty array it is an empty folder. */
  children?: TreeNode[];
  /** Optional custom icon (overrides default file/folder icons). */
  icon?: ReactNode;
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** The root nodes. */
  data: TreeNode[];
  /** Ids to expand by default (uncontrolled). */
  defaultExpanded?: string[];
  /** Controlled set of expanded ids. */
  expanded?: string[];
  /** Called with the full next set of expanded ids. */
  onExpandedChange?: (next: string[]) => void;
  /**
   * @deprecated Use `selected` + `onSelectedChange`. Kept for backward
   * compatibility; ignored when `selected` is present.
   */
  selectedId?: string;
  /**
   * Controlled selected id. The component is controlled whenever this key is
   * present in props (even as `undefined`), mirroring React inputs.
   */
  selected?: string;
  /** Default selected id (uncontrolled). */
  defaultSelected?: string;
  /**
   * @deprecated Use `onSelectedChange`. Still called on every activation.
   */
  onSelect?: (id: string) => void;
  /** Called when a node is activated (click / Enter / Space). */
  onSelectedChange?: (id: string) => void;
  /** Accessible name for the tree. */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
}

interface FlatNode {
  node: TreeNode;
  level: number;
  setSize: number;
  posInSet: number;
  parentId: string | null;
}

/**
 * Expandable file-tree style list following the WAI-ARIA tree pattern.
 * Single selection, roving tabindex (one tab stop), and full arrow-key
 * navigation: Up/Down move, Right expands or moves into a folder, Left
 * collapses or moves to the parent, Home/End jump, Enter/Space select.
 *
 * Expansion and selection are uncontrolled by default; pass
 * `expanded`/`onExpandedChange` and `selected`/`onSelectedChange` to control.
 */
export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(props, ref) {
  const {
    data,
    defaultExpanded = [],
    expanded: expandedProp,
    onExpandedChange,
    selectedId,
    selected: selectedProp,
    defaultSelected,
    onSelect,
    onSelectedChange,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...rest
  } = props;
  const isControlled = 'selected' in props || 'selectedId' in props;
  const strings = useStrings();
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded),
  );
  const expanded = useMemo(
    () => (expandedProp ? new Set(expandedProp) : internalExpanded),
    [expandedProp, internalExpanded],
  );

  const [internalSelected, setInternalSelected] = useState<string | undefined>(defaultSelected);
  const selected = isControlled ? (selectedProp ?? selectedId) : internalSelected;

  const [focusedId, setFocusedId] = useState<string | undefined>(undefined);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());

  const setExpanded = useCallback(
    (next: Set<string>) => {
      if (expandedProp === undefined) setInternalExpanded(next);
      onExpandedChange?.([...next]);
    },
    [expandedProp, onExpandedChange],
  );

  const setOpen = useCallback(
    (id: string, open: boolean) => {
      if (expanded.has(id) === open) return;
      const next = new Set(expanded);
      if (open) next.add(id);
      else next.delete(id);
      setExpanded(next);
    },
    [expanded, setExpanded],
  );

  const select = useCallback(
    (id: string) => {
      if (!isControlled) setInternalSelected(id);
      onSelect?.(id);
      onSelectedChange?.(id);
    },
    [onSelect, onSelectedChange, isControlled],
  );

  // Flatten the *visible* nodes in DOM order — this is what arrow keys walk.
  const visible = useMemo(() => {
    const out: FlatNode[] = [];
    const walk = (nodes: TreeNode[], level: number, parentId: string | null) => {
      nodes.forEach((node, i) => {
        out.push({ node, level, setSize: nodes.length, posInSet: i + 1, parentId });
        if (node.children && expanded.has(node.id)) walk(node.children, level + 1, node.id);
      });
    };
    walk(data, 1, null);
    return out;
  }, [data, expanded]);

  // The single tab stop: focused item if still visible, else selected, else first.
  const tabStopId =
    (focusedId && visible.some((v) => v.node.id === focusedId) && focusedId) ||
    (selected && visible.some((v) => v.node.id === selected) && selected) ||
    visible[0]?.node.id;

  const focusItem = (id: string | undefined) => {
    if (!id) return;
    setFocusedId(id);
    itemRefs.current.get(id)?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, flat: FlatNode) => {
    const { node } = flat;
    const hasChildren = !!node.children;
    const isOpen = expanded.has(node.id);
    const index = visible.findIndex((v) => v.node.id === node.id);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusItem(visible[index + 1]?.node.id);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusItem(visible[index - 1]?.node.id);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (hasChildren && !isOpen) setOpen(node.id, true);
        else if (hasChildren && isOpen) focusItem(node.children![0]?.id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (hasChildren && isOpen) setOpen(node.id, false);
        else if (flat.parentId) focusItem(flat.parentId);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(visible[0]?.node.id);
        break;
      case 'End':
        e.preventDefault();
        focusItem(visible[visible.length - 1]?.node.id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        select(node.id);
        if (hasChildren) setOpen(node.id, !isOpen);
        break;
      default:
        return;
    }
    e.stopPropagation();
  };

  function renderNode(
    node: TreeNode,
    level: number,
    setSize: number,
    posInSet: number,
    parentId: string | null,
  ): ReactNode {
    const hasChildren = !!node.children;
    const isOpen = expanded.has(node.id);
    const isSelected = selected === node.id;
    const DefaultIcon = hasChildren ? (isOpen ? FolderOpen : Folder) : FileIcon;
    const flat: FlatNode = { node, level, setSize, posInSet, parentId };

    return (
      <li
        data-slot="tree"
        key={node.id}
        ref={(el) => {
          if (el) itemRefs.current.set(node.id, el);
          else itemRefs.current.delete(node.id);
        }}
        role="treeitem"
        aria-expanded={hasChildren ? isOpen : undefined}
        aria-selected={isSelected}
        aria-level={level}
        aria-setsize={setSize}
        aria-posinset={posInSet}
        tabIndex={tabStopId === node.id ? 0 : -1}
        onFocus={(e) => {
          if (e.target === e.currentTarget) setFocusedId(node.id);
        }}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget) handleKeyDown(e, flat);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setFocusedId(node.id);
          select(node.id);
          if (hasChildren) setOpen(node.id, !isOpen);
        }}
        className="outline-none"
      >
        <div
          style={{ paddingLeft: `${level - 1 + 0.5}rem` }}
          className={cn(
            'flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-2 text-left text-sm',
            'hover:bg-background-muted',
            '[li:focus-visible>&]:ring-ring [li:focus-visible>&]:ring-offset-background [li:focus-visible>&]:ring-2 [li:focus-visible>&]:ring-offset-1',
            isSelected && 'bg-accent-soft text-foreground',
          )}
        >
          {hasChildren ? (
            <ChevronRight
              className={cn(
                'text-foreground-subtle size-3.5 shrink-0 transition-transform',
                isOpen && 'rotate-90',
              )}
              aria-hidden
            />
          ) : (
            <span className="w-3.5 shrink-0" aria-hidden />
          )}
          {node.icon ?? (
            <DefaultIcon className="text-foreground-muted size-4 shrink-0" aria-hidden />
          )}
          <span
            className="truncate"
            title={typeof node.label === 'string' ? node.label : undefined}
          >
            {node.label}
          </span>
        </div>
        {hasChildren && isOpen && (
          <ul role="group" className="mt-0.5">
            {node.children!.map((c, i) =>
              renderNode(c, level + 1, node.children!.length, i + 1, node.id),
            )}
          </ul>
        )}
      </li>
    );
  }

  return (
    <ul
      ref={ref}
      role="tree"
      aria-label={ariaLabel ?? (ariaLabelledby ? undefined : strings.tree.label)}
      aria-labelledby={ariaLabelledby}
      className={cn('flex flex-col gap-0.5', className)}
      {...rest}
    >
      {data.map((n, i) => renderNode(n, 1, data.length, i + 1, null))}
    </ul>
  );
});
Tree.displayName = 'Tree';

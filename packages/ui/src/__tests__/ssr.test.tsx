// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createElement, type ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import * as UI from '../index';
import { mnStrings } from '../lib/strings.mn';

/**
 * Every public component must render on the server: no `window` / `document` /
 * `matchMedia` access during render (the node environment has none, so any
 * access throws a ReferenceError) and no hook that needs the DOM. Compound
 * components are rendered as full compositions so Radix contexts exist.
 */

const FORWARD_REF = Symbol.for('react.forward_ref');
const MEMO = Symbol.for('react.memo');

function isComponent(v: unknown): boolean {
  if (typeof v === 'function') return true;
  if (typeof v === 'object' && v !== null) {
    const t = (v as { $$typeof?: symbol }).$$typeof;
    return t === FORWARD_REF || t === MEMO;
  }
  return false;
}

function FormTree() {
  const form = useForm<{ email: string }>({ defaultValues: { email: '' } });
  return (
    <UI.Form {...form}>
      <UI.FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <UI.FormItem>
            <UI.FormLabel>Email</UI.FormLabel>
            <UI.FormControl>
              <UI.Input {...field} />
            </UI.FormControl>
            <UI.FormDescription>We never share it.</UI.FormDescription>
            <UI.FormError />
          </UI.FormItem>
        )}
      />
    </UI.Form>
  );
}

const noop = () => {};
const data = [
  { x: 'a', y: 1 },
  { x: 'b', y: 3 },
  { x: 'c', y: 2 },
];

/** Root → tree. Every component export must appear either here or in `coveredBy`. */
const trees: Record<string, () => ReactElement> = {
  Accordion: () => (
    <UI.Accordion type="single" collapsible defaultValue="a">
      <UI.AccordionItem value="a">
        <UI.AccordionTrigger>Trigger</UI.AccordionTrigger>
        <UI.AccordionContent>Content</UI.AccordionContent>
      </UI.AccordionItem>
    </UI.Accordion>
  ),
  Alert: () => <UI.Alert title="Heads up">Body</UI.Alert>,
  Avatar: () => <UI.Avatar fallback="БД" alt="Бат Дорж" status="online" />,
  AvatarGroup: () => (
    <UI.AvatarGroup max={1}>
      <UI.Avatar fallback="A" />
      <UI.Avatar fallback="B" />
    </UI.AvatarGroup>
  ),
  Badge: () => <UI.Badge>New</UI.Badge>,
  Breadcrumbs: () => (
    <UI.Breadcrumbs
      items={[{ label: 'Home', href: '/' }, { label: 'Page', href: '/page' }, { label: 'Here' }]}
    />
  ),
  Button: () => <UI.Button loading>Save</UI.Button>,
  Calendar: () => <UI.Calendar mode="single" defaultMonth={new Date(2026, 0, 1)} />,
  Card: () => (
    <UI.Card>
      <UI.CardHeader>
        <UI.CardTitle>Title</UI.CardTitle>
        <UI.CardDescription>Desc</UI.CardDescription>
      </UI.CardHeader>
      <UI.CardContent>Body</UI.CardContent>
      <UI.CardFooter>Footer</UI.CardFooter>
    </UI.Card>
  ),
  Carousel: () => (
    <UI.Carousel>
      <UI.CarouselContent>
        <UI.CarouselItem>1</UI.CarouselItem>
        <UI.CarouselItem>2</UI.CarouselItem>
      </UI.CarouselContent>
      <UI.CarouselPrevious />
      <UI.CarouselNext />
    </UI.Carousel>
  ),
  Checkbox: () => <UI.Checkbox label="Accept" defaultChecked />,
  Combobox: () => (
    <UI.Combobox options={[{ value: 'a', label: 'A' }]} value="a" onChange={noop} label="Pick" />
  ),
  Command: () => (
    <UI.Command>
      <UI.CommandInput placeholder="Search" />
      <UI.CommandList>
        <UI.CommandEmpty>None</UI.CommandEmpty>
        <UI.CommandGroup heading="Group">
          <UI.CommandItem>
            Item <UI.CommandShortcut>⌘K</UI.CommandShortcut>
          </UI.CommandItem>
        </UI.CommandGroup>
        <UI.CommandSeparator />
      </UI.CommandList>
    </UI.Command>
  ),
  CommandDialog: () => (
    <UI.CommandDialog open onOpenChange={noop}>
      <UI.CommandInput />
      <UI.CommandList>
        <UI.CommandItem>Item</UI.CommandItem>
      </UI.CommandList>
    </UI.CommandDialog>
  ),
  ConfirmationDialog: () => (
    <UI.ConfirmationDialog open onOpenChange={noop} title="Delete?" onConfirm={noop} />
  ),
  ContextMenu: () => (
    <UI.ContextMenu>
      <UI.ContextMenuTrigger>Right click</UI.ContextMenuTrigger>
      <UI.ContextMenuPortal>
        <UI.ContextMenuContent>
          <UI.ContextMenuLabel>Label</UI.ContextMenuLabel>
          <UI.ContextMenuGroup>
            <UI.ContextMenuItem>
              Item <UI.ContextMenuShortcut>⌘C</UI.ContextMenuShortcut>
            </UI.ContextMenuItem>
          </UI.ContextMenuGroup>
          <UI.ContextMenuSeparator />
          <UI.ContextMenuCheckboxItem checked>Check</UI.ContextMenuCheckboxItem>
          <UI.ContextMenuRadioGroup value="a">
            <UI.ContextMenuRadioItem value="a">Radio</UI.ContextMenuRadioItem>
          </UI.ContextMenuRadioGroup>
          <UI.ContextMenuSub>
            <UI.ContextMenuSubTrigger>More</UI.ContextMenuSubTrigger>
            <UI.ContextMenuSubContent>
              <UI.ContextMenuItem>Sub</UI.ContextMenuItem>
            </UI.ContextMenuSubContent>
          </UI.ContextMenuSub>
        </UI.ContextMenuContent>
      </UI.ContextMenuPortal>
    </UI.ContextMenu>
  ),
  DataGrid: () => (
    <UI.DataGrid columns={[{ key: 'name', header: 'Name' }]} rows={[{ id: 1, name: 'Row' }]} />
  ),
  DatePicker: () => <UI.DatePicker value={new Date(2026, 0, 1)} onChange={noop} />,
  DateRangePicker: () => <UI.DateRangePicker onChange={noop} />,
  DesignSystemProvider: () => (
    <UI.DesignSystemProvider tokens={UI.brandPresets.blue} strings={mnStrings}>
      <UI.Button>OK</UI.Button>
    </UI.DesignSystemProvider>
  ),
  Dialog: () => (
    <UI.Dialog open>
      <UI.DialogTrigger>Open</UI.DialogTrigger>
      <UI.DialogPortal>
        <UI.DialogOverlay />
        <UI.DialogContent>
          <UI.DialogHeader>
            <UI.DialogTitle>Title</UI.DialogTitle>
            <UI.DialogDescription>Desc</UI.DialogDescription>
          </UI.DialogHeader>
          <UI.DialogBody>Body</UI.DialogBody>
          <UI.DialogFooter>
            <UI.DialogClose>Close</UI.DialogClose>
          </UI.DialogFooter>
        </UI.DialogContent>
      </UI.DialogPortal>
    </UI.Dialog>
  ),
  Drawer: () => (
    <UI.Drawer open>
      <UI.DrawerTrigger>Open</UI.DrawerTrigger>
      <UI.DrawerPortal>
        <UI.DrawerOverlay />
        <UI.DrawerContent>
          <UI.DrawerHeader>
            <UI.DrawerTitle>Title</UI.DrawerTitle>
            <UI.DrawerDescription>Desc</UI.DrawerDescription>
          </UI.DrawerHeader>
          <UI.DrawerFooter>
            <UI.DrawerClose>Close</UI.DrawerClose>
          </UI.DrawerFooter>
        </UI.DrawerContent>
      </UI.DrawerPortal>
    </UI.Drawer>
  ),
  DropdownMenu: () => (
    <UI.DropdownMenu open>
      <UI.DropdownMenuTrigger>Menu</UI.DropdownMenuTrigger>
      <UI.DropdownMenuPortal>
        <UI.DropdownMenuContent>
          <UI.DropdownMenuLabel>Label</UI.DropdownMenuLabel>
          <UI.DropdownMenuGroup>
            <UI.DropdownMenuItem>
              Item <UI.DropdownMenuShortcut>⌘K</UI.DropdownMenuShortcut>
            </UI.DropdownMenuItem>
          </UI.DropdownMenuGroup>
          <UI.DropdownMenuSeparator />
          <UI.DropdownMenuCheckboxItem checked>Check</UI.DropdownMenuCheckboxItem>
          <UI.DropdownMenuRadioGroup value="a">
            <UI.DropdownMenuRadioItem value="a">Radio</UI.DropdownMenuRadioItem>
          </UI.DropdownMenuRadioGroup>
          <UI.DropdownMenuSub>
            <UI.DropdownMenuSubTrigger>More</UI.DropdownMenuSubTrigger>
            <UI.DropdownMenuSubContent>
              <UI.DropdownMenuItem>Sub</UI.DropdownMenuItem>
            </UI.DropdownMenuSubContent>
          </UI.DropdownMenuSub>
        </UI.DropdownMenuContent>
      </UI.DropdownMenuPortal>
    </UI.DropdownMenu>
  ),
  EmptyState: () => <UI.EmptyState title="Nothing here" description="Add one" />,
  ErrorState: () => <UI.ErrorState variant="404" onRetry={noop} />,
  FileUpload: () => <UI.FileUpload value={[]} onChange={noop} />,
  Form: () => <FormTree />,
  IconButton: () => <UI.IconButton icon={<UI.Icons.Plus />} aria-label="Add" />,
  Input: () => <UI.Input label="Name" helperText="Hint" clearable defaultValue="x" />,
  Kbd: () => <UI.Kbd>⌘K</UI.Kbd>,
  LineChart: () => <UI.LineChart data={data} caption="Line" />,
  AreaChart: () => <UI.AreaChart data={data} caption="Area" showTableToggle />,
  BarChart: () => <UI.BarChart data={data} caption="Bar" state="loading" />,
  MultiSelect: () => (
    <UI.MultiSelect options={[{ value: 'a', label: 'A' }]} value={['a']} onChange={noop} />
  ),
  Pagination: () => <UI.Pagination page={2} pageCount={5} onPageChange={noop} />,
  Popover: () => (
    <UI.Popover open>
      <UI.PopoverAnchor />
      <UI.PopoverTrigger>Open</UI.PopoverTrigger>
      <UI.PopoverContent>
        Body <UI.PopoverClose>×</UI.PopoverClose>
      </UI.PopoverContent>
    </UI.Popover>
  ),
  Progress: () => <UI.Progress value={40} aria-label="Upload" />,
  ProgressCircle: () => <UI.ProgressCircle value={40} aria-label="Upload" />,
  RadioGroup: () => (
    <UI.RadioGroup defaultValue="a" aria-label="Choice">
      <UI.RadioItem value="a" label="A" />
      <UI.RadioItem value="b" label="B" />
    </UI.RadioGroup>
  ),
  RelativeTime: () => (
    <UI.RelativeTime date="2026-01-01T00:00:00Z" now={new Date('2026-01-01T00:05:00Z')} />
  ),
  ScrollArea: () => (
    <UI.ScrollArea className="h-20">
      <div>Content</div>
      <UI.ScrollBar orientation="horizontal" />
    </UI.ScrollArea>
  ),
  Select: () => (
    <UI.Select defaultValue="a">
      <UI.SelectTrigger aria-label="Pick" placeholder="Pick" />
      <UI.SelectContent>
        <UI.SelectScrollUpButton />
        <UI.SelectGroup>
          <UI.SelectLabel>Group</UI.SelectLabel>
          <UI.SelectItem value="a">A</UI.SelectItem>
        </UI.SelectGroup>
        <UI.SelectSeparator />
        <UI.SelectScrollDownButton />
      </UI.SelectContent>
    </UI.Select>
  ),
  Separator: () => <UI.Separator />,
  Sheet: () => (
    <UI.Sheet open>
      <UI.SheetTrigger>Open</UI.SheetTrigger>
      <UI.SheetPortal>
        <UI.SheetContent>
          <UI.SheetHeader>
            <UI.SheetTitle>Title</UI.SheetTitle>
            <UI.SheetDescription>Desc</UI.SheetDescription>
          </UI.SheetHeader>
          <UI.SheetFooter>
            <UI.SheetClose>Close</UI.SheetClose>
          </UI.SheetFooter>
        </UI.SheetContent>
      </UI.SheetPortal>
    </UI.Sheet>
  ),
  Sidebar: () => (
    <UI.Sidebar>
      <UI.SidebarSection label="Main">
        <UI.SidebarItem href="/" active icon={<UI.Icons.Home />}>
          Home
        </UI.SidebarItem>
        <UI.SidebarGroup label="More" icon={<UI.Icons.Folder />} defaultOpen>
          <UI.SidebarItem href="/a">A</UI.SidebarItem>
        </UI.SidebarGroup>
      </UI.SidebarSection>
    </UI.Sidebar>
  ),
  Skeleton: () => <UI.Skeleton delay={0} className="h-4 w-20" />,
  Slider: () => <UI.Slider defaultValue={[30]} aria-label="Volume" />,
  Snackbar: () => <UI.Snackbar variant="info" title="Saved" onClose={noop} />,
  Spinner: () => <UI.Spinner />,
  Stepper: () => <UI.Stepper steps={[{ title: 'One' }, { title: 'Two' }]} current={1} />,
  Switch: () => <UI.Switch label="Dark" defaultChecked />,
  Table: () => (
    <UI.Table>
      <UI.TableCaption>Caption</UI.TableCaption>
      <UI.TableHeader>
        <UI.TableRow>
          <UI.TableHead>Head</UI.TableHead>
          <UI.TableSortHeader sortKey="n" currentSort={null} onSortChange={noop}>
            Sort
          </UI.TableSortHeader>
        </UI.TableRow>
      </UI.TableHeader>
      <UI.TableBody>
        <UI.TableRow>
          <UI.TableCell>Cell</UI.TableCell>
        </UI.TableRow>
      </UI.TableBody>
      <UI.TableFooter>
        <UI.TableRow>
          <UI.TableCell>Foot</UI.TableCell>
        </UI.TableRow>
      </UI.TableFooter>
    </UI.Table>
  ),
  Tabs: () => (
    <UI.Tabs defaultValue="a">
      <UI.TabsList>
        <UI.TabsTrigger value="a">A</UI.TabsTrigger>
        <UI.TabsTrigger value="b">B</UI.TabsTrigger>
      </UI.TabsList>
      <UI.TabsContent value="a">Panel A</UI.TabsContent>
    </UI.Tabs>
  ),
  TagInput: () => <UI.TagInput label="Tags" defaultValue={['one']} />,
  Textarea: () => <UI.Textarea label="Notes" />,
  Timeline: () => (
    <UI.Timeline>
      <UI.TimelineItem>
        <UI.TimelineTime dateTime="2026-01-01">Jan 1</UI.TimelineTime>
        <UI.TimelineTitle>Created</UI.TimelineTitle>
        <UI.TimelineDescription>Desc</UI.TimelineDescription>
      </UI.TimelineItem>
    </UI.Timeline>
  ),
  Toast: () => (
    <UI.ToastProvider>
      <UI.Toast open variant="success">
        <UI.ToastTitle>Saved</UI.ToastTitle>
        <UI.ToastDescription>Desc</UI.ToastDescription>
        <UI.ToastAction altText="Undo">Undo</UI.ToastAction>
        <UI.ToastClose />
      </UI.Toast>
      <UI.ToastViewport />
    </UI.ToastProvider>
  ),
  Toaster: () => <UI.Toaster />,
  Tooltip: () => (
    <UI.TooltipProvider>
      <UI.Tooltip label="Hint">
        <UI.Button>Hover</UI.Button>
      </UI.Tooltip>
    </UI.TooltipProvider>
  ),
  TooltipProvider: () => (
    <UI.TooltipProvider>
      <UI.TooltipRoot open>
        <UI.TooltipTrigger>Trigger</UI.TooltipTrigger>
        <UI.TooltipContent>Content</UI.TooltipContent>
      </UI.TooltipRoot>
    </UI.TooltipProvider>
  ),
  TopNav: () => (
    <UI.TopNav logo={<span>Logo</span>}>
      <UI.TopNavLink href="/" active>
        Home
      </UI.TopNavLink>
    </UI.TopNav>
  ),
  Tree: () => (
    <UI.Tree
      data={[{ id: '1', label: 'Root', children: [{ id: '2', label: 'Child' }] }]}
      defaultExpanded={['1']}
    />
  ),
};

/** Exports rendered inside another tree above. */
const coveredBy: Record<string, string> = {
  AccordionItem: 'Accordion',
  AccordionTrigger: 'Accordion',
  AccordionContent: 'Accordion',
  CardHeader: 'Card',
  CardTitle: 'Card',
  CardDescription: 'Card',
  CardContent: 'Card',
  CardFooter: 'Card',
  CarouselContent: 'Carousel',
  CarouselItem: 'Carousel',
  CarouselPrevious: 'Carousel',
  CarouselNext: 'Carousel',
  CommandInput: 'Command',
  CommandList: 'Command',
  CommandEmpty: 'Command',
  CommandGroup: 'Command',
  CommandItem: 'Command',
  CommandShortcut: 'Command',
  CommandSeparator: 'Command',
  ContextMenuTrigger: 'ContextMenu',
  ContextMenuPortal: 'ContextMenu',
  ContextMenuContent: 'ContextMenu',
  ContextMenuLabel: 'ContextMenu',
  ContextMenuGroup: 'ContextMenu',
  ContextMenuItem: 'ContextMenu',
  ContextMenuShortcut: 'ContextMenu',
  ContextMenuSeparator: 'ContextMenu',
  ContextMenuCheckboxItem: 'ContextMenu',
  ContextMenuRadioGroup: 'ContextMenu',
  ContextMenuRadioItem: 'ContextMenu',
  ContextMenuSub: 'ContextMenu',
  ContextMenuSubTrigger: 'ContextMenu',
  ContextMenuSubContent: 'ContextMenu',
  DialogTrigger: 'Dialog',
  DialogPortal: 'Dialog',
  DialogOverlay: 'Dialog',
  DialogContent: 'Dialog',
  DialogHeader: 'Dialog',
  DialogBody: 'Dialog',
  DialogTitle: 'Dialog',
  DialogDescription: 'Dialog',
  DialogFooter: 'Dialog',
  DialogClose: 'Dialog',
  DrawerTrigger: 'Drawer',
  DrawerPortal: 'Drawer',
  DrawerOverlay: 'Drawer',
  DrawerContent: 'Drawer',
  DrawerHeader: 'Drawer',
  DrawerTitle: 'Drawer',
  DrawerDescription: 'Drawer',
  DrawerFooter: 'Drawer',
  DrawerClose: 'Drawer',
  DropdownMenuTrigger: 'DropdownMenu',
  DropdownMenuPortal: 'DropdownMenu',
  DropdownMenuContent: 'DropdownMenu',
  DropdownMenuLabel: 'DropdownMenu',
  DropdownMenuGroup: 'DropdownMenu',
  DropdownMenuItem: 'DropdownMenu',
  DropdownMenuShortcut: 'DropdownMenu',
  DropdownMenuSeparator: 'DropdownMenu',
  DropdownMenuCheckboxItem: 'DropdownMenu',
  DropdownMenuRadioGroup: 'DropdownMenu',
  DropdownMenuRadioItem: 'DropdownMenu',
  DropdownMenuSub: 'DropdownMenu',
  DropdownMenuSubTrigger: 'DropdownMenu',
  DropdownMenuSubContent: 'DropdownMenu',
  FormField: 'Form',
  FormItem: 'Form',
  FormLabel: 'Form',
  FormControl: 'Form',
  FormDescription: 'Form',
  FormError: 'Form',
  PopoverAnchor: 'Popover',
  PopoverTrigger: 'Popover',
  PopoverContent: 'Popover',
  PopoverClose: 'Popover',
  RadioItem: 'RadioGroup',
  ScrollBar: 'ScrollArea',
  SelectTrigger: 'Select',
  SelectValue: 'Select',
  SelectContent: 'Select',
  SelectScrollUpButton: 'Select',
  SelectScrollDownButton: 'Select',
  SelectGroup: 'Select',
  SelectLabel: 'Select',
  SelectItem: 'Select',
  SelectSeparator: 'Select',
  SheetTrigger: 'Sheet',
  SheetPortal: 'Sheet',
  SheetContent: 'Sheet',
  SheetHeader: 'Sheet',
  SheetTitle: 'Sheet',
  SheetDescription: 'Sheet',
  SheetFooter: 'Sheet',
  SheetClose: 'Sheet',
  SidebarSection: 'Sidebar',
  SidebarItem: 'Sidebar',
  SidebarGroup: 'Sidebar',
  TableCaption: 'Table',
  TableHeader: 'Table',
  TableRow: 'Table',
  TableHead: 'Table',
  TableSortHeader: 'Table',
  TableBody: 'Table',
  TableCell: 'Table',
  TableFooter: 'Table',
  TabsList: 'Tabs',
  TabsTrigger: 'Tabs',
  TabsContent: 'Tabs',
  TimelineItem: 'Timeline',
  TimelineTime: 'Timeline',
  TimelineTitle: 'Timeline',
  TimelineDescription: 'Timeline',
  ToastProvider: 'Toast',
  ToastTitle: 'Toast',
  ToastDescription: 'Toast',
  ToastAction: 'Toast',
  ToastClose: 'Toast',
  ToastViewport: 'Toast',
  TooltipRoot: 'TooltipProvider',
  TooltipTrigger: 'TooltipProvider',
  TooltipContent: 'TooltipProvider',
  TopNavLink: 'TopNav',
};

const PORTAL_ONLY = new Set(['Toaster', 'CommandDialog', 'ConfirmationDialog']);

const componentExports = Object.entries(UI)
  .filter(([name, v]) => /^[A-Z]/.test(name) && isComponent(v))
  .map(([name]) => name);

describe('SSR: every public component renders with renderToString (node, no DOM)', () => {
  it('has a render tree for every component export', () => {
    const missing = componentExports.filter((n) => !(n in trees) && !(n in coveredBy));
    expect(missing, `add an SSR tree for: ${missing.join(', ')}`).toEqual([]);
    const stale = [...Object.keys(trees), ...Object.keys(coveredBy)].filter(
      (n) => !componentExports.includes(n),
    );
    expect(stale, `trees reference unknown exports: ${stale.join(', ')}`).toEqual([]);
    for (const [part, root] of Object.entries(coveredBy)) {
      expect(trees[root], `${part} says it is covered by ${root}, which has no tree`).toBeDefined();
    }
  });

  it('node environment really has no DOM', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  describe.each(Object.keys(trees))('%s', (name) => {
    it('renders to a non-empty string', () => {
      const html = renderToString(trees[name]());
      expect(typeof html).toBe('string');
      // Portal-only trees render nothing on the server (Radix Portal mounts
      // after hydration); everything else must emit markup.
      if (!PORTAL_ONLY.has(name)) expect(html.length).toBeGreaterThan(0);
    });

    it('renders with mnStrings inside DesignSystemProvider', () => {
      const html = renderToString(
        createElement(UI.DesignSystemProvider, { strings: mnStrings, children: trees[name]() }),
      );
      expect(typeof html).toBe('string');
    });
  });
});

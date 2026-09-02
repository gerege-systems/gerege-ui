/**
 * Library entry — re-exports primitives, patterns, hooks, and utilities.
 */

// Design-system CSS — compiled by the Tailwind Vite plugin into
// dist-lib/styles.css so `import '@gerege/ui/styles.css'` actually ships
// the tokens, base layer, and every utility the components reference.
import './styles/globals.css';

// Utilities
export * from './lib/utils';
export * from './lib/cva';
export { defaultStrings, formatString, type UiStrings, type DeepPartial } from './lib/strings';
export { mnStrings } from './lib/strings.mn';
export type { ReturnFocusRef } from './lib/return-focus';
export * from './lib/format';

// Hooks
export * from './hooks/use-media-query';
export * from './hooks/use-toast';
export * from './hooks/use-field-ids';
export * from './hooks/use-modifier-key';
export * from './hooks/use-delayed-loading';
export * from './hooks/use-debounce';
export { useStrings } from './hooks/use-strings';

// Icons (namespaced to avoid name collisions with consumer apps).
// The name-addressed <Icon name="…"> lives in the '@gerege/ui/icon' entry.
export * as Icons from './icons';

// Illustrations — refined-minimal line art for empty / error / 404 states
export * as Illustrations from './illustrations';

// Primitives
export * from './components/ui/Accordion';
export * from './components/ui/Alert';
export * from './components/ui/Avatar';
export * from './components/ui/Badge';
export * from './components/ui/Breadcrumbs';
export * from './components/ui/Button';
export * from './components/ui/Card';
export * from './components/ui/Checkbox';
export * from './components/ui/Combobox';
export * from './components/ui/CommandPalette';
export * from './components/ui/ContextMenu';
export * from './components/ui/DataGrid';
export * from './components/ui/DatePicker';
export * from './components/ui/DesignSystemProvider';
export * from './components/ui/Dialog';
export * from './components/ui/DropdownMenu';
export * from './components/ui/EmptyState';
export * from './components/ui/ErrorState';
export * from './components/ui/Form';
export * from './components/ui/IconButton';
export * from './components/ui/Input';
export * from './components/ui/Kbd';
export * from './components/ui/MultiSelect';
export * from './components/ui/Pagination';
export * from './components/ui/Popover';
export * from './components/ui/Progress';
export * from './components/ui/RadioGroup';
export * from './components/ui/ScrollArea';
export * from './components/ui/Select';
export * from './components/ui/Separator';
export * from './components/ui/Sheet';
export * from './components/ui/Sidebar';
export * from './components/ui/Skeleton';
export * from './components/ui/Slider';
export * from './components/ui/Spinner';
export * from './components/ui/Stepper';
export * from './components/ui/Switch';
export * from './components/ui/Table';
export * from './components/ui/Tabs';
export * from './components/ui/Textarea';
export * from './components/ui/Toast';
export * from './components/ui/Tooltip';
export * from './components/ui/TopNav';

// New in 0.2.0
export * from './components/ui/Calendar';
export * from './components/ui/Carousel';
export * from './components/ui/Chart';
export * from './components/ui/RelativeTime';
export * from './components/ui/Drawer';
export * from './components/ui/FileUpload';
export * from './components/ui/Snackbar';
export * from './components/ui/TagInput';
export * from './components/ui/Timeline';
export * from './components/ui/Tree';

// Note: page-level compositions (dashboard, settings, auth, pricing, …) are
// NOT shipped as components. They live in the showcase as copy-paste "blocks"
// assembled from these primitives — read the source and adapt it, rather than
// importing an opaque page. See the Templates section of the showcase.

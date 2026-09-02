/**
 * Curated re-exports from lucide-react. Components should import icons from
 * here, never directly from 'lucide-react', so the design system can swap
 * icon sets later if needed and so unused icons stay tree-shakable.
 *
 * Icons are imported via their per-module paths (not the package barrel) on
 * purpose: the `@gerege-systems/ui/icon` entry lazy-loads arbitrary icons through
 * lucide-react/dynamicIconImports, and if the barrel were in the static module
 * graph, Rollup would co-locate every dynamically imported icon into the
 * barrel's chunk — inlining the entire icon set instead of code-splitting it
 * (verified: the showcase vendor chunk goes 614 kB → 1.4 MB). The deep paths
 * are typed by `src/types/lucide-deep.d.ts`; each export is re-typed as
 * `LucideIcon` below so the emitted declarations only reference the package
 * root.
 *
 * Defaults applied at the call site:
 *   - 16px for inline-with-text usage
 *   - 20px for use inside buttons
 *   - strokeWidth 1.5
 */
import type { LucideIcon } from 'lucide-react';

import _AlertCircle from 'lucide-react/dist/esm/icons/alert-circle.js';
import _AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle.js';
import _ArrowDown from 'lucide-react/dist/esm/icons/arrow-down.js';
import _ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.js';
import _ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import _ArrowUp from 'lucide-react/dist/esm/icons/arrow-up.js';
import _ArrowUpDown from 'lucide-react/dist/esm/icons/arrow-up-down.js';
import _AtSign from 'lucide-react/dist/esm/icons/at-sign.js';
import _BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3.js';
import _Bell from 'lucide-react/dist/esm/icons/bell.js';
import _Bookmark from 'lucide-react/dist/esm/icons/bookmark.js';
import _Calendar from 'lucide-react/dist/esm/icons/calendar.js';
import _ChartPie from 'lucide-react/dist/esm/icons/chart-pie.js';
import _Check from 'lucide-react/dist/esm/icons/check.js';
import _Handshake from 'lucide-react/dist/esm/icons/handshake.js';
import _Image from 'lucide-react/dist/esm/icons/image.js';
import _CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2.js';
import _ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';
import _ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.js';
import _ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.js';
import _ChevronUp from 'lucide-react/dist/esm/icons/chevron-up.js';
import _ChevronsLeft from 'lucide-react/dist/esm/icons/chevrons-left.js';
import _ChevronsRight from 'lucide-react/dist/esm/icons/chevrons-right.js';
import _ChevronsUpDown from 'lucide-react/dist/esm/icons/chevrons-up-down.js';
import _Circle from 'lucide-react/dist/esm/icons/circle.js';
import _Copy from 'lucide-react/dist/esm/icons/copy.js';
import _CornerDownLeft from 'lucide-react/dist/esm/icons/corner-down-left.js';
import _CreditCard from 'lucide-react/dist/esm/icons/credit-card.js';
import _Download from 'lucide-react/dist/esm/icons/download.js';
import _Edit2 from 'lucide-react/dist/esm/icons/edit-2.js';
import _Ellipsis from 'lucide-react/dist/esm/icons/ellipsis.js';
import _ExternalLink from 'lucide-react/dist/esm/icons/external-link.js';
import _Eye from 'lucide-react/dist/esm/icons/eye.js';
import _EyeOff from 'lucide-react/dist/esm/icons/eye-off.js';
import _File from 'lucide-react/dist/esm/icons/file.js';
import _FileText from 'lucide-react/dist/esm/icons/file-text.js';
import _Filter from 'lucide-react/dist/esm/icons/filter.js';
import _Folder from 'lucide-react/dist/esm/icons/folder.js';
import _FolderOpen from 'lucide-react/dist/esm/icons/folder-open.js';
import _Github from 'lucide-react/dist/esm/icons/github.js';
import _GripVertical from 'lucide-react/dist/esm/icons/grip-vertical.js';
import _Heart from 'lucide-react/dist/esm/icons/heart.js';
import _HelpCircle from 'lucide-react/dist/esm/icons/help-circle.js';
import _Home from 'lucide-react/dist/esm/icons/home.js';
import _Inbox from 'lucide-react/dist/esm/icons/inbox.js';
import _Info from 'lucide-react/dist/esm/icons/info.js';
import _Kanban from 'lucide-react/dist/esm/icons/kanban.js';
import _Key from 'lucide-react/dist/esm/icons/key.js';
import _LayoutGrid from 'lucide-react/dist/esm/icons/layout-grid.js';
import _Link2 from 'lucide-react/dist/esm/icons/link-2.js';
import _Loader2 from 'lucide-react/dist/esm/icons/loader-2.js';
import _Lock from 'lucide-react/dist/esm/icons/lock.js';
import _LogOut from 'lucide-react/dist/esm/icons/log-out.js';
import _Mail from 'lucide-react/dist/esm/icons/mail.js';
import _Menu from 'lucide-react/dist/esm/icons/menu.js';
import _MessageSquare from 'lucide-react/dist/esm/icons/message-square.js';
import _Minus from 'lucide-react/dist/esm/icons/minus.js';
import _Moon from 'lucide-react/dist/esm/icons/moon.js';
import _MoreHorizontal from 'lucide-react/dist/esm/icons/more-horizontal.js';
import _Package from 'lucide-react/dist/esm/icons/package.js';
import _Pencil from 'lucide-react/dist/esm/icons/pencil.js';
import _Plug from 'lucide-react/dist/esm/icons/plug.js';
import _Plus from 'lucide-react/dist/esm/icons/plus.js';
import _Receipt from 'lucide-react/dist/esm/icons/receipt.js';
import _Search from 'lucide-react/dist/esm/icons/search.js';
import _Settings from 'lucide-react/dist/esm/icons/settings.js';
import _ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.js';
import _Sparkles from 'lucide-react/dist/esm/icons/sparkles.js';
import _Star from 'lucide-react/dist/esm/icons/star.js';
import _Sun from 'lucide-react/dist/esm/icons/sun.js';
import _Tags from 'lucide-react/dist/esm/icons/tags.js';
import _Trash2 from 'lucide-react/dist/esm/icons/trash-2.js';
import _Upload from 'lucide-react/dist/esm/icons/upload.js';
import _User from 'lucide-react/dist/esm/icons/user.js';
import _Users from 'lucide-react/dist/esm/icons/users.js';
import _Wallet from 'lucide-react/dist/esm/icons/wallet.js';
import _X from 'lucide-react/dist/esm/icons/x.js';
import _XCircle from 'lucide-react/dist/esm/icons/x-circle.js';
import _Zap from 'lucide-react/dist/esm/icons/zap.js';

export const AlertCircle: LucideIcon = _AlertCircle;
export const AlertTriangle: LucideIcon = _AlertTriangle;
export const ArrowDown: LucideIcon = _ArrowDown;
export const ArrowLeft: LucideIcon = _ArrowLeft;
export const ArrowRight: LucideIcon = _ArrowRight;
export const ArrowUp: LucideIcon = _ArrowUp;
export const ArrowUpDown: LucideIcon = _ArrowUpDown;
export const AtSign: LucideIcon = _AtSign;
export const BarChart3: LucideIcon = _BarChart3;
export const Bell: LucideIcon = _Bell;
export const Bookmark: LucideIcon = _Bookmark;
export const Calendar: LucideIcon = _Calendar;
export const ChartPie: LucideIcon = _ChartPie;
export const Check: LucideIcon = _Check;
export const Handshake: LucideIcon = _Handshake;
export const ImageIcon: LucideIcon = _Image;
export const CheckCircle2: LucideIcon = _CheckCircle2;
export const ChevronDown: LucideIcon = _ChevronDown;
export const ChevronLeft: LucideIcon = _ChevronLeft;
export const ChevronRight: LucideIcon = _ChevronRight;
export const ChevronUp: LucideIcon = _ChevronUp;
export const ChevronsLeft: LucideIcon = _ChevronsLeft;
export const ChevronsRight: LucideIcon = _ChevronsRight;
export const ChevronsUpDown: LucideIcon = _ChevronsUpDown;
export const Circle: LucideIcon = _Circle;
export const Copy: LucideIcon = _Copy;
export const CornerDownLeft: LucideIcon = _CornerDownLeft;
export const CreditCard: LucideIcon = _CreditCard;
export const Download: LucideIcon = _Download;
export const Edit2: LucideIcon = _Edit2;
export const Ellipsis: LucideIcon = _Ellipsis;
export const ExternalLink: LucideIcon = _ExternalLink;
export const Eye: LucideIcon = _Eye;
export const EyeOff: LucideIcon = _EyeOff;
export const File: LucideIcon = _File;
export const FileText: LucideIcon = _FileText;
export const Filter: LucideIcon = _Filter;
export const Folder: LucideIcon = _Folder;
export const FolderOpen: LucideIcon = _FolderOpen;
export const Github: LucideIcon = _Github;
export const GripVertical: LucideIcon = _GripVertical;
export const Heart: LucideIcon = _Heart;
export const HelpCircle: LucideIcon = _HelpCircle;
export const Home: LucideIcon = _Home;
export const Inbox: LucideIcon = _Inbox;
export const Info: LucideIcon = _Info;
export const Kanban: LucideIcon = _Kanban;
export const Key: LucideIcon = _Key;
export const LayoutGrid: LucideIcon = _LayoutGrid;
export const Link2: LucideIcon = _Link2;
export const Loader2: LucideIcon = _Loader2;
export const Lock: LucideIcon = _Lock;
export const LogOut: LucideIcon = _LogOut;
export const Mail: LucideIcon = _Mail;
export const Menu: LucideIcon = _Menu;
export const MessageSquare: LucideIcon = _MessageSquare;
export const Minus: LucideIcon = _Minus;
export const Moon: LucideIcon = _Moon;
export const MoreHorizontal: LucideIcon = _MoreHorizontal;
export const Package: LucideIcon = _Package;
export const Pencil: LucideIcon = _Pencil;
export const Plug: LucideIcon = _Plug;
export const Plus: LucideIcon = _Plus;
export const Receipt: LucideIcon = _Receipt;
export const Search: LucideIcon = _Search;
export const Settings: LucideIcon = _Settings;
export const ShoppingCart: LucideIcon = _ShoppingCart;
export const Sparkles: LucideIcon = _Sparkles;
export const Star: LucideIcon = _Star;
export const Sun: LucideIcon = _Sun;
export const Tags: LucideIcon = _Tags;
export const Trash2: LucideIcon = _Trash2;
export const Upload: LucideIcon = _Upload;
export const User: LucideIcon = _User;
export const Users: LucideIcon = _Users;
export const Wallet: LucideIcon = _Wallet;
export const X: LucideIcon = _X;
export const XCircle: LucideIcon = _XCircle;
export const Zap: LucideIcon = _Zap;

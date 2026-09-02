'use client';

/**
 * Secondary entry — `@gerege-systems/ui/icon`.
 *
 * Name-addressed `<Icon name="…">` plus the full `iconNames` list. Kept out of
 * the main barrel because it references `lucide-react/dynamicIconImports`
 * (a map of ~1500 lazy imports) which bundlers cannot tree-shake.
 */
export { Icon, iconNames, type IconName, type IconProps } from './components/ui/Icon';

import { getBlock } from '../uiblocks/registry';
import { BlockDocPage } from './BlockDocPage';
import { NotFound } from './NotFound';

/**
 * The `#blocks/<slug>` route as one lazy module: the block registry (every
 * block component) loads only when a block or the blocks index is opened,
 * not with the home page. Slug lookup lives here for the same reason —
 * importing `getBlock` from App.tsx would pull the registry back in eagerly.
 */
export default function BlockRoute({ slug }: { slug: string }) {
  const block = getBlock(slug);
  if (!block) return <NotFound />;
  return <BlockDocPage block={block} />;
}

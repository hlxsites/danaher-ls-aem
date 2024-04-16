import { buildArticleSchema } from '../../scripts/schema.js';
import { buildBlock } from '../../scripts/lib-franklin.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const mainWrapper = main.querySelector(':scope > div:nth-child(2)');
  mainWrapper.prepend(
    buildBlock('social-media', { elems: [] }),
  );
  buildArticleSchema();
}

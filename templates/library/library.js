import { buildArticleSchema } from '../../scripts/schema.js';
import { buildBlock } from '../../scripts/lib-franklin.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  main.classList.add(...'flex flex-row gap-8 max-w-7xl mx-auto w-full bg-white'.split(' '));
  const mainWrapper = main.querySelector(':scope > div:nth-child(2)');
  mainWrapper.prepend(
    buildBlock('social-media', { elems: [] }),
  );
  buildArticleSchema();
}

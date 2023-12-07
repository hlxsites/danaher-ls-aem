import { div } from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const sideNavBlock = div(buildBlock('side-nav', { elems: [] }));
  sideNavBlock.querySelector('.side-nav').classList.add('topics');
  main.firstElementChild.insertAdjacentElement('afterend', sideNavBlock);
  main.querySelector(':scope > div:nth-child(3)')?.prepend(buildBlock('social-media', { elems: [] }));
  main.lastElementChild.append(buildBlock('social-media', { elems: [] }));

  buildArticleSchema();
}

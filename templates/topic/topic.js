import { div } from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const sideNavBlock = div(buildBlock('side-nav', { elems: [] }));
  sideNavBlock.querySelector('.side-nav').classList.add('topic-content');
  main.querySelector(':scope > div:nth-child(2)')?.prepend(buildBlock('social-media', { elems: [] }));
  main.firstElementChild.insertAdjacentElement('afterend', sideNavBlock);
  main.lastElementChild.append(buildBlock('social-media', { elems: [] }));
}

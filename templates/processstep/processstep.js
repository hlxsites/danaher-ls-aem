import { div } from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const defaultContent = main.querySelector('main > div > h1').parentElement;
  const sideNavBlock = div({ class: 'default-content-wrapper' }, buildBlock('side-nav', { elems: [] }), defaultContent);
  sideNavBlock.querySelector('.side-nav').classList.add('process-steps');
  main.children[1].insertAdjacentElement('afterend', sideNavBlock);
}

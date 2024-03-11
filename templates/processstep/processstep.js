import { div } from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const sideNavBlock = div(buildBlock('side-nav', { elems: [] }));
  sideNavBlock.querySelector('.side-nav').classList.add('process-steps');
  console.log(main.children[1]);
  main.children[1].insertAdjacentElement('afterend', sideNavBlock);
}

import { buildBlock } from '../../scripts/lib-franklin.js';

export default async function buildAutoBlocks(block) {
  block.querySelectorAll('h2')?.forEach(element => {
    element.classList.add('font-semibold', 'text-xl', 'text-danahergray-900');
  });
  const main = document.querySelector('main');
  const firstWrapper = main.querySelector(':scope > div');
  firstWrapper.prepend(
    buildBlock('social-media', { elems: [] }),
  );
  const lastWrapper = main.querySelector(':scope > div:last-of-type');
  lastWrapper.append(
    buildBlock('social-media', { elems: [] }),
  );
}

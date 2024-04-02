import { div } from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  main.querySelectorAll(':scope > div').forEach((section) => {
    section?.querySelector('h1')?.classList.add(...'my-2 py-2 px-0'.split(' '));
    section?.querySelectorAll('h2').forEach((contentWrapper) => {
      if (!['call-to-action', 'takeway'].includes(contentWrapper.parentElement.parentElement.parentElement.className)) {
        contentWrapper.classList.add('pt-8');
      }
      if (!['container-two-col'].includes(contentWrapper.parentElement.className)) {
        contentWrapper.classList.remove('pt-8');
      }
    });
    section?.querySelectorAll('h3, h4').forEach((contentWrapper) => {
      contentWrapper.classList.add('pt-8');
    });
    section?.querySelectorAll('img').forEach((contentWrapper) => {
      contentWrapper.classList.add(...'w-full mt-10 mb-4'.split(' '));
    });
  });
  main.querySelectorAll('p:not(.show-modal-btn)').forEach((contentWrapper) => {
    contentWrapper?.classList.add(...'!leading-7 !text-lg !mb-4 !text-danahergray-700'.split(' '));
  });
  const sideNavBlock = div(buildBlock('side-nav', { elems: [] }));
  sideNavBlock.querySelector('.side-nav').classList.add('topics');
  main.firstElementChild.insertAdjacentElement('afterend', sideNavBlock);
  main.querySelector(':scope > div:nth-child(3)')?.prepend(buildBlock('social-media', { elems: [] }));
  main.lastElementChild.append(buildBlock('social-media', { elems: [] }));

  buildArticleSchema();
}

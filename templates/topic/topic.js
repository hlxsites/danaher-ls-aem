import { div } from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { buildArticleSchema } from '../../scripts/schema.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  main.classList.add(...'grid px-4 lg:px-0 max-w-7xl mx-auto lg:grid-cols-12'.split(' '));
  main.querySelectorAll(':scope > div')?.forEach((section) => {
    section.querySelector('h1')?.classList.add(...'my-2 py-2 px-0'.split(' '));
    section.querySelectorAll('h2')?.forEach((contentWrapper) => {
      if (!['call-to-action', 'takeway'].includes(contentWrapper.parentElement?.parentElement?.parentElement.className)) {
        contentWrapper.classList.add('pt-8');
      }
      if (!['container-two-col'].includes(contentWrapper.parentElement.className)) {
        contentWrapper.classList.remove('pt-8');
      }
    });
    section.querySelectorAll('h3, h4')?.forEach((contentWrapper) => {
      contentWrapper.classList.add('pt-8');
    });
    section.querySelectorAll('img')?.forEach((contentWrapper) => {
      contentWrapper.classList.add(...'w-full mt-10 mb-4'.split(' '));
    });
  });

  const sideNavBlock = div(buildBlock('side-nav', { elems: [] }));
  sideNavBlock.querySelector('.side-nav').classList.add('topics');
  main.firstElementChild.insertAdjacentElement('afterend', sideNavBlock);
  sideNavBlock.classList.add(...'hidden lg:block lg:col-span-3 lg:col-start-1 lg:row-span-6 lg:pt-4 p-0'.split(' '));
  main.querySelector(':scope > div:nth-child(3)')?.prepend(buildBlock('social-media', { elems: [] }));
  main.lastElementChild.append(buildBlock('social-media', { elems: [] }));

  buildArticleSchema();
}

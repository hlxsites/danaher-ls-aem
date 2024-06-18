import { a } from '../../scripts/dom-builder.js';
import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

function goBack() {
  const backArr = window.location.pathname.split('/');
  const backNavigationPath = backArr.slice(0, (backArr.length - 1)).join('/');
  return `${window.location.origin}${backNavigationPath}`;
}

export default function decorate(block) {
  const articleType = getMetadata('template').toLowerCase();
  block.classList.add(...'relative z-10 flex items-center justify-between mb-8 text-gray-600 pt-4 pb-10'.split(' '));
  // eslint-disable-next-line no-script-url
  const goParentBack = a({ class: 'my-auto text-base text-danaherpurple-500 font-semibold', href: goBack() }, `← Back to ${articleType}`);
  block.prepend(goParentBack);
  block.parentElement.classList.add(...'col-span-12'.split(' '));
  document.querySelector('main .col-12-container-block')?.prepend(block.parentElement);
  decorateIcons(block);
}

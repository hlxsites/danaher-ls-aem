import { a } from '../../scripts/dom-builder.js';
import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';

function goBack() {
  const backArr = window.location.pathname.split('/');
  const backNavigationPath = backArr.slice(0, (backArr.length - 1)).join('/');
  window.location.href = backNavigationPath;
}

export default function decorate(block) {
  const articleType = getMetadata('template').toLowerCase();
  block.classList.add(...'relative z-10 flex items-center justify-between mb-4 text-gray-600 pt-6 pb-2'.split(' '));
  // eslint-disable-next-line no-script-url
  const goParentBack = a({ class: 'my-auto text-base text-danaherpurple-500 font-semibold', href: 'javascript:void(0)' }, `← Back to ${articleType}`);
  block.prepend(goParentBack);
  block.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    goBack();
  });
  decorateIcons(block);
}

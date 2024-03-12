import { button, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function goBack() {
  const backArr = window.location.pathname.split('/');
  const backNavigationPath = backArr.slice(0, (backArr.length - 1)).join('/');
  window.location.href = backNavigationPath;
}

export default function decorate(block) {
  block.classList.add(...'relative z-10 flex items-center justify-between mb-4 text-gray-600 pt-6 pb-2'.split(' '));
  const goParentBack = button({ 'aria-label': 'back', class: 'back-btn', title: 'Back' }, span({ class: 'icon icon-back' }), span({ class: 'my-auto' }, 'Back'));
  goParentBack.addEventListener('click', goBack);
  if (goParentBack.className.includes('back-btn')) {
    goParentBack.classList.add(...'font-normal inline-flex items-center gap-4 transition leading-6 py-1 px-1.5 rounded-lg hover:bg-slate-900/[0.03]'.split(' '));
  }
  block.prepend(goParentBack);
  decorateIcons(block);
}

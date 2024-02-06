import { button, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function goBack() {
  const backArr = window.location.pathname.split('/');
  const backNavigationPath = backArr.slice(0, (backArr.length - 1)).join('/');
  window.location.href = backNavigationPath;
}

const social = `
  <div class="social-links">
    <a href="javascript:window.print();" aria-label="print" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]" title="Print">
      <span class="icon icon-print"></span>
    </a>
    <a href="javascript:window.open('//twitter.com/intent/tweet?' + location.href + '&title=' + encodeURI(document.title) )" title="Twitter" aria-label="twitter" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
      <span class="icon icon-twitter"></span>
    </a>
    <a href="javascript:window.open('//www.linkedin.com/shareArticle?mini=true&url=' + location.href + '&title=' + document.title )" title="LinkedIn" aria-label="linkedin" class="rounded-lg transition leading-6 py-1 px-1.5 hover:bg-slate-900/[0.03]">
      <span class="icon icon-linkedin"></span>
    </a>
  </div>
`;

export default function decorate(block) {
  block.classList.add(...'relative z-10 flex items-center justify-between mb-4 text-gray-600 pt-6 pb-2'.split(' '));
  const goParentBack = button({ 'aria-label': 'back', class: 'back-btn', title: 'Back' }, span({ class: 'icon icon-back' }), span({ class: 'my-auto' }, 'Back'));
  goParentBack.addEventListener('click', goBack);
  block.innerHTML = social;
  const childDivs = block.childNodes;
  childDivs.forEach((divs, index) => {
    if (index === 1) divs.remove();
  });
  if (goParentBack.className.includes('back-btn')) {
    goParentBack.classList.add(...'font-normal inline-flex items-center gap-4 transition leading-6 py-1 px-1.5 rounded-lg hover:bg-slate-900/[0.03]'.split(' '));
  }
  block.querySelectorAll('div.social-links').forEach((item) => {
    item?.classList?.add(...'flex items-center gap-3'.split(' '));
    const ancs = item?.querySelector('a');
    ancs?.classList?.add(...'font-normal inline-flex items-center gap-4 transition leading-6 py-1 px-1.5 rounded-lg hover:bg-slate-900/[0.03]'.split(' '));
  });
  block.prepend(goParentBack);
  decorateIcons(block);
}

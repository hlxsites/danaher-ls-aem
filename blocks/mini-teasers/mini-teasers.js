import { decorateModals } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add(...'grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 px-2 mb-10 mt-4'.split(' '));
  [...block.children].forEach((element) => {
    if ([...block.children].length === 4) block.classList.add('lg:grid-cols-4');
    else block.classList.add('lg:grid-cols-3');
    element.classList.add(...'items-center mt-2'.split(' '));
    element.querySelector('span')?.classList.add(...'w-16 h-16 stroke-current'.split(' '));
    const h3El = element.querySelector('h3');
    if (h3El) {
      h3El.classList.add(...'mt-4 mb-0 h-16 line-clamp-2 break-words'.split(' '));
      h3El.title = h3El.textContent;
    }
    const pEl = element.querySelector('p');
    if (pEl) {
      pEl.classList.add(...'line-clamp-3 h-24 pt-4 break-words'.split(' '));
      pEl.title = pEl.textContent;
    }
    if (pEl.firstElementChild !== null) pEl?.parentNode?.firstElementChild?.classList.remove('h-20');
    const link = element.querySelector('a');
    if (link) {
      link.parentNode.classList.add('pt-4');
      link.innerHTML += ' ->';
      link.classList.add(...'text-base font-semibold text-danaherpurple-500'.split(' '));
      if (link.href.endsWith('#RequestAQuote')) link.classList.add('show-modal-btn');
    }
  });
  if (block.classList.contains('add-border')) block.classList.add(...'border-t border-b border-solid border-black'.split(' '));
  decorateModals(block);
}

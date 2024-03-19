import { decorateModals } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add(...'grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 px-2 my-16'.split(' '));
  [...block.children].forEach((element) => {
    if ([...block.children].length === 4) block.classList.add('lg:grid-cols-4');
    else block.classList.add('lg:grid-cols-3');
    element.classList.add(...'items-center'.split(' '));
    element.querySelector('span')?.classList.add(...'w-16 h-16'.split(' '));
    element.querySelector('h3')?.classList.add(...'text-lg mt-4 mb-0 sm:text-lg font-medium'.split(' '));
    const link = element.querySelector('a');
    if (link) {
      link.parentNode.classList.add('pt-4');
      link.innerHTML += ' ->';
      link.classList.add(...'text-sm font-bold text-danaherpurple-500'.split(' '));
      if (link.href.endsWith('#RequestAQuote')) link.classList.add('show-modal-btn');
    }
  });
  if (!block.classList.contains('no-border')) block.parentNode.classList.add(...'my-6 border-t border-b border-solid border-black'.split(' '));
  decorateModals(block);
}

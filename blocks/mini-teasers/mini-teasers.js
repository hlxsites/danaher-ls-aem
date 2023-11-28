import { decorateModals } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.parentNode.prepend(document.createElement('hr'));
  // block.classList.add(...'flex flex-row my-16'.split(' '));
  block.classList.add(...'grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0 my-16'.split(' '));
  [...block.children].forEach((element) => {
    element.classList.add(...'items-start mr-20 lg:mr-56'.split(' '));
    element.querySelector('img')?.classList.add('py-1');
    element.querySelector('h3')?.classList.add(...'text-base p-0 my-1 sm:text-sm font-normal'.split(' '));
    const link = element.querySelector('a');
    if (link) {
      link.innerHTML += ' ->';
      link.classList.add(...'text-sm font-medium text-danaherpurple-500'.split(' '));
      if (link.href.endsWith('#RequestAQuote')) link.classList.add('show-modal-btn');
    }
  });
  block.parentNode.append(document.createElement('hr'));
  block.parentNode.classList.add('py-6');
  decorateModals(block);
}

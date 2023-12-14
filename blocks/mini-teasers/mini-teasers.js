import { decorateModals } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add(...'grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0 my-16'.split(' '));
  [...block.children].forEach((element) => {
    element.classList.add(...'items-start pl-8 lg:pl-0 mr-20 lg:mr-40'.split(' '));
    element.querySelector('span')?.classList.add(...'w-16 h-16'.split(' '));
    element.querySelector('h3')?.classList.add(...'text-lg pl-2 mt-4 mb-0 sm:text-lg font-medium'.split(' '));
    const link = element.querySelector('a');
    if (link) {
      link.innerHTML += ' ->';
      link.classList.add(...'pl-2 text-sm font-medium text-danaherpurple-500'.split(' '));
      if (link.href.endsWith('#RequestAQuote')) link.classList.add('show-modal-btn');
    }
  });
  block.parentNode.classList.add(...'my-6 border-t border-b border-solid border-black'.split(' '));
  decorateModals(block);
}

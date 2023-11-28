import { decorateModals } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.parentNode.prepend(document.createElement('hr'));
  block.classList.add(...'flex flex-row my-16'.split(' '));
  [...block.children].forEach((element) => {
    element.classList.add(...'pr-60 w-full'.split(' '));
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

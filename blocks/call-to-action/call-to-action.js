import { decorateModals } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList = 'ctasection mx-auto max-w-7xl sm:px-6 lg:py-8 lg:px-6';
  block.querySelector(':scope div > div').classList.add(...'md:flex space-y-8 md:space-y-0 md:flex-row w-full py-8 md:py-16 md:px-12 px-6 items-center md:justify-between bg-danaherpurple-800'.split(' '));
  block.querySelector('h2').classList.add(...'text-2xl p-0 m-0 tracking-tight sm:text-3xl text-white font-normal'.split(' '));
  block.querySelector('p').classList.add(...'show-modal-btn btn btn-outline-trending-brand rounded-full px-6 py-3'.split(' '));
  decorateModals(block);
}

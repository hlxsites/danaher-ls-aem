import { a } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const talkToAnExpertText = block?.firstElementChild?.textContent;
  block.innerHTML = '';
  block.classList.add(...'relative z-10 flex items-center justify-between mb-8 text-gray-600 pt-4 pb-0 md:pb-10'.split(' '));
  // eslint-disable-next-line no-script-url
  const goParentBack = a({ class: 'my-auto text-base text-danaherpurple-500 font-semibold' }, `${talkToAnExpertText}`);
  block.prepend(goParentBack);
  block.parentElement.classList.add(...'col-span-12'.split(' '));
  document.querySelector('main .col-12-container-block')?.prepend(block.parentElement);
  decorateIcons(block);
}

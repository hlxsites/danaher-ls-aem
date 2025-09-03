import { a } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const talkToAnExpertText = block?.firstElementChild?.textContent;
  block.innerHTML = '';
  block.classList.add(...'align-text-center w-full h-full'.split(' '));
  // eslint-disable-next-line no-script-url
  const goParentBack = a({ class: 'my-auto text-base text-danaherpurple-500 font-semibold' }, `${talkToAnExpertText}`);
  block.prepend(goParentBack);
  block.parentElement.classList.add(...'col-span-12'.split(' '));
  document.querySelector('main .col-12-container-block')?.prepend(block.parentElement);
  decorateIcons(block);
}

import { div, strong } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.classList.add(...'space-y-4 divide-y'.split(' '));
  [...block.children].forEach((row) => {
    row.querySelectorAll('picture').forEach((picItem) => {
      picItem?.parentElement?.parentElement?.classList.add(...'w-full card flex flex-col md:flex-row py-4 gap-x-2 gap-y-4 items-start md:items-center'.split(' '));
      picItem?.parentElement?.classList.add(...'card-image flex'.split(' '));
      picItem?.classList.add(...'w-64 h-64 block md:w-52 md:h-36 rounded-md shrink-0 mb-3 md:mb-0 object-cover aspect-video'.split(' '));
    });
    const pEl = row.querySelector('p');
    pEl?.parentElement.classList.add(...'card-body w-full'.split(' '));
    pEl?.classList.add(...'text-sm break-words text-danaherlightblue-500'.split(' '));
    const h2El = row.querySelector('h2');
    h2El?.classList.add(...'text-base tracking-tight text-gray-900 font-semibold'.split(' '));
    row.querySelectorAll('p > strong').forEach((tagItem) => {
      const tagsEl = tagItem.innerHTML.split(', ');
      const tagsParent = tagItem.parentElement;
      tagsParent.classList.add(...'space-x-2'.split(' '));
      tagsParent.innerHTML = '';
      tagsEl.forEach((tagName) => {
        const strongTag = strong({ class: 'text-xs font-semibold tracking-wide px-3 py-1 bg-darkblue-50 rounded-full font-sans' }, tagName);
        tagsParent.append(strongTag);
      });
    });
    const allBtns = row.querySelectorAll('p.button-container');
    if (allBtns.length > 0) {
      const actions = div({ class: 'flex flex-col md:flex-row gap-5' });
      allBtns.forEach((btnEl) => {
        btnEl.querySelector('a')?.classList.add(...'px-6 rounded-full !no-underline'.split(' '));
        actions.append(btnEl);
      });
      row.append(actions);
    }
  });
}

import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block.id = 'resources-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.replaceChildren();
  block.append(div({ class: 'block-pdp-page-tabs' }, 'PDP Resources Block'));
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

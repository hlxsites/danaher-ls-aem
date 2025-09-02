import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block.id = 'products-tab';
  block.append(div({ class: 'block-pdp-carousel' }));
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

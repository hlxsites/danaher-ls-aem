import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  block.replaceChildren();
  block.id = 'overview-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.innerHTML = response?.raw?.richlongdescription || '';
  block.prepend(div({ class: 'text-2xl text-black' }, 'Description'));
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  block.replaceChildren();
  block.id = 'description-tab';
  block.innerHTML = response?.raw?.richlongdescription || '';
  block.prepend(div({ class: 'text-2xl text-black pt-6' }, 'Description'));
}

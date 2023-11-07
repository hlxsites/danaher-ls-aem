import ffetch from '../../scripts/ffetch.js';
import {
  ul, li, a, p, div, span, h2, h4,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';
import { getMetadata } from '../../scripts/lib-franklin.js';

function createCard(product, firstCard = false) {
  const cardWrapper = a(
    { href: makePublicUrl(product.path), title: product.title },
    imageHelper(product.image, product.title, firstCard),
    h4(
      {
        class: '!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14',
      },
      product.title,
    ),
    p({ class: '!px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20' }, product.description),
    div(
      { class: 'inline-flex items-center w-full px-6 py-5 space-x-4 bg-gray-100' },
      span({ class: 'btn-primary-purple border-8 px-2 !rounded-full' }, 'View Products'),
    ),
  );
  return li({
    class:
        'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl',
  }, cardWrapper);
}

export default async function decorate(block) {
  const category = getMetadata('category');

  let products = await ffetch('/us/en/products-index.json')
    .filter(({ parentCategory }) => parentCategory.toLowerCase() === category.toLowerCase())
    .all();

  products = products.sort((item1, item2) => item1.title.localeCompare(item2.title));

  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 py-4 sm:px-0 justify-items-center mt-3 mb-3',
  });

  products.forEach((product, index) => {
    cardList.append(createCard(product, index === 0));
  });

  block.textContent = '';
  if (products.length <= 0) {
    document.getElementById('categories').remove();
    return;
  }
  block.append(cardList);
}

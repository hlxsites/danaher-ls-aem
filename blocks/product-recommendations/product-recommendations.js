import { getProductRecommendationsResponse } from '../../scripts/commerce.js';
import {
  ul, a, p, div, span, h4, li, h3,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';

function createCard(product, idx, firstCard = false) {
  const cardWrapper = a(
    { href: makePublicUrl(product.path), title: product.title, index: idx + 1 },
    imageHelper(product.image, product.title, firstCard),
    h3(
      {
        class: '!px-7 !text-sm !font-normal !leading-5 !text-danaherpurple-500',
      },
      product.categoriesName,
    ),
    h4(
      {
        class: '!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14',
      },
      product.title,
    ),
    p({ class: '!px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20' }, product.description),
    div(
      { class: 'inline-flex items-center w-full px-6 py-5 space-x-4 bg-gray-100' },
      span({ class: 'btn-primary-purple border-8 px-2 !rounded-full' }, 'View'),
    ),
  );
  return li({
    class:
          'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl',
  }, cardWrapper);
}

export default async function decorate(block) {
  const response = await getProductRecommendationsResponse();

  if (response?.results.length > 0) {
    const cardList = ul({
      class: 'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 py-4 sm:px-0 justify-items-center mt-3 mb-3',
    });
    response.results.forEach((product, index) => {
      product.path = product.clickUri;
      product.image = product?.raw?.images[0];
      product.description = product?.raw?.description;
      const categoriesName = [];
      product?.raw?.categoriesname.forEach((element) => {
        if (!element.includes('|')) {
          categoriesName.push(element);
        }
      });
      product.categoriesName = categoriesName;
      cardList.append(createCard(product, index, index === 0));
    });

    const divEl = document.createElement('div');
    const h2pEl = document.createElement('h2');
    h2pEl.textContent = 'Frequently viewed together';
    divEl.append(h2pEl);
    block.innerHTML = '';
    block.append(divEl, cardList);
  }
}
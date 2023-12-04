import ffetch from '../../scripts/ffetch.js';
import { ul, li, a, h4, span } from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';
import { toClassName } from '../../scripts/lib-franklin.js';
import createFilters from './filter.js';

const getSelectionFromUrl = (field) => toClassName(new URLSearchParams(window.location.search).get(field)) || '';

function createCard(product, firstCard = false) {
  const cardWrapper = a(
    { href: makePublicUrl(product.path), title: product.title },
    imageHelper(product.image, product.title, firstCard),
    h4(
      {
        class: '!text-sm !font-normal !text-danahergray-900 !break-words !h-16',
      },
      product.title,
      span({ class: 'text-lg font-semibold text-danaherpurple-500' }, ' →'),
    ),
  );
  const card = li({
    class:
        'w-52 lg:w-44 h-52 flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border-l-0-5 border-black hover:scale-105 overflow-hidden bg-white max-w-xl pl-6 pr-6 lg:pr-0',
  }, cardWrapper);
  card.querySelector('img').className = 'mb-2 h-24 w-full object-cover';
  return card;
}

export default async function decorate(block) {
  block.parentElement.parentElement.classList.add('!pb-0');

  let products = await ffetch('/us/en/products-index.json')
    .filter(({ fullCategory }) => fullCategory.split('|').length === 1)
    .filter(({ fullCategory }) => fullCategory !== '')
    .filter(({ path }) => !path.includes('/topics'))
    .filter(({ path }) => !path.includes('/product-coveo'))
    .filter(({ path }) => !path.includes('/brands'))
    .all();

  const activeTagFilter = getSelectionFromUrl('tag');
  let filteredProducts = products;
  products = products.sort((item1, item2) => item1.title.localeCompare(item2.title));
  if (activeTagFilter) {
    filteredProducts = products.filter(
      (item) => toClassName(item.opco).toLowerCase().indexOf(activeTagFilter) > -1,
    );
  }

  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 px-4 py-4 sm:px-0 justify-items-center mt-3 mb-3',
  });

  filteredProducts.forEach((product, index) => {
    cardList.append(createCard(product, index === 0));
  });
  const filterTags = createFilters(products, activeTagFilter, 'brand');
  block.textContent = '';
  block.append(filterTags, cardList);
}

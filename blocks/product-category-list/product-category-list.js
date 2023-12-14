import ffetch from '../../scripts/ffetch.js';
import {
  ul, li, a, h3, span,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';
import { toClassName, getMetadata } from '../../scripts/lib-franklin.js';
import createFilters from './filter.js';

const getSelectionFromUrl = (field) => toClassName(new URLSearchParams(window.location.search).get(field)) || '';

function createOpcoCard(product, firstCard = false) {
  const cardWrapper = a(
    { href: makePublicUrl(product.path), title: product.title },
    imageHelper(product.image, product.title, firstCard),
    h3(
      {
        class: 'text-base font-normal text-danahergray-900 break-words h-16',
      },
      product.title,
      span({ class: 'font-semibold text-danaherpurple-500' }, ' →'),
    ),
  );
  const card = li({
    class:
        'h-52 flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 hover:scale-105 overflow-hidden bg-white max-w-xl pl-6 pr-6 lg:pl-0 lg:pr-0',
  }, cardWrapper);
  card.querySelector('img').className = 'mb-2 h-24 w-full object-cover';
  return card;
}

function createCard(product, firstCard = false) {
  const cardWrapper = a(
    { href: makePublicUrl(product.path), title: product.title },
    imageHelper(product.image, product.title, firstCard),
    h3(
      { class: 'text-base font-normal break-words text-danahergray-900 h-24' },
      product.title,
      span({ class: 'font-semibold text-danaherpurple-500' }, ' →'),
    ),
  );
  const card = li({
    class:
        'w-64 lg:w-44 h-52 flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border-l border-danahergray-300 hover:scale-105 overflow-hidden bg-white max-w-xl pl-6 pr-6 lg:pr-0',
  }, cardWrapper);
  card.querySelector('img').className = 'mb-2 h-24 w-full object-cover';
  return card;
}

export default async function decorate(block) {
  block.parentElement.parentElement.classList.add('!pb-0');
  block.parentElement.previousElementSibling.id = 'categories';
  const isbrandPage = (block.classList.contains('opco-home'));
  const metaBrand = getMetadata('brand');
  let products = await ffetch('/us/en/products-index.json')
    .filter(({ fullCategory }) => fullCategory.split('|').length === 1)
    .filter(({ fullCategory }) => fullCategory !== '')
    .filter(({ type }) => type === 'Category')
    .filter(({ path }) => !path.includes('/product-coveo'))
    .filter(({ brand }) => {
      if (isbrandPage) return brand.includes(metaBrand);
      return true;
    })
    .all();

  const activeTagFilter = getSelectionFromUrl('tag');
  let filteredProducts = products;
  products = products.sort((item1, item2) => item1.title.localeCompare(item2.title));
  if (activeTagFilter) {
    filteredProducts = products.filter(
      (item) => toClassName(item.brand).toLowerCase().indexOf(activeTagFilter) > -1,
    );
  }

  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 px-4 py-4 sm:px-0 justify-items-center mt-3 mb-3',
  });

  filteredProducts.forEach((product, index) => {
    cardList.append(
      isbrandPage ? createOpcoCard(product, index === 0) : createCard(product, index === 0),
    );
  });
  const filterTags = isbrandPage ? '' : createFilters(products, activeTagFilter, 'brand');
  block.textContent = '';
  block.append(filterTags, cardList);
}

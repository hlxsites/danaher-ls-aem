import ffetch from '../../scripts/ffetch.js';
import { ul } from '../../scripts/dom-builder.js';

import { toClassName } from '../../scripts/lib-franklin.js';
import createFilters from './filter.js';
import createCard from './miniCard.js';

const getSelectionFromUrl = (field) => toClassName(new URLSearchParams(window.location.search).get(field)) || '';

export default async function decorate(block) {
  block.parentElement.parentElement.classList.add('!pb-0');

  let products = await ffetch('/us/en/products-index.json')
    .filter(({ title }) => title !== '')
    .filter(({ image }) => image !== '')
    .all();

  products = products.sort((item1, item2) => item1.title.localeCompare(item2.title));

  const activeTagFilter = getSelectionFromUrl('tag');
  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 px-4 py-4 sm:px-0 justify-items-center mt-3 mb-3',
  });

  products.forEach((product, index) => {
    cardList.append(createCard(product, index === 0));
  });
  const filterTags = createFilters(products, activeTagFilter);
  block.textContent = '';
  block.append(filterTags, cardList);
}

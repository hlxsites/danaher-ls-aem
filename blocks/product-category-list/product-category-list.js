import ffetch from '../../scripts/ffetch.js';
import {
  ul, li, a, p, div, span, h4,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';
import { toClassName } from '../../scripts/lib-franklin.js';

const getSelectionFromUrl = (field) => toClassName(new URLSearchParams(window.location.search).get(field)) || '';

function createCard(product, firstCard = false) {
  const cardWrapper = a(
    { href: makePublicUrl(product.path), title: product.title },
    imageHelper(product.image, product.title, firstCard),
    h4(
      {
        class: '!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14',
      },
      product.title + '→',
    ),
  );
  return li({
    class:
        'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl',
  }, cardWrapper);
}

const createFilters = (products, activeTag) => {
  // collect tag filters
  const allOpCo = products.map((item) => item.opco.replace(/,\s*/g, ',').split(','));
  const opCos = new Set([].concat(...allOpCo));
  opCos.delete('');

  // render tag cloud
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('tag');
  newUrl.searchParams.delete('page');
  const tags = div(
    { class: 'flex flex-wrap gap-2 mb-4' },
    a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-2 font-semibold bg-d text-danaherpurple-500 bg-danaherpurple-50 hover:bg-gray-100 hover:text-gray-500',
        href: newUrl.toString(),
      },
      'View All',
    ),
  );
  [...opCos].sort().forEach((opco) => {
    newUrl.searchParams.set('tag', toClassName(opco).toLowerCase());
    const tagAnchor = a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-2 font-semibold bg-d hover:bg-gray-100 hover:text-gray-500',
        href: newUrl.toString(),
      },
      opco,
    );
    if (toClassName(opco).toLowerCase() === activeTag) {
      tagAnchor.classList.add('bg-danaherpurple-500', 'text-white');
      tagAnchor.setAttribute('aria-current', 'tag');
    } else {
      tagAnchor.classList.add('text-danaherpurple-500', 'bg-danaherpurple-50');
    }
    tags.append(tagAnchor);
  });
  return tags;
};

export default async function decorate(block) {
  block.parentElement.parentElement.classList.add('!pb-0');

  let products = await ffetch('/us/en/products-index.json')
    .filter(({ title }) => title !== '')
    .all();

  products = products.sort((item1, item2) => item1.title.localeCompare(item2.title));

  const activeTagFilter = getSelectionFromUrl('tag');
  if (activeTagFilter) {
    filteredArticles = articles.filter(
      (item) => toClassName(item.opcos).toLowerCase().indexOf(activeTagFilter) > -1,
    );
  }

  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 py-4 sm:px-0 justify-items-center mt-3 mb-3',
  });

  products.forEach((product, index) => {
    cardList.append(createCard(product, index === 0));
  });
  const filterTags = createFilters(products, activeTagFilter);
  block.textContent = '';
  block.append(filterTags, cardList);
}

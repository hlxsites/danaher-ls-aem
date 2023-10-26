import ffetch from '../../scripts/ffetch.js';
import {
  ul, li, a, p, div, time, span, h2, img,
} from '../../scripts/dom-builder.js';
import { formatDateUTCSeconds, makePublicUrl } from '../../scripts/scripts.js';
import { createOptimizedPicture, toClassName } from '../../scripts/lib-franklin.js';

const getSelectionFromUrl = (field) => toClassName(new URLSearchParams(window.location.search).get(field)) || '';

// TODO: clean up after S7 images are on edge
const imageHelper = (imageUrl, imageAlt, eager = false) => {
  if (imageUrl.startsWith('/is/image')) {
    const prodHost = /main--danaher-ls-aem-prod|lifesciences\.danaher\.com/;
    const s7Host = prodHost.test(window.location.host)
      ? 'https://danaherls.scene7.com'
      : 'https://s7d9.scene7.com/';
    return img({
      src: `${s7Host}${imageUrl}`,
      alt: imageAlt,
      loading: eager ? 'eager' : 'lazy',
      class: 'mb-2 h-48 w-full object-cover',
    });
  }
  const cardImage = createOptimizedPicture(imageUrl, imageAlt, eager, [{ width: '750' }]);
  cardImage.querySelector('img').className = 'mb-2 h-48 w-full object-cover';
  return cardImage;
};

const createCard = (article, firstCard = false) => {
  const cardTitle = article.title.indexOf('| Danaher Life Sciences') > -1
    ? article.title.split('| Danaher Life Sciences')[0]
    : article.title;

  const cardWrapper = a(
    { href: makePublicUrl(article.path), title: article.title },
    imageHelper(article.image, article.title, firstCard),
    p(
      { class: 'px-6 py-1 pt-4 text-sm text-danaherpurple-500' },
      article.brand || 'Danaher Corporation',
    ),
    p(
      { class: 'px-6 pb-3 text-gray-500 text-sm' },
      time(
        { datetime: formatDateUTCSeconds(article.publishDate) },
        formatDateUTCSeconds(article.publishDate, { month: 'long' }),
      ),
      span({ class: 'pl-2' }, `${article.readingTime} min read`),
    ),
    h2(
      {
        class: 'px-6 text-lg font-semibold text-danahergray-900 mb-4 line-clamp-3 h-20 break-words',
      },
      cardTitle,
    ),
    div(
      { class: 'mt-auto inline-flex w-full px-6 py-5 text-base text-danaherpurple-500 font-semibold' },
      'Read Article →',
    ),
  );

  return li({
    class:
      'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl',
  }, cardWrapper);
};

const createPaginationLink = (page, label, current = false) => {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('page', page);
  const link = a(
    {
      href: newUrl.toString(),
      class:
        'font-medium text-sm leading-5 pt-4 px-4 items-center inline-flex hover:border-t-2 hover:border-gray-300 hover:text-gray-700',
    },
    label || page,
  );
  if (current) {
    link.setAttribute('aria-current', 'page');
    link.classList.add('text-danaherpurple-500', 'border-danaherpurple-500', 'border-t-2');
  } else {
    link.classList.add('text-danahergray-700');
  }
  return link;
};

const createPagination = (entries, page, limit) => {
  const paginationNav = document.createElement('nav');
  paginationNav.className = 'flex items-center justify-between border-t py-4 md:py-0 mt-8 md:mt-12';

  if (entries.length > limit) {
    const maxPages = Math.ceil(entries.length / limit);
    const paginationPrev = div({ class: 'flex flex-1 w-0 -mt-px' });
    const paginationPages = div({ class: 'hidden md:flex grow justify-center w-0 -mt-px' });
    const paginationNext = div({ class: 'flex flex-1 w-0 -mt-px justify-end' });

    if (page > 1) {
      paginationPrev.append(createPaginationLink(page - 1, '← Previous'));
    }
    for (let i = 1; i <= maxPages; i += 1) {
      if (i === 1 || i === maxPages || (i >= page - 2 && i <= page + 2)) {
        paginationPages.append(createPaginationLink(i, i, i === page));
      } else if (
        paginationPages.lastChild && !paginationPages.lastChild.classList.contains('ellipsis')
      ) {
        paginationPages.append(
          span(
            { class: 'ellipsis font-medium text-sm leading-5 pt-4 px-4 items-center inline-flex' },
            '...',
          ),
        );
      }
    }
    if (page < maxPages) {
      paginationNext.append(createPaginationLink(page + 1, 'Next →'));
    }

    paginationNav.append(paginationPrev, paginationPages, paginationNext);
  }
  const listPagination = div({ class: 'mx-auto' }, paginationNav);
  return listPagination;
};

const createFilters = (articles, activeTag) => {
  // collect tag filters
  const allKeywords = articles.map((item) => item.keywords.replace(/,\s*/g, ',').split(','));
  const keywords = new Set([].concat(...allKeywords));
  keywords.delete('');
  keywords.delete('Blog'); // filter out generic blog tag
  keywords.delete('News'); // filter out generic news tag

  // render tag cloud
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('tag');
  newUrl.searchParams.delete('page');
  const tags = div(
    { class: 'flex flex-wrap gap-2' },
    a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-2 font-semibold bg-d text-danaherpurple-500 bg-danaherpurple-50 hover:bg-gray-100 hover:text-gray-500',
        href: newUrl.toString(),
      },
      'View All',
    ),
  );
  [...keywords].sort().forEach((keyword) => {
    newUrl.searchParams.set('tag', toClassName(keyword).toLowerCase());
    const tagAnchor = a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-2 font-semibold bg-d hover:bg-gray-100 hover:text-gray-500',
        href: newUrl.toString(),
      },
      keyword,
    );
    if (toClassName(keyword).toLowerCase() === activeTag) {
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
  const articleType = block.classList.length > 2 ? block.classList[1] : '';
  if (articleType) block.classList.remove(articleType);
  // fetch and sort all articles
  const articles = await ffetch('/us/en/query-index.json')
    .chunks(500)
    .filter(({ type }) => type.toLowerCase() === articleType)
    .all();
  let filteredArticles = articles;
  const activeTagFilter = getSelectionFromUrl('tag');
  if (activeTagFilter) {
    filteredArticles = articles.filter(
      (item) => toClassName(item.keywords).toLowerCase().indexOf(activeTagFilter) > -1,
    );
  }
  filteredArticles.sort((card1, card2) => card2.publishDate - card1.publishDate);

  // handle pagination
  let page = parseInt(getSelectionFromUrl('page'), 10);
  page = Number.isNaN(page) ? 1 : page;
  const limitPerPage = 20;
  const start = (page - 1) * limitPerPage;
  const articlesToDisplay = filteredArticles.slice(start, start + limitPerPage);

  // render cards
  const cardList = ul({
    class:
      'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 justify-items-center mt-3 mb-3',
  });
  articlesToDisplay.forEach((article, index) => {
    cardList.appendChild(createCard(article, index === 0));
  });

  // render pagination and filters
  const filterTags = createFilters(articles, activeTagFilter);
  const paginationElements = createPagination(filteredArticles, page, limitPerPage);

  block.textContent = '';
  block.append(filterTags, cardList, paginationElements);
}

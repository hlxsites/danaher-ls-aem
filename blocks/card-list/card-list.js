import ffetch from '../../scripts/ffetch.js';
import {
  ul, a, div, span,
} from '../../scripts/dom-builder.js';
import { getMetadata, toClassName } from '../../scripts/lib-franklin.js';
import createArticleCard from './articleCard.js';
import createLibraryCard from './libraryCard.js';
import createApplicationCard from './applicationCard.js';
import { makePublicUrl } from '../../scripts/scripts.js';
import { buildItemListSchema } from '../../scripts/schema.js';

const tagName = getMetadata('template') === 'wsaw' ? 'solutions' : 'topics';

const getSelectionFromUrl = () => (window.location.pathname.indexOf(tagName) > -1 ? toClassName(window.location.pathname.replace('.html', '').split('/').pop()) : '');
const getPageFromUrl = () => toClassName(new URLSearchParams(window.location.search).get('page')) || '';

const createTopicUrl = (currentUrl, keyword = '') => {
  if (currentUrl.indexOf(tagName) > -1) {
    return currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + toClassName(keyword).toLowerCase();
  }
  return `${currentUrl.replace('.html', '')}/${tagName}/${toClassName(keyword).toLowerCase()}`;
};

const patchBannerHeading = () => {
  document.querySelector('body .banner h1').textContent = getMetadata('heading');
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

export function createFilters(articles, viewAll = false) {
  // collect tag filters
  const allKeywords = articles.map((item) => item[tagName].replace(/,\s*/g, ',').split(','));
  const keywords = new Set([].concat(...allKeywords));
  keywords.delete('');
  keywords.delete('Blog'); // filter out generic blog tag
  keywords.delete('News'); // filter out generic news tag

  // render tag cloud
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('page');
  if (window.location.pathname.indexOf(tagName) > -1) {
    newUrl.pathname = window.location.pathname.substring(0, window.location.pathname.indexOf(`/${tagName}/`));
  }
  const tags = viewAll ? div(
    { class: 'flex flex-wrap gap-2 gap-y-0 mb-4' },
    a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-0.5 font-semibold text-danaherpurple-500 bg-danaherpurple-50 hover:text-white hover:bg-danaherpurple-500',
        href: makePublicUrl(newUrl.toString()),
      },
      'View All',
    ),
  ) : div({ class: 'flex flex-wrap gap-2 gap-y-0 mb-4' });

  [...keywords].sort().forEach((keyword) => {
    let currentUrl;
    if (viewAll) {
      currentUrl = window.location.pathname;
    } else {
      currentUrl = window.location.pathname.split('/');
      currentUrl.pop();
      currentUrl = currentUrl.join('/');
    }
    newUrl.pathname = createTopicUrl(currentUrl, keyword);
    const tagAnchor = a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-0.5 font-semibold text-danaherpurple-500 bg-danaherpurple-50 hover:text-white hover:bg-danaherpurple-500',
        href: makePublicUrl(newUrl.toString()),
      },
      keyword,
    );
    tags.append(tagAnchor);
  });
  [...tags.children].forEach((tag) => {
    const url = new URL(tag.href);
    if (url.pathname === window.location.pathname) {
      tag.classList.add('bg-danaherpurple-500', 'text-white');
      tag.setAttribute('aria-current', 'tag');
    } else {
      tag.classList.add('text-danaherpurple-500', 'bg-danaherpurple-50');
    }
  });

  // patch banner heading with selected tag only on topics pages
  if (getMetadata('heading') && window.location.pathname.indexOf(tagName) > -1) {
    patchBannerHeading();
  }

  return tags;
}

export default async function decorate(block) {
  const articleType = block.classList.length > 2 ? block.classList[1] : '';
  if (articleType) block.classList.remove(articleType);
  block.textContent = '';

  const indexType = getMetadata('template') === 'wsaw' ? 'wsaw' : 'article';
  const contentType = getMetadata('template') === 'wsaw' ? 'weseeaway' : articleType;
  // fetch and sort all articles
  const articles = await ffetch(`/us/en/${indexType}-index.json`)
    .chunks(500)
    .filter(({ type }) => type.toLowerCase() === contentType)
    .filter((article) => !article.path.includes('/topics-template'))
    .all();
  let filteredArticles = articles;
  const activeTagFilter = block.classList.contains('url-filtered') ? getSelectionFromUrl() : '';
  if (activeTagFilter) {
    filteredArticles = articles.filter(
      (item) => toClassName(item[tagName]).toLowerCase().indexOf(activeTagFilter) > -1,
    );
  }
  buildItemListSchema(filteredArticles, 'resources');
  // render cards application style
  if (articleType === 'application' || articleType === 'info') {
    filteredArticles.sort((card1, card2) => card1.title.localeCompare(card2.title));
    const cardList = ul({
      class:
        'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 justify-items-center mt-3 mb-3',
    });
    filteredArticles.forEach((article) => {
      cardList.appendChild(createApplicationCard(article));
    });
    block.append(cardList);
  // render cards article style
  } else {
    if (articleType === 'library') {
      filteredArticles.sort((card1, card2) => card1.title.localeCompare(card2.title));
    } else {
      filteredArticles.sort((card1, card2) => card2.publishDate - card1.publishDate);
    }

    let page = parseInt(getPageFromUrl(), 10);
    page = Number.isNaN(page) ? 1 : page;
    const limitPerPage = 18;
    const start = (page - 1) * limitPerPage;
    const articlesToDisplay = filteredArticles.slice(start, start + limitPerPage);

    const cardList = ul({
      class:
        'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0 justify-items-center mt-3 mb-3',
    });
    articlesToDisplay.forEach((article, index) => {
      if (articleType === 'library') {
        // load library cards
        cardList.appendChild(createLibraryCard(article, index === 0));
      } else {
        cardList.appendChild(createArticleCard(article, index === 0));
      }
    });

    // render pagination and filters
    const filterTags = createFilters(articles, true);
    const paginationElements = createPagination(filteredArticles, page, limitPerPage);
    block.append(filterTags, cardList, paginationElements);
  }
}

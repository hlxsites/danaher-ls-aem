import ffetch from '../../scripts/ffetch.js';
import {
  ul, a, div, span, h2,
} from '../../scripts/dom-builder.js';

import { toClassName } from '../../scripts/lib-franklin.js';
import createArticleCard from './articleCard.js';
import createApplicationCard from './applicationCard.js';
import createLibraryCard from './libraryCard.js';

const getSelectionFromUrl = (field) => toClassName(new URLSearchParams(window.location.search).get(field)) || '';

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
  const allKeywords = articles.map((item) => item.topics.replace(/,\s*/g, ',').split(','));
  const keywords = new Set([].concat(...allKeywords));
  keywords.delete('');
  keywords.delete('Blog'); // filter out generic blog tag
  keywords.delete('News'); // filter out generic news tag

  // render tag cloud
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('tag');
  newUrl.searchParams.delete('page');
  const tags = div(
    { class: 'flex flex-wrap gap-2 mb-4' },
    a(
      {
        class:
          'text-center my-2 inline-block rounded-full px-4 py-1 font-semibold bg-d text-danaherpurple-500 bg-danaherpurple-50 hover:bg-white hover:text-danaherpurple-500 border hover:border-danaherpurple-500',
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
          'text-center my-2 inline-block rounded-full px-4 py-1 font-semibold bg-d hover:bg-white hover:text-danaherpurple-500 border hover:border-danaherpurple-500',
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
  block.textContent = '';

  // fetch and sort all articles
  const articles = await ffetch('/us/en/article-index.json')
    .chunks(500)
    .filter(({ type }) => type.toLowerCase() === articleType)
    .all();
  let filteredArticles = articles;
  const activeTagFilter = getSelectionFromUrl('tag');
  if (activeTagFilter) {
    filteredArticles = articles.filter(
      (item) => toClassName(item.topics).toLowerCase().indexOf(activeTagFilter) > -1,
    );
  }

  // render cards library style
  if (articleType === 'library') {
    block.classList.add(...'flex flex-col md:flex-wrap md:flex-row'.split(' '));
    filteredArticles.sort((card1, card2) => card1.title.localeCompare(card2.title));

    // map filteredArticles to a new map with first letter as key
    const filteredArticlesMap = new Map();
    filteredArticles.forEach((card) => {
      const firstLetter = card.title[0]?.toUpperCase();
      if (!filteredArticlesMap.has(firstLetter)) {
        filteredArticlesMap.set(firstLetter, []);
      }
      filteredArticlesMap.get(firstLetter).push(card);
    });

    // iterate over map and create a new array of cards
    filteredArticlesMap.forEach((cards, letter) => {
      const cardList = ul({
        class:
          'grid max-w-7xl w-full md:w-3/4 mx-auto gap-6 grid-cols-1 lg:grid-cols-3 px-4 sm:px-0 justify-items-center mb-16',
      });
      const divLetter = div(
        { class: 'md:w-1/4 mb-8 px-4 md:px-0 md:text-right md:pr-8' },
        h2({ class: 'text-2xl font-extrabold md:border-t mt-0', id: `letter-${letter}` }, letter),
      );
      const ifFirstLetter = letter === filteredArticlesMap.keys().next().value;
      cards.forEach((card, index) => {
        cardList.appendChild(createLibraryCard(card, index === 0 && ifFirstLetter));
      });
      block.append(divLetter, cardList);
    });
  // render cards application style
  } else if (articleType === 'application' || articleType === 'info') {
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
    filteredArticles.sort((card1, card2) => card2.publishDate - card1.publishDate);

    let page = parseInt(getSelectionFromUrl('page'), 10);
    page = Number.isNaN(page) ? 1 : page;
    const limitPerPage = 20;
    const start = (page - 1) * limitPerPage;
    const articlesToDisplay = filteredArticles.slice(start, start + limitPerPage);

    const cardList = ul({
      class:
        'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 justify-items-center mt-3 mb-3',
    });
    articlesToDisplay.forEach((article, index) => {
      cardList.appendChild(createArticleCard(article, index === 0));
    });

    // render pagination and filters
    const filterTags = createFilters(articles, activeTagFilter);
    const paginationElements = createPagination(filteredArticles, page, limitPerPage);

    block.append(filterTags, cardList, paginationElements);
  }
}

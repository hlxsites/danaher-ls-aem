import ffetch from '../../scripts/ffetch.js';
import {
  ul, a, div, span, h2, button, input, label,
} from '../../scripts/dom-builder.js';

import { toClassName } from '../../scripts/lib-franklin.js';
import createArticleCard from './articleCard.js';
import createApplicationCard from './applicationCard.js';
import createLibraryCard from './libraryCard.js';
import { generateUUID, capitalize } from '../../scripts/scripts.js';

const getSelectionFromUrl = (field) => toClassName(new URLSearchParams(window.location.search).get(field)) || '';

const createPaginationLink = (page, btnLabel, current = false) => {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('page', page);
  const link = a(
    {
      href: newUrl.toString(),
      class:
        'font-medium text-sm leading-5 pt-4 px-4 items-center inline-flex hover:border-t-2 hover:border-gray-300 hover:text-gray-700',
    },
    btnLabel || page,
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

function toggleFilter(event) {
  const isOpen = event.target.parentElement.getAttribute('aria-expanded');
  if (JSON.parse(isOpen)) {
    console.log(event.target.parentElement.parentElement);
    event.target.parentElement.parentElement.focus();
    setTimeout(() => event.target.parentElement.parentElement.blur(), 1000);
  } else {
    event.target.parentElement.parentElement.focus();
  }
  event.target.parentElement.setAttribute('aria-expanded', !JSON.parse(isOpen));
}

const createFilters = (articles, activeTag, tagName) => {
  // collect tag filters
  const allKeywords = articles.map((item) => item[tagName].replace(/,\s*/g, ',').split(','));
  const keywords = new Set([].concat(...allKeywords));
  keywords.delete('');
  keywords.delete('Blog'); // filter out generic blog tag
  keywords.delete('News'); // filter out generic news tag
  let valSelected = '';
  [...keywords].forEach((keyword) => {
    if (toClassName(keyword).toLowerCase() === activeTag) {
      valSelected = `: ${keyword}`;
    }
  });
  // render tag cloud
  const newUrl = new URL(window.location);
  newUrl.searchParams.delete(tagName);
  newUrl.searchParams.delete('page');
  const uuid = generateUUID();
  const btnTopics = button({
    type: 'button',
    class: 'btn btn-lg btn-primary-purple px-4 rounded-full',
    'aria-expanded': false,
    title: valSelected,
    'aria-controls': `${uuid}`,
  });
  btnTopics.innerHTML = `<span class='min-w-[15rem] truncate'>${capitalize(tagName)}${valSelected}</span><svg class="-mr-1 h-5 w-5 text-white transition-transform group-focus-within:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
  </svg>`;
  const tags = div(
    {
      class: `dropdown group ${tagName} relative inline-block text-left px-2 pb-2`,
      'tabindex': '0'
    },
    btnTopics
  );
  const dropdownDiv = div(
    { id: `${uuid}`, class: 'dropdown-menu hidden group-focus-within:block w-max max-w-xs absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none' },
    div(
      { class: 'blog-inner-filter p-1 space-y-2', role: 'none' },
      a(
        { class: 'flex gap-x-3 items-center text-gray-700 block px-4 py-2 text-sm hover:bg-slate-50', href: newUrl.toString().replace(`?${tagName}=all`, '').replace(`&${tagName}=all`, '') },
        input({
          class: 'view-all form-radio', type: 'radio', id: 'All', name: `${tagName}Radio`, value: 'All',
        }),
        label({ class: 'w-full text-sm font-medium text-gray-900', for: 'All' }, 'All'),
      ),
    ),
  );
  const dropdownDivInner = dropdownDiv.querySelector('div.blog-inner-filter');
  const allTag = dropdownDiv.querySelector('.view-all');
  allTag.setAttribute('checked', true);
  allTag.addEventListener('click', (e) => {
    window.location.href = e.target.parentElement.getAttribute('href');
  });

  [...keywords].sort().forEach((keyword) => {
    newUrl.searchParams.set(tagName, toClassName(keyword).toLowerCase());
    const inputEl = input({
      class: 'form-radio', type: 'radio', id: `${keyword}`, name: `${tagName}Radio`, value: `${keyword}`,
    });
    const tagsDiv = a(
      { class: 'flex gap-x-3 items-center text-gray-700 block px-4 py-2 text-sm hover:bg-slate-50', href: newUrl.toString() },
      inputEl,
      label({ class: 'w-full text-sm font-medium text-gray-900', for: `${keyword}` }, keyword),
    );
    inputEl.addEventListener('click', (e) => {
      window.location.href = e.target.parentElement.getAttribute('href');
    });
    if (toClassName(keyword).toLowerCase() === activeTag) {
      tagsDiv.setAttribute('aria-current', tagName);
      inputEl.setAttribute('checked', true);
      allTag.removeAttribute('checked');
    } else {
      inputEl.removeAttribute('checked');
    }
    dropdownDivInner.append(tagsDiv);
    dropdownDiv.append(dropdownDivInner);
    tags.append(dropdownDiv);
  });
  tags.addEventListener('click', toggleFilter);
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
  const activeTopicsFilter = getSelectionFromUrl('topics');
  const activeBrandFilter = getSelectionFromUrl('brand');

  if (activeTopicsFilter) {
    filteredArticles = articles.filter(
      (item) => toClassName(item.topics).toLowerCase().indexOf(activeTopicsFilter) > -1,
    );
  }

  if (activeBrandFilter) {
    filteredArticles = filteredArticles.filter(
      (item) => toClassName(item.brand).toLowerCase().indexOf(activeBrandFilter) > -1,
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
  } else if (['application', 'info'].includes(articleType)) {
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
        'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-0 lg:px-4 justify-items-center mt-4 mb-3',
    });
    articlesToDisplay.forEach((article, index) => {
      cardList.appendChild(createArticleCard(article, index === 0));
    });

    // render pagination and filters
    const topicsFilters = createFilters(articles, activeTopicsFilter, 'topics');
    const brandFilters = createFilters(articles, activeBrandFilter, 'brand');
    const paginationElements = createPagination(filteredArticles, page, limitPerPage);

    block.append(topicsFilters, brandFilters, cardList, paginationElements);
  }
}

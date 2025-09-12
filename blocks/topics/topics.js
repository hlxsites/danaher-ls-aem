import ffetch from '../../scripts/ffetch.js';
import { ul, a, div, span } from '../../scripts/dom-builder.js';
import { getMetadata, toClassName } from '../../scripts/lib-franklin.js';
import createArticleCard from '../card-list/articleCard.js';
import { makePublicUrl } from '../../scripts/scripts.js';

let tagName = '';
switch (getMetadata('template')) {
  default:
    tagName = 'topics';
}

const getSelectionFromUrl = () => {
  const parts = window.location.pathname.replace('.html', '').split('/');
  const tagIndex = parts.findIndex((part) => part === tagName);
  if (tagIndex > -1 && parts.length > tagIndex + 1) {
    return toClassName(parts[tagIndex + 1]);
  }
  return '';
};

const getPageFromUrl = () =>
  toClassName(new URLSearchParams(window.location.search).get('page')) || '';

const patchBannerHeading = () => {
  const heading = getMetadata('heading');
  const bannerH1 = document.querySelector('body .banner h1');
  if (bannerH1 && heading) bannerH1.textContent = heading;
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

export function createFilters(articles, activeTag = '') {
  // Reduce gap between "Blog topic:" and tag value
  const container = div({ class: 'flex items-center gap-2 mb-24' });

  if (activeTag) {
    let articleType = '';
    if (window.location.pathname.startsWith('/us/en/blog')) {
      articleType = 'Blog';
    }
    if (window.location.pathname.startsWith('/us/en/news')) {
      articleType = 'News';
    }
    if (window.location.pathname.startsWith('/us/en/library')) {
      articleType = 'Library';
    }
     container.append(
      span({ class: 'font-medium text-danahergray-700' }, `${articleType} topic:`),
      span({ class: 'font-bold text-black'}, activeTag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())),
    );
  }

  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('page');
  if (window.location.pathname.indexOf(tagName) > -1) {
    newUrl.pathname = window.location.pathname.substring(
      0,
      window.location.pathname.indexOf(`/${tagName}/`)
    );
  }

  container.append(
    a(
      {
        class: 'text-danaherpurple-500 font-semibold',
        style: 'margin-left:16px;',
        href: makePublicUrl(newUrl.toString()),
      },
      'View All Topics →',
    ),
  );

  if (getMetadata('heading') && window.location.pathname.indexOf(tagName) > -1) {
    patchBannerHeading();
  }

  return container;
}

let indexTemplate = getMetadata('template');

export default async function decorate(block) {
  let indexType = '';
  switch (indexTemplate) {
    default:
      indexType = 'article';
  }

  block.setAttribute('id', 'card-list');
  const articleType = block.classList.length > 2 ? block.classList[1] : '';
  if (articleType) block.classList.remove(articleType);
  block.textContent = '';

  const articles = await ffetch(`/us/en/${indexType}-index.json`)
    .chunks(500)
    .filter(({ type }) => type.toLowerCase() === articleType)
    .filter((article) => {
      if (article.path) return !article.path.includes('/topics-template');
      return true;
    })
    .all();

  // Always extract tag from URL
  const activeTagFilter = getSelectionFromUrl();

  let filteredArticles = articles;
  if (activeTagFilter) {
    filteredArticles = articles.filter((item) => {
      const tags = (item[tagName] || '')
        .split(',')
        .map((t) => toClassName(t.trim()).toLowerCase());
      return tags.includes(activeTagFilter);
    });
  }

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
    if (articleType !== 'library') {
      cardList.appendChild(createArticleCard(article, index === 0));
    }
  });

  // Always show topic label and "View All Topics"
  const filterTags = createFilters(articles, activeTagFilter);
  filterTags.style.marginBottom = '45px';
  const paginationElements = createPagination(filteredArticles, page, limitPerPage);
  block.append(filterTags, cardList, paginationElements);
}

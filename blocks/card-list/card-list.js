import ffetch from '../../scripts/ffetch.js';
import {
  ul, a, div, span,
} from '../../scripts/dom-builder.js';
import { getMetadata, toClassName } from '../../scripts/lib-franklin.js';
import createArticleCard from './articleCard.js';
import createLabCard from './newLabCard.js';
import createLibraryCard from './libraryCard.js';
import createApplicationCard from './applicationCard.js';
import { makePublicUrl } from '../../scripts/scripts.js';
import { buildItemListSchema } from '../../scripts/schema.js';

// Helpers
const getSelectionFromUrl = (tagName) => (
  window.location.pathname.includes(tagName)
    ? toClassName(window.location.pathname.replace('.html', '').split('/').pop())
    : ''
);
const getPageFromUrl = () => parseInt(toClassName(new URLSearchParams(window.location.search).get('page')), 10) || 1;
const createTopicUrl = (currentUrl, keyword = '', tagName = '') => {
  if (currentUrl.includes(tagName)) {
    return `${currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1)}${toClassName(keyword)}`;
  }
  return `${currentUrl.replace('.html', '')}/${tagName}/${toClassName(keyword)}`;
};
const patchBannerHeading = () => {
  const heading = getMetadata('heading');
  if (heading) {
    const h1 = document.querySelector('body .banner h1');
    if (h1) h1.textContent = heading;
  }
};

const createPaginationLink = (page, label, current = false) => {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('page', page);
  const link = a({
    href: newUrl.toString(),
    class: 'font-medium text-sm leading-5 pt-4 px-4 items-center inline-flex hover:border-t-2 hover:border-gray-300 hover:text-gray-700',
  }, label || page);

  if (current) {
    link.setAttribute('aria-current', 'page');
    link.classList.add('text-danaherpurple-500', 'border-danaherpurple-500', 'border-t-2');
  } else {
    link.classList.add('text-danahergray-700');
  }

  return link;
};

const createPagination = (entries, page, limit) => {
  if (entries.length <= limit) return div();

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

  return div({ class: 'mx-auto' },
    div({ class: 'flex items-center justify-between border-t py-4 md:py-0 mt-8 md:mt-12' },
      paginationPrev, paginationPages, paginationNext,
    ),
  );
};

export function createFilters(articles, tagName, viewAll = false) {
  const allKeywords = articles.flatMap((item) =>
    item[tagName]?.replace(/,\s*/g, ',').split(',') || [],
  );

  const keywords = new Set(allKeywords);
  keywords.delete('');
  keywords.delete('Blog');
  keywords.delete('News');

  const newUrl = new URL(window.location);
  newUrl.searchParams.delete('page');
  if (window.location.pathname.includes(tagName)) {
    newUrl.pathname = window.location.pathname.split(`/${tagName}/`)[0];
  }

  const tags = div({ class: 'flex flex-wrap gap-2 gap-y-0 mb-4' });

  if (viewAll) {
    tags.append(
      a({
        href: makePublicUrl(newUrl.toString()),
        class: 'text-center my-2 inline-block rounded-full px-4 py-0.5 font-semibold text-danaherpurple-500 bg-danaherpurple-50 hover:text-white hover:bg-danaherpurple-500',
      }, 'View All'),
    );
  }

  [...keywords].sort().forEach((keyword) => {
    const currentUrl = viewAll ? window.location.pathname : window.location.pathname.split('/').slice(0, -1).join('/');
    newUrl.pathname = createTopicUrl(currentUrl, keyword, tagName);
    const tag = a({
      href: makePublicUrl(newUrl.toString()),
      class: 'text-center my-2 inline-block rounded-full px-4 py-0.5 font-semibold hover:text-white hover:bg-danaherpurple-500',
    }, keyword);

    const url = new URL(tag.href);
    if (url.pathname === window.location.pathname) {
      tag.classList.add('bg-danaherpurple-500', 'text-white');
      tag.setAttribute('aria-current', 'tag');
    } else {
      tag.classList.add('text-danaherpurple-500', 'bg-danaherpurple-50');
    }

    tags.append(tag);
  });

  patchBannerHeading();
  return tags;
}

// ⬇️ FINAL decorate function
export default async function decorate(block) {
  // Get config from dataset (UE injected)
  const {
    tagName: dataTag = 'topics',
    articleType: dataType = '',
    pagination: rawPagination = 'true',
    filters: rawFilters = 'true',
    sourceIndex = '/us/en/article-index.json',
  } = block.dataset;

  const tagName = dataTag;
  const articleType = dataType.toLowerCase();
  const enablePagination = rawPagination === 'true';
  const enableFilters = rawFilters === 'true';

  block.id = 'card-list';
  block.textContent = '';

  const articles = await ffetch(sourceIndex)
    .chunks(500)
    .filter(({ type }) => type.toLowerCase() === articleType)
    .filter((article) => !article.path?.includes('/topics-template'))
    .all();

  // filter by tag if applicable
  const activeTagFilter = block.classList.contains('url-filtered') ? getSelectionFromUrl(tagName) : '';
  const filteredArticles = activeTagFilter
    ? articles.filter((item) => toClassName(item[tagName] || '').includes(activeTagFilter))
    : articles;

  if (articleType !== 'new-lab') {
    buildItemListSchema(filteredArticles, 'resources');
  }

  const filtersEl = enableFilters ? createFilters(articles, tagName, true) : div();

  // Sort + Render Cards
  let cardList;
  let paginationEl = div();
  if (['application', 'info'].includes(articleType)) {
    filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
    cardList = ul({
      class: 'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 justify-items-center mt-3 mb-3',
    });
    filteredArticles.forEach((article) => {
      cardList.append(createApplicationCard(article));
    });
  } else {
    if (articleType === 'library') {
      filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filteredArticles.sort((a, b) => b.publishDate - a.publishDate);
    }

    const page = getPageFromUrl();
    const limit = 18;
    const start = (page - 1) * limit;
    const displayArticles = filteredArticles.slice(start, start + limit);

    cardList = ul({
      class: 'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0 justify-items-center mt-3 mb-3',
    });

    displayArticles.forEach((article, idx) => {
      if (articleType === 'library') {
        cardList.append(createLibraryCard(article, idx === 0));
      } else if (articleType === 'new-lab') {
        cardList.append(createLabCard(article, idx === 0));
      } else {
        cardList.append(createArticleCard(article, idx === 0));
      }
    });

    if (enablePagination) {
      paginationEl = createPagination(filteredArticles, page, limit);
    }
  }

  block.append(filtersEl, cardList, paginationEl);
}

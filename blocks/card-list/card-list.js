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

// -------------------------
// CONFIG / METADATA
// -------------------------
const template = getMetadata('template');
const tagNameMap = { wsaw: 'solutions', promotions: 'topics' };
const tagName = tagNameMap[template] || 'topics';

let indexTemplate = window.location.href.includes('new-lab') ? 'new-lab' : template;
const indexTypeMap = { wsaw: 'wsaw', 'new-lab': 'promotions' };
const indexType = indexTypeMap[indexTemplate] || 'article';

const getSelectionFromUrl = () =>
  window.location.pathname.includes(tagName)
    ? toClassName(window.location.pathname.replace('.html', '').split('/').pop())
    : '';

const getPageFromUrl = () =>
  parseInt(toClassName(new URLSearchParams(window.location.search).get('page')), 10) || 1;

const createTopicUrl = (base, keyword = '') => {
  const keywordSlug = toClassName(keyword).toLowerCase();
  return base.includes(tagName)
    ? `${base.substring(0, base.lastIndexOf('/') + 1)}${keywordSlug}`
    : `${base.replace('.html', '')}/${tagName}/${keywordSlug}`;
};

const patchBannerHeading = () => {
  const heading = getMetadata('heading');
  if (heading) {
    const el = document.querySelector('body .banner h1');
    if (el) el.textContent = heading;
  }
};

// -------------------------
// PAGINATION
// -------------------------
const createPaginationLink = (page, label, current = false) => {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('page', page);
  const classes = [
    'font-medium', 'text-sm', 'leading-5', 'pt-4', 'px-4',
    'items-center', 'inline-flex',
    ...(current
      ? ['text-danaherpurple-500', 'border-danaherpurple-500', 'border-t-2']
      : ['text-danahergray-700']),
  ];
  const link = a({ href: newUrl.toString(), class: classes.join(' ') }, label || page);
  if (current) link.setAttribute('aria-current', 'page');
  return link;
};

const createPagination = (entries, page, limit) => {
  if (entries.length <= limit) return div();

  const maxPages = Math.ceil(entries.length / limit);
  const paginationPrev = div({ class: 'flex flex-1 w-0 -mt-px' });
  const paginationPages = div({ class: 'hidden md:flex grow justify-center w-0 -mt-px' });
  const paginationNext = div({ class: 'flex flex-1 w-0 -mt-px justify-end' });

  if (page > 1) paginationPrev.append(createPaginationLink(page - 1, '← Previous'));

  for (let i = 1; i <= maxPages; i++) {
    if (i === 1 || i === maxPages || (i >= page - 2 && i <= page + 2)) {
      paginationPages.append(createPaginationLink(i, i, i === page));
    } else if (
      paginationPages.lastChild && !paginationPages.lastChild.classList.contains('ellipsis')
    ) {
      paginationPages.append(
        span({ class: 'ellipsis font-medium text-sm leading-5 pt-4 px-4 items-center inline-flex' }, '...'),
      );
    }
  }

  if (page < maxPages) paginationNext.append(createPaginationLink(page + 1, 'Next →'));

  return div({ class: 'mx-auto flex items-center justify-between border-t py-4 md:py-0 mt-8 md:mt-12' },
    paginationPrev, paginationPages, paginationNext);
};

// -------------------------
// FILTERS
// -------------------------
export function createFilters(articles, viewAll = false) {
  const allTags = new Set(
    articles.flatMap(article =>
      article[tagName]?.replace(/,\s*/g, ',').split(',') || []
    ).filter(tag => tag && tag !== 'Blog' && tag !== 'News')
  );

  const url = new URL(window.location);
  url.searchParams.delete('page');
  if (window.location.pathname.includes(tagName)) {
    url.pathname = window.location.pathname.split(`/${tagName}/`)[0];
  }

  const tags = div({ class: 'flex flex-wrap gap-2 gap-y-0 mb-4' });

  if (viewAll) {
    tags.append(a({
      class: 'text-center my-2 inline-block rounded-full px-4 py-0.5 font-semibold text-danaherpurple-500 bg-danaherpurple-50 hover:text-white hover:bg-danaherpurple-500',
      href: makePublicUrl(url.toString()),
    }, 'View All'));
  }

  [...allTags].sort().forEach(tag => {
    const base = viewAll ? window.location.pathname : window.location.pathname.split('/').slice(0, -1).join('/');
    url.pathname = createTopicUrl(base, tag);
    const tagEl = a({
      class: 'text-center my-2 inline-block rounded-full px-4 py-0.5 font-semibold text-danaherpurple-500 bg-danaherpurple-50 hover:text-white hover:bg-danaherpurple-500',
      href: makePublicUrl(url.toString()),
    }, tag);
    tags.append(tagEl);
  });

  [...tags.children].forEach(tag => {
    const tagUrl = new URL(tag.href);
    if (tagUrl.pathname === window.location.pathname) {
      tag.classList.add('bg-danaherpurple-500', 'text-white');
      tag.setAttribute('aria-current', 'tag');
    }
  });

  patchBannerHeading();
  return tags;
}

// -------------------------
// MAIN BLOCK
// -------------------------
export default async function decorate(block) {
  const articleType = block.classList.length > 2 ? block.classList[1] : '';
  if (articleType) block.classList.remove(articleType);

  block.setAttribute('id', 'card-list');
  block.textContent = '';

  const articles = await ffetch(`/us/en/${indexType}-index.json`)
    .chunks(500)
    .filter(({ type }) => type?.toLowerCase() === articleType)
    .filter(({ path }) => !path?.includes('/topics-template'))
    .all();

  let filtered = [...articles];

  const tagFilter = block.classList.contains('url-filtered') ? getSelectionFromUrl() : '';
  if (tagFilter) {
    filtered = filtered.filter(a =>
      toClassName(a[tagName])?.toLowerCase().includes(tagFilter)
    );
  }

  if (articleType !== 'new-lab') buildItemListSchema(filtered, 'resources');

  // -------------------------
  // CARD LIST GENERATION
  // -------------------------
  const page = getPageFromUrl();
  const limit = 18;
  const start = (page - 1) * limit;
  const paginatedArticles = filtered.slice(start, start + limit);

  const gridClass =
    articleType === 'application' || articleType === 'info'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  const cardList = ul({
    class: `container grid max-w-7xl w-full mx-auto gap-6 ${gridClass} px-4 sm:px-0 justify-items-center mt-3 mb-3`,
  });

  paginatedArticles.forEach((article, idx) => {
    let card;
    switch (articleType) {
      case 'library':
        card = createLibraryCard(article, idx === 0);
        break;
      case 'new-lab':
        card = createLabCard(article, idx === 0);
        break;
      case 'application':
      case 'info':
        card = createApplicationCard(article);
        break;
      default:
        card = createArticleCard(article, idx === 0);
    }
    cardList.appendChild(card);
  });

  const filters = createFilters(articles, true);
  const pagination = createPagination(filtered, page, limit);

  block.append(filters, cardList, pagination);
}

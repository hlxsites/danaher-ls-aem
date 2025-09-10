import ffetch from '../../scripts/ffetch.js';
import { a } from '../../scripts/dom-builder.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import {
  ul, span,
} from '../../scripts/dom-builder.js';
import createCard from '../card-list/articleCard.js';
import { getEdgeDeliveryPath } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const articleType = getMetadata('template').toLowerCase();
  const articleTopics = getMetadata('topics')?.toLowerCase();
  const url = new URL(getMetadata('og:url'), window.location.origin);
  const path = getEdgeDeliveryPath(url.pathname);
  let articles = await ffetch('/us/en/article-index.json')
    .filter(({ type }) => type.toLowerCase() === articleType)
    .filter(({ topics }) => topics.toLowerCase() === articleTopics)
    .filter((article) => path !== article.path)
    .all();

  articles = articles.sort((item1, item2) => item2.publishDate - item1.publishDate).slice(0, 3);

  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 px-3 sm:px-0 justify-items-center mt-3 mb-3',
  });
  articles.forEach((article, index) => {
    cardList.appendChild(createCard(article, index === 0));
  });

  function goBack() {
  const backArr = window.location.pathname.split('/');
  const backNavigationPath = backArr.slice(0, (backArr.length - 1)).join('/');
  return `${window.location.origin}${backNavigationPath}`;
 }
  const headerRow = document.createElement('div');
  headerRow.className = 'flex w-full justify-between items-center mb-8';
  const spanEl = articles.length > 0 ? span({ class: 'text-lg font-semibold' }, 'You may be interested in') : '';
  const spanE2 = articles.length > 0 ? a({ class: 'my-auto text-base text-danaherpurple-500 font-semibold', href: goBack() }, `Back to ${articleType} →`) : '';
  // Append both spans to header row
  if (spanEl) headerRow.appendChild(spanEl);
  if (spanE2) headerRow.appendChild(spanE2);
  block.textContent = '';
  // const spanEl = articles.length > 0 ? span({ class: 'text-lg font-semibold' }, 'You may be interested in') : '';
  // const spanE2 = articles.length > 0 ? span({ class: 'text-rg font-semibold' }, 'Back to news →') : '';
  // const goParentBack = a({ class: 'my-auto text-base text-danaherpurple-500 font-semibold', href: goBack() }, `← Back to ${articleType}`);
  block.append(headerRow, cardList);
}

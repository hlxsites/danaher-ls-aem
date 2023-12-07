import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import {
  ul, span,
} from '../../scripts/dom-builder.js';
import createCard from '../card-list/articleCard.js';

export default async function decorate(block) {
  const articleType = getMetadata('template').toLowerCase();
  const articleTopics = getMetadata('topics')?.toLowerCase();
  const url = new URL(getMetadata('og:url'));
  let articles = await ffetch('/us/en/article-index.json')
    .filter(({ type }) => type.toLowerCase() === articleType)
    .filter(({ topics }) => topics.toLowerCase() === articleTopics)
    .filter((article) => url.pathname !== article.path)
    .all();

  articles = articles.sort((item1, item2) => item2.publishDate - item1.publishDate).slice(0, 2);

  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 px-3 sm:px-0 justify-items-center mt-3 mb-3',
  });
  articles.forEach((article, index) => {
    cardList.appendChild(createCard(article, index === 0));
  });
  block.textContent = '';
  const spanEl = articles.length > 0 ? span({ class: 'text-lg font-semibold' }, 'You may be interested in') : '';
  block.append(spanEl, cardList);
}

import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import {
  formatDateUTCSeconds, makePublicUrl, imageHelper,
} from '../../scripts/scripts.js';
import {
  ul, li, a, p, time, span, h2,
} from '../../scripts/dom-builder.js';

const createCard = (article, firstCard = false) => {
  const cardTitle = article.title.indexOf('| Danaher Life Sciences') > -1
    ? article.title.split('| Danaher Life Sciences')[0]
    : article.title;

  const cardWrapper = a(
    { href: makePublicUrl(article.path), title: article.title },
    imageHelper(article.image, article.title, firstCard),
    p(
      { class: 'px-3 py-1 pt-4 text-sm text-danaherpurple-500' },
      article.brand || 'Danaher Corporation',
    ),
    p(
      { class: 'px-3 pb-3 text-gray-500 text-sm' },
      time(
        { datetime: formatDateUTCSeconds(article.publishDate) },
        formatDateUTCSeconds(article.publishDate, { month: 'long' }),
      ),
      span({ class: 'pl-2' }, `${article.readingTime} min read`),
    ),
    h2(
      {
        class: 'px-3 text-lg font-semibold text-danahergray-900 mb-4 line-clamp-3 h-20 break-words',
      },
      cardTitle,
    ),
  );

  return li({
    class:
        'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl',
  }, cardWrapper);
};

export default async function decorate(block) {
  const articleType = getMetadata('template').toLowerCase();
  const articleKeyword = getMetadata('keywords')?.toLowerCase();
  const url = new URL(getMetadata('og:url'));
  let articles = await ffetch('/us/en/query-index.json')
    .filter(({ type }) => type.toLowerCase() === articleType)
    .filter(({ keywords }) => keywords.toLowerCase() === articleKeyword)
    .filter((article) => url.pathname !== article.path)
    .all();

  articles = articles.sort((item1, item2) => item2.publishDate - item1.publishDate).slice(0, 3);

  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 px-3 sm:px-0 justify-items-center mt-3 mb-3',
  });
  articles.forEach((article, index) => {
    cardList.appendChild(createCard(article, index === 0));
  });
  block.textContent = '';
  const spanEl = articles.length > 0 ? span({ class: 'text-lg font-semibold' }, 'You may be interested in') : '';
  block.append(spanEl, cardList);
}

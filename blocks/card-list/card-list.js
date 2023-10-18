import ffetch from '../../scripts/ffetch.js';
import {
  ul, li, a, p, div, time, span, h2, img,
} from '../../scripts/dom-builder.js';
import { formatDateUTCSeconds, makePublicUrl } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

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
      { class: 'px-6 py-1 pt-4 text-sm font-semibold text-danaherpurple-500' },
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

export default async function decorate(block) {
  const articleType = block.classList.length > 2 ? block.classList[1] : '';
  if (articleType) block.classList.remove(articleType);
  const articles = await ffetch('/us/en/query-index.json')
    .chunks(500)
    .filter(({ type }) => type.toLowerCase() === articleType)
    .all();
  articles.sort((card1, card2) => card2.publishDate - card1.publishDate);

  const cardList = ul({
    class:
      'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 justify-items-center mt-3 mb-3',
  });
  articles.forEach((article, index) => {
    cardList.appendChild(createCard(article, index === 0));
  });
  block.textContent = '';
  block.append(cardList);
}

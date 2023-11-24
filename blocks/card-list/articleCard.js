import { formatDateUTCSeconds, imageHelper, makePublicUrl } from '../../scripts/scripts.js';
import {
  li, a, p, div, time, span, h2,
} from '../../scripts/dom-builder.js';

export default function createCard(article, firstCard = false) {
  const cardTitle = article.title.indexOf('| Danaher Life Sciences') > -1
    ? article.title.split('| Danaher Life Sciences')[0]
    : article.title;

  const cardWrapper = a(
    { href: makePublicUrl(article.path), title: article.title },
    imageHelper(article.image, article.title, firstCard),
    p(
      { class: 'cards !px-6 !py-1 !pt-4 !text-sm !text-danaherpurple-500' },
      article.brand || 'Danaher Corporation',
    ),
    p(
      { class: '!px-6 !pb-3 !text-gray-500 !text-sm' },
      time(
        { datetime: formatDateUTCSeconds(article.publishDate) },
        formatDateUTCSeconds(article.publishDate, { month: 'long' }),
      ),
      span({ class: 'pl-2' }, `${article.readingTime} min read`),
    ),
    h2(
      {
        class:
          '!px-6 !text-lg !font-semibold !text-danahergray-900 !mb-4 !line-clamp-3 !h-20 !break-words',
      },
      cardTitle,
    ),
    div(
      {
        class:
          'mt-auto inline-flex w-full px-6 py-5 text-base text-danaherpurple-500 font-semibold',
      },
      'Read Article →',
    ),
  );

  return li(
    {
      class:
        'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl',
    },
    cardWrapper,
  );
}

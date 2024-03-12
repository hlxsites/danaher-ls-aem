import { formatDateUTCSeconds, imageHelper, makePublicUrl } from '../../scripts/scripts.js';
import {
  li, a, p, div, time, span, h2,
} from '../../scripts/dom-builder.js';

export default function createCard(article, firstCard = false) {
  const cardTitle = article.title.indexOf('| Danaher Life Sciences') > -1
    ? article.title.split('| Danaher Life Sciences')[0]
    : article.title;

  const cardWrapper = a(
    { class: 'group h-full', href: makePublicUrl(article.path), title: article.title },
    imageHelper(article.image, article.title, firstCard),
    div(
      { class: '' },
      p(
        { class: 'text-sm font-medium text-danaherpurple-800 pb-1 pt-4' },
        article.brand || 'Danaher Corporation',
      ),
      p(
        { class: 'text-base text-gray-500 font-extralight' },
        time(
          { datetime: formatDateUTCSeconds(article.publishDate) },
          formatDateUTCSeconds(article.publishDate, { month: 'long' }),
        ),
        span({ class: 'pl-2' }, `${article.readingTime} min read`),
      ),
      h2(
        {
          class:
            'text-xl text-black font-medium mb-4 line-clamp-3 break-words',
        },
        cardTitle,
      ),
      div(
        {
          class:
            'mt-auto inline-flex w-full py-5 text-base text-danaherpurple-500 font-semibold',
        },
        'Read Article →',
      ),
    ),
  );

  return li(
    {
      class:
        'w-full h-full article flex flex-col col-span-1 relative mx-auto justify-center overflow-hidden bg-white transform transition duration-500 hover:scale-105',
    },
    cardWrapper,
  );
}

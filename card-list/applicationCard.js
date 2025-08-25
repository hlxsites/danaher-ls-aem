import { makePublicUrl } from '../../scripts/scripts.js';
import {
  li, a, p, div, h2,
} from '../../scripts/dom-builder.js';

export default function createCard(article) {
  const cardTitle = article.title.indexOf('| Danaher Life Sciences') > -1
    ? article.title.split('| Danaher Life Sciences')[0]
    : article.title;

  const cardWrapper = a(
    { href: makePublicUrl(article.path), title: article.title },
    h2(
      {
        class:
          '!px-6 !text-lg !font-semibold !text-danahergray-900 !mb-4 !line-clamp-3 !h-20 !break-words',
      },
      cardTitle,
    ),
    p(
      { class: 'px-6 text-sm text-gray-500 pb-0 pt-0 pb-4 line-clamp-4 h-20 break-words' },
      article.description,
    ),
    div(
      {
        class:
          'inline-flex w-full px-6 py-5 text-base text-danaherblue-600 font-semibold',
      },
      'View Application →',
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

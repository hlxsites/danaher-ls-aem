import { imageHelper, makePublicUrl } from '../../scripts/scripts.js';
import {
  li, a, p, div, h3,
} from '../../scripts/dom-builder.js';

export default function createCard(article, firstCard = false) {
  const cardTitle = article.title.split('| Danaher Life Sciences')[0] || article.title;

  const cardWrapper = a(
    { class: 'group h-full', href: makePublicUrl(article.path), title: article.title },
    imageHelper(article.image, article.title, firstCard),
    div(
      { class: '' },
      p(
        { class: 'eyebrow-sm' },
        article.brand || 'Danaher Corporation',
      ),
      h3(
        {
          class:
            'text-black font-medium mb-4 mt-4 line-clamp-3 break-words !h-24',
        },
        cardTitle,
      ),
      div(
        {
          class:
            'mt-auto inline-flex w-full py-5 text-base text-danaherpurple-500 font-semibold',
        },
        a({href: '/us/en/new-lab/join-today'}, 'Get Offer -->'),
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

import { makePublicUrl } from '../../scripts/scripts.js';
import {
  li, a, p, div, h2, img,
} from '../../scripts/dom-builder.js';

export default function createCard(article) {
  const cardTitle = article.title.indexOf('| Danaher Life Sciences') > -1
    ? article.title.split('| Danaher Life Sciences')[0]
    : article.title;

  const fallbackImagePath = '/content/dam/danaher/system/icons/preview-image.png';
  const rawSrc = article.image ?? fallbackImagePath;
  const safeSrc = rawSrc || fallbackImagePath;
  const alt = article.title || 'Product image';
  const cardWrapper = a(
    { class: 'group h-full', href: makePublicUrl(article.path), title: article.title },
    img({
      src: safeSrc,
      alt,
      class: 'mb-2 h-48 w-full object-cover',
      loading: 'lazy',
      decoding: 'async',
    }),
    div(
      { class: '' },
      p(
        { class: 'eyebrow-sm' },
        article.brand || 'Danaher Corporation',
      ),
      h2(
        {
          class:
            '!text-xl text-black font-medium mb-4 mt-4 line-clamp-3 break-words !h-20',
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

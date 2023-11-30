import {
  li, a, h4,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';

export default function createCard(product, firstCard = false) {
  const cardWrapper = a(
    { href: makePublicUrl(product.path), title: product.title },
    imageHelper(product.image, product.title, firstCard),
    h4(
      {
        class: '!text-sm !font-normal !text-danahergray-900 !line-clamp-3 !break-words !h-14',
      },
      `${product.title}→`,
    ),
  );
  const card = li({
    class:
        'w-52 lg:w-44 h-52 flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border-l border-black hover:scale-105 overflow-hidden bg-white max-w-xl pl-6 pr-6 lg:pr-0',
  }, cardWrapper);
  card.querySelector('img').className = 'mb-2 h-24 w-full object-cover';
  return card;
}

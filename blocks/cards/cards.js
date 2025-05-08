import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import {
  a, div,
} from '../../scripts/dom-builder.js';
import { makePublicUrl } from '../../scripts/scripts.js';

export default function decorate(block) {
  if (block.parentElement.parentElement.classList.contains('cards-container')) {
    block.parentElement.parentElement.classList.remove(...'bg-danaherlightblue-50'.split(' '));
  }

  block.classList.add(...'list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16'.split(' '));
  block.classList.add(block.classList.contains('cols-4') ? 'lg:grid-cols-4' : 'lg:grid-cols-3');

  [...block.children].forEach((row) => {
    let type = '';
    const heading = row.querySelector('h2');
    if (heading) heading.className = 'card-title text-gray-900 my-2 font-extrabold text-3xl py-2';

    const h3Heading = row.querySelector('h3');
    const typeP = h3Heading?.previousElementSibling;
    if (typeP) {
      type = typeP.textContent;
      typeP.remove();
      block.classList.add(type.toLowerCase());
    }

    const readMoreProp = row.querySelector('[data-aue-prop="card_href"]');
    const readMoreText = readMoreProp?.textContent?.trim();
    const readMoreHref = readMoreProp?.querySelector('a')?.href;

    const readMoreLink = (readMoreText && readMoreText !== 'undefined')
      ? a({
          href: makePublicUrl(readMoreHref || '#'),
          class: 'text-blue-600 text-sm font-semibold mt-2 inline-block hover:underline',
        }, `${readMoreText} →`)
      : null;

    const cardWrapper = div();
    cardWrapper.className = 'card-wrapper flex flex-col col-span-1 mx-auto justify-center max-w-xl overflow-hidden pl-8 pr-2 border-l-[0.5px] border-gray-300 transform transition duration-500 hover:scale-105';
    if (!block.classList.contains('opco')) {
      cardWrapper.classList.remove(...'border-l-[0.5px] border-gray-300 pl-8 pr-2 transform transition duration-500 hover:scale-105'.split(' '));
    }
    if (!type) {
      cardWrapper.classList.add('cursor-pointer', 'relative', 'transform', 'transition', 'duration-500', 'border', 'hover:scale-105', 'shadow-lg', 'rounded-lg');
    }

    row.append((heading) || '');
    [...row.children].forEach((elem) => {
      cardWrapper.append(elem);

      if (elem.querySelector('picture, img')) {
        elem.className = 'cards-card-image h-52 leading-5';
      } else {
        elem.className = 'cards-card-body p-4 bg-white rounded-b px-0 py-2';
      }

      const h3 = elem.querySelector('h3');
      if (h3) {
        h3.className = block.classList.contains('opco')
          ? '!line-clamp-2 !h-16'
          : 'pl-2 text-lg font-semibold text-danahergray-900 !line-clamp-3 !break-words !h-24';
      }

      const para = elem.querySelector('p');
      if (para) {
        para.className = block.classList.contains('opco')
          ? 'mb-4 text-sm !h-20 !line-clamp-4 !break-words'
          : 'pl-2 mb-4 text-sm !h-20 !line-clamp-4 !break-words';
      }

      // Append read more link at bottom of the content section
      if (readMoreLink && elem.classList.contains('cards-card-body')) {
        elem.append(readMoreLink);
      }
    });

    block.appendChild(cardWrapper);
  });

  block.querySelectorAll('img').forEach((img) => {
    const picture = img.closest('picture');
    const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
    if (block.classList.contains('opco')) {
      optimized.querySelector('img').className = 'h-48 w-full rounded-t !object-contain';
    }
    if (picture) picture.replaceWith(optimized);
  });
}

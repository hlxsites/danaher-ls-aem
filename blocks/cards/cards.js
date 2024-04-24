import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import {
  a, div, li, ul,
} from '../../scripts/dom-builder.js';
import { makePublicUrl } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ulElement = ul({ class: 'list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16' });
  if (block.classList.contains('cols-4')) ulElement.classList.add('lg:grid-cols-4');
  else ulElement.classList.add('lg:grid-cols-3');

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
    let readMoreLink = row.querySelector('a');
    const cardWrapper = (readMoreLink)
      ? a({ href: makePublicUrl(readMoreLink.href), title: readMoreLink.title })
      : div();
    cardWrapper.className = 'card-wrapper flex flex-col col-span-1 mx-auto justify-center max-w-xl overflow-hidden pl-8 pr-2 border-l-[0.5px] border-gray-300 transform transition duration-500 hover:scale-105';
    if (!block.classList.contains('opco')) cardWrapper.classList.remove(...'border-l-[0.5px] border-gray-300'.split(' '));
    if (!type) cardWrapper.classList.add('...cursor-pointer relative transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg'.split(' '));
    const card = li((heading) || '', cardWrapper);
    cardWrapper.innerHTML = row.innerHTML;
    [...cardWrapper.children].forEach((elem) => {
      if (elem.querySelector('picture, img')) {
        elem.className = 'cards-card-image leading-5';
      } else {
        elem.className = 'cards-card-body p-4 bg-white rounded-b px-0 py-2';
      }
      if (elem?.querySelector('h3')) elem.querySelector('h3').className = '!line-clamp-2 !h-16 !text-2xl !font-normal';
      if (elem?.querySelector('p')) elem.querySelector('p').className = 'mb-4 text-sm text-gray-500 !h-20 !line-clamp-4 !break-words';
    });

    readMoreLink = cardWrapper.querySelector('a');
    if (readMoreLink) {
      readMoreLink.innerHTML += ' &rarr;';
      readMoreLink.className = 'card-link inline-flex w-full pt-5 text-base text-danaherpurple-500 font-semibold';
      card.querySelector('div.cards-card-body').append(readMoreLink);
    }
    ulElement.append(card);
  });
  ulElement.querySelectorAll('img').forEach((img) => {
    const picture = img.closest('picture');
    const cardImage = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    cardImage.querySelector('img').className = 'h-48 w-full rounded-t !object-contain';
    if (picture) picture.replaceWith(cardImage);
  });
  block.textContent = '';
  block.append(ulElement);
}

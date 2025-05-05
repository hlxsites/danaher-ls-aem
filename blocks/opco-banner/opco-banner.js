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
  if (block.classList.contains('cols-4')) block.classList.add('lg:grid-cols-4');
  else block.classList.add('lg:grid-cols-3');

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
    const readMoreLink = row.querySelector('a');
    const cardWrapper = (readMoreLink)
      ? a({ href: makePublicUrl(readMoreLink.href), title: readMoreLink.title })
      : div();
    cardWrapper.className = 'card-wrapper flex flex-col col-span-1 mx-auto justify-center max-w-xl overflow-hidden pl-8 pr-2 border-l-[0.5px] border-gray-300 transform transition duration-500 hover:scale-105';
    if (!block.classList.contains('opco')) cardWrapper.classList.remove(...'border-l-[0.5px] border-gray-300 pl-8 pr-2 transform transition duration-500 hover:scale-105'.split(' '));
    if (!type) cardWrapper.classList.add('...cursor-pointer relative transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg'.split(' '));
    row.append((heading) || '');
    [...row.children].forEach((elem) => {
      cardWrapper.append(elem);
      if (elem.querySelector('picture, img')) {
        elem.className = 'cards-card-image h-52 leading-5';
      } else {
        elem.className = 'cards-card-body p-4 bg-white rounded-b px-0 py-2';
      }
      if (elem?.querySelector('h3')) elem.querySelector('h3').className = '!line-clamp-2 !h-16';
      if (elem?.querySelector('h3') && !block.classList.contains('opco')) elem.querySelector('h3').className = 'pl-2 text-lg font-semibold text-danahergray-900 !line-clamp-3 !break-words !h-24';
      if (elem?.querySelector('p')) elem.querySelector('p').className = 'mb-4 text-sm !h-20 !line-clamp-4 !break-words';
      if (elem?.querySelector('p') && !block.classList.contains('opco')) elem.querySelector('p').className = 'pl-2 mb-4 text-sm !h-20 !line-clamp-4 !break-words';
      row.append(cardWrapper);
    });
    if (readMoreLink) {
      readMoreLink.innerHTML += ' &rarr;';
      if (block.classList.contains('opco')) { readMoreLink.className = 'card-link inline-flex w-full pt-5 text-base text-danaherpurple-500 font-semibold'; } else readMoreLink.className = 'pl-2 card-link inline-flex w-full pt-5 text-base text-danaherpurple-500 font-semibold';
      row.querySelector('div.cards-card-body').append(readMoreLink);
    }
  });
  block.querySelectorAll('img').forEach((img) => {
    const picture = img.closest('picture');
    const cardImage = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    if (block.classList.contains('opco')) { cardImage.querySelector('img').className = 'h-48 w-full rounded-t !object-contain'; }
    if (picture) picture.replaceWith(cardImage);
  });
}

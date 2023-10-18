import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { a, div, li } from '../../scripts/dom-builder.js';
import { makePublicUrl } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const heading = row.querySelector('h2');
    heading.className = 'card-title';
    let readMoreLink = row.querySelector('a');
    const cardWrapper = readMoreLink
      ? a({ href: makePublicUrl(readMoreLink.href), title: readMoreLink.title })
      : div();
    cardWrapper.className = 'card-wrapper';
    const card = li(heading, cardWrapper);
    cardWrapper.innerHTML = row.innerHTML;

    [...cardWrapper.children].forEach((e) => {
      if (e.querySelector('picture, img')) e.className = 'cards-card-image';
      else e.className = 'cards-card-body';
    });

    readMoreLink = cardWrapper.querySelector('a');
    if (readMoreLink) {
      readMoreLink.innerHTML += ' &rarr;';
      readMoreLink.className = 'card-link';
      card.querySelector('div.cards-card-body').append(readMoreLink);
    }

    ul.append(card);
  });
  ul.querySelectorAll('img').forEach((img) => {
    const picture = img.closest('picture');
    if (picture) picture.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.textContent = '';
  block.append(ul);
}

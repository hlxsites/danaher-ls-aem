import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { a, li } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const heading = row.querySelector('h2');
    heading.className = 'card-title';
    const cardLink = a({ class: 'card-wrapper' });
    const card = li(heading, cardLink);
    cardLink.innerHTML = row.innerHTML;

    [...cardLink.children].forEach((div) => {
      if (div.querySelector('picture, img')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    const readMoreLink = cardLink.querySelector('a');
    readMoreLink.innerHTML += ' &rarr;';
    readMoreLink.className = 'card-link';
    card.querySelector('div.cards-card-body').append(readMoreLink);

    ul.append(card);
  });
  ul.querySelectorAll('img').forEach((img) => {
    const picture = img.closest('picture');
    if (picture) picture.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.textContent = '';
  block.append(ul);
}

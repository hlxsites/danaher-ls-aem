import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const heading = row.querySelector('h2');
    heading.className = 'card-title';
    const link = row.querySelector('a');
    link.className = 'card-link';
    link.innerHTML += ' &rarr;';

    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';
    cardWrapper.append(heading);
    
    li.innerHTML = row.innerHTML;

    [...li.children].forEach((div) => {
      if (div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    li.addEventListener('click', () => {
      link.click();
    });

    cardWrapper.append(li);
    ul.append(cardWrapper);
    li.querySelector('div.cards-card-body').append(link);
    
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}

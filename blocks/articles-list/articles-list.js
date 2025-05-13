import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import {
  ul, div, a, h2,
} from '../../scripts/dom-builder.js';
import createCard from '../card-list/articleCard.js';
import createLabCard from '../card-list/newLabCard.js';

export default async function decorate(block) {
  const brandName = getMetadata('brand');
  const pageType = block.classList.length > 2 ? block.classList[1] : '';
  if (pageType) block.classList.remove(pageType);

  let articleType = 'news';
  let indexType = '';
  let targetUrl = '/us/en/news';

  switch (pageType) {
    case 'new-lab':
      indexType = 'promotions';
      articleType = 'new-lab';
      targetUrl = '/us/en/new-lab/promotions';
      break;
    default:
      indexType = 'article';
  }

  let articles = await ffetch(`/us/en/${indexType}-index.json`)
    .filter(({ brand }) => {
      const match = brandName && brandName !== '' && brand
        ? brandName.toLowerCase() === brand.toLowerCase()
        : true;
      return match;
    })
    .filter(({ type }) => type.toLowerCase() === articleType)
    .all();

  articles = articles
    .sort((a, b) => b.publishDate - a.publishDate)
    .slice(0, 3);

  const cardList = ul({
    class: 'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 px-3 sm:px-0 justify-items-start',
  });

  articles.forEach((article, index) => {
    const card = pageType === 'new-lab'
      ? createLabCard(article, index === 0)
      : createCard(article, index === 0);

    // Ensure left alignment and spacing
    card.classList.add('text-left', 'pr-6', 'pb-2');

    // Add vertical separator on large screens except last card
    if (index < 2) {
      card.classList.add('lg:border-r', 'lg:border-gray-200');
    }

    cardList.appendChild(card);
  });

  const compHeading = block.querySelector('div')?.innerText;
  block.textContent = '';

  if (!block.parentElement?.parentElement.className.includes('top-border')) {
    block.classList.add('space-y-6', 'border-t', 'border-solid', 'border-black');
  }

  let divEl;
  if (articles.length > 0) {
    divEl = div(
      { class: 'flex items-center justify-between pt-4' },
      h2({ class: 'mt-4' }, `${compHeading}`),
      a({ class: 'text-sm font-bold text-danaherpurple-500', href: targetUrl }, 'See all →'),
    );
  }

  block.append(divEl, cardList);
}

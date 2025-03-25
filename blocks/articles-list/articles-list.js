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
      if (brandName && brandName !== '' && brand) {
        return brandName.toLowerCase() === brand.toLowerCase();
      }
      return true;
    })
    .filter(({ type }) => type.toLowerCase() === articleType)
    .all();

  articles = articles.sort((item1, item2) => item2.publishDate - item1.publishDate).slice(0, 3);
  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 px-3 sm:px-0 justify-items-center',
  });
  articles.forEach((article, index) => {
    if (pageType === 'new-lab') {
      cardList.appendChild(createLabCard(article, index === 0));
    } else {
      cardList.appendChild(createCard(article, index === 0));
    }
  });
  const compHeading = block.querySelector('div')?.innerText;
  block.textContent = '';
  if (!block.parentElement?.parentElement.className.includes('top-border')) block.classList.add('space-y-6', 'border-t', 'border-solid', 'border-black');
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

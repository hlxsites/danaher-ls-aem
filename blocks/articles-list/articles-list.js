import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import {
  ul, div, a, h2,
} from '../../scripts/dom-builder.js';
import createCard from '../card-list/articleCard.js';

export default async function decorate(block) {
  const brandName = getMetadata('brand');
  const articleType = 'news';
  let articles = await ffetch('/us/en/article-index.json')
    .filter(({ brand }) => {
      if (brandName !== '') {
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
    cardList.appendChild(createCard(article, index === 0));
  });
  const compHeading = block.querySelector('div')?.innerText;
  block.textContent = '';
  if (!block.parentElement?.parentElement.className.includes('top-border')) block.classList.add('space-y-6', 'border-t', 'border-solid', 'border-black');
  let divEl;
  if (articles.length > 0) {
    divEl = div(
      { class: 'flex items-center justify-between pt-4' },
      h2({ class: 'mt-4' }, `${compHeading}`),
      a({ class: 'text-sm font-bold text-danaherpurple-500', href: '/us/en/news' }, 'See all →'),
    );
  }
  block.append(divEl, cardList);
}

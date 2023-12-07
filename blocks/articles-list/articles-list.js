import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import {
  ul, div,
} from '../../scripts/dom-builder.js';
import createCard from '../card-list/articleCard.js';

export default async function decorate(block) {
  block.parentNode.classList.add('pt-6');
  block.parentNode.prepend(div({ class: 'border-t-0-5 border-solid border-black' }));
  const brand = getMetadata('brand');
  let articles = await ffetch('/us/en/article-index.json')
    .filter((article) => brand === article.brand)
    .all();

  articles = articles.sort((item1, item2) => item2.publishDate - item1.publishDate).slice(0, 3);
  const cardList = ul({
    class:
          'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 px-3 sm:px-0 justify-items-center mt-3 mb-3',
  });
  articles.forEach((article, index) => {
    cardList.appendChild(createCard(article, index === 0));
  });
  block.textContent = '';
  block.classList.add('pb-12');
  const spanEl = articles.length > 0 ? div({ class: 'text-lg font-semibold py-6' }, `${brand} in the news`) : '';
  block.append(spanEl, cardList);
}

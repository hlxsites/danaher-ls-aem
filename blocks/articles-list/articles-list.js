import ffetch from '../../scripts/ffetch.js';
import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';
import {
  ul, div, a, h2, span,
} from '../../scripts/dom-builder.js';
import createCard from '../card-list/articleCard.js';
import createLabCard from '../card-list/newLabCard.js';

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
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
    .sort((as, bs) => bs.publishDate - as.publishDate)
    .slice(0, 3);

  const cardList = ul({
    class:
      'container grid w-full  dhls-container px-5 lg:px-10 dhlsBp:p-0  gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3  justify-items-start',
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
    block.classList.add('space-y-6');
  }

  let divEl = div();
  if (articles.length > 0) {
    divEl = div(
      {
        class:
          'flex items-center justify-between dhls-container px-5 lg:px-10 dhlsBp:p-0  ',
      },
      h2({ class: 'mt-0' }, `${compHeading}`),
      a(
        {
          class:
            'text-danaherpurple-500  [&_svg>use]:hover:stroke-danaherpurple-800  hover:text-danaherpurple-800  text-base font-semibold  flex items-center !m-0 !p-0',
          href: targetUrl,
          target: targetUrl?.includes('http') ? '_blank' : '_self',
        },
        'See all',
        span({
          class:
            'icon icon-arrow-right  dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      ),
    );
    decorateIcons(divEl);
  }
  block.textContent = '';
  decorateIcons(cardList);
  block.append(divEl, cardList);
}

import ffetch from '../../scripts/ffetch.js';
import { getMetadata } from '../../scripts/lib-franklin.js';
import {
  ul, div, a, h2,
} from '../../scripts/dom-builder.js';
import createCard from '../card-list/articleCard.js';
import createLabCard from '../card-list/newLabCard.js';

export default async function decorate(block) {
  console.log('🔍 decorate() called');
  
  const brandName = getMetadata('brand');
  console.log('🔖 Metadata brand:', brandName);

  const pageType = block.classList.length > 2 ? block.classList[1] : '';
  console.log('📄 Page type detected:', pageType);

  if (pageType) block.classList.remove(pageType);

  let articleType = 'news';
  let indexType = '';
  let targetUrl = '/us/en/news';

  switch (pageType) {
    case 'new-lab':
      indexType = 'promotions';
      articleType = 'new-lab';
      targetUrl = '/us/en/new-lab/promotions';
      console.log('⚙️ New lab mode detected');
      break;
    default:
      indexType = 'article';
      console.log('📚 Default article mode');
  }

  console.log('📁 Fetching index type:', indexType);

  let articles = await ffetch(`/us/en/${indexType}-index.json`)
    .filter(({ brand }) => {
      const match = brandName && brandName !== '' && brand
        ? brandName.toLowerCase() === brand.toLowerCase()
        : true;
      if (!match) console.log('⛔️ Skipped brand mismatch:', brand);
      return match;
    })
    .filter(({ type }) => {
      const match = type.toLowerCase() === articleType;
      if (!match) console.log('⛔️ Skipped type mismatch:', type);
      return match;
    })
    .all();

  console.log('✅ Filtered articles:', articles);

  articles = articles
    .sort((item1, item2) => item2.publishDate - item1.publishDate)
    .slice(0, 3);

  console.log('🗂 Top 3 articles sorted:', articles);

  const cardList = ul({
    class:
      'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 px-3 sm:px-0',
  });

  articles.forEach((article, index) => {
    console.log(`🧩 Rendering card #${index + 1}`, article);

    const card = pageType === 'new-lab'
      ? createLabCard(article, index === 0)
      : createCard(article, index === 0);

    // ✅ Left-align all content and apply vertical border between cards
    card.classList.add(
      'text-left',
      'border-r', 'border-gray-200',
      'pr-6',
      'last:border-none'
    );

    cardList.appendChild(card);
  });

  const compHeading = block.querySelector('div')?.innerText;
  console.log('🧷 Component heading:', compHeading);

  block.textContent = '';

  if (!block.parentElement?.parentElement.className.includes('top-border')) {
    block.classList.add('space-y-6', 'border-t', 'border-solid', 'border-black');
    console.log('🪄 Added border styles to block');
  }

  let divEl;
  if (articles.length > 0) {
    divEl = div(
      { class: 'flex items-center justify-between pt-4' },
      h2({ class: 'mt-4 text-left' }, `${compHeading}`),
      a({ class: 'text-sm font-bold text-danaherpurple-500 text-left', href: targetUrl }, 'See all →'),
    );
    console.log('🧱 Header + CTA built');
  } else {
    console.log('⚠️ No articles found, skipping header build');
  }

  block.append(divEl, cardList);
  console.log('✅ Final content appended to block');
}

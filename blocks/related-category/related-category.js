import { div, a, img } from '../../scripts/dom-builder.js';
import { renderProductJsonResponse } from '../../scripts/common-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
async function getCategoryInfo(category) {
  const api = true;

  if (api) {
    try {
      const res = await fetch('https://lifesciences.danaher.com/us/en/products-index.json');
      if (!res.ok) {
        return {};
      }
      const data = await res.json();

      const products = data.data;
      if (!Array.isArray(products)) {
        return {};
      }

      const product = products.find((item) => item.fullCategory === category);
      if (!product) {
        return {};
      }

      return {
        title: product.title,
        path: product.path,
        image: product.image,
        description: product.description,
      };
    } catch (e) {
      return {};
    }
  } else {
    return {};
  }
}

function renderGridCard(item) {
  const card = div({
    class: 'w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] bg-white outline outline-1 outline-gray-300 flex flex-col h-full',
  });

  const imageWrapper = div({ class: 'relative w-full' });
  const imageElement = img({
    src: item.image,
    alt: item.title,
    class: 'w-full h-40 object-cover',
  });

  imageWrapper.append(imageElement);

  const contentWrapper = div({
    class: 'flex flex-col justify-between flex-grow w-full p-3',
  });

  const textGroup = div({ class: 'flex flex-col' });

  const titleElement = div({
    class: 'text-black text-xl font-normal leading-7',
  }, item.title);

  const description = div({
    class: 'text-gray-600 text-sm mt-2 line-clamp-4',
  }, item.description);

  textGroup.append(titleElement, description);

  const linkWrapper = div(
    { class: 'self-stretch' },
    a(
      {
        href: item.path,
        class: 'text-violet-600 text-base font-bold leading-snug',
      },
      'Browse Products',
      span({
              class: 'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
            }),
    ),
  );
  decorateIcons(linkWrapper);

  contentWrapper.append(textGroup, linkWrapper);
  card.append(imageWrapper, contentWrapper);

  return card;
}

function getCardsPerPageGrid() {
  return window.innerWidth < 640 ? 1 : 4;
}

export default async function decorate(block) {
  document
    .querySelector('.related-category-wrapper')
    ?.parentElement?.removeAttribute('class');
  document
    .querySelector('.related-category-wrapper')
    ?.parentElement?.removeAttribute('style');

  const relatedCategoryWrapper = div({
    class: 'max-w-[1238px] mx-auto flex flex-col md:flex-row gap-6 mt-12',
  });

  const productIdEl = block.querySelector('[data-aue-prop="productid"]');
  const title = block.querySelector('[data-aue-prop="title"]');
  const rawIds = productIdEl?.textContent.trim() || '';
  if (productIdEl) productIdEl.remove();
  if (title) title.remove();

  const productIds = rawIds.split(',').map((id) => id.trim()).filter(Boolean);

  const relatedCategories = await Promise.all(
    productIds.map(async (id) => {
      const product = await getCategoryInfo(id);
      if (!product?.title) return null;

      return {
        title: product.title,
        image: product.image,
        description: product.description,
        path: product.path,
      };
    }),
  );

  const validItems = relatedCategories.filter(Boolean);

  // Fallback if no valid items found
  if (validItems.length === 0) {
    const fallbackProducts = renderProductJsonResponse(7);
    fallbackProducts.forEach((product) => {
      validItems.push({
        title: product.defaultcategoryname,
        image: product.imageslms?.[0] || '',
        description: product.description,
        path: product.sysuri,
      });
    });
  }

  let cardsPerPageGrid = getCardsPerPageGrid();
  let currentIndex = 0;

  const carouselContainer = div({
    class: 'carousel-container h-[434px] flex flex-col w-full justify-center',
  });

  const carouselHead = div({
    class: 'w-full flex flex-col sm:flex-row h-10 justify-between items-center gap-3 mb-6',
  });

  const leftGroup = div({ class: 'flex flex-wrap sm:flex-nowrap items-center gap-4' });
  const productTitle = div({
    class: 'text-black text-2xl font-normal leading-loose whitespace-nowrap',
  }, title?.textContent || '');
  leftGroup.append(productTitle);

  const arrowGroup = div({ class: 'flex justify-start items-center gap-3' });
  const prevDiv = div({ class: 'carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer' });
  const nextDiv = div({ class: 'carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer' });
  arrowGroup.append(prevDiv, nextDiv);
  carouselHead.append(leftGroup, arrowGroup);

  const carouselCards = div({
    class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full',
  });

  function updateCarousel() {
    carouselCards.innerHTML = '';

    const cardsToDisplay = validItems.slice(currentIndex, currentIndex + cardsPerPageGrid);
    cardsToDisplay.forEach((item) => {
      const card = renderGridCard(item);
      if (card) carouselCards.append(card);
    });

    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
        stroke="${currentIndex > 0 ? '#7523FF' : '#D1D5DB'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
        stroke="${currentIndex + cardsPerPageGrid < validItems.length ? '#7523FF' : '#D1D5DB'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  prevDiv.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= cardsPerPageGrid;
      updateCarousel();
    }
  });

  nextDiv.addEventListener('click', () => {
    if (currentIndex + cardsPerPageGrid < validItems.length) {
      currentIndex += cardsPerPageGrid;
      updateCarousel();
    }
  });

  window.addEventListener('resize', () => {
    const newCardsPerPageGrid = getCardsPerPageGrid();
    if (newCardsPerPageGrid !== cardsPerPageGrid) {
      cardsPerPageGrid = newCardsPerPageGrid;
      currentIndex = 0;
      updateCarousel();
    }
  });

  updateCarousel();
  carouselContainer.append(carouselHead, carouselCards);
  relatedCategoryWrapper.append(carouselContainer);
  block.innerHTML = '';
  block.append(relatedCategoryWrapper);
}

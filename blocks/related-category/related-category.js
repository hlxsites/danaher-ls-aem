import {
  div, a, img, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

async function getCategoryInfo(category) {
  const api = true;

  if (api) {
    try {
      const res = await fetch(
        'https://lifesciences.danaher.com/us/en/products-index.json',
      );
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
    class:
      'w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] bg-white outline outline-1 outline-gray-300 flex flex-col',
  });

  const imageWrapper = div({ class: 'relative w-full' });
  const imageElement = img({
    src: item.image,
    alt: item.title,
    class: 'w-full h-40 object-cover',
  });

  imageWrapper.append(imageElement);

  const contentWrapper = div({
    class: 'flex flex-col justify-between flex-grow w-full',
  });

  const titleElement = div(
    {
      class: 'p-3',
    },
    div(
      {
        class:
          'text-black text-xl font-medium line-clamp-2 overflow-hidden leading-7',
      },
      (item.title || '').replace(/<[^>]*>/g, '').trim(),
    ),
  );
  const description = div(
    {
      class: 'p-3',
    },
    div(
      {
        class:
          'justify-start text-black text-base font-normal line-clamp-3 overflow-hidden',
      },
      (item.description || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  const linkWrapper = div(
    { class: 'self-stretch p-3' },
    a(
      {
        href: item.path,
        class: 'text-danaherpurple-500 text-base font-bold leading-snug hover:text-danaherpurple-800 [&_svg>use]:hover:stroke-danaherpurple-800',
      },
      'Browse Products',
      span({
        class:
          'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 inherit',
      }),
    ),
  );
  decorateIcons(linkWrapper);

  contentWrapper.append(titleElement, description, linkWrapper);
  card.append(imageWrapper, contentWrapper);

  return card;
}

function getCardsPerPageGrid() {
  return window.innerWidth < 640 ? 1 : 4;
}

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const relatedCategoryWrapper = div({
    class: 'dhls-container mx-auto flex flex-col md:flex-row gap-6 lg:px-0',
  });

  const productIdEl = block.querySelector('[data-aue-prop="productid"]');
  const title = block.querySelector('[data-aue-prop="title"]');
  const rawIds = productIdEl?.textContent.trim() || '';
  if (productIdEl) productIdEl.remove();
  if (title) title.remove();

  const productIds = rawIds
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

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
    validItems.push({
      title: '',
      image: '',
      description: '',
      path: '',
    });
  }

  let cardsPerPageGrid = getCardsPerPageGrid();
  let currentIndex = 0;

  const carouselContainer = div({
    class: 'carousel-container flex flex-col w-full justify-center',
  });

  const carouselHead = div({
    class:
      'w-full flex flex-col sm:flex-row md:h-10 justify-between md:items-center gap-3 mb-6',
  });

  const leftGroup = div({
    class: 'flex flex-wrap sm:flex-nowrap items-center gap-4',
  });
  const productTitle = div(
    {
      class: 'text-black text-2xl font-medium whitespace-nowrap',
    },
    title?.textContent || '',
  );
  leftGroup.append(productTitle);

  const arrowGroup = div({ class: 'flex justify-start items-center' });
  const prevDiv = div(
    {
      class: 'carousel-prev-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class: 'icon icon-Arrow-circle-left w-8 h-8 cursor-pointer fill-current',
    }),
  );
  const nextDiv = div(
    {
      class: 'carousel-next-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class: 'icon icon-Arrow-circle-right cursor-pointer w-8 h-8 fill-current',
    }),
  );
  arrowGroup.append(prevDiv, nextDiv);
  decorateIcons(arrowGroup);

  carouselHead.append(leftGroup, arrowGroup);

  const carouselCards = div({
    class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full',
  });

  function updateCarousel() {
    carouselCards.innerHTML = '';

    const cardsToDisplay = validItems.slice(
      currentIndex,
      currentIndex + cardsPerPageGrid,
    );
    cardsToDisplay.forEach((item) => {
      const card = renderGridCard(item);
      if (card) carouselCards.append(card);
    });

    // Update prev arrow state - only change the stroke color
    const prevIcon = prevDiv.querySelector('span');
    const prevSvg = prevIcon.querySelector('svg use');
    if (prevSvg) {
      if (currentIndex > 0) {
        prevSvg.style.stroke = '#7523FF'; // danaherpurple-500
        prevDiv.style.cursor = 'pointer';
      } else {
        prevSvg.style.stroke = '#D1D5DB'; // gray-300
        prevDiv.style.cursor = 'not-allowed';
      }
    }

    // Update next arrow state - only change the stroke color
    const nextIcon = nextDiv.querySelector('span');
    const nextSvg = nextIcon.querySelector('svg use');
    if (nextSvg) {
      if (currentIndex + cardsPerPageGrid < validItems.length) {
        nextSvg.style.stroke = '#7523FF'; // danaherpurple-500
        nextDiv.style.cursor = 'pointer';
      } else {
        nextSvg.style.stroke = '#D1D5DB'; // gray-300
        nextDiv.style.cursor = 'not-allowed';
      }
    }
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

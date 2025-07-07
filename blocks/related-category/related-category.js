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
<<<<<<< HEAD
  const fallbackImagePath = '/content/dam/danaher/products/fallback-image.png';

  // Create image with fallback functionality
  const createImageWithFallback = (src, alt) => {
    const imageElement = img({
      src: src || fallbackImagePath,
      alt: alt || 'Product image',
      class: 'w-full h-40 object-cover',
    });

    imageElement.addEventListener('error', () => {
      imageElement.src = fallbackImagePath;
      imageElement.alt = 'Product image not available';
    });

    return imageElement;
  };

=======
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  const card = div({
    class:
      'w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] bg-white outline outline-1 outline-gray-300 flex flex-col',
  });

  const imageWrapper = div({ class: 'relative w-full' });
<<<<<<< HEAD
  const imageElement = createImageWithFallback(item.image, item.title);
=======
  const imageElement = img({
    src: item.image,
    alt: item.title,
    class: 'w-full h-40 object-cover',
  });
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

  imageWrapper.append(imageElement);

  const contentWrapper = div({
    class: 'flex flex-col justify-between flex-grow w-full',
  });

  const titleElement = div(
    {
<<<<<<< HEAD
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
=======
      class:
        'text-black text-xl font-normal p-3 leading-7 line-clamp-2 leading-snug',
    },
    (item.title || '').replace(/<[^>]*>/g, '').trim(),
  );

>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  const description = div(
    {
      class: 'p-3',
    },
    div(
      {
        class:
<<<<<<< HEAD
          'justify-start text-black text-base font-normal line-clamp-3 overflow-hidden',
=======
          'text-gray-600 text-sm line-clamp-3 leading-snug overflow-hidden',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
      },
      (item.description || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  const linkWrapper = div(
    { class: 'self-stretch p-3' },
    a(
      {
        href: item.path,
<<<<<<< HEAD
        class: 'text-danaherpurple-500 text-base font-bold leading-snug hover:text-danaherpurple-800 [&_svg>use]:hover:stroke-danaherpurple-800',
=======
        class: 'text-violet-600 text-base font-bold leading-snug',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
      },
      'Browse Products',
      span({
        class:
<<<<<<< HEAD
          'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 inherit',
=======
          'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD

  const productIdEl = block.children[1]?.textContent.trim() || '';
  const title = block.firstElementChild?.firstElementChild?.firstElementChild?.textContent.trim() || '';
  const rawIds = productIdEl;
=======
  const relatedCategoryWrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0',
  });

  const productIdEl = block.querySelector('[data-aue-prop="productid"]');
  const title = block.querySelector('[data-aue-prop="title"]');
  const rawIds = productIdEl?.textContent.trim() || '';
  if (productIdEl) productIdEl.remove();
  if (title) title.remove();
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

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

<<<<<<< HEAD
  // If no valid items, do not append wrapper to avoid taking space
  if (validItems.length === 0) {
    return;
  }

  const relatedCategoryWrapper = div({
    class: 'dhls-container mx-auto flex flex-col md:flex-row gap-6 lg:px-0',
  });

  const carouselCards = div({
    class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full',
  });

  // If fewer than 5 items, show static cards without carousel
  if (validItems.length < 5) {
    validItems.forEach((item) => {
      const card = renderGridCard(item);
      if (card) carouselCards.append(card);
    });
    relatedCategoryWrapper.append(carouselCards);
    block.append(relatedCategoryWrapper);
    return;
  }

  // Full carousel for 5 or more items
=======
  // Fallback if no valid items found
  if (validItems.length === 0) {
    validItems.push({
      title: '',
      image: '',
      description: '',
      path: '',
    });
  }

>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD
      class: 'text-black text-2xl font-medium whitespace-nowrap',
=======
      class: 'text-black text-2xl font-normal leading-loose whitespace-nowrap',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    },
    title?.textContent || '',
  );
  leftGroup.append(productTitle);

  const arrowGroup = div({
<<<<<<< HEAD
    class: 'flex md:justify-start justify-end items-center',
  });
  const prevDiv = div({
    class:
      'carousel-prev-div w-8 h-8 relative overflow-hidden cursor-pointer',
  });
  const nextDiv = div({
    class:
      'carousel-next-div w-8 h-8 relative overflow-hidden cursor-pointer',
=======
    class: 'flex md:justify-start justify-end items-center gap-3',
  });
  const prevDiv = div({
    class:
      'carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer',
  });
  const nextDiv = div({
    class:
      'carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  });
  arrowGroup.append(prevDiv, nextDiv);
  carouselHead.append(leftGroup, arrowGroup);

<<<<<<< HEAD
=======
  const carouselCards = div({
    class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full',
  });

>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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

    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
<<<<<<< HEAD
        stroke="${currentIndex > 0 ? '#7523FF' : '#D1D5DB'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
=======
        stroke="${
  currentIndex > 0 ? '#7523FF' : '#D1D5DB'
}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
      </svg>`;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
<<<<<<< HEAD
        stroke="${currentIndex + cardsPerPageGrid < validItems.length ? '#7523FF' : '#D1D5DB'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
=======
        stroke="${
  currentIndex + cardsPerPageGrid < validItems.length
    ? '#7523FF'
    : '#D1D5DB'
}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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

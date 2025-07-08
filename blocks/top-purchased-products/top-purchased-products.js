import { div, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import renderGridCard from './gridData.js';
import { getProductInfo } from '../../scripts/common-utils.js';
/**
 * Determines the number of cards to display per page in grid view based on window width.
 * @returns {number} - Number of cards per page (1 for mobile, 2 for tablet, 4 for desktop).
 */
function getCardsPerPageGrid() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 4;
}

/**
 * Main function to decorate the top-selling block with a carousel of product cards.
 * @param {HTMLElement} block - The block element to decorate.
 */
export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const wrapper = block.closest('.top-selling-products-wrapper');
  if (wrapper) {
    wrapper.classList.add('w-full', 'md:px-10');
  }
  const [
    heading,
    blockProductIds,
    productsEndPoint = null,
    productsSource = null,
  ] = block.children;

  const headingText = heading?.textContent.trim().replace(/<[^>]*>/g, '');
  const rawIds = blockProductIds?.textContent.trim().replace(/<[^>]*>/g, '') || '';
  const productIds = rawIds
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  let cardsPerPageGrid = getCardsPerPageGrid();
  const cardsPerPageList = 7;
  let currentPage = 1;
  let currentIndex = 0;
  let isGridView = true;

  const blockWrapper = div({
    class:
      'top-selling-rendered w-full  dhls-container px-5 lg:px-10 dhlsBp:p-0 flex flex-col gap-4',
  });
  const carouselContainer = div({
    class:
      'carousel-container flex flex-col w-full py-6 pt-0 pb-0 justify-center',
  });
  const carouselHead = div({
    class:
      'w-full flex flex-col sm:flex-row justify-between items-center gap-3 pb-6',
  });

  const leftGroup = div({
    class: 'flex flex-wrap sm:flex-nowrap items-center gap-4',
  });
  leftGroup.append(
    div(
      {
        class: 'text-black text-2xl font-medium leading-[2.5rem]',
      },
      headingText ?? '',
    ),
  );

  const arrows = div({
    class: 'w-full md:w-72 inline-flex justify-end items-center gap-6',
  });
  const arrowGroup = div({ class: 'flex justify-start items-center' });
  const prevDiv = div(
    {
      class:
        'carousel-prev-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-left  cursor-pointer pointer-events-none w-8 h-8 fill-current [&_svg>use]:stroke-gray-300 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const nextDiv = div(
    {
      class:
        'carousel-next-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-right  cursor-pointer w-8 h-8 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  arrowGroup.append(prevDiv, nextDiv);
  decorateIcons(arrowGroup);
  const viewModeGroup = div({ class: 'flex justify-start items-center' });
  const listBtn = div(
    {
      class:
        'px-3 py-2 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-hidden cursor-pointer',
    },
    div(
      { class: 'w-5 h-5 relative overflow-hidden' },
      span({
        class:
          'icon icon-view-list w-5 h-5 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600',
      }),
    ),
  );
  const gridBtn = div(
    {
      class:
        'px-3 py-2 bg-danaherpurple-500 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-hidden cursor-pointer',
    },
    div(
      { class: 'w-5 h-5 relative overflow-hidden' },
      span({
        class:
          'icon icon-view-grid w-5 h-5 absolute fill-current text-white [&_svg>use]:stroke-white',
      }),
    ),
  );
  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);

  arrows.append(arrowGroup);
  carouselHead.append(leftGroup, arrows);

  const carouselCards = div({
    class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full',
  });
  const paginationContainer = div({
    class:
      'pagination-container flex justify-center items-center gap-2 mt-8 w-full',
    style: 'display: none;',
  });

  const products = (
    await Promise.allSettled(
      productIds.map(async (sku) => getProductInfo(sku, false)),
    )
  )
    .filter((product) => product.status !== 'error')
    .map((product) => product.value)
    .filter((product) => product.title != null && product.title !== '');
  /**
   * Updates the carousel by rendering cards based on the current view (grid or list).
   */
  function updateCarousel() {
    carouselCards.innerHTML = '';

    if (isGridView) {
      const cardsToDisplay = products.slice(
        currentIndex,
        currentIndex + cardsPerPageGrid,
      );
      cardsToDisplay?.forEach((item) => carouselCards.append(renderGridCard(item)));
      paginationContainer.style.display = 'none';
      arrowGroup.style.display = 'flex';
    }

    const prevEnabled = isGridView ? currentIndex > 0 : currentPage > 1;
    const nextEnabled = isGridView
      ? currentIndex + cardsPerPageGrid < products.length
      : currentPage < Math.ceil(products.length / cardsPerPageList);
    if (prevEnabled) {
      prevDiv
        ?.querySelector('span')
        ?.classList.add('[&_svg>use]:stroke-danaherpurple-500');
      prevDiv
        ?.querySelector('span')
        ?.classList.remove(
          '[&_svg>use]:stroke-gray-300',
          'pointer-events-none',
        );
    } else {
      prevDiv
        ?.querySelector('span')
        ?.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
      prevDiv
        ?.querySelector('span')
        ?.classList.add('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
    }
    if (nextEnabled) {
      nextDiv
        ?.querySelector('span')
        ?.classList.add('[&_svg>use]:stroke-danaherpurple-500');
      nextDiv
        ?.querySelector('span')
        ?.classList.remove(
          '[&_svg>use]:stroke-gray-300',
          'pointer-events-none',
        );
    } else {
      nextDiv
        ?.querySelector('span')
        ?.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
      nextDiv
        ?.querySelector('span')
        ?.classList.add('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
    }
  }

  // Event Listeners for Navigation
  prevDiv.addEventListener('click', () => {
    if (isGridView && currentIndex > 0) {
      currentIndex -= cardsPerPageGrid;
      updateCarousel();
    } else if (!isGridView && currentPage > 1) {
      currentPage -= 1;
      updateCarousel();
    }
  });

  nextDiv.addEventListener('click', () => {
    if (isGridView && currentIndex + cardsPerPageGrid < products.length) {
      currentIndex += cardsPerPageGrid;
      updateCarousel();
    } else if (
      !isGridView
      && currentPage < Math.ceil(products.length / cardsPerPageList)
    ) {
      currentPage += 1;
      updateCarousel();
    }
  });

  // Toggle between grid and list view
  const toggleView = (toGridView) => {
    isGridView = toGridView;
    currentPage = 1;
    currentIndex = 0;
    cardsPerPageGrid = getCardsPerPageGrid();

    gridBtn?.classList.replace(
      toGridView ? 'bg-white' : 'bg-danaherpurple-500',
      toGridView ? 'bg-danaherpurple-500' : 'bg-white',
    );
    gridBtn
      ?.querySelector('.icon')
      ?.classList.replace(
        toGridView ? 'text-gray-600' : 'text-white',
        toGridView ? 'text-white' : 'text-gray-600',
      );
    gridBtn
      ?.querySelector('.icon')
      ?.classList.replace(
        toGridView ? '[&_svg>use]:stroke-gray-600' : '[&_svg>use]:stroke-white',
        toGridView ? '[&_svg>use]:stroke-white' : '[&_svg>use]:stroke-gray-600',
      );

    listBtn?.classList.replace(
      toGridView ? 'bg-danaherpurple-500' : 'bg-white',
      toGridView ? 'bg-white' : 'bg-danaherpurple-500',
    );
    listBtn
      ?.querySelector('.icon')
      ?.classList.replace(
        toGridView ? 'text-white' : 'text-gray-600',
        toGridView ? 'text-gray-600' : 'text-white',
      );
    listBtn
      ?.querySelector('.icon')
      ?.classList.replace(
        toGridView ? '[&_svg>use]:stroke-white' : '[&_svg>use]:stroke-gray-600',
        toGridView ? '[&_svg>use]:stroke-gray-600' : '[&_svg>use]:stroke-white',
      );

    updateCarousel();
  };

  listBtn.addEventListener('click', () => toggleView(false));
  gridBtn.addEventListener('click', () => toggleView(true));

  window.addEventListener('resize', () => {
    const newCardsPerPageGrid = getCardsPerPageGrid();
    if (newCardsPerPageGrid !== cardsPerPageGrid) {
      cardsPerPageGrid = newCardsPerPageGrid;
      currentIndex = 0;
      updateCarousel();
    }
  });

  updateCarousel();

  if (products?.length > 0) {
    carouselContainer.append(carouselHead, carouselCards, paginationContainer);
  }
  blockWrapper.append(carouselContainer);
  block.textContent = '';
  block.append(blockWrapper);
}

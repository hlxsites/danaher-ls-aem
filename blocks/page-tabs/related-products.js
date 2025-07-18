import {
  div, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import renderListCard from './listData.js';
import renderGridCard from './grid-data.js';
import {
  getProductInfo,
} from '../../scripts/common-utils.js';

/**
 * Determines the number of cards to display per page in grid view.
 * @returns {number} - Number of cards per page (2 for mobile, 4 for tablet, 6 for desktop).
 */
function getCardsPerPageGrid() {
  if (window.innerWidth < 640) return 2;
  if (window.innerWidth < 1024) return 4;
  return 6;
}

/**
 * Main function to decorate the top-selling block with a carousel of product cards.
 * @param {HTMLElement} block - The block element to decorate.
 */
export default async function relatedProducts(headingText, productIds) {
  //   block?.parentElement?.parentElement?.removeAttribute('class');
  //   block?.parentElement?.parentElement?.removeAttribute('style');

  const topSellingWrapper = div({
    class:
      'dhls-container top-selling-rendered mx-auto flex flex-col md:flex-row gap-6',
  });

  //   const headingText = block
  //     .querySelector('[data-aue-prop="titleText"]')
  //     ?.textContent.trim();
  //   const linkText = block
  //     .querySelector('[data-aue-prop="card_hrefText"]')
  //     ?.textContent.trim();
  //   const linkUrl = block.querySelector
  // ('div *:not([data-aue-label]) a')?.textContent.trim() || '#';

  //   const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  //   const productIds = rawIds
  //     .split(',')
  //     .map((id) => id.trim())
  //     .filter(Boolean);

  let cardsPerPageGrid = getCardsPerPageGrid();
  const cardsPerPageList = 6;
  let currentPage = 1;
  let isGridView = true;

  const container = div({
    class: 'container flex flex-col w-full justify-center',
  });
  const head = div({
    class:
      'w-full flex flex-row justify-between gap-3 mb-4 md:h-10',
  });

  const leftGroup = div({
    class: 'flex md:flex-row flex-col sm:flex-nowrap md:items-center gap-4',
  });
  leftGroup.append(
    div(
      {
        class:
          'text-black text-2xl font-normal leading-loose',
      },
      headingText ?? '',
    ),
    // a(
    //   {
    //     href: linkUrl ?? '#',
    //     class:
    //       'text-violet-600 text-base font-bold leading-snug md:whitespace-nowrap',
    //   },
    //   linkText ?? '',
    // ),
  );

  const controls = div({
    class: 'inline-flex md:flex-row flex-col-reverse justify-end items-center gap-4',
  });
  const viewModeGroup = div({ class: 'flex justify-start items-center pt-1 md:pt-0' });
  const listBtn = div(
    {
      class:
        'px-3 py-2 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer',
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
        'px-3 py-2 bg-violet-600 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer',
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

  controls.append(viewModeGroup);
  head.append(leftGroup, controls);

  const cardsContainer = div({
    class: `cards ${isGridView ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full' : 'flex flex-col gap-5 w-full'}`,
  });
  const paginationContainer = div({
    class:
      'pagination-container flex justify-center items-center gap-2 mt-8 w-full',
    style: 'display: none;',
  });

  const products = (await Promise.all(productIds.map(getProductInfo))).filter(
    (product) => product.status !== 'error',
  );

  /**
   * Scrolls to the top of the first card or the carousel container.
   */
  function scrollToFirstCard() {
    setTimeout(() => {
      const firstCard = cardsContainer.querySelector(':first-child');
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        cardsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  /**
   * Updates the carousel by rendering cards based on the current view (grid or list).
   */
  function updateCards() {
    cardsContainer.innerHTML = '';
    cardsContainer.className = `cards ${isGridView ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full' : 'flex flex-col gap-5 w-full'}`;

    let cardsToDisplay = [];
    let totalPages = 1;

    if (isGridView) {
      totalPages = Math.ceil(products.length / cardsPerPageGrid);
      const startIndex = (currentPage - 1) * cardsPerPageGrid;
      const endIndex = Math.min(startIndex + cardsPerPageGrid, products.length);
      cardsToDisplay = products.slice(startIndex, endIndex);
      cardsToDisplay.forEach((item) => cardsContainer.append(renderGridCard(item)));
      paginationContainer.style.display = 'flex';
    } else {
      totalPages = Math.ceil(products.length / cardsPerPageList);
      const startIndex = (currentPage - 1) * cardsPerPageList;
      const endIndex = Math.min(startIndex + cardsPerPageList, products.length);
      cardsToDisplay = products.slice(startIndex, endIndex);
      cardsToDisplay.forEach((item) => cardsContainer.append(renderListCard(item)));
      paginationContainer.style.display = 'flex';
    }

    /* Render pagination */
    paginationContainer.innerHTML = '';
    const paginationWrapper = div({ class: 'self-stretch h-9 relative w-full' });
    const grayLine = div({ class: 'w-full h-px absolute left-0 top-0 bg-gray-200 z-0' });
    const contentWrapper = div({
      class: 'w-full left-0 top-0 absolute flex justify-between items-center px-4',
    });

    // Previous Button
    const prevEnabled = currentPage > 1;
    const prevButton = div({
      'data-direction': 'Previous',
      'data-state': prevEnabled ? 'Default' : 'Disabled',
      class: 'inline-flex flex-col justify-start items-start',
    });
    prevButton.append(
      div({ class: 'self-stretch h-0.5 bg-transparent' }),
      div(
        {
          class: `self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${prevEnabled ? 'pointer' : 'not-allowed'} z-10`,
        },
        div(
          { class: 'w-5 h-5 relative overflow-hidden' },
          span({
            class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${prevEnabled ? 'text-violet-600' : 'text-gray-700'} [&_svg>use]:stroke-current`,
          }),
        ),
        div({
          class: `justify-start text-${prevEnabled ? 'violet-600' : 'gray-700'} text-sm font-medium leading-tight`,
        }, 'Previous'),
      ),
    );
    decorateIcons(prevButton);
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage -= 1;
        updateCards();
        scrollToFirstCard();
      }
    });

    // Page Numbers
    const pageNumbersContainer = div({ class: 'flex justify-center items-start gap-2 z-10' });
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Helper function to create page number buttons
    const createPageNumber = (page) => {
      const pageNumber = div({
        'data-current': currentPage === page ? 'True' : 'False',
        'data-state': 'Default',
        class: 'inline-flex flex-col justify-start items-start',
      });
      pageNumber.append(
        div({ class: `self-stretch h-0.5 ${currentPage === page ? 'bg-violet-600' : 'bg-transparent'}` }),
        div(
          { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer' },
          div({
            class: `text-center justify-start text-${currentPage === page ? 'violet-600' : 'gray-700'} text-sm font-medium leading-tight`,
          }, page.toString()),
        ),
      );
      pageNumber.addEventListener('click', () => {
        currentPage = page;
        updateCards();
        scrollToFirstCard();
      });
      return pageNumber;
    };

    if (startPage > 1) {
      pageNumbersContainer.append(createPageNumber(1));
      if (startPage > 2) {
        pageNumbersContainer.append(
          div(
            {
              class: 'inline-flex flex-col justify-start items-start',
            },
            div({ class: 'self-stretch h-0.5 bg-transparent' }),
            div(
              { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start' },
              div({ class: 'text-center justify-start text-gray-700 text-sm font-medium leading-tight' }, '...'),
            ),
          ),
        );
      }
    }

    for (let i = startPage; i <= endPage; i += 1) {
      pageNumbersContainer.append(createPageNumber(i));
    }

    if (endPage < totalPages - 1) {
      pageNumbersContainer.append(
        div(
          {
            class: 'inline-flex flex-col justify-start items-start',
          },
          div({ class: 'self-stretch h-0.5 bg-transparent' }),
          div(
            { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start' },
            div({ class: 'text-center justify-start text-gray-700 text-sm font-medium leading-tight' }, '...'),
          ),
        ),
      );
    }

    if (endPage < totalPages) {
      pageNumbersContainer.append(createPageNumber(totalPages));
    }

    // Next Button
    const nextEnabled = currentPage < totalPages;
    const nextButton = div({
      'data-direction': 'Next',
      'data-state': nextEnabled ? 'Default' : 'Disabled',
      class: 'inline-flex flex-col justify-start items-start',
    });
    nextButton.append(
      div({ class: 'self-stretch h-0.5 bg-transparent' }),
      div(
        {
          class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${nextEnabled ? 'pointer' : 'not-allowed'} z-10`,
        },
        div({
          class: `justify-start text-${nextEnabled ? 'violet-600' : 'gray-700'} text-sm font-medium leading-tight`,
        }, 'Next'),
        div(
          { class: 'w-5 h-5 relative overflow-hidden' },
          span({
            class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${nextEnabled ? 'text-violet-600' : 'text-gray-700'} [&_svg>use]:stroke-current`,
          }),
        ),
      ),
    );
    decorateIcons(nextButton);
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        updateCards();
        scrollToFirstCard();
      }
    });
    contentWrapper.append(prevButton, pageNumbersContainer, nextButton);
    paginationWrapper.append(grayLine, contentWrapper);
    paginationContainer.append(paginationWrapper);
  }

  // Toggle between grid and list view
  const toggleView = (toGridView) => {
    isGridView = toGridView;
    currentPage = 1;
    cardsPerPageGrid = getCardsPerPageGrid();

    gridBtn.classList.replace(
      toGridView ? 'bg-white' : 'bg-violet-600',
      toGridView ? 'bg-violet-600' : 'bg-white',
    );
    gridBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? 'text-gray-600' : 'text-white',
        toGridView ? 'text-white' : 'text-gray-600',
      );
    gridBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? '[&_svg>use]:stroke-gray-600' : '[&_svg>use]:stroke-white',
        toGridView ? '[&_svg>use]:stroke-white' : '[&_svg>use]:stroke-gray-600',
      );

    listBtn.classList.replace(
      toGridView ? 'bg-violet-600' : 'bg-white',
      toGridView ? 'bg-white' : 'bg-violet-600',
    );
    listBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? 'text-white' : 'text-gray-600',
        toGridView ? 'text-gray-600' : 'text-white',
      );
    listBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? '[&_svg>use]:stroke-white' : '[&_svg>use]:stroke-gray-600',
        toGridView ? '[&_svg>use]:stroke-gray-600' : '[&_svg>use]:stroke-white',
      );

    updateCards();
  };

  listBtn.addEventListener('click', () => toggleView(false));
  gridBtn.addEventListener('click', () => toggleView(true));

  window.addEventListener('resize', () => {
    const newCardsPerPageGrid = getCardsPerPageGrid();
    if (newCardsPerPageGrid !== cardsPerPageGrid) {
      cardsPerPageGrid = newCardsPerPageGrid;
      currentPage = 1;
      updateCards();
    }
  });

  updateCards();
  container.append(head, cardsContainer, paginationContainer);
  topSellingWrapper.append(container);
  //   block.innerHTML = '';
  //   block.append(topSellingWrapper);
  return topSellingWrapper;
}

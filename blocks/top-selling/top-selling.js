import {
  div, a, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import renderGridCard from './gridData.js';
import renderListCard from './listData.js';
import {
  getProductInfo,
  renderProductJsonResponse,
} from '../../scripts/common-utils.js';

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

  const topSellingWrapper = div({
    class:
      'top-selling-rendered max-w-[1238px] mx-auto flex flex-col md:flex-row gap-6 mt-12',
  });

  const headingText = block
    .querySelector('[data-aue-prop="titleText"]')
    ?.textContent.trim();
  const linkText = block
    .querySelector('[data-aue-prop="card_hrefText"]')
    ?.textContent.trim();
  const linkUrl = block.querySelector('div *:not([data-aue-label]) a')?.textContent.trim() || '#';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  let cardsPerPageGrid = getCardsPerPageGrid();
  const cardsPerPageList = 7;
  let currentPage = 1;
  let currentIndex = 0;
  let isGridView = true;

  const carouselContainer = div({
    class: 'carousel-container flex flex-col w-full justify-center',
  });
  const carouselHead = div({
    class:
      'w-full flex flex-col justify-between items-center gap-3 mb-6 sm:py-2 sm:h-10',
  });

  const leftGroup = div({
    class: 'flex sm:justify-between sm:items-center sm:w-full sm:flex-wrap sm:w-auto sm:flex-nowrap gap-4',
  });
  leftGroup.append(
    div(
      {
        class:
          'text-black text-2xl font-normal leading-loose whitespace-nowrap',
      },
      headingText ?? '',
    ),
    a(
      {
        href: linkUrl ?? '#',
        class:
          'text-violet-600 text-base font-bold leading-snug whitespace-nowrap',
      },
      linkText ?? '',
    ),
  );
 const arrows = div({
    class: 'w-72 inline-flex justify-end items-center gap-6',
  });
  const arrowGroup = div({ class: 'flex justify-center items-center gap-3' });
  const prevDiv = div({
    class:
      'carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer',
  });
  const nextDiv = div({
    class:
      'carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer',
  });
  arrowGroup.append(prevDiv, nextDiv);

  const viewModeGroup = div({ class: 'flex justify-center items-center' });
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

  arrows.append(arrowGroup, viewModeGroup);
  carouselHead.append(leftGroup, arrows);

  const carouselCards = div({
    class: 'carousel-cards flex flex-wrap justify-center gap-5 w-full',
  });
  const paginationContainer = div({
    class:
      'pagination-container flex justify-center items-center gap-2 mt-8 w-full',
    style: 'display: none;',
  });

  let products = (await Promise.all(productIds.map(getProductInfo))).filter(
    (product) => product.status !== 'error',
  );

  if (products.length === 0) {
    products = renderProductJsonResponse(10);
  }

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
      cardsToDisplay.forEach((item) => carouselCards.append(renderGridCard(item)));
      paginationContainer.style.display = 'none';
      arrowGroup.style.display = 'flex';
    } else {
      const startIndex = (currentPage - 1) * cardsPerPageList;
      const endIndex = Math.min(startIndex + cardsPerPageList, products.length);
      const cardsToDisplay = products.slice(startIndex, endIndex);
      cardsToDisplay.forEach((item) => carouselCards.append(renderListCard(item)));
      paginationContainer.style.display = 'flex';
      arrowGroup.style.display = 'none';

      paginationContainer.innerHTML = '';
      const totalPages = Math.ceil(products.length / cardsPerPageList);
      const paginationWrapper = div({
        class: 'inline-flex w-full items-center justify-between',
      });

      const prevButton = div(
        {
          class: `flex items-center gap-1 cursor-pointer ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-violet-600 hover:underline'
          }`,
        },
        div(
          { class: 'w-5 h-5 relative overflow-hidden' },
          span({
            class: `icon icon-arrow-left w-6 h-6 absolute fill-current ${
              currentPage === 1 ? 'text-gray-400' : 'text-violet-600'
            } [&_svg>use]:stroke-current`,
          }),
        ),
        span(
          {
            class: `${currentPage === 1 ? 'text-gray-400' : 'text-violet-600'}`,
          },
          'Previous',
        ),
      );
      decorateIcons(prevButton);
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage -= 1;
          updateCarousel();
        }
      });

      const pageNumbersContainer = div({
        class: 'flex items-center justify-center gap-1',
      });
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2),
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        const firstPage = div(
          {
            class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
              currentPage === 1
                ? 'bg-violet-600 text-white'
                : 'hover:bg-gray-100'
            }`,
          },
          '1',
        );
        firstPage.addEventListener('click', () => {
          currentPage = 1;
          updateCarousel();
        });
        pageNumbersContainer.append(firstPage);
        if (startPage > 2) {
          pageNumbersContainer.append(
            div({ class: 'w-8 h-8 flex items-center justify-center' }, '...'),
          );
        }
      }

      for (let i = startPage; i <= endPage; i += 1) {
        const pageNumberClass = currentPage === i ? 'bg-violet-600 text-white' : 'hover:bg-gray-100';
        const pageNumber = div(
          {
            'data-index': i,
            class: `pageNumber w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${pageNumberClass}`,
          },
          i.toString(),
        );
        pageNumbersContainer.append(pageNumber);
      }

      pageNumbersContainer
        ?.querySelectorAll('.pageNumber')
        ?.forEach((pageNumber) => {
          pageNumber.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.getAttribute('data-index'), 10);
            updateCarousel();
          });
        });

      if (endPage < totalPages - 1) {
        pageNumbersContainer.append(
          div({ class: 'w-8 h-8 flex items-center justify-center' }, '...'),
        );
      }

      if (endPage < totalPages) {
        const lastPage = div(
          {
            class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
              currentPage === totalPages
                ? 'bg-violet-600 text-white'
                : 'hover:bg-gray-100'
            }`,
          },
          totalPages.toString(),
        );
        lastPage.addEventListener('click', () => {
          currentPage = totalPages;
          updateCarousel();
        });
        pageNumbersContainer.append(lastPage);
      }

      const nextButton = div(
        {
          class: `flex mr-2 items-center cursor-pointer ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-violet-600 hover:underline'
          }`,
        },
        span(
          {
            class: `${
              currentPage === totalPages ? 'text-gray-400' : 'text-violet-600'
            }`,
          },
          'Next',
        ),
        div(
          { class: 'w-6 h-5 relative overflow-hidden' },
          span({
            class: `icon icon-arrow-right w-6 h-6 absolute fill-current ${
              currentPage === totalPages ? 'text-gray-400' : 'text-violet-600'
            } [&_svg>use]:stroke-current`,
          }),
        ),
      );
      decorateIcons(nextButton);
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage += 1;
          updateCarousel();
        }
      });

      paginationWrapper.append(prevButton, pageNumbersContainer, nextButton);
      paginationContainer.append(paginationWrapper);
    }

    const prevEnabled = isGridView ? currentIndex > 0 : currentPage > 1;
    const nextEnabled = isGridView
      ? currentIndex + cardsPerPageGrid < products.length
      : currentPage < Math.ceil(products.length / cardsPerPageList);

    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
        stroke="${
          prevEnabled ? '#7523FF' : '#D1D5DB'
        }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
        stroke="${
        nextEnabled ? '#7523FF' : '#D1D5DB'
      }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>`;
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
carouselContainer.append(carouselHead, carouselCards, paginationContainer);
topSellingWrapper.append(carouselContainer);
block.innerHTML = '';
block.append(topSellingWrapper);
}

import { div, a, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import renderGridCard from './grid-data.js';
import renderListCard from './listData.js';
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
export default async function relatedProducts(headingText, productIds) {
  // block?.parentElement?.parentElement?.removeAttribute('class');
  // block?.parentElement?.parentElement?.removeAttribute('style');

  const topSellingWrapper = div({
    class:
      'top-selling-rendered px-0 w-[1358px] dhlsBp:p-0 flex flex-col gap-4',
  });

  // const headingText = block
  //   .querySelector('[data-aue-prop="titleText"]')
  //   ?.textContent.trim();
  // const linkText = block
  //   .querySelector('[data-aue-prop="card_hrefText"]')
  //   ?.textContent.trim();
  // const linkUrl = block.querySelector('div *:not([data-aue-label]) a')?.textContent.trim()
  //   || '#';

  // const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim()
  //   || '';
  // const productIds = rawIds
  //   .split(',')
  //   .map((id) => id.trim())
  //   .filter(Boolean);

  let cardsPerPageGrid = getCardsPerPageGrid();
  const cardsPerPageList = 7;
  let currentPage = 1;
  let currentIndex = 0;
  let isGridView = true;
  // const openNewTab = block.querySelector(
  //   '[data-aue-prop="subscribe"]',
  // )?.textContent;
  const carouselContainer = div({
    class:
      'carousel-container w-[1358px] flex flex-col gap-y-6 w-full justify-center',
  });
  const carouselHead = div({
    class: 'w-[1280px] flex flex-row justify-between md:h-10',
  });

  const leftGroup = div({
    class: 'flex md:flex-row flex-col sm:flex-nowrap md:items-center gap-6',
  });
  leftGroup.append(
    div(
      {
        class: 'text-black text-2xl font-bold leading-loose',
      },
      headingText ?? ''
    )
    // a(
    //   {
    //     href: linkUrl ?? '#',
    //     class:
    //       'text-violet-600 text-base font-bold leading-snug md:whitespace-nowrap',
    //     target: `${openNewTab ? '_blank' : '_self'}`,
    //   },
    //   linkText ?? '',
    //   linkText?.length
    //     ? span({
    //       class:
    //           'icon icon-arrow-right pt-1 dhls-arrow-right-icon fill-current font-bold [&_svg>use]:stroke-[3px] [&_svg>use]:stroke-danaherpurple-500',
    //     })
    //     : '',
    // ),
  );
  decorateIcons(leftGroup);

  const arrows = div({
    class:
      'inline-flex md:flex-row flex-col-reverse justify-end items-center gap-6',
  });
  const arrowGroup = div({ class: 'flex justify-start items-center gap-3' });
  const prevDiv = div(
    {
      class:
        'carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-left w-10 h-10 cursor-pointer fill-current [&_svg>use]:stroke-gray-300',
    })
  );
  const nextDiv = div(
    {
      class:
        'carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-right cursor-pointer w-10 h-10 fill-current [&_svg>use]:stroke-danaherpurple-500',
    })
  );
  arrowGroup.append(prevDiv, nextDiv);
  decorateIcons(arrowGroup);

  const viewModeGroup = div({
    class: 'flex justify-start items-center pt-1 md:pt-0',
  });
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
      })
    )
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
      })
    )
  );
  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);

  arrows.append(arrowGroup, viewModeGroup);
  carouselHead.append(leftGroup, arrows);

  const carouselCards = div({
    class: `carousel-cards flex justify-center lg:justify-normal gap-5 w-full flex-wrap ${
      isGridView ? 'md:flex-nowrap' : ''
    }`,
  });
  const paginationContainer = div({
    class:
      'pagination-container flex justify-center items-center gap-2 mt-8 w-full',
    style: 'display: none;',
  });

  const products = (
    await Promise.allSettled(
      productIds.map(async (sku) => getProductInfo(sku, false))
    )
  )
    .filter((product) => product.status !== 'error')
    .map((product) => product.value);

  /**
   * Scrolls to the top of the first card or the carousel container.
   */
  function scrollToFirstCard() {
    setTimeout(() => {
      const firstCard = carouselCards.querySelector(':first-child');
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        carouselCards.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // Update the arrows state
  function toggleArrowStyles(divEle, isEnabled) {
    const spanEle = divEle.querySelector('span');
    spanEle?.classList.toggle('[&_svg>use]:stroke-gray-300', !isEnabled);
    spanEle?.classList.toggle('pointer-events-none', !isEnabled);
    spanEle?.classList.toggle(
      '[&_svg>use]:stroke-danaherpurple-500',
      isEnabled
    );
  }

  /**
   * Updates the carousel by rendering cards based on the current view (grid or list).
   */
  function updateCarousel() {
    carouselCards.innerHTML = '';
    carouselCards.className = `carousel-cards flex justify-center lg:justify-normal gap-5 w-full flex-wrap ${
      isGridView ? 'md:flex-nowrap' : ''
    }`;

    if (isGridView) {
      let cardsToDisplay;
      if (products.length < 5) {
        cardsToDisplay = products; // Show all cards if fewer than 4
        arrowGroup.style.display = 'none'; // Hide carousel arrows
      } else {
        cardsToDisplay = products.slice(
          currentIndex,
          currentIndex + cardsPerPageGrid
        );
        arrowGroup.style.display = 'flex'; // Show carousel arrows
      }
      cardsToDisplay.forEach((item) =>
        carouselCards.append(renderGridCard(item))
      );
      paginationContainer.style.display = 'none';
    } else {
      const startIndex = (currentPage - 1) * cardsPerPageList;
      const endIndex = Math.min(startIndex + cardsPerPageList, products.length);
      const cardsToDisplay = products.slice(startIndex, endIndex);
      cardsToDisplay.forEach((item) =>
        carouselCards.append(renderListCard(item))
      );
      paginationContainer.style.display = products.length < 7 ? 'none' : 'flex';
      arrowGroup.style.display = 'none';

      /* Render pagination */
      paginationContainer.innerHTML = '';
      const totalPages = Math.ceil(products.length / cardsPerPageList);
      const paginationWrapper = div({
        class: 'self-stretch h-9 relative w-full',
      });
      const grayLine = div({
        class: 'w-full h-px absolute left-0 top-0 bg-gray-200 z-0',
      });
      const contentWrapper = div({
        class:
          'w-full left-0 top-0 absolute flex justify-between items-center px-4',
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
            class: `self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
              prevEnabled ? 'pointer' : 'not-allowed'
            } z-10`,
          },
          div(
            { class: 'w-5 h-5 relative overflow-hidden' },
            span({
              class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${
                prevEnabled ? 'text-gray-700' : 'text-violet-600'
              } [&_svg>use]:stroke-current`,
            })
          ),
          div(
            {
              class: `justify-start text-${
                prevEnabled ? 'gray-700' : 'gray-400'
              } text-sm font-medium leading-tight`,
            },
            'Previous'
          )
        )
      );
      decorateIcons(prevButton);
      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage -= 1;
          updateCarousel();
          scrollToFirstCard();
        }
      });

      // Page Numbers
      const pageNumbersContainer = div({
        class: 'flex justify-center items-start gap-2 z-10',
      });
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
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
          div({
            class: `self-stretch h-0.5 ${
              currentPage === page ? 'bg-violet-600' : 'bg-transparent'
            }`,
          }),
          div(
            {
              class:
                'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer',
            },
            div(
              {
                class: `text-center justify-start text-${
                  currentPage === page ? 'violet-600' : 'gray-700'
                } text-sm font-medium leading-tight`,
              },
              page.toString()
            )
          )
        );
        pageNumber.addEventListener('click', () => {
          currentPage = page;
          updateCarousel();
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
                {
                  class:
                    'self-stretch px-4 pt-4 inline-flex justify-center items-start',
                },
                div(
                  {
                    class:
                      'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
                  },
                  '...'
                )
              )
            )
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
              {
                class:
                  'self-stretch px-4 pt-4 inline-flex justify-center items-start',
              },
              div(
                {
                  class:
                    'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
                },
                '...'
              )
            )
          )
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
            class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
              nextEnabled ? 'pointer' : 'not-allowed'
            } z-10`,
          },
          div(
            {
              class: `justify-start text-${
                nextEnabled ? 'gray-700' : 'gray-400'
              } text-sm font-medium leading-tight`,
            },
            'Next'
          ),
          div(
            { class: 'w-5 h-5 relative overflow-hidden' },
            span({
              class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${
                nextEnabled ? 'text-gray-700' : 'text-violet-600'
              } [&_svg>use]:stroke-current`,
            })
          )
        )
      );
      decorateIcons(nextButton);
      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage += 1;
          updateCarousel();
          scrollToFirstCard();
        }
      });
      contentWrapper.append(prevButton, pageNumbersContainer, nextButton);
      paginationWrapper.append(grayLine, contentWrapper);
      paginationContainer.append(paginationWrapper);
    }

    const prevEnabled = isGridView ? currentIndex > 0 : currentPage > 1;
    const nextEnabled = isGridView
      ? currentIndex + cardsPerPageGrid < products.length
      : currentPage < Math.ceil(products.length / cardsPerPageList);
    toggleArrowStyles(prevDiv, prevEnabled);
    toggleArrowStyles(nextDiv, nextEnabled);
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
      !isGridView &&
      currentPage < Math.ceil(products.length / cardsPerPageList)
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
      toGridView ? 'bg-violet-600' : 'bg-white'
    );
    gridBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? 'text-gray-600' : 'text-white',
        toGridView ? 'text-white' : 'text-gray-600'
      );
    gridBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? '[&_svg>use]:stroke-gray-600' : '[&_svg>use]:stroke-white',
        toGridView ? '[&_svg>use]:stroke-white' : '[&_svg>use]:stroke-gray-600'
      );

    listBtn.classList.replace(
      toGridView ? 'bg-violet-600' : 'bg-white',
      toGridView ? 'bg-white' : 'bg-violet-600'
    );
    listBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? 'text-white' : 'text-gray-600',
        toGridView ? 'text-gray-600' : 'text-white'
      );
    listBtn
      .querySelector('.icon')
      .classList.replace(
        toGridView ? '[&_svg>use]:stroke-white' : '[&_svg>use]:stroke-gray-600',
        toGridView ? '[&_svg>use]:stroke-gray-600' : '[&_svg>use]:stroke-white'
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
  // block.innerHTML = '';
  // block.append(topSellingWrapper);
  return topSellingWrapper;
}

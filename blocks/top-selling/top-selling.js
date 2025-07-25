import { div, a, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import renderGridCard from './gridData.js';
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
export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

  const topSellingWrapper = div({
    class:
      'dhls-container top-selling-rendered mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0',
  });

  const headingText = block.firstElementChild?.querySelector('p')?.textContent.trim() || '';
  const linkText = block.children[1]?.querySelectorAll('p')[0]?.textContent.trim() || '';
  const linkUrl = block.children[1]?.querySelector('a')?.textContent.trim() || '#';
  const index = block.children.length === 4 ? 3 : 2;
  const rawIds = block.children[index]?.querySelector('p')?.textContent.trim() || '';

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
    class: 'carousel-container flex flex-col gap-y-6 w-full justify-center',
  });
  const carouselHead = div({
    class: 'w-full flex flex-row justify-between md:h-10',
  });

  const leftGroup = div({
    class: 'flex md:flex-row flex-col sm:flex-nowrap md:items-center gap-6',
  });
  leftGroup.append(
    div(
      {
        class: 'text-2xl text-black font-medium',
      },
      headingText ?? '',
    ),
    a(
      {
        href: linkUrl ?? '#',
        class:
          'text-danaherpurple-500 hover:text-danaherpurple-800 text-base flex items-center font-bold leading-snug md:whitespace-nowrap group',
        target: `${
          block.children[2].textContent.trim() === 'true' ? '_blank' : '_self'
        }`,
      },
      linkText ?? '',
      linkText?.length
        ? span({
          class:
              'icon icon-arrow-right !size-5 pl-1.5 fill-current [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800',
        })
        : '',
    ),
  );
  decorateIcons(leftGroup);

  const arrows = div({
    class:
      'inline-flex md:flex-row flex-col-reverse justify-end items-center gap-6',
  });
  const arrowGroup = div({ class: 'flex justify-start items-center' });
  const prevDiv = div(
    {
      class:
        'carousel-prev-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-left w-8 h-8 cursor-pointer fill-current [&_svg>use]:stroke-gray-300',
    }),
  );
  const nextDiv = div(
    {
      class:
        'carousel-next-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-right cursor-pointer w-8 h-8 fill-current [&_svg>use]:stroke-danaherpurple-500 hover:[&_svg>use]:stroke-danaherpurple-800',
    }),
  );
  arrowGroup.append(prevDiv, nextDiv);
  decorateIcons(arrowGroup);

  const viewModeGroup = div({
    class: 'flex justify-start items-center pt-1 md:pt-0',
  });
  const listBtn = div(
    {
      class:
        'w-8 h-8 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-hidden cursor-pointer',
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
        'w-8 h-8 bg-danaherpurple-500 hover:bg-danaherpurple-600 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-hidden cursor-pointer',
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
    class: `carousel-cards flex justify-center lg:justify-normal gap-5 w-full flex-wrap ${
      isGridView ? 'md:flex-nowrap overflow-hidden' : ''
    }`,
  });
  const slideWrapper = div({
    class: 'slide-wrapper flex transition-transform duration-1000 ease-in-out',
  });
  carouselCards.append(slideWrapper);

  const paginationContainer = div({
    class:
      'pagination-container flex justify-center items-center gap-2 mt-8 w-full',
    style: 'display: none;',
  });

  const results = await Promise.allSettled(
    // making false as we don't need intershop data for top selling products as of now
    productIds.map((id) => getProductInfo(id, false)),
  );

  const products = results
    .filter((result) => result.status === 'fulfilled' && result.value?.title?.trim())
    .map((result) => result.value);

  // Hide viewModeGroup if no products are available
  if (products.length === 0) {
    topSellingWrapper.style.display = 'none';
  }

  /**
   * Scrolls to the top of the first card or the carousel container.
   */
  function scrollToFirstCard() {
    setTimeout(() => {
      const firstCard = slideWrapper.querySelector(':first-child');
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
      isEnabled,
    );
  }

  /**
   * Updates the carousel by rendering cards based on the current view (grid or list).
   */
  function updateCarousel() {
    slideWrapper.innerHTML = '';
    slideWrapper.className = `slide-wrapper flex transition-transform duration-1000 ease-in-out gap-5 ${
      isGridView ? 'flex-row' : 'flex-col'
    }`;
    carouselCards.className = `carousel-cards flex justify-center lg:justify-normal gap-5 w-full flex-wrap ${
      isGridView ? 'md:flex-nowrap' : ''
    }`;

    if (isGridView) {
      if (products.length === 0) {
        arrowGroup.style.display = 'none';
        slideWrapper.style.transform = 'translateX(0)';
      } else {
        // Render all cards for continuous sliding
        products.forEach((item) => slideWrapper.append(renderGridCard(item)));
        arrowGroup.style.display = products.length <= cardsPerPageGrid ? 'none' : 'flex';

        // Calculate transform for sliding
        const card = slideWrapper.children[0];
        if (card) {
          const cardWidth = card.offsetWidth + 20; // Include gap-5 (20px)
          slideWrapper.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
        } else {
          slideWrapper.style.transform = 'translateX(0)';
        }
      }
      paginationContainer.style.display = 'none';
    } else {
      const startIndex = (currentPage - 1) * cardsPerPageList;
      const endIndex = Math.min(startIndex + cardsPerPageList, products.length);
      const cardsToDisplay = products.slice(startIndex, endIndex);
      cardsToDisplay.forEach((item) => slideWrapper.append(renderListCard(item)));
      slideWrapper.style.transform = 'translateX(0)';
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
                prevEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
              } [&_svg>use]:stroke-current`,
            }),
          ),
          div(
            {
              class: `justify-start text-${
                prevEnabled ? 'danaherpurple-500' : 'gray-400'
              } text-sm font-medium leading-tight`,
            },
            'Previous',
          ),
        ),
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
        currentPage - Math.floor(maxVisiblePages / 2),
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
              currentPage === page ? 'bg-danaherpurple-500' : 'bg-transparent'
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
                  currentPage === page ? 'danaherpurple-500' : 'gray-700'
                } text-sm font-medium leading-tight`,
              },
              page.toString(),
            ),
          ),
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
                  '...',
                ),
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
              {
                class:
                  'self-stretch px-4 pt-4 inline-flex justify-center items-start',
              },
              div(
                {
                  class:
                    'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
                },
                '...',
              ),
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
            class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
              nextEnabled ? 'pointer' : 'not-allowed'
            } z-10`,
          },
          div(
            {
              class: `justify-start text-${
                nextEnabled ? 'danaherpurple-500' : 'gray-400'
              } text-sm font-medium leading-tight`,
            },
            'Next',
          ),
          div(
            { class: 'w-5 h-5 relative overflow-hidden' },
            span({
              class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${
                nextEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
              } [&_svg>use]:stroke-current`,
            }),
          ),
        ),
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
      toGridView ? 'bg-white' : 'bg-danaherpurple-500',
      toGridView ? 'bg-danaherpurple-500' : 'bg-white',
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
      toGridView ? 'bg-danaherpurple-500' : 'bg-white',
      toGridView ? 'bg-white' : 'bg-danaherpurple-500',
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

import { div, a, span } from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import { renderGridCard } from "./gridData.js";
import { renderListCard } from "./listData.js";
import { getProductInfo } from "../../scripts/common-utils.js";
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
  const wrapper = block.closest(".top-selling-wrapper");
  if (wrapper) {
    wrapper.classList.add(
      "w-full",
      "px-4",
      "md:px-10",
      "flex",
      "justify-center"
    );
  }

  const headingText = block
    .querySelector('[data-aue-prop="titleText"]')
    ?.textContent.trim();
  const linkText = block
    .querySelector('[data-aue-prop="card_hrefText"]')
    ?.textContent.trim();
  const rawIds =
    block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() ||
    "";
  const productIds = rawIds
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  let cardsPerPageGrid = getCardsPerPageGrid();
  const cardsPerPageList = 7;
  let currentPage = 1;
  let currentIndex = 0;
  let isGridView = true;

  const blockWrapper = div({
    class:
      "top-selling-rendered w-full max-w-[1440px] mx-auto flex flex-col gap-4",
  });
  const carouselContainer = div({
    class: "carousel-container flex flex-col w-full py-6 justify-center",
  });
  const carouselHead = div({
    class:
      "w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4",
  });

  const leftGroup = div({
    class: "flex flex-wrap sm:flex-nowrap items-center gap-4",
  });
  leftGroup.append(
    div(
      {
        class:
          "text-black text-2xl font-normal leading-loose whitespace-nowrap",
      },
      headingText
    ),
    a(
      {
        href: "#",
        class:
          "text-violet-600 text-base font-bold leading-snug hover:underline whitespace-nowrap",
      },
      linkText ?? ""
    )
  );

  const arrows = div({
    class: "w-72 inline-flex justify-end items-center gap-6",
  });
  const arrowGroup = div({ class: "flex justify-start items-center gap-3" });
  const prevDiv = div({
    class:
      "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer",
  });
  const nextDiv = div({
    class:
      "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer",
  });
  arrowGroup.append(prevDiv, nextDiv);

  const viewModeGroup = div({ class: "flex justify-start items-center" });
  const listBtn = div(
    {
      class:
        "px-3 py-2 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
    },
    div(
      { class: "w-5 h-5 relative overflow-hidden" },
      span({
        class:
          "icon icon-view-list w-6 h-6 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600",
      })
    )
  );
  const gridBtn = div(
    {
      class:
        "px-3 py-2 bg-violet-600 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
    },
    div(
      { class: "w-5 h-5 relative overflow-hidden" },
      span({
        class:
          "icon icon-view-grid w-6 h-6 absolute fill-current text-white [&_svg>use]:stroke-white",
      })
    )
  );
  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);

  arrows.append(arrowGroup, viewModeGroup);
  carouselHead.append(leftGroup, arrows);

  const carouselCards = div({
    class: "carousel-cards flex flex-wrap justify-start gap-5 w-full",
  });
  const paginationContainer = div({
    class:
      "pagination-container flex justify-center items-center gap-2 mt-8 w-full",
    style: "display: none;",
  });

  const products = (await Promise.all(productIds.map(getProductInfo))).filter(
    (product) => product !== null
  );

  /**
   * Renders pagination controls for list view.
   */
  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(products.length / cardsPerPageList);
    const paginationWrapper = div({
      class: "inline-flex w-full items-center justify-between",
    });

    const prevButton = div(
      {
        class: `flex items-center gap-1 cursor-pointer ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-violet-600 hover:underline"
        }`,
      },
      div(
        { class: "w-5 h-5 relative overflow-hidden" },
        span({
          class: `icon icon-arrow-left w-6 h-6 absolute fill-current ${
            currentPage === 1 ? "text-gray-400" : "text-violet-600"
          } [&_svg>use]:stroke-current`,
        })
      ),
      span(
        { class: `${currentPage === 1 ? "text-gray-400" : "text-violet-600"}` },
        "Previous"
      )
    );
    decorateIcons(prevButton);
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        updateCarousel();
      }
    });

    const pageNumbersContainer = div({
      class: "flex items-center justify-center gap-1",
    });
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      const firstPage = div(
        {
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
            currentPage === 1 ? "bg-violet-600 text-white" : "hover:bg-gray-100"
          }`,
        },
        "1"
      );
      firstPage.addEventListener("click", () => {
        currentPage = 1;
        updateCarousel();
      });
      pageNumbersContainer.append(firstPage);
      if (startPage > 2) {
        pageNumbersContainer.append(
          div({ class: "w-8 h-8 flex items-center justify-center" }, "...")
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageNumber = div(
        {
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
            currentPage === i ? "bg-violet-600 text-white" : "hover:bg-gray-100"
          }`,
        },
        i.toString()
      );
      pageNumber.addEventListener("click", () => {
        currentPage = i;
        updateCarousel();
      });
      pageNumbersContainer.append(pageNumber);
    }

    if (endPage < totalPages - 1) {
      pageNumbersContainer.append(
        div({ class: "w-8 h-8 flex items-center justify-center" }, "...")
      );
    }

    if (endPage < totalPages) {
      const lastPage = div(
        {
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${
            currentPage === totalPages
              ? "bg-violet-600 text-white"
              : "hover:bg-gray-100"
          }`,
        },
        totalPages.toString()
      );
      lastPage.addEventListener("click", () => {
        currentPage = totalPages;
        updateCarousel();
      });
      pageNumbersContainer.append(lastPage);
    }

    const nextButton = div(
      {
        class: `flex mr-2 items-center cursor-pointer ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-violet-600 hover:underline"
        }`,
      },
      span(
        {
          class: `${
            currentPage === totalPages ? "text-gray-400" : "text-violet-600"
          }`,
        },
        "Next"
      ),
      div(
        { class: "w-5 h-5 relative overflow-hidden" },
        span({
          class: `icon icon-arrow-right w-6 h-6 absolute fill-current ${
            currentPage === totalPages ? "text-gray-400" : "text-violet-600"
          } [&_svg>use]:stroke-current`,
        })
      )
    );
    decorateIcons(nextButton);
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        updateCarousel();
      }
    });

    paginationWrapper.append(prevButton, pageNumbersContainer, nextButton);
    paginationContainer.append(paginationWrapper);
  }

  /**
   * Updates the carousel by rendering cards based on the current view (grid or list).
   */
  function updateCarousel() {
    carouselCards.innerHTML = "";

    if (isGridView) {
      const cardsToDisplay = products.slice(
        currentIndex,
        currentIndex + cardsPerPageGrid
      );
      cardsToDisplay.forEach((item) =>
        carouselCards.append(renderGridCard(item))
      );
      paginationContainer.style.display = "none";
      arrowGroup.style.display = "flex";
    } else {
      const startIndex = (currentPage - 1) * cardsPerPageList;
      const endIndex = Math.min(startIndex + cardsPerPageList, products.length);
      const cardsToDisplay = products.slice(startIndex, endIndex);
      cardsToDisplay.forEach((item) =>
        carouselCards.append(renderListCard(item))
      );
      paginationContainer.style.display = "flex";
      arrowGroup.style.display = "none";
      renderPagination();
    }

    const prevEnabled = isGridView ? currentIndex > 0 : currentPage > 1;
    const nextEnabled = isGridView
      ? currentIndex + cardsPerPageGrid < products.length
      : currentPage < Math.ceil(products.length / cardsPerPageList);

    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
        stroke="${
          prevEnabled ? "#7523FF" : "#D1D5DB"
        }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
        stroke="${
          nextEnabled ? "#7523FF" : "#D1D5DB"
        }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;
  }

  // Event Listeners for Navigation
  prevDiv.addEventListener("click", () => {
    if (isGridView && currentIndex > 0) {
      currentIndex -= cardsPerPageGrid;
      updateCarousel();
    } else if (!isGridView && currentPage > 1) {
      currentPage--;
      updateCarousel();
    }
  });

  nextDiv.addEventListener("click", () => {
    if (isGridView && currentIndex + cardsPerPageGrid < products.length) {
      currentIndex += cardsPerPageGrid;
      updateCarousel();
    } else if (
      !isGridView &&
      currentPage < Math.ceil(products.length / cardsPerPageList)
    ) {
      currentPage++;
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
      toGridView ? "bg-white" : "bg-violet-600",
      toGridView ? "bg-violet-600" : "bg-white"
    );
    gridBtn
      .querySelector(".icon")
      .classList.replace(
        toGridView ? "text-gray-600" : "text-white",
        toGridView ? "text-white" : "text-gray-600"
      );
    gridBtn
      .querySelector(".icon")
      .classList.replace(
        toGridView ? "[&_svg>use]:stroke-gray-600" : "[&_svg>use]:stroke-white",
        toGridView ? "[&_svg>use]:stroke-white" : "[&_svg>use]:stroke-gray-600"
      );

    listBtn.classList.replace(
      toGridView ? "bg-violet-600" : "bg-white",
      toGridView ? "bg-white" : "bg-violet-600"
    );
    listBtn
      .querySelector(".icon")
      .classList.replace(
        toGridView ? "text-white" : "text-gray-600",
        toGridView ? "text-gray-600" : "text-white"
      );
    listBtn
      .querySelector(".icon")
      .classList.replace(
        toGridView ? "[&_svg>use]:stroke-white" : "[&_svg>use]:stroke-gray-600",
        toGridView ? "[&_svg>use]:stroke-gray-600" : "[&_svg>use]:stroke-white"
      );

    updateCarousel();
  };

  listBtn.addEventListener("click", () => toggleView(false));
  gridBtn.addEventListener("click", () => toggleView(true));

  window.addEventListener("resize", () => {
    const newCardsPerPageGrid = getCardsPerPageGrid();
    if (newCardsPerPageGrid !== cardsPerPageGrid) {
      cardsPerPageGrid = newCardsPerPageGrid;
      currentIndex = 0;
      updateCarousel();
    }
  });

  updateCarousel();
  carouselContainer.append(carouselHead, carouselCards, paginationContainer);
  blockWrapper.append(carouselContainer);
  block.textContent = "";
  const quoteModalContent = div(
    {},
    '<dialog id="custom-modal" class="w-full max-w-xl px-6 py-4 text-left align-middle transition-all transform bg-white rounded-md shadow-xl" open=""><div><div class="justify-between flex item-center mb-2 text-2xl font-bold leading-6 text-gray-900"><div class="modal-title flex items-center gap-2"><span class="icon icon-chat-bubble flex items-center justify-center flex-shrink-0 mx-auto bg-gray-200 rounded-full w-10 h-10 p-2"><svg data-v-3ebe214a="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 text-danaherblue-600" data-di-rand="1747639296501"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path></svg></span>Request for Quote</div><p class="close-button" name="close"><span class="icon icon-close cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-12 w-12 font-extrabold rounded-xl place-self-end" data-di-rand="1747639296502"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg></span></p></div><div><div class="mt-3"><label class="text-sm text-gray-500">Describe your problem or desired solution to add to your quote cart and one of our experts will assist in find the best solution for you</label></div><div class="mt-3"><textarea class="quote-textarea block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gray-300 focus:ring-gray-300 sm:text-sm" name="quote" rows="4"></textarea></div><div class="flex justify-between gap-4 mt-4 quote sm:flex-row flex-col"><button class="p-2 text-sm text-danaherpurple-500 bg-white border-2 border-danaherpurple-500 hover:text-white hover:bg-danaherpurple-800 rounded-full" name="continue">Add and continue browsing</button><button class="py-2 text-sm btn btn-primary-purple rounded-full" name="submit">Add and complete request</button></div><div class="p-4 mt-4 rounded-md bg-red-50 hidden quote-error"><div class="flex gap-2"><span class="icon icon-xcircle w-4 h-4 text-red-600"><svg data-v-3ebe214a-s="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-4 h-4 text-red-600" data-di-rand="1747639296502"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span><p class="text-xs font-medium text-red-600">Please enter your problem or desired solution.</p></div></div><div class="flex flex-col p-4 mt-4 rounded-md bg-danaherlightblue-500 bg-opacity-10"><p class="text-xs font-medium text-gray-700 m-0">Quote Tip.</p><p class="font-sans text-xs font-normal text-gray-700">Be as detailed as possible so we can best serve your request.</p></div></div></div></dialog>'
  );

  block.append(blockWrapper);
}

import { div, a, span } from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import renderGridCard from "./gridData.js";
import {
  getProductInfo,
  renderProductJsonResponse,
} from "../../scripts/common-utils.js";
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
  document
    .querySelector(".top-selling-products-wrapper")
    ?.parentElement?.removeAttribute("class");
  document
    .querySelector(".top-selling-products-wrapper")
    ?.parentElement?.removeAttribute("style");
  const wrapper = block.closest(".top-selling-products-wrapper");
  if (wrapper) {
    wrapper.classList.add("w-full", "md:px-10");
  }

  const headingText = block
    .querySelector('[data-aue-prop="titleText"]')
    ?.textContent.trim();
  const linkText = block
    .querySelector('[data-aue-prop="card_hrefText"]')
    ?.textContent.trim();
  const linkUrl = block
    .querySelector('[data-aue-prop="card_hrefUrl"]')
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
      "top-selling-rendered w-full max-w-[1238px] mx-auto md:p-0 p-[20px] mt-12 flex flex-col gap-4",
  });
  const carouselContainer = div({
    class:
      "carousel-container flex flex-col w-full py-6 pt-0 pb-0 justify-center",
  });
  const carouselHead = div({
    class:
      "w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 pb-6",
  });

  const leftGroup = div({
    class: "flex flex-wrap sm:flex-nowrap items-center gap-4",
  });
  leftGroup.append(
    div(
      {
        class: "text-black text-2xl font-normal leading-loose ",
      },
      headingText ?? ""
    ),
    a(
      {
        href: linkUrl ?? "#",
        class:
          "text-danaherpurple-500 text-base font-bold leading-snug hover:underline",
      },
      linkText ?? ""
    )
  );

  const arrows = div({
    class: "w-72 inline-flex justify-end items-center gap-6",
  });
  const arrowGroup = div({ class: "flex justify-start items-center gap-3" });
  const prevDiv = div(
    {
      class:
        "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer",
    },
    span({
      class:
        "icon icon-arrow-left  w-4 h-4 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
    })
  );
  const nextDiv = div(
    {
      class:
        "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer",
    },
    span({
      class:
        "icon icon-arrow-right  w-4 h-4 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
    })
  );
  arrowGroup.append(prevDiv, nextDiv);
  decorateIcons(arrowGroup);
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
          "icon icon-view-list w-5 h-5 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600",
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
          "icon icon-view-grid w-5 h-5 absolute fill-current text-white [&_svg>use]:stroke-white",
      })
    )
  );
  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);

  arrows.append(arrowGroup);
  carouselHead.append(leftGroup, arrows);

  const carouselCards = div({
    class: "carousel-cards flex flex-wrap justify-start gap-5 w-full",
  });
  const paginationContainer = div({
    class:
      "pagination-container flex justify-center items-center gap-2 mt-8 w-full",
    style: "display: none;",
  });

  let products = (await Promise.all(productIds.map(getProductInfo))).filter(
    (product) => product.status !== "error"
  );

  if (products.length === 0) {
    products = renderProductJsonResponse(10);
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
      currentPage -= 1;
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
  block.append(blockWrapper);

  [...block.children].forEach((child) => {
    if (!child.classList.contains("top-selling-rendered")) {
      child.style.display = "none";
    }
  });
}

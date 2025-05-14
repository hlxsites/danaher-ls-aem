import { div, span, a, img, p } from "../../scripts/dom-builder.js";
import { getProductsForCategories } from "../../scripts/commerce.js";
import { makePublicUrl, imageHelper } from "../../scripts/scripts.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import renderGridCard from "./gridData.js";
import renderListCard from "./listData.js";

async function fetchProducts() {
  try {
    const productsCategories = await getProductsForCategories();
    return productsCategories?.results || [];
  } catch (error) {
    return [];
  }
}

// Detect cards per page in grid view
function getCardsPerPageGrid() {
  return window.innerWidth < 640 ? 1 : 4;
}

export default async function decorate(block) {
  const productsCategories = await fetchProducts();

  let cardsPerPageGrid = getCardsPerPageGrid();
  const cardsPerPageList = 7;
  let currentPage = 1;
  let currentIndex = 0;
  let isGridView = true;

  const carouselContainer = div({
    class: "carousel-container flex flex-col w-full py-6 justify-center",
  });

  const carouselHead = div({
    class: "w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4",
  });

  const leftGroup = div({ class: "flex flex-wrap sm:flex-nowrap items-center gap-4" });
  const productTitle = div(
    {
      class: 'text-black text-2xl font-normal  leading-loose whitespace-nowrap',
    },
    "Top Selling Products",
  );
  const browseLink = a(
    {
      href: "#",
      class:
        'text-violet-600 text-base font-bold  leading-snug hover:underline whitespace-nowrap',
    },
    "Browse Products →",
  );
  leftGroup.append(productTitle, browseLink);

  const arrows = div({ class: "w-72 inline-flex justify-end items-center gap-6" });
  const arrowGroup = div({ class: "flex justify-start items-center gap-3" });
  const prevDiv = div({ class: "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer" });
  const nextDiv = div({ class: "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer" });
  arrowGroup.append(prevDiv, nextDiv);

  const viewModeGroup = div({ class: "flex justify-start items-center" });
  const listBtn = div(
    {
      class:
        "px-3 py-2 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
    },
    div(
      { class: "w-5 h-5 relative overflow-hidden" },
      span({ class: "icon icon-view-list w-6 h-6 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600" }),
    ),
  );
  const gridBtn = div(
    {
      class:
        "px-3 py-2 bg-violet-600 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
    },
    div(
      { class: "w-5 h-5 relative overflow-hidden" },
      span({ class: "icon icon-view-grid w-6 h-6 absolute fill-current text-white [&_svg>use]:stroke-white" }),
    ),
  );
  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);

  arrows.append(arrowGroup, viewModeGroup);
  carouselHead.append(leftGroup, arrows);

  const carouselCards = div({
    class: "carousel-cards flex flex-wrap justify-start gap-5 w-full",
  });

  const paginationContainer = div({
    class: "pagination-container flex justify-center items-center gap-2 mt-8 w-full",
  });

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(productsCategories.length / cardsPerPageList);
    const paginationWrapper = div({
      class: "inline-flex w-full items-center justify-between",
    });

    const prevButton = div(
      {
        class: `flex items-center gap-1 cursor-pointer ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-violet-600 hover:underline"}`,
      },
      div(
        { class: "w-5 h-5 relative overflow-hidden" },
        span({
          class: `icon icon-arrow-left w-6 h-6 absolute fill-current ${currentPage === 1 ? "text-gray-400" : "text-violet-600"} [&_svg>use]:stroke-current`,
        }),
      ),
      span({ class: `${currentPage === 1 ? "text-gray-400" : "text-violet-600"}` }, "Previous"),
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
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === 1 ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        },
        "1",
      );
      firstPage.addEventListener("click", () => {
        currentPage = 1;
        updateCarousel();
      });
      pageNumbersContainer.append(firstPage);
      if (startPage > 2) {
        pageNumbersContainer.append(div({ class: "w-8 h-8 flex items-center justify-center" }, "..."));
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageNumber = div(
        {
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === i ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        },
        i.toString(),
      );
      pageNumber.addEventListener("click", () => {
        currentPage = i;
        updateCarousel();
      });
      pageNumbersContainer.append(pageNumber);
    }

    if (endPage < totalPages - 1) {
      pageNumbersContainer.append(div({ class: "w-8 h-8 flex items-center justify-center" }, "..."));
    }

    if (endPage < totalPages) {
      const lastPage = div(
        {
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === totalPages ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        },
        totalPages.toString(),
      );
      lastPage.addEventListener("click", () => {
        currentPage = totalPages;
        updateCarousel();
      });
      pageNumbersContainer.append(lastPage);
    }

    const nextButton = div(
      {
        class: `flex mr-2 items-center cursor-pointer ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-violet-600 hover:underline"}`,
      },
      span(
        {
          class: `${currentPage === totalPages ? "text-gray-400" : "text-violet-600"}`,
        },
        "Next",
      ),
      div(
        { class: "w-5 h-5 relative overflow-hidden" },
        span({
          class: `icon icon-arrow-right w-6 h-6 absolute fill-current ${currentPage === totalPages ? "text-gray-400" : "text-violet-600"} [&_svg>use]:stroke-current`,
        }),
      ),
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

  function updateCarousel() {
    carouselCards.innerHTML = "";

    if (isGridView) {
      const cardsToDisplay = productsCategories.slice(currentIndex, currentIndex + cardsPerPageGrid);
      cardsToDisplay.forEach((item) => carouselCards.append(renderGridCard(item)));
      paginationContainer.style.display = "none";
      arrowGroup.style.display = "flex";
    } else {
      const startIndex = (currentPage - 1) * cardsPerPageList;
      const endIndex = Math.min(startIndex + cardsPerPageList, productsCategories.length);
      const cardsToDisplay = productsCategories.slice(startIndex, endIndex);
      cardsToDisplay.forEach((item) => carouselCards.append(renderListCard(item)));
      paginationContainer.style.display = "flex";
      arrowGroup.style.display = "none";
    }

    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
        stroke="${isGridView ? (currentIndex > 0 ? "#7523FF" : "#D1D5DB") : currentPage > 1 ? "#7523FF" : "#D1D5DB"}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
        stroke="${isGridView ? (currentIndex + cardsPerPageGrid < productsCategories.length ? "#7523FF" : "#D1D5DB") : currentPage < Math.ceil(productsCategories.length / cardsPerPageList) ? "#7523FF" : "#D1D5DB"}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;

    if (!isGridView) {
      renderPagination();
    }
  }

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
    if (isGridView && currentIndex + cardsPerPageGrid < productsCategories.length) {
      currentIndex += cardsPerPageGrid;
      updateCarousel();
    } else if (!isGridView && currentPage < Math.ceil(productsCategories.length / cardsPerPageList)) {
      currentPage++;
      updateCarousel();
    }
  });

  listBtn.addEventListener("click", () => {
    isGridView = false;
    currentPage = 1;
    currentIndex = 0;
    listBtn.classList.replace("bg-white", "bg-violet-600");
    listBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white");
    listBtn.querySelector(".icon").classList.replace("[&_svg>use]:stroke-gray-600", "[&_svg>use]:stroke-white");
    gridBtn.classList.replace("bg-violet-600", "bg-white");
    gridBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600");
    gridBtn.querySelector(".icon").classList.replace("[&_svg>use]:stroke-white", "[&_svg>use]:stroke-gray-600");
    updateCarousel();
  });

  gridBtn.addEventListener("click", () => {
    isGridView = true;
    currentPage = 1;
    currentIndex = 0;
    cardsPerPageGrid = getCardsPerPageGrid();
    gridBtn.classList.replace("bg-white", "bg-violet-600");
    gridBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white");
    gridBtn.querySelector(".icon").classList.replace("[&_svg>use]:stroke-gray-600", "[&_svg>use]:stroke-white");
    listBtn.classList.replace("bg-violet-600", "bg-white");
    listBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600");
    listBtn.querySelector(".icon").classList.replace("[&_svg>use]:stroke-white", "[&_svg>use]:stroke-gray-600");
    updateCarousel();
  });

  // Responsive resize handling
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
  block.append(carouselContainer);
  
  const lineBr = div({
    class: "w-full h-px bg-gray-400 mt-10",
  })
  block.append(lineBr)
}
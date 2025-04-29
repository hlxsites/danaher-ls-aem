import { div, span, a, img, p } from "../../scripts/dom-builder.js";
import { getProductsForCategories } from "../../scripts/commerce.js";
import { makePublicUrl, imageHelper } from "../../scripts/scripts.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

function renderPagination() {
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(productsCategories.length / cardsPerPageList);

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
    ) // Label
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

  // First page
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

    // Ellipsis if needed
    if (startPage > 2) {
      const ellipsis = div(
        {
          class: "w-8 h-8 flex items-center justify-center",
        },
        "..."
      );
      pageNumbersContainer.append(ellipsis);
    }
  }

  // Page numbers
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

  // Ellipsis if needed
  if (endPage < totalPages - 1) {
    const ellipsis = div(
      {
        class: "w-8 h-8 flex items-center justify-center",
      },
      "..."
    );
    pageNumbersContainer.append(ellipsis);
  }

  // Last page if not already included
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

  // Next button (right-aligned)
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
        }`, // Change color based on the functionality
      },
      "Next"
    ), // Label
    div(
      {
        class: "w-5 h-5 relative overflow-hidden",
      },
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

export default renderPagination;

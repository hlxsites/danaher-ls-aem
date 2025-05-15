import { div, p, img, a, span, button } from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js"; 

function renderGridCard(item) {
  const card = div({
    class:
      "w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
  });

  const imageWrapper = div({
    class: "relative w-full",
  });

  const imageUrl =
    item.images && item.images[0]
      ? item.images[0]
      : "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";

  const imageElement = a(
    { href: item.url, title: item.title, class: "block w-full" },
    img({
      src: imageUrl,
      alt: item.title,
      class: "w-full min-h-40 max-h-40 object-cover",
    })
  );

  const carrierFreeBadge = div(
    {
      class:
        "px-4 py-1 absolute left-2 top-40 bg-violet-50 inline-flex justify-center items-center gap-2.5 z-10 -mt-6",
    },
    div(
      {
        class:
          "pt-1 text-center text-violet-600 text-sm font-normal leading-tight",
      },
      "Carrier Free"
    )
  );

  imageWrapper.append(imageElement, carrierFreeBadge);

  const titleElement = p(
    { class: "p-3 text-black text-xl font-normal leading-7" },
    item.title
  );

  const contentWrapper = div({
    class: "flex flex-col justify-start items-start w-full flex-grow",
  });

  contentWrapper.append(titleElement);

  const pricingDetails = div({
    class:
      "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
  });

  if (item.showCart && item.price !== undefined) {
    pricingDetails.append(
      div(
        {
          class:
            "text-right justify-start text-black text-2xl font-normal leading-loose",
        },
        `$${item.price.toLocaleString()}`
      ),
      div(
        { class: "self-stretch flex flex-col justify-start items-start gap-2" },
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class: "text-black text-base font-extralight leading-snug",
            },
            "Unit of Measure:"
          ),
          div(
            {
              class: "text-black text-base font-bold leading-snug",
            },
            item?.uom
          )
        ),
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class: "text-black text-base font-extralight leading-snug",
            },
            "Min. Order Qty:"
          ),
          div(
            {
              class: "text-black text-base font-bold leading-snug",
            },
            item?.minQty
          )
        )
      )
    );
  }

  let actionButtons;
  if (item.showCart && item.price !== undefined) {
    actionButtons = div(
      { class: "bg-gray-50 inline-flex justify-start items-center ml-3 mt-5 gap-3" },
      div(
        {
          class:
            "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class:
              "justify-start text-black text-base font-normal font-['Inter'] leading-normal",
          },
          "1"
        )
      ),
      div(
        {
          class:
            "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class: "text-white text-base font-normal leading-snug",
          },
          "Buy"
        )
      ),
      div(
        {
          class:
            "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class: "text-violet-600 text-base font-normal leading-snug",
          },
          "Quote"
        )
      )
    );
  } else {
    actionButtons = div(
      {
        class:
          "self-stretch h-48 px-4 py-3 bg-gray-50 inline-flex flex-col justify-center items-center gap-6",
      },
      div(
        {
          class: "self-stretch h-28 inline-flex justify-start items-center gap-3",
        },
        div(
          {
            class: "flex-1 inline-flex flex-col justify-start items-start",
          },
          div(
            {
              class:
                "self-stretch justify-start text-gray-700 text-base font-extralight leading-snug line-clamp-5",
            },
            item.description
          )
        )
      ),
      div(
        {
          class: "self-stretch inline-flex justify-start items-center gap-3",
        },
        div(
          {
            class:
              "flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
          },
          div(
            {
              class:
                "justify-start text-violet-600 text-base font-normal leading-snug",
            },
            "Quote"
          )
        )
      )
    );
  }

  const viewDetailsButton = div(
    { class: "self-stretch p-3 flex justify-start items-center" },
    div(
      { class: "text-violet-600 text-base font-bold leading-snug" },
      "View Details →"
    )
  );

  card.append(
    imageWrapper,
    contentWrapper,
    pricingDetails,
    actionButtons,
    viewDetailsButton
  );

  const imgElement = card.querySelector("img");
  if (imgElement) {
    imgElement.onerror = function () {
      if (!imgElement.getAttribute("data-fallback-applied")) {
        imgElement.src =
          "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";
        imgElement.setAttribute("data-fallback-applied", "true");
      }
    };
  }

  return card;
}
function renderListCard(item) {
  const imageUrl =
    item?.images?.[0] ||
    "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";

  const card = div({
    class:
      "self-stretch w-full outline outline-1 outline-gray-300 inline-flex justify-start items-center flex-wrap md:flex-nowrap",
  });

  const leftSection = div({
    class:
      "flex-1 self-stretch p-6 bg-white flex justify-start items-start gap-6",
  });

  const imageSection = div({
    class: "w-24 inline-flex flex-col justify-start items-center gap-3",
  });

  const imageWrapper = div({
    class:
      "self-stretch max-h-24 relative rounded-md outline outline-1 outline-offset-[-1px] outline-gray-900",
  });

  imageWrapper.append(
    div({
      class: "w-24 h-24 left-0 top-0 absolute bg-white rounded-md",
    }),
    a(
      { href: item.url, title: item.title },
      img({
        class:
          "w-24 h-24 left-0 top-0 absolute rounded-md border border-gray-200 object-cover",
        src: imageUrl,
        alt: item.title || "",
      })
    )
  );

  imageSection.append(imageWrapper);

  const contentSection = div({
    class: "self-stretch h-44 inline-flex flex-col justify-between items-start",
  });

  const titleAndDesc = div({
    class: "self-stretch flex flex-col justify-start items-start gap-3",
  });

  const titleWrapper = div({
    class: "self-stretch flex flex-col justify-start items-start gap-1",
  });

  titleWrapper.append(
    div(
      {
        class:
          "self-stretch justify-start text-black text-xl font-normal leading-7",
      },
      item.title || "Untitled Product"
    )
  );

  titleAndDesc.append(
    titleWrapper,
    div(
      {
        class: "hidden md:flex w-full flex-col gap-2 mt-4",
      },
      div(
        {
          class: "text-left text-violet-600 font-bold",
        },
        "View Details →"
      )
    )
  );

  contentSection.append(titleAndDesc);
  leftSection.append(imageSection, contentSection);

  const mobileViewDetails = div({
    class: "w-full flex flex-wrap md:hidden",
  });

  mobileViewDetails.append(
    div(
      {
        class: "ml-5 text-left text-violet-600 font-bold w-full",
      },
      "View Details →"
    )
  );

  const rightSection = div({
    class:
      "self-stretch p-6 bg-gray-50 inline-flex flex-col justify-start items-end gap-4",
  });

  const pricingDetails = div();

  if (item.showCart && item.price !== undefined) {
    pricingDetails.append(
      div(
        {
          class:
            "w-64 text-right justify-start text-black text-2xl font-normal leading-loose",
        },
        `$${item.price.toLocaleString()}`
      ),
      div(
        {
          class: "w-64 flex flex-col gap-2",
        },
        div(
          {
            class: "flex justify-between items-center",
          },
          div(
            {
              class: "text-black text-base font-extralight leading-snug",
            },
            "Unit of Measure:"
          ),
          div(
            {
              class: "text-black text-base font-bold leading-snug",
            },
            item?.uom
          )
        ),
        div(
          {
            class: "flex justify-between items-center",
          },
          div(
            {
              class: "text-black text-base font-extralight leading-snug",
            },
            "Min. Order Qty:"
          ),
          div(
            {
              class: "text-black text-base font-bold leading-snug",
            },
            item?.minQty
          )
        )
      )
    );
  }

  let actionButtons;
  if (item.showCart && item.price !== undefined) {
    actionButtons = div(
      {
        class: "inline-flex justify-start items-center gap-3",
      },
      div(
        {
          class:
            "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class:
              "justify-start text-black text-base font-normal font-['Inter'] leading-normal",
          },
          "1"
        )
      ),
      div(
        {
          class:
            "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class:
              "justify-start text-white text-base font-normal leading-snug",
          },
          "Buy"
        )
      ),
      div(
        {
          class:
            "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class:
              "justify-start text-violet-600 text-base font-normal leading-snug",
          },
          "Quote"
        )
      )
    );
  } else {
    actionButtons = div(
      {
        class:
          "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-center items-center gap-6",
      },
      div(
        {
          class: "self-stretch h-28 inline-flex justify-start items-center gap-3",
        },
        div(
          {
            class: "flex-1 inline-flex flex-col justify-start items-start",
          },
          div(
            {
              class:
                "self-stretch justify-start text-gray-700 text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug line-clamp-5",
            },
            item.description || "No description available"
          )
        )
      ),
      div(
        {
          class: "self-stretch inline-flex justify-start items-center gap-3",
        },
        div(
          {
            class:
              "flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
            "data-state": "Default",
            "data-type": "Primary",
          },
          div(
            {
              class:
                "justify-start text-violet-600 text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
            },
            "Quote"
          )
        )
      )
    );
  }

  rightSection.append(pricingDetails, actionButtons);
  card.append(leftSection, mobileViewDetails, rightSection);

  const imgElement = card.querySelector("img");
  if (imgElement) {
    imgElement.onerror = function () {
      if (!imgElement.getAttribute("data-fallback-applied")) {
        imgElement.src =
          "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";
        imgElement.setAttribute("data-fallback-applied", "true");
      }
    };
  }

  return card;
}

function getCardsPerPageGrid() {
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 4;
}

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
  const linkText =
    block
      .querySelector('[data-aue-prop="card_hrefText"]')
      ?.textContent.trim() || "View Details";

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
  const productTitle = div(
    {
      class: "text-black text-2xl font-normal leading-loose whitespace-nowrap",
    },
    headingText || "Top Selling Products"
  );
  const browseLink = a(
    {
      href: "#",
      class:
        "text-violet-600 text-base font-bold leading-snug hover:underline whitespace-nowrap",
    },
    linkText
  );
  leftGroup.append(productTitle, browseLink);

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

  const getProductInfo = async (id) => {
    try {
      const res1 = await fetch(
        `https://stage.lifesciences.danaher.com/us/en/product-data/?product=${id}`
      );
      const main = await res1.json();
      const product = main.results?.[0];
      console.log("Product Data:", product);
      if (!product) return null;

      const sku = product.raw?.sku || "";
      const res2 = await fetch(
        `https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`
      );
      const shopData = await res2.json();
      console.log("Shop Data:", shopData);

      const showCart = shopData?.attributes?.some(
        (attr) => attr.name === "show_add_to_cart" && attr.value === "True"
      );
      console.log("Show Cart:", showCart);

      return {
        title: product.title || "",
        url: product.clickUri || "#",
        images: product.raw?.images || [],
        availability: shopData.availability?.inStockQuantity,
        uom:
          shopData.packingUnit > 0
            ? shopData.packingUnit + "/Bundle"
            : "1/Bundle",
        minQty: shopData.minOrderQuantity,
        description: product.raw?.ec_shortdesc || "",
        showCart,
        price: shopData.salePrice?.value,
      };
    } catch (e) {
      return null;
    }
  };

  const products = (await Promise.all(productIds.map(getProductInfo))).filter(
    (product) => product !== null
  );
  console.log("542 Fetched Products:", products);
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
    }

    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
        stroke="${
          isGridView
            ? currentIndex > 0
              ? "#7523FF"
              : "#D1D5DB"
            : currentPage > 1
            ? "#7523FF"
            : "#D1D5DB"
        }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
        stroke="${
          isGridView
            ? currentIndex + cardsPerPageGrid < products.length
              ? "#7523FF"
              : "#D1D5DB"
            : currentPage < Math.ceil(products.length / cardsPerPageList)
            ? "#7523FF"
            : "#D1D5DB"
        }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  listBtn.addEventListener("click", () => {
    isGridView = false;
    currentPage = 1;
    currentIndex = 0;
    listBtn.classList.replace("bg-white", "bg-violet-600");
    listBtn
      .querySelector(".icon")
      .classList.replace("text-gray-600", "text-white");
    listBtn
      .querySelector(".icon")
      .classList.replace(
        "[&_svg>use]:stroke-gray-600",
        "[&_svg>use]:stroke-white"
      );
    gridBtn.classList.replace("bg-violet-600", "bg-white");
    gridBtn
      .querySelector(".icon")
      .classList.replace("text-white", "text-gray-600");
    gridBtn
      .querySelector(".icon")
      .classList.replace(
        "[&_svg>use]:stroke-white",
        "[&_svg>use]:stroke-gray-600"
      );
    updateCarousel();
  });

  gridBtn.addEventListener("click", () => {
    isGridView = true;
    currentPage = 1;
    currentIndex = 0;
    cardsPerPageGrid = getCardsPerPageGrid();
    gridBtn.classList.replace("bg-white", "bg-violet-600");
    gridBtn
      .querySelector(".icon")
      .classList.replace("text-gray-600", "text-white");
    gridBtn
      .querySelector(".icon")
      .classList.replace(
        "[&_svg>use]:stroke-gray-600",
        "[&_svg>use]:stroke-white"
      );
    listBtn.classList.replace("bg-violet-600", "bg-white");
    listBtn
      .querySelector(".icon")
      .classList.replace("text-white", "text-gray-600");
    listBtn
      .querySelector(".icon")
      .classList.replace(
        "[&_svg>use]:stroke-white",
        "[&_svg>use]:stroke-gray-600"
      );
    updateCarousel();
  });

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

import { div, span, a, img, p } from "../../scripts/dom-builder.js"
import { getProductsForCategories } from "../../scripts/commerce.js"
import { makePublicUrl, imageHelper } from "../../scripts/scripts.js"
import { decorateIcons } from "../../scripts/lib-franklin.js"

async function fetchProducts() {
  try {
    const productsCategories = await getProductsForCategories()
    console.log("Fetched products categories:", productsCategories?.results)
    return productsCategories?.results || []
  } catch (error) {
    return []
  }
}

export default async function decorate(block) {
  const content = block.querySelector("div")
  const productsCategories = await fetchProducts()

  // Fixed cards per page to 3 as requested
  const cardsPerPage = 4
  const cardsPerPageList = 3
  let currentPage = 1
  let currentIndex = 0
  let isGridView = true

  const carouselContainer = div({
    class: "carousel-container flex flex-col w-full py-6 justify-center",
  })

  const carouselHead = div({
    class: "w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4",
  })

  const leftGroup = div({ class: "flex flex-wrap sm:flex-nowrap items-center gap-4" })
  const productTitle = div(
    {
      class: 'text-black text-2xl font-normal font-["TWK_Lausanne_Pan"] leading-loose whitespace-nowrap',
    },
    "Top Selling Products",
  )
  const browseLink = a(
    {
      href: "#",
      class:
        'text-violet-600 text-base font-bold font-["TWK_Lausanne_Pan"] leading-snug hover:underline whitespace-nowrap',
    },
    "Browse 120 Products →",
  )
  leftGroup.append(productTitle, browseLink)

  const arrows = div({ class: "w-72 inline-flex justify-end items-center gap-6" })
  const arrowGroup = div({ class: "flex justify-start items-center gap-3" })
  const prevDiv = div({ class: "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer" })
  const nextDiv = div({ class: "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer" })
  arrowGroup.append(prevDiv, nextDiv)

  const viewModeGroup = div({ class: "flex justify-start items-center" })
  const listBtn = div(
    {
      class:
        "px-3 py-2 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
    },
    div(
      { class: "w-5 h-5 relative overflow-hidden" },
      span({ class: "icon icon-view-list w-6 h-6 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600" }),
    ),
  )
  const gridBtn = div(
    {
      class:
        "px-3 py-2 bg-violet-600 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
    },
    div(
      { class: "w-5 h-5 relative overflow-hidden" },
      span({ class: "icon icon-view-grid w-6 h-6 absolute fill-current text-white [&_svg>use]:stroke-white" }),
    ),
  )
  viewModeGroup.append(listBtn, gridBtn)
  decorateIcons(viewModeGroup)

  arrows.append(arrowGroup, viewModeGroup)
  carouselHead.append(leftGroup, arrows)

  const carouselCards = div({
    class: "carousel-cards flex flex-wrap justify-start gap-5 w-full",
  })

  // Add pagination container
  const paginationContainer = div({
    class: "pagination-container flex justify-center items-center gap-2 mt-8 w-full",
  })

  function renderGridCard(item) {
    const card = div({
      class:
        "w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
    })

    const image = imageHelper(item.raw.images[0], item.title, {
      href: makePublicUrl(item.path),
      title: item.title,
      class: "w-full h-40 object-cover",
    })

    const head = p({ class: "p-3 text-black text-xl font-normal leading-7" }, item.title)
    const desc = p({ class: "p-3 text-gray-700 text-base font-extralight leading-snug" }, item?.raw?.source)

    const details = div(
      { class: "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6" },
      div(
        { class: "text-right justify-start text-black text-2xl font-normal font-['TWK_Lausanne_Pan'] leading-loose" },
        "$1,000.00",
      ),
      div(
        { class: "self-stretch flex flex-col justify-start items-start gap-2" },
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            { class: "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug" },
            "Unit of Measure:",
          ),
          div({ class: "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug" }, item?.raw?.uom || "1/Bundle"),
        ),
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            { class: "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug" },
            "Min. Order Qty:",
          ),
          div({ class: "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug" }, item?.raw?.minQty || "50"),
        ),
      ),
      div(
        { class: "inline-flex justify-start items-center gap-3" },
        div(
          {
            class:
              "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
          },
          div({ class: "justify-start text-black text-base font-normal font-['Inter'] leading-normal" }, "1"),
        ),
        div(
          {
            class:
              "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
          },
          div({ class: "text-white text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug" }, "Buy"),
        ),
        div(
          {
            class:
              "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
          },
          div({ class: "text-violet-600 text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug" }, "Quote"),
        ),
      ),
    )

    const spacer = div({ class: "flex-grow" })
    const desc1 = div(
      { class: "self-stretch p-3 flex justify-start items-center" },
      div({ class: "text-violet-600 text-base font-bold leading-snug" }, "View Details →"),
    )

    card.append(image, head, desc, details, spacer, desc1)
    return card
  }

  function renderListCard(item) {
    return div(
      {
        class: "self-stretch w-full outline outline-1 outline-gray-300 inline-flex justify-start items-center flex-wrap md:flex-nowrap",
      },
      div(
        {
          class: "flex-1 self-stretch p-6 bg-white flex justify-start items-start gap-6",
        },
        div(
          {
            class: "w-24 inline-flex flex-col justify-start items-center gap-3",
          },
          div(
            {
              class: "self-stretch max-h-24 relative rounded-md outline outline-1 outline-offset-[-1px] outline-gray-900",
            },
            div({
              class: "w-24 h-24 left-0 top-0 absolute bg-white rounded-md",
            }),
            img({
              class: "w-24 h-24 left-0 top-0 absolute rounded-md border border-gray-200 object-cover",
              src: item?.raw?.images?.[0] || "",
              alt: item.title || "",
            }),
          ),
        ),
        div(
          {
            class: "self-stretch h-44 inline-flex flex-col justify-between items-start",
          },
          div(
            {
              class: "self-stretch flex flex-col justify-start items-start gap-3",
            },
            div(
              {
                class: "self-stretch flex flex-col justify-start items-start gap-1",
              },
              item?.raw?.tag &&
                div(
                  {
                    class: "px-4 py-1 bg-violet-50 inline-flex justify-center items-center gap-2.5",
                  },
                  div(
                    {
                      class:
                        "text-center justify-start text-violet-600 text-sm font-normal font-['TWK_Lausanne_Pan'] leading-tight",
                    },
                    item.raw.tag,
                  ),
                ),
              div(
                {
                  class:
                    "self-stretch justify-start text-black text-xl font-normal font-['TWK_Lausanne_Pan'] leading-7",
                },
                item.title,
              ),
            ),
            div(
              {
                class: "self-stretch inline-flex justify-start items-center gap-3",
              },
              div(
                {
                  class: "flex-1 inline-flex flex-col justify-start items-start",
                },
                div(
                  {
                    class:
                      "w-64 justify-start text-gray-700 text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
                  },
                  item?.raw?.sku || "",
                ),
              ),
            ),
            // Adding View Details and Source below SKU only in desktop view
            div(
              {
                class: "hidden md:flex w-full flex-col gap-2 mt-4", // This section is only visible in desktop view
              },
              div(
                {
                  class: "text-left text-violet-600 font-bold",
                },
                "View Details →",
              ),
              div(
                {
                  class: "text-left text-sm text-gray-600",
                },
                item?.raw?.source || "No Source Available",
              ),
            ),
          ),
        ),
      ),
      // Mobile-specific: New row for "View Details" and "Source" - placed below image and product details for mobile view
      div(
        {
          class: "w-full flex flex-wrap md:hidden", // Only show in mobile (md:hidden hides this on desktop)
        },
        div(
          {
            class: "text-left text-violet-600 font-bold w-full", // Stack on mobile, align left
          },
          "View Details →",
        ),
        div(
          {
            class: "text-left text-sm text-gray-600 w-full", // Stack on mobile, align left
          },
          item?.raw?.source || "No Source Available",
        ),
      ),
      div(
        {
          class: "self-stretch p-6 bg-gray-50 inline-flex flex-col justify-start items-end gap-4",
        },
        div(
          {
            class:
              "w-64 text-right justify-start text-black text-2xl font-normal font-['TWK_Lausanne_Pan'] leading-loose",
          },
          `$${item?.raw?.price || "50.00"}`,
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
                class: "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Availability:",
            ),
            div(
              {
                class: "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
              },
              `${item?.raw?.availability || 0} Available`,
            ),
          ),
          div(
            {
              class: "flex justify-between items-center",
            },
            div(
              {
                class: "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Unit of Measure:",
            ),
            div(
              {
                class: "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
              },
              item?.raw?.uom || "2/Bundle",
            ),
          ),
          div(
            {
              class: "flex justify-between items-center",
            },
            div(
              {
                class: "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Min. Order Qty:",
            ),
            div(
              {
                class: "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
              },
              item?.raw?.minQty || "4",
            ),
          ),
        ),
        div(
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
                class: "justify-start text-black text-base font-normal font-['Inter'] leading-normal",
              },
              "1",
            ),
          ),
          div(
            {
              class:
                "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
            },
            div(
              {
                class: "justify-start text-white text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Buy",
            ),
          ),
          div(
            {
              class:
                "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
            },
            div(
              {
                class: "justify-start text-violet-600 text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Quote",
            ),
          ),
        ),
      ),
    );
  }
  
  


  function renderPagination() {
    paginationContainer.innerHTML = "";
  
    const totalPages = Math.ceil(productsCategories.length / cardsPerPageList);
  
    // Create the container for pagination with left-aligned and right-aligned buttons
    const paginationWrapper = div({
      class: "inline-flex w-full items-center justify-between", // Aligns Previous and Next buttons on the left and right
    });
  
    // Previous button (left-aligned)
const prevButton = div({
  class: `flex items-center gap-1 cursor-pointer ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-violet-600 hover:underline"}`,
},
  div({ class: "w-5 h-5 relative overflow-hidden" },
    span({ class: `icon icon-arrow-left w-6 h-6 absolute fill-current ${currentPage === 1 ? "text-gray-400" : "text-violet-600"} [&_svg>use]:stroke-current` })
  ),
  span({ class: `${currentPage === 1 ? "text-gray-400" : "text-violet-600"}` }, "Previous") // Label
);

decorateIcons(prevButton);

    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        updateCarousel();
      }
    });
  
    // Page numbers container - centered
    const pageNumbersContainer = div({
      class: "flex items-center justify-center gap-1", // Reduced gap between page numbers
    });
  
    // Page numbers logic
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
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === 1 ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        },
        "1",
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
          "...",
        );
        pageNumbersContainer.append(ellipsis);
      }
    }
  
    // Page numbers
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
  
    // Ellipsis if needed
    if (endPage < totalPages - 1) {
      const ellipsis = div(
        {
          class: "w-8 h-8 flex items-center justify-center",
        },
        "...",
      );
      pageNumbersContainer.append(ellipsis);
    }
  
    // Last page if not already included
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
  
    // Next button (right-aligned)
    const nextButton = div({
      class: `flex mr-2 items-center cursor-pointer ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-violet-600 hover:underline"}`,
    },
      span({
        class: `${currentPage === totalPages ? "text-gray-400" : "text-violet-600"}`, // Change color based on the functionality
      }, "Next"), // Label
      div({
        class: "w-5 h-5 relative overflow-hidden",
      },
        span({
          class: `icon icon-arrow-right w-6 h-6 absolute fill-current ${currentPage === totalPages ? "text-gray-400" : "text-violet-600"} [&_svg>use]:stroke-current`
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
  
    // Append everything into the container
    paginationWrapper.append(prevButton, pageNumbersContainer, nextButton);
    paginationContainer.append(paginationWrapper);
  }
  
  function updateCarousel() {
    carouselCards.innerHTML = ""

    if (isGridView) {
      // In grid view, show only cardsPerPage items starting from currentIndex
      const cardsToDisplay = productsCategories.slice(currentIndex, currentIndex + cardsPerPage)
      cardsToDisplay.forEach((item) => carouselCards.append(renderGridCard(item)))

      // Hide pagination in grid view
      paginationContainer.style.display = "none"
      arrowGroup.style.display = "flex"
    } else {
      // In list view, show all items with pagination
      const startIndex = (currentPage - 1) * cardsPerPageList
      const endIndex = Math.min(startIndex + cardsPerPageList, productsCategories.length)
      const cardsToDisplay = productsCategories.slice(startIndex, endIndex)
      cardsToDisplay.forEach((item) => carouselCards.append(renderListCard(item)))

      // Show pagination in list view
      paginationContainer.style.display = "flex"
      arrowGroup.style.display = "none"
    }

    // Update arrow visibility based on current index/page
    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
        stroke="${isGridView ? (currentIndex > 0 ? "#7523FF" : "#D1D5DB") : currentPage > 1 ? "#7523FF" : "#D1D5DB"}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    `

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
        stroke="${isGridView ? (currentIndex + cardsPerPage < productsCategories.length ? "#7523FF" : "#D1D5DB") : currentPage < Math.ceil(productsCategories.length / cardsPerPage) ? "#7523FF" : "#D1D5DB"}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    `

    // Update pagination if in list view
    if (!isGridView) {
      renderPagination()
    }
  }

  prevDiv.addEventListener("click", () => {
    if (isGridView) {
      if (currentIndex > 0) {
        currentIndex -= cardsPerPage
        updateCarousel()
      }
    } else {
      if (currentPage > 1) {
        currentPage--
        updateCarousel()
      }
    }
  })

  nextDiv.addEventListener("click", () => {
    if (isGridView) {
      if (currentIndex + cardsPerPage < productsCategories.length) {
        currentIndex += cardsPerPage
        updateCarousel()
      }
    } else {
      if (currentPage < Math.ceil(productsCategories.length / cardsPerPage)) {
        currentPage++
        updateCarousel()
      }
    }
  })

  listBtn.addEventListener("click", () => {
    isGridView = false
    currentPage = 1
    currentIndex = 0
    listBtn.classList.replace("bg-white", "bg-violet-600")
    listBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white")
    gridBtn.classList.replace("bg-violet-600", "bg-white")
    gridBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600")
    updateCarousel()
  })

  gridBtn.addEventListener("click", () => {
    isGridView = true
    currentPage = 1
    currentIndex = 0
    gridBtn.classList.replace("bg-white", "bg-violet-600")
    gridBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white")
    listBtn.classList.replace("bg-violet-600", "bg-white")
    listBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600")
    updateCarousel()
  })

  updateCarousel()
  carouselContainer.append(carouselHead, carouselCards, paginationContainer)
  content.append(carouselContainer)
}

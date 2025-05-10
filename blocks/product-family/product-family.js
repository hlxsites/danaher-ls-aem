import { decorateIcons } from "../../scripts/lib-franklin.js"
import { div, p, span } from "../../scripts/dom-builder.js"
import { getProductsForCategories } from "../../scripts/commerce.js"
import { makePublicUrl, imageHelper } from "../../scripts/scripts.js"
import { getCommerceBase } from "../../scripts/commerce.js"

const baseURL = getCommerceBase()

// async function getProduct() {
//   try {
//     const response = await fetch(`${baseURL}/products/dmi1-for-core-cell-culture`)
//     const product = await response.json()
//     console.log("Product details:", product.salePrice.value, product.minOrderQuantity, product.packingUnit)
//     return product
//   } catch (error) {
//     console.error("Error fetching product details:", error)
//     return null
//   }
// }

async function fetchProducts() {
  try {
    const productCategories = await getProductsForCategories()
    console.log("Fetched product categories:", productCategories?.results)
    return productCategories?.results || []
  } catch (error) {
    return []
  }
}

export default async function decorate(block) {
  const productCategories = await fetchProducts()
  const productDetails = await getProduct()

  // Constants for pagination
  const GRID_ITEMS_PER_PAGE = 21 // 7 rows of 3 items
  const LIST_ITEMS_PER_PAGE = 7
  let currentPage = 1
  let isGridView = true // Default to grid view

  // Create filter sidebar
  const filterWrapper = div({
    class: "w-72 p-5 inline-flex flex-col justify-start items-start gap-3",
  })

  // Header Row
  const header = div(
    { class: "self-stretch inline-flex justify-start items-center gap-4" },
    div(
      { class: "w-12 h-12 relative bg-violet-50 rounded-3xl" },
      div(
        { class: "w-6 h-6 left-[12px] top-[12px] absolute overflow-hidden" },
        span({
          class:
            "icon icon-adjustments w-6 h-6 absolute right-0 fill-current text-gray-400 chevron-down [&_svg>use]:stroke-gray-400",
        }),
      ),
    ),
    div(
      { class: "flex-1 h-6 relative" },
      div(
        { class: "w-64 h-6 left-0 top-0 absolute" },
        div(
          {
            class: "w-64 left-0 top-[-6px] absolute justify-start text-gray-900 text-3xl font-normal leading-10",
          },
          "Filters",
        ),
      ),
    ),
  )

  const expandAll = div(
    {
      class: "self-stretch h-5 p-3 inline-flex justify-end items-center gap-2.5",
    },
    div(
      {
        class: "text-right justify-start text-violet-600 text-base font-bold leading-snug",
      },
      "Expand All",
    ),
    div(
      { class: "w-4 h-4 relative mb-2" },
      span({ class: "icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 ml-1" }),
    ),
  )

  decorateIcons(expandAll)
  decorateIcons(header)

  const facet = (title = "Facet Title", items = []) =>
    div(
      {
        class: "self-stretch p-3 bg-white border-t border-gray-300 flex flex-col justify-start items-start gap-3",
      },
      div(
        { class: "self-stretch pr-3 pt-2 pb-2.5 inline-flex justify-between items-start" },
        div({ class: "flex-1 justify-start text-black text-base font-semibold font-['Inter'] leading-normal" }, title),
        div(
          { class: "w-4 h-4 relative mb-2" },
          span({ class: "icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 ml-1" }),
        ),
        div(
          { class: "text-right justify-start text-gray-400 text-base font-semibold font-['Inter'] leading-normal" },
          "–",
        ),
      ),
      ...items,
    )

  const facetItem = (label) =>
    div(
      {
        class: "inline-flex justify-start items-center gap-2",
      },
      div({ class: "w-4 h-4 relative bg-white rounded border border-gray-300" }),
      div({ class: "justify-start text-black text-sm font-normal leading-tight" }, label),
    )

  const facetItemsList = [
    "Beckman Life Science",
    "IDBS",
    "Leica Microsystems",
    "Molecular Devices",
    "Phenomenex",
    "Sciex",
  ].map(facetItem)

  const searchBar = div(
    {
      class:
        "self-stretch h-8 px-3 py-1.5 bg-gray-100 outline outline-[0.50px] outline-gray-300 inline-flex justify-start items-center gap-1.5",
    },
    div(
      {
        class: "flex justify-start items-center gap-1.5",
      },
      span({
        class: "icon icon-search w-4 h-4 text-gray-400",
      }),
      div(
        {
          class: "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-tight",
        },
        "Search",
      ),
    ),
  )

  decorateIcons(searchBar)
  const fullFacet = facet("Facet Title", [
    searchBar,
    div({ class: "h-52 flex flex-col justify-start items-start gap-4" }, ...facetItemsList),
  ])

  filterWrapper.append(
    header,
    expandAll,
    div({ class: "self-stretch flex flex-col justify-start items-start" }, fullFacet),
  )
  decorateIcons(filterWrapper)

  // Create content wrapper
  const contentWrapper = div({
    class: "flex-1 flex flex-col gap-4",
  })

  // Create header with product count and view toggle
  const headerWrapper = div({
    class: "w-full flex justify-between items-center mb-4",
  })

  const productCount = div(
    {
      class: "text-black text-base font-medium",
    },
    `${productCategories.length} Products Available`,
  )

  // Create view toggle
  const viewToggleWrapper = div({
    class: "flex items-center gap-2",
  })

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
  viewToggleWrapper.append(viewModeGroup)

  headerWrapper.append(productCount, viewToggleWrapper)
  contentWrapper.append(headerWrapper)

  // Create product grid/list container
  const productContainer = div({
    class: "w-full",
  })
  contentWrapper.append(productContainer)

  // Create pagination container
  const paginationContainer = div({
    class: "pagination-container flex justify-center items-center gap-2 mt-8 w-full",
  })
  contentWrapper.append(paginationContainer)

  // Function to render pagination
  function renderPagination() {
    paginationContainer.innerHTML = ""

    const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE
    const totalPages = Math.ceil(productCategories.length / itemsPerPage)

    // Don't show pagination if there's only one page or if we're in grid view with fewer items than GRID_ITEMS_PER_PAGE
    if (totalPages <= 1 || (isGridView && productCategories.length <= GRID_ITEMS_PER_PAGE)) {
      paginationContainer.style.display = "none"
      return
    }

    paginationContainer.style.display = "flex"

    const paginationWrapper = div({
      class: "inline-flex w-full items-center justify-between",
    })

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
    )
    decorateIcons(prevButton)
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        updateProductDisplay()
      }
    })

    const pageNumbersContainer = div({
      class: "flex items-center justify-center gap-1",
    })

    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      const firstPage = div(
        {
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === 1 ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        },
        "1",
      )
      firstPage.addEventListener("click", () => {
        currentPage = 1
        updateProductDisplay()
      })
      pageNumbersContainer.append(firstPage)
      if (startPage > 2) {
        pageNumbersContainer.append(div({ class: "w-8 h-8 flex items-center justify-center" }, "..."))
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageNumber = div(
        {
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === i ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        },
        i.toString(),
      )
      pageNumber.addEventListener("click", () => {
        currentPage = i
        updateProductDisplay()
      })
      pageNumbersContainer.append(pageNumber)
    }

    if (endPage < totalPages - 1) {
      pageNumbersContainer.append(div({ class: "w-8 h-8 flex items-center justify-center" }, "..."))
    }

    if (endPage < totalPages) {
      const lastPage = div(
        {
          class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === totalPages ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        },
        totalPages.toString(),
      )
      lastPage.addEventListener("click", () => {
        currentPage = totalPages
        updateProductDisplay()
      })
      pageNumbersContainer.append(lastPage)
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
    )
    decorateIcons(nextButton)
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++
        updateProductDisplay()
      }
    })

    paginationWrapper.append(prevButton, pageNumbersContainer, nextButton)
    paginationContainer.append(paginationWrapper)
  }

  // Function to render a grid card
  function renderProductGridCard(item) {
    const card = div({
      class:
        "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.33%-13.33px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
    })

    const imageElement = imageHelper(item.raw.images[0], item.title, {
      href: makePublicUrl(item.path),
      title: item.title,
      class: "w-full h-40 object-cover",
    })

    const titleElement = p({ class: "p-3 text-black text-xl font-normal leading-7" }, item.title)


    const contentWrapper = div({
      class: "flex flex-col justify-start items-start w-full flex-grow",
    })

    contentWrapper.append(titleElement)

    const pricingDetails = div(
      {
        class: "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
      },
      div(
        {
          class: "text-right justify-start text-black text-2xl font-normal leading-loose",
        },
        productDetails?.salePrice?.value || "$99,999.99",
      ),
      div(
        { class: "self-stretch flex flex-col justify-start items-start gap-2" },
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class: "text-black text-base font-extralight leading-snug",
            },
            "Unit of Measure:",
          ),
          div(
            {
              class: "text-black text-base font-bold leading-snug",
            },
            productDetails?.packingUnit || "1/Bundle",
          ),
        ),
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class: "text-black text-base font-extralight leading-snug",
            },
            "Min. Order Qty:",
          ),
          div(
            {
              class: "text-black text-base font-bold leading-snug",
            },
            productDetails?.minOrderQuantity || "1",
          ),
        ),
      ),
    )

    const actionButtons = div(
      { class: "inline-flex justify-start items-center ml-3 mt-5 gap-3" },
      div(
        {
          class:
            "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
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
            class: "text-white text-base font-normal leading-snug",
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
            class: "text-violet-600 text-base font-normal leading-snug",
          },
          "Quote",
        ),
      ),
    )

    const viewDetailsButton = div(
      { class: "self-stretch p-3 flex justify-start items-center" },
      div({ class: "text-violet-600 text-base font-bold leading-snug" }, "View Details →"),
    )

    // Append elements in a structured way
    card.append(imageElement, contentWrapper, pricingDetails, actionButtons, viewDetailsButton)
    return card
  }

  // Function to render a list card
  function renderProductListCard(item) {
    const card = div({
      class: "w-full min-h-24 mb-4 bg-white outline outline-1 outline-gray-300 flex flex-row justify-start items-start",
    })

    // Left side - Image and title
    const leftSide = div({
      class: "flex-none w-64 p-4",
    })

    const imageElement = imageHelper(item.raw.images[0], item.title, {
      href: makePublicUrl(item.path),
      title: item.title,
      class: "w-full h-32 object-cover mb-2",
    })


    leftSide.append(imageElement)

    // Middle - Description
    const middleSection = div({
      class: "flex-grow p-4",
    })

    const titleElement = p({ class: "text-black text-lg font-normal leading-7" }, item.title)

    middleSection.append(titleElement)

    // Right side - Pricing and actions
    const rightSide = div({
      class: "flex-none w-64 p-4 bg-gray-50",
    })

    const pricingDetails = div(
      { class: "mb-4" },
      div(
        { class: "text-right text-black text-2xl font-normal leading-loose mb-2" },
        productDetails?.salePrice?.value || "$99,999.99",
      ),
      div(
        { class: "flex justify-between items-center w-full mb-1" },
        div({ class: "text-black text-sm font-extralight leading-snug" }, "Unit of Measure:"),
        div({ class: "text-black text-sm font-bold leading-snug" }, productDetails?.packingUnit || "1/Bundle"),
      ),
      div(
        { class: "flex justify-between items-center w-full" },
        div({ class: "text-black text-sm font-extralight leading-snug" }, "Min. Order Qty:"),
        div({ class: "text-black text-sm font-bold leading-snug" }, productDetails?.minOrderQuantity || "1"),
      ),
    )

    const actionButtons = div(
      { class: "flex flex-col gap-2" },
      div(
        { class: "flex items-center gap-2 mb-2" },
        div(
          {
            class:
              "w-14 px-4 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center",
          },
          "1",
        ),
        div(
          {
            class:
              "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center",
          },
          div({ class: "text-white text-base font-normal leading-snug" }, "Buy"),
        ),
      ),
      div(
        {
          class:
            "w-full px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center",
        },
        div({ class: "text-violet-600 text-base font-normal leading-snug" }, "Quote"),
      ),
      div(
        { class: "w-full text-center mt-2" },
        div({ class: "text-violet-600 text-base font-bold leading-snug" }, "View Details →"),
      ),
    )

    rightSide.append(pricingDetails, actionButtons)

    // Append all sections to the card
    card.append(leftSide, middleSection, rightSide)
    return card
  }

  // Function to update product display based on current view and page
  function updateProductDisplay() {
    productContainer.innerHTML = ""

    const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, productCategories.length)

    // Create wrapper for grid or list
    const productsWrapper = isGridView
      ? div({ class: "w-full flex flex-wrap gap-5 justify-start" })
      : div({ class: "w-full flex flex-col gap-4" })

    // Get products for current page
    const productsToDisplay = productCategories.slice(startIndex, endIndex)

    // Render products based on current view
    productsToDisplay.forEach((item) => {
      if (isGridView) {
        productsWrapper.append(renderProductGridCard(item))
      } else {
        productsWrapper.append(renderProductListCard(item))
      }
    })

    productContainer.append(productsWrapper)
    renderPagination()
  }

  // Event listeners for view toggle buttons
  listBtn.addEventListener("click", () => {
    if (isGridView) {
      isGridView = false
      currentPage = 1

      // Update button styles
      listBtn.classList.replace("bg-white", "bg-violet-600")
      listBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white")
      gridBtn.classList.replace("bg-violet-600", "bg-white")
      gridBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600")

      updateProductDisplay()
    }
  })

  gridBtn.addEventListener("click", () => {
    if (!isGridView) {
      isGridView = true
      currentPage = 1

      // Update button styles
      gridBtn.classList.replace("bg-white", "bg-violet-600")
      gridBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white")
      listBtn.classList.replace("bg-violet-600", "bg-white")
      listBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600")

      updateProductDisplay()
    }
  })

  // Initial display
  updateProductDisplay()

  // Create layout wrapper and append all components
  const layoutWrapper = div(
    {
      class: "w-full flex flex-col lg:flex-row gap-8 items-start",
    },
    filterWrapper,
    contentWrapper,
  )

  block.append(layoutWrapper)
}

import { div, p, span, button, ul, li } from "../../scripts/dom-builder.js"
import { makePublicUrl, imageHelper } from "../../scripts/scripts.js"
import { getProductsForCategories, getCommerceBase } from "../../scripts/commerce.js"
import { decorateIcons } from "../../scripts/lib-franklin.js"

const baseURL = getCommerceBase()

// State for filters
let workflowName = new Set()
let opco = new Set()
let currentPage = 1
const ITEMS_PER_PAGE = 12

/**
 * Function to get hash params
 * @returns {Object} hash params
 */
const hashParams = () => {
  const hash = window.location.hash.substr(1)
  const params = {}

  hash.split("&").forEach((param) => {
    const [key, value] = param.split("=")
    params[decodeURIComponent(key)] = decodeURIComponent(value)
  })
  return params
}

/**
 * Function to get array from url hash param
 * @returns {Array} array from hash param
 */
function getArrayFromHashParam(param) {
  return param ? (param.includes(",") ? param.split(",") : [param]) : []
}

/**
 * Function to check if object is empty
 * @param {Object} obj
 */
function isEmptyObject(obj) {
  return obj && Object.keys(obj)?.at(0) === ""
}

/**
 * Function to update URL hash with current filters
 */
function updateUrlHash() {
  const queryMap = new Map()

  if (workflowName.size > 0) queryMap.set("workflowname", [...workflowName].join(","))
  if (opco.size > 0) queryMap.set("opco", [...opco].join(","))
  if (currentPage > 1) queryMap.set("page", currentPage)

  const queryString = Array.from(queryMap.entries())
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&")

  history.replaceState({}, "", `#${queryString}`)
}

/**
 * Function to clear all filters
 * @param {Event} e
 * @param {Boolean} clearWorkflow
 * @param {Boolean} clearOpco
 */
function clearFilters(e, clearWorkflow = true, clearOpco = true) {
  if (clearWorkflow) workflowName = new Set()
  if (clearOpco) opco = new Set()
  currentPage = 1
  updateUrlHash()

  // Re-render the product grid
  const container = document.querySelector(".product-container")
  if (container) {
    renderProductGrid(container)
  }
}

/**
 * Function to handle filter button click
 * @param {Event} e
 */
function handleFilterClick(e) {
  e.preventDefault()
  const button = e.target.closest("button")
  if (!button) return

  const filterType = button.dataset.type
  const filterValue = button.dataset.value
  const isActive = button.getAttribute("aria-pressed") === "true"

  if (filterType === "workflowname") {
    if (isActive) {
      workflowName.delete(filterValue)
    } else {
      workflowName.add(filterValue)
    }
  } else if (filterType === "opco") {
    if (isActive) {
      opco.delete(filterValue)
    } else {
      opco.add(filterValue)
    }
  }

  button.setAttribute("aria-pressed", !isActive)
  currentPage = 1
  updateUrlHash()

  // Re-render the product grid
  const container = document.querySelector(".product-container")
  if (container) {
    renderProductGrid(container)
  }
}

/**
 * Function to handle pagination click
 * @param {Event} e
 * @param {Number} page
 */
function handlePaginationClick(e, page) {
  e.preventDefault()
  currentPage = page
  updateUrlHash()

  // Re-render the product grid
  const container = document.querySelector(".product-container")
  if (container) {
    renderProductGrid(container)
  }

  // Scroll to top of container
  container.scrollIntoView({ behavior: "smooth" })
}

/**
 * Function to render a single grid card
 * @param {Object} item
 * @returns {HTMLElement}
 */
function renderGridCard(item) {
  const card = div({
    class:
      "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.33%-13.33px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
  })

  // Image Wrapper with Carrier Free Badge
  const imageWrapper = div({
    class: "relative w-full",
  })

  const imageElement = imageHelper(item.raw.images[0], item.title, {
    href: makePublicUrl(item.path),
    title: item.title,
    class: "w-full h-40 object-cover",
  })

  // Only add the badge if the item has a tag or default to "Carrier Free"
  if (item?.raw?.tag || "Carrier Free") {
    const carrierFreeBadge = div(
      {
        class: "px-4 py-1 absolute left-2 top-40 bg-violet-50 inline-flex justify-center items-center gap-2.5 z-10",
        "data-state": "Static",
      },
      div(
        {
          class: "pt-1 text-center text-violet-600 text-sm font-normal leading-tight",
        },
        item?.raw?.tag || "Carrier Free",
      ),
    )
    imageWrapper.append(imageElement, carrierFreeBadge)
  } else {
    imageWrapper.append(imageElement)
  }

  // Title Element
  const titleElement = p({ class: "p-3 text-black text-xl font-normal leading-7" }, item.title)

  // Content Wrapper for Title and Description
  const contentWrapper = div({
    class: "flex flex-col justify-start items-start w-full flex-grow",
  })

  contentWrapper.append(titleElement)

  // Pricing Details - This will stay at the bottom
  const pricingDetails = div(
    {
      class: "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
    },
    div(
      {
        class: "text-right justify-start text-black text-2xl font-normal leading-loose",
      },
      `$${item?.raw?.price || "1,000.00"}`,
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
          item?.raw?.uom || "1/Bundle",
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
          item?.raw?.minQty || "50",
        ),
      ),
    ),
  )

  // Action Buttons (e.g., Buy, Quote)
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

  // View Details Button - Always at the bottom
  const viewDetailsButton = div(
    { class: "self-stretch p-3 flex justify-start items-center" },
    div({ class: "text-violet-600 text-base font-bold leading-snug" }, "View Details →"),
  )

  // Append all elements into the card
  card.append(imageWrapper, contentWrapper, pricingDetails, actionButtons, viewDetailsButton)

  return card
}

/**
 * Function to render filter facet
 * @param {String} title
 * @param {Array} items
 * @param {String} filterType
 * @returns {HTMLElement}
 */
function renderFacet(title, items, filterType) {
  const facetContainer = div({
    class: "button bg-background border border-neutral rounded-lg p-4 mt-4",
  })

  // Facet header
  facetContainer.append(
    button(
      {
        class: "btn-text-transparent flex font-bold justify-between w-full py-1 px-2 text-lg rounded-none",
        title: "Collapse the facet",
        "aria-expanded": "true",
        onclick: (e) => {
          e.preventDefault()
          const contents = facetContainer.querySelector(".contents")
          const icon = facetContainer.querySelector(".icon")

          icon.classList.toggle("icon-dash")
          icon.classList.toggle("icon-plus")
          contents.classList.toggle("hidden")

          decorateIcons(facetContainer)
        },
      },
      div({ class: "label-button" }, title),
      span({ class: "icon icon-dash" }),
    ),
  )

  // Clear filter button (only show if filters are active)
  const activeFilters = filterType === "workflowname" ? workflowName : opco
  if (activeFilters.size > 0) {
    facetContainer.append(
      button(
        {
          class: "btn-outline-secondary !border-gray-300 p-0.5",
          "aria-pressed": true,
          onclick: (e) => {
            clearFilters(e, filterType === "workflowname", filterType === "opco")
          },
          "aria-label": "Clear Filters",
        },
        span({ class: "icon icon-close w-4 h-4 align-middle" }),
        span({ class: "text-xs" }, "Clear Filter"),
      ),
    )
  }

  // Facet items
  const facetList = div({ class: "contents mt-3" })
  const itemsList = ul({ class: "parents m-1 w-full" })

  items.forEach((item) => {
    const isActive = activeFilters.has(item.value)
    const itemEl = li(
      { class: "content" },
      button(
        {
          class: `${filterType} p-1 text-left hover:bg-gray-100 flex flex-row items-center gap-2`,
          "aria-pressed": isActive,
          "data-type": filterType,
          "data-value": item.value,
          onclick: handleFilterClick,
        },
        filterType === "opco" ? span({ class: `icon ${isActive ? "icon-check-square" : "icon-square"} pr-2` }) : null,
        span({ class: "text-sm truncate w-[15rem] block" }, item.value),
        ` (${item.count})`,
      ),
    )

    itemsList.append(itemEl)
  })

  facetList.append(itemsList)
  facetContainer.append(facetList)

  decorateIcons(facetContainer)
  return facetContainer
}

/**
 * Function to render active filters
 * @returns {HTMLElement}
 */
function renderActiveFilters() {
  if (workflowName.size === 0 && opco.size === 0) {
    return null
  }

  const filterContainer = div(
    { class: "container text-sm flex h-24 md:h-6 items-start mb-4" },
    span({ class: "label font-bold py-[0.625rem] pl-0 pr-2" }, "Filters:"),
    div(
      { class: "breadcrumb-list-container relative grow" },
      ul(
        { class: "breadcrumb-list flex gap-1 flex-col md:flex-row absolute w-full" },
        li(
          button(
            {
              class: "btn-outline-secondary rounded-full !border-gray-300 px-2 py-1",
              "aria-pressed": true,
              onclick: (e) => {
                clearFilters(e, true, true)
              },
              "aria-label": "Clear All Filters",
            },
            span("Clear"),
            span({ class: "icon icon-close w-4 h-4 align-middle !fill-current" }),
          ),
        ),
      ),
    ),
  )

  const breadcrumbList = filterContainer.querySelector(".breadcrumb-list")

  // Add workflow filter breadcrumb
  if (workflowName.size > 0) {
    breadcrumbList.append(
      li(
        { class: "breadcrumb" },
        button(
          {
            class: "btn-outline-secondary rounded-full !border-gray-300 px-2 py-1 text-sm truncate w-64 block",
            "aria-pressed": true,
            onclick: (e) => {
              clearFilters(e, true, false)
            },
            title: `Process Step: ${[...workflowName].join(" / ")}`,
            "aria-label": `Remove inclusion filter on Process Step: ${[...workflowName].join(" / ")}`,
          },
          span({ class: "breadcrumb-label" }, "Process Step"),
          span({ class: "breadcrumb-value" }, `: ${[...workflowName].join(" / ")}`),
          span({ class: "icon icon-close w-4 h-4 align-middle" }),
        ),
      ),
    )
  }

  // Add opco filter breadcrumb
  if (opco.size > 0) {
    breadcrumbList.append(
      li(
        { class: "breadcrumb" },
        button(
          {
            class: "btn-outline-secondary rounded-full !border-gray-300 px-2 py-1 text-sm truncate w-64 block",
            "aria-pressed": true,
            onclick: (e) => {
              clearFilters(e, false, true)
            },
            title: `Brand: ${[...opco].join(", ")}`,
            "aria-label": `Remove inclusion filter on Brand: ${[...opco].join(", ")}`,
          },
          span({ class: "breadcrumb-label" }, "Brand"),
          span({ class: "breadcrumb-value" }, `: ${[...opco].join(", ")}`),
          span({ class: "icon icon-close w-4 h-4 align-middle" }),
        ),
      ),
    )
  }

  decorateIcons(filterContainer)
  return filterContainer
}

/**
 * Function to render pagination
 * @param {Number} totalCount
 * @returns {HTMLElement}
 */
function renderPagination(totalCount) {
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  if (totalPages <= 1) {
    return null
  }

  const paginationContainer = div({
    class: "pagination-container flex justify-center items-center gap-2 mt-8 w-full",
  })

  const paginationWrapper = div({
    class: "inline-flex w-full items-center justify-between",
  })

  // Previous button
  const prevButton = div(
    {
      class: `flex items-center gap-1 cursor-pointer ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-violet-600 hover:underline"}`,
      onclick: currentPage > 1 ? (e) => handlePaginationClick(e, currentPage - 1) : null,
    },
    div(
      { class: "w-5 h-5 relative overflow-hidden" },
      span({
        class: `icon icon-arrow-left w-6 h-6 absolute fill-current ${currentPage === 1 ? "text-gray-400" : "text-violet-600"} [&_svg>use]:stroke-current`,
      }),
    ),
    span({ class: `${currentPage === 1 ? "text-gray-400" : "text-violet-600"}` }, "Previous"),
  )

  // Page numbers
  const pageNumbersContainer = div({
    class: "flex items-center justify-center gap-1",
  })

  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  // First page
  if (startPage > 1) {
    const firstPage = div(
      {
        class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === 1 ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        onclick: (e) => handlePaginationClick(e, 1),
      },
      "1",
    )
    pageNumbersContainer.append(firstPage)

    if (startPage > 2) {
      pageNumbersContainer.append(div({ class: "w-8 h-8 flex items-center justify-center" }, "..."))
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = div(
      {
        class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === i ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        onclick: (e) => handlePaginationClick(e, i),
      },
      i.toString(),
    )
    pageNumbersContainer.append(pageNumber)
  }

  // Last page
  if (endPage < totalPages - 1) {
    pageNumbersContainer.append(div({ class: "w-8 h-8 flex items-center justify-center" }, "..."))
  }

  if (endPage < totalPages) {
    const lastPage = div(
      {
        class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === totalPages ? "bg-violet-600 text-white" : "hover:bg-gray-100"}`,
        onclick: (e) => handlePaginationClick(e, totalPages),
      },
      totalPages.toString(),
    )
    pageNumbersContainer.append(lastPage)
  }

  // Next button
  const nextButton = div(
    {
      class: `flex mr-2 items-center cursor-pointer ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-violet-600 hover:underline"}`,
      onclick: currentPage < totalPages ? (e) => handlePaginationClick(e, currentPage + 1) : null,
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

  paginationWrapper.append(prevButton, pageNumbersContainer, nextButton)
  paginationContainer.append(paginationWrapper)

  decorateIcons(paginationContainer)
  return paginationContainer
}

/**
 * Function to render the product grid with filters
 * @param {HTMLElement} container
 */
async function renderProductGrid(container) {
  // Show loading state
  container.innerHTML = ""
  const loadingElement = div(
    {
      class: "w-full text-center py-8",
    },
    "Loading products...",
  )
  container.append(loadingElement)

  // Get filter params from URL or state
  const params = {}
  if (workflowName.size > 0) params.workflowname = [...workflowName].join(",")
  if (opco.size > 0) params.opco = [...opco].join(",")
  params.page = currentPage
  params.limit = ITEMS_PER_PAGE

  try {
    // Fetch products with filters
    const productData = await getProductsForCategories(params)
    const products = productData?.results || []
    const totalCount = productData?.totalCount || 0

    // Clear loading state
    container.innerHTML = ""

    // Create layout wrapper
    const layoutWrapper = div({
      class: "w-full flex flex-col lg:flex-row gap-8 items-start",
    })

    // Create filter sidebar
    const filterWrapper = div({
      class: "w-72 p-5 inline-flex flex-col justify-start items-start gap-3",
    })

    // Filter header
    const filterHeader = div(
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

    filterWrapper.append(filterHeader)

    // Process Step facet
    if (productData?.facets) {
      const workflowFacet = productData.facets.find((f) => f.facetId === "workflowname")
      if (workflowFacet && workflowFacet.values.length > 0) {
        const facetItems = workflowFacet.values.map((v) => ({
          value: v.value,
          count: v.numberOfResults,
        }))
        filterWrapper.append(renderFacet("Process Step", facetItems, "workflowname"))
      }

      // Brand facet
      const opcoFacet = productData.facets.find((f) => f.facetId === "opco")
      if (opcoFacet && opcoFacet.values.length > 0) {
        const facetItems = opcoFacet.values.map((v) => ({
          value: v.value,
          count: v.numberOfResults,
        }))
        filterWrapper.append(renderFacet("Brand", facetItems, "opco"))
      }
    }

    // Create content wrapper
    const contentWrapper = div({
      class: "flex-1 flex flex-col gap-4",
    })

    // Create header with product count
    const headerWrapper = div({
      class: "w-full flex justify-between items-center mb-4",
    })

    const productCount = div(
      {
        class: "text-black text-base font-medium",
      },
      `${totalCount} Products Available here are`,
    )

    headerWrapper.append(productCount)
    contentWrapper.append(headerWrapper)

    // Add active filters
    const activeFiltersElement = renderActiveFilters()
    if (activeFiltersElement) {
      contentWrapper.append(activeFiltersElement)
    }

    // Create product grid
    const productsWrapper = div({
      class: "w-full flex flex-wrap gap-5 justify-start",
    })

    // Calculate pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCount)

    // Render products
    if (products.length > 0) {
      products.forEach((product) => {
        productsWrapper.append(renderGridCard(product))
      })
    } else {
      productsWrapper.append(
        div(
          {
            class: "w-full text-center py-8 text-gray-500",
          },
          "No products found matching your filters.",
        ),
      )
    }

    contentWrapper.append(productsWrapper)

    // Add pagination
    const paginationElement = renderPagination(totalCount)
    if (paginationElement) {
      contentWrapper.append(paginationElement)
    }

    // Append all components to layout wrapper
    layoutWrapper.append(filterWrapper, contentWrapper)
    container.append(layoutWrapper)

    // Decorate icons
    decorateIcons(container)
  } catch (error) {
    console.error("Error rendering product grid:", error)
    container.innerHTML = ""
    container.append(
      div(
        {
          class: "w-full text-center py-8 text-red-500",
        },
        "Error loading products. Please try again later.",
      ),
    )
  }
}

/**
 * Initialize the product grid
 * @param {HTMLElement} container
 */
function initProductGrid(container) {
  // Initialize filter state from URL hash
  const params = isEmptyObject(hashParams()) ? {} : hashParams()

  if (params.workflowname) {
    workflowName = new Set(getArrayFromHashParam(params.workflowname))
  }

  if (params.opco) {
    opco = new Set(getArrayFromHashParam(params.opco))
  }

  if (params.page) {
    currentPage = Number.parseInt(params.page, 10) || 1
  }

  // Render the product grid
  renderProductGrid(container)
}

export { renderGridCard, renderProductGrid, initProductGrid }
export default renderGridCard

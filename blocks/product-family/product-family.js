/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
import { decorateIcons } from "../../scripts/lib-franklin.js"
import { div, p, span, button, input, a, img } from "../../scripts/dom-builder.js"
import { getProductsForCategories, getCommerceBase } from "../../scripts/commerce.js"
import { createModal } from "../../scripts/common-utils.js"
import { buildItemListSchema } from "../../scripts/schema.js"

const baseURL = getCommerceBase()

// Skeleton loader from provided code
const productSkeleton = div(
  { class: "coveo-skeleton flex flex-col w-full lg:flex-row grid-rows-1 lg:grid-cols-5 gap-x-10 gap-y-4" },
  div(
    { class: "col-span-1 border shadow rounded-lg w-full p-4 max-w-sm w-full" },
    div(
      { class: "flex flex-col gap-y-4 animate-pulse" },
      div({ class: "w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40" }),
      div({ class: "w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40" }),
      div({ class: "w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20" }),
      div({ class: "w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40" }),
    ),
  ),
  div(
    { class: "col-span-4 w-full" },
    div({ class: "max-w-xs bg-neutral-300 rounded-md p-4 animate-pulse mb-4" }),
    div(
      { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" },
      div(
        { class: "flex flex-col gap-y-2 animate-pulse" },
        div({ class: "h-72 rounded bg-danaheratomicgrey-200 opacity-500" }),
        div({ class: "w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40" }),
        div(
          { class: "space-y-1" },
          p({ class: "w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40" }),
          p({ class: "w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20" }),
          p({ class: "w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40" }),
        ),
        div(
          { class: "grid grid-cols-3 gap-4" },
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-2" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-2" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
        ),
      ),
      div(
        { class: "flex flex-col gap-y-2 animate-pulse" },
        div({ class: "h-72 rounded bg-danaheratomicgrey-200 opacity-500" }),
        div({ class: "w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40" }),
        div(
          { class: "space-y-1" },
          p({ class: "w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40" }),
          p({ class: "w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20" }),
          p({ class: "w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40" }),
        ),
        div(
          { class: "grid grid-cols-3 gap-4" },
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-2" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-2" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
        ),
      ),
      div(
        { class: "flex flex-col gap-y-2 animate-pulse" },
        div({ class: "h-72 rounded bg-danaheratomicgrey-200 opacity-500" }),
        div({ class: "w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40" }),
        div(
          { class: "space-y-1" },
          p({ class: "w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40" }),
          p({ class: "w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20" }),
          p({ class: "w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40" }),
        ),
        div(
          { class: "grid grid-cols-3 gap-4" },
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-2" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-2" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
          div({ class: "h-2 bg-danaheratomicgrey-200 rounded col-span-1" }),
        ),
      ),
    ),
  ),
)

async function fetchProducts(params = {}) {
  try {
    console.log("Fetching products with params:", params)
    const productCategories = await getProductsForCategories(params)
    console.log("Fetched products:", productCategories.results)
    console.log("Fetched facets:", productCategories.facets)
    return productCategories
  } catch (error) {
    console.error("Error fetching products:", error)
    return { results: [], facets: [], totalCount: 0 }
  }
}

/**
 * Function to get hash params
 * @returns {Object} hash params
 * */
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
 * Function to get array from url hash params
 * @returns {Object} hash params
 * */
function getArrayFromHashParam(param) {
  // eslint-disable-next-line no-nested-ternary
  return param ? (param.includes(",") ? param.split(",") : [param]) : []
}

/**
 * Function to check if object is empty
 * @param {Object} obj
 * */
function isEmptyObject(obj) {
  return obj && Object.keys(obj)?.at(0) === ""
}

// Initialize filter state from URL hash
let workflowName = new Set(getArrayFromHashParam(hashParams().workflowname))
const opco = new Set(getArrayFromHashParam(hashParams().opco))

/**
 * Function to get last query from workflowName
 * */
const lastQuery = () => [...workflowName][workflowName.size - 1]

/**
 * Function to clear values after current value
 * @param {Set} set
 * @param {String} currentValue
 * */
function clearValuesAfterCurrent(set, currentValue) {
  const iterator = set.values()
  let next = iterator.next()
  while (!next.done) {
    if (next.value === currentValue) {
      while (!next.done) {
        set.delete(next.value)
        next = iterator.next()
      }
      break
    }
    next = iterator.next()
  }
}

/**
 * Function to update opco
 * @param {String} value
 * @param {Boolean} ariaPressed
 * */
const updateOpco = (value, ariaPressed) => {
  if (!ariaPressed) opco.add(value)
  else opco.delete(value)
  console.log("Updated opco:", [...opco])
}

/**
 * Function to update workflow name
 * @param {String} value
 * @param {Boolean} ariaPressed
 * */
const updateWorkflowName = (value, ariaPressed) => {
  if (value === "automated-cell-imaging-systems") {
    // Always add this specific filter regardless of current state
    workflowName.clear()
    workflowName.add(value)
  } else if (!ariaPressed) {
    clearValuesAfterCurrent(workflowName, value)
    workflowName.add(value)
  } else workflowName.clear()
  console.log("Updated workflowName:", [...workflowName])
}

/**
 * Function to get filter params from current state
 */
function getFilterParams() {
  const params = {}
  if (workflowName.size > 0) params.workflowname = [...workflowName].join(",")
  if (opco.size > 0) params.opco = [...opco].join(",")
  return params
}

/**
 * Function to generate quote modal content
 */
function quoteModalContent() {
  const modalContent = div({})
  modalContent.innerHTML = `
    <dialog id="custom-modal" class="w-full max-w-xl px-6 py-4 text-left align-middle relative transition-all transform" open>
      <div>
        <div class="justify-between flex item-center mb-2 text-2xl font-bold leading-6 text-gray-900">
          <div class="modal-title flex items-center gap-2">
            <span class="icon icon-chat-bubble flex items-center justify-center flex-shrink-0 mx-auto bg-gray-200 rounded-full w-10 h-10 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 text-danaherblue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path>
              </svg>
            </span>
            Request for Quote
          </div>
        </div>
        <div>
          <div class="mt-3">
            <label class="text-sm text-gray-500">Describe your problem or desired solution to add to your quote cart and one of our experts will assist in find the best solution for you</label>
          </div>
          <div class="mt-3">
            <textarea class="quote-textarea block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gray-300 focus:ring-gray-300 sm:text-sm" name="quote" rows="4"></textarea>
          </div>
          <div class="flex justify-between gap-4 mt-4 quote sm:flex-row flex-col">
            <button class="p-2 text-sm text-danaherpurple-500 bg-white border-2 border-danaherpurple-500 hover:text-white hover:bg-danaherpurple-800 rounded-full" name="continue">Add and continue browsing</button>
            <button class="py-2 text-sm btn btn-primary-purple rounded-full" name="submit">Add and complete request</button>
          </div>
          <div class="p-4 mt-4 rounded-md bg-red-50 hidden quote-error">
            <div class="flex gap-2">
              <span class="icon icon-xcircle w-4 h-4 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" class="w-4 h-4 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              <p class="text-xs font-medium text-red-600">Please enter your problem or desired solution.</p>
            </div>
          </div>
          <div class="flex flex-col p-4 mt-4 rounded-md bg-danaherlightblue-500 bg-opacity-10">
            <p class="text-xs font-medium text-gray-700 m-0">Quote Tip.</p>
            <p class="font-sans text-xs font-normal text-gray-700">Be as detailed as possible so we can best serve your request.</p>
          </div>
        </div>
      </div>
    </dialog>`
  return modalContent
}

/**
 * Function to handle filter button click
 */
function filterButtonClick(e) {
  e.preventDefault()
  const buttonEl = e.target.closest("button")
  if (!buttonEl) {
    console.warn("No button element found for filter click")
    return
  }

  console.log("Filter clicked:", buttonEl.getAttribute("part"), "Pressed:", buttonEl.getAttribute("aria-pressed"))

  const icon = buttonEl.querySelector(".checkbox-icon")
  icon?.classList.toggle("icon-square")
  icon?.classList.toggle("icon-check-square")
  decorateIcons(buttonEl)

  // Special handling for automated-cell-imaging-systems filter
  const filterValue = buttonEl.getAttribute("part")
  const isWorkflowName = buttonEl.dataset.type === "workflowname"
  const ariaPressed = buttonEl.getAttribute("aria-pressed") === "true"

  if (filterValue === "automated-cell-imaging-systems") {
    // Set this specific filter value in workflowName
    workflowName = new Set(["automated-cell-imaging-systems"])

    // Update button state to selected
    buttonEl.setAttribute("aria-pressed", "true")

    // Update URL hash and refresh products
    history.replaceState({}, "", `#workflowname=automated-cell-imaging-systems`)
    updateProductDisplay()
    return
  }

  // Regular handling for other filters
  if (isWorkflowName) updateWorkflowName(filterValue, ariaPressed)
  else updateOpco(filterValue, ariaPressed)

  buttonEl.setAttribute("aria-pressed", ariaPressed ? "false" : "true")

  // Update URL hash
  const params = getFilterParams()
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&")

  history.replaceState({}, "", queryString ? `#${queryString}` : "#")
  updateProductDisplay()
}

/**
 * Function to toggle facet on button click
 */
function facetButtonClick(e) {
  e.preventDefault()
  const button = e.target.closest("button")
  const isExpanded = button.getAttribute("aria-expanded") === "true"
  button.setAttribute("aria-expanded", !isExpanded)
  const parentElement = button.closest("div.facet")
  const contents = parentElement.querySelector(".facet-contents")
  const searchWrapper = parentElement.querySelector(".search-wrapper")
  const icon = button.querySelector(".icon")

  icon.classList.toggle("icon-chevron-down", isExpanded)
  icon.classList.toggle("icon-chevron-up", !isExpanded)
  contents.classList.toggle("hidden", isExpanded)
  searchWrapper?.classList.toggle("hidden", isExpanded)
  decorateIcons(parentElement)
}

/**
 * Function to render a facet item (for opco)
 */
const facetItem = (filter, valueObj) => {
  const isSelected = filter.facetId === "workflowname" ? workflowName.has(valueObj.value) : opco.has(valueObj.value)
  const liEl = div(
    {
      class: "inline-flex justify-start items-center gap-2",
    },
    button(
      {
        class: "p-1 text-left hover:bg-gray-100 flex flex-row items-center gap-2 w-full",
        "aria-pressed": isSelected,
        "data-type": filter.facetId,
        part: valueObj.value,
        onclick: filterButtonClick,
      },
      span({
        class: `checkbox-icon icon ${isSelected ? "icon-check-square" : "icon-square"} pr-2`,
      }),
      div(
        {
          class: "justify-start text-black text-sm font-normal leading-tight",
        },
        valueObj.value,
      ),
      div(
        {
          class: "text-gray-500 text-sm font-normal",
        },
        ` (${valueObj.numberOfResults})`,
      ),
    ),
  )
  return liEl
}

/**
 * Function to iterate through hierarchical facet children (for workflowname)
 */
function iterateChildren(filter, node) {
  const path = node.path?.join(",") || node.value
  const isSelected = workflowName.has(node.value)
  const liEl = div(
    { class: "inline-flex flex-col justify-start items-start gap-2" },
    div(
      {
        class: "inline-flex justify-start items-center gap-2 w-full",
      },
      button(
        {
          class: `${filter.facetId} p-1 text-left hover:bg-gray-100 flex flex-row items-center gap-2 w-full`,
          "aria-pressed": isSelected,
          "data-type": filter.facetId,
          "data-path": path,
          part: node.value,
          onclick: filterButtonClick,
        },
        span({
          class: `checkbox-icon icon ${isSelected ? "icon-check-square" : "icon-square"} pr-2`,
        }),
        div(
          {
            class: "justify-start text-black text-sm font-normal leading-tight",
          },
          node.value,
        ),
        div(
          {
            class: "text-gray-500 text-sm font-normal",
          },
          ` (${node.numberOfResults})`,
        ),
      ),
    ),
  )

  if (node.children && node.children.length > 0) {
    const ulSubParent = div({ class: "ml-4 flex flex-col justify-start items-start gap-2" })
    node.children.forEach((child) => {
      ulSubParent.appendChild(iterateChildren(filter, child))
    })
    liEl.appendChild(ulSubParent)
  }

  const isActive = lastQuery() === node.value
  if (isActive) {
    liEl.classList.add("font-bold")
  }

  return liEl
}

/**
 * Function to render a facet
 */
const renderFacet = (filter, isFirst = false) => {
  if (!filter.values || filter.values.length <= 1) {
    console.warn(`Skipping facet ${filter.facetId}: insufficient values`)
    return null
  }

  const facetDiv = div({
    class: "facet self-stretch p-3 bg-white border-t border-gray-300 flex flex-col justify-start items-start gap-3",
  })

  // Facet header
  const header = button(
    {
      class: "facet-header-btn self-stretch pr-3 pt-2 pb-2.5 inline-flex justify-between items-start",
      "aria-expanded": isFirst ? "true" : "false",
      onclick: facetButtonClick,
    },
    div(
      {
        class: "flex-1 justify-start text-black text-base font-semibold font-['Inter'] leading-normal",
      },
      filter.label || (filter.facetId === "opco" ? "Brand" : "Process Step"),
    ),
    div(
      { class: "w-4 h-4 relative mb-2" },
      span({
        class: `icon ${isFirst ? "icon-chevron-up" : "icon-chevron-down"} [&_svg>use]:stroke-danaherpurple-500 ml-1`,
      }),
    ),
    div({ class: "text-right justify-start text-gray-400 text-base font-semibold font-['Inter'] leading-normal" }, "–"),
  )

  // Facet contents
  const contents = div({
    class: `facet-contents flex flex-col justify-start items-start gap-4 ${isFirst ? "" : "hidden"} min-h-[100px]`,
  })

  // Add search bar for workflowname
  if (filter.facetId === "workflowname") {
    const searchBar = div(
      {
        class: `search-wrapper self-stretch h-8 px-3 py-1.5 bg-gray-100 outline outline-[0.50px] outline-gray-300 inline-flex justify-start items-center gap-1.5 ${isFirst ? "" : "hidden"}`,
      },
      div(
        {
          class: "flex justify-start items-center gap-1.5",
        },
        span({
          class: "icon icon-search w-4 h-4 text-gray-400",
        }),
        input({
          class:
            "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-tight bg-transparent outline-none flex-1",
          type: "text",
          placeholder: "Search",
          "aria-label": `Search for values in the ${filter.label || filter.facetId} facet`,
        }),
      ),
    )
    decorateIcons(searchBar)
    contents.append(searchBar)
  }

  // Render facet items
  if (filter.facetId === "workflowname") {
    filter.values.forEach((valueObj) => {
      contents.append(iterateChildren(filter, valueObj))
    })
  } else {
    filter.values.forEach((valueObj) => {
      contents.append(facetItem(filter, valueObj))
    })
  }

  facetDiv.append(header, contents)
  return facetDiv
}

/**
 * Function to render a grid card
 */
function renderProductGridCard(item) {
  const image = item.raw.images ? `${item.raw.images[0]}?$danaher-mobile$&fmt=webp&wid=300` : ""
  const card = div({
    class:
      "w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl",
  })

  const link = a(
    { href: item.clickUri, target: "_self" },
    div(
      { class: "result-root display-grid density-compact image-small" },
      div(
        { class: "relative w-full h-full flex flex-col border rounded-md cursor-pointer transition z-10" },
        div(
          img({
            class: "category-image mb-2 h-48 w-full object-contain",
            src: image,
            alt: item.title,
            loading: "lazy",
          }),
        ),
        div(
          a(
            {
              class: "!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14",
              href: item.clickUri,
              target: "_self",
            },
            item.title,
          ),
          div(
            { class: "description !px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20 py-4" },
            item.raw.description || "",
          ),
        ),
        div(
          { class: "inline-flex items-center w-full px-6 py-5 space-x-4 bg-gray-100" },
          span(
            { class: "btn-primary-purple border-8 px-2 !rounded-full", "aria-label": "View Products" },
            "View Products",
          ),
          div(
            {
              class:
                "quoteModal cursor-pointer px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
            },
            span({ class: "text-violet-600 text-base font-normal leading-snug" }, "Quote"),
          ),
        ),
      ),
    ),
  )

  card.append(link)

  // Attach quote modal event listener
  card.querySelectorAll(".quoteModal").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Quote button clicked for product:", item.title)
      createModal(quoteModalContent(), false, true)
    })
  })

  return card
}

/**
 * Function to render a list card
 */
function renderProductListCard(item) {
  const image = item.raw.images ? `${item.raw.images[0]}?$danaher-mobile$&fmt=webp&wid=300` : ""
  const card = div({
    class: "w-full min-h-24 mb-4 bg-white outline outline-1 outline-gray-300 flex flex-row justify-start items-start",
  })

  const leftSide = div({
    class: "flex-none w-64 p-4",
  })

  const imageElement = img({
    class: "w-full h-32 object-contain mb-2",
    src: image,
    alt: item.title,
    loading: "lazy",
  })

  leftSide.append(imageElement)

  const middleSection = div({
    class: "flex-grow p-4",
  })

  const titleElement = p(
    { class: "text-danahergray-900 text-lg font-semibold line-clamp-3 break-words h-14" },
    item.title,
  )
  const descriptionElement = p(
    { class: "text-gray-900 text-sm break-words line-clamp-4 h-20 py-4" },
    item.raw.description || "",
  )

  middleSection.append(titleElement, descriptionElement)

  const rightSide = div({
    class: "flex-none w-64 p-4 bg-gray-50",
  })

  const actionButtons = div(
    { class: "flex flex-col gap-2" },
    div(
      { class: "flex items-center gap-2 mb-2" },
      a(
        {
          href: item.clickUri,
          class:
            "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        span({ class: "text-white text-base font-normal leading-snug" }, "View Products"),
      ),
    ),
    div(
      {
        class:
          "quoteModal cursor-pointer w-full px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
      },
      span({ class: "text-violet-600 text-base font-normal leading-snug" }, "Quote"),
    ),
  )

  rightSide.append(actionButtons)

  card.append(leftSide, middleSection, rightSide)

  // Attach quote modal event listener
  card.querySelectorAll(".quoteModal").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Quote button clicked for product:", item.title)
      createModal(quoteModalContent(), false, true)
    })
  })

  return card
}

// Constants for pagination
const GRID_ITEMS_PER_PAGE = 21 // 7 rows of 3 items
const LIST_ITEMS_PER_PAGE = 7
let currentPage = 1
let isGridView = true // Default to grid view

/**
 * Function to render pagination
 */
function renderPagination(totalProducts, paginationContainer) {
  paginationContainer.innerHTML = ""

  const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE
  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  if (totalPages <= 1 || (isGridView && totalProducts <= GRID_ITEMS_PER_PAGE)) {
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

// Global variables for DOM elements
let productContainer
let productCount
let paginationContainer
let listBtn
let gridBtn

/**
 * Function to update product display based on current view and page
 */
async function updateProductDisplay() {
  productContainer.innerHTML = ""
  productContainer.append(productSkeleton.cloneNode(true))

  // Use current filter state
  const params = getFilterParams()

  const updatedResponse = await fetchProducts(params)
  productContainer.innerHTML = ""

  if (updatedResponse.totalCount > 0) {
    buildItemListSchema(updatedResponse.results, "product-family")
  }

  const updatedProducts = updatedResponse.results || []

  // Validate workflowname facet values
  const workflowFacet = updatedResponse.facets?.find((f) => f.facetId === "workflowname")
  const validWorkflows = workflowFacet?.values.map((v) => v.value) || []
  if (params.workflowname && !validWorkflows.includes(params.workflowname)) {
    console.warn(`Invalid workflowname: ${params.workflowname}. Valid options: ${validWorkflows.join(", ")}`)
  }

  console.log("Rendering products:", updatedProducts.length, "with params:", params)

  const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, updatedProducts.length)

  // Update product count
  productCount.textContent = `${updatedResponse.totalCount} Products Available`

  // Create wrapper for grid or list
  const productsWrapper = isGridView
    ? div({ class: "result-list grid grid-cols-1 lg:grid-cols-3 gap-6", part: "result-list" })
    : div({ class: "w-full flex flex-col gap-4" })

  // Handle no products case
  if (updatedProducts.length === 0) {
    let errorMessage = "No products match the selected filters. Please try different filters."
    if (params.workflowname && validWorkflows.length > 0) {
      errorMessage = `No products found for ${params.workflowname}. Try: ${validWorkflows.slice(0, 3).join(", ")}${validWorkflows.length > 3 ? "..." : ""}.`
    }
    const noProductsMessage = div({ class: "w-full text-center py-8 text-gray-600 text-lg" }, errorMessage)
    productsWrapper.append(noProductsMessage)
    productContainer.append(productsWrapper)
    paginationContainer.style.display = "none"
    return
  }

  // Get products for current page
  const productsToDisplay = updatedProducts.slice(startIndex, endIndex)

  // Render products based on current view
  productsToDisplay.forEach((item, index) => {
    console.log(`Rendering product ${index + 1}:`, item.title)
    if (isGridView) {
      productsWrapper.append(renderProductGridCard(item))
    } else {
      productsWrapper.append(renderProductListCard(item))
    }
  })

  productContainer.append(productsWrapper)
  renderPagination(updatedProducts.length, paginationContainer)

  console.log("Rendered products count:", productsToDisplay.length, "Total products:", updatedProducts.length)
}

/**
 * Function to decorate product list
 * @param {HTMLElement} block
 * */
export async function decorateProductList(block) {
  block.innerHTML = ""
  block.append(productSkeleton)

  // Initial load with no filters
  const productCategoriesResponse = await fetchProducts(isEmptyObject(hashParams()) ? {} : hashParams())
  block.removeChild(productSkeleton)

  block.classList.add(..."flex flex-col lg:flex-row w-full mx-auto gap-6 pt-10".split(" "))

  const facetDiv = div({ class: "max-w-sm w-full mx-auto" })
  const contentWrapper = div({ class: "max-w-5xl w-full mx-auto flex-1 flex flex-col gap-4" })

  block.append(facetDiv, contentWrapper)

  // Create filter sidebar with dynamic height
  const filterWrapper = div({
    class: "w-72 p-5 inline-flex flex-col justify-start items-start gap-3 min-h-fit",
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
      onclick: () => {
        const facetButtons = filterWrapper.querySelectorAll(".facet-header-btn")
        facetButtons.forEach((button) => {
          button.setAttribute("aria-expanded", "true")
          const parent = button.closest("div.facet")
          const contents = parent.querySelector(".facet-contents")
          const searchWrapper = parent.querySelector(".search-wrapper")
          const icon = button.querySelector(".icon")
          icon.classList.remove("icon-chevron-down")
          icon.classList.add("icon-chevron-up")
          contents.classList.remove("hidden")
          searchWrapper?.classList.remove("hidden")
          decorateIcons(parent)
        })
      },
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

  // Facet rendering
  const facetContainer = div({ class: "self-stretch flex flex-col justify-start items-start" })

  // Render facets dynamically
  const facets = productCategoriesResponse.facets || []
  facets.forEach((filter, index) => {
    const isFirst = index === 0
    const facetElement = renderFacet(filter, isFirst)
    if (facetElement) {
      facetContainer.append(facetElement)
    }
  })

  filterWrapper.append(header, expandAll, facetContainer)
  decorateIcons(filterWrapper)
  facetDiv.append(filterWrapper)

  // Create header with product count and view toggle
  const headerWrapper = div({
    class: "w-full flex justify-between items-center mb-4",
  })

  productCount = div(
    {
      class: "text-black text-base font-medium",
    },
    `${productCategoriesResponse.totalCount} Products Available`,
  )

  // Create view toggle
  const viewToggleWrapper = div({
    class: "flex items-center gap-2",
  })

  const viewModeGroup = div({ class: "flex justify-start items-center" })
  listBtn = div(
    {
      class:
        "px-3 py-2 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
    },
    div(
      { class: "w-5 h-5 relative overflow-hidden" },
      span({ class: "icon icon-view-list w-6 h-6 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600" }),
    ),
  )

  gridBtn = div(
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
  productContainer = div({
    class: "w-full",
  })
  contentWrapper.append(productContainer)

  // Create pagination container
  paginationContainer = div({
    class: "pagination-container flex justify-center items-center gap-2 mt-8 w-full",
  })
  contentWrapper.append(paginationContainer)

  // Event listeners for view toggle buttons
  listBtn.addEventListener("click", () => {
    if (isGridView) {
      isGridView = false
      currentPage = 1

      listBtn.classList.replace("bg-white", "bg-violet-600")
      listBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white")
      listBtn.querySelector(".icon").classList.replace("[&_svg>use]:stroke-gray-600", "[&_svg>use]:stroke-white")

      gridBtn.classList.replace("bg-violet-600", "bg-white")
      gridBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600")
      gridBtn.querySelector(".icon").classList.replace("[&_svg>use]:stroke-white", "[&_svg>use]:stroke-gray-600")

      updateProductDisplay()
    }
  })

  gridBtn.addEventListener("click", () => {
    if (!isGridView) {
      isGridView = true
      currentPage = 1

      gridBtn.classList.replace("bg-white", "bg-violet-600")
      gridBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white")
      gridBtn.querySelector(".icon").classList.replace("[&_svg>use]:stroke-gray-600", "[&_svg>use]:stroke-white")

      listBtn.classList.replace("bg-violet-600", "bg-white")
      listBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600")
      listBtn.querySelector(".icon").classList.replace("[&_svg>use]:stroke-white", "[&_svg>use]:stroke-gray-600")

      updateProductDisplay()
    }
  })

  // Initial display
  updateProductDisplay()
}

export default async function decorate(block) {
  decorateProductList(block)
}

/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  div, p, span, button, input,
} from '../../scripts/dom-builder.js';
import { getProductsForCategories } from '../../scripts/commerce.js';
import { buildItemListSchema } from '../../scripts/schema.js';
import renderProductGridCard from './gridData.js';
import renderProductListCard from './listData.js';

// Skeleton loader
const productSkeleton = div(
  { class: 'coveo-skeleton flex flex-col w-full lg:flex-row grid-rows-1 lg:grid-cols-5 gap-x-10 gap-y-4' },

  div(
    { class: 'col-span-4 w-full' },
    div({ class: 'max-w-xs bg-neutral-300 rounded-md p-4 animate-pulse mb-4' }),
    div(
      { class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
    ),
  ),
);

async function fetchProducts(params = {}) {
  try {
    const productCategories = await getProductsForCategories(params);

    // Ensure we always return a valid structure even if the API returns unexpected data
    return {
      results: productCategories?.results || [],
      facets: productCategories?.facets || [],
      totalCount: productCategories?.totalCount || 0,
    };
  } catch (error) {
    //  eslint-disable-next-line no-console
    console.error('Error fetching products:', error);
    return { results: [], facets: [], totalCount: 0 };
  }
}

/**
 * Function to get hash params
 * @returns {Object} hash params
 * */
const hashParams = () => {
  const hash = window.location.hash.substr(1);
  const params = {};

  hash.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
};

/**
 * Function to get array from url hash params
 * @returns {Object} hash params
 * */
function getArrayFromHashParam(param) {
  // eslint-disable-next-line no-nested-ternary
  return param ? (param.includes(',') ? param.split(',') : [param]) : [];
}

/**
 * Function to check if object is empty
 * @param {Object} obj
 * */
function isEmptyObject(obj) {
  return obj && Object.keys(obj)?.at(0) === '';
}

// Initialize filter state from URL hash
let workflowName = new Set(getArrayFromHashParam(hashParams().workflowname));
const opco = new Set(getArrayFromHashParam(hashParams().opco));

/**
 * Function to get last query from workflowName
 * */
const lastQuery = () => [...workflowName][workflowName.size - 1];

/**
 * Function to clear values after current value
 * @param {Set} set
 * @param {String} currentValue
 * */
function clearValuesAfterCurrent(set, currentValue) {
  const iterator = set.values();
  let next = iterator.next();
  while (!next.done) {
    if (next.value === currentValue) {
      while (!next.done) {
        set.delete(next.value);
        next = iterator.next();
      }
      break;
    }
    next = iterator.next();
  }
}

/**
 * Function to update opco
 * @param {String} value
 * @param {Boolean} ariaPressed
 * */
const updateOpco = (value, ariaPressed) => {
  if (!ariaPressed) opco.add(value);
  else opco.delete(value);
};

/**
 * Function to update workflow name
 * @param {String} value
 * @param {Boolean} ariaPressed
 * */
const updateWorkflowName = (value, ariaPressed) => {
  if (value === 'automated-cell-imaging-systems') {
    // Always add this specific filter regardless of current state
    workflowName.clear();
    workflowName.add(value);
  } else if (!ariaPressed) {
    clearValuesAfterCurrent(workflowName, value);
    workflowName.add(value);
  } else workflowName.clear();
};

/**
 * Function to get filter params from current state
 */
function getFilterParams() {
  const params = {};
  if (workflowName.size > 0) params.workflowname = [...workflowName].join(',');
  if (opco.size > 0) params.opco = [...opco].join(',');
  return params;
}

/**
 * Function to handle filter button click
 */
function filterButtonClick(e) {
  e.preventDefault();
  const buttonEl = e.target.closest('button');
  if (!buttonEl) {
    return;
  }

  const icon = buttonEl.querySelector('.checkbox-icon');
  icon?.classList.toggle('icon-square');
  icon?.classList.toggle('icon-check-square');
  decorateIcons(buttonEl);

  // Special handling for automated-cell-imaging-systems filter
  const filterValue = buttonEl.getAttribute('part');
  const isWorkflowName = buttonEl.dataset.type === 'workflowname';
  const ariaPressed = buttonEl.getAttribute('aria-pressed') === 'true';

  if (filterValue === 'automated-cell-imaging-systems') {
    // Set this specific filter value in workflowName
    workflowName = new Set(['automated-cell-imaging-systems']);

    // Update button state to selected
    buttonEl.setAttribute('aria-pressed', 'true');

    // Update URL hash and refresh products
    window.history.replaceState({}, '', '#workflowname=automated-cell-imaging-systems');
    updateProductDisplay();
    return;
  }

  // Regular handling for other filters
  if (isWorkflowName) updateWorkflowName(filterValue, ariaPressed);
  else updateOpco(filterValue, ariaPressed);

  buttonEl.setAttribute('aria-pressed', ariaPressed ? 'false' : 'true');

  // Update URL hash
  const params = getFilterParams();
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  window.history.replaceState({}, '', queryString ? `#${queryString}` : '#');
  updateProductDisplay();
}

/**
 * Function to toggle facet on button click
 */
function facetButtonClick(e) {
  e.preventDefault();
  const buttonFacet = e.target.closest('button');
  const isExpanded = buttonFacet.getAttribute('aria-expanded') === 'true';
  buttonFacet.setAttribute('aria-expanded', !isExpanded);
  const parentElement = buttonFacet.closest('div.facet');
  const contents = parentElement.querySelector('.facet-contents');
  const searchWrapper = parentElement.querySelector('.search-wrapper');
  const icon = buttonFacet.querySelector('.icon');

  icon.classList.toggle('icon-chevron-down', isExpanded);
  icon.classList.toggle('icon-chevron-up', !isExpanded);
  contents.classList.toggle('hidden', isExpanded);
  searchWrapper?.classList.toggle('hidden', isExpanded);
  decorateIcons(parentElement);
}

/**
 * Function to render a facet item (for opco)
 */
const facetItem = (filter, valueObj) => {
  const isSelected = filter.facetId === 'workflowname' ? workflowName.has(valueObj.value) : opco.has(valueObj.value);
  const liEl = div(
    {
      class: 'inline-flex justify-start items-center gap-2',
    },
    button(
      {
        class: 'p-1 text-left hover:bg-gray-100 flex flex-row items-center gap-2 w-full',
        'aria-pressed': isSelected,
        'data-type': filter.facetId,
        part: valueObj.value,
        onclick: filterButtonClick,
      },
      span({
        class: `checkbox-icon icon ${isSelected ? 'icon-check-square' : 'icon-square'} pr-2`,
      }),
      div(
        {
          class: 'justify-start text-black text-sm font-normal leading-tight',
        },
        valueObj.value,
      ),
      div(
        {
          class: 'text-gray-500 text-sm font-normal',
        },
        ` (${valueObj.numberOfResults})`,
      ),
    ),
  );
  return liEl;
};

/**
 * Function to iterate through hierarchical facet children (for workflowname)
 */
function iterateChildren(filter, node) {
  const path = node.path?.join(',') || node.value;
  const isSelected = workflowName.has(node.value);
  const liEl = div(
    { class: 'inline-flex flex-col justify-start items-start gap-2' },
    div(
      {
        class: 'inline-flex justify-start items-center gap-2 w-full',
      },
      button(
        {
          class: `${filter.facetId} p-1 text-left hover:bg-gray-100 flex flex-row items-center gap-2 w-full`,
          'aria-pressed': isSelected,
          'data-type': filter.facetId,
          'data-path': path,
          part: node.value,
          onclick: filterButtonClick,
        },
        span({
          class: `checkbox-icon icon ${isSelected ? 'icon-check-square' : 'icon-square'} pr-2`,
        }),
        div(
          {
            class: 'justify-start text-black text-sm font-normal leading-tight',
          },
          node.value,
        ),
        div(
          {
            class: 'text-gray-500 text-sm font-normal',
          },
          ` (${node.numberOfResults})`,
        ),
      ),
    ),
  );

  if (node.children && node.children.length > 0) {
    const ulSubParent = div({ class: 'ml-4 flex flex-col justify-start items-start gap-2' });
    node.children.forEach((child) => {
      ulSubParent.appendChild(iterateChildren(filter, child));
    });
    liEl.appendChild(ulSubParent);
  }

  const isActive = lastQuery() === node.value;
  if (isActive) {
    liEl.classList.add('font-bold');
  }

  return liEl;
}

/**
 * Function to render a facet
 */
const renderFacet = (filter, isFirst = false) => {
  if (!filter.values && filter.facetId !== 'opco') {
    return null;
  }

  const facetDiv = div({
    class: 'facet self-stretch p-3 bg-white border-t border-gray-300 flex flex-col justify-start items-start gap-3',
  });

  // Facet header
  const header = button(
    {
      class: 'facet-header-btn self-stretch pr-3 pt-2 pb-2.5 inline-flex justify-between items-start',
      'aria-expanded': isFirst ? 'true' : 'false',
      onclick: facetButtonClick,
    },
    div(
      {
        class: "flex-1 justify-start text-black text-base font-semibold font-['Inter'] leading-normal",
      },
      filter.label || (filter.facetId === 'opco' ? 'Brand' : 'Process Step'),
    ),
    div(
      { class: 'w-4 h-4 relative mb-2' },
      span({
        class: `icon ${isFirst ? 'icon-chevron-up' : 'icon-chevron-down'} [&_svg>use]:stroke-danaherpurple-500 ml-1`,
      }),
    ),
    div({ class: "text-right justify-start text-gray-400 text-base font-semibold font-['Inter'] leading-normal" }, '–'),
  );

  // Facet contents
  const contents = div({
    class: `facet-contents flex flex-col justify-start items-start gap-4 ${isFirst ? '' : 'hidden'} min-h-[100px]`,
  });

  // Add search bar for workflowname
  if (filter.facetId === 'workflowname') {
    const searchBar = div(
      {
        class: `search-wrapper self-stretch h-8 px-3 py-1.5 bg-gray-100 outline outline-[0.50px] outline-gray-300 inline-flex justify-start items-center gap-1.5 ${isFirst ? '' : 'hidden'}`,
      },
      div(
        {
          class: 'flex justify-start items-center gap-1.5',
        },
        span({
          class: 'icon icon-search w-4 h-4 text-gray-400',
        }),
        input({
          class:
            "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-tight bg-transparent outline-none flex-1",
          type: 'text',
          placeholder: 'Search',
          'aria-label': `Search for values in the ${filter.label || filter.facetId} facet`,
        }),
      ),
    );
    decorateIcons(searchBar);
    contents.append(searchBar);
  }

  // Render facet items or a fallback message
  if (filter.facetId === 'workflowname') {
    if (filter.values && filter.values.length > 0) {
      filter.values.forEach((valueObj) => {
        contents.append(iterateChildren(filter, valueObj));
      });
    } else {
      contents.append(div({ class: 'text-gray-500 text-sm' }, 'No process steps available'));
    }
  } else if (filter.facetId === 'opco') {
    if (filter.values && filter.values.length > 0) {
      filter.values.forEach((valueObj) => {
        contents.append(facetItem(filter, valueObj));
      });
    } else {
      contents.append(div({ class: 'text-gray-500 text-sm' }, 'No brands available'));
    }
  }

  facetDiv.append(header, contents);
  return facetDiv;
};

// Constants for pagination
const GRID_ITEMS_PER_PAGE = 21; // 7 rows of 3 items
const LIST_ITEMS_PER_PAGE = 7;
let currentPage = 1;
let isGridView = true; // Default to grid view

/**
 * Function to render pagination
 */
function renderPagination(totalProducts, paginationContainer) {
  paginationContainer.innerHTML = '';

  const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  if (totalPages <= 1 || (isGridView && totalProducts <= GRID_ITEMS_PER_PAGE)) {
    paginationContainer.style.display = 'none';
    return;
  }

  paginationContainer.style.display = 'flex';

  const paginationWrapper = div({
    class: 'inline-flex w-full items-center justify-between',
  });

  const prevButton = div(
    {
      class: `flex items-center gap-1 cursor-pointer ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-violet-600 hover:underline'}`,
    },
    div(
      { class: 'w-5 h-5 relative overflow-hidden' },
      span({
        class: `icon icon-arrow-left w-6 h-6 absolute fill-current ${currentPage === 1 ? 'text-gray-400' : 'text-violet-600'} [&_svg>use]:stroke-current`,
      }),
    ),
    span({ class: `${currentPage === 1 ? 'text-gray-400' : 'text-violet-600'}` }, 'Previous'),
  );
  decorateIcons(prevButton);
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      updateProductDisplay();
    }
  });

  const pageNumbersContainer = div({
    class: 'flex items-center justify-center gap-1',
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
        class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === 1 ? 'bg-violet-600 text-white' : 'hover:bg-gray-100'}`,
        'data-page': '1',
      },
      '1',
    );
    pageNumbersContainer.append(firstPage);
    if (startPage > 2) {
      pageNumbersContainer.append(div({ class: 'w-8 h-8 flex items-center justify-center' }, '...'));
    }
  }

  for (let i = startPage; i <= endPage; i += 1) {
    const pageNumber = div(
      {
        class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === i ? 'bg-violet-600 text-white' : 'hover:bg-gray-100'}`,
        'data-page': i,
      },
      i.toString(),
    );
    pageNumbersContainer.append(pageNumber);
  }

  // Use event delegation to handle page number clicks
  pageNumbersContainer.addEventListener('click', (e) => {
    const pageNumber = e.target.closest('div[data-page]');
    if (pageNumber) {
      const page = parseInt(pageNumber.getAttribute('data-page'), 10);
      if (page !== currentPage) {
        currentPage = page;
        updateProductDisplay();
      }
    }
  });

  if (endPage < totalPages - 1) {
    pageNumbersContainer.append(div({ class: 'w-8 h-8 flex items-center justify-center' }, '...'));
  }

  if (endPage < totalPages) {
    const lastPage = div(
      {
        class: `w-8 h-8 flex items-center justify-center rounded-md cursor-pointer ${currentPage === totalPages ? 'bg-violet-600 text-white' : 'hover:bg-gray-100'}`,
        'data-page': totalPages,
      },
      totalPages.toString(),
    );
    pageNumbersContainer.append(lastPage);
  }

  const nextButton = div(
    {
      class: `flex mr-2 items-center cursor-pointer ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-violet-600 hover:underline'}`,
    },
    span(
      {
        class: `${currentPage === totalPages ? 'text-gray-400' : 'text-violet-600'}`,
      },
      'Next',
    ),
    div(
      { class: 'w-5 h-5 relative overflow-hidden' },
      span({
        class: `icon icon-arrow-right w-5 h-6 absolute fill-current ${currentPage === totalPages ? 'text-gray-400' : 'text-violet-600'} [&_svg>use]:stroke-current`,
      }),
    ),
  );
  decorateIcons(nextButton);
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      updateProductDisplay();
    }
  });

  paginationWrapper.append(prevButton, pageNumbersContainer, nextButton);
  paginationContainer.append(paginationWrapper);
}

// Global variables for DOM elements
let productContainer;
let productCount;
let paginationContainer;
let listBtn;
let gridBtn;

/**
 * Function to update product display based on current view and page
 */
async function updateProductDisplay() {
  productContainer.innerHTML = '';
  productContainer.append(productSkeleton.cloneNode(true));

  // Use current filter state
  const params = getFilterParams();

  const updatedResponse = await fetchProducts(params);
  try {
    const skeleton = productContainer.querySelector('.coveo-skeleton');
    if (skeleton) {
      productContainer.removeChild(skeleton);
    }
  } catch (error) {
    //  eslint-disable-next-line no-console
    console.error('Error removing skeleton:', error);
  }

  if (updatedResponse.totalCount > 0) {
    try {
      buildItemListSchema(updatedResponse.results, 'product-family');
    } catch (error) {
      //  eslint-disable-next-line no-console
      console.error('Error building schema:', error);
    }
  }

  const updatedProducts = updatedResponse.results || [];

  // Validate workflowname facet values
  const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, updatedProducts.length);

  // Update product count
  productCount.textContent = `${updatedResponse.totalCount} Products Available`;

  // Create wrapper for grid or list
  const productsWrapper = isGridView
    ? div({ class: 'w-full flex flex-wrap gap-5 justify-start' })
    : div({ class: 'w-full flex flex-col gap-4' });

  // Handle no products case
  if (!updatedProducts || updatedProducts.length === 0) {
    let errorMessage = 'No products match the selected filters. Please try different filters.';
    if (params.workflowname) {
      errorMessage = `No products found for ${params.workflowname}. Please try a different filter.`;
    }
    const noProductsMessage = div({ class: 'w-full text-center py-8 text-gray-600 text-lg' }, errorMessage);
    productsWrapper.append(noProductsMessage);
    productContainer.append(productsWrapper);
    paginationContainer.style.display = 'none';
    return;
  }

  // Get products for current page
  const productsToDisplay = updatedProducts.slice(startIndex, endIndex);

  // Render products based on current view
  productsToDisplay.forEach((item) => {
    if (isGridView) {
      productsWrapper.append(renderProductGridCard(item));
    } else {
      productsWrapper.append(renderProductListCard(item));
    }
  });

  productContainer.append(productsWrapper);
  renderPagination(updatedProducts.length, paginationContainer);
}

/**
 * Function to decorate product list
 * @param {HTMLElement} block
 * */
export async function decorateProductList(block) {
  block.innerHTML = '';
  block.append(productSkeleton);

  // Initial load with no filters
  const productCategoriesResponse = await fetchProducts(isEmptyObject(hashParams())
    ? {} : hashParams());
  if (block.contains(productSkeleton)) {
    block.removeChild(productSkeleton);
  }

  block.classList.add(...'flex flex-col lg:flex-row w-full mx-auto gap-6 pt-10'.split(' '));

  const facetDiv = div({ id: 'filter', class: 'max-w-sm w-full mx-auto' });
  const contentWrapper = div({ class: 'max-w-5xl w-full mx-auto flex-1 flex flex-col gap-4' });

  block.append(facetDiv, contentWrapper);

  // Create filter sidebar with dynamic height
  const filterWrapper = div({
    class: 'w-72 p-5 inline-flex flex-col justify-start items-start gap-3 min-h-fit',
  });

  // Header Row
  const header = div(
    { class: 'self-stretch inline-flex justify-start items-center gap-4' },
    div(
      { class: 'w-12 h-12 relative bg-violet-50 rounded-3xl' },
      div(
        { class: 'w-6 h-6 left-[12px] top-[12px] absolute overflow-hidden' },
        span({
          class:
            'icon icon-adjustments w-6 h-6 absolute right-0 fill-current text-gray-400 chevron-down [&_svg>use]:stroke-gray-400',
        }),
      ),
    ),
    div(
      { class: 'flex-1 h-6 relative' },
      div(
        { class: 'w-64 h-6 left-0 top-0 absolute' },
        div(
          {
            class: 'w-64 left-0 top-[-6px] absolute justify-start text-gray-900 text-3xl font-normal leading-10',
          },
          'Filters',
        ),
      ),
    ),
  );

  const expandAll = div(
    {
      class: 'self-stretch h-5 p-3 inline-flex justify-end items-center gap-2.5',
      onclick: () => {
        const facetButtons = filterWrapper.querySelectorAll('.facet-header-btn');
        facetButtons.forEach((btnFilter) => {
          btnFilter.setAttribute('aria-expanded', 'true');
          const parent = btnFilter.closest('div.facet');
          const contents = parent.querySelector('.facet-contents');
          const searchWrapper = parent.querySelector('.search-wrapper');
          const icon = btnFilter.querySelector('.icon');
          icon.classList.remove('icon-chevron-down');
          icon.classList.add('icon-chevron-up');
          contents.classList.remove('hidden');
          searchWrapper?.classList.remove('hidden');
          decorateIcons(parent);
        });
      },
    },
    div(
      {
        class: 'text-right justify-start text-violet-600 text-base font-bold leading-snug',
      },
      'Expand All',
    ),
    div(
      { class: 'w-4 h-4 relative mb-2' },
      span({ class: 'icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 ml-1' }),
    ),
  );

  decorateIcons(expandAll);
  decorateIcons(header);

  // Facet rendering
  const facetContainer = div({ class: 'self-stretch flex flex-col justify-start items-start' });

  // Render facets dynamically
  const facets = productCategoriesResponse.facets || [];
  facets.forEach((filter, index) => {
    const isFirst = index === 0;
    const facetElement = renderFacet(filter, isFirst);
    if (facetElement) {
      facetContainer.append(facetElement);
    }
  });

  filterWrapper.append(header, expandAll, facetContainer);
  decorateIcons(filterWrapper);
  facetDiv.append(filterWrapper);

  // Create header with product count and view toggle
  const headerWrapper = div({
    class: 'w-full flex justify-between items-center mb-4 flex-wrap gap-2 min-w-0', // Added flex-wrap and min-w-0 to handle responsive layout
  });

  productCount = div(
    {
      class: 'text-black text-base font-medium',
    },
    `${productCategoriesResponse.totalCount} Products Available`,
  );
  const viewToggleWrapper = div({
    class: 'flex items-center gap-2 min-w-fit', // Added min-w-fit to prevent shrinking
  });
  const viewModeGroup = div({ class: 'flex justify-start items-center gap-0' }); // Removed gap to ensure buttons are flush
  listBtn = div(
    {
      class: [
        'px-3 py-2 bg-white',
        'rounded-tl-[20px] rounded-bl-[20px]',
        'outline outline-1 outline-offset-[-1px] outline-violet-600',
        'flex justify-center items-center',
        'overflow-visible cursor-pointer z-10',
      ].join(' '),
    },
    div(
      { class: 'w-5 h-5 flex justify-center items-center' },
      span({ class: 'icon icon-view-list w-6 h-6 fill-current text-gray-600 [&_svg>use]:stroke-gray-600' }),
    ),
  );

  gridBtn = div(
    {
      class: [
        'px-3 py-2 bg-violet-600',
        'rounded-tr-[20px] rounded-br-[20px]',
        'outline outline-1 outline-offset-[-1px] outline-violet-600',
        'flex justify-center items-center',
        'overflow-visible cursor-pointer z-10',
      ].join(' '),
    },
    div(
      { class: 'w-5 h-5 flex justify-center items-center' },
      span({ class: 'icon icon-view-grid w-6 h-6 fill-current text-white [&_svg>use]:stroke-white' }),
    ),
  );

  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);
  viewToggleWrapper.append(viewModeGroup);

  headerWrapper.append(productCount, viewToggleWrapper);
  contentWrapper.append(headerWrapper);

  // Create product grid/list container
  productContainer = div({
    class: 'w-full',
  });
  contentWrapper.append(productContainer);

  // Create pagination container
  paginationContainer = div({
    class: 'pagination-container flex justify-center items-center gap-2 mt-8 w-full',
  });
  contentWrapper.append(paginationContainer);

  // Event listeners for view toggle buttons
  listBtn.addEventListener('click', () => {
    if (isGridView) {
      isGridView = false;
      currentPage = 1;

      listBtn.classList.replace('bg-white', 'bg-violet-600');
      listBtn.querySelector('.icon').classList.replace('text-gray-600', 'text-white');
      listBtn.querySelector('.icon').classList.replace('[&_svg>use]:stroke-gray-600', '[&_svg>use]:stroke-white');

      gridBtn.classList.replace('bg-violet-600', 'bg-white');
      gridBtn.querySelector('.icon').classList.replace('text-white', 'text-gray-600');
      gridBtn.querySelector('.icon').classList.replace('[&_svg>use]:stroke-white', '[&_svg>use]:stroke-gray-600');

      updateProductDisplay();
    }
  });

  gridBtn.addEventListener('click', () => {
    if (!isGridView) {
      isGridView = true;
      currentPage = 1;

      gridBtn.classList.replace('bg-white', 'bg-violet-600');
      gridBtn.querySelector('.icon').classList.replace('text-gray-600', 'text-white');
      gridBtn.querySelector('.icon').classList.replace('[&_svg>use]:stroke-gray-600', '[&_svg>use]:stroke-white');

      listBtn.classList.replace('bg-violet-600', 'bg-white');
      listBtn.querySelector('.icon').classList.replace('text-white', 'text-gray-600');
      listBtn.querySelector('.icon').classList.replace('[&_svg>use]:stroke-white', '[&_svg>use]:stroke-gray-600');

      updateProductDisplay();
    }
  });

  // Initial display
  updateProductDisplay();
}

export default async function decorate(block) {
  decorateProductList(block);
}

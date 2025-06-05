/* eslint-disable import/no-unresolved */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import {
  getProductsForCategories,
} from '../../scripts/commerce.js';
import {
  div, span, button, fieldset, input, p,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { buildItemListSchema } from '../../scripts/schema.js';
import renderProductGridCard from './gridData.js';
import renderProductListCard from './listData.js';

const productSkeleton = div(
  { class: 'coveo-skeleton flex flex-col w-full lg:flex-row grid-rows-1 lg:grid-cols-5 gap-x-10 gap-y-4' },
  div(
    { class: 'col-span-4 w-full' },
    div({ class: 'max-w-xs bg-neutral-200 rounded-md p-4 animate-pulse mb-16' }),
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

/**
 * Function to get hash params
 */
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
 */
function getArrayFromHashParam(param) {
  if (!param) return [];
  if (param.includes(',')) return param.split(',');
  return [param];
}

/**
 * Function to check if object is empty
 */
function isEmptyObject(obj) {
  return obj && Object.keys(obj)?.at(0) === '';
}

/**
 * Function to toggle facet on button click
 */
function facetButtonClick(e) {
  e.preventDefault();
  const facetButton = e.target.closest('button');
  const isExpanded = facetButton.getAttribute('aria-expanded') === 'true';
  facetButton.setAttribute('aria-expanded', !isExpanded);
  const parentElement = facetButton.closest('div.facet');
  const contents = parentElement.querySelector('.facet-contents');
  const searchWrapper = parentElement.querySelector('.search-wrapper');
  const icon = facetButton.querySelector('.icon');

  icon.classList.toggle('icon-plus', isExpanded);
  icon.classList.toggle('icon-minus', !isExpanded);
  contents.classList.toggle('hidden', isExpanded);
  searchWrapper?.classList.toggle('hidden', isExpanded);
  decorateIcons(parentElement);
}

/**
 * Function to render a facet item (for opco)
 */
const facetItem = (filter, valueObj) => {
  const isSelected = opco.has(valueObj.value);
  return div(
    { class: 'inline-flex justify-start items-center gap-2' },
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
        { class: 'justify-start text-black text-sm font-normal leading-tight' },
        valueObj.value,
      ),
      div(
        { class: 'text-gray-500 text-sm font-normal' },
        ` (${valueObj.numberOfResults})`,
      ),
    ),
  );
};

/**
 * Function to iterate through hierarchical facet children (for workflowname)
 */
function iterateChildren(filter, node, searchQuery = '') {
  const path = node.path?.join(',') || node.value;
  const isSelected = workflowName.has(node.value);
  const nodeValueLower = node.value.toLowerCase();
  const searchQueryLower = searchQuery.toLowerCase();

  // Skip rendering if the node doesn't match the search query and has no matching children
  let hasMatchingChild = false;
  if (node.children && node.children.length > 0) {
    hasMatchingChild = node.children.some((child) => {
      const childValueLower = child.value.toLowerCase();
      return childValueLower.includes(searchQueryLower) || iterateChildren(filter, child, searchQuery);
    });
  }

  if (searchQuery && !nodeValueLower.includes(searchQueryLower) && !hasMatchingChild) {
    return null;
  }

  const liEl = div(
    { class: 'inline-flex flex-col justify-start items-start gap-2' },
    div(
      { class: 'inline-flex justify-start items-center gap-2 w-full' },
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
          { class: 'justify-start text-black text-sm font-normal leading-tight' },
          node.value,
        ),
        div(
          { class: 'text-gray-500 text-sm font-normal' },
          ` (${node.numberOfResults})`,
        ),
      ),
    ),
  );

  if (node.children && node.children.length > 0) {
    const ulSubParent = div({ class: 'ml-4 flex flex-col justify-start items-start gap-2' });
    node.children.forEach((child) => {
      const childEl = iterateChildren(filter, child, searchQuery);
      if (childEl) {
        ulSubParent.appendChild(childEl);
      }
    });
    if (ulSubParent.children.length > 0) {
      liEl.appendChild(ulSubParent);
    }
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
      class: 'facet-header-btn self-stretch pr-3 pt-2 pb-2.5 inline-flex justify-between items-start gap-2',
      'aria-expanded': isFirst ? 'true' : 'false',
      onclick: facetButtonClick,
    },
    div(
      { class: 'flex-1 flex items-start text-left text-black text-base font-semibold leading-normal' },
      filter.label || (filter.facetId === 'opco' ? 'Brand' : 'Process Step'),
    ),
    div(
      { class: 'w-4 h-4 relative mb-2' },
      span({
        class: `icon ${isFirst ? 'icon-minus' : 'icon-plus'} [&_svg>use]:stroke-danaherpurple-500 ml-1`,
      }),
    ),
  );
  // Facet contents
  const contents = fieldset({
    class: `facet-contents flex flex-col justify-start items-start gap-4 ${isFirst ? '' : 'hidden'} min-h-[100px]`,
  });

  // Add search bar for workflowname and opco
  let itemsContainer = null;
  let originalItems = null;
  if (filter.facetId === 'workflowname' || filter.facetId === 'opco') {
    const searchBar = div(
      {
        class: `search-wrapper self-stretch h-8 px-3 py-1.5 bg-gray-100 outline outline-[0.50px] outline-gray-300 inline-flex justify-start items-center gap-1.5 ${isFirst ? '' : 'hidden'}`,
      },
      div(
        { class: 'flex justify-start items-center gap-1.5' },
        span({ class: 'icon icon-search w-4 h-4 text-gray-400' }),
        input({
          class: 'justify-start text-gray-500 text-sm font-normal leading-tight bg-transparent outline-none flex-1',
          type: 'text',
          placeholder: 'Search',
          'aria-label': `Search for values in the ${filter.label || filter.facetId} facet`,
        }),
      ),
    );
    decorateIcons(searchBar);
    contents.append(searchBar);

    // Store original items for filtering
    originalItems = div({ class: 'hidden' });
    itemsContainer = div({ class: 'items-container flex flex-col justify-start items-start gap-2' });

    if (filter.facetId === 'workflowname') {
      if (filter.values && filter.values.length > 0) {
        filter.values.forEach((valueObj) => {
          const item = iterateChildren(filter, valueObj);
          if (item) {
            originalItems.append(item.cloneNode(true));
            itemsContainer.append(item);
          }
        });
      } else {
        const noItems = div({ class: 'text-gray-500 text-sm' }, 'No process steps available');
        originalItems.append(noItems.cloneNode(true));
        itemsContainer.append(noItems);
      }
    } else if (filter.facetId === 'opco') {
      if (filter.values && filter.values.length > 0) {
        filter.values.forEach((valueObj) => {
          const item = facetItem(filter, valueObj);
          originalItems.append(item.cloneNode(true));
          itemsContainer.append(item);
        });
      } else {
        const noItems = div({ class: 'text-gray-500 text-sm' }, 'No brands available');
        originalItems.append(noItems.cloneNode(true));
        itemsContainer.append(noItems);
      }
    }

    contents.append(originalItems, itemsContainer);

    // Add event listener for search input
    const searchInput = searchBar.querySelector('input');
    searchInput.addEventListener('input', (e) => {
      const searchQuery = e.target.value.trim().toLowerCase();
      itemsContainer.innerHTML = '';

      let hasMatches = false;
      if (filter.facetId === 'workflowname') {
        originalItems.childNodes.forEach((item) => {
          if (item.querySelector('button.workflowname')) {
            const label = item.querySelector('div:nth-child(2)').textContent.toLowerCase();
            if (!searchQuery || label.includes(searchQuery)) {
              const clonedItem = item.cloneNode(true);
              clonedItem.querySelector('button').addEventListener('click', filterButtonClick);
              itemsContainer.append(clonedItem);
              hasMatches = true;
            }
          }
        });
      } else if (filter.facetId === 'opco') {
        originalItems.childNodes.forEach((item) => {
          if (item.querySelector('button')) {
            const label = item.querySelector('div:nth-child(2)').textContent.toLowerCase();
            if (!searchQuery || label.includes(searchQuery)) {
              const clonedItem = item.cloneNode(true);
              clonedItem.querySelector('button').addEventListener('click', filterButtonClick);
              itemsContainer.append(clonedItem);
              hasMatches = true;
            }
          }
        });
      }

      if (!hasMatches) {
        itemsContainer.append(div({ class: 'text-gray-500 text-sm' }, `No ${filter.facetId === 'workflowname' ? 'process steps' : 'brands'} found`));
      }
    });
  } else {
    // Render facet items or a fallback message for facets without search
    if (filter.facetId === 'workflowname') {
      if (filter.values && filter.values.length > 0) {
        filter.values.forEach((valueObj) => {
          const item = iterateChildren(filter, valueObj);
          if (item) contents.append(item);
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
  }

  facetDiv.append(header, contents);
  return facetDiv;
};

let workflowName = new Set(getArrayFromHashParam(hashParams().workflowname));
let opco = new Set(getArrayFromHashParam(hashParams().opco));

/**
 * Function to get last query from workflowName
 */
const lastQuery = () => [...workflowName][workflowName.size - 1];

/**
 * Function to clear all filter
 */
function clearFilter(e, isWorkflow = true, isOpco = false) {
  e.preventDefault();
  if (isWorkflow) workflowName.clear();
  if (isOpco) opco.clear();
  const params = getFilterParams();
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
  window.history.replaceState({}, '', queryString ? `#${queryString}` : '#');
  currentPage = 1;
  updateProductDisplay();
}

/**
 * Function to add breadcrumb filter for workflowName
 */
const breadcrumbWFFilter = (filter) => {
  const parent = filter.querySelector('.breadcrumb-list');
  if (workflowName.size > 0) {
    parent.insertBefore(div(
      { class: 'breadcrumb' },
      button(
        {
          class: 'btn-outline-secondary rounded-full !border-gray-300 px-2 py-1 text-sm truncate max-w-[250px] block',
          part: 'breadcrumb-button',
          'aria-pressed': true,
          onclick: (e) => clearFilter(e, true, false),
          title: `Process Step: ${[...workflowName].join(' / ')}`,
          'aria-label': `Remove inclusion filter on Process Step: ${[...workflowName].join(' / ')}`,
        },
        span({ class: 'breadcrumb-label' }, 'Process Step'),
        span({ class: 'breadcrumb-value' }, `: ${[...workflowName].join(' / ')}`),
        span({ class: 'icon icon-close w-4 h-4 align-middle' }),
      ),
    ), parent.firstChild);
  }
};

/**
 * Function to add breadcrumb filter for opco
 */
const breadcrumbOpcoFilter = (filter) => {
  const parent = filter.querySelector('.breadcrumb-list');
  if (opco.size > 0) {
    parent.insertBefore(div(
      { class: 'breadcrumb' },
      button(
        {
          class: 'btn-outline-secondary rounded-full !border-gray-300 px-2 py-1 text-sm truncate max-w-[250px] block',
          part: 'breadcrumb-button',
          'aria-pressed': true,
          onclick: (e) => clearFilter(e, false, true),
          title: `Brand: ${[...opco].join(', ')}`,
          'aria-label': `Remove inclusion filter on Brand: ${[...opco].join(', ')}`,
        },
        span({ class: 'breadcrumb-label' }, 'Brand'),
        span({ class: 'breadcrumb-value' }, `: ${[...opco].join(', ')}`),
        span({ class: 'icon icon-close w-4 h-4 align-middle' }),
      ),
    ), parent.firstChild);
  }
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
 * Function to clear values after current value
 */
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
 */
const updateOpco = (value, ariaPressed) => {
  if (!ariaPressed) opco.add(value);
  else opco.delete(value);
};

/**
 * Function to update workflow name
 */
const updateWorkflowName = (value, ariaPressed) => {
  if (value === 'automated-cell-imaging-systems') {
    workflowName.clear();
    workflowName.add(value);
  } else if (!ariaPressed) {
    clearValuesAfterCurrent(workflowName, value);
    workflowName.add(value);
  } else {
    workflowName.clear();
  }
};

/**
 * Function to handle filter button click
 */
function filterButtonClick(e) {
  e.preventDefault();
  const buttonEl = e.target.closest('button');
  if (!buttonEl) return;

  const icon = buttonEl.querySelector('.checkbox-icon');
  icon?.classList.toggle('icon-square');
  icon?.classList.toggle('icon-check-square');
  decorateIcons(buttonEl);

  const filterValue = buttonEl.getAttribute('part');
  const isWorkflowName = buttonEl.dataset.type === 'workflowname';
  const ariaPressed = buttonEl.getAttribute('aria-pressed') === 'true';

  if (filterValue === 'automated-cell-imaging-systems') {
    workflowName = new Set(['automated-cell-imaging-systems']);
    buttonEl.setAttribute('aria-pressed', 'true');
    window.history.replaceState({}, '', '#workflowname=automated-cell-imaging-systems');
    currentPage = 1;
    updateProductDisplay();
    return;
  }

  if (isWorkflowName) {
    updateWorkflowName(filterValue, ariaPressed);
  } else {
    updateOpco(filterValue, ariaPressed);
  }

  buttonEl.setAttribute('aria-pressed', ariaPressed ? 'false' : 'true');

  const params = getFilterParams();
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  window.history.replaceState({}, '', queryString ? `#${queryString}` : '#');
  currentPage = 1;
  updateProductDisplay();
}

// Constants for pagination
const GRID_ITEMS_PER_PAGE = 21;
const LIST_ITEMS_PER_PAGE = 7;
let currentPage = 1;
let isGridView = true;

let productContainer;
let productCount;
let paginationContainer;
let listBtn;
let gridBtn;
let breadcrumbContainer;

/**
 * Function to render pagination
 */
function renderPagination(totalProducts, paginationWrapper) {
  paginationWrapper.innerHTML = '';
  const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  if (totalPages <= 1) {
    paginationWrapper.style.display = 'none';
    return;
  }

  paginationWrapper.style.display = 'flex';

  const paginationContainer = div({ class: 'self-stretch h-9 relative w-full' });
  const grayLine = div({ class: 'w-full h-px absolute left-0 top-0 bg-gray-200 z-0' });
  const contentWrapper = div({
    class: 'w-full left-0 top-0 absolute flex justify-between items-center px-4',
  });

  // Previous Button
  const prevEnabled = currentPage > 1;
  const prevButton = div({
    'data-direction': 'Previous',
    'data-state': prevEnabled ? 'Default' : 'Disabled',
    class: 'inline-flex flex-col justify-start items-start',
  });
  prevButton.append(
    div({ class: 'self-stretch h-0.5 bg-transparent' }),
    div(
      {
        class: `self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${prevEnabled ? 'pointer' : 'not-allowed'} z-10`,
      },
      div(
        { class: 'w-5 h-5 relative overflow-hidden' },
        span({
          class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${prevEnabled ? 'text-gray-700' : 'text-gray-400'} [&_svg>use]:stroke-current`,
        }),
      ),
      div({
        class: `justify-start text-${prevEnabled ? 'gray-700' : 'text-gray-400'} text-sm font-medium leading-tight`,
      }, 'Previous'),
    ),
  );
  decorateIcons(prevButton);
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      updateProductDisplay();
    }
  });

  // Page Numbers
  const pageNumbersContainer = div({ class: 'flex justify-center items-start gap-2 z-10' });
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    const firstPage = div({
      'data-current': currentPage === 1 ? 'True' : 'False',
      'data-state': 'Default',
      class: 'inline-flex flex-col justify-start items-start',
    });
    firstPage.append(
      div({ class: `self-stretch h-0.5 ${currentPage === 1 ? 'bg-violet-600' : 'bg-transparent'}` }),
      div(
        { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer' },
        div({
          class: `text-center justify-start text-${currentPage === 1 ? 'violet-600' : 'gray-700'} text-sm font-medium leading-tight`,
        }, '1'),
      ),
    );
    firstPage.addEventListener('click', () => {
      currentPage = 1;
      updateProductDisplay();
    });
    pageNumbersContainer.append(firstPage);

    if (startPage > 2) {
      pageNumbersContainer.append(
        div(
          {
            class: 'inline-flex flex-col justify-start items-start',
          },
          div({ class: 'self-stretch h-0.5 bg-transparent' }),
          div(
            { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start' },
            div({ class: 'text-center justify-start text-gray-700 text-sm font-medium leading-tight' }, '...'),
          ),
        ),
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageNumber = div({
      'data-current': currentPage === i ? 'True' : 'False',
      'data-state': 'Default',
      class: 'inline-flex flex-col justify-start items-start',
    });
    pageNumber.append(
      div({ class: `self-stretch h-0.5 ${currentPage === i ? 'bg-violet-600' : 'bg-transparent'}` }),
      div(
        { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer' },
        div({
          class: `text-center justify-start text-${currentPage === i ? 'violet-600' : 'gray-700'} text-sm font-medium leading-tight`,
        }, i.toString()),
      ),
    );
    pageNumber.addEventListener('click', () => {
      currentPage = i;
      updateProductDisplay();
    });
    pageNumbersContainer.append(pageNumber);
  }

  if (endPage < totalPages - 1) {
    pageNumbersContainer.append(
      div(
        {
          class: 'inline-flex flex-col justify-start items-start',
        },
        div({ class: 'self-stretch h-0.5 bg-transparent' }),
        div(
          { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start' },
          div({ class: 'text-center justify-start text-gray-700 text-sm font-medium leading-tight' }, '...'),
        ),
      ),
    );
  }

  if (endPage < totalPages) {
    const lastPage = div({
      'data-current': currentPage === totalPages ? 'True' : 'False',
      'data-state': 'Default',
      class: 'inline-flex flex-col justify-start items-start',
    });
    lastPage.append(
      div({ class: `self-stretch h-0.5 ${currentPage === totalPages ? 'bg-violet-600' : 'bg-transparent'}` }),
      div(
        { class: 'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer' },
        div({
          class: `text-center justify-start text-${currentPage === totalPages ? 'violet-600' : 'gray-700'} text-sm font-medium leading-tight`,
        }, totalPages.toString()),
      ),
    );
    lastPage.addEventListener('click', () => {
      currentPage = totalPages;
      updateProductDisplay();
    });
    pageNumbersContainer.append(lastPage);
  }

  // Next Button
  const nextEnabled = currentPage < totalPages;
  const nextButton = div({
    'data-direction': 'Next',
    'data-state': nextEnabled ? 'Default' : 'Disabled',
    class: 'inline-flex flex-col justify-start items-start',
  });
  nextButton.append(
    div({ class: 'self-stretch h-0.5 bg-transparent' }),
    div(
      {
        class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${nextEnabled ? 'pointer' : 'not-allowed'} z-10`,
      },
      div({
        class: `justify-start text-${nextEnabled ? 'gray-700' : 'text-gray-400'} text-sm font-medium leading-tight`,
      }, 'Next'),
      div(
        { class: 'w-5 h-5 relative overflow-hidden' },
        span({
          class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${nextEnabled ? 'text-gray-700' : 'text-gray-400'} [&_svg>use]:stroke-current`,
        }),
      ),
    ),
  );
  decorateIcons(nextButton);
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      updateProductDisplay();
    }
  });

  contentWrapper.append(prevButton, pageNumbersContainer, nextButton);
  paginationContainer.append(grayLine, contentWrapper);
  paginationWrapper.append(paginationContainer);
}

/**
 * Function to update product display
 */
async function updateProductDisplay() {
  productContainer.innerHTML = '';
  productContainer.append(productSkeleton.cloneNode(true));

  const params = getFilterParams();
  let response;
  try {
    response = await getProductsForCategories(params);
  } catch (err) {
    console.error('Error fetching products:', err);
    response = { results: [], facets: [], totalCount: 0 };
  }

  try {
    const skeleton = productContainer.querySelector('.coveo-skeleton');
    if (skeleton) {
      productContainer.removeChild(skeleton);
    }
  } catch (error) {
    console.error('Error removing skeleton:', error);
  }

  if (response.totalCount > 0) {
    buildItemListSchema(response.results, 'product-family');
  }

  const products = response.results || [];
  const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, products.length);

  productCount.textContent = `${response.totalCount} Products Available`;

  if (workflowName.size > 0 || opco.size > 0) {
    if (!breadcrumbContainer) {
      breadcrumbContainer = div(
        { class: 'container text-sm flex items-start' },
        span({ class: 'label font-bold py-[0.625rem] pl-0 pr-2' }, 'Filters:'),
        div(
          { class: 'breadcrumb-list-container relative grow' },
          div({ class: 'breadcrumb-list flex gap-1 flex-col md:flex-row absolute w-full' }),
        ),
      );
      productContainer.insertBefore(breadcrumbContainer, productContainer.firstChild);
    }
    const breadcrumbList = breadcrumbContainer.querySelector('.breadcrumb-list');
    breadcrumbList.innerHTML = '';
    breadcrumbList.appendChild(div(
      button(
        {
          class: 'btn-outline-secondary rounded-full !border-gray-300 px-2 py-1',
          'aria-pressed': true,
          onclick: (e) => clearFilter(e, true, true),
          part: 'clear',
          'aria-label': 'Clear All Filters',
        },
        span('Clear'),
        span({ class: 'icon icon-close w-2 h-2 align-middle' }),
      ),
    ));
    breadcrumbWFFilter(breadcrumbContainer);
    breadcrumbOpcoFilter(breadcrumbContainer);
    decorateIcons(breadcrumbContainer);
  } else if (breadcrumbContainer) {
    breadcrumbContainer.remove();
    breadcrumbContainer = null;
  }

  if (!products || products.length === 0) {
    let errorMessage = 'No products match the selected filters. Please try different filters.';
    if (params.workflowname) {
      errorMessage = `No products found for ${params.workflowname}. Please try a different filter.`;
    }
    const noProductsMessage = div({ class: 'w-full text-center py-8 text-gray-600 text-lg' }, errorMessage);
    productContainer.append(noProductsMessage);
    paginationContainer.style.display = 'none';
    return;
  }

  const productsWrapper = isGridView
    ? div({ class: 'w-full flex flex-wrap gap-5 justify-start' })
    : div({ class: 'w-full flex flex-col gap-4' });

  const productsToDisplay = products.slice(startIndex, endIndex);
  productsToDisplay.forEach((item) => {
    productsWrapper.append(isGridView ? renderProductGridCard(item) : renderProductListCard(item));
  });

  productContainer.append(productsWrapper);
  renderPagination(products.length, paginationContainer);
}

/**
 * Function to decorate product list
 */
export async function decorateProductList(block) {
  block.innerHTML = '';
  block.append(productSkeleton);

  const params = isEmptyObject(hashParams()) ? {} : hashParams();
  let response;
  try {
    response = await getProductsForCategories(params);
  } catch (err) {
    console.error('Error fetching products:', err);
    response = { results: [], facets: [], totalCount: 0 };
  }

  block.removeChild(productSkeleton);
  block.classList.add(...'flex flex-col lg:flex-row w-full mx-auto gap-6 pt-10'.split(' '));

  const facetDiv = div({ id: 'filter', class: 'max-w-sm mx-auto' });
  const contentWrapper = div({ class: 'max-w-5xl w-full mx-auto flex-1 flex flex-col gap-4' });

  const filterWrapper = div({
    class: 'w-72 p-5 inline-flex flex-col justify-start items-start gap-3 min-h-fit',
  });

  const header = div(
    { class: 'self-stretch inline-flex justify-start items-center gap-4' },
    div(
      { class: 'w-12 h-12 relative bg-violet-50 rounded-3xl' },
      div(
        { class: 'w-6 h-6 left-[12px] top-[12px] absolute overflow-hidden' },
        span({
          class: 'icon icon-adjustments w-6 h-6 absolute ',
        }),
      ),
    ),
    div(
      { class: 'flex-1 h-6 relative' },
      div(
        { class: 'w-64 h-6 left-0 top-0 absolute' },
        div(
          { class: 'w-64 left-0 top-[-6px] absolute justify-start text-gray-900 text-3xl font-normal leading-10' },
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
        facetButtons.forEach((btn) => {
          btn.setAttribute('aria-expanded', 'true');
          const parent = btn.closest('div.facet');
          const contents = parent.querySelector('.facet-contents');
          const searchWrapper = parent.querySelector('.search-wrapper');
          const icon = btn.querySelector('.icon');
          icon.classList.remove('icon-plus');
          icon.classList.add('icon-minus');
          contents.classList.remove('hidden');
          searchWrapper?.classList.remove('hidden');
          decorateIcons(parent);
        });
      },
    },
    div(
      { class: 'text-right justify-start text-violet-600 text-base font-bold leading-snug' },
      'Expand All',
    ),
    div(
      { class: 'w-4 h-4 relative mb-2' },
      span({ class: 'icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 ml-1' }),
    ),
  );

  decorateIcons(expandAll);
  decorateIcons(header);

  const facetContainer = div({ class: 'self-stretch flex flex-col justify-start items-start' });
  const facets = response.facets || [];
  facets.forEach((filter, index) => {
    const facetElement = renderFacet(filter, index === 0);
    if (facetElement) {
      facetContainer.append(facetElement);
    }
  });

  filterWrapper.append(header, expandAll, facetContainer);
  decorateIcons(filterWrapper);
  facetDiv.append(filterWrapper);

  const headerWrapper = div({ class: 'w-full flex justify-between items-center mb-4 flex-wrap gap-2 min-w-0' });
  productCount = div({ class: 'text-black text-base font-medium' }, `${response.totalCount} Products Available`);
  const viewToggleWrapper = div({ class: 'flex items-center gap-2 min-w-fit' });
  const viewModeGroup = div({ class: 'flex justify-start items-center gap-0' });

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

  productContainer = div({ class: 'w-full' });
  contentWrapper.append(productContainer);

  paginationContainer = div({ class: 'pagination-container flex justify-center items-center gap-2 mt-8 w-full' });
  contentWrapper.append(paginationContainer);

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

  block.append(facetDiv, contentWrapper);
  updateProductDisplay();
}

export default async function decorate(block) {
  decorateProductList(block);
}

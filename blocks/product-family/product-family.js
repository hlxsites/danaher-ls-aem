import { decorateIcons } from "../../scripts/lib-franklin.js";
import { div, span, button, fieldset, ul, li, input } from "../../scripts/dom-builder.js";
import renderGridCard from "./renderGridCard.js";
import renderListCard from "./renderListCard.js";

// Static facet data (already provided in your code)
const staticFacets = [
  {
    facetId: "workflowname",
    values: [
      { value: "Antibody Production", numberOfResults: 10, state: "idle" },
      { value: "Cell Culture", numberOfResults: 5, state: "idle" },
      { value: "Protein Analysis", numberOfResults: 8, state: "idle" },
    ],
  },
  {
    facetId: "opco",
    values: [
      { value: "Beckman Life Science", numberOfResults: 3, state: "idle" },
      { value: "IDBS", numberOfResults: 2, state: "idle" },
      { value: "Leica Microsystems", numberOfResults: 4, state: "idle" },
      { value: "Molecular Devices", numberOfResults: 1, state: "idle" },
      { value: "Phenomenex", numberOfResults: 2, state: "idle" },
      { value: "Sciex", numberOfResults: 1, state: "idle" },
    ],
  },
];

// Static product data (already provided in your code)
const staticProducts = {
  totalCount: 30,
  results: Array.from({ length: 30 }, (_, i) => ({
    title: `Anti-FoxP3 Antibody ${i + 1}`,
    raw: {
      images: ["https://via.placeholder.com/300"],
      description: "Our comprehensive range of antibodies designed for research purposes.",
      price: "9999.99",
      tag: i % 2 === 0 ? "Carrier Free" : null,
    },
    clickUri: `/product/anti-foxp3-antibody-${i + 1}`,
  })),
};

// Hash params handling
const hashParams = () => {
  const hash = window.location.hash.substr(1);
  const params = {};
  hash.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
};

function getArrayFromHashParam(param) {
  return param ? (param.includes(',') ? param.split(',') : [param]) : [];
}

function facetButtonClick(e) {
  e.preventDefault();
  e.target.setAttribute('aria-expanded', e.target.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  const parentElement = e.target.closest('div.button');
  const contents = parentElement.querySelector('.contents');
  const searchWrapper = parentElement.querySelector('.search-wrapper');
  const icon = parentElement.querySelector('.icon');
  icon.classList.toggle('icon-dash');
  icon.classList.toggle('icon-plus');
  contents.classList.toggle('hidden');
  searchWrapper?.classList.toggle('hidden');
}

function iterateChildren(filter, node) {
  const path = node.path?.join(',');
  const liEl = li(
    { class: 'content' },
    button(
      {
        class: `${filter.facetId} p-1 text-left hover:bg-gray-100 flex flex-row items-center gap-2`,
        'aria-pressed': node?.state === 'selected',
        'data-type': filter.facetId,
        'data-path': path,
        part: node?.value,
        onclick: filterButtonClick,
      },
      span({ part: 'value-label', class: 'text-sm truncate w-[15rem] block' }, node?.value),
      ` ( ${node?.numberOfResults} )`,
    ),
  );
  if (node?.state === 'selected') {
    liEl.classList.add('child');
  }
  if (node.children && node.children.length > 0) {
    liEl.classList.add('child');
    const ulSubParent = ul({ part: 'values', class: 'sub-parents m-1 w-full' });
    node.children.forEach((child) => {
      ulSubParent.appendChild(iterateChildren(filter, child));
    });
    liEl.appendChild(ulSubParent);
  }
  const isActive = lastQuery() === node.value;
  const buttonEl = liEl.querySelector('button');
  buttonEl?.classList[isActive ? 'add' : 'remove']('active', 'font-bold');
  return liEl;
}

let workflowName = new Set(getArrayFromHashParam(hashParams().workflowname));
let opco = new Set(getArrayFromHashParam(hashParams().opco));

const lastQuery = () => [...workflowName][workflowName.size - 1];

function clearFilter(e, isWorkflow = true, isOpco = false) {
  if (isWorkflow) workflowName = new Set([]);
  if (isOpco) opco = new Set([]);
  const buttonEl = e.target.closest('button');
  history.replaceState({}, '', `#${getQueryString(buttonEl)}`);
  decorateProductList(document.querySelector('.product-family'));
}

function buildAllCategories() {
  return li(
    { class: 'content' },
    button(
      {
        class: 'p-1 text-left hover:bg-gray-100 flex flex-row items-center gap-2',
        'aria-pressed': true,
        onclick: clearFilter,
      },
      span({ class: 'icon icon-chevron-left pr-2' }),
      span({ part: 'value-label', class: 'value-label peer-hover:text-error text-sm' }, 'All Categories'),
    ),
  );
}

function addFacetFilters(filter, fecetList) {
  let selectedFacet;
  const allFacet = [];
  const fieldUL = ul({ part: 'values', class: 'parents m-1 w-full' });
  filter.values.forEach((element) => {
    const facet = iterateChildren(filter, element);
    if (facet.className.includes('child')) selectedFacet = facet;
    else allFacet.push(facet);
  });
  if (selectedFacet && filter.facetId === 'workflowname') {
    const allCategories = buildAllCategories();
    allCategories.append(ul({ part: 'values', class: 'parents m-1 w-full' }, selectedFacet));
    fieldUL.append(allCategories);
  } else if (selectedFacet) {
    fieldUL.append(ul({ part: 'values', class: 'parents m-1 w-full' }, selectedFacet));
  } else fieldUL.append(...allFacet);
  const opcoEl = fieldUL.querySelectorAll('.opco');
  opcoEl?.forEach((el) => {
    const iconClass = el?.getAttribute('aria-pressed') === 'false' ? 'icon icon-square pr-2' : 'icon icon-check-square pr-2';
    el.insertBefore(span({ class: iconClass }), el.firstChild);
  });
  const selectedButton = fieldUL.querySelectorAll('li.child > button.workflowname:not(.active)');
  if (selectedButton.length > 0) {
    selectedButton.forEach((buttonEl) => {
      buttonEl.insertBefore(span({ class: 'icon icon-chevron-left pr-2' }), buttonEl.firstChild);
    });
  }
  fecetList.append(fieldUL);
}

function addFacetHeading(facetsObj, name) {
  facetsObj.append(button(
    {
      class: 'btn-text-transparent flex font-bold justify-between w-full py-1 px-2 text-lg rounded-none',
      title: 'Collapse the facet',
      'aria-expanded': 'true',
      onclick: (e) => {
        facetButtonClick(e);
        decorateIcons(facetsObj);
      },
      part: 'label-button',
    },
    div({ class: 'label-button' }, name),
    span({ class: 'icon icon-dash' }),
  ));
  if (name === 'opco') facetsObj.querySelector('.label-button').textContent = 'Brand';
  else facetsObj.querySelector('.label-button').textContent = 'Process Step';
  if (opco.size > 0 && name === 'opco') {
    facetsObj.append(
      button(
        {
          class: 'btn-outline-secondary !border-gray-300 p-0.5',
          'aria-pressed': true,
          onclick: (e) => { clearFilter(e, false, true); },
          part: 'clear',
          'aria-label': 'Clear Filters',
        },
        span({ class: 'icon icon-close w-4 h-4 align-middle' }),
        span({ class: 'text-xs' }, 'Clear Filter'),
      ),
    );
  }
  facetsObj.append(fieldset(
    { class: 'contents all-facet-list' },
  ));
}

const breadcrumbWFFilter = (filter) => {
  const parent = filter.querySelector('.breadcrumb-list');
  if (workflowName.size > 0) {
    return parent.insertBefore(li(
      { class: 'breadcrumb' },
      button(
        {
          class: 'btn-outline-secondary rounded-full !border-gray-300 px-2 py-1 text-sm truncate w-64 block',
          part: 'breadcrumb-button',
          'aria-pressed': true,
          onclick: clearFilter,
          title: `Process Step : ${[...workflowName].join(' / ')}`,
          'aria-label': `Remove inclusion filter on Process Step: ${[...workflowName].join(' / ')}`,
        },
        span({ class: 'breadcrumb-label' }, 'Process Step'),
        span({ class: 'breadcrumb-value' }, `: ${[...workflowName].join(' / ')}`),
        span({ class: 'icon icon-close  w-4 h-4 align-middle' }),
      ),
    ), parent.firstChild);
  }
  return li();
};

const breadcrumbOpcoFilter = (filter) => {
  const parent = filter.querySelector('.breadcrumb-list');
  if (opco.size > 0) {
    return parent.insertBefore(li(
      { class: 'breadcrumb' },
      button(
        {
          class: 'btn-outline-secondary rounded-full !border-gray-300 px-2 py-1 text-sm truncate w-64 block',
          part: 'breadcrumb-button',
          'aria-pressed': true,
          onclick: (e) => { clearFilter(e, false, true); },
          title: `Brand : ${[...opco]}`,
          'aria-label': `Remove inclusion filter on Brand: ${[...opco]}`,
        },
        span({ class: 'breadcrumb-label' }, 'Brand'),
        span({ class: 'breadcrumb-value' }, `: ${[...opco]}`),
        span({ class: 'icon icon-close w-4 h-4 align-middle' }),
      ),
    ), parent.firstChild);
  }
  return li();
};

function resultList(response, categoryDiv, isGridView, currentPage, itemsPerPage) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, response.totalCount);
  const productsToDisplay = response.results.slice(startIndex, endIndex);

  const breadcrumbFilter = div(
    { class: 'container text-sm flex h-24 md:h-6 items-start' },
    span({ class: 'label font-bold py-[0.625rem] pl-0 pr-2' }, 'Filters:'),
    div(
      { class: 'breadcrumb-list-container relative grow' },
      ul(
        { class: 'breadcrumb-list flex gap-1 flex-col md:flex-row absolute w-full' },
        li(
          button(
            {
              class: 'btn-outline-secondary rounded-full !border-gray-300 px-2 py-1',
              'aria-pressed': true,
              onclick: (e) => { clearFilter(e, true, true); },
              part: 'clear',
              'aria-label': 'Clear All Filters',
            },
            span('Clear'),
            span({ class: 'icon icon-close w-4 h-4 align-middle !fill-current' }),
          ),
        ),
      ),
    ),
  );

  categoryDiv.append(
    div(
      { class: 'status flex flex-row justify-between h-8' },
      div(
        { class: 'text-on-background space-x-2' },
        'Result  ',
        span({ class: 'font-bold' }, startIndex + 1),
        span({ class: 'text-on-background' }, 'of'),
        span({ class: 'font-bold' }, response.totalCount),
      ),
    ),
  );

  breadcrumbWFFilter(breadcrumbFilter);
  breadcrumbOpcoFilter(breadcrumbFilter);

  if (workflowName.size > 0 || opco.size > 0) categoryDiv.append(breadcrumbFilter);

  categoryDiv.append(
    div(
      { class: 'list-wrapper display-grid density-compact image-small mt-6' },
      div({ class: `result-list ${isGridView ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'}`, part: 'result-list' }),
    ),
  );

  productsToDisplay.forEach((product) => {
    const productDiv = isGridView ? renderGridCard(product) : renderListCard(product);
    categoryDiv.querySelector('.result-list').append(productDiv);
  });
  decorateIcons(categoryDiv);
  return categoryDiv;
}

function facets(response, facetDiv) {
  response.forEach((filter) => {
    if (filter.values.length === 0) return;
    const facetsObj = div({ class: 'button bg-background border border-neutral rounded-lg p-4 mt-4' });
    addFacetHeading(facetsObj, filter.facetId);
    const fecetList = facetsObj.querySelector('.all-facet-list');
    addFacetFilters(filter, fecetList);
    facetDiv.append(facetsObj);
  });
  decorateIcons(facetDiv);
  return facetDiv;
}

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

const updateOpco = (value, ariaPressed) => {
  if (!ariaPressed) opco.add(value);
  else opco.delete(value);
};

const updateWorkflowName = (value, ariaPressed) => {
  if (!ariaPressed) {
    clearValuesAfterCurrent(workflowName, value);
    workflowName.add(value);
  } else workflowName.clear();
};

function getQueryString(buttonEl) {
  const queryMap = new Map();
  const isWorkflowName = buttonEl?.dataset.type === 'workflowname';
  const value = buttonEl?.part?.value;
  const ariaPressed = buttonEl?.getAttribute('aria-pressed') === 'true';

  if (isWorkflowName) updateWorkflowName(value, ariaPressed);
  else updateOpco(value, ariaPressed);

  buttonEl?.setAttribute('aria-pressed', ariaPressed ? 'false' : 'true');

  if (workflowName.size > 0) queryMap.set('workflowname', [...workflowName].join(','));
  if (opco.size > 0) queryMap.set('opco', [...opco].join(','));

  return Array.from(queryMap.entries())
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
}

function filterButtonClick(e) {
  e.preventDefault();
  const buttonEl = e.target.closest('button');
  const icon = buttonEl.querySelector('span.icon');
  icon?.classList.toggle('icon-square');
  icon?.classList.toggle('icon-check-square');
  decorateIcons(buttonEl);
  history.replaceState({}, '', `#${getQueryString(buttonEl)}`);
  decorateProductList(document.querySelector('.product-family'));
}

async function decorateProductList(block) {
  block.innerHTML = '';
  const facetDiv = div({ class: 'max-w-sm w-full mx-auto' });
  const categoryDiv = div({ class: 'max-w-5xl w-full mx-auto' });
  block.classList.add('pt-10');

  // Pagination and view toggle
  const GRID_ITEMS_PER_PAGE = 21;
  const LIST_ITEMS_PER_PAGE = 7;
  let currentPage = 1;
  let isGridView = true;

  const headerWrapper = div({
    class: "w-full flex justify-between items-center mb-4",
  });

  const productCount = div(
    { class: "text-black text-base font-medium" },
    `${staticProducts.totalCount} Products Available`,
  );

  const viewToggleWrapper = div({ class: "flex items-center gap-2" });
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
  viewToggleWrapper.append(viewModeGroup);
  headerWrapper.append(productCount, viewToggleWrapper);
  categoryDiv.append(headerWrapper);

  const productContainer = div({ class: "w-full" });
  categoryDiv.append(productContainer);

  const paginationContainer = div({
    class: "pagination-container flex justify-center items-center gap-2 mt-8 w-full",
  });
  categoryDiv.append(paginationContainer);

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
    const totalPages = Math.ceil(staticProducts.totalCount / itemsPerPage);

    if (totalPages <= 1 || (isGridView && staticProducts.totalCount <= GRID_ITEMS_PER_PAGE)) {
      paginationContainer.style.display = "none";
      return;
    }

    paginationContainer.style.display = "flex";
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
        updateProductDisplay();
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
        updateProductDisplay();
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
        updateProductDisplay();
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
        updateProductDisplay();
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
        updateProductDisplay();
      }
    });

    paginationWrapper.append(prevButton, pageNumbersContainer, nextButton);
    paginationContainer.append(paginationWrapper);
  }

  function updateProductDisplay() {
    // Simulate filtering based on workflowName and opco
    const simulatedFilteredProducts = staticProducts.results.filter((product) => {
      const matchesWorkflow = workflowName.size === 0 || [...workflowName].some((wf) => product.raw.description.includes(wf));
      const matchesOpco = opco.size === 0 || [...opco].some((op) => product.raw.description.includes(op));
      return matchesWorkflow && matchesOpco;
    });

    const filteredResponse = {
      totalCount: simulatedFilteredProducts.length,
      results: simulatedFilteredProducts,
    };

    productContainer.innerHTML = "";
    const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
    resultList(filteredResponse, productContainer, isGridView, currentPage, itemsPerPage);
    renderPagination();
  }

  listBtn.addEventListener("click", () => {
    if (isGridView) {
      isGridView = false;
      currentPage = 1;
      listBtn.classList.replace("bg-white", "bg-violet-600");
      listBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white");
      gridBtn.classList.replace("bg-violet-600", "bg-white");
      gridBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600");
      updateProductDisplay();
    }
  });

  gridBtn.addEventListener("click", () => {
    if (!isGridView) {
      isGridView = true;
      currentPage = 1;
      gridBtn.classList.replace("bg-white", "bg-violet-600");
      gridBtn.querySelector(".icon").classList.replace("text-gray-600", "text-white");
      listBtn.classList.replace("bg-violet-600", "bg-white");
      listBtn.querySelector(".icon").classList.replace("text-white", "text-gray-600");
      updateProductDisplay();
    }
  });

  if (staticProducts.totalCount > 0) {
    facets(staticFacets, facetDiv);
    updateProductDisplay();
  }

  block.classList.add(...'flex flex-col lg:flex-row w-full mx-auto gap-6'.split(' '));
  block.innerHTML = '';
  block.appendChild(facetDiv, categoryDiv);
}

export default async function decorate(block) {
  decorateProductList(block);
}
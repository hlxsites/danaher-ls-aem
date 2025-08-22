/* eslint-disable */
import {
  productTypeFacetController,
  brandFacetController,
  documentTypeFacetController,
  facetBreadcrumb,
  querySummary,
} from '../controllers/pdp-controllers.js';

// === Util: Create element with shorthand ===
function createEl(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.className) el.className = options.className;
  if (options.text) el.textContent = options.text;
  if (options.html) el.innerHTML = options.html;
  if (options.attrs) {
    for (const [key, val] of Object.entries(options.attrs)) {
      el.setAttribute(key, val);
    }
  }
  if (options.events) {
    for (const [evt, handler] of Object.entries(options.events)) {
      el.addEventListener(evt, handler);
    }
  }
  return el;
}

// === Get Facet Data from Controllers ===
function getFacetDataFromControllers() {
  const format = (values) => values.map((v) => ({
    label: `${v.value} (${v.numberOfResults})`,
    value: v.value,
    state: v.state, // 'selected' or not
  }));

  return [
    {
      title: 'Product Type',
      items: format(productTypeFacetController.state.values),
      toggleSelect: (value) => productTypeFacetController.toggleSelect(value),
      state: productTypeFacetController.state,
      deselectAll : () => productTypeFacetController.deselectAll()
    },
    {
      title: 'Brand',
      items: format(brandFacetController.state.values),
      toggleSelect: (value) => brandFacetController.toggleSelect(value),
      state: brandFacetController.state,
      deselectAll : () => brandFacetController.deselectAll()
    },
    {
      title: 'Document Type',
      items: format(documentTypeFacetController.state.values),
      toggleSelect: (value) => documentTypeFacetController.toggleSelect(value),
      state: documentTypeFacetController.state,
      deselectAll : () => documentTypeFacetController.deselectAll()
    },
  ];
}

// === Render Breadcrumbs (selected filters) ===
function renderBreadcrumbs() {
  const facetBreadcrumbElement = document.getElementById('facet-panel-breadcrumb');
  if (!facetBreadcrumbElement) return;

  facetBreadcrumbElement.innerHTML = '';

  const container = createEl('div', {
    className:
      'max-w-6xl mx-auto flex justify-start gap-2 flex-wrap min-h-[28px] p-3',
  });
  container.style = 'background:#F9FAFB;';

  const filters = [];

  facetBreadcrumb.state.facetBreadcrumbs.forEach((facet) => {
    createFacetBreadcurmb(facet.values, facet);
  });

  facetBreadcrumb.state.categoryFacetBreadcrumbs.forEach((facet) =>{
    createFacetBreadcurmb(facet.path, facet, true)
  });

  function createFacetBreadcurmb(values, facet, isCategoryFacet = false){
    values.forEach((item) => {
      let fieldName = facet.field;

      if (facet.field === 'categoriesname') {
        fieldName = 'Product Type';
      } else if (facet.field === 'opco') {
        fieldName = 'Brand';
      } else if (facet.field === 'documenttype') {
        fieldName = 'Document Type';
      }

      const displayText = isCategoryFacet ? item.value :item.value.value 

      // Create filter tag
      const filterTag = document.createElement('div');
      filterTag.className = 'bg-danaherpurple-50 px-2 py-1 rounded-[6px] flex items-center text-sm text-purple-700 font-medium gap-2';

      const label = document.createElement('span');
      label.textContent = `${fieldName}: ${displayText}`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'text-purple-500 hover:text-purple-700 focus:outline-none text-lg font-bold';
      removeBtn.title = 'Remove filter';
      removeBtn.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <g clip-path="url(#clip0_37271_76180)">
          <path d="M11.2313 1.03137L1.03125 11.2314M1.03125 1.03137L11.2313 11.2314" stroke="#7523FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_37271_76180">
            <rect width="12" height="12" fill="white"/>
          </clipPath>
        </defs>
      </svg><span/>`;
      removeBtn.addEventListener('click', () => item.deselect());

      filterTag.appendChild(label);
      filterTag.appendChild(removeBtn);

      filters.push(filterTag);
    });
  }

  if (filters.length === 0) {
    facetBreadcrumbElement.classList.add('hidden');
    return;
  }
  facetBreadcrumbElement.classList.remove('hidden');

  filters.forEach((el) => container.appendChild(el));

  const clearAllBtn = createEl('button', {
    className:
      'text-black text-sm leading-4 font-medium font-inter flex items-center gap-2 px-3 py-1',
  });
  clearAllBtn.textContent = 'Clear Results';
  clearAllBtn.innerHTML = `<span class="bg-danaherpurple-500 rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3.5 10.5L10.5 3.5M3.5 3.5L10.5 10.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></span> <span>Clear Results</span>`;

  clearAllBtn.addEventListener('click', () => {
    facetBreadcrumb.deselectAll();
    renderBreadcrumbs();
  });

  container.appendChild(clearAllBtn);

  facetBreadcrumbElement.appendChild(container);
}

// === Create Individual Facet Block ===
function createFacet(facet, isFirst = false) {
  const wrapper = createEl('div', { className: 'w-full border-t border-gray-300' });

  const header = createEl('div', {
    className:
      'flex justify-between items-center cursor-pointer select-none w-full p-3 bg-white',
  });

  const title = createEl('div', {
    className: 'text-black text-base leading-[22px] font-bold font-twk',
    text: facet.title,
  });

  const toggleIcon = createEl('span', {
    className: 'facet-toggle-icon text-xl text-purple-600',
    text: isFirst ? '−' : '+',
  });

  header.append(title, toggleIcon);

  const body = createEl('div', {
    className: `facet-body space-y-2 w-full p-3 ${isFirst ? '' : 'hidden'}`,
  });

  const itemsContainer = createEl('div', { className: 'space-y-2 facet-items' });
  body.appendChild(itemsContainer);

  let searchInput;
  const needsSearch = (facet.items?.length ?? 0) > 10 || (facet.state?.valuesAsTrees?.length ?? 0) > 10;

  if (needsSearch) {
    const searchWrapper = createEl('div', {
      className: 'flex h-8 p-1 items-center gap-2 self-stretch border rounded bg-gray-100',
    });

    const searchIcon = createEl('span', {
      className: 'w-4 h-4 text-gray-400',
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" 
             viewBox="0 0 16 16" stroke="currentColor" stroke-width="2" 
             stroke-linecap="round" stroke-linejoin="round">
          <circle cx="7" cy="7" r="5"/>
          <line x1="11" y1="11" x2="15" y2="15"/>
        </svg>`,
    });

    searchInput = createEl('input', {
      attrs: { type: 'text', placeholder: 'Search' },
      className: 'flex-grow text-sm bg-gray-100 outline-none',
    });

    searchWrapper.append(searchIcon, searchInput);
    body.appendChild(searchWrapper);
  }

  // -------------------------
  // 1. HIERARCHICAL rendering
  // -------------------------
  function renderTreeNodes(nodes, level = 0, filterText = '') {
  const container = document.createElement('div');

  nodes.forEach((node) => {
    const labelMatch = node.value.toLowerCase().includes(filterText.toLowerCase());
    const hasMatchingChildren = node.children?.some(child =>
      child.value.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filterText && !labelMatch && !hasMatchingChildren) return;

    const nodeWrapper = createEl('div', {
      className: `ml-${level * 7} cursor-pointer`,
    });

    const label = createEl('div', {
      className: `text-sm text-black font-twk py-1 flex items-center gap-2 ${
        node.state === 'selected' ? 'font-semibold text-indigo-600' : ''
      }`,
      text: `${node.value} (${node.numberOfResults})`,
      events: {
        click: () => {
          facet.toggleSelect(node);
          renderBreadcrumbs()
          render(filterText); // Refresh tree
        },
      }, 
    });

    const arrow = document.createElement("span");
    arrow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
    <path d="M1 1.33341L5.66667 6.00008L1 10.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    nodeWrapper.appendChild(label);

    if (node.children && node.children.length > 0) {
      const arrowBack= `<svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
        <path d="M6 1.33341L1.33333 6.00008L6 10.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`

      label.innerHTML = `${arrowBack} ${node.value} (${node.numberOfResults})`;
      nodeWrapper.appendChild(label);
      label.addEventListener("click", (e) => {
        e.stopPropagation();
        facet.deselectAll();
        renderBreadcrumbs?.();
        render(filterText); // Refresh tree
      });
      const childContainer = renderTreeNodes(node.children, level + 1, filterText);
      nodeWrapper
      nodeWrapper.appendChild(childContainer);
    } else if (node.path.length == 1 ){
      label.appendChild(arrow)
      nodeWrapper.appendChild(label);
    } else if (node.path.length >= 2){
      // nodeWrapper.
    } 

    container.appendChild(nodeWrapper);
  });

  return container;
}


  // -------------------------
  // 2. ORIGINAL checkbox rendering
  // -------------------------
  function renderCheckboxItems(filterText = '') {
    itemsContainer.innerHTML = '';

    const visibleItems = facet.items.filter(item =>
      item.label.toLowerCase().includes(filterText.toLowerCase())
    );

    if (visibleItems.length === 0) {
      const noResults = createEl('div', {
        className: 'text-sm text-gray-500 italic px-2',
        text: 'No results found',
      });
      itemsContainer.appendChild(noResults);
      return;
    }

    visibleItems.forEach((item) => {
      const container = createEl('div');
      const label = createEl('label', {
        className: 'flex items-center gap-2 text-[14px] leading-[20px] font-normal text-black font-twk',
      });

      const checkbox = createEl('input', {
        attrs: {
          type: 'checkbox',
          ...(item.state === 'selected' ? { checked: true } : {}),
        },
        events: {
          change: () => {
            facet.toggleSelect(item);
            renderBreadcrumbs?.();
            render(filterText);
          },
        },
      });

      label.append(checkbox, document.createTextNode(item.label));
      container.appendChild(label);
      itemsContainer.appendChild(container);
    });
  }

  // -------------------------
  // 3. Combined render() switch
  // -------------------------
  function render(filterText = '') {
    itemsContainer.innerHTML = '';

    if (facet.state?.valuesAsTrees && facet.state.valuesAsTrees.length > 0) {
      const tree = renderTreeNodes(facet.state.valuesAsTrees, 0, filterText);
      itemsContainer.appendChild(tree);
    } else {
      renderCheckboxItems(filterText);
    }
  }

  render();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      render(e.target.value);
    });
  }

  header.addEventListener('click', (e) => {
    const hidden = body.classList.toggle('hidden');
    toggleIcon.textContent = hidden ? '+' : '−';
    checkNodes() ;
  });

  wrapper.append(header, body);
  return wrapper;
}

const expandCollapseAll = createEl('button', {
  className:
    'text-[#7523FF] text-right text-[16px] leading-[22px] font-bold hover:underline flex items-center gap-2 ml-auto font-twk',
  html: `<span class="label text-danaherpurple-500">Expand All</span> <span class="arrow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12.6654 6L7.9987 10.6667L3.33203 6" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></span>`,
});

function checkNodes() {
  let panel = document.getElementById('filtersPanel');
  const nodeValues = panel.querySelectorAll('.facet-body');

  const nodesArray = Array.from(nodeValues);

  const allHidden = nodesArray.every(node => node.classList.contains('hidden'));
  const noneHidden = nodesArray.every(node => !node.classList.contains('hidden'));

  if (allHidden) {
    updateExpandCollapseButton();
  } else if (noneHidden) {
    updateExpandCollapseButton();
  }
}

// Helper function: update button label and icon based on hidden state
function updateExpandCollapseButton() {
  let panel = document.getElementById('filtersPanel');
  const bodies = panel.querySelectorAll('.facet-body');
  const allHidden = Array.from(bodies).every((body) => body.classList.contains('hidden'));
  const noneHidden = Array.from(bodies).every((body) => !body.classList.contains('hidden'));

  const labelEl = expandCollapseAll.querySelector('.label');
  const arrowEl = expandCollapseAll.querySelector('.arrow');

  if (allHidden) {
    labelEl.textContent = 'Expand All';
    arrowEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12.6654 6L7.9987 10.6667L3.33203 6" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  } else if (noneHidden) {
    labelEl.textContent = 'Collapse All';
    arrowEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12.6654 10L7.9987 5.33333L3.33203 10" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  // Optionally handle mixed state (some hidden, some visible) if needed
}


// === Create or Update Filters Panel ===
export function createFiltersPanel() {
  // Check if panel exists
  let panel = document.getElementById('filtersPanel');

  // Create modal overlay div
  let modalOverlay = document.getElementById('modalOverlay');
  if (!modalOverlay) {
    modalOverlay = createEl('div', {
      attrs: { id: 'modalOverlay' },
      className: 'fixed inset-0 bg-black bg-opacity-75 z-50 hidden',
    });
    const target = document.getElementsByClassName('pdp-products-wrapper')[0];
    if (target) {
      target.appendChild(modalOverlay);
    }
  }

  if (panel) {
    // Panel exists: update its content
    const body = panel.querySelector('.filters-body');
    const facetData = getFacetDataFromControllers();

    if (body && facetData) {
      body.innerHTML = ''; // Clear existing facets
      facetData.forEach((facet, index) => {
        body.appendChild(createFacet(facet, index === 0)); // first facet open
      });
      // checkNodes(); // Update button state after creating facets
    }
    renderBreadcrumbs();
    return panel;
  }

  // Panel does not exist: create new panel
  panel = createEl('div', {
    className:
      'fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 z-50 flex flex-col items-start gap-3 w-[370px]',
    style: 'width: 374px;', // Fix width so it never changes on expand/collapse
    attrs: { id: 'filtersPanel' },
  });

  panel.style.transform = 'translateX(100%)';
  panel.style.width = '380px';

  // === HEADER ===
  const header = createEl('div', { className: 'w-full px-6 py-6 min-w-[374px]' });

  const headerTop = createEl('div', {
    className: 'flex justify-between items-center w-full',
  });

  const title = createEl('h2', {
    className:
      'font-semibold flex items-center gap-2 text-black text-[32px] leading-[40px] font-normal font-twk',
    html: `<span class="rounded-full bg-danaherpurple-25 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 6V4M12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10M12 6C13.1046 6 14 6.89543 14 8C14 9.10457 13.1046 10 12 10M6 18C7.10457 18 8 17.1046 8 16C8 14.8954 7.10457 14 6 14M6 18C4.89543 18 4 17.1046 4 16C4 14.8954 4.89543 14 6 14M6 18V20M6 14V4M12 10V20M18 18C19.1046 18 20 17.1046 20 16C20 14.8954 19.1046 14 18 14M18 18C16.8954 18 16 17.1046 16 16C16 14.8954 16.8954 14 18 14M18 18V20M18 14V4" stroke="#7523FF" stroke-linecap="round" stroke-linejoin="round"/>
    </svg></span> Filters`,
  });

  const closeBtn = createEl('button', {
    className: 'text-gray-500 hover:text-gray-700 text-xl',
    html: `<span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 18L18 6M6 6L18 18" stroke="#7523FF" stroke-linecap="round" stroke-linejoin="round"/>
    </svg> </span>`,
    events: {
      click() {
        panel.style.transform = 'translateX(100%)';
        modalOverlay.classList.add('hidden');
      },
    },
  });

  headerTop.append(title, closeBtn);

  expandCollapseAll.addEventListener('click', () => {
    const bodies = panel.querySelectorAll('.facet-body');
    const icons = panel.querySelectorAll('.facet-toggle-icon');
    const isExpanding = expandCollapseAll.querySelector('.label').textContent === 'Expand All';

    bodies.forEach((body) => body.classList.toggle('hidden', !isExpanding));
    icons.forEach((icon) => (icon.textContent = isExpanding ? '−' : '+'));
    updateExpandCollapseButton();
  });

  const selectedFiltersBar = createEl('div', {
    className: 'max-w-6xl mx-auto gap-2 flex-wrap mb-1 min-h-[28px] hidden mt-3',
    attrs: { id: 'facet-panel-breadcrumb' },
  });

  header.append(headerTop, expandCollapseAll, selectedFiltersBar);

  // === BODY ===
  const body = createEl('div', {
    className:
      'w-full min-w-[374px] px-6 flex flex-col gap-2 overflow-y-auto space-y-6 filters-body',
  });

  const facetData = getFacetDataFromControllers();
  if (facetData) {
    facetData.forEach((facet, index) => {
      body.appendChild(createFacet(facet, index === 0)); // first facet open
    });
    // checkNodes(); // Update expand/collapse button state after facets render
  }

  // === FOOTER ===
  const footer = createEl('div', {
    className: 'w-full pt-4 px-6 py-6 min-w-[374px]',
  });

  const viewBtn = createEl('button', {
    className:
      'w-full py-2 bg-danaherpurple-500 rounded-full hover:bg-purple-700 text-white text-right text-base leading-[22px] font-normal font-twk',
    events: {
      click() {
        panel.style.transform = 'translateX(100%)';
        modalOverlay.classList.add('hidden');
      },
    },
  });

  let totalResult = 0;
  querySummary.subscribe(() => {
    totalResult = querySummary.state.total;
    viewBtn.innerHTML = `View Results (${totalResult})`;
  });

  footer.appendChild(viewBtn);

  // === ASSEMBLE PANEL ===
  panel.append(header, body, footer);

  const target = document.getElementsByClassName('pdp-products-wrapper')[0];
  if (target) {
    target.appendChild(panel);
  }
  renderBreadcrumbs();

  return panel;
}

// === Initialize Panel and Breadcrumbs on DOMContentLoaded ===
document.addEventListener('DOMContentLoaded', () => {
  const panel = createFiltersPanel();
  panel.style.transform = 'translateX(0)'; // Slide panel in on load
});

// In createFiltersPanel(), after panel creation:

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
    },
    {
      title: 'Brand',
      items: format(brandFacetController.state.values),
      toggleSelect: (value) => brandFacetController.toggleSelect(value),
    },
    {
      title: 'Document Type',
      items: format(documentTypeFacetController.state.values),
      toggleSelect: (value) => documentTypeFacetController.toggleSelect(value),
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
    facet.values.forEach((item) => {
      let fieldName = facet.field;

      if (facet.field === 'categoriesname') {
        fieldName = 'Product Type';
      } else if (facet.field === 'opco') {
        fieldName = 'Brand';
      } else if (facet.field === 'documenttype') {
        fieldName = 'Document Type';
      }
      const displayText = item.value.value === 'binarydata' ? 'eCommerce' : item.value.value;

      const filterTag = createEl('div', {
        className:
          'bg-danaherpurple-50 p-2 rounded-md flex items-center text-sm text-purple-700 font-medium gap-2',
      });

      const label = createEl('span', {
        text: `${fieldName}: ${displayText}`,
      });

      const removeBtn = createEl('button', {
        className:
          'text-purple-500 hover:text-purple-700 focus:outline-none text-lg font-bold',
        html: `<span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <g clip-path="url(#clip0_37271_76180)">
            <path d="M11.2313 1.03137L1.03125 11.2314M1.03125 1.03137L11.2313 11.2314" stroke="#7523FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_37271_76180">
              <rect width="12" height="12" fill="white"/>
            </clipPath>
          </defs>
        </svg><span/>`,
        title: 'Remove filter',
      });

      removeBtn.addEventListener('click', () => {
        item.deselect();
        renderBreadcrumbs();
      });

      filterTag.append(label, removeBtn);
      filters.push(filterTag);
    });
  });

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
    text: isFirst ? '−' : '+', // open first facet
  });

  header.append(title, toggleIcon);

  const body = createEl('div', {
    className: `facet-body space-y-2 w-full p-3 ${isFirst ? '' : 'hidden'}`, // first facet open
  });

  // ✅ Show search only if more than 10 items
  let searchInput;
  if (facet.items.length > 10) {
    const searchWrapper = createEl('div', {
      className:
        'flex h-8 p-1 items-center gap-2 self-stretch border rounded bg-gray-100',
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
      className:
        'flex-grow text-sm bg-gray-100 outline-none focus:outline-none focus:ring-0 focus:border-transparent',
    });

    searchWrapper.append(searchIcon, searchInput);
    body.appendChild(searchWrapper);
  }

  // Items container
  const itemsContainer = createEl('div', { className: 'space-y-2 facet-items' });
  body.appendChild(itemsContainer);

  function renderItems(filterText = '') {
    itemsContainer.innerHTML = ''; // clear

    const visibleItems = facet.items.filter((item) => item.label.toLowerCase().includes(filterText.toLowerCase()));

    if (visibleItems.length === 0) {
      const noResults = createEl('div', {
        className: 'text-sm text-gray-500 italic px-2',
        text: 'No results found',
      });
      itemsContainer.appendChild(noResults);
      return;
    }

    // Recursive function to render an item and its children
    function renderItem(item, level = 0) {
      const container = createEl('div', {
        className: `ml-${level * 4}`, // indent based on level (e.g., ml-4, ml-8, ...)
      });

      const label = createEl('label', {
        className:
        'flex items-center gap-2 text-[14px] leading-[20px] font-normal text-black font-twk',
      });

      const checkbox = createEl('input', {
        attrs: {
          type: 'checkbox',
          ...(item.state === 'selected' ? { checked: true } : {}),
        },
        events: {
          change: () => {
            facet.toggleSelect(item);
            renderBreadcrumbs();
          },
        },
      });

      label.append(checkbox, document.createTextNode(item.label));
      container.appendChild(label);

      // Recursively render children, if any
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          const childEl = renderItem(child, level + 1);
          container.appendChild(childEl);
        });
      }

      return container;
    }

    visibleItems.forEach((item) => {
      const el = renderItem(item);
      itemsContainer.appendChild(el);
    });
  }

  // initial render
  renderItems();

  // attach search listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderItems(e.target.value);
    });
  }

  header.addEventListener('click', () => {
    const hidden = body.classList.toggle('hidden');
    toggleIcon.textContent = hidden ? '+' : '−';
  });

  wrapper.append(header, body);
  return wrapper;
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
    document.body.appendChild(modalOverlay);
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
    }
    renderBreadcrumbs();
    return panel;
  }

  // Panel does not exist: create new panel
  panel = createEl('div', {
    className:
      'fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 z-50 flex flex-col items-start gap-3 p-6 w-[370px]',
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
    className: 'font-semibold flex items-center gap-2 text-black text-[32px] leading-[40px] font-normal font-twk',
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

  const expandCollapseAll = createEl('button', {
    className:
      'text-[#7523FF] text-right text-[16px] leading-[22px] font-bold hover:underline flex items-center gap-2 ml-auto font-twk',
    html: `<span class="label text-danaherpurple-500">Expand All</span> <span class="arrow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12.6654 6L7.9987 10.6667L3.33203 6" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg></span>`,
  });

  expandCollapseAll.addEventListener('click', () => {
    const bodies = panel.querySelectorAll('.facet-body');
    const icons = panel.querySelectorAll('.facet-toggle-icon');
    const isExpanding = expandCollapseAll.querySelector('.label').textContent === 'Expand All';

    bodies.forEach((body) => body.classList.toggle('hidden', !isExpanding));
    icons.forEach((icon) => (icon.textContent = isExpanding ? '−' : '+'));

    expandCollapseAll.querySelector('.label').textContent = isExpanding
      ? 'Collapse All'
      : 'Expand All';
    expandCollapseAll.querySelector('.arrow').innerHTML = isExpanding
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
           <path d="M12.6654 10L7.9987 5.33333L3.33203 10" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
           <path d="M12.6654 6L7.9987 10.6667L3.33203 6" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>`;
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
  }

  // === FOOTER ===
  const footer = createEl('div', {
    className: 'w-full pt-4 px-6 py-6 min-w-[374px]',
  });

  const viewBtn = createEl('button', {
    className: 'w-full py-2 bg-danaherpurple-500 rounded-full hover:bg-purple-700 text-white text-right text-base leading-[22px] font-normal font-twk',
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
  document.body.appendChild(panel);

  renderBreadcrumbs();
  return panel;
}

// === Initialize Panel and Breadcrumbs on DOMContentLoaded ===
document.addEventListener('DOMContentLoaded', () => {
  const panel = createFiltersPanel();
  panel.style.transform = 'translateX(0)'; // Slide panel in on load
});

// In createFiltersPanel(), after panel creation:

/* eslint-disable-next-line import/no-unresolved */
import {
  buildSearchEngine,
  loadContextActions,
  loadPaginationActions,
  loadTabSetActions,
  buildResultList,
  buildPager,
  buildFacet,
} from 'https://static.cloud.coveo.com/headless/v2/headless.esm.js';
import { getProductResponse, getCommerceBase } from '../../scripts/commerce.js';
import { loadScript } from '../../scripts/lib-franklin.js';
import { getCookie, isOTEnabled } from '../../scripts/scripts.js';
import {
  div, img, p, span, h3, a, button, input, strong, label,
} from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const sku = new URL(window.location.href).pathname.split('/').pop();
  const host = window.location.host === 'lifesciences.danaher.com'
    ? window.location.host
    : 'stage.lifesciences.danaher.com';

  const response = await getProductResponse();
  if (!(response?.length && response[0]?.raw?.objecttype === 'Family'
    && response[0]?.raw?.numproducts > 0)) {
    block.innerHTML = '<div class="text-center py-10 text-gray-500">No products found for this family.</div>';
    return;
  }

  block.classList.add('font-sans', 'bg-gray-50', 'py-8');
  const layoutDiv = div({ class: 'max-w-6xl mx-auto flex flex-col gap-6' });
  const resultsGrid = div({ class: 'flex flex-col gap-7' });
  const paginationRow = div({ class: 'pt-5 flex justify-end w-full' });
  layoutDiv.append(resultsGrid);
  block.innerHTML = '';
  block.append(layoutDiv, paginationRow);
  await loadScript('/../../scripts/image-component.js');

  // Build search engine
  const engine = buildSearchEngine({
    configuration: {
      accessToken: window.DanaherConfig.familyProductKey,
      organizationId: window.DanaherConfig.searchOrg,
      search: {
        searchHub: 'DanaherFamilyProductListing',
        pipeline: 'Danaher Family Product Listing',
      },
    },
  });
  engine.dispatch(loadContextActions(engine).setContext({
    familyid: sku,
    host,
    internal: typeof getCookie('exclude-from-analytics') !== 'undefined',
  }));
  engine.dispatch(loadTabSetActions(engine).updateActiveTab('Family'));
  engine.dispatch(loadPaginationActions(engine).registerNumberOfResults(6));

  // Define facets
  const facets = [
    { ctrl: buildFacet(engine, { options: { field: 'categoriesname', facetId: 'categoriesname', numberOfValues: 20 } }), label: 'Product Type' },
    { ctrl: buildFacet(engine, { options: { field: 'opco', facetId: 'opco', numberOfValues: 20 } }), label: 'Brand' },
    { ctrl: buildFacet(engine, { options: { field: 'documenttype', facetId: 'documenttype', numberOfValues: 20 } }), label: 'Document Type' },
  ];
  facets.forEach((f) => f.ctrl.deselectAll());

  const resultList = buildResultList(engine, {
    options: {
      fieldsToInclude: [
        'sku', 'title', 'description', 'richdescription', 'images', 'opco',
        'availability', 'minOrderQuantity', 'packingUnit',
      ],
    },
  });
  const pager = buildPager(engine);

  // -----------------------------
  // Filters bar with dropdowns
  const filtersBar = div({
    class: 'max-w-6xl mx-auto flex gap-5 items-end mb-2 bg-white px-7 py-4 '
           + 'rounded-xl shadow border border-gray-200',
  });
  filtersBar.append(span(
    { class: 'text-base font-semibold mr-3 mt-1 text-gray-900' },
    'All Filters',
  ));

  function makeFacetDropdown(facetCtrl, labelText) {
    const select = document.createElement('select');
    select.className = 'h-[36px] rounded-md border border-gray-300 px-2 text-sm bg-white '
                       + 'min-w-[170px] shadow-sm font-medium';
    select.appendChild(new Option(`All ${labelText}s`, ''));
    facetCtrl.state.values.forEach((val) => {
      select.appendChild(new Option(
        `${val.value} (${val.numberOfResults})`,
        val.value,
      ));
    });
    select.value = facetCtrl.state.values.find((v) => v.state === 'selected')?.value || '';
    select.addEventListener('change', (e) => {
      facetCtrl.deselectAll();
      if (e.target.value) {
        facetCtrl.toggleSelect(
          facetCtrl.state.values.find((v) => v.value === e.target.value),
        );
      }
      engine.executeFirstSearch();
      window.scrollTo({ top: filtersBar.offsetTop - 20, behavior: 'smooth' });
    });
    const wrapper = div({ class: 'grow flex flex-col' });
    wrapper.append(
      label({ class: 'text-xs font-semibold text-gray-600 mb-1 block' }, labelText),
      select,
    );
    return wrapper;
  }

  facets.forEach((facet) => filtersBar.append(makeFacetDropdown(facet.ctrl, facet.label)));
  const openBtn = button({
    class: 'ml-auto px-5 py-2 border bg-gray-100 text-gray-700 font-semibold rounded '
           + 'hover:bg-purple-50 hover:text-purple-700 shadow transition',
    title: 'Show all filter options',
  }, 'Open');
  filtersBar.append(openBtn);
  block.insertBefore(filtersBar, layoutDiv);

  // -----------------------------
  // Selected filter pills bar
  const selectedFiltersBar = div({
    class: 'max-w-6xl mx-auto flex gap-2 flex-wrap mb-1 px-7 min-h-[28px]',
  });
  block.insertBefore(selectedFiltersBar, layoutDiv);

  function renderSelectedFilters() {
    selectedFiltersBar.innerHTML = '';
    let anySelected = false;
    facets.forEach(({ ctrl, label: facetSelectedLabel }) => {
      ctrl.state.values.filter((v) => v.state === 'selected').forEach((selectedVal) => {
        anySelected = true;
        const pill = div(
          {
            class: 'bg-purple-50 px-4 py-1 rounded-full flex items-center text-sm '
                   + 'text-purple-700 font-medium border border-purple-200 gap-2 mr-1 mb-2 shadow',
          },
          span({}, `${facetSelectedLabel}: ${selectedVal.value}`),
          button({
            class: 'ml-1 text-purple-500 hover:text-purple-700 focus:outline-none text-lg font-bold',
            title: 'Remove filter',
          }, '×'),
        );
        pill.querySelector('button').addEventListener('click', () => {
          ctrl.toggleSelect(selectedVal);
          engine.executeFirstSearch();
          window.scrollTo({ top: filtersBar.offsetTop - 20, behavior: 'smooth' });
        });
        selectedFiltersBar.append(pill);
      });
    });
    if (anySelected) {
      const clearPill = button({
        class: 'px-4 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border '
               + 'shadow border-gray-300 hover:bg-purple-50 hover:text-purple-700 transition ml-2 mb-2',
        title: 'Clear all filters',
      }, 'Clear All Filters');
      clearPill.addEventListener('click', () => {
        facets.forEach((f) => f.ctrl.deselectAll());
        engine.executeFirstSearch();
        window.scrollTo({ top: filtersBar.offsetTop - 20, behavior: 'smooth' });
      });
      selectedFiltersBar.append(clearPill);
    }
  }

  // -----------------------------
  // Side drawer panel
  const sidePanel = div({
    class: 'fixed top-0 right-0 w-[370px] h-full bg-white shadow-2xl z-50 p-0 flex flex-col '
           + 'transition-transform duration-300 border-l border-gray-200',
    style: 'transform: translateX(100%)',
  });
  const panelHeader = div(
    { class: 'p-7 pb-2 flex items-center justify-between border-b border-gray-200' },
    h3({ class: 'text-xl font-bold text-gray-800' }, 'All Filters'),
    button({ class: 'text-gray-400 rounded hover:bg-gray-100 text-2xl font-bold px-2 py-1 close-panel' }, '×'),
  );
  sidePanel.append(panelHeader);

  const panelPillsRow = div({ class: 'flex flex-wrap gap-2 mb-5 px-7 pt-3 min-h-[28px]' });
  sidePanel.append(panelPillsRow);

  let panelOpenState = facets.map((_, i) => i === 0);
  const expandBtn = button({
    class: 'mt-1 ml-5 px-3 py-1 rounded border bg-gray-100 text-gray-700 text-xs font-semibold '
           + 'shadow-sm hover:bg-purple-50 hover:text-purple-700 transition',
    style: 'margin-bottom:6px',
  }, 'Expand All');

  function updateExpandBtn() {
    const allOpen = panelOpenState.every((x) => x);
    expandBtn.textContent = allOpen ? 'Collapse All' : 'Expand All';
  }

  expandBtn.addEventListener('click', () => {
    const allOpen = panelOpenState.every((x) => x);
    panelOpenState = panelOpenState.map(() => !allOpen);
    // eslint-disable-next-line no-use-before-define
    renderPanelFacets();
    updateExpandBtn();
  });

  const actionRow = div({
    class: 'flex justify-end items-center border-b pb-2 border-gray-200 mt-1 mb-2 px-7',
  }, expandBtn);
  sidePanel.insertBefore(actionRow, panelPillsRow.nextSibling);

  function renderPanelPills() {
    panelPillsRow.innerHTML = '';
    let anySelected = false;
    facets.forEach(({ ctrl, label: facetLabel }) => {
      ctrl.state.values.filter((v) => v.state === 'selected').forEach((selectedVal) => {
        anySelected = true;
        const pill = div(
          {
            class: 'bg-purple-50 px-4 py-1 rounded-full flex items-center text-xs '
                   + 'text-purple-700 font-medium border border-purple-200 gap-2 mr-1 mb-2 shadow',
          },
          span({}, `${facetLabel}: ${selectedVal.value}`),
          button({ class: 'ml-1 text-purple-500 hover:text-purple-700 focus:outline-none text-base font-bold', title: 'Remove filter' }, '×'),
        );
        pill.querySelector('button').addEventListener('click', () => {
          ctrl.toggleSelect(selectedVal);
          engine.executeFirstSearch();
        });
        panelPillsRow.append(pill);
      });
    });
    if (anySelected) {
      const clearBtn = button({
        class: 'px-4 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border shadow '
               + 'border-gray-300 hover:bg-purple-50 hover:text-purple-700 ml-2 mb-2',
        title: 'Clear all filters',
      }, 'Clear All');
      clearBtn.addEventListener('click', () => {
        facets.forEach((f) => f.ctrl.deselectAll());
        engine.executeFirstSearch();
      });
      panelPillsRow.append(clearBtn);
    }
  }

  function labelEl(opts, text) {
    const el = document.createElement('label');
    Object.entries(opts).forEach(([k, v]) => el.setAttribute(k, v));
    el.textContent = text;
    return el;
  }

  const panelBody = div({ class: 'flex-1 overflow-y-auto px-7 pb-5 pt-2' });
  sidePanel.append(panelBody);

  function renderPanelFacets() {
    panelBody.innerHTML = '';
    facets.forEach(({ ctrl, label: facetLabel }, idx) => {
      const expanded = !!panelOpenState[idx];
      const container = div({ class: 'mb-3 border-b border-gray-100 pb-1' });
      const accBtn = button(
        { class: 'flex items-center justify-between w-full text-left py-2 focus:outline-none', 'aria-expanded': expanded },
        span({ class: 'font-semibold text-sm text-gray-800 mr-2' }, facetLabel),
        span({}, expanded ? '▲' : '▼'),
      );
      accBtn.addEventListener('click', () => {
        panelOpenState[idx] = !panelOpenState[idx];
        // eslint-disable-next-line no-use-before-define
        renderPanelFacets();
        updateExpandBtn();
      });
      container.append(accBtn);
      if (expanded) {
        (ctrl.state.values || []).forEach((val) => {
          const id = `sidepanel-facet-${facetLabel}-${val.value}`;
          const checkEl = input({
            type: 'checkbox',
            id,
            checked: val.state === 'selected',
            class: 'accent-purple-600 w-4 h-4',
          });
          checkEl.addEventListener('change', () => {
            ctrl.toggleSelect(val);
            engine.executeFirstSearch();
          });
          container.append(div(
            { class: 'flex items-center gap-3 py-1' },
            checkEl,
            labelEl({ for: id, class: 'cursor-pointer text-xs text-gray-700' }, `${val.value} (${val.numberOfResults})`),
          ));
        });
      }
      panelBody.append(container);
    });
    updateExpandBtn();
  }

  const panelFooter = div({
    class: 'border-t border-gray-200 p-7 pt-4 flex justify-end items-center bg-white shadow-inner',
  });
  const viewBtn = button({
    class: 'results-count px-5 py-2 rounded bg-purple-700 text-white font-semibold shadow hover:bg-purple-800 transition',
    type: 'button',
  }, 'View Results (0)');
  panelFooter.append(viewBtn);
  sidePanel.append(panelFooter);

function updateViewCount() {
  let total = 0;
  const response = engine.state.search.response;

  if (response) {
    if (typeof response.totalCountFiltered === 'number') {
      total = response.totalCountFiltered;
    } else if (typeof response.totalCount === 'number') {
      total = response.totalCount;
    }
  }

  viewBtn.textContent = `View Results (${total})`;
}


  // -----------------------------
  // Drawer open/close
  openBtn.addEventListener('click', () => {
    panelOpenState = facets.map((_, i) => i === 0);
    renderPanelPills();
    renderPanelFacets();
    updateViewCount();
    sidePanel.style.transform = 'translateX(0)';
    document.body.append(sidePanel);
  });
  panelHeader.querySelector('.close-panel').addEventListener('click', () => {
    sidePanel.style.transform = 'translateX(100%)';
    setTimeout(() => sidePanel.remove(), 320);
  });
  viewBtn.addEventListener('click', () => {
    sidePanel.style.transform = 'translateX(100%)';
    setTimeout(() => sidePanel.remove(), 320);
    window.scrollTo({ top: filtersBar.offsetTop - 20, behavior: 'smooth' });
  });

  // -----------------------------
  // Results and pagination
  async function buildProductTile(result) {
    let product = {};
    if (result.raw?.sku) {
      try {
        product = await (await fetch(`${getCommerceBase()}/products/${result.raw.sku}`)).json();
      } catch (err) {
        // Ignore fetch errors — product info not mandatory
      }
    }
    const hasPrice = () => product?.salePrice && product.salePrice?.value > 0;
    const formatCurrency = (v, c) => (
      v ? new Intl.NumberFormat('en-US', { style: 'currency', currency: (c || 'USD') }).format(v) : ''
    );
    return div(
      { class: 'flex flex-row bg-white rounded-xl shadow border p-7 gap-7' },
      div(
        { class: 'flex-none w-[110px] flex justify-center' },
        img({ src: result.raw.images?.[0] || '', alt: result.title || '', class: 'w-[110px] h-[82px] object-contain border rounded bg-gray-50' }),
      ),
      div(
        { class: 'flex-1 flex flex-col' },
        h3({ class: 'font-semibold text-lg mb-1' }, result.title || ''),
        p({ class: 'text-sm text-gray-700 mb-2 truncate' }, result.raw.richdescription || result.raw.description || ''),
        div({ class: 'text-xs text-gray-500 mb-3' }, strong('SKU:'), ' ', result.raw.sku),
        a({ href: result.clickUri, class: 'text-indigo-700 underline text-xs font-medium mb-2' }, 'View Details →'),
      ),
      div(
        { class: 'flex flex-col gap-2 min-w-[180px]' },
        h3(
          { class: hasPrice() ? 'text-xl font-bold text-purple-700' : 'text-xl font-bold text-gray-500' },
          hasPrice() ? formatCurrency(product.salePrice?.value, product.salePrice?.currencyMnemonic) : 'Request for Price',
        ),
        hasPrice() && span({ class: 'text-xs text-gray-500' }, `(${product.salePrice?.currencyMnemonic || 'USD'})`),
        div({ class: 'text-xs text-gray-600' }, 'Availability: ', span({ class: 'font-semibold text-green-700' }, product?.availability || result.raw?.availability || 'Available')),
        div({ class: 'text-xs text-gray-600' }, 'UOM: ', span({ class: 'font-semibold' }, `${product?.minOrderQuantity || '1'}/${product?.packingUnit || 'Bundle'}`)),
        div({ class: 'text-xs text-gray-600' }, 'Min. Qty: ', span({ class: 'font-semibold' }, `${product?.minOrderQuantity || '50'}`)),
        div(
          { class: 'flex gap-2 mt-3' },
          input({
            type: 'number', min: 1, value: '1', class: 'border rounded w-14 text-center text-sm',
          }),
          hasPrice() && button({ class: 'px-5 py-2 bg-white border rounded text-sm hover:bg-gray-100' }, 'Buy'),
          button({ class: 'px-5 py-2 bg-purple-700 text-white rounded text-sm hover:bg-purple-800' }, 'Quote'),
        ),
      ),
    );
  }

  async function renderResults() {
    resultsGrid.innerHTML = '';
    const { results } = resultList.state;
    if (!results.length) {
      resultsGrid.append(div({ class: 'text-center text-gray-400 py-11' }, 'No products found'));
      return;
    }
    const tiles = await Promise.all(results.map((r) => buildProductTile(r)));
    const frag = document.createDocumentFragment();
    tiles.forEach((tile) => frag.append(tile));
    resultsGrid.innerHTML = '';
    resultsGrid.append(frag);
  }

  function renderPagination() {
    paginationRow.innerHTML = '';
    if (!pager.state || !pager.state.currentPages.length) return;
    const totalCount = typeof pager.state.totalEntries === 'number'
      && Number.isFinite(pager.state.totalEntries)
      ? pager.state.totalEntries
      : 0;
    const pagerDiv = div(
      { class: 'flex items-center bg-white rounded-xl shadow-lg border px-7 py-6 mt-7 w-full' },
      span(
        { class: 'text-base text-gray-500 font-medium mr-auto' },
      ),
    );
    const prevBtn = button({
      class: pager.state.hasPreviousPage
        ? 'px-5 py-2 rounded-lg font-semibold border bg-white text-gray-600 hover:bg-gray-100 mr-2'
        : 'px-5 py-2 rounded-lg font-semibold border opacity-60 cursor-not-allowed mr-2',
    }, 'Previous');
    prevBtn.addEventListener('click', () => {
      if (pager.state.hasPreviousPage) {
        pager.previousPage();
        window.scrollTo({ top: filtersBar.offsetTop - 20, behavior: 'smooth' });
      }
    });
    pagerDiv.append(prevBtn);

    pager.state.currentPages.forEach((pg) => {
      const isActive = pg === pager.state.currentPage;
      const pgBtn = button({
        class: isActive
          ? 'px-4 py-2 mx-1 rounded-lg font-semibold border bg-purple-700 text-white'
          : 'px-4 py-2 mx-1 rounded-lg font-semibold border bg-white text-gray-700 hover:bg-purple-50',
      }, pg);
      pgBtn.addEventListener('click', () => {
        if (pg !== pager.state.currentPage) {
          pager.selectPage(pg);
          window.scrollTo({ top: filtersBar.offsetTop - 20, behavior: 'smooth' });
        }
      });
      pagerDiv.append(pgBtn);
    });

    const nextBtn = button({
      class: pager.state.hasNextPage
        ? 'px-5 py-2 rounded-lg font-semibold border bg-white text-gray-600 hover:bg-gray-100 ml-2'
        : 'px-5 py-2 rounded-lg font-semibold border opacity-60 cursor-not-allowed ml-2',
    }, 'Next');
    nextBtn.addEventListener('click', () => {
      if (pager.state.hasNextPage) {
        pager.nextPage();
        window.scrollTo({ top: filtersBar.offsetTop - 20, behavior: 'smooth' });
      }
    });
    pagerDiv.append(nextBtn);
    paginationRow.append(pagerDiv);
  }

  // -----------------------------
  // Subscriptions
  resultList.subscribe(() => {
    renderResults();
    renderPagination();
    renderSelectedFilters();
    if (document.body.contains(sidePanel)) {
      renderPanelPills();
      renderPanelFacets();
      updateViewCount();
    }
  });
  pager.subscribe(() => {
    if (document.body.contains(sidePanel)) updateViewCount();
  });
  facets.forEach(({ ctrl }, idx) => {
    ctrl.subscribe(() => {
      filtersBar.replaceChild(
        makeFacetDropdown(ctrl, facets[idx].label),
        filtersBar.childNodes[idx + 1],
      );
      renderSelectedFilters();
      if (document.body.contains(sidePanel)) {
        renderPanelPills();
        renderPanelFacets();
        updateViewCount();
      }
    });
  });

  engine.dispatch(loadPaginationActions(engine).updateNumberOfResults(6));
  engine.executeFirstSearch();
  if (!isOTEnabled()) engine.disableAnalytics();

  block.id = 'products-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
}

/* eslint-disable */
import {
  loadContextActions,
  loadPaginationActions,
  loadTabSetActions,
} from 'https://static.cloud.coveo.com/headless/v2/headless.esm.js';

import {
  getProductResponse,
  getCommerceBase,
} from '../../scripts/commerce.js';

import { loadScript } from '../../scripts/lib-franklin.js';
import { getCookie } from '../../scripts/scripts.js';

import {
  div, img, p, span, h3, a, button, input, strong,
} from '../../scripts/dom-builder.js';

import { renderCreateFacet } from '../../scripts/coveo/pdp-listing/components/pdp-facets.js';
import { pdpEngine } from '../../scripts/coveo/pdp-listing/pdp-engine.js';
import { createFiltersPanel } from '../../scripts/coveo/pdp-listing/components/pdp-side-panel.js';
import { pdpResultList, querySummary } from '../../scripts/coveo/pdp-listing/controllers/pdp-controllers.js';
import { renderFacetBreadcurm } from '../../scripts/coveo/pdp-listing/components/pdp-facet-breadcrumb.js';
import { renderResults } from '../../scripts/coveo/pdp-listing/components/pdp-resultlist.js';
import renderPagination from '../../scripts/coveo/pdp-listing/components/pdp-pagination.js';

// DOM builder helpers
const domHelpers = {
  div, img, h3, p, strong, a, span, input, button,
};

function createHeading(title = 'Products') {
  const heading = document.createElement('h3');
  heading.textContent = title;
  return heading;
}

function createFiltersContainer() {
  const filters = document.createElement('div');
  filters.id = 'filters-container';
  filters.className = 'py-6';
  return filters;
}

function createSelectedFiltersBar() {
  return div({
    class: 'max-w-6xl mx-auto gap-2 flex-wrap mb-6 min-h-[28px] p-3',
    id: 'facet-breadcrumb',
    style: 'background:#F9FAFB;',
  });
}

function createLayout(block) {
  block.classList.add('font-sans', 'py-8');
  block.innerHTML = '';

  const layoutDiv = div({ class: 'max-w-6xl mx-auto flex flex-col gap-6' });
  const resultSummary = div({ class: 'text-black text-2xl font-twk' });
  const resultsGrid = div({ class: 'flex flex-col gap-4' });
  const paginationRow = div({ class: 'flex justify-end w-full', id: 'pagination' });

  querySummary.subscribe(() => {
    resultSummary.innerHTML = `${querySummary.state.total} Results`;
  });

  layoutDiv.append(resultSummary, resultsGrid);
  block.append(layoutDiv, paginationRow);

  return { layoutDiv, resultsGrid, paginationRow };
}

async function displayProducts(resultsGrid) {
  const { results } = pdpResultList.state;

  await renderResults({
    results,
    getCommerceBase,
    domHelpers,
    resultsGrid,
  });
}

function setupCoveoContext(sku, host) {
  const internal = typeof getCookie('exclude-from-analytics') !== 'undefined';

  pdpEngine.dispatch(
    loadContextActions(pdpEngine).setContext({ familyid: sku, host, internal }),
  );

  pdpEngine.dispatch(loadTabSetActions(pdpEngine).updateActiveTab('Family'));
  pdpEngine.dispatch(loadPaginationActions(pdpEngine).registerNumberOfResults(6));
  pdpEngine.executeFirstSearch();
}

function subscribeToEngineUpdates(resultsGrid) {
  pdpEngine.subscribe(() => {
    renderPagination();
    renderFacetBreadcurm();
    renderCreateFacet();
    createFiltersPanel();
  });

  pdpResultList.subscribe(()=>{
    displayProducts(resultsGrid);
  })

}

// Main function
export default async function decorate(block) {
  const sku = new URL(window.location.href).pathname.split('/').pop();
  const host = window.location.host === 'lifesciences.danaher.com'
    ? window.location.host
    : 'stage.lifesciences.danaher.com';

  const response = await getProductResponse();

  // Early exit if no valid product response
  if (!(response?.length && response[0]?.raw?.objecttype === 'Family' && response[0]?.raw?.numproducts > 0)) {
    block.innerHTML = '<div class="text-center py-10 text-gray-500">No products found for this family.</div>';
    return;
  }

  const heading = createHeading();
  const filtersContainer = createFiltersContainer();
  const selectedFiltersBar = createSelectedFiltersBar();
  const { layoutDiv, resultsGrid } = createLayout(block);

  block.insertBefore(heading, layoutDiv);
  block.insertBefore(filtersContainer, layoutDiv);
  block.insertBefore(selectedFiltersBar, layoutDiv);

  block.id = 'products-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';

  await loadScript('/../../scripts/image-component.js');

  createFiltersPanel();
  setupCoveoContext(sku, host);
  subscribeToEngineUpdates(resultsGrid);
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

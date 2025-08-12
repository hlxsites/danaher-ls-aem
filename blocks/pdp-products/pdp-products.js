/* eslint-disable import/no-unresolved */
//import ProductTile from './product-tile.js';
import { loadScript } from '../../scripts/lib-franklin.js';
import { getCookie, isOTEnabled } from '../../scripts/scripts.js';
import { getProductResponse } from '../../scripts/commerce.js';

import {
  buildSearchEngine,
  loadContextActions,
  loadPaginationActions,
  loadTabSetActions,
  loadSearchConfigurationActions,
  buildResultList,
  buildFacet,
  buildPager
} from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';
import { div } from '../../scripts/dom-builder.js';

//customElements.define('product-tile', ProductTile);

export default async function decorate(block) {
  const sku = new URL(window.location.href).pathname.split('/').pop();
  const host = (window.location.host === 'lifesciences.danaher.com')
    ? window.location.host
    : 'stage.lifesciences.danaher.com';

  const response = await getProductResponse();
  if (!(response?.length > 0 &&
        response[0]?.raw?.objecttype === 'Family' &&
        response[0]?.raw?.numproducts > 0)) {
    return;
  }

  block.classList.add('pt-10');

  // Basic layout — you will style as needed
  block.innerHTML = `
    <div id="facets"></div>
    <div id="results"></div>
    <div id="pager"></div>
    <div id="status"></div>
  `;

  await loadScript('/../../scripts/image-component.js');

  const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';

  // Initialize Headless engine (no reducers param needed)
  const engine = buildSearchEngine({
    configuration: {
      accessToken: window.DanaherConfig.familyProductKey,
      organizationId: window.DanaherConfig.searchOrg,
      search: {
        searchHub: 'DanaherFamilyProductListing',
        pipeline: 'Danaher Family Product Listing',
    },
    }
  });

  // Update Search Configuration
  const searchConfig = loadSearchConfigurationActions(engine);
 

  // Context for family product listing
  engine.dispatch(loadContextActions(engine).setContext({
    familyid: sku,
    host,
    internal: isInternal,
  }));

  // Active tab
  engine.dispatch(loadTabSetActions(engine).updateActiveTab('Family'));

  // Pagination
  engine.dispatch(loadPaginationActions(engine).registerNumberOfResults(20));

  // Controllers
  const resultList = buildResultList(engine);
  const brandFacet = buildFacet(engine, { options: { field: 'opco', label: 'Brand' } });
  const docTypeFacet = buildFacet(engine, { options: { field: 'documenttype', label: 'Document Type' } });
  const pager = buildPager(engine);

  // Subscribe to render
  resultList.subscribe(() => renderResults(resultList.state.results));
  brandFacet.subscribe(() => renderFacet('Brand', brandFacet.state));
  docTypeFacet.subscribe(() => renderFacet('Document Type', docTypeFacet.state));
  pager.subscribe(() => renderPager(pager.state));

  // Disable analytics if OT not enabled
  if (!isOTEnabled()) {
    engine.dispatch(searchConfig.disableAnalytics());
  }

  // Run the first search
  engine.executeFirstSearch();

    block.id = 'products-tab';
  block.append(div({ class: 'block-pdp-products' }, 'PDP Products Block'));
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

// Utility: fetch org endpoints
async function fetchOrgEndpoints(orgId) {
  const res = await fetch(
    `https://platform.cloud.coveo.com/rest/organizations/${orgId}/publicEndpoints`
  );
  return res.json();
}

// Simple results renderer (uses your product-tile)
function renderResults(results) {
  const container = document.getElementById('results');
  if (!results.length) {
    container.innerHTML = `<p>No products found.</p>`;
    return;
  }
  container.innerHTML = results
    .map(() => `
      <div class="tile-wrapper">
        <product-tile></product-tile>
      </div>
    `)
    .join('');
}

// Simple facet renderer
function renderFacet(label, state) {
  const container = document.getElementById('facets');
  const facetEl = document.createElement('div');
  facetEl.className = 'facet';
  facetEl.innerHTML = `
    <h3>${label}</h3>
    ${state.values.map(v => `
      <div>
        <label>
          <input type="checkbox" data-value="${v.value}" ${v.state === 'selected' ? 'checked' : ''}>
          ${v.value} (${v.numberOfResults})
        </label>
      </div>
    `).join('')}
  `;
  container.appendChild(facetEl);
}

// Simple pager renderer
function renderPager(state) {
  const pagerContainer = document.getElementById('pager');
  pagerContainer.innerHTML = `
    <div>
      Page ${state.currentPage} of ${state.maxPage}
    </div>
  `;
}

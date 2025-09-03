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

import { decorateIcons, loadScript } from '../../scripts/lib-franklin.js';
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

function createLayout(block, viewType) {
  block.classList.add('font-sans', 'py-8');
  block.innerHTML = '';

  const layoutDiv = div({ class: 'max-w-6xl mx-auto flex flex-col gap-6' });
  const resultSummary = div(
    { class: 'flex justify-between' },
    div({
      class: 'text-black text-2xl font-twk',
      id: 'resultSummaryCount',
    }),
  );
  const resultsList = div({ class: 'flex flex-col gap-4', id: 'resultsList' });
  const paginationRow = div({ class: 'flex justify-end w-full', id: 'pagination' });

  querySummary.subscribe(() => {
    resultSummary.querySelector('#resultSummaryCount').innerHTML = `${querySummary.state.total} Results`;
  });

  layoutDiv.append(resultSummary, resultsList);
  block.append(layoutDiv, paginationRow);

  return { layoutDiv, resultsList, paginationRow };
}

async function displayProducts(resultsList, viewType) {
  const { results, isLoading } = pdpResultList.state;
  if (results?.length > 0 && !isLoading) {
    await renderResults({
      results,
      getCommerceBase,
      domHelpers,
      resultsList,
      viewType,
    });
  }

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

function subscribeToEngineUpdates(resultsList) {

  pdpEngine.subscribe(() => {
    renderPagination();
    renderFacetBreadcurm();
    renderCreateFacet();
    createFiltersPanel();
  });

  pdpResultList.subscribe(() => {
    if (pdpResultList?.state?.results?.length > 0 && !pdpResultList?.state?.isLoading) {
      const viewType = localStorage.getItem('pdpListViewType') ?? 'list';
      displayProducts(resultsList, viewType);
    }
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
  const { layoutDiv, resultsList } = createLayout(block);

  block.insertBefore(heading, layoutDiv);
  block.insertBefore(filtersContainer, layoutDiv);
  block.insertBefore(selectedFiltersBar, layoutDiv);

  block.id = 'products-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';

  /*
  *
  :::::::::::::: adding list and grid view buttons :::::::::::::::::::::
  *
  */

  const viewModeGroup = div({ class: 'flex justify-start items-center gap-0' });

  const listBtn = div(
    {
      class: `px-3 py-2  rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] ${localStorage.getItem('pdpListViewType') === 'list' ? 'bg-danaherpurple-500' : 'bg-white'} outline-danaherpurple-500 flex justify-center items-center overflow-visible cursor-pointer z-10`,
    },
    div(
      { class: 'w-5 h-5 flex justify-center items-center' },
      span({
        class:
          `icon icon-view-list w-6 h-6 fill-current  ${localStorage.getItem('pdpListViewType') === 'list' ? 'text-white [&_svg>use]:stroke-white' : 'text-gray-600 [&_svg>use]:stroke-gray-600'}`,
      }),
    ),
  );

  const gridBtn = div(
    {
      class: `px-3 py-2  ${localStorage.getItem('pdpListViewType') === 'grid' ? 'bg-danaherpurple-500' : 'bg-white'}  rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-visible cursor-pointer z-10`,
    },
    div(
      { class: 'w-5 h-5 flex justify-center items-center' },
      span({
        class:
          `icon icon-view-grid w-6 h-6 fill-current ${localStorage.getItem('pdpListViewType') === 'grid' ? 'text-white [&_svg>use]:stroke-white' : 'text-gray-600 [&_svg>use]:stroke-gray-600'}`,
      }),
    ),
  );

  viewModeGroup.append(listBtn, gridBtn);
  decorateIcons(viewModeGroup);
  layoutDiv?.querySelector('#resultSummaryCount')?.insertAdjacentElement('afterend', viewModeGroup);

  // click action for list view
  listBtn.addEventListener('click', () => {
    listBtn.classList.replace('bg-white', 'bg-danaherpurple-500');
    listBtn
      .querySelector('.icon')
      .classList.replace('text-gray-600', 'text-white');
    listBtn
      .querySelector('.icon')
      .classList.replace(
        '[&_svg>use]:stroke-gray-600',
        '[&_svg>use]:stroke-white',
      );
    gridBtn.classList.replace('bg-danaherpurple-500', 'bg-white');
    gridBtn
      .querySelector('.icon')
      .classList.replace('text-white', 'text-gray-600');
    gridBtn
      .querySelector('.icon')
      .classList.replace(
        '[&_svg>use]:stroke-white',
        '[&_svg>use]:stroke-gray-600',
      );
    if (resultsList?.classList.contains('flex-wrap')) {
      resultsList?.classList.remove('flex-wrap');
      resultsList?.classList.add('flex-col');
    }
    localStorage.setItem('pdpListViewType', 'list');
    
    subscribeToEngineUpdates(resultsList);
  });

  // click action for grid view
  gridBtn.addEventListener('click', () => {
    gridBtn.classList.replace('bg-white', 'bg-danaherpurple-500');
    gridBtn
      .querySelector('.icon')
      .classList.replace('text-gray-600', 'text-white');
    gridBtn
      .querySelector('.icon')
      .classList.replace(
        '[&_svg>use]:stroke-gray-600',
        '[&_svg>use]:stroke-white',
      );
    listBtn.classList.replace('bg-danaherpurple-500', 'bg-white');
    listBtn
      .querySelector('.icon')
      .classList.replace('text-white', 'text-gray-600');
    listBtn
      .querySelector('.icon')
      .classList.replace(
        '[&_svg>use]:stroke-white',
        '[&_svg>use]:stroke-gray-600',
      );
    if (resultsList?.classList.contains('flex-col')) {
      resultsList?.classList.remove('flex-col');
      resultsList?.classList.add('flex-wrap');
    }
    localStorage.setItem('pdpListViewType', 'grid');
    subscribeToEngineUpdates(resultsList);
  });

  await loadScript('/../../scripts/image-component.js');

  createFiltersPanel();
  setupCoveoContext(sku, host);
    const viewType = localStorage.getItem('pdpListViewType') ?? 'list';
    if (resultsList?.classList.contains('flex-col') && viewType === 'grid') {
      resultsList?.classList.remove('flex-col');
      resultsList?.classList.add('flex-wrap');
    }
    
    subscribeToEngineUpdates(resultsList);
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

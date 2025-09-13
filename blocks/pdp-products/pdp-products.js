/* eslint-disable */
import {
  loadContextActions,
  loadPaginationActions,
  loadTabSetActions,
} from 'https://static.cloud.coveo.com/headless/v2/headless.esm.js';

import {
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

function createLayout(block) {
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
  const resultsGrid = div({ class: 'flex flex-col gap-4' });
  const paginationRow = div({ class: 'flex justify-end w-full', id: 'pagination' });

  querySummary.subscribe(() => {
    resultSummary.querySelector('#resultSummaryCount').innerHTML = `${querySummary.state.total} Results`;
  });

  layoutDiv.append(resultSummary, resultsGrid);
  block.append(layoutDiv, paginationRow);

  return { layoutDiv, resultsGrid, paginationRow };
}

async function displayProducts(resultsGrid, viewType) {
  const { results, isLoading } = pdpResultList.state;
  if (results?.length > 0 && !isLoading) {
    await renderResults({
      results,
      getCommerceBase,
      domHelpers,
      resultsGrid,
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

function subscribeToEngineUpdates(resultsGrid) {
  pdpEngine.subscribe(() => {
    renderPagination();
    renderFacetBreadcurm();
    renderCreateFacet();
    createFiltersPanel();
  });

  pdpResultList.subscribe(() => {
    if (pdpResultList?.state?.results?.length > 0 && !pdpResultList?.state?.isLoading) {
      const viewType = localStorage.getItem('pdpListViewType') ?? 'list';
      displayProducts(resultsGrid, viewType);
    }
  });
}

// Main function
export default async function decorate(block) {
  const sku = new URL(window.location.href).pathname.split('/').pop();
  const host = window.location.host === 'lifesciences.danaher.com'
    ? window.location.host
    : 'stage.lifesciences.danaher.com';

  const response = JSON.parse(localStorage.getItem('eds-product-details'));

  // Early exit if no valid product response
  if (!(response !== null && response !== undefined && response?.raw?.objecttype === 'Family' && response?.raw?.numproducts > 0)) {
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

  /*
  *
  :::::::::::::: adding list and grid view buttons :::::::::::::::::::::
  *
  */

  const viewModeGroup = div({ class: 'flex justify-start items-center gap-0' });

  const listBtn = div(
    {
      class: `px-3 py-2  rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] ${((localStorage.getItem('pdpListViewType') === 'list') || !localStorage.getItem('pdpListViewType')) ? 'bg-danaherpurple-500' : 'bg-white'} outline-danaherpurple-500 flex justify-center items-center overflow-visible cursor-pointer z-10`,
    },
    div(
      { class: 'w-5 h-5 flex justify-center items-center' },
      span({
        class:
          `icon icon-view-list w-6 h-6 fill-current  ${(localStorage.getItem('pdpListViewType') === 'list') || !localStorage.getItem('pdpListViewType') ? 'text-white [&_svg>use]:stroke-white' : 'text-gray-600 [&_svg>use]:stroke-gray-600'}`,
      }),
    ),
  );

  const gridBtn = div(
    {
      class: `px-3 py-2  ${((localStorage.getItem('pdpListViewType') === 'grid') && localStorage.getItem('pdpListViewType')) ? 'bg-danaherpurple-500' : 'bg-white'}  rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-visible cursor-pointer z-10`,
    },
    div(
      { class: 'w-5 h-5 flex justify-center items-center' },
      span({
        class:
          `icon icon-view-grid w-6 h-6 fill-current ${(localStorage.getItem('pdpListViewType') === 'grid') && localStorage.getItem('pdpListViewType') ? 'text-white [&_svg>use]:stroke-white' : 'text-gray-600 [&_svg>use]:stroke-gray-600'}`,
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
    gridBtn.querySelector('.icon')?.classList.replace('text-white', 'text-gray-600');
    gridBtn.querySelector('.icon')?.classList.replace(
      '[&_svg>use]:stroke-white',
      '[&_svg>use]:stroke-gray-600',
    );
    if (resultsGrid?.classList.contains('flex-wrap')) {
      resultsGrid?.classList.remove('flex-wrap');
      resultsGrid?.classList.add('flex-col');
    }
    localStorage.setItem('pdpListViewType', 'list');

    subscribeToEngineUpdates(resultsGrid);
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
    listBtn?.classList?.replace('bg-danaherpurple-500', 'bg-white');
    listBtn?.querySelector('.icon')?.classList.replace('text-white', 'text-gray-600');
    listBtn?.querySelector('.icon')?.classList.replace(
      '[&_svg>use]:stroke-white',
      '[&_svg>use]:stroke-gray-600',
    );
    if (resultsGrid?.classList.contains('flex-col')) {
      resultsGrid?.classList.remove('flex-col');
      resultsGrid?.classList.add('flex-wrap');
    }
    localStorage.setItem('pdpListViewType', 'grid');
    subscribeToEngineUpdates(resultsGrid);
  });

  await loadScript('/../../scripts/image-component.js');

  createFiltersPanel();
  setupCoveoContext(sku.replace('.html', ''), host);
  const viewType = localStorage.getItem('pdpListViewType') ?? 'list';
  if (resultsGrid?.classList.contains('flex-col') && viewType === 'grid') {
    resultsGrid?.classList.remove('flex-col');
    resultsGrid?.classList.add('flex-wrap');
  }
  subscribeToEngineUpdates(resultsGrid);
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));

  // Performance enhancement wrapper for products - advanced optimization
  (function enhanceProductsPerformance() {
    // Enhanced async version for products
    window.pdpProductsDecorateAsync = async function (wBlock) {
      // Show enhanced loading state immediately
      wBlock.innerHTML = '<div class="products-loading">Loading products...</div>';

      // Add enhanced performance CSS for products
      if (!document.querySelector('#products-perf-enhance')) {
        const style = document.createElement('style');
        style.id = 'products-perf-enhance';
        style.textContent = `
          .pdp-products{contain:layout style paint;transform:translateZ(0);will-change:auto}
          .products-grid{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));contain:layout;max-width:100%}
          .product-item{contain:layout style;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);transition:all 0.3s ease;transform:translateZ(0);backface-visibility:hidden}
          .product-item:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 8px 24px rgba(0,0,0,0.15)}
          .pdp-products img{width:100%;height:250px;object-fit:cover;contain:layout;background:#f8f9fa;display:block;transition:transform 0.3s ease}
          .product-item:hover img{transform:scale(1.05)}
          .product-content{padding:1.5rem;contain:layout}
          .product-title{font-size:1.3rem;font-weight:700;margin-bottom:0.75rem;color:#1a202c;contain:layout;line-height:1.3}
          .product-description{color:#4a5568;line-height:1.6;margin-bottom:1rem;contain:layout}
          .product-price{font-size:1.1rem;font-weight:600;color:#3182ce;contain:layout}
          .product-badge{position:absolute;top:1rem;right:1rem;background:#e53e3e;color:white;padding:0.25rem 0.75rem;border-radius:20px;font-size:0.875rem;font-weight:500}
          .products-loading{min-height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#666;font-size:1.2rem;background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:productsShimmer 1.8s infinite;border-radius:8px}
          @keyframes productsShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
          @media (max-width:767px){.products-grid{grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem}.pdp-products img{height:200px}.product-item:hover{transform:translateY(-2px) scale(1.01)}}
          @media (min-width:768px) and (max-width:1023px){.products-grid{grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}}
        `;
        document.head.appendChild(style);
      }

      const startTime = performance.now();

      try {
        // Process products asynchronously with advanced batching
        await new Promise((resolve) => {
          requestAnimationFrame(async () => {
            const products = [...wBlock.querySelectorAll(':scope > *:not(.products-loading)')];

            if (products.length === 0) {
              wBlock.innerHTML = '<div style="padding:3rem;text-align:center;color:#666;font-size:1.1rem;">No products available</div>';
              resolve();
              return;
            }

            const productsGrid = document.createElement('div');
            productsGrid.className = 'products-grid';

            // Process products in optimized batches
            const batchSize = 6;
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < products.length; i += batchSize) {
              const batch = products.slice(i, i + batchSize);

              // Process each batch asynchronously
              await new Promise((batchResolve) => {
                requestAnimationFrame(() => {
                  batch.forEach((product, batchIndex) => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';
                    productItem.style.position = 'relative';

                    // Enhanced image optimization
                    const imgEle = product.querySelector('img');
                    if (imgEle) {
                      const absoluteIndex = i + batchIndex;
                      imgEle.loading = absoluteIndex < 6 ? 'eager' : 'lazy';
                      imgEle.decoding = 'async';
                      imgEle.style.aspectRatio = '4/3';
                      imgEle.style.width = '100%';
                      imgEle.style.height = 'auto';
                      imgEle.style.objectFit = 'cover';
                      imgEle.style.display = 'block';

                      if (absoluteIndex < 6) {
                        img.fetchPriority = 'high';
                      }

                      // Add loading placeholder
                      img.style.background = 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)';
                      img.style.backgroundSize = '20px 20px';
                      img.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
                    }

                    // Create structured content
                    const content = document.createElement('div');
                    content.className = 'product-content';

                    // Optimize content elements
                    const textElements = product.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span');
                    textElements.forEach((el) => {
                      if (el.textContent.trim().length > 15) {
                        el.style.contain = 'layout';
                      }
                    });

                    // Move content efficiently
                    while (product.firstChild) {
                      content.appendChild(product.firstChild);
                    }

                    productItem.appendChild(content);
                    fragment.appendChild(productItem);
                  });

                  batchResolve();
                });
              });

              // Yield control between batches for better performance
              if (i + batchSize < products.length) {
                await new Promise((yieldResolve) => setTimeout(yieldResolve, 0));
              }
            }

            productsGrid.appendChild(fragment);

            // Enhanced transition with stagger effect
            wBlock.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            wBlock.style.transform = 'translateY(30px) scale(0.95)';
            wBlock.style.opacity = '0';
            wBlock.innerHTML = '';
            wBlock.appendChild(productsGrid);

            requestAnimationFrame(() => {
              wBlock.style.opacity = '1';
              wBlock.style.transform = 'translateY(0) scale(1)';

              // Stagger animation for product items
              const items = productsGrid.querySelectorAll('.product-item');
              items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';

                setTimeout(() => {
                  item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0)';
                }, index * 100);
              });
            });

            resolve();
          });
        });

        console.log(`Enhanced Products: ${(performance.now() - startTime).toFixed(2)}ms`);
      } catch (error) {
        console.error('Products enhancement error:', error);
        wBlock.innerHTML = '<div style="padding:3rem;text-align:center;color:#e74c3c;font-size:1.1rem;">Products unavailable</div>';
      }
    };
  }());
}

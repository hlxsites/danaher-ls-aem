/* eslint-disable import/no-unresolved */
import { getMetadata, loadScript } from '../../scripts/lib-franklin.js';
import { getCookie, isOTEnabled } from '../../scripts/scripts.js';

const categoryFamily = `
    <atomic-search-interface class="category-search" localization-compatibility-version="v4"
        search-hub="DanaherLifeSciencesCategoryProductListing" pipeline="Danaher LifeSciences Category Product Listing"
        language-assets-path="${window.location.origin}/localization"
        fields-to-include='["images","sku","description","opco","contenttype","defaultcategoryname"]'>
        <atomic-search-layout>
          <atomic-layout-section section="facets">
            <atomic-facet-manager>
              <atomic-category-facet display-values-as="link" field="workflowname" label="Process Step" with-search="true"
                delimiting-character="|" class="facet">
              </atomic-category-facet>
              <atomic-facet label="Brand" field="opco" with-search="false"  class="facet">
              </atomic-facet>
            </atomic-facet-manager>
          </atomic-layout-section>
          <atomic-layout-section section="main">
            <atomic-layout section="status">
              <div class="status flex flex-row justify-between">
                <atomic-query-summary></atomic-query-summary>
              </div>
              <atomic-breadbox class="breadbox"></atomic-breadbox>
            </atomic-layout>
            <div class="w-full lg:hidden max-w-xs mx-auto m-2">
              <atomic-refine-toggle></atomic-refine-toggle>
            </div>
            <!-- GRID VIEW -->
            <atomic-layout-section section="pagination">
              <atomic-result-list display="grid" image-size="small" density="compact">
                <atomic-result-template>
                  <template>
                      <style>
                          .mailbox{
                              position: relative;
                              z-index: 10;
                              margin-left: 1px;
                              margin-right: 1px;
                              display: flex;
                              height: 100%;
                              min-height: 22rem;
                              width: 100%;
                              min-width: -moz-min-content;
                              min-width: min-content;
                              cursor: pointer;
                              flex-direction: column;
                              overflow: hidden;
                              border-radius: 0.375rem;
                              border-width: 1px;
                              --tw-bg-opacity: 1;
                              background-color: rgb(255 255 255 / var(--tw-bg-opacity));
                              --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                              --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
                              box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                              transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
                              transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
                              transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
                              transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                              transition-duration: 150ms;
                          }
                          .mailbox:hover {
                            --tw-scale-x: 1.05;
                            --tw-scale-y: 1.05;
                            transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
                          }
                          .mailbox-image {
                              padding-top: 1rem;
                              padding-bottom: 1rem;
                              height: 12rem;
                          }
                      </style>
                      <div class="mailbox">
                          <div class="mailbox-image">
                            <custom-image field="images" class="category-image"></custom-image>
                          </div>
                          <div class="mailbox-body">
                              <style>
                                  .description {
                                      overflow: hidden;
                                      display: -webkit-box;
                                      -webkit-box-orient: vertical;
                                      -webkit-line-clamp: 3;
                                      font-size: 0.875rem;
                                      line-height: 1.25rem;
                                      height: 4rem;
                                      padding-left: 1rem;
                                      padding-right: 1rem;
                                      margin-bottom: 0.75rem;
                                      --tw-text-opacity: 1;
                                      color: rgb(107 114 128 / var(--tw-text-opacity));
                                  }
                                  .title{
                                      overflow: hidden;
                                      display: -webkit-box;
                                      -webkit-box-orient: vertical;
                                      overflow-wrap: break-word;
                                      font-size: 1.25rem;
                                      line-height: 1.75rem;
                                      font-weight: 700;
                                      line-height: 1.25;
                                      height: 5rem;
                                      letter-spacing: 0em;
                                      padding-left: 1rem;
                                      padding-right: 1rem;
                                  }
                                  .title a {
                                    overflow: hidden;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 3;
                                  }
                                  .mailbox-footer{
                                      display: flex;
                                      width: 100%;
                                      align-items: center;
                                      gap: 0.125rem;
                                      --tw-bg-opacity: 1;
                                      background-color: rgb(243 244 246 / var(--tw-bg-opacity));
                                      font-size: 1rem;
                                      line-height: 1.5rem;
                                      font-weight: 600;
                                      --tw-text-opacity: 1;
                                      height: 3.5rem;
                                      color: rgb(13 49 114 / var(--tw-text-opacity));
                                  }
                                  .mailbox-action{
                                      display: flex;
                                      width: 100%;
                                      padding-left: 1rem;
                                  }
                              </style>
                              <atomic-result-title class="title">
                                  <atomic-result-link field="clickUri"></atomic-result-link>
                              </atomic-result-title>
                              <div class="description">
                                  <atomic-result-text class="" field="description"></atomic-result-text>
                              </div>
                          </div>
                          <div class="mailbox-footer">
                              <span class="mailbox-action" aria-label="View Products">View Products
                                  <span>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                      </svg>
                                  </span>
                              </span>
                          </div>
                      </div>
                  </template>
                </atomic-result-template>
              </atomic-result-list>
            </atomic-layout-section>
          </atomic-layout-section>
        </atomic-search-layout>
      </atomic-search-interface>
`;

export default async function decorate(block) {
  const category = getMetadata('fullcategory');
  const host = (window.location.host === 'lifesciences.danaher.com') ? window.location.host : 'stage.lifesciences.danaher.com';

  block.classList.add('pt-10');
  block.innerHTML = categoryFamily;
  await import('https://static.cloud.coveo.com/atomic/v2/atomic.esm.js');
  await customElements.whenDefined('atomic-search-interface');
  loadScript('/../../scripts/image-component.js');

  const categorySearchInterface = document.querySelector('atomic-search-interface.category-search');

  await categorySearchInterface.initialize({
    accessToken: window.DanaherConfig.categoryProductKey,
    organizationId: window.DanaherConfig.searchOrg,
    organizationEndpoints: await categorySearchInterface
      .getOrganizationEndpoints(window.DanaherConfig.searchOrg),
  });

  const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
  const { engine } = categorySearchInterface;
  const {
    loadContextActions,
    loadAdvancedSearchQueryActions,
    loadPaginationActions,
    loadTabSetActions,
  } = await import('https://static.cloud.coveo.com/headless/v2/headless.esm.js');
  engine.dispatch(loadContextActions(engine).setContext({
    categories: category,
    host,
    internal: isInternal,
  }));

  engine.dispatch(loadAdvancedSearchQueryActions(engine).registerAdvancedSearchQueries({
    aq: `@categories==${category}`,
  }));

  engine.dispatch(loadTabSetActions(engine).updateActiveTab('Family'));

  engine.dispatch(loadPaginationActions(engine).registerNumberOfResults(48));

  if (!isOTEnabled()) {
    categorySearchInterface.analytics = false;
  }
  categorySearchInterface.executeFirstSearch();

  engine.subscribe(() => {
    const totalCount = engine?.state?.search?.response?.totalCount;
    if (totalCount !== undefined && totalCount === 0) {
      block.remove();
    }
  });
}

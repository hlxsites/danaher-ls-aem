/* eslint-disable import/no-unresolved */
import { getMetadata, loadScript } from '../../scripts/lib-franklin.js';
import { getCookie, isOTEnabled } from '../../scripts/scripts.js';

const categoryFamily = `
  <div class="coveo-skeleton flex flex-col lg:flex-row grid-rows-1 lg:grid-cols-5 gap-x-10 gap-y-4">
    <div class="col-span-1 border shadow rounded-lg w-full p-4 max-w-sm w-full">
      <div class="flex flex-col gap-y-4 animate-pulse">
        <div class="w-2/4 h-7 bg-neutral-200 rounded [&:not(:first-child)]:opacity-40"></div>
        <div class="w-3/4 h-4 bg-neutral-200 rounded [&:not(:first-child):even]:opacity-40"></div>
        <div class="w-2/5 h-3 bg-neutral-200 rounded [&:not(:first-child):odd]:opacity-20"></div>
        <div class="w-4/5 h-5 bg-neutral-200 rounded [&:not(:first-child):even]:opacity-40"></div>
      </div>
    </div>
    <div class="col-span-4 w-full">
      <div class="max-w-xs bg-neutral-300 rounded-md p-4 animate-pulse mb-4"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div class="flex flex-col gap-y-2 animate-pulse">
          <div class="h-24 rounded bg-slate-300 opacity-500"></div>
          <div class="w-2/4 h-7 bg-neutral-200 rounded [&:not(:first-child)]:opacity-40"></div>
          <div class="space-y-1">
            <p class="w-3/4 h-4 bg-zinc-200 rounded [&:not(:first-child)]:opacity-40"></p>
            <p class="w-2/5 h-3 bg-zinc-200 rounded [&:not(:first-child)]:opacity-20"></p>
            <p class="w-4/5 h-5 bg-zinc-200 rounded [&:not(:first-child):even]:opacity-40"></p>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
        </div>
        <div class="flex flex-col gap-y-2 animate-pulse">
          <div class="h-24 rounded bg-slate-300 opacity-500"></div>
          <div class="w-2/4 h-7 bg-neutral-200 rounded [&:not(:first-child)]:opacity-40"></div>
          <div class="space-y-1">
            <p class="w-3/4 h-4 bg-neutral-200 rounded [&:not(:first-child):even]:opacity-40"></p>
            <p class="w-2/5 h-3 bg-neutral-200 rounded [&:not(:first-child):odd]:opacity-20"></p>
            <p class="w-4/5 h-5 bg-neutral-200 rounded [&:not(:first-child):even]:opacity-40"></p>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
        </div>
        <div class="flex flex-col gap-y-2 animate-pulse">
          <div class="h-24 rounded bg-slate-300 opacity-500"></div>
          <div class="w-2/4 h-7 bg-neutral-200 rounded [&:not(:first-child)]:opacity-40"></div>
          <div class="space-y-1">
            <p class="w-3/4 h-4 bg-neutral-200 rounded [&:not(:first-child):even]:opacity-40"></p>
            <p class="w-2/5 h-3 bg-neutral-200 rounded [&:not(:first-child):odd]:opacity-20"></p>
            <p class="w-4/5 h-5 bg-neutral-200 rounded [&:not(:first-child):even]:opacity-40"></p>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-2"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            <div class="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <atomic-search-interface 
    class="category-search hidden" 
    localization-compatibility-version="v4"
    search-hub="DanaherLifeSciencesCategoryProductListing" 
    pipeline="Danaher LifeSciences Category Product Listing"
    language-assets-path="${window.location.origin}/localization"
    fields-to-include='["images","sku","description","opco","contenttype","defaultcategoryname"]'
  >
    <atomic-search-layout>
      <atomic-layout-section section="facets">
        <atomic-facet-manager>
          <atomic-category-facet 
            display-values-as="link" 
            field="workflowname" 
            label="Process Step" 
            with-search="true"
            delimiting-character="|" class="facet"
          ></atomic-category-facet>
          <atomic-facet label="Brand" field="opco" with-search="false"  class="facet"></atomic-facet>
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
                        margin-left: 1px;
                        margin-right: 1px;
                        min-height: 22rem;
                        min-width: -moz-min-content;
                        min-width: min-content;
                        --tw-bg-opacity: 1;
                        background-color: rgb(255 255 255 / var(--tw-bg-opacity));
                        --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                        --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
                        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                    }
                    .mailbox:hover {
                      --tw-scale-x: 1.05;
                      --tw-scale-y: 1.05;
                      transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
                    }
                    .mailbox-image {
                        height: 12rem;
                    }
                </style>
                <div class="mailbox relative w-full h-full flex flex-col border rounded-md cursor-pointer overflow-hidden transition z-10">
                    <div class="mailbox-image py-4">
                      <custom-image field="images" class="category-image"></custom-image>
                    </div>
                    <div class="mailbox-body">
                        <style>
                            .description {
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 3;
                                font-size: 0.875rem;
                                line-height: 1.25rem;
                                height: 4rem;
                                --tw-text-opacity: 1;
                                color: rgb(107 114 128 / var(--tw-text-opacity));
                            }
                            .title {
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                overflow-wrap: break-word;
                                font-size: 1.25rem;
                                line-height: 1.75rem;
                                line-height: 1.25;
                                height: 5rem;
                                letter-spacing: 0em;
                            }
                            .mailbox-footer {
                                --tw-bg-opacity: 1;
                                background-color: rgb(243 244 246 / var(--tw-bg-opacity));
                                --tw-text-opacity: 1;
                                height: 3.5rem;
                                color: rgb(13 49 114 / var(--tw-text-opacity));
                            }
                            .mailbox-action {
                                padding-left: 1rem;
                            }
                        </style>
                        <atomic-result-title class="title px-4 overflow-hidden font-bold">
                            <atomic-result-link field="clickUri"></atomic-result-link>
                        </atomic-result-title>
                        <div class="description px-4 overflow-hidden mb-3">
                            <atomic-result-text class="" field="description"></atomic-result-text>
                        </div>
                    </div>
                    <div class="mailbox-footer w-full flex items-center gap-0.5 text-lg font-semibold leading-6">
                        <span class="mailbox-action w-full flex items-center gap-0.5" aria-label="View Products">
                          View Products
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                          </svg>
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
// http://localhost:3000/us/en/products/cell-counters-analyzers/cell-viability-analyzers

export default async function decorate(block) {
  const category = getMetadata('fullcategory');
  const host = (window.location.host === 'lifesciences.danaher.com') ? window.location.host : 'stage.lifesciences.danaher.com';

  block.classList.add('pt-10');
  block.innerHTML = categoryFamily;
  
  setTimeout(async () => {
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
    await import('https://static.cloud.coveo.com/headless/v2/headless.esm.js');
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

    if (!isOTEnabled()) categorySearchInterface.analytics = false;
    categorySearchInterface.executeFirstSearch();

    engine.subscribe(() => {
      const totalCount = engine?.state?.search?.response?.totalCount;
      if (totalCount !== undefined && totalCount === 0) block.remove();
      else {
        const skeleton = document.querySelector('.coveo-skeleton');
        if (skeleton) skeleton.remove();
        categorySearchInterface.classList.remove('hidden');
      }
    });
  }, 5000);
}

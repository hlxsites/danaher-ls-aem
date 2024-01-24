/* eslint-disable import/no-unresolved */
import ProductTile from './product-tile.js';
import { loadScript } from '../../scripts/lib-franklin.js';
import {
  getCookie, isOTEnabled, getProductResponse, getSKU,
} from '../../scripts/scripts.js';

customElements.define('product-tile', ProductTile);
const childProducts = `
    <atomic-search-interface class="product-search" 
        localization-compatibility-version="v4"
        search-hub="DanaherFamilyProductListing" 
        pipeline="Danaher Family Product Listing"
        language-assets-path="${window.location.origin}/localization" 
        fields-to-include='["brand","images","sku","title","description","richdescription","opco","contenttype","documenttype","pagetype","shortspecifications", "specificationsjson", "specifications", "bundlepreviewjson"]'>
        <style>
            atomic-search-layout atomic-layout-section[section='pagination']{
                flex-direction:column;
            }
            atomic-search-layout atomic-layout-section[section='pagination']>* {
                margin-top: 0;
            }
            atomic-result-list::part(result-list) {
                gap: 0;
            }
            .pagination {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
            }
        </style>
        <atomic-search-layout>
            <atomic-layout-section section="facets">
                <atomic-facet-manager>
                    <atomic-category-facet display-values-as="link" field="categoriesname" label="Product Type" with-search="true" delimiting-character="|"></atomic-category-facet>
                    <atomic-facet label="Brand" field="opco" with-search="false"></atomic-facet>
                    <atomic-facet label="Document Type" field="documenttype" with-search="false"></atomic-facet>
                </atomic-facet-manager>
            </atomic-layout-section>
            <atomic-layout-section section="main">
                <atomic-layout-section section="status">
                    <atomic-breadbox></atomic-breadbox>
                </atomic-layout-section>
                <div class="w-full mb-4 lg:hidden">
                    <atomic-refine-toggle></atomic-refine-toggle>
                </div>
                <atomic-layout-section section="pagination">
                    <div class="results">
                        <atomic-did-you-mean></atomic-did-you-mean>
                        <atomic-result-list display="list" image-size="small" density="compact">
                            <atomic-result-template>
                                <template>
                                    <style products>
                                        :host::before {
                                            background-color: white !important;
                                            margin: 0 !important;
                                        }
                                        :host(.result-component) {
                                            border: 0 !important;
                                            padding: 0 !important;
                                
                                        }
                                    </style>
                                    <div class="tile-wrapper">
                                        <product-tile></product-tile>
                                    </div>
                                </template>
                            </atomic-result-template>
                        </atomic-result-list>
                        <div class="pagination">
                            <atomic-pager number-of-pages="20"></atomic-pager>
                        </div>
                        <div class="status">
                            <atomic-query-error></atomic-query-error>
                            <atomic-no-results></atomic-no-results>
                        </div>
                    </div>
                </atomic-layout-section>
            </atomic-layout-section>
        </atomic-search-layout>
    </atomic-search-interface>
`;

export default async function decorate(block) {
  const sku = getSKU();
  const host = (window.location.host === 'lifesciences.danaher.com') ? window.location.host : 'stage.lifesciences.danaher.com';
  const response = getProductResponse();
  if (response?.length > 0 && response[0]?.raw?.objecttype === 'Family' && response[0]?.raw?.numproducts > 0) {
    block.classList.add('pt-10');
    block.innerHTML = childProducts;
    await import('https://static.cloud.coveo.com/atomic/v2/atomic.esm.js');
    await customElements.whenDefined('atomic-search-interface');
    loadScript('/../../scripts/image-component.js');

    const productSearchInterface = document.querySelector('atomic-search-interface.product-search');

    await productSearchInterface.initialize({
      accessToken: window.DanaherConfig.familyProductKey,
      organizationId: window.DanaherConfig.searchOrg,
      organizationEndpoints: await productSearchInterface
        .getOrganizationEndpoints(window.DanaherConfig.searchOrg),
    });

    const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
    const { engine } = productSearchInterface;
    const {
      loadContextActions,
      loadPaginationActions,
      loadTabSetActions,
    } = await import('https://static.cloud.coveo.com/headless/v2/headless.esm.js');

    engine.dispatch(loadContextActions(engine).setContext({
      familyid: sku,
      host,
      internal: isInternal,
    }));

    engine.dispatch(loadTabSetActions(engine).updateActiveTab('Family'));

    engine.dispatch(loadPaginationActions(engine).registerNumberOfResults(48));

    if (!isOTEnabled()) {
      productSearchInterface.analytics = false;
    }
    productSearchInterface.executeFirstSearch();
  }
}

/* eslint-disable import/no-unresolved */
import { getMetadata, loadScript } from '../../scripts/lib-franklin.js';
import { getCookie, isOTEnabled } from '../../scripts/scripts.js';

const childProducts = `
    <atomic-search-interface class="product-search" 
        localization-compatibility-version="v4"
        search-hub="DanaherFamilyProductListing" 
        pipeline="Danaher Family Product Listing"
        language-assets-path="${window.location.origin}/localization" 
        fields-to-include='["brand","images","sku","title","description","richdescription","opco","contenttype","documenttype","pagetype","shortspecifications", "specificationsjson", "specifications", "bundlepreviewjson"]'>
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
                    <atomic-did-you-mean></atomic-did-you-mean>
                    <atomic-result-list display="list" image-size="small" density="compact">
                        <atomic-result-template>
                            <template>
                                <style products>
                                    .flex-container {
                                        display: -ms-flexbox;
                                        display: -webkit-flex;
                                        display: flex;
                            
                                        -webkit-flex-direction: row;
                                        -ms-flex-direction: row;
                                        flex-direction: row;
                                        -webkit-flex-wrap: nowrap;
                                        -ms-flex-wrap: nowrap;
                                        flex-wrap: nowrap;
                                        -webkit-justify-content: flex-start;
                                        -ms-flex-pack: start;
                                        justify-content: flex-start;
                                        -webkit-align-content: stretch;
                                        -ms-flex-line-pack: stretch;
                                        align-content: stretch;
                                        -webkit-align-items: flex-start;
                                        -ms-flex-align: start;
                                        align-items: flex-start;
                                        font-size: .875rem;
                                    }
                            
                                    .flex-item {
                                        -webkit-order: 0;
                                        -ms-flex-order: 0;
                                        order: 0;
                                        /* -webkit-flex: 0 1 auto;
                                        -ms-flex: 0 1 auto;
                                        flex: 0 1 auto; */
                                        -webkit-align-self: auto;
                                        -ms-flex-item-align: auto;
                                        align-self: auto;
                                        font-size: .875rem;
                                        margin-bottom:.375rem;
                                    }
                                    #left-col {
                                        width: 20%;
                                    }
                            
                                    #center-col {
                                        margin-bottom:4px;
                                        width: 50%;
                                    }
                            
                                    #right-col {
                                        margin-bottom:8px;
                                        width: 30%;
                                        /* border-left: 1px solid var(--atomic-neutral); */
                                    }
                                    .space-x-4 {
                                        gap: 1rem;
                                    }
                                    .f-justify {
                                        -webkit-justify-content: space-between;
                                        -ms-flex-pack: space-between;
                                        justify-content: space-between;
                                    }
                                    .b-justify {
                                        -webkit-justify-content: flex-end;
                                        -ms-flex-pack: end;
                                        justify-content: flex-end;
                                    }
                                    .flex-end {
                                        -webkit-justify-content: flex-end;
                                        -ms-flex-pack: end;
                                        justify-content: flex-end;
                                    }
                                    .flex-start {
                                        -webkit-justify-content: flex-start;
                                        -ms-flex-pack: start;
                                        justify-content: flex-start;
                                    }
                            
                            
                                    .att-label {
                                        min-width: 10rem;
                                    }
                                    .att-value {
                                        font-weight:600;
                                    }
                            
                                    .price {
                                        font-size: 2rem;
                                        font-weight: 700;
                                    }
                            
                                    .addinput {
                                        display:block;
                                        width: 2.5rem;
                                        border: 1px solid #D1D5DB;
                                        padding: .25rem .5rem;
                                        font-size: 1rem;
                                        font-weight: 600;
                                        color: #000;
                                        border-radius: .25rem;
                                        text-align:center;
                                        margin-right: .5rem;
                                    }
                                    .btn-add, .btn-quote, .btn-view {
                                        padding: .25rem 1.5rem;
                                        border-radius: .375rem;
                                        margin-right: .375rem;
                                        font-weight: 600;
                                    }
                                    .btn-quote:focus {
                                        outline: 1px solid;
                                        outline: 5px #DC6016 -webkit-focus-ring-color;
                                    }
                                    .btn-add:focus, btn-view:focus {
                                        outline: 1px solid;
                                        outline: 5px #DC6016 -webkit-focus-ring-color;
                                    }
                            
                                    .btn-add,.btn-view {
                                        background-color: #DC6016;
                                        border: 1px solid #DC6016;
                                        color: white;
                                        margin-top: .5rem;
                                    }
                            
                                    .btn-quote {
                                        background-color: white;
                                        border: 1px solid #DC6016;
                                        color: #DC6016;
                                    }
                            
                                    .see-full {
                                        color: var(--danaherblue-500);
                                        font-weight:400;
                                    }
                            
                                    .btn-view {
                                        width:7rem;
                                        padding:.5rem 0;
                                        border-radius: .375rem;
                                        font-weight: 600;
                                    }
                                    .btn-view:focus {
                                        outline: 1px solid;
                                        outline: 5px #DC6016 -webkit-focus-ring-color;
                                    }
                            
                                    .btn-view {
                                        background-color: #DC6016;
                                        border: 1px solid #DC6016;
                                        color: white;
                                        margin-top: .5rem;
                                    }
                            
                            
                                    atomic-result-image{
                                        display:flex !important;
                                    }
                            
                                    atomic-result-image img {
                                        -o-object-fit: cover !important;
                                        object-fit: cover !important;
                                        min-width: 6rem;
                                    }
                            
                                    .title {
                                        width:100%;
                                        display:block;
                                        padding:0;
                                        margin-bottom: .5rem;
                                        font-size: 1.5rem;
                                        font-weight:600;
                                    }
                                    .description {
                                        margin: .5rem 0 .5rem 0;
                                    }
                            
                                    @media (max-width: 1220px){
                                        .flex-container {
                                            flex-wrap: wrap;
                                        }
                                        #center-col, #right-col {
                                            flex-basis: 100%;
                                        }
                                        .f-justify {
                                            -webkit-justify-content: flex-start;
                                            -ms-flex-pack: start;
                                            justify-content: flex-start;
                                        }
                                        .b-justify {
                                            -webkit-justify-content: flex-start;
                                            -ms-flex-pack: start;
                                            justify-content: flex-start;
                                        }
                                        .f-justify .flex-item {
                                            margin-right: 1rem;
                                        }
                                        .flex-end {
                                            -webkit-justify-content: flex-start;
                                            -ms-flex-pack: start;
                                            justify-content: flex-start;
                                        }
                                    } /* end 1220 */
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
                                    <div class="flex-wrapper" class="family-width product-width">
                                        <div class="image-container">
                                            <atomic-result-image field="images" aria-hidden="true"></atomic-result-image>
                                        </div>
                                        <div class="family-description">
                                            <atomic-field-condition if-defined="opco">
                                                <atomic-result-text class="brand-info" field="opco"></atomic-result-text>
                                            </atomic-field-condition>
                                            <atomic-result-title class="title"><atomic-result-link field='clickUri'></atomic-result-link></atomic-result-title>
                                            <div class="sku-text">
                                                <atomic-field-condition if-defined="sku">
                                                    <p><atomic-result-text class="att-value" field="sku"></atomic-result-text></p>
                                                </atomic-field-condition>
                                            </div>
                                            <div class="product-description" class="family"></div>
                                            <div class="full-specification">
                                                <atomic-result-link field='clickUri'><span>See Full Specifications</span></atomic-result-link>
                                            </div>
                                        </div>
                                    </div>
                                    <atomic-field-condition class="family-wrapper">
                                        <div class="middle-align">
                                            <atomic-result-link field='clickUri'>
                                                <button class="btn btn-outline-brand">Learn More</button>
                                            </atomic-result-link>
                                        </div>
                                    </atomic-field-condition>
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
                </atomic-layout-section>
            </atomic-layout-section>
        </atomic-search-layout>
    </atomic-search-interface>
`;

export default async function decorate(block) {
  const sku = getMetadata('sku')
  const host = (window.location.host === 'lifesciences.danaher.com') ? window.location.host : 'stage.lifesciences.danaher.com';
  let response;
  if (localStorage.getItem('product-details')) response = JSON.parse(localStorage.getItem('product-details'));
  if (response[0]?.raw?.objecttype === 'Family' && response[0]?.raw?.numproducts > 0) {
    block.classList.add('pt-10');
    block.innerHTML = childProducts;
    await import('https://static.cloud.coveo.com/atomic/v2/atomic.esm.js');
    await customElements.whenDefined('atomic-search-interface');
    loadScript('/blocks/category-family/image-component.js');

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

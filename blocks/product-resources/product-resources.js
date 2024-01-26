/* eslint-disable import/no-unresolved */
import { loadScript } from '../../scripts/lib-franklin.js';
import {
  getCookie, isOTEnabled, getProductResponse, getSKU,
} from '../../scripts/scripts.js';

const productResources = `
    <atomic-search-interface class="resource-search" 
        localization-compatibility-version="v4"
        search-hub="DanaherFamilyResources" 
        pipeline="Danaher Family Resources" 
        language-assets-path="${window.location.origin}/localization" 
        fields-to-include='["ec_images","ec_brand","images","sku","description","opco","contenttype","documenttype","workflow","chromatographycolumninternaldiametermetricmm","chromatographycolumnlengthmetricmm","chromatographycolumnparticlesizemetricmicrometer","chromatographycolumnporesizemetricangstrom","chromatographytype","discontinued"]'>
        <style>
            atomic-search-layout atomic-layout-section[section='pagination']{
                flex-direction:column;
            }
            atomic-search-layout atomic-layout-section[section='pagination']>* {
                margin-top: 0;
            }
            atomic-result-list::part(result-list) {
                gap: 0.0rem;
            }
            .pagination {
                display: flex;
                flex-wrap: wrap;
                margin-top: 1rem;
                margin-bottom: 1rem;
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
                    <atomic-breadbox class="breadbox"></atomic-breadbox>
                </atomic-layout-section>
                <div class="w-full lg:hidden">
                    <atomic-refine-toggle></atomic-refine-toggle>
                </div>
                <atomic-layout-section section="pagination">
                    <atomic-did-you-mean></atomic-did-you-mean>
                    <atomic-result-list display="list" image-size="small" density="compact">
                        <atomic-result-template>
                            <template>
                                <style>
                                    .f-row {
                                        display: flex;
                                        flex-wrap: wrap;
                                        width: 100%;
                                    }
                                
                                    .f-col {
                                        display: flex;
                                        flex-direction: column;
                                        flex-basis: 100%;
                                        flex: 1;
                                    }
                                
                                    .f-wide-col {
                                        display: flex;
                                        flex-direction: column;
                                        flex-basis: 100%;
                                        flex: 12;
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
                                        color: #333;
                                        font-size: .875;
                                        font-weight:400;
                                    }
                                
                                    atomic-result-badge::part(result-badge-element) {
                                        background: #E0E9EB;
                                        padding: .25rem .375rem;
                                        border-radius: 5px;
                                        margin-top: .25rem;
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
                                    .download-select {
                                        display:block;
                                        width:auto;
                                        max-width: 12rem;
                                        padding: .5rem;
                                        border: 1px solid #DDD;
                                        border-radius: .5rem;
                                    }
                                
                                    @media (max-width: 768px){
                                        .f-wide-col { 
                                        width: 100%;
                                        flex: none;
                                        } 
                                    }    /* end 768px */

                                    @media (max-width: 1280px){
                                        .f-wide-col { 
                                        min-width: 500px;
                                        } 
                                    }    /* end 1280px */
                                </style>
                                <div class='flex-wrapper'>
                                    <div class='f-row'>
                                        <div class='f-wide-col'>
                                            <atomic-result-title class="title">
                                                <atomic-result-link field="clickUri"></atomic-result-link>
                                            </atomic-result-title>
                                            <atomic-result-text class="description" field="description"></atomic-result-text>
                                            <p>
                                                <atomic-result-badges>
                                                <atomic-result-badge class="badge" field="opco"></atomic-result-badge>
                                                <atomic-result-badge class="badge" field="documenttype"></atomic-result-badge>
                                                </atomic-result-badges>
                                            </p>
                                        </div>
                                        <div class='f-col' style="margin:.5rem;">
                                            <select id="lang" name="lang" class="download-select">
                                                <option selected>English</option>
                                            </select>
                                        </div>
                                        <div class='f-col' style="margin-right:.5rem;">
                                            <atomic-result-link field='clickUri'><button class="btn-view">View</button></atomic-result-link>
                                        </div>
                                    </div>
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
  const sku = getSKU();
  const host = (window.location.host === 'lifesciences.danaher.com') ? window.location.host : 'stage.lifesciences.danaher.com';
  const response = getProductResponse();
  if (response?.length > 0 && response[0]?.raw?.objecttype === 'Family' && response[0]?.raw?.numresources > 0) {
    block.classList.add('pt-10');
    block.innerHTML = productResources;
    await import('https://static.cloud.coveo.com/atomic/v2/atomic.esm.js');
    await customElements.whenDefined('atomic-search-interface');
    loadScript('/../../scripts/image-component.js');

    const resourceSearchInterface = document.querySelector('atomic-search-interface.resource-search');

    await resourceSearchInterface.initialize({
      accessToken: window.DanaherConfig.familyResourceKey,
      organizationId: window.DanaherConfig.searchOrg,
      organizationEndpoints: await resourceSearchInterface
        .getOrganizationEndpoints(window.DanaherConfig.searchOrg),
    });

    const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
    const { engine } = resourceSearchInterface;
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

    engine.dispatch(loadPaginationActions(engine).registerNumberOfResults(20));

    if (!isOTEnabled()) {
      resourceSearchInterface.analytics = false;
    }
    resourceSearchInterface.executeFirstSearch();
  }
}

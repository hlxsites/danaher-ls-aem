/* eslint-disable import/no-unresolved */
import { getMetadata, loadScript } from '../../scripts/lib-franklin.js';
import { getCookie, isOTEnabled } from '../../scripts/scripts.js';

const productResources = `
    <atomic-search-interface class="resource-search" search-hub="DanaherFamilyResources" pipeline="Danaher Family Resources" 
        language-assets-path="${window.location.origin}/localization" fields-to-include='["ec_images","ec_brand","images","sku","description","opco","contenttype","documenttype","workflow","chromatographycolumninternaldiametermetricmm","chromatographycolumnlengthmetricmm","chromatographycolumnparticlesizemetricmicrometer","chromatographycolumnporesizemetricangstrom","chromatographytype","discontinued"]'>
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
                <div class="w-full lg:hidden">
                    <atomic-refine-toggle></atomic-refine-toggle>
                </div>
                <atomic-layout-section section="horizontal-facets">
                </atomic-layout-section>
                <atomic-layout-section section="pagination">
                    <atomic-did-you-mean></atomic-did-you-mean>
                    <atomic-result-list display="list" image-size="small" density="compact">
                        <atomic-result-template must-match-contenttype="Document" v-html="documents"></atomic-result-template>
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
  const sku = '';
  const host = (window.location.host === 'lifesciences.danaher.com') ? window.location.host : 'stage.lifesciences.danaher.com';

  block.classList.add('pt-10');
  block.innerHTML = productResources;
  await import('https://static.cloud.coveo.com/atomic/v2/atomic.esm.js');
  await customElements.whenDefined('atomic-search-interface');
  loadScript('/blocks/category-family/image-component.js');

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
    loadAdvancedSearchQueryActions,
    loadPaginationActions,
    loadTabSetActions,
  } = await import('https://static.cloud.coveo.com/headless/v2/headless.esm.js');

  engine.dispatch(loadContextActions(engine).setContext({
    familyid: sku,
    host,
    internal: isInternal,
  }));

  engine.dispatch(loadAdvancedSearchQueryActions(engine).registerAdvancedSearchQueries({
    aq: `@familyid==${sku}`,
  }));

  engine.dispatch(loadTabSetActions(engine).updateActiveTab('Family'));

  engine.dispatch(loadPaginationActions(engine).registerNumberOfResults(48));

  if (!isOTEnabled()) {
    resourceSearchInterface.analytics = false;
  }
  resourceSearchInterface.executeFirstSearch();
}

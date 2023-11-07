import { loadContextActions } from 'https://static.cloud.coveo.com/headless/v2/headless.esm.js'
import { loadScript } from '../../scripts/lib-franklin.js';

const categoryFamily = `
      <atomic-search-interface class="category-search" localization-compatibility-version="v4"
        search-hub="DanaherCategoryProductListing" pipeline="Danaher Category Product Listing"
        language-assets-path="https://lifesciences.danaher.com/content/dam/danaher/utility/coveo/lang"
        fields-to-include='["images","sku","description","opco","contenttype","defaultcategoryname"]'>
        <atomic-search-layout>
          <atomic-layout-section section="facets">
            <atomic-facet-manager>
              <atomic-category-facet display-values-as="link" field="categoriesname" label="Product Type"
                :base-path="category" filter-by-base-path="false" with-search="true" delimiting-character="|">
              </atomic-category-facet>
              <atomic-category-facet display-values-as="link" field="workflowname" label="Process Step" with-search="true"
                delimiting-character="|">
              </atomic-category-facet>
              <atomic-facet label="Brand" field="opco" with-search="false">
              </atomic-facet>
            </atomic-facet-manager>
          </atomic-layout-section>
          <atomic-layout-section section="main">
            <atomic-layout section="status">
              <div class="flex flex-row justify-between">
                <atomic-query-summary></atomic-query-summary>
              </div>
              <atomic-breadbox></atomic-breadbox>
            </atomic-layout>
            <!-- GRID VIEW -->
            <atomic-layout-section section="pagination">
              <atomic-did-you-mean></atomic-did-you-mean>
              <atomic-result-list display="grid" image-size="small" density="compact">
                <atomic-result-template>
                  <template>
                    <div class="mailbox">
                      <div class="mailbox-image">
                        <atomic-result-image field="images" aria-hidden="true" class="category-image"></atomic-result-image>
                      </div>
                      <div class="mailbox-body">
                        <atomic-result-multi-value-text class="category"
                          field="defaultcategoryname"></atomic-result-multi-value-text>
                        <atomic-result-title class="title">
                          <atomic-result-link href-template="clickUri"></atomic-result-link>
                        </atomic-result-title>
                        <div class="description">
                          <atomic-result-text class="" field="description"></atomic-result-text>
                        </div>
                      </div>
                      <div class="mailbox-footer">
                        <span class="mailbox-action" aria-label="View Products">View Products
                          <span class="w-4 h-4">
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
              <div class="pagination">
                <atomic-pager number-of-pages="10"></atomic-pager>
              </div>
              <atomic-query-error class="mb-28"></atomic-query-error>
            </atomic-layout-section>
          </atomic-layout-section>
        </atomic-search-layout>
      </atomic-search-interface>
`;

const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
}

const isOTEnabled = () =>{
  const otCookie = getCookie('OptanonConsent');
  if( typeof otCookie == 'string'){
      return otCookie.includes('C0002:1');
  }
  return true;
}

export default async function decorate(block) {
  loadScript('https://static.cloud.coveo.com/atomic/v2/atomic.esm.js', {type:'module'});
  
  block.innerHTML = categoryFamily;
  await customElements.whenDefined('atomic-search-interface');
  const categorySearchInterface = await document.querySelector('atomic-search-interface.category-search');

  await categorySearchInterface.initialize({
    accessToken: window.DanaherConfig.categoryProductKey,
    organizationId: window.DanaherConfig.searchOrg,
    organizationEndpoints: await categorySearchInterface.getOrganizationEndpoints(window.DanaherConfig.searchOrg)
  });

  const isInternal = typeof getCookie('exclude-from-analytics') != 'undefined';
  const engine = categorySearchInterface.engine;
  engine.dispatch(loadContextActions(engine).setContext({
    categories: 'centrifuges/analytical-ultracentrifuges',
    host: window.location.host,
    internal: isInternal
  }));

  if( !isOTEnabled()){
    categorySearchInterface.analytics = false;
  }
  categorySearchInterface.executeFirstSearch();

  engine.subscribe(() => {
    const totalCount = engine?.state?.search?.response?.totalCount;
    if(totalCount !== undefined && totalCount === 0
        && document.querySelector('div.coveocategory') !== null){
      document.querySelector('div.coveocategory').remove();
    }
  });
}

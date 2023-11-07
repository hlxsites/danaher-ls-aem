import 'https://static.cloud.coveo.com/atomic/v2/atomic.esm.js';

export default async function decorate(block) {
    await customElements.whenDefined('atomic-search-interface');
    const categorySearchInterface = await document.querySelector('atomic-search-interface.category-search');

    await categorySearchInterface.initialize({
      accessToken: window.DanaherConfig.categoryProductKey,
      organizationId: window.DanaherConfig.searchOrg
    });

    const isInternal = typeof utility.getCookie('exclude-from-analytics') != 'undefined';
    const engine = categorySearchInterface.engine;
    engine.dispatch(loadContextActions(engine).setContext({
      categories: this.category,
      host: window.location.host,
      internal: isInternal
    }));

    if( !utility.isOTEnabled()){
      categorySearchInterface.analytics = false;
    }
    categorySearchInterface.executeFirstSearch();

    engine.subscribe(() => {
      const totalCount = engine?.state?.search?.response?.totalCount;
      if(this.wcmmode !== 'edit' && totalCount !== undefined && totalCount === 0
          && document.querySelector('div.coveocategory') !== null){
        document.querySelector('div.coveocategory').remove();
      }
    });
    console.log('in family coveo');
}

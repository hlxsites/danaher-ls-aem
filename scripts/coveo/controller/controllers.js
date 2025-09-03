/* eslint-disable */
import {
  loadAdvancedSearchQueryActions, buildResultList, buildContext,
  loadContextActions, buildPager, loadPaginationActions,
} from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

import { searchEngine, frequentViewedEngine, resourceEngine } from '../engine.js';

// eslint-disable-next-line import/prefer-default-export
export async function getPdpDetails(productId) {
  const { updateAdvancedSearchQueries } = loadAdvancedSearchQueryActions(searchEngine);
  searchEngine.dispatch(updateAdvancedSearchQueries({
    aq: `@productid==${productId}`,
  }));
  searchEngine.executeFirstSearch();
}
// ======================= Resorces ==============================
// 2️ Pagination actions: force 6 results per page so state matches
const { registerNumberOfResults } = loadPaginationActions(resourceEngine);
resourceEngine.dispatch(registerNumberOfResults(6));

const sku = new URL(window.location.href).pathname.split('/').pop();
const host = window.location.host === 'lifesciences.danaher.com'
  ? window.location.host
  : 'stage.lifesciences.danaher.com';
// 3️. Set context
const resourceContext = loadContextActions(resourceEngine);

resourceEngine.dispatch(
  resourceContext.setContext({
    familyid: sku,
    host,
  }),
);

// 4️. Build result list and pager controllers
export const resourceResultList = buildResultList(resourceEngine, {
  options: {
    fieldsToInclude: [
      'ec_images',
      'ec_brand',
      'sku',
      'description',
      'opco',
      'documenttype',
      'contenttype',
      'date',
      'sysdate',
      'filetype',
    ],
  },
});
export const resourcePager = buildPager(resourceEngine, {
  options: { numberOfPages: 20 },
});

// ================================= END Resource =========================

// Controller function
export async function getFrequentlyViewedTogether() {
  // Add ML context
  const context = buildContext(frequentViewedEngine);
  context.add('mlParameters', { itemid: 'intabio-zt-systems' });
  // Build controller
  const recommendationController = buildResultList(frequentViewedEngine, {
    options: {
      numberOfResults: 8,
      fieldsToInclude: ['description', 'categoriesname', 'images', 'source'],
      recommendation: 'frequentViewed',
    },
  });
  frequentViewedEngine.executeFirstSearch();
  // Wait for results
  return new Promise((resolve) => {
    const unsubscribe = recommendationController.subscribe(() => {
      const { results } = recommendationController.state;
      if (results.length > 0) {
        unsubscribe();
        resolve(results);
      }
    });
  });
}

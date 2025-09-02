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
// const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';

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

// export async function getFrequentlyViewedTogether(itemId) {
//   const { updateSearchConfiguration } = loadSearchConfigurationActions(frequentViewedEngine);
//   const { updateAdvancedSearchQueries } = loadAdvancedSearchQueryActions(frequentViewedEngine);

//   // Set search config: tab, locale, timezone, pipeline
//   frequentViewedEngine.dispatch(updateSearchConfiguration({
//     locale: 'en',
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     tab: 'Frequently Viewed Together',
//     pipeline: 'Danaher LifeSciences Product Recommendations',
//     fieldsToInclude: ['description', 'categoriesname', 'images', 'source'],
//   }));

//   // Add ML context
//   const context = buildContext(frequentViewedEngine);
//   context.add('mlParameters', { itemid: 'intabio-zt-systems' });

//   // Optional AQ filter
//   // frequentViewedEngine.dispatch(updateAdvancedSearchQueries({
//   //   aq: `@itemid==intabio-zt-systems`, // if your index supports filtering on itemid
//   // }));

//   // Trigger search
//   frequentViewedEngine.executeFirstSearch();

//   // Return results via subscription
//   return new Promise((resolve) => {
//     const unsubscribe = frequentViewedEngine.subscribe(() => {
//       const results = frequentViewedEngine.state.search.results;
//       console.log(results);
//       if (results.length > 0) {
//         unsubscribe();
//         resolve(results);
//       }
//     });
//   });
// }

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

// export async function getFrequentlyViewedTogether(itemId) {
//   const recommendationController = buildResultList(frequentViewedEngine, {
//     options: {
//       numberOfResults: 10,
//       mlParameters: {itemId: "intabio-zt-systems"},
//       fieldsToInclude: ['description', 'categoriesname', 'images', 'source'],
//       tab: 'Frequently Viewed Together'
//     },
//   });
//   const context = buildContext(frequentViewedEngine);
//   context.add('mlParameters', {
//     "itemId": "intabio-zt-systems"});
//   frequentViewedEngine.executeFirstSearch();
//   frequentViewedEngine.subscribe(() => {
//     console.log(recommendationController);
//     });
// }

// return new Promise((resolve) => {
//   const unsubscribe = recommendationController.subscribe(() => {
//     const results = recommendationController.state.results;
//     if (results.length > 0) {
//       unsubscribe();
//       resolve(results);
//     }
//   });

//   recommendationController.refresh(); // triggers fetch
// });

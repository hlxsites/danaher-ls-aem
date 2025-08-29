// eslint-disable-next-line import/no-unresolved
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

// eslint-disable-next-line import/prefer-default-export
export const searchEngine = buildSearchEngine({
  configuration: {
    organizationId: window.DanaherConfig?.searchOrg,
    accessToken: window.DanaherConfig?.searchKey,
  },
});

// 1️⃣ Build engine
export const resourceEngine = buildSearchEngine({
  configuration: {
    accessToken: window.DanaherConfig.familyResourceKey,
    organizationId: window.DanaherConfig.searchOrg,
    search: {
      searchHub: 'DanaherFamilyResources',
      pipeline: 'Danaher Family Resources',
    },
  },
});

export const frequentViewedEngine = buildSearchEngine({
  configuration: {
    organizationId: 'danaherproductionrfl96bkr',
    accessToken: 'xxf2f10385-5a54-4a18-bb48-fd8025d6b5d2',
    search: {
      searchHub: 'DanaherLifeSciencesProductRecommendations',
      pipeline: 'Danaher LifeSciences Product Recommendations',
    },
  },
});

// export default searchEngine;

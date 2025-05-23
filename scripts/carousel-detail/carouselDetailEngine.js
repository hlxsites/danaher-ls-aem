/* eslint-disable */
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

export const searchEngine = buildSearchEngine({
  configuration: {
    organizationId: window.DanaherConfig?.searchOrg || "danahernonproduction1892f3fhz",
    accessToken: "xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b",
    search: {
      searchHub: 'DanaherLifeSciencesCarousel',
    },
    analytics: {
      analyticsMode: 'next',
      trackingId: 'dhls_us'
    },
  },
});

export default { searchEngine };
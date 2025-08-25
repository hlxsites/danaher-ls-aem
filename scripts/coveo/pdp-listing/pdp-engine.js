/* eslint-disable-next-line import/no-unresolved */
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

export const pdpEngine = buildSearchEngine({
  configuration: {
    accessToken: window.DanaherConfig.familyProductKey,
    organizationId: window.DanaherConfig.searchOrg,
    search: {
      searchHub: 'DanaherFamilyProductListing',
    },
  },
});

export default { pdpEngine };

// eslint-disable-next-line import/no-unresolved
import { buildSearchEngine } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';

// eslint-disable-next-line import/prefer-default-export
export const searchEngine = buildSearchEngine({
  configuration: {
    organizationId: window.DanaherConfig?.searchOrg,
    accessToken: window.DanaherConfig?.searchKey,
  },
});

// export default searchEngine;

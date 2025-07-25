// eslint-disable-next-line import/no-unresolved
import { loadAdvancedSearchQueryActions } from 'https://static.cloud.coveo.com/headless/v3/headless.esm.js';
import { searchEngine } from '../engine.js';

// eslint-disable-next-line import/prefer-default-export
export async function getPdpDetails(productId) {
  const { updateAdvancedSearchQueries } = loadAdvancedSearchQueryActions(searchEngine);
  searchEngine.dispatch(updateAdvancedSearchQueries({
    aq: `@productid==${productId}`,
  }));
  searchEngine.executeFirstSearch();
}

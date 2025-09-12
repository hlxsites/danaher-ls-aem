/* eslint-disable */
import {
  buildRecommendationEngine,
  buildRecommendationList,
  buildContext,
} from 'https://static.cloud.coveo.com/headless/v3/recommendation/headless.esm.js';
import { getCookie } from '../scripts.js';

// Initialize search-based recommendation engine
const engine = buildRecommendationEngine({
  configuration: {
    accessToken: window.DanaherConfig.familyProductKey,
    organizationId: window.DanaherConfig.searchOrg,
    searchHub: 'DanaherLifeSciencesProductRecommendations',
    context: {},
  },
});

// Create controller (no skus property)
export const recommendationsController = buildRecommendationList(engine, {
  options: {
    id: 'frequentViewed',
    numberOfRecommendations: 5,
  },
});

const context = buildContext(engine);

// Main function to fetch recommendations
export async function getProductRecommendationsResponse(skuId) {
  try {
    const host = window.DanaherConfig !== undefined ? window.DanaherConfig.host : '';
    const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';

    context.add('itemId', skuId);
    context.add('host', host);
    context.add('internal', isInternal);

    await recommendationsController.refresh();

    const recommendations = recommendationsController.getRecommendations?.();
    return recommendations || [];
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    return [];
  }
}

import { getMetadata } from '../../scripts/lib-franklin.js';
import { getProductResponse, makeCoveoApiRequest } from '../../scripts/scripts.js';

function getCoveoApiPayload(qParam) {
  const sku = getMetadata('sku');
  const payload = {
    context: {
      host: 'stage.lifesciences.danaher.com',
      internal: false,
    },
    q: `@${qParam}==${sku}`,
    pipeline: 'Product Details',
  };
  return payload;
}

export default async function buildAutoBlocks() {
  const sku = getMetadata('sku');
  let response = getProductResponse();
  try {
    if (!response || response?.at(0)?.raw?.sku !== sku) {
      response = await makeCoveoApiRequest('/rest/search/v2', 'productKey', getCoveoApiPayload('productid'));
      if (response.results.length > 0) {
        localStorage.setItem('product-details', JSON.stringify(response.results));
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

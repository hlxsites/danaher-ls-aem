import { makeCoveoApiRequest } from '../../scripts/scripts.js';

function getCoveoApiPayload(qParam) {
  let sku = window.location.pathname.split('/')?.slice(-1);
  sku = sku.at(0).split('.').at(0);
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
  const response = await makeCoveoApiRequest('/rest/search/v2', 'productKey', getCoveoApiPayload('productid'));
  if (response.results.length > 0) {
    localStorage.setItem('product-details', JSON.stringify(response.results));
  }
}

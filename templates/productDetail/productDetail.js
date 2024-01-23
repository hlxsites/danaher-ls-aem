import { div } from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { getProductResponse, getSKU, makeCoveoApiRequest } from '../../scripts/scripts.js';

function getCoveoApiPayload(qParam) {
  const sku = getSKU();
  const payload = {
    context: {
      host: window.location.host,
      internal: false,
    },
    aq: `@${qParam}==${sku}`,
    pipeline: 'Product Details',
  };
  return payload;
}

export default async function buildAutoBlocks() {
  // build page tabs
  const pageTabsBlock = div(buildBlock('page-tabs', { elems: [] }));
  const productHeroEl = document.querySelector('main > div > div.product-hero');
  productHeroEl.parentElement.insertAdjacentElement('afterend', pageTabsBlock);

  const sku = getSKU();
  let response = getProductResponse();
  try {
    if (!response || response.at(0)?.raw.sku !== sku) {
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

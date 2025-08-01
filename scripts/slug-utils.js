import { getOpcoKeyFromValue } from './opco-mapping.js';

/**
 * Builds a product slug using SKU and OpCo key
 * Falls back to original clickUri if opco mapping is missing
 *
 * @param {object} product - The product object from API
 * @param {string} [fallbackUrl] - Fallback URL (usually clickUri)
 * @returns {string} - The formatted slug path like /products/sku/{sku}-{opcoKey}.html
 */

function buildProductSlug(product, fallbackUrl = '') {
  const sku = product?.raw?.sku;
  const opcoValue = product?.raw?.opco;
  const opcoKey = getOpcoKeyFromValue(opcoValue);

  if (!sku || !opcoKey) {
    console.warn(`Missing SKU or OpCo key for: SKU="${sku}", OpCo="${opcoValue}"`);
    return fallbackUrl;
  }
  return `/products/sku/${sku}-${opcoKey}.html`;
}

export default buildProductSlug;

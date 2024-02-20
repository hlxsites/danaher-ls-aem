// eslint-disable-next-line import/no-cycle
import { getCookie } from './scripts.js';
import { sampleRUM } from './lib-franklin.js';

export function getCommerceBase() {
  return window.DanaherConfig !== undefined ? window.DanaherConfig.intershopDomain + window.DanaherConfig.intershopPath : 'https://shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-';
}

/**
 * Returns the user authorization used for commerce API calls
 */
export function getAuthorization() {
  const authHeader = new Headers();
  if (localStorage.getItem('authToken')) {
    authHeader.append('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
  } else if (getCookie('ProfileData')) {
    const { customer_token: apiToken } = getCookie('ProfileData');
    authHeader.append('authentication-token', apiToken);
  } else if (getCookie('apiToken')) {
    const apiToken = getCookie('apiToken');
    authHeader.append('authentication-token', apiToken);
  }
  return authHeader;
}

/**
   * Returns the user logged in state based cookie
   */
export function isLoggedInUser() {
  return getCookie('rationalized_id');
}

export async function makeCoveoApiRequest(path, accessParam, payload = {}) {
  const accessToken = window.DanaherConfig !== undefined
    ? window.DanaherConfig[accessParam]
    : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
  const organizationId = window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchOrg
    : 'danahernonproduction1892f3fhz';
  const resp = await fetch(`https://${organizationId}.org.coveo.com${path}?organizationId=${organizationId}`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const jsonData = await resp.json();
  return jsonData;
}

/**
 *
 * @returns Product SKU from requested URL
 */
export function getSKU() {
  const sku = window.location.pathname.replace(/^\/content\/danaher\/ls\/us\/en\/products\//, '').replace(/\.html$/, '').split('/');
  return sku.pop();
}

/**
 *
 * @param qParam
 * @returns payload for product API
 */
function getProductApiPayload(qParam) {
  const sku = getSKU();
  const host = window.DanaherConfig !== undefined ? window.DanaherConfig.host : '';
  const payload = {
    context: {
      host: `${host}`,
      internal: false,
    },
    aq: `@${qParam}==${sku}`,
    pipeline: 'Product Details',
  };
  return payload;
}

/**
 *
 * @returns Product response from local storage
 */
/* eslint consistent-return: off */
export async function getProductResponse() {
  try {
    let response = JSON.parse(localStorage.getItem('product-details'));
    const sku = getSKU();
    if (response && response.at(0)?.raw.sku === sku) {
      return response;
    }
    const fullResponse = await makeCoveoApiRequest('/rest/search/v2', 'productKey', getProductApiPayload('productid'));
    if (fullResponse.results.length > 0) {
      response = fullResponse.results;
      localStorage.setItem('product-details', JSON.stringify(fullResponse.results));
      return response;
    }

    if (!response) {
      localStorage.removeItem('product-details');
      await fetch('/404.html')
        .then((html) => html.text())
        .then((data) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
          document.head.innerHTML = doc.head.innerHTML;
          document.querySelector('main').innerHTML = doc.querySelector('main').innerHTML;
          document.title = 'Product Not Found';
          document.querySelector('h1.heading-text').innerText = 'Product Not Found';
          document.querySelector('p.description-text').innerText = 'The product you are looking for is not available. Please try again later.';
          window.addEventListener('load', () => sampleRUM('404', { source: document.referrer, target: window.location.href }));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error:', error);
        });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

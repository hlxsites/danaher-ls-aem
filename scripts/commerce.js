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
    localStorage.removeItem('product-details');

    const host = `https://${window.DanaherConfig.host}/us/en/product-data`;
    const url = window.location.search
      ? `${host}/${window.location.search}&aq=@productid==${sku}`
      : `${host}/?aq=@productid==${sku}`;

    const fullResponse = await fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Sorry, network error, not able to render response.');
      });

    if (fullResponse.results.length > 0) {
      response = fullResponse.results;
      localStorage.setItem('product-details', JSON.stringify(fullResponse.results));
      return response;
    }

    if (!response) {
      await fetch('/404.html')
        .then((html) => html.text())
        .then((data) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
          document.head.innerHTML = doc.head.innerHTML;
          document.querySelector('main').innerHTML = doc.querySelector('main')?.innerHTML;
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

function getWorkflowFamily() {
  const pageUrl = window.location.pathname.replace(/^\/us\/en\/solutions\//, '').replace(/\.html$/, '').split('/');
  let params;
  if (pageUrl.includes('process-steps') && pageUrl.length === 4) {
    params = pageUrl.filter((param) => param !== 'process-steps');
  } else if (pageUrl.length === 3) {
    params = pageUrl.filter((param) => param !== 'products');
  }
  return params.join('|');
}

function getProductsOnSolutionsApiPayload(qParam) {
  const wfPath = getWorkflowFamily();
  const host = window.DanaherConfig !== undefined ? window.DanaherConfig.host : '';
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTimestamp = new Date().toISOString();
  const clientId = getCookie('coveo_visitorId');
  const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
  const searchHistoryString = localStorage.getItem('__coveo.analytics.history');
  const searchHistory = searchHistoryString ? JSON.parse(searchHistoryString) : [];
  const payload = {
    analytics: {
      actionCause: 'interfaceLoad',
      clientTimestamp: userTimestamp,
      customData: {
        context_workflow: `${wfPath}`,
        context_host: `${host}`,
        context_internal: isInternal,
      },
      documentReferrer: document.referrer,
      documentLocation: window.location.href,
      originContext: 'DanaherLifeSciencesCategoryProductListing',
    },
    actionsHistory: searchHistory.map(({ time, value, name }) => ({ time, value, name })),
    anonymous: false,
    aq: `@${qParam}==${wfPath}`,
    context: {
      workflow: `${wfPath}`,
      host: `${host}`,
      internal: isInternal,
    },
    firstResult: 0,
    locale: 'en',
    numberOfResults: 48,
    pipeline: 'Danaher LifeSciences Category Product Listing',
    referrer: document.referrer,
    searchHub: 'DanaherLifeSciencesCategoryProductListing',
    tab: 'Solutions',
    timezone: userTimeZone,
  };
  if (clientId !== null) {
    payload.analytics.clientId = clientId;
  }
  return payload;
}

/* eslint no-use-before-define: "off" */
async function makeCoveoAnalyticsApiRequest(path, accessParam, payload = {}) {
  const accessToken = window.DanaherConfig !== undefined
    ? window.DanaherConfig[accessParam]
    : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
  const organizationId = window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchOrg
    : 'danahernonproduction1892f3fhz';
  const resp = await fetch(`https://${organizationId}.analytics.org.coveo.com${path}`, {
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

/* eslint consistent-return: off */
export async function getProductsOnSolutionsResponse() {
  try {
    const response = JSON.parse(localStorage.getItem('solutions-product-list'));
    const fullResponse = await makeCoveoApiRequest('/rest/search/v2', 'categoryProductKey', getProductsOnSolutionsApiPayload('workflow'));

    const clientId = getCookie('coveo_visitorId');
    if (fullResponse && fullResponse.results.length > 0) {
      localStorage.setItem('solutions-product-list', JSON.stringify(fullResponse));
      if (clientId !== null) { await makeCoveoAnalyticsApiRequest('/rest/v15/analytics/search', 'categoryProductKey', getCoveoAnalyticsPayload(fullResponse)); }
      return fullResponse;
    }

    if (!response) {
      localStorage.removeItem('solutions-product-list');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function getCoveoAnalyticsPayload(response) {
  const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
  const clientId = getCookie('coveo_visitorId');
  const results = [];
  Array.from(response.results).forEach((res) => {
    results.push({
      documentUri: res.uri,
      documentUriHash: res.raw.urihash,
    });
  });
  const payload = {
    actionCause: 'interfaceLoad',
    anonymous: false,
    customData: {
      context_workflow: getWorkflowFamily(),
      context_host: window.DanaherConfig.host,
      context_internal: isInternal,
    },
    language: 'en',
    numberOfResults: response.totalCount,
    originLevel1: 'DanaherLifeSciencesCategoryProductListing',
    originLevel2: 'Solutions',
    originLevel3: document.referrer,
    queryPipeline: 'Danaher LifeSciences Category Product Listing',
    queryText: '',
    responseTime: response.duration,
    results,
    searchQueryUid: response.searchUid,
    userAgent: window.navigator.userAgent,
  };
  if (clientId !== null) {
    payload.clientId = clientId;
  }
  return payload;
}

export async function onClickCoveoAnalyticsResponse(clickedItem, index) {
  const response = JSON.parse(localStorage.getItem('solutions-product-list'));
  response?.results?.forEach((res) => {
    const matchItem = res?.clickUri;
    if (clickedItem === matchItem.split('/').pop()) {
      const searchUid = response?.searchUid;
      const idx = index;
      makeCoveoAnalyticsApiRequest('/rest/v15/analytics/click', 'categoryProductKey', onClickCoveoAnalyticsPayload(searchUid, idx, res));
    }
  });
}

function onClickCoveoAnalyticsPayload(srchUid, idx, res) {
  const clientId = getCookie('coveo_visitorId');
  const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
  const payload = {
    actionCause: 'documentOpen',
    anonymous: false,
    collectionName: res?.raw?.collection,
    customData: {
      context_workflow: getWorkflowFamily(),
      context_host: window.DanaherConfig.host,
      context_internal: isInternal,
      contentIDKey: 'permanentid',
      contentIDValue: res?.clickUri,
    },
    documentPosition: parseInt(idx, 10),
    documentTitle: res?.title,
    documentURL: res?.clickUri,
    documentUriHash: res?.raw?.urihash,
    language: 'en',
    originLevel1: 'DanaherLifeSciencesCategoryProductListing',
    originLevel2: 'Solutions',
    originLevel3: document.referrer,
    queryPipeline: 'Danaher LifeSciences Category Product Listing',
    searchQueryUid: srchUid,
    sourceName: res?.raw?.source,
    userAgent: window.navigator.userAgent,
  };
  if (clientId !== null) {
    payload.clientId = clientId;
  }
  return payload;
}

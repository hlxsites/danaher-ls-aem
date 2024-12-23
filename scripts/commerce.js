// eslint-disable-next-line import/no-cycle
import { getCookie } from './scripts.js';
import { sampleRUM, getMetadata } from './lib-franklin.js';
import {
  ProductPayloadBuilder, Context, CustomDataBuilder, AnalyticsBuilder, FacetBuilder,
} from './product-payload-builder.js';

export function getCommerceBase() {
  return window.DanaherConfig !== undefined ? window.DanaherConfig.intershopDomain + window.DanaherConfig.intershopPath : 'https://shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-';
}
console.log('brl ', getCommerceBase());
/**
 * Returns the user authorization used for commerce API calls
 */
export function getAuthorization() {
  const authHeader = new Headers();
  const siteID = window.DanaherConfig?.siteID;
  const hostName = window.location.hostname;
  let env;
  if (hostName.includes('local')) {
    env = 'local';
  } else if (hostName.includes('dev')) {
    env = 'dev';
  } else if (hostName.includes('stage')) {
    env = 'stage';
  } else {
    env = 'prod';
  }
  if (localStorage.getItem('authToken')) {
    authHeader.append('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
  } else if (getCookie('ProfileData')) {
    const { customer_token: apiToken } = getCookie('ProfileData');
    authHeader.append('authentication-token', apiToken);
  } else if (getCookie(`${siteID}_${env}_apiToken`)) {
    const apiToken = getCookie(`${siteID}_${env}_apiToken`);
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

/**
 *
 * @returns Product SKU from requested URL
 */
export function getSKU() {
  const sku = window.location.pathname.replace(/^\/content\/danaher\/ls\/us\/en\/products\//, '').replace(/\.html$/, '').split('/');
  return sku.pop();
}

async function makeCoveoRequest(path, accessParam, payload = {}, isAnalytics = false) {
  const accessToken = window.DanaherConfig?.[accessParam] || 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
  const organizationId = window.DanaherConfig?.searchOrg || 'danahernonproduction1892f3fhz';
  const domain = isAnalytics ? '.analytics.org.coveo.com' : '.org.coveo.com';
  const apiUrl = isAnalytics ? `https://${organizationId}${domain}${path}`
    : `https://${organizationId}${domain}${path}?organizationId=${organizationId}`;
  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return resp.json();
}

export async function makeCoveoApiRequest(path, accessParam, payload = {}) {
  // eslint-disable-next-line no-return-await
  return await makeCoveoRequest(path, accessParam, payload);
}

export async function makeCoveoAnalyticsApiRequest(path, accessParam, payload = {}) {
  // eslint-disable-next-line no-return-await
  return await makeCoveoRequest(path, accessParam, payload, true);
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
      ? `${host}/${window.location.search}&product=${sku}`
      : `${host}/?product=${sku}`;

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

export async function getProductPriceDetails() {
  try{
    let response = JSON.parse(localStorage.getItem('price-details'));
    const sku = getSKU();

    /* if (response && response.at(0)?.raw.sku === sku) {
      return response;
    } */
    localStorage.removeItem('price-details');

    const host = `https://${window.DanaherConfig.host}/us/en/product-data`;
    const url = window.location.search
      ? `${host}/${window.location.search}&product=${sku}`
      : `${host}/?product=${sku}`;

    const baseURL = getCommerceBase();
    let showURL = `${baseURL}/products/${sku} `;
    showURL = showURL.replace(/-abcam/g, "");
    console.log('cshowURL ', showURL);

    //const mockURL = 'https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/ab150686';

    let priceResponse = await fetch(showURL)

      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Sorry, network error, not able to render response.');
      });

      /* if (priceResponse.results.length > 0) {
        let presponse = priceResponse.results;
        localStorage.setItem('price-details', JSON.stringify(priceResponse.results));
        return presponse;
      } */
      if (Object.keys(priceResponse).length > 0) {
        let presponse = priceResponse;
        localStorage.setItem('price-details', JSON.stringify(priceResponse));
        return presponse;
      }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function getWorkflowFamily() {
  if (window.location.pathname.match(/\/us\/en\/solutions\//)) {
    const pageUrl = window.location.pathname.replace(/^\/us\/en\/solutions\//, '').replace(/\.html$/, '').split('/');
    let params;
    if (pageUrl.includes('process-steps')) {
      params = pageUrl.filter((param) => param !== 'process-steps');
    } else {
      params = pageUrl.filter((param) => param !== 'products');
    }
    return params.join('|');
  }
  return undefined;
}

function getOriginLevel2() {
  return getWorkflowFamily() ? 'Solutions' : 'Categories';
}

function getContextKey() {
  return getWorkflowFamily() ? 'context_workflow' : 'context_categories';
}

function getRequestType() {
  return getWorkflowFamily() ? 'workflow' : 'categories';
}

function getContextValue() {
  return getWorkflowFamily() ? getWorkflowFamily() : getMetadata('fullcategory');
}

function getOpcoFacets(extraParams = {}) {
  const opcoFacets = new FacetBuilder()
    .withFilterFacetCount(true)
    .withInjectionDepth(1000)
    .withNumberOfValues(8)
    .withSortCriteria('automatic')
    .withResultsMustMatch('atLeastOneValue')
    .withType('specific')
    .withIsFieldExpanded(false)
    .withFacetId('opco')
    .withField('opco')
    .withLabel('Brand')
    .build();

  Object.entries(extraParams).forEach(([key, value]) => {
    opcoFacets[key] = value;
  });

  return opcoFacets;
}

function getProcessStepFacets(extraParams = {}) {
  const workflowNameFacets = new FacetBuilder()
    .withDelimitingCharacter('|')
    .withFilterFacetCount(true)
    .withInjectionDepth(1000)
    .withNumberOfValues(8)
    .withSortCriteria('occurrences')
    .withBasePath([])
    .withFilterByBasePath(true)
    .withResultsMustMatch('atLeastOneValue')
    .withCurrentValues([])
    .withPreventAutoSelect(false)
    .withType('hierarchical')
    .withFacetId('workflowname')
    .withField('workflowname')
    .withLabel('Process Step')
    .build();

  Object.entries(extraParams).forEach(([key, value]) => {
    workflowNameFacets[key] = value;
  });

  return workflowNameFacets;
}

function getAnalytics(extraParams = {}) {
  const customerData = new CustomDataBuilder()
    .withContext(getContextKey(), getContextValue())
    .withContextHost(window.DanaherConfig.host)
    .withContextInternal(typeof getCookie('exclude-from-analytics') !== 'undefined')
    .build();

  const analytics = new AnalyticsBuilder()
    .withActionCause('interfaceLoad')
    .withClientTimestamp(new Date().toISOString())
    .withCustomData(customerData)
    .withDocumentReferrer(document.referrer)
    .withDocumentLocation(window.location.href)
    .withClientId(getCookie('coveo_visitorId'))
    .build();

  Object.entries(extraParams).forEach(([key, value]) => {
    analytics[key] = value;
  });

  return analytics;
}

function buildProductsApiPayload(extraParams = {}) {
  const searchHistory = JSON.parse(localStorage.getItem('__coveo.analytics.history') || '[]');

  const payload = new ProductPayloadBuilder()
    .withActionHistory(searchHistory.map(({ time, value, name }) => ({ time, value, name })))
    .withAnonymous(false)
    .withAQ(`@${getRequestType()}==${getContextValue()}`)
    .withContext(new Context()
      .withContext(getRequestType(), getContextValue())
      .withHost(window.DanaherConfig.host)
      .withInternal(typeof getCookie('exclude-from-analytics') !== 'undefined')
      .build())
    .withFieldsToInclude(['images', 'description', 'collection', 'source'])
    .withFirstResult(0)
    .withLocale('en')
    .withNumberOfResults(48)
    .withQueryPipeline('Danaher LifeSciences Category Product Listing')
    .withReferrer(document.referrer)
    .withSearchHub('DanaherLifeSciencesCategoryProductListing')
    .withTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    .build();

  Object.entries(extraParams).forEach(([key, value]) => {
    payload[key] = value;
  });

  return payload;
}

function buildAnalyticsPayload(response, actionCause, extraParams = {}) {
  const results = [];
  Array.from(response.results).forEach((res) => {
    results.push({
      documentUri: res.uri,
      documentUriHash: res.raw.urihash,
    });
  });

  const payload = new ProductPayloadBuilder()
    .withActionCause(actionCause)
    .withAnonymous(false)
    .withLanguage('en')
    .withOriginLevel1('DanaherLifeSciencesCategoryProductListing')
    .withOriginLevel2(getOriginLevel2())
    .withOriginLevel3(document.referrer)
    .withQueryPipeline('Danaher LifeSciences Category Product Listing')
    .withResponseTime(response.duration)
    .withResults(results)
    .withSearchQueryUid(response.searchUid)
    .withUserAgent(window.navigator.userAgent)
    .withClientId(getCookie('coveo_visitorId'))
    .withCustomData(new CustomDataBuilder()
      .withContext(getContextKey(), getContextValue())
      .withContextHost(window.DanaherConfig.host)
      .withContextInternal(typeof getCookie('exclude-from-analytics') !== 'undefined')
      .build())
    .build();

  Object.entries(extraParams).forEach(([key, value]) => {
    payload[key] = value;
  });

  return payload;
}

function onLoadCoveoAnalyticsPayload(response) {
  return buildAnalyticsPayload(response, 'interfaceLoad', {
    numberOfResults: response.totalCount,
    queryText: '',
  });
}

/* eslint consistent-return: off */
async function fetchAndHandleResponse(storageKey, payload) {
  try {
    const fullResponse = await makeCoveoApiRequest('/rest/search/v2', 'categoryProductKey', payload);
    const clientId = getCookie('coveo_visitorId');

    if (fullResponse && fullResponse.results.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(fullResponse));
      if (clientId !== null) { await makeCoveoAnalyticsApiRequest('/rest/v15/analytics/search', 'categoryProductKey', onLoadCoveoAnalyticsPayload(fullResponse)); }
    } else localStorage.removeItem(storageKey);
    return fullResponse;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export async function getProductsOnSolutionsResponse() {
  const analuticsPayload = getAnalytics({
    originContext: 'DhanaerLifeSciencesCategoryProductListing',
  });

  const payload = buildProductsApiPayload({
    analytics: analuticsPayload,
    tab: 'Solutions',
  });

  return fetchAndHandleResponse('solutions-product-list', payload);
}

function buildObject(parts) {
  if (parts.length === 0) {
    return [];
  }

  const value = parts[0];
  const remainingParts = parts.slice(1);

  return [{
    value,
    retrieveCount: 8,
    children: buildObject(remainingParts),
    state: remainingParts.length === 0 ? 'selected' : 'idle',
    retrieveChildren: remainingParts.length === 0,
  }];
}

function queryToObject(str) {
  const parts = str.split(',');
  return buildObject(parts)[0];
}

export async function getProductsForCategories(extraParams = {}) {
  const analyticsPayload = getAnalytics({
    originContext: 'Search',
  });
  let facets = [getOpcoFacets(), getProcessStepFacets()];
  if (extraParams) {
    const keys = Object.keys(extraParams);
    keys.forEach((key) => {
      facets = facets.filter((facet) => facet.facetId !== key);
      if (key === 'opco') {
        facets.push(getOpcoFacets({
          currentValues: [{ value: decodeURIComponent(extraParams[key]), state: extraParams[key] ? 'selected' : 'idle' }],
          preventAutoSelect: !!extraParams[key],
          freezeCurrentValues: !!extraParams[key],
        }));
      } else {
        facets.push(getProcessStepFacets({
          currentValues: [queryToObject(decodeURIComponent(extraParams[key]))],
          preventAutoSelect: !!extraParams[key],
        }));
      }
      analyticsPayload.facetId = key;
      analyticsPayload.facetField = key;
      analyticsPayload.facetTitle = key === 'opco' ? 'Brand' : 'Process Step';
      analyticsPayload.facetValue = decodeURIComponent(extraParams[key]);
    });
  }

  const payload = buildProductsApiPayload({
    analytics: analyticsPayload,
    tab: 'Categories',
    facets,
  });

  return fetchAndHandleResponse('product-categories', payload);
}

function onClickCoveoAnalyticsPayload(response, idx, res) {
  return buildAnalyticsPayload(response, 'documentOpen', {
    clientId: getCookie('coveo_visitorId'),
    collectionName: res?.raw?.collection,
    documentPosition: parseInt(idx, 10),
    documentTitle: res?.title,
    documentURL: res?.clickUri,
    documentUriHash: res?.raw?.urihash,
    numberOfResults: parseInt(idx, 10),
    sourceName: res?.raw?.source,
  });
}

export async function onClickCoveoAnalyticsResponse(clickedItem, index) {
  const response = JSON.parse(localStorage.getItem('solutions-product-list'));
  response?.results?.forEach((res) => {
    const matchItem = res?.clickUri.replace('.html', '');
    if (clickedItem === matchItem.split('/').pop()) {
      const idx = index;
      makeCoveoAnalyticsApiRequest('/rest/v15/analytics/click', 'categoryProductKey', onClickCoveoAnalyticsPayload(response, idx, res));
    }
  });
}

function getProductRecomnsSearchApiPayload() {
  const host = window.DanaherConfig !== undefined ? window.DanaherConfig.host : '';
  const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
  const searchHistoryString = localStorage.getItem('__coveo.analytics.history');
  const searchHistory = searchHistoryString ? JSON.parse(searchHistoryString) : [];
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTimestamp = new Date().toISOString();
  const clientId = getCookie('coveo_visitorId');
  const itemIds = [];
  itemIds.push(getSKU());
  const payload = {
    analytics: {
      actionCause: 'recommendationInterfaceLoad',
      clientTimestamp: userTimestamp,
      customData: {
        context_host: `${host}`,
        context_internal: isInternal,
      },
      documentReferrer: document.referrer,
      documentLocation: window.location.href,
      originContext: 'DanaherLifeSciencesProductRecommendations',
    },
    actionsHistory: searchHistory.map(({ time, value, name }) => ({ time, value, name })),
    anonymous: false,
    context: {
      host: `${host}`,
      internal: isInternal,
    },
    firstResult: 0,
    locale: 'en',
    numberOfResults: 8,
    mlParameters: {
      itemId: itemIds[0],
    },
    fieldsToInclude: [
      'description',
      'categoriesname',
      'images',
      'source',
    ],
    pipeline: 'Danaher LifeSciences Product Recommendations',
    recommendation: 'frequentViewed',
    referrer: document.referrer,
    searchHub: 'DanaherLifeSciencesProductRecommendations',
    tab: 'Frequently Viewed Together',
    timezone: userTimeZone,
  };
  if (clientId !== null) {
    payload.analytics.clientId = clientId;
  }
  return payload;
}

function getProductRecomnsAnalyticsPayload(resp) {
  const host = window.DanaherConfig !== undefined ? window.DanaherConfig.host : '';
  const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
  const clientId = getCookie('coveo_visitorId');
  const results = [];
  Array.from(resp.results).forEach((res) => {
    results.push({
      documentUri: res.uri,
      documentUriHash: res.raw.urihash,
    });
  });
  const payload = {
    actionCause: 'recommendationInterfaceLoad',
    anonymous: false,
    customData: {
      context_host: `${host}`,
      context_internal: isInternal,
    },
    language: 'en',
    numberOfResults: resp.results.length,
    originLevel1: 'DanaherLifeSciencesProductRecommendations',
    originLevel2: 'Frequently Viewed Together',
    originLevel3: document.referrer,
    queryPipeline: 'Danaher LifeSciences Product Recommendations',
    queryText: '',
    responseTime: resp.duration,
    results,
    searchQueryUid: resp.searchUid,
    userAgent: window.navigator.userAgent,
  };
  if (clientId !== null) {
    payload.clientId = clientId;
  }
  return payload;
}

/* eslint consistent-return: off */
export async function getProductRecommendationsResponse() {
  try {
    const fullResponse = await makeCoveoApiRequest('/rest/search/v2', 'productRecommendationsKey', getProductRecomnsSearchApiPayload());
    const clientId = getCookie('coveo_visitorId');
    if (fullResponse && fullResponse.results.length > 0) {
      localStorage.setItem('product-recommendations', JSON.stringify(fullResponse));
      if (clientId !== null) { await makeCoveoAnalyticsApiRequest('/rest/v15/analytics/search', 'productRecommendationsKey', getProductRecomnsAnalyticsPayload(fullResponse)); }
      return fullResponse;
    }
    localStorage.removeItem('product-recommendations');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function onClickProductRecomnsPayload(srchUid, idx, resp) {
  const clientId = getCookie('coveo_visitorId');
  const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
  const host = window.DanaherConfig !== undefined ? window.DanaherConfig.host : '';
  const payload = {
    actionCause: 'recommendationOpen',
    anonymous: false,
    collectionName: resp?.raw?.collection,
    customData: {
      context_host: `${host}`,
      context_internal: isInternal,
      contentIDKey: 'permanentid',
      contentIDValue: resp?.clickUri,
    },
    documentPosition: parseInt(idx, 10),
    documentTitle: resp?.title,
    documentURL: resp?.clickUri,
    documentUriHash: resp?.raw?.urihash,
    language: 'en',
    originLevel1: 'DanaherLifeSciencesProductRecommendations',
    originLevel2: 'Frequently Viewed Together',
    originLevel3: document.referrer,
    queryPipeline: 'Danaher LifeSciences Product Recommendations',
    searchQueryUid: srchUid,
    sourceName: resp?.raw?.source,
    userAgent: window.navigator.userAgent,
  };
  if (clientId !== null) {
    payload.clientId = clientId;
  }
  return payload;
}

export async function onClickProductRecomnsResponse(clickedItem, index) {
  const response = JSON.parse(localStorage.getItem('product-recommendations'));
  response?.results?.forEach((res) => {
    const matchItem = res?.clickUri;
    if (clickedItem.replace(/\.html$/, '') === matchItem.split('/').pop().replace(/\.html$/, '')) {
      const searchUid = response?.searchUid;
      const idx = index;
      makeCoveoAnalyticsApiRequest('/rest/v15/analytics/click', 'productRecommendationsKey', onClickProductRecomnsPayload(searchUid, idx, res));
    }
  });
}

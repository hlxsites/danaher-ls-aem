/* eslint-disable */
import { loadScript, sampleRUM } from './lib-franklin.js';
import { setCookie, isOTEnabled } from './scripts.js';
import { getAuthorization, getCommerceBase } from './commerce.js';
import { getMetadata } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

let refresh = false;
const baseURL = getCommerceBase();

// add more delayed functionality here
// google tag manager -start
function loadGTM() {
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
      let gtmId = window.DanaherConfig !== undefined ? window.DanaherConfig.gtmID : 'GTM-KCBGM2N';
      // googleTagManager
      (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
              'gtm.start':
                  new Date().getTime(), event: 'gtm.js'
          });
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src =
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
      })(window, document, 'script', 'dataLayer', gtmId);
      `;
  document.head.prepend(scriptTag);
}
// google tag manager -end

// Adobe Target - start

window.targetGlobalSettings = {
  bodyHidingEnabled: false,
};

function loadAT() {
  function targetPageParams() {
    return {
      'at_property': '6aeb619e-92d9-f4cf-f209-6d88ff58af6a'
    };
  }
  loadScript('/scripts/at-lsig.js');
}
// Adobe Target - end

// Coveo Events - start

function sendCoveoEventPage() {
  const usp = new URLSearchParams(window.location.search);
  const pdfurl = usp.get('pdfurl');
  const pdftitle = usp.get('title');

  let cval = '';
  if (pdfurl != null && pdfurl.length > 0) {
    cval = window.location.origin + pdfurl;
  } else {
    cval = window.location.origin + window.location.pathname;
  }

  let title = '';
  if (pdftitle != null && pdftitle.length > 0) {
    title = pdftitle;
  } else {
    title = document.title;
  }

  coveoua(
    'init',
    accessToken,
    `https://${organizationId}.analytics.org.coveo.com`,
  );

  coveoua('send', 'view', {
    contentIdKey: 'permanentid',
    contentIdValue: cval,
    language: 'en',
    username: 'anonymous',
    title: title,
    location: document.location.href,
    originLevel1: "DanaherMainSearch",
  });
}

function sendCoveoEventProduct() {

  coveoua('set', 'currencyCode', 'USD');
  coveoua(
    'init',
    accessToken,
    `https://${organizationId}.analytics.org.coveo.com`,
  );

  const cats = document.querySelector('.hero-default-content .categories');
  let pcats = '';
  if (cats != null) {
    pcats = cats.textContent.replaceAll('|', '/').replaceAll(',', '|');
  }

  coveoua('ec:addProduct', {
    id: document.querySelector('.hero-default-content .sku')?.textContent,
    name: document.querySelector('.hero-default-content .title')?.textContent,
    category: pcats,
    price: 0,
    brand: document.querySelector('.hero-default-content .brand')?.textContent
  });

  coveoua('ec:setAction', 'detail');
  coveoua('send', 'event', {
    "searchHub": "DanaherMainSearch"
  });
}

// Coveo Events - end

// Get authorization token for anonymous user
async function getAuthToken() {
  if (!refresh) {
    refresh = true;
    const formData = 'grant_type=anonymous&scope=openid+profile&client_id=';
    const authRequest = await fetch(`${baseURL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (authRequest.ok) {
      const data = await authRequest.json();
      const expiresIn = data.expires_in * 1000;
      setCookie('apiToken', data.access_token, expiresIn, '/');
      localStorage.setItem('refreshToken', data.refresh_token);
    }
  }
}
// Get authorization token for anonymous user - end

// Loading fathom script - start
const attrs = JSON.parse('{"data-site": "KGTBOGMR"}');
loadScript('https://cdn.usefathom.com/script.js', attrs);
// Loading fathom script - end

// coveo analytics - start
(function (c, o, v, e, O, u, a) {
  a = 'coveoua';
  c[a] = c[a]
    || function () {
      (c[a].q = c[a].q || []).push(arguments);
    };
  c[a].t = Date.now();

  u = o.createElement(v);
  u.async = 1;
  u.src = e;
  O = o.getElementsByTagName(v)[0];
  O.parentNode.insertBefore(u, O);
}(
  window,
  document,
  'script',
  'https://static.cloud.coveo.com/coveo.analytics.js/2/coveoua.js',
));

const accessToken = window.DanaherConfig !== undefined
  ? window.DanaherConfig.searchKey
  : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
const organizationId = window.DanaherConfig !== undefined
  ? window.DanaherConfig.searchOrg
  : 'danahernonproduction1892f3fhz';
// coveo analytics - end

const authHeader = getAuthorization();
if (!authHeader || !(authHeader.has('authentication-token') || authHeader.has('Authorization'))) {
  getAuthToken();
}

if (!window.location.hostname.includes('localhost')) {
  loadGTM();
  //loadAT();

  if (isOTEnabled()) {
    if (getMetadata('template') === 'ProductDetail' && document.querySelector('h1')) {
      sendCoveoEventProduct();
    } else if (getMetadata('template') !== 'ProductDetail') {
      sendCoveoEventPage();
    }
  }
}
/* eslint-enable */

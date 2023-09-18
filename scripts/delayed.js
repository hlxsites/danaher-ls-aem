// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';
import { getCookie, setCookie } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

let refresh = false;

/* eslint-disable */
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
function loadAT() {
  function targetPageParams() {
    return {
      'at_property': '6aeb619e-92d9-f4cf-f209-6d88ff58af6a'
    };
  }
  loadScript('/scripts/at-lsig.js');
}
// Adobe Target - end

// Accessibe - start
function loadAccessibe() {
  loadScript('/scripts/lib-accessibe.js');
}
// Accessibe - end

// Get quote - start
async function getQuote() {
  const reqHeaders = new Headers();
  if (localStorage.getItem('authToken')) {
    reqHeaders.append('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
  } else if (getCookie('ProfileData')) {
    const { customer_token: apiToken } = getCookie('ProfileData');
    reqHeaders.append('authentication-token', apiToken);
  } else if (getCookie('apiToken')) {
    const apiToken = getCookie('apiToken');
    reqHeaders.append('authentication-token', apiToken);
  } else if (!refresh) {
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
      reqHeaders.append('authentication-token', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
    }
  }

  if (reqHeaders.has('authentication-token') || reqHeaders.has('Authorization')) {
    const quoteRequest = await fetch(`${baseURL}/rfqcart/-`, { headers: reqHeaders });
    if (quoteRequest.ok) {
      const data = await quoteRequest.json();
      if (data && data.items) {
        const rfqQuantity = data.items.length;
        if (rfqQuantity !== 0) {
          const quantityElement = document.querySelector('header a.quote span.quantity');
          if (quantityElement) quantityElement.textContent = rfqQuantity;
          const dotElement = document.querySelector('header a.quote span.dot');
          if (dotElement) dotElement.classList.remove('hidden');
        }
      }
    } else if (quoteRequest.status !== 404) {
      // eslint-disable-next-line no-console
      console.warn('Failed to load quote cart');
    }
  }
}
// Get quote - end

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

getQuote();
if (
  !window.location.hostname.includes('localhost')
  && !document.location.hostname.includes('.hlx.page')
) {
  loadGTM();
  //loadAT();
  loadAccessibe();
  coveoua(
    'init',
    accessToken,
    `https://${organizationId}.analytics.org.coveo.com`,
  );
  coveoua('send', 'pageview');
}
/* eslint-enable */

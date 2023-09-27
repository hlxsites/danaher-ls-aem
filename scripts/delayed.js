/* eslint-disable */
import { loadScript, sampleRUM } from './lib-franklin.js';
import { getAuthorization, setCookie } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

let refresh = false;
const baseURL = window.DanaherConfig !== undefined ? window.DanaherConfig.intershopDomain + window.DanaherConfig.intershopPath : 'https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-';

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

// UTM Paramaters check - start
function getParameterByName(parameter, url = window.location.href) {
  parameter = parameter.replace(/[\[\]]/g, '\\$&');
var regex = new RegExp('[?&]' + parameter + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
if (!results) return null;
if (!results[2]) return '';
return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let utm_campaign = getParameterByName('utm_campaign');
if(utm_campaign != null){
  window.localStorage.setItem('danaher_utm_campaign',utm_campaign);
}

let utm_source = getParameterByName('utm_source');
if(utm_source != null){
  window.localStorage.setItem('danaher_utm_source',utm_source);
}

let utm_medium = getParameterByName('utm_medium');
if(utm_medium != null){
  window.localStorage.setItem('danaher_utm_medium',utm_medium);
}

let utm_content = getParameterByName('utm_content');
if(utm_content != null){
  window.localStorage.setItem('danaher_utm_content',utm_content);
}

let utm_term = getParameterByName('utm_term');
if(utm_term != null){
  window.localStorage.setItem('danaher_utm_term',utm_term);
}

let utm_previouspage = getParameterByName('utm_previouspage');
if(utm_previouspage != null){
  window.localStorage.setItem('danaher_utm_previouspage',utm_previouspage);
}
// UTM Paramaters check - end


const authHeader = getAuthorization();
if (!authHeader || !(authHeader.has('authentication-token') || authHeader.has('Authorization'))) {
  getAuthToken();
}

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

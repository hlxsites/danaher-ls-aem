// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
// google tag manager -start
function loadGTM() {
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
      let gtmId = window.DanaherConfig !== undefined ? window.DanaherConfig.gtmID : 'GTM-THXPLCS';
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
})(
  window,
  document,
  'script',
  'https://static.cloud.coveo.com/coveo.analytics.js/2/coveoua.js',
);

function getCookie(cname) {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  let value = '';
  ca.forEach((c) => {
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      value = c.substring(name.length, c.length);
    }
  });
  return value;
}

const clientId = getCookie('coveo_visitorId');
const isInternal = typeof getCookie('exclude-from-analytics') !== 'undefined';
const pageName = window.atPageParams !== undefined ? window.atPageParams.page : '';

const accessToken = window.DanaherConfig !== undefined
  ? window.DanaherConfig.searchKey
  : 'xxf2f10385-5a54-4a18-bb48-fd8025d6b5d2';
const organizationId = window.DanaherConfig !== undefined
  ? window.DanaherConfig.searchOrg
  : 'danaherproductionrfl96bkr';
const loc = 'Danaher Life Sciences | Drug Discovery & Development Solutions';

const customMetadata = {
  contentIdKey: 'contentpath',
  contentIdValue: '/content/danaher/ls/us/en',
  language: 'en',
  title: 'https://lifesciences.danaher.com/us/en.html',
  location: loc,
  clientId: clientId,
  anonymous: true,
  customData: {
    context_internal: isInternal,
  },
};
// coveo analytics - end

// if (
//   !window.location.hostname.includes('localhost')
//   && !document.location.hostname.includes('.hlx.page')
// ) {
  loadGTM();
  coveoua(
    'init',
    accessToken,
    'https://' + organizationId + '.analytics.org.coveo.com',
  );

  if (pageName !== '' && !pageName.includes('products')) {
    coveoua('send', 'view', customMetadata);
  }

  coveoua('ec:setAction', 'detail');
  coveoua('send', 'event');
// }

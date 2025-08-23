/* eslint-disable */
import { loadScript, sampleRUM } from './lib-franklin.js';
import { setCookie, isOTEnabled } from './scripts.js';
import { getAuthorization, getCommerceBase } from './commerce.js';
import { getMetadata } from './lib-franklin.js';

/*
  *
  :::::::::::
     include function to add utm params in the url(s)
  ::::::::::::::
  *
  */
function initUtmParamsUtm() {
  var hyperLink;
  const regex = "/content/danaher/ls";
  if (document.getElementsByTagName("a")) {
    hyperLink = document.getElementsByTagName("a");
    for (let i = 0; i < hyperLink.length; ++i) {
      if (
        hyperLink[i].getAttribute("href") != null &&
        !hyperLink[i].getAttribute("href").includes("lifesciences.danaher.com")
      ) {
        if (
          hyperLink[i].getAttribute("href").startsWith("http") ||
          hyperLink[i].getAttribute("href").startsWith("https") ||
          hyperLink[i].getAttribute("href").startsWith("ftp://")
        ) {
          if (
            hyperLink[i]
              .getAttribute("href")
              .includes("utm_source=dhls_website") ||
            hyperLink[i].getAttribute("href") == "#" ||
            hyperLink[i].getAttribute("href").startsWith("mailto:") ||
            hyperLink[i].getAttribute("href").includes("/content/danaher/ls")
          ) {
            //Nothing to add/update
          } else if (hyperLink[i].getAttribute("href").includes("?")) {
            hyperLink[i].setAttribute(
              "href",
              hyperLink[i].getAttribute("href") + "&utm_source=dhls_website"
            );
          } else {
            hyperLink[i].setAttribute(
              "href",
              hyperLink[i].getAttribute("href") + "?utm_source=dhls_website"
            );
          }
        } else if (
          hyperLink[i].getAttribute("href").startsWith("/content/danaher/ls")
        ) {
          hyperLink[i].setAttribute(
            "href",
            hyperLink[i].getAttribute("href").replace(regex, "")
          );
        }
      }
    }
  } else {
    hyperLink = null;
  }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUtmParamsUtm);
} else {
  initUtmParamsUtm();
}
 /*
  *
  :::::::::::
     include / exclude eds page for Prod and Stage
  ::::::::::::::
  *
  */
export const includeProdEdsPaths = ['news-eds', 'news-eds.html', 'blog-eds.html', 'blog-eds', 'products/brands', 'products/2d-3d-cell-culture-systems', 'products/antibodies', 'products/capillary-electrophoresis-systems', 'products/cell-lines-lysates', 'products/extraction-kits', 'products/liquid-handlers', 'products/assay-kits', 'products/biochemicals', 'products/cell-counters-analyzers', 'products/cellular-imaging-systems', 'products/high-performance-liquid-chromatography-systems', 'products/high-throughput-cellular-screening-systems', 'products/mass-spectrometers', 'products/microarray-scanners', 'products/microbioreactors', 'products/microplate-readers', 'products/microscopes', 'products/particle-counters-and-analyzers', 'products/patch-clamp-systems', 'products/proteins-peptides', 'products/sample-preparation-detection', 'products/software-platforms', 'products/centrifuges', 'products/clone-screening-systems', 'products/flow-cytometers', 'products/chromatography-columns', '/products.html'];

export const includeStageEdsPaths = ['news', 'news.html', 'blog.html', 'blog', 'we-see-a-way', 'we-see-a-way.html', 'products/brands', 'products.html', 'products/2d-3d-cell-culture-systems', 'products/antibodies', 'e-buy', 'products/capillary-electrophoresis-systems', 'products/cell-lines-lysates', 'products/extraction-kits', 'products/liquid-handlers', 'products/assay-kits', 'products/biochemicals', 'products/cell-counters-analyzers', 'products/cellular-imaging-systems', 'products/high-performance-liquid-chromatography-systems', 'products/high-throughput-cellular-screening-systems', 'products/mass-spectrometers', 'products/microarray-scanners', 'products/microbioreactors', 'products/microplate-readers', 'products/microscopes', 'products/particle-counters-and-analyzers', 'products/patch-clamp-systems', 'products/proteins-peptides', 'products/sample-preparation-detection', 'products/software-platforms', 'products/centrifuges', 'products/clone-screening-systems', 'products/flow-cytometers', 'products/chromatography-columns',];

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
      at_property: '6aeb619e-92d9-f4cf-f209-6d88ff58af6a',
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
    `https://${organizationId}.analytics.org.coveo.com`
  );

  coveoua('send', 'view', {
    contentIdKey: 'permanentid',
    contentIdValue: cval,
    language: 'en',
    username: 'anonymous',
    title: title,
    location: document.location.href,
    originLevel1: 'DanaherMainSearch',
  });
}

function sendCoveoEventProduct() {
  coveoua('set', 'currencyCode', 'USD');
  coveoua(
    'init',
    accessToken,
    `https://${organizationId}.analytics.org.coveo.com`
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
    brand: document.querySelector('.hero-default-content .brand')?.textContent,
  });

  coveoua('ec:setAction', 'detail');
  coveoua('send', 'event', {
    searchHub: 'DanaherMainSearch',
  });
}

// Coveo Events - end

// Get authorization token for anonymous user
// async function getAuthToken() {
//   if (!refresh) {
//     refresh = true;
//     const siteID = window.DanaherConfig?.siteID;
//     const formData = 'grant_type=anonymous&scope=openid+profile&client_id=';
//     const authRequest = await fetch(
//       `/content/danaher/services/auth/token?id=${siteID}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//         body: formData,
//       }
//     );
//     if (authRequest.ok) {
//       const hostName = window.location.hostname;
//       const env = hostName.includes('local')
//         ? 'local'
//         : hostName.includes('dev')
//         ? 'dev'
//         : hostName.includes('stage')
//         ? 'stage'
//         : 'prod';
//       const data = await authRequest.json();
//       sessionStorage.setItem(`${siteID}_${env}_apiToken`, JSON.stringify(data));
//       sessionStorage.setItem(
//         `${siteID}_${env}_refresh-token`,
//         data.refresh_token
//       );
//     }
//   }
// }
async function getAuthToken() {
  if (!refresh) {
    refresh = true;
    const siteID = window.DanaherConfig?.siteID;
    const formData = 'grant_type=anonymous&scope=openid+profile&client_id=';
    const authRequest = await fetch(`/content/danaher/services/auth/token?id=${siteID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    if (authRequest.ok) {
      const hostName = window.location.hostname;
      const env = hostName.includes('local') ? 'local' : hostName.includes('dev') ? 'dev' : hostName.includes('stage') ? 'stage' : 'prod';
      const data = await authRequest.json();
      sessionStorage.setItem(`${siteID}_${env}_apiToken`, JSON.stringify(data));
      sessionStorage.setItem(`${siteID}_${env}_refresh-token`, data.refresh_token);
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
  c[a] =
    c[a] ||
    function () {
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
  'https://static.cloud.coveo.com/coveo.analytics.js/2/coveoua.js'
);

const accessToken =
  window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchKey
    : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
const organizationId =
  window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchOrg
    : 'danahernonproduction1892f3fhz';
// coveo analytics - end

const authHeader = getAuthorization();
if (
  !authHeader ||
  !(authHeader.has('authentication-token') || authHeader.has('Authorization'))
) {
  getAuthToken();
}

if (!window.location.hostname.includes('localhost')) {
  loadGTM();
  //loadAT();

  if (isOTEnabled()) {
    if (
      getMetadata('template') === 'ProductDetail' &&
      document.querySelector('h1')
    ) {
      sendCoveoEventProduct();
    } else if (getMetadata('template') !== 'ProductDetail') {
      sendCoveoEventPage();
    }
  }
}
/* eslint-enable */

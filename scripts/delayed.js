/* eslint-disable */
import { loadScript, sampleRUM } from "./lib-franklin.js";
import { setCookie, isOTEnabled } from "./scripts.js";
import { getAuthorization, getCommerceBase } from "./commerce.js";
import { getMetadata } from "./lib-franklin.js";

// Core Web Vitals RUM collection
sampleRUM("cwv");

let refresh = false;
const baseURL = getCommerceBase();

// add more delayed functionality here
// google tag manager -start
function loadGTM() {
  const scriptTag = document.createElement("script");
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
<<<<<<< HEAD
      at_property: '6aeb619e-92d9-f4cf-f209-6d88ff58af6a',
=======
      at_property: "6aeb619e-92d9-f4cf-f209-6d88ff58af6a",
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    };
  }
  loadScript("/scripts/at-lsig.js");
}
// Adobe Target - end

// Coveo Events - start

function sendCoveoEventPage() {
  const usp = new URLSearchParams(window.location.search);
  const pdfurl = usp.get("pdfurl");
  const pdftitle = usp.get("title");

  let cval = "";
  if (pdfurl != null && pdfurl.length > 0) {
    cval = window.location.origin + pdfurl;
  } else {
    cval = window.location.origin + window.location.pathname;
  }

  let title = "";
  if (pdftitle != null && pdftitle.length > 0) {
    title = pdftitle;
  } else {
    title = document.title;
  }

  coveoua(
    "init",
    accessToken,
    `https://${organizationId}.analytics.org.coveo.com`
  );

  coveoua("send", "view", {
    contentIdKey: "permanentid",
    contentIdValue: cval,
    language: "en",
    username: "anonymous",
    title: title,
    location: document.location.href,
    originLevel1: 'DanaherMainSearch',
  });
}

function sendCoveoEventProduct() {
<<<<<<< HEAD
  coveoua('set', 'currencyCode', 'USD');
=======
  coveoua("set", "currencyCode", "USD");
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  coveoua(
    "init",
    accessToken,
    `https://${organizationId}.analytics.org.coveo.com`
  );

  const cats = document.querySelector(".hero-default-content .categories");
  let pcats = "";
  if (cats != null) {
    pcats = cats.textContent.replaceAll("|", "/").replaceAll(",", "|");
  }

  coveoua("ec:addProduct", {
    id: document.querySelector(".hero-default-content .sku")?.textContent,
    name: document.querySelector(".hero-default-content .title")?.textContent,
    category: pcats,
    price: 0,
<<<<<<< HEAD
    brand: document.querySelector('.hero-default-content .brand')?.textContent,
  });

  coveoua('ec:setAction', 'detail');
  coveoua('send', 'event', {
    searchHub: 'DanaherMainSearch',
=======
    brand: document.querySelector(".hero-default-content .brand")?.textContent,
  });

  coveoua("ec:setAction", "detail");
  coveoua("send", "event", {
    searchHub: "DanaherMainSearch",
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  });
}

// Coveo Events - end

// Get authorization token for anonymous user
async function getAuthToken() {
  if (!refresh) {
    refresh = true;
    const siteID = window.DanaherConfig?.siteID;
<<<<<<< HEAD
    const formData = 'grant_type=anonymous&scope=openid+profile&client_id=';
    const authRequest = await fetch(
      `/content/danaher/services/auth/token?id=${siteID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
=======
    const formData = "grant_type=anonymous&scope=openid+profile&client_id=";
    const authRequest = await fetch(
      `/content/danaher/services/auth/token?id=${siteID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        body: formData,
      }
    );
    if (authRequest.ok) {
      const hostName = window.location.hostname;
<<<<<<< HEAD
      const env = hostName.includes('local')
        ? 'local'
        : hostName.includes('dev')
        ? 'dev'
        : hostName.includes('stage')
        ? 'stage'
        : 'prod';
      const data = await authRequest.json();
      sessionStorage.setItem(`${siteID}_${env}_apiToken`, JSON.stringify(data));
      sessionStorage.setItem(
        `${siteID}_${env}_refresh-token`,
        data.refresh_token
      );
=======
      const env = hostName.includes("local")
        ? "local"
        : hostName.includes("dev")
        ? "dev"
        : hostName.includes("stage")
        ? "stage"
        : "prod";
      const data = await authRequest.json();
      // sessionStorage.setItem(`${siteID}_${env}_apiToken`, JSON.stringify(data));
      // sessionStorage.setItem(`${siteID}_${env}_refresh-token`, data.refresh_token);
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    }
  }
}
// Get authorization token for anonymous user - end

// Loading fathom script - start
const attrs = JSON.parse('{"data-site": "KGTBOGMR"}');
loadScript("https://cdn.usefathom.com/script.js", attrs);
// Loading fathom script - end

// coveo analytics - start
(function (c, o, v, e, O, u, a) {
<<<<<<< HEAD
  a = 'coveoua';
=======
  a = "coveoua";
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD
  'script',
  'https://static.cloud.coveo.com/coveo.analytics.js/2/coveoua.js'
=======
  "script",
  "https://static.cloud.coveo.com/coveo.analytics.js/2/coveoua.js"
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
);

const accessToken =
  window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchKey
<<<<<<< HEAD
    : 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b';
const organizationId =
  window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchOrg
    : 'danahernonproduction1892f3fhz';
=======
    : "xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b";
const organizationId =
  window.DanaherConfig !== undefined
    ? window.DanaherConfig.searchOrg
    : "danahernonproduction1892f3fhz";
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
// coveo analytics - end

const authHeader = getAuthorization();
if (
  !authHeader ||
<<<<<<< HEAD
  !(authHeader.has('authentication-token') || authHeader.has('Authorization'))
=======
  !(authHeader.has("authentication-token") || authHeader.has("Authorization"))
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
) {
  getAuthToken();
}

if (!window.location.hostname.includes("localhost")) {
  loadGTM();
  //loadAT();

  if (isOTEnabled()) {
    if (
<<<<<<< HEAD
      getMetadata('template') === 'ProductDetail' &&
      document.querySelector('h1')
=======
      getMetadata("template") === "ProductDetail" &&
      document.querySelector("h1")
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    ) {
      sendCoveoEventProduct();
    } else if (getMetadata("template") !== "ProductDetail") {
      sendCoveoEventPage();
    }
  }
}
/* eslint-enable */

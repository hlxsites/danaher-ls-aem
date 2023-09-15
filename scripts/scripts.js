import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('block');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

// Danaher Config - Start
if (window.location.host == 'lifesciences.danaher.com') {
  window.DanaherConfig = {
    "siteID": "ls\u002Dus\u002Den",
    "gtmID": "GTM\u002DTHXPLCS",
    "munchkinID": "306\u002DEHG\u002D641",
    "marketoDomain": "\/\/306\u002DEHG\u002D641.mktoweb.com",
    "quoteCartPath": "\/us\/en\/quote\u002Dcart.html",
    "cartPath": "\/us\/en\/cart.html",
    "addressesPath": "\/us\/en\/addresses.html",
    "shippingPath": "\/us\/en\/shipping.html",
    "paymentPath": "\/us\/en\/payment.html",
    "receiptPath": "\/us\/en\/receipt.html",
    "quoteSubmitPath": "\/us\/en\/submit\u002Dquote.html",
    "intershopDomain": "https:\/\/shop.lifesciences.danaher.com",
    "intershopPath": "\/INTERSHOP\/rest\/WFS\/DANAHERLS\u002DLSIG\u002DSite\/\u002D",
    "searchOrg": "danaherproductionrfl96bkr",
    "searchKey": "xxf2f10385\u002D5a54\u002D4a18\u002Dbb48\u002Dfd8025d6b5d2",
    "workflowProductKey": "xx3d1b8da5\u002Dd1e9\u002D4989\u002Dbbed\u002D264a248a9e22",
    "workflowResourceKey": "xxf6a8b387\u002D10f2\u002D4660\u002Daf5d\u002D6d304d0a789d",
    "productKey": "xxfb161aa6\u002D0fa0\u002D419f\u002Daf37\u002D9c6d7784bf76",
    "familyProductKey": "xx1ecd2a4f\u002D8391\u002D4c70\u002Db3c0\u002D2d589bda56b7",
    "familyResourceKey": "xx9dd85afc\u002D64b6\u002D4295\u002Dbc5d\u002Deb8285f96d52",
    "categoryProductKey": "xx2a299d60\u002D2cf1\u002D48ab\u002Db9d5\u002D94daeb25f1d6",
    "categoryDetailKey": "xx61910369\u002Dc1ab\u002D4df9\u002D8d8a\u002D3092b1323fcc",
    "megaMenuPath": "\/content\/dam\/danaher\/system\/navigation\/megamenu_items_us.json",
    "coveoProductPageTitle": "Product Page"
};
}
else {
  window.DanaherConfig = {
    "siteID": "ls\u002Dus\u002Den",
    "gtmID": "GTM\u002DKCBGM2N",
    "munchkinID": "439\u002DKNJ\u002D322",
    "marketoDomain": "\/\/439\u002DKNJ\u002D322.mktoweb.com",
    "quoteCartPath": "\/us\/en\/quote\u002Dcart.html",
    "cartPath": "\/us\/en\/cart.html",
    "addressesPath": "\/us\/en\/addresses.html",
    "shippingPath": "\/us\/en\/shipping.html",
    "paymentPath": "\/us\/en\/payment.html",
    "receiptPath": "\/us\/en\/receipt.html",
    "quoteSubmitPath": "\/us\/en\/submit\u002Dquote.html",
    "intershopDomain": "https:\/\/stage.shop.lifesciences.danaher.com",
    "intershopPath": "\/INTERSHOP\/rest\/WFS\/DANAHERLS\u002DLSIG\u002DSite\/\u002D",
    "searchOrg": "danahernonproduction1892f3fhz",
    "searchKey": "xx2a2e7271\u002D78c3\u002D4e3b\u002Dbac3\u002D2fcbab75323b",
    "workflowProductKey": "xx26ffc727\u002Dcc72\u002D4bbd\u002D98e3\u002D34052f296382",
    "workflowResourceKey": "xx14676f1d\u002Dcf4a\u002D4a38\u002D94f0\u002Deda56e9920f1",
    "productKey": "xx32da148e\u002Ddfd0\u002D4725\u002Da443\u002Dc05a7793afea",
    "familyProductKey": "xx4e3989d6\u002D93aa\u002D4140\u002Da227\u002D19da35fcd1cc",
    "familyResourceKey": "xx8274a91e\u002Db29c\u002D4267\u002D8b3a\u002D5022a2698605",
    "categoryProductKey": "xxdf9d160d\u002Df6e5\u002D4c8c\u002D969b\u002D8570d7b81418",
    "categoryDetailKey": "xxf2ea9bfd\u002Dbccb\u002D4195\u002D90fd\u002D7757504fdc33",
    "megaMenuPath": "\/content\/dam\/danaher\/system\/navigation\/megamenu_items_us.json",
    "coveoProductPageTitle": "Product Page"
  };
}
// Danaher Config - End

loadPage();

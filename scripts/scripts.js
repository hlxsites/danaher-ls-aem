import {
  sampleRUM,
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
  toClassName,
  getMetadata,
  createOptimizedPicture,
  loadBlock,
  decorateBlock,
} from './lib-franklin.js';

import {
  div,
  domEl,
  img,
} from './dom-builder.js';

const LCP_BLOCKS = ['breadcrumb', 'product-hero', 'carousel']; // add your LCP blocks to the list
const TEMPLATE_LIST = {
  blog: 'blog',
  news: 'blog',
  productdetail: 'productDetail',
  processstep: 'processstep',
  topic: 'topic',
  library: 'library',
  info: 'library',
};

/**
 * Get the Image URL from Scene7 and Optimize the picture
 * @param {string} imageUrl
 * @param {string} imageAlt
 * @param {boolean} eager
 * @returns Optimized image
 */
export function imageHelper(imageUrl, imageAlt, eager = false) {
  if (imageUrl.indexOf('.scene7.com') > -1) {
    return img({
      src: `${imageUrl}`,
      alt: imageAlt,
      loading: eager ? 'eager' : 'lazy',
      class: 'mb-2 h-48 w-full object-cover',
    });
  }
  const cardImage = createOptimizedPicture(imageUrl, imageAlt, eager, [{ width: '500' }]);
  cardImage.querySelector('img').className = 'mb-2 h-48 w-full object-cover';
  return cardImage;
}

export function createOptimizedS7Picture(src, alt = '', eager = false) {
  if (src.startsWith('/is/image') || src.indexOf('.scene7.com') > -1) {
    const picture = document.createElement('picture');
    picture.appendChild(img({ src: `${src}?$danaher-mobile$`, alt, loading: eager ? 'eager' : 'lazy' }));
    return picture;
  }
  return img({
    src,
    alt,
    loading: eager ? 'eager' : 'lazy',
  });
}

/**
 * Format date expressed in UTC seconds
 * @param {number} date
 * @returns new string with the formatted date
 */
export function formatDateUTCSeconds(date, options = {}) {
  const dateObj = new Date(0);
  dateObj.setUTCSeconds(date);

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    ...options,
  });
}

/**
 * It will used generate random number to use in ID
 * @returns 4 digit random numbers
 */
export function generateUUID() {
  return Math.floor(1000 + Math.random() * 9000);
}

/**
 * Returns the valid public url with or without .html extension
 * @param {string} url
 * @returns new string with the formatted url
 */
export function makePublicUrl(url) {
  const isProd = window.location.hostname.includes('lifesciences.danaher.com');
  try {
    const newURL = new URL(url, window.location.origin);
    if (isProd) {
      if (newURL.pathname.endsWith('.html')) {
        return newURL.pathname;
      }
      newURL.pathname += '.html';
      return newURL.pathname;
    }
    if (newURL.pathname.endsWith('.html')) {
      newURL.pathname = newURL.pathname.slice(0, -5);
      return newURL.pathname;
    }
    return newURL.pathname;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Invalid URL:', error);
    return url;
  }
}

/**
 * Set the JSON-LD script in the head
 * @param {*} data
 * @param {string} name
 */
export function setJsonLd(data, name) {
  const existingScript = document.head.querySelector(`script[data-name="${name}"]`);
  if (existingScript) {
    existingScript.innerHTML = JSON.stringify(data);
    return;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';

  script.innerHTML = JSON.stringify(data);
  script.dataset.name = name;
  document.head.appendChild(script);
}

/**
 * Fetches an HTML fragment from the given URL
 * @param {string} url
 * @returns the HTML text of the fragment
 */
export async function getFragmentFromFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error('error loading fragment details', response);
    return null;
  }
  const text = await response.text();
  if (!text) {
    // eslint-disable-next-line no-console
    console.error('fragment details empty', url);
    return null;
  }
  return text;
}

/**
 * Get a cookie
 * @param cname the name of the cookie
 */
export function getCookie(cname) {
  let value = decodeURIComponent(
    // eslint-disable-next-line prefer-template
    document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(cname).replace(/[\\-\\.\\+\\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1'),
  ) || null;
  if (value && ((value.substring(0, 1) === '{' && value.substring(value.length - 1, value.length) === '}') || (value.substring(0, 1) === '[' && value.substring(value.length - 1, value.length) === ']'))) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return value;
}

/**
 * Find whether OT enabled
 * @returns boolean
 */
export function isOTEnabled() {
  const otCookie = getCookie('OptanonConsent');
  if (typeof otCookie === 'string') {
    return otCookie.includes('C0002:1');
  }
  return true;
}

/**
* Set the content of a cookie
* @param {string} cname The cookie name (or property)
* @param {string} cvalue The cookie value
* @param {number} expTime The cookie expiry time (default 30 days)
* @param {string} path The cookie path (optional)
*
*/
export function setCookie(cname, cvalue, expTime = 30 * 1000 * 60 * 60 * 24, path = '/') {
  const today = new Date();
  today.setTime(today.getTime() + (expTime));
  const expires = 'expires='.concat(today.toGMTString());
  const cookieString = cname.concat('=')
    .concat(cvalue)
    .concat(';')
    .concat(expires)
    .concat(';path=')
    .concat(path);
  document.cookie = cookieString; // cname + '=' + cvalue + ';' + expires + ';path=' + path;
}

/**
 * Builds embeds for video links
 * @param {Element} main The container element
 */
async function buildVideo(main) {
  const videoLinks = main.querySelectorAll('a[href*="youtube.com"],a[href*="vimeo.com"],a[href*="vidyard.com"]');
  if (videoLinks.length > 0) {
    const { default: decorateEmbed } = await import('../blocks/embed/embed.js');
    videoLinks.forEach((link) => {
      if (link.closest('.embed, .hero') == null) {
        decorateEmbed(link.parentNode);
      }
    });
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
    buildVideo(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

export function decorateModals(main) {
  const ctaModalButton = main.querySelector('.show-modal-btn');
  const content = () => (ctaModalButton.getAttribute('data-dialog-message') ? ctaModalButton.getAttribute('dialog-message') : '');
  // Listens to the custom modal button
  ctaModalButton?.addEventListener('click', async (e) => {
    e.preventDefault();
    // eslint-disable-next-line import/no-cycle
    const { default: getModal } = await import('./modal.js');
    const customModal = await getModal('custom-modal', content, (modal) => {
      modal.querySelector('p[name="close"]')?.addEventListener('click', () => modal.close());
    });
    customModal.showModal();
  });
}

/**
 * Decorates the section with 2 columns style.
 * @param {Element} main The main element
 */
function decorateTwoColumnSection(main) {
  main.querySelectorAll('.section.container-two-col').forEach((section) => {
    const defaultContentWrappers = section.querySelectorAll(':scope > .default-content-wrapper');
    defaultContentWrappers.forEach((contentWrapper) => {
      [...contentWrapper.children].forEach((child) => {
        section.appendChild(child);
      });
      let nextElement = contentWrapper.nextElementSibling;
      while (nextElement && !nextElement.classList.contains('default-content-wrapper')) {
        section.appendChild(nextElement);
        nextElement = nextElement.nextElementSibling;
      }
      section.removeChild(contentWrapper);
    });

    const newSection = div();
    let currentDiv = null;
    [...section.children].forEach((child) => {
      const childClone = child.cloneNode(true);
      if (childClone.tagName === 'H2' && childClone.querySelector(':scope > strong')) {
        if (currentDiv?.classList.contains('col-right')) {
          newSection.appendChild(currentDiv);
        }
        childClone.className = 'text-gray-900 text-base leading-6 font-bold pt-6 pb-4 my-0';
        newSection.appendChild(
          div(
            { class: 'col-left lg:w-1/3 xl:w-1/4 pt-4' },
            childClone,
            domEl('hr', {
              style: 'height: 10px; width: 54px; border-width: 0px; color: rgb(216, 244, 250); background-color: rgb(216, 244, 250);',
            }),
          ),
        );
        currentDiv = div({ class: 'col-right w-full mt-4 lg:mt-0 lg:w-2/3 xl:w-3/4 pt-6 pb-10' });
      } else if (currentDiv?.classList.contains('col-right')) {
        currentDiv.appendChild(childClone);
      }
    });
    if (currentDiv) {
      newSection.appendChild(currentDiv);
    }
    newSection.classList.add('flex', 'flex-wrap');
    section.innerHTML = newSection.outerHTML;
    section.classList.add('mx-auto', 'w-full', 'flex', 'flex-wrap', 'mb-5');
  });
}

/**
 * Sets external target and rel for links in a main element.
 * @param {Element} main The main element
 */
function updateExternalLinks(main) {
  const REFERERS = [
    window.location.origin,
  ];
  main.querySelectorAll('a[href]').forEach((a) => {
    try {
      const { origin, pathname, hash } = new URL(a.href, window.location.href);
      const targetHash = hash && hash.startsWith('#_');
      const isPDF = pathname.split('.').pop() === 'pdf';
      if ((origin && origin !== window.location.origin && !targetHash) || isPDF) {
        a.setAttribute('target', '_blank');
        if (!REFERERS.includes(origin)) a.setAttribute('rel', 'noopener');
      } else if (targetHash) {
        a.setAttribute('target', hash.replace('#', ''));
        a.href = a.href.replace(hash, '');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Invalid link in ${main}: ${a.href}`);
    }
  });
}

/**
 * Lazy loads all the blocks in the tabs, except for the visible/active one
 * @param {[Element]} sections All sections which belong to the Page Nav
 * @param {string} nameOfFirstSection Exact name of the first section, in case there is no hash
 */
function lazyLoadHiddenPageNavTabs(sections, nameOfFirstSection) {
  const activeHash = window.location.hash;
  const active = activeHash
    ? activeHash.substring(1, activeHash.length).toLowerCase()
    : nameOfFirstSection;

  sections.forEach((section) => {
    const hasBreadCrumb = section.className.includes('breadcrumb-container');
    if (!hasBreadCrumb && section.getAttribute('aria-labelledby') !== active) {
      /*
       It marks all the blocks inside the hidden sections as loaded,
       so Franklin lib will skip them.
       This means that the decorate functions of these blocks will not be executed
       and the CSS will not be downloaded
       */
      section.querySelectorAll('.block').forEach((block) => {
        // make the Franklin rendering skip this block
        block.setAttribute('data-block-status', 'loaded');
        // mark them as lazy load, so we can identify them later
        block.setAttribute('data-block-lazy-load', true);
        // hide them, to avoid CLS during lazy load
        block.parentElement.style.display = 'none';
      });

      const loadLazyBlocks = (lazySection) => {
        lazySection.querySelectorAll('.block[data-block-lazy-load]').forEach(async (block) => {
          block.removeAttribute('data-block-lazy-load');
          // Mark them back in the initialised status
          block.setAttribute('data-block-status', 'initialized');
          // Manually load each block: Download CSS, JS, execute the decorate
          await loadBlock(block);
          // Show the block only when everything is ready to avoid CLS
          block.parentElement.style.display = '';
        });

        // force the loaded status of the section
        section.setAttribute('data-section-status', 'loaded');
      };

      // In case the user clicks on the section, quickly render it on the spot,
      // if it happens before the timeout below
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          loadLazyBlocks(section);
        }
      });
      observer.observe(section);

      // Render the section with a delay
      setTimeout(() => {
        observer.disconnect();
        loadLazyBlocks(section);
      }, 5000);
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * Run named sections for in page navigation.
 * Decorate named sections for in page navigation.
 * @param {Element} main The container element
 */
function decoratePageNav(main) {
  const pageTabsBlock = main.querySelector('.page-tabs');
  if (!pageTabsBlock) return;

  const pageTabSection = pageTabsBlock.closest('div.section');
  let sections = [...main.querySelectorAll('div.section')];
  sections = sections.slice(sections.indexOf(pageTabSection) + 1);

  const namedSections = sections.filter((section) => section.hasAttribute('data-tabname'));
  let index = 0;
  sections.forEach((section) => {
    if (index < namedSections.length) {
      section.classList.add('page-tab');
      const tabName = namedSections[index].getAttribute('data-tabname');
      const tabId = tabName?.toLowerCase().replace(/\s+/g, '-');
      section.setAttribute('aria-labelledby', tabId);
      if (section.hasAttribute('data-tabname')) {
        index += 1;
      }
    }
  });

  lazyLoadHiddenPageNavTabs(sections, namedSections[0].getAttribute('aria-labelledby'));
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
  decoratePageNav(main);
  decorateTwoColumnSection(main);
  updateExternalLinks(main);
}

/**
 * Run template specific decoration code.
 * @param {Element} main The container element
 */
async function decorateTemplates(main) {
  try {
    const template = toClassName(getMetadata('template'));
    const templates = Object.keys(TEMPLATE_LIST);
    if (templates.includes(template)) {
      const templateName = TEMPLATE_LIST[template];
      const mod = await import(`../templates/${templateName}/${templateName}.js`);
      if (mod.default) {
        await mod.default(main);
      }
      document.body.classList.add(templateName);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorate blocks in an embed fragment.
 */
function decorateEmbeddedBlocks(container) {
  container
    .querySelectorAll('div.section > div')
    .forEach(decorateBlock);
}

export async function processEmbedFragment(element) {
  const block = div({ class: 'embed-fragment' });
  [...element.classList].forEach((className) => { block.classList.add(className); });
  const link = element.textContent;
  if (link) {
    const fragment = await getFragmentFromFile(`${link}.plain.html`);
    if (fragment) {
      block.innerHTML = fragment;
      const sections = block.querySelectorAll('.embed-fragment > div');
      [...sections].forEach((section) => {
        section.classList.add('section');
      });
      decorateEmbeddedBlocks(block);
      decorateSections(block);
      loadBlocks(block);
    } else {
      const elementInner = element.innerHTML;
      block.append(div({ class: 'section' }));
      block.querySelector('.section').innerHTML = elementInner;
    }
  }
  decorateButtons(block);
  decorateIcons(block);

  return block;
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  await window.hlx.plugins.run('loadEager');

  const main = doc.querySelector('main');
  if (main) {
    await decorateTemplates(main);
    decorateMain(main);
    document.body.classList.add('appear');
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

// UTM Paramaters check - start
function getParameterByName(parameter, url = window.location.href) {
  /* eslint-disable no-eval */
  const modifiedParameter = parameter.replace(/[[\]]/g, '$&');
  const regex = new RegExp(`[?&]${modifiedParameter}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadUTMprams() {
  /* eslint-disable no-eval */
  const utmParameters = [
    'utm_campaign',
    'utm_source',
    'utm_medium',
    'utm_content',
    'utm_term',
    'utm_previouspage',
  ];

  utmParameters.forEach((param) => {
    const value = getParameterByName(param);
    if (value !== null) {
      window.localStorage.setItem(`danaher_${param}`, value);
    }
  });
}
// UTM Paramaters check - end

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

  window.hlx.plugins.run('loadLazy');

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));

  loadUTMprams();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => {
    window.hlx.plugins.load('delayed');
    window.hlx.plugins.run('loadDelayed');
    // eslint-disable-next-line import/no-cycle
    return import('./delayed.js');
  }, 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await window.hlx.plugins.load('eager');
  await loadEager(document);
  await window.hlx.plugins.load('lazy');
  await loadLazy(document);
  loadDelayed();
}

// Danaher Config - Start
const urlParams = new URLSearchParams(window.location.search);
const useProd = urlParams.get('useProd');
if (window.location.host === 'lifesciences.danaher.com' || useProd === 'true') {
  window.DanaherConfig = {
    siteID: 'ls-us-en',
    gtmID: 'GTM-THXPLCS',
    munchkinID: '306-EHG-641',
    marketoDomain: '//306-EHG-641.mktoweb.com',
    quoteCartPath: '/us/en/quote-cart.html',
    cartPath: '/us/en/cart.html',
    addressesPath: '/us/en/addresses.html',
    shippingPath: '/us/en/shipping.html',
    paymentPath: '/us/en/payment.html',
    receiptPath: '/us/en/receipt.html',
    quoteSubmitPath: '/us/en/submit-quote.html',
    intershopDomain: 'https://shop.lifesciences.danaher.com',
    intershopPath: '/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-',
    searchOrg: 'danaherproductionrfl96bkr',
    searchKey: 'xxf2f10385-5a54-4a18-bb48-fd8025d6b5d2',
    workflowProductKey: 'xx3d1b8da5-d1e9-4989-bbed-264a248a9e22',
    workflowResourceKey: 'xxf6a8b387-10f2-4660-af5d-6d304d0a789d',
    productKey: 'xxfb161aa6-0fa0-419f-af37-9c6d7784bf76',
    familyProductKey: 'xx1ecd2a4f-8391-4c70-b3c0-2d589bda56b7',
    familyResourceKey: 'xx9dd85afc-64b6-4295-bc5d-eb8285f96d52',
    categoryProductKey: 'xx2a299d60-2cf1-48ab-b9d5-94daeb25f1d6',
    categoryDetailKey: 'xx61910369-c1ab-4df9-8d8a-3092b1323fcc',
    megaMenuPath: '/content/dam/danaher/system/navigation/megamenu_items_us.json',
    coveoProductPageTitle: 'Product Page',
    pdfEmbedKey: '4a472c386025439d8a4ce2493557f6e7',
    host: 'lifesciences.danaher.com',
  };
} else {
  window.DanaherConfig = {
    siteID: 'ls-us-en',
    gtmID: 'GTM-KCBGM2N',
    munchkinID: '439-KNJ-322',
    marketoDomain: '//439-KNJ-322.mktoweb.com',
    quoteCartPath: '/us/en/quote-cart.html',
    cartPath: '/us/en/cart.html',
    addressesPath: '/us/en/addresses.html',
    shippingPath: '/us/en/shipping.html',
    paymentPath: '/us/en/payment.html',
    receiptPath: '/us/en/receipt.html',
    quoteSubmitPath: '/us/en/submit-quote.html',
    intershopDomain: 'https://stage.shop.lifesciences.danaher.com',
    intershopPath: '/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-',
    searchOrg: 'danahernonproduction1892f3fhz',
    searchKey: 'xx2a2e7271-78c3-4e3b-bac3-2fcbab75323b',
    workflowProductKey: 'xx26ffc727-cc72-4bbd-98e3-34052f296382',
    workflowResourceKey: 'xx14676f1d-cf4a-4a38-94f0-eda56e9920f1',
    productKey: 'xx32da148e-dfd0-4725-a443-c05a7793afea',
    familyProductKey: 'xx4e3989d6-93aa-4140-a227-19da35fcd1cc',
    familyResourceKey: 'xx8274a91e-b29c-4267-8b3a-5022a2698605',
    categoryProductKey: 'xxdf9d160d-f6e5-4c8c-969b-8570d7b81418',
    categoryDetailKey: 'xxf2ea9bfd-bccb-4195-90fd-7757504fdc33',
    megaMenuPath: '/content/dam/danaher/system/navigation/megamenu_items_us.json',
    coveoProductPageTitle: 'Product Page',
    pdfEmbedKey: '4a472c386025439d8a4ce2493557f6e7',
    host: 'stage.lifesciences.danaher.com',
  };
}
// Danaher Config - End

// Datalayer Init - Start
window.dataLayer = [];
window.dataLayer.push({
  user: {
    customerID: '',
    accountType: 'guest',
    marketCode: '',
    company: '',
    role: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    lastVisit: '',
  },
});
window.dataLayer.push({
  page: {
    title: document.querySelector('title').textContent.replace(/[\n\t]/gm, ''),
    language: 'en',
    locale: 'US',
    level: 'top',
    type: 'webpage',
    keywords: '',
    creationDate: getMetadata('creationdate'),
    updateDate: getMetadata('updatedate'),
  },
});
// Datalayer Init - End

loadPage();

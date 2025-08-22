import { buildBlock } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';
import { getPdpDetails } from '../../scripts/coveo/controller/controllers.js';
import { searchEngine } from '../../scripts/coveo/engine.js';

function designPdp() {
  const main = document.querySelector('main');
  if (!main) return;

  const heroSection = main.querySelector('.pdp-hero');
  const pageTabs = main.querySelector('.pdp-page-tabs');
  const carousel = main.querySelector('.pdp-carousel');

  // wrappers
  const flexWrapper = div({
    class: 'tabs-super-parent flex flex-col md:flex-row md:justify-center lg:max-w-screen-xl mx-auto pt-12',
  });

  const tabsWrapper = div({
    class: 'tabs-left-parent sticky top-16 md:top-32 h-fit z-10',
  });

  const restWrapper = div({
    class: 'tabs-right-parent border-l border-gray-200 flex-1',
  });

  if (pageTabs) {
    tabsWrapper.appendChild(pageTabs);
  }

  // collect intended layout groups in separate arrays before reparenting
  const rightSections = [];
  const afterTabsSections = [];

  let reachedTabs = false;
  let reachedCarousel = false;

  const allSections = Array.from(main.children);
  allSections.forEach((section) => {
    if (section === pageTabs) {
      reachedTabs = true;
      return;
    }
    if (section === carousel) {
      reachedCarousel = true;
    }

    if (reachedTabs && !reachedCarousel) {
      rightSections.push(section);
    } else if (reachedCarousel) {
      afterTabsSections.push(section);
    }
  });

  // append right sections into right wrapper
  rightSections.forEach((section) => restWrapper.appendChild(section));

  // build flexWrapper
  flexWrapper.appendChild(tabsWrapper);
  flexWrapper.appendChild(restWrapper);

  // place flexWrapper after hero
  if (heroSection) {
    heroSection.after(flexWrapper);
  } else {
    main.prepend(flexWrapper); // fallback if no hero
  }

  // append afterTabsSections in preserved order
  let insertPoint = flexWrapper;
  afterTabsSections.forEach((section) => {
    insertPoint.after(section);
    insertPoint = section; // move pointer forward
  });
}


function loadPdpBlocks() {
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  console.log(response.raw.sku);

  // PDP Hero
  // const pdpHeroBlock = div(buildBlock('pdp-hero', { elems: [] }));
  // document.querySelector('main').append(pdpHeroBlock);

  // PDP Page tabs
  // const pdpPageTabsBlock = div(buildBlock('pdp-page-tabs', { elems: [] }));
  // document.querySelector('main').append(pdpPageTabsBlock);
  const superParent = document.querySelector('.pdp-page-tabs');
  if (superParent) {
    [...superParent.children]?.forEach((divEle) => {
      divEle.classList.add('hidden');
      
    });
  }
  const tabs = document.querySelector('.pdp-page-tabs')?.children;
const tabsList = new Set();

// Helper: add a block once
function appendBlock(key, blockName) {
  if (!tabsList.has(key)) {
    const block = div(buildBlock(blockName, { elems: [] }));
    document.querySelector('main').append(block);
    tabsList.add(key);
  }
}

// Pre-collect authored tabs
const authoredTabs = new Set();
if (tabs) {
  Array.from(tabs).forEach((tabItem) => {
    const tabType = tabItem.children[1]?.textContent?.toLowerCase();
    if (!tabType) return;

    authoredTabs.add(tabType);

    // Add authored tab metadata
    tabItem.classList.add('tab-authored', `authored-${tabType}`);
    tabItem.id = `authored-${tabType}`;
    tabItem?.children[1]?.classList.add('authored-tab-type');
    tabItem?.children[3]?.classList.add('authored-tab-title');
  });
}

// CONDITIONS for loading blocks
if (authoredTabs.has('overview') || response?.raw?.richlongdescription) {
  appendBlock('overview', 'pdp-description');
}

if (
  authoredTabs.has('products') ||
  (response?.raw?.objecttype === 'Family' && response?.raw?.numproducts > 0)
) {
  appendBlock('products', 'pdp-products');
}

if (authoredTabs.has('resources') || response?.raw?.numresources) {
  appendBlock('resources', 'pdp-resources');
}

if (authoredTabs.has('specifications') || response?.raw?.numattributes > 0) {
  appendBlock('specifications', 'pdp-specifications');
}

if (
  authoredTabs.has('parts') ||
  (response?.raw?.objecttype === 'Bundle' && response?.raw?.numproducts > 0)
) {
  appendBlock('parts', 'pdp-bundle-list');
}

if (authoredTabs.has('citations')) {
  appendBlock('citations', 'pdp-citations');
}

if (authoredTabs.has('faqs')) {
  appendBlock('faqs', 'pdp-faqs');
}

if (authoredTabs.has('relatedproducts')) {
  appendBlock('relatedproducts', 'pdp-related-products');
}

// Always load carousel
appendBlock('carousel', 'pdp-carousel');

}

export default async function buildAutoBlocks() {
  const productSlug = new URL(window.location.href).pathname.split('/').pop();
  const response = JSON.parse(localStorage.getItem('eds-product-details'));

  if (response && response?.raw.sku === productSlug) {
    loadPdpBlocks();
   // designPdp();
    return;
  }
  localStorage.removeItem('eds-product-details');

  await getPdpDetails(productSlug.replace(".html", ""));
  await new Promise((resolve) => {
    const unsubscribe = searchEngine.subscribe(() => {
      const { results } = searchEngine.state.search;
      if (results.length > 0) {
        localStorage.setItem('eds-product-details', JSON.stringify(results[0]));
        unsubscribe();
        resolve();
      }
    });
  });
  // getFrequentlyViewedTogether();
  loadPdpBlocks();
  //designPdp();
}

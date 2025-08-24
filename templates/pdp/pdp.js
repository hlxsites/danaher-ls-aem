import { buildBlock } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';
import { getPdpDetails } from '../../scripts/coveo/controller/controllers.js';
import { searchEngine } from '../../scripts/coveo/engine.js';
import tabsOrder from '../../scripts/tabs-order.js';

function loadPdpBlocks() {
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  // Determine opco, e.g. from response
  const opco = response?.raw?.opco?.toLowerCase() || 'sciex';
  const tabOrderArr = tabsOrder()[opco] || [];
  const tabsList = new Set();

  // Pre-collect authored tabs
  const authoredTabs = new Set();
  const tabs = document.querySelector('.pdp-page-tabs')?.children;
  if (tabs) {
    Array.from(tabs).forEach((tabItem) => {
      const tabType = tabItem.children[1]?.textContent?.toLowerCase();
      if (tabType) authoredTabs.add(tabType);

      // Add authored tab metadata
      tabItem.classList.add('tab-authored', `authored-${tabType}`, 'hidden');
      tabItem.id = `authored-${tabType}`;
      tabItem?.children[1]?.classList.add('authored-tab-type');
      tabItem?.children[2]?.classList.add('authored-tab-title');
    });
  }

  // Helper to append block once
  function appendBlock(key, blockName) {
    if (!tabsList.has(key)) {
      const block = div(buildBlock(blockName, { elems: [] }));
      document.querySelector('main').append(block);
      tabsList.add(key);
    }
  }

  // Always add PDP Hero and Tabs Block first (before the ordered tabs)
  // Only if not already present
  if (!document.querySelector('.pdp-hero')) {
    const pdpHeroBlock = div(buildBlock('pdp-hero', { elems: [] }));
    document.querySelector('main').append(pdpHeroBlock);
  }
  if (!document.querySelector('.pdp-page-tabs')) {
    const pdpPageTabsBlock = div(buildBlock('pdp-page-tabs', { elems: [] }));
    document.querySelector('main').append(pdpPageTabsBlock);
  }

  // Main: go through the tab order for the opco and append blocks IN ORDER
  tabOrderArr
    .sort((a, b) => a.order - b.order)
    .forEach(({ tabName }) => {
      // Map tabName to block names
      const blockMap = {
        'overview': 'pdp-description',
        'products': 'pdp-products',
        'resources': 'pdp-resources',
        'specifications': 'pdp-specifications',
        'parts': 'pdp-bundle-list',
        'citations': 'pdp-citations',
        'faqs': 'pdp-faqs',
        'relatedproducts': 'pdp-related-products',
        'carousel': 'pdp-carousel',
        // Add any other mappings needed
        // e.g. 'images': 'pdp-images',
        //      'analysis': 'pdp-analysis',
      };
      const blockName = blockMap[tabName];
      if (!blockName) return; // skip unmapped tab

      // Decision: add block if authored OR available via data
      let shouldAdd = false;
      switch (tabName) {
        case 'overview':
          shouldAdd = authoredTabs.has('overview') || response?.raw?.richlongdescription;
          break;
        case 'products':
          shouldAdd = authoredTabs.has('products') || (response?.raw?.objecttype === 'Family' && response?.raw?.numproducts > 0);
          break;
        case 'resources':
          shouldAdd = authoredTabs.has('resources') || response?.raw?.numresources;
          break;
        case 'specifications':
          shouldAdd = authoredTabs.has('specifications') || response?.raw?.numattributes > 0;
          break;
        case 'parts':
          shouldAdd = authoredTabs.has('parts') || (response?.raw?.objecttype === 'Bundle' && response?.raw?.numproducts > 0);
          break;
        case 'citations':
          shouldAdd = authoredTabs.has('citations');
          break;
        case 'faqs':
          shouldAdd = authoredTabs.has('faqs');
          break;
        case 'relatedproducts':
          shouldAdd = authoredTabs.has('relatedproducts');
          break;
        // Add more cases as needed, following your current logic
        default:
          break;
      }

      if (shouldAdd) {
        appendBlock(tabName, blockName);
      }
    });

  // Always load carousel (after the ordered tabs, if not already added in the tabOrderArr)
  if (!tabsList.has('carousel')) {
    appendBlock('carousel', 'pdp-carousel');
  }
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

  await getPdpDetails(productSlug.replace('.html', ''));
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
  // designPdp();
}

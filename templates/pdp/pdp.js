import { buildBlock } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';
import tabsOrder from '../../scripts/tabs-order.js';
import { getProductResponse } from '../../scripts/commerce.js';

function setMetaTags(response) {
  document.title = `${response?.title} | Danaher Life Sciences`;

  // Handle meta tags by selector, else create and append
  const tags = [
    { selector: 'meta[property="og:title"]', create: { property: 'og:title' }, value: response.title },
    { selector: 'meta[property="og:description"]', create: { property: 'og:description' }, value: response.raw.description },
    { selector: 'meta[name="description"]', create: { name: 'description' }, value: response.raw.description },
    { selector: 'meta[name="twitter:title"]', create: { name: 'twitter:title' }, value: response.title },
    { selector: 'meta[name="twitter:description"]', create: { name: 'twitter:description' }, value: response.raw.description },
    { selector: 'meta[property="og:url"]', create: { property: 'og:url' }, value: window.location.href },
  ];

  tags.forEach(({ selector, create, value }) => {
    let tag = document.head.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      Object.entries(create).forEach(([attr, val]) => {
        tag.setAttribute(attr, val);
      });
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', value);
  });

  if (
    response?.raw?.images
    && Array.isArray(response.raw.images)
    && response.raw.images.length > 0
  ) {
    const imageUrl = response.raw.images.find(
      (img) => typeof img === 'string' && !/\.pdf$/i.test(img),
    );
    if (imageUrl) {
      // Twitter image meta tag
      let twitterTag = document.head.querySelector('meta[name="twitter:image"]');
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', imageUrl);

      // Open Graph image meta tag
      let ogImageTag = document.head.querySelector('meta[property="og:image"]');
      if (!ogImageTag) {
        ogImageTag = document.createElement('meta');
        ogImageTag.setAttribute('property', 'og:image');
        document.head.appendChild(ogImageTag);
      }
      ogImageTag.setAttribute('content', imageUrl);

      // Open Graph secure image URL meta tag
      let ogSecureTag = document.head.querySelector('meta[property="og:image:secure_url"]');
      if (!ogSecureTag) {
        ogSecureTag = document.createElement('meta');
        ogSecureTag.setAttribute('property', 'og:image:secure_url');
        document.head.appendChild(ogSecureTag);
      }
      ogSecureTag.setAttribute('content', imageUrl);
    }
  }
  // Canonical link
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', window.location.href);
}

async function loadPdpBlocks() {
  const response = JSON.parse(localStorage.getItem('eds-product-details'));

  // setMetaTags(response);
  // Determine opco, e.g. from response
  const opco = response[0]?.raw?.opco?.toLowerCase() || 'sciex';
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
        overview: 'pdp-description',
        products: 'pdp-products',
        resources: 'pdp-resources',
        specifications: 'pdp-specifications',
        parts: 'pdp-bundle-list',
        citations: 'pdp-citations',
        faqs: 'pdp-faqs',
        relatedproducts: 'pdp-related-products',
        carousel: 'pdp-carousel',
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
        // Add more cases as needed
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
  const response = await getProductResponse();
  localStorage.setItem('eds-product-details', JSON.stringify(response[0]));
  loadPdpBlocks();
  // designPdp();
}

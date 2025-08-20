import { buildBlock } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';
import { getPdpDetails } from '../../scripts/coveo/controller/controllers.js';
import { searchEngine } from '../../scripts/coveo/engine.js';
import { designPdp } from '../../scripts/scripts-dev.js';

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

  if (tabs) {
    Array.from(tabs).forEach((tabItem) => {
      // Overview / Description
      tabItem.children[0].classList.add('authored-tab-type');
      tabItem.children[2].classList.add('authored-tab-title');
      if (tabItem.children[0]?.textContent === 'overview') {
        tabItem.classList.add('tab-authored');
        tabItem.id = 'authored-overview';
        const pdpDescriptionBlock = div(buildBlock('pdp-description', { elems: [] }));
        document.querySelector('main').append(pdpDescriptionBlock);
      } else if (tabItem.children[0]?.textContent === 'specifications') {
        // Specifications
        tabItem.classList.add('tab-authored');
        tabItem.id = 'authored-specifications';
        const pdpSpecificationsBlock = div(buildBlock('pdp-specifications', { elems: [] }));
        document.querySelector('main').append(pdpSpecificationsBlock);
      } else if (tabItem.children[0]?.textContent === 'parts') {
        // product parts list
        tabItem.classList.add('tab-authored');
        tabItem.id = 'authored-parts';
        const pdpBundleList = div(buildBlock('pdp-bundle-list', { elems: [] }));
        document.querySelector('main').append(pdpBundleList);
      } else if (tabItem.children[0]?.textContent === 'citations') {
        // Citations
        tabItem.classList.add('tab-authored');
        tabItem.id = 'authored-citations';
        const pdpCitations = div(buildBlock('pdp-citations', { elems: [] }));
        document.querySelector('main').append(pdpCitations);
      } else if (tabItem.children[0]?.textContent === 'faqs') {
        // FAQs
        tabItem.classList.add('tabs-authored');
        tabItem.id = 'authored-faqs';
        const pdpFaqs = div(buildBlock('pdp-faqs', { elems: [] }));
        document.querySelector('main').append(pdpFaqs);
      } else if (tabItem.children[0]?.textContent === 'relatedproducts') {
        // Related Products
        tabItem.classList.add('tabs-authored');
        tabItem.id = 'authored-relatedproducts';
        const pdpRelatedProducts = div(buildBlock('pdp-related-products', { elems: [] }));
        document.querySelector('main').append(pdpRelatedProducts);
      }
    });
  }

  // Overview / Description
  // if (response?.raw?.richlongdescription) {
  //   const pdpDescriptionBlock = div(buildBlock('pdp-description', { elems: [] }));
  //   document.querySelector('main').append(pdpDescriptionBlock);
  // }

  // Specifications
  // if (response?.raw?.numattributes > 0) {
  //   const pdpSpecificationsBlock = div(buildBlock('pdp-specifications', { elems: [] }));
  //   document.querySelector('main').append(pdpSpecificationsBlock);
  // }

  // Products
  if (response?.raw?.objecttype === 'Family' && response?.raw?.numproducts > 0) {
    const pdpProducts = div(buildBlock('pdp-products', { elems: [] }));
    document.querySelector('main').append(pdpProducts);
  }

  // Resources
  if (response?.raw?.numresources) {
    const pdpResources = div(buildBlock('pdp-resources', { elems: [] }));
    document.querySelector('main').append(pdpResources);
  }

  // Bundle parts list
  // if (response?.raw?.objecttype === 'Bundle' && response?.raw?.numproducts > 0) {
  //   const pdpBundleList = div(buildBlock('pdp-bundle-list', { elems: [] }));
  //   document.querySelector('main').append(pdpBundleList);
  // }

  // const pdpCitations = div(buildBlock('pdp-citations', { elems: [] }));
  // document.querySelector('main').append(pdpCitations);

  // const pdpFaqs = div(buildBlock('pdp-faqs', { elems: [] }));
  // document.querySelector('main').append(pdpFaqs);

  // const pdpRelatedProducts = div(buildBlock('pdp-related-products', { elems: [] }));
  // document.querySelector('main').append(pdpRelatedProducts);

  const pdpCarousel = div(buildBlock('pdp-carousel', { elems: [] }));
  document.querySelector('main').append(pdpCarousel);

  //    const pdpFaqs = div(buildBlock('pdp-faqs', { elems: [] }));
  //    const pdpRelatedProducts = div(buildBlock('pdp-related-products', { elems: [] }));
  //    const pdpYouMayAlsoNeeded = div(buildBlock('pdp-you-may-also-needed', { elems: [] }));
  //    const pdpFrequentlyViewed = div(buildBlock('pdp-frequently-viewed', { elems: [] }));
  // const pdpCitations = div(buildBlock('pdp-citations', { elems: [] }));
  // document.querySelector('main').append(pdpCitations);
}

export default async function buildAutoBlocks() {
  const productSlug = new URL(window.location.href).pathname.split('/').pop();
  const response = JSON.parse(localStorage.getItem('eds-product-details'));

  if (response && response?.raw.sku === productSlug) {
    loadPdpBlocks();
    designPdp();
    return;
  }
  localStorage.removeItem('eds-product-details');

  await getPdpDetails(productSlug);
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
  designPdp();
}

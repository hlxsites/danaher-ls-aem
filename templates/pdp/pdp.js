import { buildBlock } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';
import { getPdpDetails } from '../../scripts/coveo/controller/controllers.js';
import { searchEngine } from '../../scripts/coveo/engine.js';

function loadPdpBlocks() {
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  console.log(response.raw.sku);

  const pdpHeroBlock = div(buildBlock('pdp-hero', { elems: [] }));
  const pdpPageTabsBlock = div(buildBlock('pdp-page-tabs', { elems: [] }));
  const pdpDescriptionBlock = div(buildBlock('pdp-description', { elems: [] }));
  const pdpSpecificationsBlock = div(buildBlock('pdp-specifications', { elems: [] }));
  const pdpBundleList = div(buildBlock('pdp-bundle-list', { elems: [] }));
  //    const pdpCitations = div(buildBlock('pdp-citations', { elems: [] }));
  //    const pdpResources = div(buildBlock('pdp-resources', { elems: [] }));
  //    const pdpProducts = div(buildBlock('pdp-products', { elems: [] }));
  //    const pdpFaqs = div(buildBlock('pdp-faqs', { elems: [] }));
  //    const pdpRelatedProducts = div(buildBlock('pdp-related-products', { elems: [] }));
  //    const pdpYouMayAlsoNeeded = div(buildBlock('pdp-you-may-also-needed', { elems: [] }));
  //    const pdpFrequentlyViewed = div(buildBlock('pdp-frequently-viewed', { elems: [] }));
  document.querySelector('main').append(pdpHeroBlock);
  document.querySelector('main').append(pdpPageTabsBlock);
  document.querySelector('main').append(pdpDescriptionBlock);
  document.querySelector('main').append(pdpSpecificationsBlock);
  document.querySelector('main').append(pdpBundleList);
}

export default async function buildAutoBlocks() {
  const productSlug = new URL(window.location.href).pathname.split('/').pop();
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  
  if (response && response?.raw.sku === productSlug) {
    loadPdpBlocks();
    return;
  }
  localStorage.removeItem('eds-product-details');

  await getPdpDetails(productSlug);
  await new Promise((resolve) => {
    const unsubscribe = searchEngine.subscribe(() => {
      const results = searchEngine.state.search.results;
      if (results.length > 0) {
        localStorage.setItem('eds-product-details', JSON.stringify(results[0]));
        unsubscribe();
        resolve();
      }
    });
  });
  loadPdpBlocks();
}

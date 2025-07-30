import { buildBlock } from '../../scripts/lib-franklin.js';
import { div } from '../../scripts/dom-builder.js';
import { getPdpDetails } from '../../scripts/coveo/controller/controllers.js';
import { searchEngine } from '../../scripts/coveo/engine.js';

function loadPdpBlocks() {
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  console.log(response.raw.sku);

  // PDP Hero
  const pdpHeroBlock = div(buildBlock('pdp-hero', { elems: [] }));
  document.querySelector('main').append(pdpHeroBlock);

  // PDP Page tabs
  const pdpPageTabsBlock = div(buildBlock('pdp-page-tabs', { elems: [] }));
  document.querySelector('main').append(pdpPageTabsBlock);

  // Overview / Description
  if (response?.raw?.richlongdescription) {
    const pdpDescriptionBlock = div(buildBlock('pdp-description', { elems: [] }));
    document.querySelector('main').append(pdpDescriptionBlock);
  }

  // Specifications
  if (response?.raw?.numattributes > 0) {
    const pdpSpecificationsBlock = div(buildBlock('pdp-specifications', { elems: [] }));
    document.querySelector('main').append(pdpSpecificationsBlock);
  }

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
  if (response?.raw?.objecttype === 'Bundle' && response?.raw?.numproducts > 0) {
    const pdpBundleList = div(buildBlock('pdp-bundle-list', { elems: [] }));
    document.querySelector('main').append(pdpBundleList);
  }

  const pdpCitations = div(buildBlock('pdp-citations', { elems: [] }));
  document.querySelector('main').append(pdpCitations);

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
  loadPdpBlocks();
}

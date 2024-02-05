import {
  div, ul, li, a,
} from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { getProductResponse, getSKU, makeCoveoApiRequest } from '../../scripts/scripts.js';

function getCoveoApiPayload(qParam) {
  const sku = getSKU();
  const host = window.DanaherConfig !== undefined ? window.DanaherConfig.host : '';
  const payload = {
    context: {
      host: `${host}`,
      internal: false,
    },
    aq: `@${qParam}==${sku}`,
    pipeline: 'Product Details',
  };
  return payload;
}

function addProductBreadCrumb(response, breadcrumbEl) {
  const clickUrl = new URL(response.at(0)?.ClickUri);
  const ulEl = breadcrumbEl.querySelector('ul');
  const liEl = li(a({ href: clickUrl.pathname }, response.at(0)?.Title));
  ulEl.append(liEl);
}

export default async function buildAutoBlocks() {
  const sku = getSKU();
  let response = getProductResponse();
  const productHeroEl = document.querySelector('main > div > div.product-hero');
  if (!document.querySelector('main > div > div.breadcrumb')) {
    const breadcrumbEl = div(
      { class: 'breadcrumb' },
      div(
        div(
          ul(
            li(
              a({ href: '/us/en/products' }, 'Products'),
            ),
          ),
        ),
      ),
    );
    if (response) {
      addProductBreadCrumb(response, breadcrumbEl);
    }
    const breadcrumbBlock = div(buildBlock('breadcrumb', { elems: [breadcrumbEl] }));
    productHeroEl.parentElement.insertAdjacentElement('afterend', breadcrumbBlock);
  }
  // build page tabs
  const pageTabsBlock = div(buildBlock('page-tabs', { elems: [] }));
  productHeroEl.parentElement.insertAdjacentElement('afterend', pageTabsBlock);

  try {
    if (!response || response.at(0)?.raw.sku !== sku) {
      response = await makeCoveoApiRequest('/rest/search/v2', 'productKey', getCoveoApiPayload('productid'));
      if (response.results.length > 0) {
        localStorage.setItem('product-details', JSON.stringify(response.results));
        if (document.querySelector('main > div > div.breadcrumb')) {
          const breadcrumbEl = document.querySelector('main > div > div.breadcrumb');
          addProductBreadCrumb(response.results, breadcrumbEl);
        }
      } else {
        localStorage.removeItem('product-details');
        window.location.replace('/us/en/products/product-not-found');
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

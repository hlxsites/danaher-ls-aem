import {
  div, ul, li, a,
} from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';
import { getProductResponse } from '../../scripts/commerce.js';
import { buildProductSchema } from '../../scripts/schema.js';

function addProductBreadCrumb(response, breadcrumbEl) {
  const clickUrl = new URL(response.at(0)?.ClickUri);
  const ulEl = breadcrumbEl.querySelector('ul');
  const liEl = li(a({ href: clickUrl.pathname }, response.at(0)?.Title));
  ulEl.append(liEl);
}

export default async function buildAutoBlocks() {
  const response = await getProductResponse();
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
    productHeroEl?.parentElement.insertAdjacentElement('afterend', breadcrumbBlock);
  }
  console.log('buildProductSchemaCall');
  buildProductSchema();

  // build page tabs
  const pageTabsBlock = div(buildBlock('page-tabs', { elems: [] }));
  productHeroEl?.parentElement.insertAdjacentElement('afterend', pageTabsBlock);
}

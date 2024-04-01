/* eslint-disable import/no-unresolved */
import { getProductsForCategories } from '../../scripts/commerce.js';
import { div } from '../../scripts/dom-builder.js';
import { productSkeleton } from './product-skeleton.js';
import facets from './product-facets.js';
import resultList from './product-results.js';

export default async function decorate(block) {
  block.classList.add('pt-10');
  block.append(productSkeleton);
  setTimeout(async () => {
    const response = await getProductsForCategories();

    const facetDiv = div({ class: 'max-w-sm w-full mx-auto' });
    const categoryDiv = div({ class: 'max-w-5xl w-full mx-auto' });
    facets(response, facetDiv);
    resultList(response, categoryDiv);

    block.removeChild(productSkeleton);
    block.classList.add(...'flex flex-col lg:flex-row w-full mx-auto gap-6'.split(' '));
    block.append(facetDiv, categoryDiv);
  }, 1000);
}

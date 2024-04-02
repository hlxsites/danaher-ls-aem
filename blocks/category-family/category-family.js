/* eslint-disable import/no-unresolved */
import { getProductsForCategories, getProductsCategoryByBrand } from '../../scripts/commerce.js';
import { div } from '../../scripts/dom-builder.js';
import { productSkeleton } from './product-skeleton.js';
// eslint-disable-next-line import/no-cycle
import facets from './product-facets.js';
import resultList from './product-results.js';

function getHashParams() {
  const { hash } = window.location;
  const hashWithoutHashSign = hash.slice(1);
  const paramsArray = hashWithoutHashSign.split('&');
  const params = {};
  paramsArray.forEach((pair) => {
    const [key, value] = pair.split('=');
    params[key] = value;
  });
  return params;
}

function isEmptyObject(obj) {
  return Object.keys(obj).at(0) === '';
}

export async function decorateProductList(block) {
  getHashParams();
  block.innerHTML = '';
  block.classList.add('pt-10');
  block.append(productSkeleton);
  setTimeout(async () => {
    const facetDiv = div({ class: 'max-w-sm w-full mx-auto' });
    const categoryDiv = div({ class: 'max-w-5xl w-full mx-auto' });
    const response = isEmptyObject(getHashParams()) ? await getProductsForCategories()
      : await getProductsCategoryByBrand(getHashParams());
    // const response = await getProductsForCategories();
    if (response.totalCount === 0) {
      block.removeChild(productSkeleton);
      return;
    }
    facets(response, facetDiv);
    resultList(response, categoryDiv);
    block.removeChild(productSkeleton);
    block.classList.add(...'flex flex-col lg:flex-row w-full mx-auto gap-6'.split(' '));
    block.append(facetDiv, categoryDiv);
  }, 500);
}

export default async function decorate(block) {
  decorateProductList(block);
}

import { getProductsOnSolutionsResponse } from '../../scripts/commerce.js';
import { ul } from '../../scripts/dom-builder.js';
import { createCard } from '../product-category/product-category.js';

export default async function decorate(block) {
  const response = await getProductsOnSolutionsResponse();
  if (response?.length > 0) {
    const cardList = ul({
      class: 'container grid max-w-7xl w-full mx-auto gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 py-4 sm:px-0 justify-items-center mt-3 mb-3',
    });
    response.forEach((product, index) => {
      product.path = product.clickUri;
      product.image = product?.raw?.images[0];
      product.description = product?.raw?.description;
      cardList.append(createCard(product, index === 0));
    });
    block.innerHTML = '';
    block.append(cardList);
  }
}

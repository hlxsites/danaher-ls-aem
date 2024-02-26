/* global WebImporter */
const URLS_TO_BLOCK_MAP = [
  {
    url: '/us/en/products/brands/',
    blockName: 'Product category list (opco-home)',
  },
  {
    url: '/us/en/products',
    blockName: 'Product category list',
  },
];

const createProductCategoryList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  const placeholderProdCategory = main.querySelector('div#product-category-list');
  const placeholderProdCard = main.querySelector('div.grid');
  if (url) {
    let blockName = '';
    if (url.includes('/us/en/solutions') && url.includes('/products')) {
      blockName = 'Solutions products list (workflow)';
    } else {
      blockName = URLS_TO_BLOCK_MAP.find((item) => url && url.includes(item.url))?.blockName;
    }
    if (blockName) {
      const block = [[blockName], ['']];
      const table = WebImporter.DOMUtils.createTable(block, document);
      if (placeholderProdCategory) {
        placeholderProdCategory.innerHTML = '';
        placeholderProdCategory.append(table);
      } else if (placeholderProdCard) {
        placeholderProdCard.innerHTML = '';
        placeholderProdCard.append(table);
      }
    }
  }
};

export default createProductCategoryList;

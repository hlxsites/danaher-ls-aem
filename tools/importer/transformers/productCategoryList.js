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
  {
    url: '/us/en/solutions/',
    blockName: 'Product Card (solutions)',
  },
];

const createProductCategoryList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  const placeholderProdCard = main.querySelector('div#product-category-list') ? main.querySelector('div#product-category-list') : main.querySelector('div#solutions-product-card');
  if (url && placeholderProdCard) {
    const blockName = URLS_TO_BLOCK_MAP.find((item) => url && url.includes(item.url))?.blockName;
    if (blockName) {
      const block = [[blockName], ['']];
      const table = WebImporter.DOMUtils.createTable(block, document);
      placeholderProdCard.innerHTML = '';
      placeholderProdCard.append(table);
    }
  }
};

export default createProductCategoryList;

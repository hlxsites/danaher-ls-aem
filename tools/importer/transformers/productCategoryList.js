/* global WebImporter */
const createProductCategoryList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  const placeholder = main.querySelector('div#product-category-list');
  if (placeholder) {
    let blockName = 'Product category list';
    if (url && url.includes('/us/en/products/brands/')) blockName = 'Product category list (opco-home)';
    const block = [[blockName], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
};
export default createProductCategoryList;

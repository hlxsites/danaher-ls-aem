/* global WebImporter */
const createProductCategoryList = (main, document) => {
  const placeholder = main.querySelector('div#product-category-list');
  if (placeholder) {
    const block = [['Product category list'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
};
export default createProductCategoryList;

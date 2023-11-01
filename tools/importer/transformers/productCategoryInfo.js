/* global WebImporter */
const productCategoryInfo = (main, document) => {
  const categoryInfo = main.querySelector('category-info');
  if (categoryInfo) {
    const h3El = document.createElement('h3');
    h3El.textContent = 'Categories';
    categoryInfo.append(h3El);
    const block = [['Product Category Info'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    categoryInfo.append(table, document.createElement('hr'));
  }
};
export default productCategoryInfo;

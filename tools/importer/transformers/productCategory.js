/* global WebImporter */
const productCategory = (main, document) => {
  const category = main.querySelector('category-info');
  if (category) {
    const block = [['Product Category'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    category.append(table, document.createElement('hr'));
  }
};
export default productCategory;

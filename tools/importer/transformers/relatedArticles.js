/* global WebImporter */
const createProductCategoryList = (main, document) => {
  const placeholder = main.querySelector('div#related-articles');
  if (placeholder) {
    const block = [['Related Articles'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
};
export default createProductCategoryList;

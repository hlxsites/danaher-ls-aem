/* global WebImporter */
const createProductCategoryList = (main, document) => {
  const placeholder = main.querySelector('div#social-feeds');
  if (placeholder) {
    const block = [['Social Feeds'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
};
export default createProductCategoryList;

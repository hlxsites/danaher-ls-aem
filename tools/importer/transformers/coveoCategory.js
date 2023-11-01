/* global WebImporter */
const coveoCategory = (main, document) => {
  const category = main.querySelector('div.coveocategory');
  if (category) {
    const block = [['Coveo Category'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    category.append(table, document.createElement('hr'));
  }
};
export default coveoCategory;

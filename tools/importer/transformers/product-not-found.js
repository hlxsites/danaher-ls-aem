/* global WebImporter */
const productNotFound = (main, document) => {
  const notFoundEl = main.querySelector('div#product-not-found');
  if (notFoundEl) {
    const block = [['Product not found'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    notFoundEl.replaceWith(table);
  }
};
export default productNotFound;

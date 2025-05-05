/* global WebImporter */
const checkoutHeader = (main, document) => {
  const category = main.querySelector("checkout-header");
  if (category) {
    const block = [["Checkout Header"], [""]];
    const table = WebImporter.DOMUtils.createTable(block, document);
    category.append(table, document.createElement("hr"));
  }
};
export default checkoutHeader;

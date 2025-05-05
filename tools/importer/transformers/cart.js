/* global WebImporter */
const cart = (main, document) => {
  const category = main.querySelector("cart");
  if (category) {
    const block = [["Cart"], [""]];
    const table = WebImporter.DOMUtils.createTable(block, document);
    category.append(table, document.createElement("hr"));
  }
};
export default cart;

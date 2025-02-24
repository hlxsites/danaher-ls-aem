/* global WebImporter */
const blockGenerator = (main, document) => {
  const blockGeneratorEl = main.querySelector('div#block-generator');
  if (blockGeneratorEl) {
    const blockName = blockGeneratorEl.firstElementChild?.id;
    const block = [[blockName], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    blockGeneratorEl.replaceWith(table);
  }
};
export default blockGenerator;
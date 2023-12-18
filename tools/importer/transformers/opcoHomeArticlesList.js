/* global WebImporter */
const createOpcoHomeArticlesList = (main, document) => {
  const placeholder = main.querySelector('div#articles-opco-home');
  if (placeholder) {
    const blockName = 'Articles list';
    const block = [[blockName], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
};
export default createOpcoHomeArticlesList;

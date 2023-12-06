/* global WebImporter */
const createOpcoHomeArticlesList = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  const placeholder = main.querySelector('div#articles-opco-home');
  if (placeholder) {
    let blockName = 'Articles list (opco-home)';    
    const block = [[blockName], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
};
export default createOpcoHomeArticlesList; 

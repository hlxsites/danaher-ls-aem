/* global WebImporter */
const createSidebarArticle = (main, document) => {
  const sidebar = main.querySelector('div#recent-articles')?.parentNode;
  if (sidebar) {
    sidebar.innerHTML = '';
    const block = [['recent-articles'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    sidebar.append(document.createElement('hr'));
    sidebar.append(table);
  }
};
export default createSidebarArticle;

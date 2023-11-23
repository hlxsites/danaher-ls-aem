/* global WebImporter */
const libraryHub = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  if (url?.endsWith('/us/en/library.html') || url?.endsWith('/us/en/info.html')) {
    const pageNameMatch = url.match(/\/([^/]+)\.html$/);
    if (pageNameMatch) {
      const pageName = pageNameMatch[1];
      main.querySelectorAll('div.container-sidebar').forEach((div) => div.remove());
      main
        .querySelectorAll('div.aem-Grid.aem-Grid--12.aem-Grid--default--12 h2')
        .forEach((h2) => h2.closest('div').remove());
      const block = [[`Card List (${pageName})`], ['']];
      const table = WebImporter.DOMUtils.createTable(block, document);
      main.append(table);
    }
  }
};
export default libraryHub;

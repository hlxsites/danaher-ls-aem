/* global WebImporter */
const libraryHub = (main, document) => {
  const url = document.querySelector('[property="og:url"]')?.content;
  if (url?.endsWith('/library.html')) {
    main.querySelectorAll('div.container-sidebar').forEach((div) => div.remove());
    main
      .querySelectorAll('div.aem-Grid.aem-Grid--12.aem-Grid--default--12 h2')
      .forEach((h2) => h2.closest('div').remove());

    const block = [['Card List (library)'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    main.append(table);
  }
};
export default libraryHub;

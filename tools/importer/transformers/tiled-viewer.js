/* global WebImporter */
const tiledViewer = (main, document) => {
  const tiledViewerEl = main.querySelector('div#tiled-viewer');
  if (tiledViewerEl) {
    const block = [['Tiled Viewer'], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    tiledViewerEl.replaceWith(table);
  }
};
export default tiledViewer;

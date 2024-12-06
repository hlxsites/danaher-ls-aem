/* global WebImporter */
const splineViewer = (main, document) => {
    const splineViewerEl = main.querySelector('div#spline-viewer');
    if (splineViewerEl) {
      const block = [['Spline Viewer'], ['']];
      const table = WebImporter.DOMUtils.createTable(block, document);
      splineViewerEl.replaceWith(table);
    }
  };
  export default splineViewer;
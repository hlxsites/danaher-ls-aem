/* global WebImporter */
const createWorkflowContainerSection = (main, document) => {
  main.querySelectorAll('div.container-workflow').forEach((e, i, arr) => {
    if (i === arr.length - 1) {
      const cells = [['Section Metadata'], ['style', 'workflow-container-two-col']];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      e.append(table, document.createElement('hr'));
    }
  });
};
export default createWorkflowContainerSection;

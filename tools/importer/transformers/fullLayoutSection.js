/* global WebImporter */
const createFullLayoutSection = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((e, i, arr) => {
    const div = e.querySelector('div');
    const style = div.getAttribute('class');
    if (style) {
      const cells = [['Section Metadata'], ['style', style]];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      e.after(table);
      if (i < arr.length - 1) {
        table.after(document.createElement('hr'));
      }
    }
  });
};
export default createFullLayoutSection;

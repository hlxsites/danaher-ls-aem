/* global WebImporter */
const createFullLayoutSection = (main, document) => {
  main.querySelectorAll('fulllayout').forEach((e, i, arr) => {
    const div = e.querySelector('div');
    const style = div.getAttribute('class');
    if (style) {
      if (i === 0 && e.parentNode.previousElementSibling) e.prepend(document.createElement('hr'));
      const cells = [['Section Metadata'], ['style', style]];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      e.after(table);
      if ((arr.length === 1 || i < arr.length - 1) && !arr[arr.length - 1].querySelector('div.bg-danaherlightblue-50')?.querySelector('div.cta-section')) {
        table.after(document.createElement('hr'));
      }
    }
  });
};
export default createFullLayoutSection;

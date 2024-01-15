/* global WebImporter */
const createFullLayoutSection = (main, document) => {
  let styleIndex = 0;
  main.querySelectorAll('fulllayout').forEach((e, i, arr) => {
    const div = e.querySelector('div');
    const style = div.getAttribute('class');
    if (style) {
      if (styleIndex === 0 && e.parentNode.previousElementSibling) e.prepend(document.createElement('hr'));
      const cells = [['Section Metadata'], ['style', style]];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      e.after(table);
      if ((arr.length === 1 || i < arr.length - 1)
                  && !e.parentNode.nextElementSibling?.className.includes('carousel')) {
        table.after(document.createElement('hr'));
      }
      styleIndex += 1;
    }
  });
};
export default createFullLayoutSection;

/* global WebImporter */

function addSeparator(placeholder, document) {
  if (placeholder) {
    const pEl = document.createElement('p');
    pEl.textContent = placeholder?.innerHTML;
    const blockName = 'Separator Line';
    const block = [[blockName], [pEl.textContent]];
    const table = WebImporter.DOMUtils.createTable(block, document);
    placeholder.innerHTML = '';
    placeholder.append(table);
  }
}

const createSeparator = (main, document) => {
  const placeholders = main.querySelectorAll('div#add-hr');
  placeholders.forEach((placeholder) => {
    addSeparator(placeholder, document);
  });
};

export default createSeparator;

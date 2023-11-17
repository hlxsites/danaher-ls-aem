/* global WebImporter */
const sideNav = (main, document) => {
  const sideNavEl = main.querySelector('#side-nav');
  if (sideNavEl) {
    let blockName = 'Side Nav';
    const sideNavContent = sideNavEl?.textContent?.trim();
    if (sideNavContent && sideNavContent.length < 65) {
      blockName += ` (${sideNavContent})`;
    }
    const block = [[blockName], ['']];
    const table = WebImporter.DOMUtils.createTable(block, document);
    sideNavEl.replaceWith(table);
    table.insertAdjacentElement('afterend', document.createElement('hr'));
  }
};
export default sideNav;

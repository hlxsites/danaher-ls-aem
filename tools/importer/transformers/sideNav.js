/* global WebImporter */
const sideNav = (main, document) => {
  const sideNavEl = main.querySelector('#side-nav');
  if (sideNavEl) {
    const sideNavContent = sideNavEl?.textContent?.trim() || '';
    const block = [['Side Nav'], [sideNavContent]];
    const table = WebImporter.DOMUtils.createTable(block, document);
    sideNavEl.replaceWith(table);
  }
};
export default sideNav;

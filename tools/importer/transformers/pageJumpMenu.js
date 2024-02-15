/* global WebImporter */
const createPageJumpMenu = (main, document) => {
  const jumpMenu = main.querySelector('page-jump-menu');
  const menus = [];
  if (jumpMenu) {
    // eslint-disable-next-line no-undef
    const menuList = JSON.parse(decodeHtmlEntities(jumpMenu.getAttribute('list')));
    menuList.forEach((element) => {
      const urlEl = document.createElement('a');
      urlEl.href = element.linkUrl;
      urlEl.textContent = element.linkName;
      const imgEl = document.createElement('img');
      imgEl.src = element.icon;
      menus.push([imgEl, urlEl]);
    });
    const cells = [['Page Jump Menu'], ...menus];
    if (menus.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      jumpMenu.append(block, document.createElement('hr'));
    }
  }
};
export default createPageJumpMenu;

/* global WebImporter */
const createTimeline = (main, document) => {
  const menu = main.querySelector('toggle-timeline');
  const allMenu = [];
  const allItems = [];
  if (menu) {
    // eslint-disable-next-line no-undef
    const menuList = JSON.parse(decodeHtmlEntities(menu.getAttribute('allmenus')));
    menuList.forEach((item) => {
      const detail = [];
      const title = document.createElement('strong');
      title.textContent = item.title ? item.title : '';

      const description = document.createElement('p');
      if (item.description) {
        description.innerHTML = item.description;
        detail.push(description);
      }

      const link = document.createElement('a');
      if (item.linkName) {
        link.href = '#';
        link.textContent = item.linkName;
        detail.push(link);
      }
      allMenu.push([title, detail]);
    });
    const cells = [['Timeline Menu'], ...allMenu];
    if (allMenu.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      menu.append(block);
    }

    // eslint-disable-next-line no-undef
    const itemList = JSON.parse(decodeHtmlEntities(menu.getAttribute('allitems')));
    itemList.forEach((item) => {
      const detail = [];

      const stepNo = document.createElement('div');
      stepNo.textContent = item.stepNum ? item.stepNum : '';

      const title = document.createElement('div');
      if (item.title) {
        title.textContent = item.title;
        detail.push(title);
      }

      const description = document.createElement('p');
      if (item.description) {
        description.innerHTML = item.description;
        detail.push(description);
      }

      const subTitle = document.createElement('strong');
      if (item.subTitle) {
        subTitle.textContent = item.subTitle;
        detail.push(subTitle);
      }

      const image = document.createElement('img');
      if (item.image) {
        image.src = item.image;
        detail.push(image);
      }

      const button1 = document.createElement('a');
      if (item.buttonTextOne) {
        button1.href = item.buttonLinkOne;
        button1.textContent = item.buttonTextOne;
        detail.push(button1);
      }

      const button2 = document.createElement('a');
      if (item.buttonTextTwo) {
        button2.href = item.buttonLinkTwo;
        button2.textContent = item.buttonTextTwo;
        detail.push(button2);
      }

      allItems.push([stepNo, detail]);
    });
    const itemCells = [['Timeline'], ...allItems];
    if (allItems.length > 0) {
      const block = WebImporter.DOMUtils.createTable(itemCells, document);
      menu.append(block);
    }
  }
};

export default createTimeline;

/* global WebImporter */
const createProductMenu = (main, document) => {
  const productMenus = main.querySelectorAll('div.product-menu');
  [...productMenus].forEach((productMenu) => {
    const productMenuEl = productMenu.querySelector('product-menu');
    // eslint-disable-next-line no-undef
    const items = JSON.parse(decodeHtmlEntities(productMenuEl.getAttribute('menu-items')));
    const rows = [];
    items.forEach((item) => {
      const divRight = document.createElement('div');
      const divLeft = document.createElement('div');
      if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        divLeft.append(img);
      }

      if (item.title) {
        const pEl = document.createElement('p');
        pEl.textContent = item.title;
        divLeft.append(pEl);
      }

      if (item.fragmentPath) {
        const pEL = document.createElement('p');
        pEL.textContent = item.fragmentPath
          .replace('content/experience-fragments/danaher/us/en/site', 'fragments')
          .replace('/jcr:content', '');
        divRight.append(pEL);
      }
      rows.push([divLeft, divRight]);
    });

    const cells = [
      ['Product Menu'],
      ...rows,
    ];

    if (rows.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      productMenuEl.append(block);
    }
  });
};
export default createProductMenu;

/* global WebImporter */
const createBanner = (main, document) => {
  const banner = main.querySelector('banner');
  if (banner) {
    const title = banner.getAttribute('title');
    const description = banner.getAttribute('desc');
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = title;
    if (h1) {
      div.append(h1);
    }
    if (description) {
      const h2 = document.createElement('h2');
      h2.textContent = description;
      div.append(h2);
    }
    const cells = [
      ['Banner'],
      [div],
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    banner.append(block);
  }
};
export default createBanner;

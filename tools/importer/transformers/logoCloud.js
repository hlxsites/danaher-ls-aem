/* global WebImporter */
if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser
const createLogoCloud = (main, document) => {
  const logoCloud = main.querySelector('logo-cloud');
  if (logoCloud) {
    const div = document.createElement('div');
    const template = logoCloud.querySelector('template');
    div.append(template.content.querySelector('h2'));
    template.content.querySelectorAll('p').forEach((item) => div.append(item));
    div.append(template.content.querySelector('a'));

    const items = [];
    // eslint-disable-next-line no-undef
    const logos = JSON.parse(decodeHtmlEntities(logoCloud.getAttribute('logos')));
    logos.forEach((logo) => {
      const a = document.createElement('a');
      a.setAttribute('href', logo.imageLink);
      a.textContent = logo.imageAlt;
      const img = document.createElement('img');
      img.setAttribute('src', logo.image);
      img.setAttribute('alt', logo.imageAlt);
      items.push([img, a]);
    });

    const cells = [
      ['Logo Clouds'],
      [div],
      ...items,
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    const sectionCells = [['Section Metadata'], ['style', 'bg-gray-200']];
    const table = WebImporter.DOMUtils.createTable(sectionCells, document);
    logoCloud.after(block, table, document.createElement('hr'));
  }
};
export default createLogoCloud;

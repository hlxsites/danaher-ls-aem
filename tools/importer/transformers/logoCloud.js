/* global WebImporter */
if (window) window.decodeHtmlEntities = (text) => text; // not-needed in browser
const createLogoCloud = (main, document) => {
  const logoCloud = main.querySelector('logo-cloud');
  if (logoCloud) {
    const template = logoCloud.querySelector('template');
    const items = [];
    const featureimage = template.content.querySelector('feature-image');
    if (featureimage) {
      const cardImg = featureimage?.getAttribute('img');
      const cardImgAlt = featureimage?.getAttribute('imgalt') ? featureimage?.getAttribute('imgalt') : 'Danaher Corporation';
      const cardTitle = featureimage?.getAttribute('title');
      const btnRfq = featureimage?.getAttribute('btnrfq');
      const btnHref = featureimage?.getAttribute('btnhref');
      const cardLinkText = featureimage?.getAttribute('btntext');
      const cardDescription = featureimage?.getAttribute('description');

      const leftDiv = document.createElement('div');
      if (cardImg) {
        const img = document.createElement('img');
        img.setAttribute('src', cardImg);
        img.setAttribute('alt', cardImgAlt);
        leftDiv.append(img);
      }
      const rightDiv = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = cardTitle;
      rightDiv.append(h3);
      if (cardDescription) {
        const desc = document.createElement('p');
        desc.innerHTML = cardDescription;
        rightDiv.append(desc);
      }
      const a = document.createElement('a');
      if (btnRfq) a.setAttribute('href', '#RequestAQuote');
      else a.setAttribute('href', btnHref);
      a.textContent = cardLinkText;
      rightDiv.append(a);
      items.push([leftDiv, rightDiv]);
    }

    // eslint-disable-next-line no-undef
    const logos = JSON.parse(decodeHtmlEntities(logoCloud.getAttribute('logos')));
    logos?.forEach((logo) => {
      const a = document.createElement('a');
      a.setAttribute('href', logo.imageLink);
      a.textContent = logo.imageAlt;
      const img = document.createElement('img');
      img.setAttribute('src', logo.image);
      img.setAttribute('alt', logo.imageAlt);
      items.push([img, a]);
    });

    const cells = [
      ['Logo Clouds'], ...items,
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    const sectionCells = [['Section Metadata'], ['style', 'bg-gray-200']];
    const table = WebImporter.DOMUtils.createTable(sectionCells, document);
    logoCloud.after(block, table, document.createElement('hr'));
  }
};
export default createLogoCloud;

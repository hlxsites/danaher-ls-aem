import {
  featureimage,
} from './util.js';
/* global WebImporter */
const createTwoColumn = (main, document) => {
  main.querySelectorAll('grid[columns="2"]').forEach((item) => {
    const columns = [];
    const templates = item.querySelectorAll('template');
    [...templates].forEach((template) => {
      if (template.content.children.length > 0) {
        const row = [];
        [...template.content.children].forEach((element) => {
          if (element.className === 'featureimage') {
            const featureImage = template.content.querySelector('div.featureimage');
            if (featureImage?.firstElementChild?.localName === 'feature-image') {
              featureimage(featureImage, document);
              WebImporter.DOMUtils.remove(featureImage, ['feature-image']);
            }

            if (featureImage) {
              row.push(featureImage);
            }
          } else if (element.className === 'imagetext') {
            const imageText = template.content.querySelector('imagetext');

            if (imageText) {
              const img = document.createElement('img');
              img.setAttribute('src', imageText.getAttribute('image'));
              row.push(img);
            }
          } else if (element.className === 'heading-aem') {
            const heading = template.content.querySelector('div.heading-aem');

            if (heading) {
              row.push(heading.firstElementChild);
            }
          } else if (element.className === 'heading') {
            const heading = template.content.querySelector('div.heading');

            if (heading) {
              const headingEL = heading?.querySelector('heading');
              const hTag = headingEL?.getAttribute('headingtag') ? headingEL?.getAttribute('headingtag') : 'h1';
              const headEl = document.createElement(hTag);
              headEl.textContent = headingEL?.getAttribute('heading');
              row.push(headEl);
            }
          } else if (element.className === 'script') {
            const featureImage = template.content.querySelector('div.featureimage');

            if (featureImage) {
              row.push(featureImage);
            }
          }
        });
        columns.push(row);
      }
    });
    const cells = [
      ['Columns'],
      [...columns],
    ];

    if (columns.length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      item.append(block);
    }
  });
};
export default createTwoColumn;

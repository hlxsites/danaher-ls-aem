import {
  featureimage,
} from './util.js';
/* global WebImporter */
const createTwoColumn = (main, document) => {
  main.querySelectorAll('grid[columns="2"]').forEach((item) => {
    const columns = [];
    const templates = item.querySelectorAll('template');
    [...templates].forEach((template) => {
      if (template.content.firstElementChild) {
        if (template.content.firstElementChild.className === 'featureimage') {
          const featureImage = template.content.querySelector('div.featureimage');
          if (featureImage?.firstElementChild?.localName === 'feature-image') {
            featureimage(featureImage, document);
            WebImporter.DOMUtils.remove(featureImage, ['feature-image']);
          }

          if (featureImage) {
            columns.push(featureImage);
          }
        } else if (template.content.firstElementChild.className === 'imagetext') {
          const imageText = template.content.querySelector('imagetext');

          if (imageText) {
            const img = document.createElement('img');
            img.setAttribute('src', imageText.getAttribute('image'));
            columns.push(img);
          }
        } else if (template.content.firstElementChild.className === 'script') {
          const featureImage = template.content.querySelector('div.featureimage');

          if (featureImage) {
            columns.push(featureImage);
          }
        }
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

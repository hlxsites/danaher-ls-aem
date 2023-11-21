/* global WebImporter */
import { featureimage } from './util.js';

const createTakeaway = (main, document) => {
  main.querySelectorAll('div.container-takeaway').forEach((takeaway) => {
    const block = [['Takeway']];
    const fullLayout = takeaway?.querySelector('fulllayout');
    const featureImgs = fullLayout?.querySelectorAll('div.featureimage');
    if (featureImgs) {
      featureImgs.forEach((featureImg) => {
        block.push([featureimage(featureImg, document)]);
      });
    } else {
      block.push([fullLayout.innerHTML]);
    }
    const table = WebImporter.DOMUtils.createTable(block, document);
    fullLayout.replaceWith(table);
  });
};
export default createTakeaway;

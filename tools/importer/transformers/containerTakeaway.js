import {
  featureimage,
} from './util.js';

/* global WebImporter */
const createTakeaway = (main, document) => {
  const takeaway = main.querySelector('div.container-takeaway');
  const fulllayout = takeaway?.querySelector('fulllayout');
  const div = fulllayout?.querySelector('div');
  const featureImg = div?.querySelector('div.featureimage');
  if (takeaway) {
    takeaway.innerHTML = '';
    const cells = [['Section Metadata'], ['style', 'product-topic-takeaway']];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    takeaway.append(document.createElement('hr'), featureimage(featureImg, document), table, document.createElement('hr'));
  }
};
export default createTakeaway;

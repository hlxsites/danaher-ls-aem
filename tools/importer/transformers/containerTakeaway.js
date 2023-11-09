import {
  featureimage,
} from './util.js';

/* global WebImporter */
const createTakeaway = (main, document) => {
  main.querySelectorAll('div.container-takeaway').forEach((takeaway) => {
    const fulllayout = takeaway?.querySelector('fulllayout');
    const div = fulllayout?.querySelector('div');
    const featureImg = div?.querySelector('div.featureimage');
    if (takeaway) {
      takeaway.innerHTML = '';
      const cells = [['Section Metadata'], ['style', 'product-topic-takeaway']];
      const table = WebImporter.DOMUtils.createTable(cells, document);
      if (takeaway.previousElementSibling.className !== 'container-takeaway') {
        takeaway.append(document.createElement('hr'));
      }
      takeaway.append(featureimage(featureImg, document), table);
      if (takeaway.nextElementSibling) {
        table.after(document.createElement('hr'));
      }
    }
  });
};
export default createTakeaway;

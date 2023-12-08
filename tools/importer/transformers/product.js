import {
  featureImage, imageText, appendText, productcitations,
} from './util.js';
/* global WebImporter */
const createProductPage = (main, document) => {
  const product = main.querySelector('product-page');
  if (product) {
    const btnText = product.getAttribute('rfqbuttontext');
    const productCells = [
      ['Product Details'],
      [btnText],
    ];

    if (btnText) {
      const block = WebImporter.DOMUtils.createTable(productCells, document);
      product.append(block, document.createElement('hr'));
    }

    const tabs = JSON.parse(product.getAttribute('producttabs'));
    tabs.forEach((tab, i, arr) => {
      const sectionCells = [['Section Metadata'], ['icon', tab.icon], ['tabId', tab.tabId], ['tabName', tab.tabName]];
      const attributeCells = [];
      const template = product.querySelector(`template[v-slot:${tab.tabId}]`);

      if (tab.tabId === 'specification') {
        const attributes = JSON.parse(product.getAttribute('attributes'));
        attributeCells.push(['product-attribute-table']);
        attributes.forEach((attribute) => {
          attributeCells.push([attribute.attributeLabel, attribute.attribute]);
        });
        const attributeTable = WebImporter.DOMUtils.createTable(attributeCells, document);
        main.append(attributeTable);
      }

      if (template.content.childNodes.length > 1) {
        const elementsArray = Array.from(template.content.childNodes);
        elementsArray.forEach((element) => {
          if (element.outerHTML) {
            switch (element.className) {
              case 'imagetext':
                main.append(imageText(element, document));
                break;
              case 'text':
                main.append(appendText(element));
                break;
              case 'product-citations':
                main.append(productcitations(element));
                break;
              default:
                main.append(featureImage(element, document));
            }
          }
        });
      }

      const sectionTable = WebImporter.DOMUtils.createTable(sectionCells, document);
      main.append(sectionTable);
      if (i < arr.length - 1) {
        main.append(document.createElement('hr'));
      }
    });
  }
};
export default createProductPage;

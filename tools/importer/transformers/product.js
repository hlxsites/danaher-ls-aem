import {
  featureImage, imageText, appendText, productcitations, getHeading, mapTable,
} from './util.js';
/* global WebImporter */

const TABS_MAPPING = [
  { id: 'feature' },
  { id: 'overview', sectionName: 'Product Overview' },
  { id: 'specification', sectionName: 'Product Specifications' },
  { id: 'solutions', sectionName: 'Product Solutions' },
  { id: 'resources', sectionName: 'Product Resources' },
  { id: 'products', sectionName: 'Product Children' },
  { id: 'parts', sectionName: 'Product Parts' },
  { id: 'spareproducts', sectionName: 'Spare Products' },
  { id: 'relatedproducts', sectionName: 'Related Products' },
  { id: 'productselector', sectionName: 'Product Selector' },
  { id: 'citations', sectionName: 'Product Citations' },
];

let sectionName;

const render = (main, element, document) => {
  switch (element.className) {
    case 'imagetext':
      main.append(imageText(element, document));
      break;
    case 'heading': {
      getHeading(element, document);
      main.append(element);
      break;
    }
    case 'text':
      main.append(element.textContent.trim().length > 0 ? appendText(element) : '');
      break;
    case 'product-citations': {
      const block = WebImporter.DOMUtils.createTable([[sectionName],
        [productcitations(element, document)]], document);
      main.append(block);
      break;
    }
    case 'table': {
      const tableEL = element.querySelector('template')?.content?.querySelector('table');
      mapTable(tableEL, document);
      main.append(tableEL);
      break;
    }
    default: {
      featureImage(element, document);
      main.append(element);
    }
  }
};

async function getProductTitle(url) {
  if (url.pathname.match(/^\/content\/danaher\/ls\/us\/en\/products\/(family\/|sku\/)/)) {
    const urlStr = url.pathname.replace(/^\/content\/danaher\/ls/, '').replace(/\.html$/, '');
    const productMeta = await fetch('https://main--danaher-ls-aem--hlxsites.hlx.live/metadata-products.json')
    .then((response) => {
      return response.json();
    });
    const reqestedProduct = Array.from(productMeta.data).filter((product) => product.URL === urlStr);
    if(reqestedProduct.length === 1) {
      return reqestedProduct[0].title;
    }
  }
}

const createProductPage = async (main, document, param, url) => {
  const product = main.querySelector('product-page');
  if (product) {
    const title = document.createElement('h1');
    title.textContent = await getProductTitle(url);
    const btnText = product.getAttribute('rfqbuttontext');
    const productCells = [
      ['Product Hero'],
      [title],
      [btnText],
    ];

    if (btnText) {
      const block = WebImporter.DOMUtils.createTable(productCells, document);
      product.append(block, document.createElement('hr'));
    }

    const tabs = JSON.parse(product.getAttribute('producttabs'));
    tabs.forEach((tab, i, arr) => {
      const sectionCells = [['Section Metadata'], ['tabIcon', tab.icon], ['tabName', tab.tabName]];
      const attributeCells = [];
      const template = product.querySelector(`template[v-slot:${tab.tabId}]`);
      const tabConfig = TABS_MAPPING.find((m) => m.id.toLowerCase() === tab.tabId.toLowerCase());
      sectionName = tabConfig.sectionName;

      if (tab.tabId === 'specification' && tabConfig.sectionName) {
        const attributes = JSON.parse(product.getAttribute('attributes'));
        attributeCells.push([tabConfig.sectionName]);
        attributes.forEach((attribute) => {
          attributeCells.push([attribute.attributeLabel]);
        });
        const attributeTable = WebImporter.DOMUtils.createTable(attributeCells, document);
        main.append(attributeTable);
      } else if (tabConfig.sectionName && tab.tabId !== 'citations') {
        const block = WebImporter.DOMUtils.createTable([[tabConfig.sectionName], ['']], document);
        main.append(block);
      }

      if (template.content.childNodes.length > 1) {
        const elementsArray = Array.from(template.content.childNodes);
        elementsArray.forEach((element) => {
          if (element.outerHTML) {
            if (element.className === 'container-fullwidth') {
              const childArray = Array.from(element.querySelector('fulllayout > div > div > div').children);
              childArray.forEach((item) => {
                render(main, item, document);
              });
            } else {
              render(main, element, document);
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

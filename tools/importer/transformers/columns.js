import {
  featureImage, imageText, getHeading, getAEMHeading,
} from './util.js';
/* global WebImporter */

const render = {
  featureimage: (item, row, document) => {
    const featureImages = (item.content) ? item.content.querySelectorAll('div.featureimage') : [item];
    featureImages.forEach((featureImageEL) => {
      if (featureImageEL?.firstElementChild?.localName === 'feature-image') {
        featureImage(featureImageEL, document);
        WebImporter.DOMUtils.remove(featureImageEL, ['feature-image']);
      }
      if (featureImageEL) {
        row.push(featureImageEL);
      }
    });
    return row;
  },

  imagetext: (item, row, document) => {
    const imageTextEl = item.content
      ? imageText(item.content, document)
      : imageText(item, document);
    if (imageTextEl) {
      row.push(imageTextEl);
    }
  },

  heading: (item, row, document) => {
    const heading = item.content ? item.content.querySelector('div.heading') : item;
    if (heading) {
      const headingEL = getHeading(heading, document);
      row.push(headingEL);
    }
  },

  'heading-aem': (item, row, document) => {
    const aemHeading = (item.content) ? item.content.querySelector('div.heading-aem') : item;
    if (aemHeading) {
      const aemHeadingEL = getAEMHeading(aemHeading, document);
      row.push(aemHeadingEL);
    }
  },

  script: (template, row) => {
    const featureImageEl = template.content.querySelector('div.featureimage');
    if (featureImageEl) {
      row.push(featureImageEl);
    }
  },
};

const createAllColumns = (allColumns, document, noOfColumn) => {
  allColumns.forEach((item) => {
    const columns = [];
    let blockName = '';
    if (item?.getAttribute('itemscenter')) {
      if (noOfColumn === 3) blockName = 'Columns (itemscenter, cols-3)';
      else blockName = 'Columns (itemscenter)';
    } else if (noOfColumn === 3) blockName = 'Columns (cols-3)';
    else blockName = 'Columns';

    const templates = item.querySelectorAll('template');
    [...templates].forEach((template) => {
      if (template.content.children.length > 0) {
        const row = [];
        [...template.content.children].forEach((element) => {
          if (element.className === 'container responsivegrid') {
            const container = template.content.querySelector('div.cmp-container');
            if (container) {
              const match = blockName.match(/Columns\s*\(\s*([^)]*)\s*\)/);
              if (match) {
                const contentInsideParentheses = match[1];
                const updatedString = `Columns (${contentInsideParentheses}, ${container.id})`;
                blockName = updatedString;
              } else {
                const updatedString = `Columns (${container.id})`;
                blockName = updatedString;
              }
              [...container.children].forEach((childItem) => {
                render[childItem.className](childItem, row, document);
              });
            }
          } else if (element.className === 'script') {
            const featureImageElem = template.content.querySelector('div.featureimage');

            if (featureImageElem) {
              row.push(featureImageElem);
            }
          } else if (element.className === 'text') {
            const text = template.content.querySelector('div.text');
            if (text) row.push(text);
          } else if (element.className !== 'articlecard') {
            render[element.className](template, row, document);
          }
        });
        columns.push(row);
      }
    });
    const cells = [
      [blockName],
      [...columns],
    ];

    if (columns.flat(1).length > 0) {
      const block = WebImporter.DOMUtils.createTable(cells, document);
      item.append(block);
    }
  });
};

const createColumn = (main, document) => {
  const twoColumn = main.querySelectorAll('grid[columns="2"]');
  const threerColumn = main.querySelectorAll('grid[columns="3"]');
  if (twoColumn) createAllColumns(twoColumn, document);
  if (threerColumn) createAllColumns(threerColumn, document, 3);
};
export default createColumn;

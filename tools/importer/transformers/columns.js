import { render } from './util.js';
/* global WebImporter */

const updateBlockName = (blockName, option) => {
  const match = blockName.match(/Columns\s*\(\s*([^)]*)\s*\)/);
  let bName;
  if (match) {
    const contentInsideParentheses = match[1];
    const updatedString = `Columns (${contentInsideParentheses}, ${option})`;
    bName = updatedString;
  } else {
    const updatedString = `Columns (${option})`;
    bName = updatedString;
  }
  return bName;
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
              blockName = updateBlockName(blockName, container.id);
              [...container.children].forEach((childItem) => {
                render[childItem.className](childItem, row, document);
              });
            }
          } else if (element.className === 'grid') {
            const gridEl = element.querySelector('grid');
            const gridTemplates = gridEl.querySelectorAll('template');
            [...gridTemplates].forEach((gridTemplate) => {
              [...gridTemplate.content.children].forEach((gridElement) => {
                render[gridElement.className](gridElement, row, document);
              });
            });
          } else if (element.className !== 'articlecard') {
            render[element.className](element, row, document);
          }
        });
        columns.push(row);
      }
    });
    const cells = [
      [blockName],
      columns,
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

import { mapTable } from './util.js';

const createTable = (main, document) => {
  main.querySelectorAll('table').forEach((table) => {
    mapTable(table, document);
  });
};
export default createTable;

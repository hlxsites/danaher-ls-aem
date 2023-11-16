/*
 * Table Block
 */

import {
  table, tbody, td, thead, tr, th,
} from '../../scripts/dom-builder.js';

function buildCell(rowIndex) {
  const cell = rowIndex ? td({ class: 'text-left text-gray-900 p-2' }) : th({ class: 'text-left text-gray-900 font-bold p-2' });
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  const t = table({
    class: 'table-auto w-full max-w-full',
    cellpadding: 1,
    cellspacing: 0,
    border: 1,
  });
  const head = thead();
  const body = tbody({ class: 'divide-y divide-gray-200' });
  t.append(head, body);
  [...block.children].forEach((child, i) => {
    const row = tr();
    if (i) body.append(row);
    else {
      row.classList.add(...'border-b border-b-gray-200'.split(' '));
      head.append(row);
    }
    [...child.children].forEach((col) => {
      const cell = buildCell(i);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.classList.add('w-full', 'overflow-x-auto');
  block.append(t);
}

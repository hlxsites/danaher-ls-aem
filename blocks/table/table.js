/*
 * Table Block
 */

import { table, tbody, td, thead, tr, th } from '../../scripts/dom-builder.js';

function buildCell(rowIndex) {
  const cell = rowIndex ? td({ class: 'text-left text-gray-900' }) : th({ class: 'text-left text-gray-900 font-normal' });
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  const t = table({
    class: 'w-full max-w-full',
    cellpadding: 1,
    cellspacing: 0,
    border: 1,
  });
  const head = thead();
  const body = tbody();
  t.append(head, body);
  [...block.children].forEach((child, i) => {
    const row = tr();
    if (i) body.append(row);
    else head.append(row);
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

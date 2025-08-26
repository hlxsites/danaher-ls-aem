/* eslint-disable no-console */

/* eslint-disable no-cond-assign */

/* eslint-disable import/prefer-default-export */

/**

 * 1) Groups consecutive [data-richtext-prop] nodes into a single wrapper DIV

 * 2) Marks wrapper as Universal Editor richtext: data-aue-type="richtext"

 * 3) Enhances each wrapper with minimal table tools (no external deps)

 */

export function decorateRichtext(container = document) {

  function deleteInstrumentation(element) {

    delete element.dataset.richtextResource;

    delete element.dataset.richtextProp;

    delete element.dataset.richtextFilter;

    delete element.dataset.richtextLabel;

  }

  let element;

  while ((element = container.querySelector('[data-richtext-prop]:not(div)'))) {

    const {

      richtextResource,

      richtextProp,

      richtextFilter,

      richtextLabel,

    } = element.dataset;

    deleteInstrumentation(element);

    // collect consecutive siblings belonging to the same richtext prop/resource

    const siblings = [];

    let sibling = element;

    while ((sibling = sibling.nextElementSibling)) {

      if (

        sibling.dataset.richtextResource === richtextResource &&

        sibling.dataset.richtextProp === richtextProp

      ) {

        deleteInstrumentation(sibling);

        siblings.push(sibling);

      } else break;

    }

    // Orphans (same prop/resource but not consecutive) -> warn & de-instrument

    let orphanElements;

    if (richtextResource && richtextProp) {

      orphanElements = document.querySelectorAll(

        `[data-richtext-id="${richtextResource}"][data-richtext-prop="${richtextProp}"]`

      );

    } else {

      const editable = element.closest('[data-aue-resource]');

      if (editable) {

        orphanElements = editable.querySelectorAll(

          `:scope > :not([data-aue-resource]) [data-richtext-prop="${richtextProp}"]`

        );

      } else {

        console.warn(`Editable parent not found or richtext property ${richtextProp}`);

        return;

      }

    }

    if (orphanElements && orphanElements.length) {

      console.warn(

        'Found orphan elements of a richtext that were not consecutive siblings of the first paragraph',

        orphanElements

      );

      orphanElements.forEach((orphanElement) => deleteInstrumentation(orphanElement));

    } else {

      const group = document.createElement('div');

      // Universal Editor annotations

      if (richtextResource) {

        group.dataset.aueResource = richtextResource;

        group.dataset.aueBehavior = 'component';

      }

      if (richtextProp) group.dataset.aueProp = richtextProp;

      if (richtextLabel) group.dataset.aueLabel = richtextLabel;

      // IMPORTANT: keep existing filter if present; otherwise add one that allows tables

      // If your pipeline has a sanitizer hooked to filters, make sure "richtext+table"

      // whitelists: table, thead, tbody, tr, th, td and attrs (rowspan/colspan/scope).

      group.dataset.aueFilter = richtextFilter || 'richtext+table';

      group.dataset.aueType = 'richtext';

      // make the group behave like your RTE root

      group.classList.add('rte');

      group.setAttribute('contenteditable', 'true');

      element.replaceWith(group);

      group.append(element, ...siblings);

      // Enhance this wrapper with table tools

      ensureRteToolbar(group);

      enhanceRTEWithTables(group);

    }

  }

}

// Observe late-added richtext nodes

const observer = new MutationObserver(() => decorateRichtext());

observer.observe(document, { attributeFilter: ['data-richtext-prop'], subtree: true });

// Initial pass

decorateRichtext();

/* --------------------------- RTE helpers below --------------------------- */

/**

 * Ensure there is a toolbar container inside the RTE wrapper.

 * If your project already injects a toolbar, tweak the selector below.

 */

function ensureRteToolbar(root) {

  if (!root.querySelector('.rte-toolbar')) {

    const bar = document.createElement('div');

    bar.className = 'rte-toolbar';

    // Keep toolbar outside the editable surface

    root.insertAdjacentElement('beforebegin', bar);

  }

}

/**

 * Minimal table tools for a contenteditable RTE (no external libs)

 * Buttons:

 *  - Insert Table (2x2)

 *  - Add/Delete Row

 *  - Add/Delete Column

 *  - Delete Table

 */

export function enhanceRTEWithTables(root) {

  const toolbar =

    root.previousElementSibling?.classList.contains('rte-toolbar')

      ? root.previousElementSibling

      : root.querySelector('.rte-toolbar');

  const editor = root; // wrapper is contenteditable

  if (!toolbar || !editor || editor.getAttribute('data-rte-table-enhanced') === 'true') return;

  editor.setAttribute('data-rte-table-enhanced', 'true');

  // ---- Helpers ----

  const getSelectionCell = () => {

    const sel = document.getSelection();

    if (!sel || sel.rangeCount === 0) return null;

    const node = sel.anchorNode;

    return node ? (node.nodeType === 1 ? node : node.parentElement)?.closest('td,th') : null;

  };

  const getTableContext = () => {

    const cell = getSelectionCell();

    if (!cell) return {};

    const row = cell.parentElement;

    const table = cell.closest('table');

    const section = row?.parentElement; // thead/tbody

    const cellIndex = Array.from(row.children).indexOf(cell);

    const rowIndex = Array.from(section.children).indexOf(row);

    return { table, section, row, cell, cellIndex, rowIndex };

  };

  const insertTable = (rows = 2, cols = 2) => {

    const table = document.createElement('table');

    const tbody = document.createElement('tbody');

    for (let r = 0; r < rows; r++) {

      const tr = document.createElement('tr');

      for (let c = 0; c < cols; c++) {

        const td = document.createElement('td');

        td.appendChild(document.createElement('p'));

        tr.appendChild(td);

      }

      tbody.appendChild(tr);

    }

    table.appendChild(tbody);

    const sel = document.getSelection();

    if (sel && sel.rangeCount > 0) {

      const range = sel.getRangeAt(0);

      range.deleteContents();

      range.insertNode(table);

      // caret into first cell

      const firstCell = table.querySelector('td,th');

      if (firstCell) {

        const p = firstCell.querySelector('p') || firstCell;

        const r = document.createRange();

        r.setStart(p, 0);

        r.collapse(true);

        sel.removeAllRanges();

        sel.addRange(r);

      }

    } else {

      editor.appendChild(table);

    }

  };

  const addRow = (after = true) => {

    const { row, section } = getTableContext();

    if (!row || !section) return;

    const newRow = row.cloneNode(true);

    newRow.querySelectorAll('td,th').forEach((cell) => {

      cell.innerHTML = '<p></p>';

    });

    after ? row.after(newRow) : row.before(newRow);

  };

  const deleteRow = () => {

    const { row, table } = getTableContext();

    if (!row || !table) return;

    const section = row.parentElement;

    row.remove();

    if (section && section.children.length === 0) table.remove();

  };

  const addCol = (after = true) => {

    const { cell, table, cellIndex } = getTableContext();

    if (!cell || !table) return;

    const sections = table.querySelectorAll('thead,tbody,tfoot');

    (sections.length ? sections : [table]).forEach((sec) => {

      sec.querySelectorAll('tr').forEach((tr) => {

        const ref = tr.children[cellIndex] || tr.lastElementChild;

        const newCell = document.createElement(

          ref?.tagName?.toLowerCase() === 'th' ? 'th' : 'td'

        );

        newCell.innerHTML = '<p></p>';

        after ? ref.after(newCell) : ref.before(newCell);

      });

    });

  };

  const deleteCol = () => {

    const { table, cellIndex } = getTableContext();

    if (!table || cellIndex == null) return;

    table.querySelectorAll('tr').forEach((tr) => {

      const target = tr.children[cellIndex];

      if (target) target.remove();

    });

    const firstRow = table.querySelector('tr');

    if (!firstRow || firstRow.children.length === 0) table.remove();

  };

  const deleteTable = () => {

    const { table } = getTableContext();

    if (table) table.remove();

  };

  // ---- UI Buttons ----

  const btn = (label, title, onClick) => {

    const b = document.createElement('button');

    b.type = 'button';

    b.className = 'rte-btn';

    b.textContent = label;

    b.title = title;

    b.addEventListener('click', (e) => {

      e.preventDefault();

      editor.focus();

      onClick();

    });

    return b;

  };

  const group = document.createElement('div');

  group.className = 'rte-group';

  group.append(

    btn('▦', 'Insert Table (2x2)', () => insertTable(2, 2)),

    btn('+R', 'Add Row After', () => addRow(true)),

    btn('−R', 'Delete Row', () => deleteRow()),

    btn('+C', 'Add Column After', () => addCol(true)),

    btn('−C', 'Delete Column', () => deleteCol()),

    btn('🗑︎T', 'Delete Table', () => deleteTable())

  );

  toolbar.appendChild(group);
}

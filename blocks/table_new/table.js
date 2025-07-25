import { applyClasses, moveInstrumentation } from '../../scripts/scripts.js';
import { table, tbody, td, th, thead, tr, input, div, label } from '../../scripts/dom-builder.js';
import { decorateIcons, fetchLocalizedPlaceholders } from '../../scripts/aem.js';
import { buildFAQSchema } from '../../scripts/schema.js';

const placeholders = await fetchLocalizedPlaceholders('/eds');
function handleSearch(event, tableEl) {
  event.preventDefault();
  let { value } = event.target;
  value = value.trim();
  const bodyEl = tableEl.querySelector('tbody');
  const filter = value.toLowerCase();
  [...bodyEl.children].forEach((row) => {
    if (!row.textContent.toLowerCase().includes(filter) && value !== '') row.classList.add('hidden');
    else {
      row.classList.remove('hidden');
    }
  });
}

/**
 *
 * @param {Element} block
 */
export default async function decorate(block) {
  const tableEl = table({ class: 'table-auto w-full' });
  const filterEl = input({
    id: 'search-filter',
    type: 'search',
    name: 'modification',
    placeholder: placeholders.tableSearchhere,
    value: '',
    onkeyup: (event) => handleSearch(event, tableEl),
    onsearch: (event) => handleSearch(event, tableEl),
    class: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5',
  });
  const formEl = div(
    { class: 'w-max md:2/5 lg:w-1/4 space-y-1 mb-2' },
    label(
      { for: 'modification', class: 'text-sm font-semibold leading-5 text-slate-400' },
      placeholders.tableEntermodification,
    ),
    filterEl,
  );
  const tblHead = thead();
  const tblBody = tbody();
  const header = !block.classList.contains('no-header');
  const searchFilter = block.classList.contains('search-filter');

  [...block.children].forEach((row, i) => {
    const tblRow = tr();
    moveInstrumentation(row, tblRow);

    [...row.children].forEach((cell) => {
      const tblData = i === 0 && header ? th() : td();
      applyClasses(tblData, 'p-4');
      if (i === 0) tblData.setAttribute('scope', 'column');
      tblData.innerHTML = cell.innerHTML;
      applyClasses(tblData, 'border-t border-[#273F3F] border-opacity-25 text-left');
      tblData.querySelectorAll('a').forEach((aEl) => {
        applyClasses(aEl, 'text-[#378189] underline');
      });
      tblRow.append(tblData);
    });
    if (i === 0 && header) tblHead.append(tblRow);
    else tblBody.append(tblRow);
  });
  tableEl.append(tblHead, tblBody);
  if (searchFilter) block.parentElement.insertBefore(formEl, block);
  block.replaceChildren(tableEl);
  block.classList.remove('table');
  block.classList.add(...'relative overflow-x-auto'.split(' '));
  decorateIcons(block, 20, 20);

  // Add FAQ schema for troubleshooting pages
  if (window.location.pathname.includes('/troubleshooting/')) {
    const faqObj = window?.faqObj || [];

    const question = block.parentNode.previousSibling.querySelector('h2').innerText || '';
    faqObj.push({ question: question, answer: tblBody.innerText });

    window.faqObj = faqObj;

    const questionsLength = document.querySelectorAll('.default-content-wrapper > h2').length;
    if (questionsLength === window.faqObj.length) {
      buildFAQSchema(faqObj);
    }
  }
}
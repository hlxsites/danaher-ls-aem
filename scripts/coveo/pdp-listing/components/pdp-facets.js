/* eslint-disable */
import {
  productTypeFacetController,
  brandFacetController,
  documentTypeFacetController,
} from '../controllers/pdp-controllers.js';
import { createFiltersPanel } from './pdp-side-panel.js';
import { renderFacetBreadcurm } from './pdp-facet-breadcrumb.js';

export function renderCreateFacet() {
  const container = document.getElementById('filters-container');
  container.innerHTML = '';
  // === Main Filters Row ===
  const mainRow = document.createElement('div');
  mainRow.className = 'flex items-center gap-2 bg-white';

  // All Filters button
  const allFiltersBtn = document.createElement('button');
  allFiltersBtn.className = 'flex items-center gap-1 border px-3 py-[12px] rounded hover:bg-gray-100 text-gray-500 text-sm leading-5 font-normal font-twk';
  allFiltersBtn.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8.0013 3.99999V2.66666M8.0013 3.99999C7.26492 3.99999 6.66797 4.59694 6.66797 5.33332C6.66797 6.0697 7.26492 6.66666 8.0013 6.66666M8.0013 3.99999C8.73768 3.99999 9.33464 4.59694 9.33464 5.33332C9.33464 6.0697 8.73768 6.66666 8.0013 6.66666M4.0013 12C4.73768 12 5.33464 11.403 5.33464 10.6667C5.33464 9.93028 4.73768 9.33332 4.0013 9.33332M4.0013 12C3.26492 12 2.66797 11.403 2.66797 10.6667C2.66797 9.93028 3.26492 9.33332 4.0013 9.33332M4.0013 12V13.3333M4.0013 9.33332V2.66666M8.0013 6.66666V13.3333M12.0013 12C12.7377 12 13.3346 11.403 13.3346 10.6667C13.3346 9.93028 12.7377 9.33332 12.0013 9.33332M12.0013 12C11.2649 12 10.668 11.403 10.668 10.6667C10.668 9.93028 11.2649 9.33332 12.0013 9.33332M12.0013 12V13.3333M12.0013 9.33332V2.66666" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg></span> All Filters`;
  allFiltersBtn.id = 'openFiltersBtn';

  allFiltersBtn.addEventListener('click', async () => {
    let panel = document.getElementById('filtersPanel');

    if (!panel) {
      panel = createFiltersPanel();
      renderFacetBreadcurm();
    }

    let modalOverlay = document.getElementById('modalOverlay');
    panel.style.transform = 'translateX(0)';
    modalOverlay.classList.remove('hidden');
  });

  mainRow.appendChild(allFiltersBtn);

  // Create and append selects

  function createCustomDropdown(controller, placeholderText) {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'relative inline-block';

    // Button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'w-full border border-danahergray-300 bg-danahergray-100 px-3 py-[12px] rounded text-left focus:outline-none flex justify-between items-center gap-1 text-gray-500 text-sm leading-5 font-normal font-twk';

    const labelSpan = document.createElement('span');
    labelSpan.textContent = placeholderText;
    button.appendChild(labelSpan);

    const chevron = document.createElement('span');
    chevron.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12.6654 6L7.9987 10.6667L3.33203 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    button.appendChild(chevron);

    // Dropdown Menu
    const menu = document.createElement('ul');
    menu.className = 'absolute z-10 mt-1 bg-white border border-gray-200 rounded shadow max-h-60 overflow-y-auto hidden';

    function rebuildMenu() {
    // Clear existing options
      menu.innerHTML = '';

      const { values } = controller.state;

      values.forEach((item) => {
        const option = document.createElement('li');
        option.textContent = item.label || item.value;
        option.className = 'px-3 py-[12px] hover:bg-gray-100 cursor-pointer text-black text-sm leading-5 font-normal font-twk';

        if (item.state === 'selected') {
          labelSpan.textContent = item.label || item.value;
        }

        option.addEventListener('click', () => {
          controller.toggleSelect(item);
          menu.classList.add('hidden');
          // Delay update to allow controller to re-render state
          setTimeout(rebuildMenu, 100);
        });

        menu.appendChild(option);
      });
    }

    // Initial build
    rebuildMenu();

    button.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!dropdownContainer.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });

    dropdownContainer.appendChild(button);
    dropdownContainer.appendChild(menu);
    return dropdownContainer;
  }

  mainRow.appendChild(createCustomDropdown(productTypeFacetController, 'Product Type'));
  mainRow.appendChild(createCustomDropdown(brandFacetController, 'Brand'));
  mainRow.appendChild(createCustomDropdown(documentTypeFacetController, 'Document Type'));

  // Search box
  const search = document.createElement('input');
  search.type = 'text';
  search.placeholder = 'Search by product name';
  search.className = 'border px-3 py-[12px] rounded flex-1 text-sm bg-gray-100';
  mainRow.appendChild(search);

  // Append both rows
  container.appendChild(mainRow);
}

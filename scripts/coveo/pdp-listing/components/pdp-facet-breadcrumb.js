/* eslint-disable */
import { facetBreadcrumb } from '../controllers/pdp-controllers.js';

export const renderFacetBreadcurm = () => {
  const facetBreadcrumbElement = document.getElementById('facet-breadcrumb');
  if (!facetBreadcrumbElement) return;

  // Clear previous content
  facetBreadcrumbElement.innerHTML = '';

  // Create wrapper div
  const container = document.createElement('div');
  container.className = 'max-w-6xl mx-auto flex justify-start gap-3 flex-wrap min-h-[28px]';

  const filters = [];

  facetBreadcrumb.state.facetBreadcrumbs.forEach((facet) => {
    facet.values.forEach((item) => {
      let fieldName = facet.field;

      if (facet.field === 'categoriesname') {
        fieldName = 'Product Type';
      } else if (facet.field === 'opco') {
        fieldName = 'Brand';
      } else if (facet.field === 'documenttype') {
        fieldName = 'Document Type';
      }

      const displayText = item.value.value === 'binarydata' ? 'eCommerce' : item.value.value;

      // Create filter tag
      const filterTag = document.createElement('div');
      filterTag.className = 'bg-danaherpurple-50 px-2 py-1 rounded-[6px] flex items-center text-sm text-purple-700 font-medium gap-2';

      const label = document.createElement('span');
      label.textContent = `${fieldName}: ${displayText}`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'text-purple-500 hover:text-purple-700 focus:outline-none text-lg font-bold';
      removeBtn.title = 'Remove filter';
      removeBtn.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <g clip-path="url(#clip0_37271_76180)">
          <path d="M11.2313 1.03137L1.03125 11.2314M1.03125 1.03137L11.2313 11.2314" stroke="#7523FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_37271_76180">
            <rect width="12" height="12" fill="white"/>
          </clipPath>
        </defs>
      </svg><span/>`;
      removeBtn.addEventListener('click', () => item.deselect());

      filterTag.appendChild(label);
      filterTag.appendChild(removeBtn);

      filters.push(filterTag);
    });
  });

  if (filters.length === 0) {
    facetBreadcrumbElement.classList.add('hidden');
    return;
  }
  facetBreadcrumbElement.classList.remove('hidden');

  filters.forEach((el) => container.appendChild(el));

  const clearAllBtn = document.createElement('button');
  clearAllBtn.className = 'text-black text-sm leading-4 font-medium font-inter flex items-center gap-2 px-3 py-1';
  clearAllBtn.textContent = 'Clear Results';
  clearAllBtn.innerHTML = `<span class="bg-danaherpurple-500 rounded-full p-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3.5 10.5L10.5 3.5M3.5 3.5L10.5 10.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg></span> <span>Clear Results</span>`;
  clearAllBtn.addEventListener('click', () => {
    facetBreadcrumb.deselectAll();
  });

  container.appendChild(clearAllBtn);

  // ✅ Append to both locations
  facetBreadcrumbElement.appendChild(container);
};

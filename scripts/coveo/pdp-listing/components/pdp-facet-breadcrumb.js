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
    createFacetBreadcurmb(facet.values, facet);
  });

  facetBreadcrumb.state.categoryFacetBreadcrumbs.forEach((facet) =>{
    createFacetBreadcurmb(facet.path, facet, true)
  });

  function createFacetBreadcurmb(values, facet, isCategoryFacet = false) {
    let filteredValues = values;

    if (isCategoryFacet) {
      filteredValues = [values.reduce((deepest, current) => {
        return current.path.length > deepest.path.length ? current : deepest;
      })];
    }

    filteredValues.forEach((item) => {
      let fieldName = facet.field;

      if (facet.field === 'categoriesname') {
        fieldName = 'Product Type';
      } else if (facet.field === 'opco') {
        fieldName = 'Brand';
      } else if (facet.field === 'documenttype') {
        fieldName = 'Document Type';
      }

      const displayText = isCategoryFacet
        ? item.path.join(' / ')
        : item.value.value;

      const filterTag = document.createElement('div');
      filterTag.className = 'bg-danaherpurple-50 px-2 py-1 rounded-[6px] flex items-center text-sm text-purple-700 font-medium gap-2';

      const label = document.createElement('span');
      label.textContent = `${fieldName}: ${displayText}`;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'text-purple-500 hover:text-purple-700 focus:outline-none text-lg font-bold';
      removeBtn.title = 'Remove filter';
      removeBtn.innerHTML = `<span><img src="/icons/x-pdp.svg" alt="arrow icon" width="20" height="21" /> </span><span/>`;

      if (isCategoryFacet) {
        removeBtn.addEventListener('click', () => facet.deselect());
      } else {
        removeBtn.addEventListener('click', () => item.deselect());
      }

      filterTag.appendChild(label);
      filterTag.appendChild(removeBtn);

      filters.push(filterTag);
    });
  }

  if (filters.length === 0) {
    facetBreadcrumbElement.classList.add('hidden');
    return;
  }
  facetBreadcrumbElement.classList.remove('hidden');

  filters.forEach((el) => container.appendChild(el));

  const clearAllBtn = document.createElement('button');
  clearAllBtn.className = 'text-black text-sm leading-4 font-medium font-inter flex items-center gap-2 px-3 py-1';
  clearAllBtn.textContent = 'Clear Results';
  clearAllBtn.innerHTML = `<img src="/icons/step-close.svg" alt="arrow icon" width="20" height="21" /> <span>Clear Results</span>`;
  clearAllBtn.addEventListener('click', () => {
    facetBreadcrumb.deselectAll();
  });

  container.appendChild(clearAllBtn);

  // ✅ Append to both locations
  facetBreadcrumbElement.appendChild(container);
};

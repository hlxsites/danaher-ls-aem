import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  div, span, button, fieldset, ul, li, input,
} from '../../scripts/dom-builder.js';

function filterButtonClick(e) {
  e.preventDefault();
  const buttonEl = e.target.closest('button');
  console.log(buttonEl.part.value);
  console.log(buttonEl.dataset.type);
  buttonEl.setAttribute('aria-pressed', buttonEl.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  console.log(buttonEl.getAttribute('aria-pressed'));
  const icon = buttonEl.querySelector('span.icon');
  icon?.classList.toggle('icon-square');
  icon?.classList.toggle('icon-check-square');
  decorateIcons(buttonEl);
}

function facetButtonClick(e) {
  e.preventDefault();
  e.target.setAttribute('aria-expanded', e.target.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  const parentElement = e.target.closest('div.button');
  const contents = parentElement.querySelector('.contents');
  const searchWrapper = parentElement.querySelector('.search-wrapper');
  const icon = parentElement.querySelector('.icon');

  icon.classList.toggle('icon-dash');
  icon.classList.toggle('icon-plus');
  contents.classList.toggle('hidden');
  searchWrapper?.classList.toggle('hidden');
}

function addFilter(filter, processStepList) {
  filter.values.forEach((element) => {
    processStepList.append(li(
      { class: 'flex flex-row items-center space-x-2' },
      button(
        {
          class: `${filter.facetId} btn-text-neutral group w-full flex items-center px-2 py-2.5 text-left truncate no-outline space-x-2`,
          part: element.value,
          'data-type': filter.facetId,
          'aria-label': 'Inclusion filter',
          'aria-pressed': 'false',
          onclick: (e) => {
            filterButtonClick(e);
          },
        },
        span({ part: 'value-label', class: 'value-label truncate peer-hover:text-error' }, element.value),
        span({ part: 'value-count', class: 'value-count' }, `( ${element.numberOfResults} )`),
      ),
    ));
    const opco = processStepList.querySelector('.opco');
    opco?.insertBefore(span({ class: 'icon icon-square pr-2' }), opco.firstChild);
  });
}

function addSearch(facetsObj) {
  facetsObj.querySelector('.label-button').textContent = 'Process Step';
  facetsObj.querySelector('.btn-text-transparent').after(div(
    { class: 'search-wrapper px-2 mt-3', part: 'search-wrapper' },
    div(
      { class: 'relative h-10' },
      input({
        part: 'search-input',
        class: 'input-primary w-full h-full px-9 placeholder-neutral-dark text-sm group border border-neutral rounded-lg',
        type: 'text',
        placeholder: 'Search',
        'aria-label': 'Search for values in the Process Step facet',
      }),
      div(
        { class: 'search-icon pointer-events-none absolute inline-flex justify-center items-center left-0 w-9 h-full text-on-background' },
        span({ class: 'icon icon-search' }),
      ),
    ),
  ));
}

function addFacetHeading(facetsObj, name) {
  facetsObj.append(button(
    {
      class: 'btn-text-transparent flex font-bold justify-between w-full py-1 px-2 text-lg rounded-none',
      title: 'Collapse the facet',
      'aria-expanded': 'true',
      onclick: (e) => {
        facetButtonClick(e);
        decorateIcons(facetsObj);
      },
      part: 'label-button',
    },
    div({ class: 'label-button truncate' }, name),
    span({ class: 'icon icon-dash' }),
  ));
  facetsObj.append(fieldset(
    { class: 'contents' },
    ul({ part: 'values', class: 'process-step-list mt-3' }),
  ));
}

function facets(response, facetDiv) {
  const name = 'Brand';
  response.facets.forEach((filter) => {
    if (filter.values.length === 0) return;
    const facetsObj = div({ class: 'button bg-background border border-neutral rounded-lg p-4 mt-4' });
    addFacetHeading(facetsObj, name);

    if (filter.facetId === 'workflowname') {
      addSearch(facetsObj);
    }

    const processStepList = facetsObj.querySelector('.process-step-list');
    addFilter(filter, processStepList);

    facetDiv.append(facetsObj);
  });
  decorateIcons(facetDiv);
  return facetDiv;
}
export default facets;

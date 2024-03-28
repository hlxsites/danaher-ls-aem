import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  div, span, button, fieldset, ul, li, input,
} from '../../scripts/dom-builder.js';

function facets(response, facetDiv) {
  const name = 'Brand';
  response.facets.forEach((filter) => {
    if (filter.values.length === 0) return;
    const facets = div(
      { class: 'bg-background border border-neutral rounded-lg p-4 mt-4' },
      button(
        {
          class: 'btn-text-transparent flex font-bold justify-between w-full py-1 px-2 text-lg rounded-none',
          title: 'Collapse the facet',
          'aria-expanded': 'true',
          onclick: (e) => {
            e.preventDefault();
            if (e.target.parentElement.tagName === 'BUTTON') {
              e.target.parentElement.parentElement.querySelector('.contents').classList.toggle('hidden');
              e.target.parentElement.parentElement.querySelector('.search-wrapper')?.classList.toggle('hidden');
            } else {
              e.target.parentElement.querySelector('.contents').classList.toggle('hidden');
              e.target.parentElement.querySelector('.search-wrapper')?.classList.toggle('hidden');
            }
          },
          part: 'label-button',
        },
        div({ class: 'label-button truncate' }, name),
      ),
      fieldset(
        { class: 'contents' },
        ul({ part: 'values', class: 'process-step-list mt-3' }),
      ),
    );

    if (filter.facetId === 'workflowname') {
      facets.querySelector('.label-button').textContent = 'Process Step';
      facets.querySelector('.btn-text-transparent').after(div(
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
    decorateIcons(facets);
    const processStepList = facets.querySelector('.process-step-list');
    filter.values.forEach((element) => {
      processStepList.append(li(
        button(
          {
            class: 'btn-text-neutral group w-full flex items-center px-2 py-2.5 text-left truncate no-outline space-x-2',
            part: 'value-link node-value',
            'aria-label': 'Inclusion filter',
            'aria-pressed': 'false',
          },
          span({ part: 'value-label', class: 'value-label truncate peer-hover:text-error' }, element.value),
          span({ part: 'value-count', class: 'value-count' }, `( ${element.numberOfResults} )`),
        ),
      ));
    });
    facetDiv.append(facets);
  });
  return facetDiv;
}
export default facets;

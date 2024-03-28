/* eslint-disable import/no-unresolved */
import { getProductsForCategories } from '../../scripts/commerce.js';
import { decorateIcons, getMetadata } from '../../scripts/lib-franklin.js';
import {
  button, div, fieldset, input, ul, li, span, a, img, p,
} from '../../scripts/dom-builder.js';

const categoryFamily = div(
  { class: 'coveo-skeleton flex flex-col lg:flex-row grid-rows-1 lg:grid-cols-5 gap-x-10 gap-y-4' },
  div(
    { class: 'col-span-1 border shadow rounded-lg w-full p-4 max-w-sm w-full' },
    div(
      { class: 'flex flex-col gap-y-4 animate-pulse' },
      div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
      div({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
      div({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
      div({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
    ),
  ),
  div(
    { class: 'col-span-4 w-full' },
    div({ class: 'max-w-xs bg-neutral-300 rounded-md p-4 animate-pulse mb-4' }),
    div(
      { class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
      div(
        { class: 'flex flex-col gap-y-2 animate-pulse' },
        div({ class: 'h-72 rounded bg-danaheratomicgrey-200 opacity-500' }),
        div({ class: 'w-2/4 h-7 bg-danaheratomicgrey-200 rounded [&:not(:first-child)]:opacity-40' }),
        div(
          { class: 'space-y-1' },
          p({ class: 'w-3/4 h-4 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
          p({ class: 'w-2/5 h-3 bg-danaheratomicgrey-200 rounded [&:not(:first-child):odd]:opacity-20' }),
          p({ class: 'w-4/5 h-5 bg-danaheratomicgrey-200 rounded [&:not(:first-child):even]:opacity-40' }),
        ),
        div(
          { class: 'grid grid-cols-3 gap-4' },
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-2' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
          div({ class: 'h-2 bg-danaheratomicgrey-200 rounded col-span-1' }),
        ),
      ),
    ),
  ),
);

export default async function decorate(block) {
  const category = getMetadata('fullcategory');

  block.classList.add('pt-10');
  block.append(categoryFamily);
  setTimeout(async () => {
    const response = await getProductsForCategories(category);
    const name = 'Brand';
    const facetDiv = div({ class: 'max-w-sm w-full mx-auto' });
    const categoryDiv = div({ class: 'max-w-5xl w-full mx-auto' });
    response.facets.forEach((filter) => {
      if (filter.values.length === 0) return;
      const facets = div(
        { class: 'bg-background border border-neutral rounded-lg p-4 mt-4' },
        button(
          {
            class: 'btn-text-transparent flex font-bold justify-between w-full py-1 px-2 text-lg rounded-none',
            title: 'Collapse the facet',
            'aria-expanded': 'true',
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
          { class: 'px-2 mt-3', part: 'search-wrapper' },
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

    categoryDiv.append(
      div(
        { class: 'status flex flex-row justify-between mt-3' },
        div(
          { class: 'text-on-background space-x-2' },
          'Result  ',
          span({ class: 'font-bold' }, '1'),
          span({ class: 'text-on-background' }, 'of'),
          span({ class: 'font-bold' }, response.totalCount),
        ),
      ),
    );
    categoryDiv.append(
      div(
        { class: 'list-wrapper display-grid density-compact image-small mt-6' },
        div({ class: 'result-list grid grid-cols-1 lg:grid-cols-3 gap-6', part: 'result-list' }),
      ),
    );

    response.results.forEach((product) => {
      const productDiv = div(
        { class: 'w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl' },
        a(
          { href: product.clickUri, target: '_self' },
          div(
            { class: 'result-root display-grid density-compact image-small' },
            div(
              { class: 'relative w-full h-full flex flex-col border rounded-md cursor-pointer transition z-10' },
              div(
                { class: 'py-4' },
                img({
                  class: 'category-image mb-2 h-48 w-full object-cover', src: product.raw.images[0], alt: product.title, loading: 'lazy',
                }),
              ),
              div(
                a({ class: '!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14', href: product.clickUri, target: '_self' }, product.title),
                div({ class: 'description !px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20' }, product.raw.description),
              ),
              div(
                { class: 'inline-flex items-center w-full px-6 py-5 space-x-4 bg-gray-100' },
                span({ class: 'btn-primary-purple border-8 px-2 !rounded-full', 'aria-label': 'View Products' }, 'View Products'),
              ),
            ),
          ),
        ),
      );
      categoryDiv.querySelector('.result-list').append(productDiv);
    });

    block.removeChild(categoryFamily);
    block.classList.add(...'flex flex-col lg:flex-row w-full mx-auto gap-6'.split(' '));
    block.append(facetDiv, categoryDiv);
  }, 1000);
}

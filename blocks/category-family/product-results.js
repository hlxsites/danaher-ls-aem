import {
  div, span, a, img,
} from '../../scripts/dom-builder.js';

function resultList(response, categoryDiv) {
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
              img({
                class: 'category-image mb-2 h-48 w-full object-cover', src: product.raw.images[0], alt: product.title, loading: 'lazy',
              }),
            ),
            div(
              a({ class: '!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14', href: product.clickUri, target: '_self' }, product.title),
              div({ class: 'description !px-7 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20 py-4' }, product.raw.description),
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

  return categoryDiv;
}
export default resultList;

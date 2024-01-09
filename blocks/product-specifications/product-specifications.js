import { div, h1 } from '../../scripts/dom-builder.js';
import { getProductResponse } from '../../scripts/scripts.js';

export default function decorate(block) {
  const response = getProductResponse();
  if (response?.length > 0) {
    const attrContainer = div({ class: 'block' });
    if (response[0]?.raw.attributejson !== undefined) {
      const attrJson = JSON.parse(response[0]?.raw.attributejson);
      if (attrJson.length > 0) {
        attrJson.forEach((item) => {
          const attrWrapper = div({ class: 'attr-wrapper' });
          const tableCaption = div(
            { class: 'sm:flex sm:items-center pt-12' },
            div(
              { class: 'sm:flex-auto' },
              h1({ class: 'text-xl font-normal leading-6 text-black' }, item.label),
            ),
          );
          const tableContainer = div({ class: 'min-w-full mt-2 border divide-y divide-gray-300 rounded-lg' });
          if (item.value.length) {
            item.value.forEach((items) => {
              const tableRow = div(
                { class: 'flex flex-row flex-wrap h-full min-w-full align-middle' },
                div(
                  { class: 'flex w-full p-4 text-sm font-medium text-gray-900 bg-gray-100 md:w-1/3' },
                  div(
                    { class: 'my-auto' },
                    items.label,
                  ),
                ),
                div(
                  { class: 'flex w-full p-4 text-sm text-gray-700 break-words md:w-2/3' },
                  div(
                    { class: 'my-auto' },
                    items.value,
                  ),
                ),
              );
              tableContainer.append(tableRow);
            });
          }
          attrWrapper.append(tableCaption);
          attrWrapper.append(tableContainer);
          attrContainer.append(attrWrapper);
        });
      }
      block.innerHTML = '';
      block.append(attrContainer);
    } else {
      block.innerHTML = '';
      block.append(attrContainer);
    }
  }
}

import { div, h2, } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
block.replaceChildren();
block.id = 'specifications-tab';

 const response = JSON.parse(localStorage.getItem('eds-product-details'));
  if (response !== undefined && response !== null) {
    if (response?.raw.attributejson !== undefined) {
      const attrWrapper = div({ class: 'attr-wrapper' });
      const attrJson = JSON.parse(response?.raw.attributejson);
      attrJson.forEach((item) => {
        const tableCaption = div(
          { class: 'sm:flex sm:items-center pt-12' },
          div(
            { class: 'sm:flex-auto' },
            h2({ class: 'text-xl font-normal leading-6 text-black' }, item.label),
          ),
        );
        const tableContainer = div({ class: 'min-w-full mt-2 border divide-y divide-gray-300 rounded-lg' });
        item.value.forEach((items) => {
          const tableRow = div(
            { class: 'flex flex-row flex-wrap h-full min-w-full align-middle' },
            div(
              { class: 'flex w-full p-4 text-sm font-medium text-gray-900 bg-gray-100 md:w-1/4' },
              div(
                { class: 'my-auto' },
                items.label,
              ),
            ),
            div(
              { class: 'flex w-full p-4 text-sm text-gray-700 break-words md:w-2/4' },
              div(
                { class: 'my-auto' },
                items.value.toString().split(',').join(', '),
              ),
              div(
                { class: 'my-auto px-1' },
                items.unit,
              ),
            ),
          );
          tableContainer.append(tableRow);
        });
        attrWrapper.append(tableCaption);
        attrWrapper.append(tableContainer);
      });
      block.innerHTML = '';
      block.append(attrWrapper);
    }
  }


}

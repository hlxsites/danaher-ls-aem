import { div, p } from '../../scripts/dom-builder.js';
import { extractJsonFromHtml } from '../../scripts/html-to-json-parser.js';

export default async function decorate(block) {
  block.replaceChildren();
  block.id = 'specifications-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  const isPIM = document.querySelector('#authored-specifications')?.children[0].textContent;

  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  let attrJson = ((response !== undefined && response !== null)
  && JSON.parse(response?.raw.attributejson)) ? JSON.parse(response?.raw.attributejson) : [];
  const elem = document.querySelector('#authored-specifications')?.children[3];
  let parsedData;
  if (elem) {
    parsedData = extractJsonFromHtml(elem);
  }
  if (isPIM !== undefined && isPIM === 'only-authored') {
    attrJson = parsedData;
  } else if (isPIM !== undefined && isPIM === 'pim-authored') {
    if (parsedData.length > 0) attrJson.push(...parsedData);
  }

  // if (response !== undefined && response !== null) {
  if (attrJson.length > 0) {
    const attrWrapper = div({ class: 'attr-wrapper' });
    attrJson.forEach((item, index) => {
      const tableCaption = div(
        { class: `sm:flex sm:items-center ${index === 0 ? 'pb-6' : 'py-6'}` },
        div(
          { class: 'sm:flex-auto' },
          p({ class: '!text-xl font-medium leading-6 text-black' }, item.label),
        ),
      );
      const tableContainer = div({ class: 'min-w-full border divide-y divide-gray-300' });
      item.value.forEach((items) => {
        const tableRow = div(
          { class: 'flex flex-row flex-wrap h-full min-w-full align-middle' },
          div(
            { class: 'flex w-full p-4 text-base font-medium text-gray-900 bg-gray-100 md:w-1/4' },
            div(
              { class: 'my-auto' },
              items.label,
            ),
          ),
          div(
            { class: 'flex w-full p-4 text-sm text-black break-words md:w-2/4' },
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
    block.append(div({ class: 'text-2xl text-black py-6' }, 'Specifications'));
    block.append(attrWrapper);
  }
  // }
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

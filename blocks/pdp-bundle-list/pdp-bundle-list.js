import {
  div, p, img,
} from '../../scripts/dom-builder.js';
import { extractJsonFromHtml } from '../../scripts/html-to-json-parser.js';

export default async function decorate(block) {
  block.replaceChildren();
  block.id = 'parts-tab';
  const isPIM = document.querySelector('#authored-parts')?.children[0].textContent;
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  // if (response !== null && response !== undefined && response.raw?.bundlepreviewjson) {
  try {
    let bundleDetails = JSON.parse(response.raw?.bundlepreviewjson) || [];
    const elem = document.querySelector('#authored-parts')?.children[3];
    let parsedData;
    if (elem) {
      parsedData = extractJsonFromHtml(elem);
    }
    if (isPIM !== undefined && isPIM === 'only-authored') {
      bundleDetails = parsedData;
    } else if (isPIM !== undefined && isPIM === 'pim-authored') {
      if (parsedData.length > 0) bundleDetails.push(...parsedData);
    } else {
      bundleDetails = JSON.parse(response.raw?.bundlepreviewjson);
    }
    bundleDetails.forEach((product) => {
      const wrapper = div({
        class: 'p-4 bg-white outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col md:flex-row justify-start items-start md:items-center gap-6 md:gap-12 w-full',
      });

      const leftSection = div({
        class: 'flex md:flex-1 flex-row md:items-center gap-3.5 w-full md:w-auto',
      });

      const imageBox = div(
        {
          class: 'w-[90px] h-[90px] p-2.5 bg-white outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center',
        },
        img({
          src: product.image,
          alt: product.title,
          class: 'w-full h-full object-contain',
        }),
      );

      const infoBox = div(
        {
          class: 'flex flex-col justify-start items-start gap-2 md:w-auto w-48',
        },
        p({ class: 'text-black text-base font-bold leading-snug break-all' }, product.title),
        p({ class: 'text-gray-500 text-sm leading-tight break-all' }, product.sku),
        div(
          {
            class: 'block md:hidden flex-col justify-start items-start',
          },
          p({ class: 'text-black text-base font-bold leading-snug' }, `${product.quantity || 1}`),
          p({ class: 'text-gray-500 text-sm leading-tight' }, 'QTY'),
        ),
        // div({ class: 'block md:hidden cursor-pointer text-danaherpurple-500
        // hover:text-danaherpurple-800 text-base font-bold leading-snug' }, 'View →'),
      );

      leftSection.append(imageBox, infoBox);
      wrapper.append(leftSection);

      wrapper.append(
        div(
          {
            class: 'hidden md:flex flex-col justify-start items-start',
          },
          p({ class: 'text-black text-base font-bold leading-snug' }, `${product.quantity || 1}`),
          p({ class: 'text-gray-500 text-sm leading-tight' }, 'QTY'),
        ),
        // div({
        //   class: 'hidden md:block cursor-pointer text-danaherpurple-500
        // hover:text-danaherpurple-800 text-base font-bold leading-snug',
        // }, 'View →'),
      );

      block.append(wrapper);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  // }
  block.prepend(div({ class: 'text-2xl text-black py-6' }, 'Product Parts List'));
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

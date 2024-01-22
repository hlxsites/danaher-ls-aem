import {
  div, img, p,
} from '../../scripts/dom-builder.js';
import { getProductResponse } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const response = getProductResponse();
  if (response?.length > 0) {
    try {
      block.append(div(
        { class: 'grid grid-cols-12 text-base font-bold text-black gap-y-4 pb-2 border-b' },
        div(
          { class: 'col-span-8 lg:col-span-10' },
          p({ class: 'text-base font-bold leading-6' }, 'Products'),
        ),
        div(
          { class: 'col-span-4 md:col-span-2 lg:col-span-1 flex justify-center' },
          p({ class: 'text-base font-bold leading-6' }, 'QTY'),
        ),
        div(
          { class: 'hidden md:flex justify-center col-span-2 lg:col-span-1' },
          p({ class: 'text-base font-bold leading-6' }, 'Details'),
        ),
      ));
      const bundleDetails = JSON.parse(response[0].raw?.bundlepreviewjson);
      bundleDetails.forEach((product) => {
        block.append(div(
          { class: 'grid grid-cols-12 text-sm text-black gap-y-4 border-b' },
          div(
            { class: 'flex flex-row col-span-8 lg:col-span-10 pt-4 pb-4' },
            img({ src: `${product.image}`, alt: `${product.title}`, class: 'w-16 h-16 rounded-md shadow-lg' }),
            div(
              { class: 'flex flex-col items-start pl-4' },
              p(`${product.title}`),
              p({ class: 'text-xs' }, `${product.sku}`),
            ),
          ),
          div(
            { class: 'col-span-4 md:col-span-2 lg:col-span-1 flex justify-center pt-4 pb-4' },
            p({ class: '!content-center' }, `${product.quantity ? product.quantity : 1}`),
          ),
          div(
            { class: 'hidden md:flex justify-center col-span-2 lg:col-span-1 pt-4 pb-4' },
            p('--'),
          ),
        ));
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}

import { div, p, img } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block.replaceChildren();
  block.id = 'bundle-list-tab';
  block.parentElement.parentElement.style.padding = '0px 0px 0px 20px';
  const response = JSON.parse(localStorage.getItem('eds-product-details'));
  if (response !== null && response !== undefined && response.raw?.bundlepreviewjson) {
    try {
      block.append(
      //   div(
      //   { class: 'grid grid-cols-12 text-base font-bold text-black gap-y-4 pb-2 border-b' },
      //   div(
      //     { class: 'col-span-8 lg:col-span-10' },
      //     p({ class: 'text-base font-bold leading-6' }, 'Products'),
      //   ),
      //   div(
      //     { class: 'col-span-4 md:col-span-2 lg:col-span-1 flex justify-center' },
      //     p({ class: 'text-base font-bold leading-6' }, 'QTY'),
      //   ),
      //   div(
      //     { class: 'hidden md:flex justify-center col-span-2 lg:col-span-1' },
      //     p({ class: 'text-base font-bold leading-6' }, 'Details'),
      //   ),
      // )
    );
      const bundleDetails = JSON.parse(response.raw?.bundlepreviewjson);
      bundleDetails.forEach((product) => {
        block.append(div(
          { class: 'grid grid-cols-12 text-sm text-black gap-y-4 border-b' },
          div(
            { class: 'flex flex-row col-span-8 lg:col-span-10 pt-4 pb-4' },
            img({ src: `${product.image}`, alt: `${product.title}`, class: 'w-4 h-4 rounded-md shadow-lg' }),
            div(
              { class: 'flex flex-row items-start pl-4' },
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
  block.prepend(div({ class: 'text-2xl text-black py-6' }, 'Product Parts List'));
  block.classList.add(...'border-b border-gray-200 !pb-6 !mr-5 !lg:mr-0'.split(' '));
}

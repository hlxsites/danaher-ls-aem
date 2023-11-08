import {
  button, div, img, p,
} from './dom-builder.js';

export default async function getToast(toastId, addedProduct, addEventListeners) {
  let toast = document.getElementById(toastId);
  let title = '';
  let sku = '';
  if (addedProduct?.product) title = addedProduct?.product.productName;
  else if (addedProduct.productSKU?.trim().length > 0) {
    title = addedProduct?.referrerTitle;
  } else title = addedProduct?.productDescription;
  if (addedProduct?.product) sku = addedProduct?.product.sku;
  else if (addedProduct.productSKU?.trim().length > 0) sku = addedProduct?.productSKU;
  const content = div(
    { class: 'flex w-full font-sans' },
    div(
      { class: 'flex-shrink-0 p-3' },
      img({ class: 'w-24 h-24 rounded shadow-lg', src: addedProduct.image ? addedProduct.image : 'https://dev.lifesciences.danaher.com/content/dam/danaher/system/no-image-availble.jpg' }),
    ),
    div(
      { class: 'flex flex-col flex-1 w-8/12 py-3 pr-3' },
      p({ class: 'text-sm text-lightblue-500' }, 'Added to Quote Cart'),
      div(
        { class: 'flex flex-col justify-start flex-1' },
        p({ class: 'text-sm font-medium leading-5 text-gray-900 line-clamp-2' }, title),
        p({ class: 'text-sm font-normal leading-5 text-gray-500' }, sku),
      ),
    ),
    div(
      { class: 'flex text-white rounded-r bg-danaherorange-600' },
      div(
        { class: 'p-4 my-auto' },
        button({ class: 'text-sm font-medium', name: 'close', type: 'button' }, 'View'),
      ),
    ),
  );
  if (!toast) {
    const toastContent = () => div(
      { class: 'text-sm w-full font-normal break-normal font-serif tracking-wide leading-5 select-none' },
      div(
        { class: 'toast-body' },
        content,
      ),
    );
    toast = div({ class: 'fixed flex flex-col top-0 bottom-0 left-0 right-0 py-40 px-8 overflow-hidden pointer-events-none z-[9999]' }, div(
      {
        class: 'max-w-md w-full space-y-4 bg-white rounded-md pointer-events-auto ml-auto', id: toastId, role: 'alert', 'aria-live': 'assertive', 'aria-atomic': 'true',
      },
      div({ class: 'w-auto flex gap-2 items-center justify-between  text-white shadow-xl' }, toastContent()),
    ));
    addEventListeners?.(toast);
    setTimeout(() => {
      toast.remove();
    }, 5000);
    document.body.append(toast);
  }
}

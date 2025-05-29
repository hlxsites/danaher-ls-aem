import {
  button, div, label, p, span, textarea,
} from './dom-builder.js';
import { getMetadata } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { getAuthorization, getCommerceBase } from './commerce.js';

const baseURL = getCommerceBase();

export default function quoteModal() {
  return div(
    div({ class: 'mt-3' }, label({ class: 'text-sm text-gray-500' }, 'Describe your problem or desired solution to add to your quote cart and one of our experts will assist in find the best solution for you')),
    div({ class: 'mt-3' }, textarea({ class: 'quote-textarea block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gray-300 focus:ring-gray-300 sm:text-sm', name: 'quote', rows: '4' })),
    div(
      { class: 'flex justify-between gap-4 mt-4 quote sm:flex-row flex-col' },
      button({ class: 'p-2 text-sm text-danaherpurple-500 bg-white border-2 border-danaherpurple-500 hover:text-white hover:bg-danaherpurple-800 rounded-full', name: 'continue' }, 'Add and continue browsing'),
      button({ class: 'py-2 text-sm btn btn-primary-purple rounded-full', name: 'submit' }, 'Add and complete request'),
    ),
    div(
      { class: 'p-4 mt-4 rounded-md bg-red-50 hidden quote-error' },
      div({ class: 'flex gap-2' }, span({ class: 'icon icon-xcircle w-4 h-4 text-red-600' }), p({ class: 'text-xs font-medium text-red-600' }, 'Please enter your problem or desired solution.')),
    ),
    div({ class: 'flex flex-col p-4 mt-4 rounded-md bg-danaherlightblue-500 bg-opacity-10' }, p({ class: 'text-xs font-medium text-gray-700 m-0' }, 'Quote Tip.'), p({ class: 'font-sans text-xs font-normal text-gray-700' }, 'Be as detailed as possible so we can best serve your request.')),
  );
}

export function addRequestforQuote(dialogElement, gotoQuoteCart = false) {
  const quoteText = document.querySelector('.quote-textarea');
  if (!quoteText?.value) {
    quoteText.classList.add('border-red-500');
    quoteText.classList.remove('border-gray-300');
    document.querySelector('.quote-error').classList.remove('hidden');
    return false;
  }
  quoteText.classList.remove('border-red-500');
  const image = document.getElementsByClassName('image-content')?.item(0)?.getElementsByTagName('img')?.item(0)
    ?.getAttribute('src');
  const opco = getMetadata('brand');
  const referrerTitle = dialogElement.getAttribute('data-referrer-title');
  const country = dialogElement.getAttribute('country');
  const data = {
    quantity: {
      type: 'Quantity',
      value: 1,
      unit: 'N/A',
    },
    productSKU: ' ',
    image,
    brand: opco,
    productDescription: quoteText.value,
    referrer: window.location.href,
    referrerTitle: referrerTitle || document.title.replace('| Danaher Lifesciences', '').replace('| Danaher Life Sciences', '').trim(),
    country,
  };
  const quoteProduct = {
    event: 'addToQuote',
    productName: quoteText.value,
    productID: ' ',
    productPrice: ' ',
    productCategory: ' ',
    productQuantity: '1',
    productType: ' ',
    productSubtype: ' ',
    productEshopEnabled: ' ',
    productAttributes: ' ',
    productQuotable: true,
    productPriceVisible: ' ',
  };
  window.dataLayer?.push(quoteProduct);
  const formData = JSON.stringify(data);
  const authHeader = getAuthorization();
  if (authHeader && (authHeader.has('authentication-token') || authHeader.has('Authorization'))) {
    const quoteRequest = fetch(`${baseURL}/rfqcart/-`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...Object.fromEntries(authHeader) },
      body: formData,
    });
    quoteRequest.then(async (response) => {
      if (response.status === 200) {
        if (!gotoQuoteCart) {
          document.querySelector('.quote-textarea').value = '';
          const responseJson = await response.json();
          const addedProduct = responseJson?.items?.slice(-1)?.at(0);
          const { default: getToast } = await import('./toast.js');
          await getToast('quote-toast', addedProduct);
          dialogElement.close();
        } else {
          window.location.href = window.DanaherConfig.quoteCartPath;
        }
      }
    });
  }
  return false;
}

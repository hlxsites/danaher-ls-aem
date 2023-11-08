import { decorateIcons } from './lib-franklin.js';

import {
  button, div, label, p, span, textarea,
} from './dom-builder.js';

/**
 * Creates a modal with id modalId, or if that id already exists, returns the existing modal.
 * To show the modal, call `modal.showModal()`.
 * @param modalId
 * @param createContent Callback called when the modal is first opened; should return html string
 * for the modal content
 * @param addEventListeners Optional callback called when the modal is first opened;
 * should add event listeners to body if needed
 * @returns {Promise<HTMLElement>} The <dialog> element, after loading css
 */
const baseURL = window.DanaherConfig !== undefined ? window.DanaherConfig.intershopDomain + window.DanaherConfig.intershopPath : 'https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-';
function getCookie(cname) {
  let value = decodeURIComponent(
    // eslint-disable-next-line prefer-template
    document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(cname).replace(/[\\-\\.\\+\\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1'),
  ) || null;
  if (value && ((value.substring(0, 1) === '{' && value.substring(value.length - 1, value.length) === '}') || (value.substring(0, 1) === '[' && value.substring(value.length - 1, value.length) === ']'))) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
  return value;
}
function getAuthorization() {
  const authHeader = new Headers();
  if (localStorage.getItem('authToken')) {
    authHeader.append('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
  } else if (getCookie('ProfileData')) {
    const { customer_token: apiToken } = getCookie('ProfileData');
    authHeader.append('authentication-token', apiToken);
  } else if (getCookie('apiToken')) {
    const apiToken = getCookie('apiToken');
    authHeader.append('authentication-token', apiToken);
  }
  return authHeader;
}
export default async function getModal(modalId, createContent, addEventListeners) {
  let dialogElement = document.getElementById(modalId);
  if (!dialogElement) {
    const addRequestforQuote = () => {
      const quoteText = document.querySelector('.quote-textarea');
      if (!quoteText?.value) {
        quoteText.classList.add('border-red');
        document.querySelector('.quote-error').classList.remove('hidden');
        return false;
      }
      const image = document.getElementsByClassName('imageviewer')?.item(0)?.getElementsByTagName('img')?.item(0)
        ?.getAttribute('src') ? `${window.location.origin}${document.getElementsByClassName('imageviewer')?.item(0)?.getElementsByTagName('img')?.item(0)}`
          ?.getAttribute('src') : undefined;
      const opco = document.querySelector('meta[name="opco"]')?.getAttribute('content');
      const referrerTitle = document.querySelector('meta[name="referrerTitle"]')?.getAttribute('content');
      const country = document.querySelector('meta[name="country"]')?.getAttribute('content');
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
            const responseJson = await response.json();
            const addedProduct = responseJson?.items?.slice(-1)?.at(0);
            const { default: getToast } = await import('./toast.js');
            await getToast('quote-toast', addedProduct);
            dialogElement.close();
          }
        });
      }
      return false;
    };
    const quoteModalContent = () => div(
      div(
        { class: 'justify-between flex item-center mb-2 text-2xl font-bold leading-6 text-gray-900' },
        div(
          { class: 'modal-title flex items-center gap-2' },
          span({ class: 'icon icon-chat-bubble' }),
          'Request for Quote',
        ),
        p({ class: 'close-button', name: 'close' }, span({ class: 'icon icon-icon-close cursor-pointer' })),
      ),
      div({ class: 'mt-3' }, label({ class: 'text-sm text-gray-500' }, 'Describe your problem or desired solution to add to your quote cart and one of our experts will assist in find the best solution for you')),
      div({ class: 'mt-3' }, textarea({ class: 'quote-textarea', name: 'quote', rows: '4' })),
      div(
        { class: 'flex justify-between gap-4 mt-4 quote' },
        button({ class: 'p-2 text-sm btn-outline-trending-brand rounded-full', name: 'continue' }, 'Add and continue browsing'),
        button({ class: 'py-2 text-sm btn btn-primary-purple rounded-full', name: 'submit' }, 'Add and complete request'),
      ),
      div(
        { class: 'p-4 mt-4 rounded-md bg-red-50 hidden quote-error' },
        div({ class: 'flex gap-2' }, span({ class: 'icon icon-xcircle w-4 h-4 text-red-600' }), p({ class: 'text-xs font-medium text-red-600' }, 'Please enter your problem or desired solution.')),
      ),
      div({ class: 'quote-tip' }, p({ class: 'text-xs font-medium text-gray-700 m-0' }, 'Quote Tip.'), p({ class: 'font-sans text-xs font-normal text-gray-700' }, 'Be as detailed as possible so we can best serve your request.')),
    );
    dialogElement = document.createElement('dialog');
    dialogElement.id = modalId;
    const contentHTML = createContent?.() || '';
    dialogElement.append(contentHTML);
    dialogElement.append(quoteModalContent());
    decorateIcons(dialogElement);
    document.body.appendChild(dialogElement);
    addEventListeners?.(dialogElement);
    dialogElement.querySelector('button[name="continue"]')?.addEventListener('click', () => {
      addRequestforQuote();
    });
    dialogElement.querySelector('.quote-textarea')?.addEventListener('keypress', () => {
      const quoteText = document.querySelector('.quote-textarea');
      quoteText.classList.remove('border-red');
      document.querySelector('.quote-error').classList.add('hidden');
    });
  }
  dialogElement.className = 'w-full max-w-xl px-6 py-4 overflow-hidden text-left align-middle transition-all transform bg-white rounded-md shadow-xl';
  return dialogElement;
}

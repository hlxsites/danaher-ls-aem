import { getCommerceBase } from './commerce.js';
import { getApiData, patchApiData, postApiData, putApiData } from './api-utils.js';
import { updateBasketDetails } from '../blocks/cartlanding/cartSharedFile.js';

const { getAuthenticationToken } = await import('./token-utils.js');
const baseURL = getCommerceBase();
/*
*
*
  Load Stripe script dynamically
*
*
*/
export function loadStripeScript(src) {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      if (window.Stripe) {
        resolve(true);
      } else {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', reject);
      }
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve(true);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/*
*
*
   function to load stripe
*
*
*/

let stripeInstance;

export async function loadStripe() {
  if (!stripeInstance) {
    // eslint-disable-next-line no-undef
    stripeInstance = Stripe('pk_test_51MnpDKAJ0Jw7fvSlk31RtCK9fwvuWm7gs0HpW7Zq5O0Q9Xo81c9yPZRHiovDEEj4KSckql9MYGoaqIqaHGsBsHyt00SCVfbK11');
  }
  return stripeInstance;
}
// get payment intent
export async function getPaymentIntent() {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // get payment intent
  const getPaymentIntentUrl = `${baseURL}/baskets/current/payment-intent`;
  const getPaymentIntentHeaders = new Headers();
  getPaymentIntentHeaders.append('Content-Type', 'Application/json');
  getPaymentIntentHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  const response = await getApiData(getPaymentIntentUrl, getPaymentIntentHeaders);
  return response;
}

// post payment intent
export async function postPaymentIntent() {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // post card payment intent
  const pIntentUrl = `${baseURL}/baskets/current/payment-intent`;
  const pIntentHeaders = new Headers();
  pIntentHeaders.append('Content-Type', 'Application/json');
  pIntentHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  const pIntentBody = JSON.stringify({ type: 'Card' });
  const response = await postApiData(pIntentUrl, pIntentBody, pIntentHeaders);
  if (response?.status === 'success') {
    return response;
  }
  return { status: 'error', data: {} };
}
// setup payment intent
export async function setupPaymentIntent() {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // post card payment intent
  const pIntentUrl = `${baseURL}/baskets/current/setup-intent`;
  const pIntentHeaders = new Headers();
  pIntentHeaders.append('Content-Type', 'Application/json');
  pIntentHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  const pIntentBody = JSON.stringify({});
  const response = await postApiData(pIntentUrl, pIntentBody, pIntentHeaders);
  if (response?.status === 'success') {
    return response;
  }
  return { status: 'error', data: {} };
}
// create payment instrument
export async function createPaymentInstrument(paymentMethod, paymentIntentId, token) {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // create payment intent
  const createPIUrl = `${baseURL}/baskets/current/payment-instruments?include=paymentMethod`;
  const createPIHeaders = new Headers();
  createPIHeaders.append('Content-Type', 'Application/json');
  createPIHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  const createPIBody = JSON.stringify(
    {
      paymentMethod: `${paymentMethod}`,
      parameters: [
        {
          name: 'paymentIntentID',
          value: paymentIntentId,
        },
        {
          name: 'token',
          value: token,
        },
      ],
    },
  );
  const response = await postApiData(createPIUrl, createPIBody, createPIHeaders);
  if (response?.status === 'success') {
    return response;
  }
  return { status: 'error', data: {} };
}
// create payment instrument
export async function assignPaymentInstrument(instrumentId) {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // assign payment intent
  const assignPIUrl = `${baseURL}/baskets/current/payments/open-tender?include=paymentMethod`;
  const assignPIHeaders = new Headers();
  assignPIHeaders.append('Content-Type', 'Application/json');
  assignPIHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  const assignPIBody = JSON.stringify(
    {
      paymentInstrument: instrumentId,
    },
  );
  const response = await putApiData(assignPIUrl, assignPIBody, assignPIHeaders);
  if (response?.status === 'success') {
    return response;
  }
  return { status: 'error', data: {} };
}
// get saved cards
export async function getSavedCards() {
  return getPaymentIntent();
}

// set card as default
export async function setGetCardAsDefault(paymentMethodId = '') {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // post card payment intent
  const pIntentUrl = `${baseURL}/baskets/current/setup-intent`;
  const pIntentHeaders = new Headers();
  pIntentHeaders.append('Content-Type', 'Application/json');
  pIntentHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  let pIntentBody = JSON.stringify({});
  if (paymentMethodId !== '') {
    pIntentBody = JSON.stringify({
      pm: paymentMethodId,
    });
  }
  const response = await putApiData(pIntentUrl, pIntentBody, pIntentHeaders);
  if (response?.status === 'success') {
    await updateBasketDetails();
    return response;
  }
  return { status: 'error', data: {} };
}

/*
*
add selected card to order
*
*
*/

export async function addCardToOrder(data = '') {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // post card payment intent
  const addCardToOrderUrl = `${baseURL}/baskets/current/attributes`;
  const addCardToOrderHeaders = new Headers();
  addCardToOrderHeaders.append('Content-Type', 'Application/json');
  addCardToOrderHeaders.append('Accept', 'application/vnd.intershop.basket.v1+json');
  addCardToOrderHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  const addCardToOrderBody = JSON.stringify(data);
  const response = await postApiData(addCardToOrderUrl, addCardToOrderBody, addCardToOrderHeaders);
  if (response?.status === 'success') {
    return response;
  }
  return { status: 'error', data: {} };
}

/*
*
update selected card
*
*
*/
export async function setUseCard(paymentMethodId) {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // post card payment intent
  const addCardToOrderUrl = `${baseURL}/baskets/current/attributes/SelectedPM`;
  const addCardToOrderHeaders = new Headers();
  addCardToOrderHeaders.append('Content-Type', 'Application/json');
  addCardToOrderHeaders.append('Accept', 'application/vnd.intershop.basket.v1+json');
  addCardToOrderHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  ); const addData = {
    name: 'SelectedPM',
    value: JSON.stringify({ id: paymentMethodId, type: 'Card' }),
    type: 'String',
  };
  const addCardToOrderBody = JSON.stringify(addData);
  const response = await patchApiData(addCardToOrderUrl, addCardToOrderBody, addCardToOrderHeaders);
  if (response?.status === 'success') {
    await updateBasketDetails();
    return response;
  }
  return { status: 'error', data: {} };
}

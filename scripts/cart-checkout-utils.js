import { getCommerceBase } from './commerce.js';

import {
  div,
  label,
  img,
  hr,
  span,
  strong,
  select,
  option,
  p,
  input,
  form,
  h3,
  h5,
  button,
} from './dom-builder.js';
import {
  postApiData, getApiData, patchApiData, putApiData,
} from './api-utils.js';
import { decorateIcons } from './lib-franklin.js';
import {
  buildInputElement,
  buildButton,
  submitForm,
  getStates,
  getCountries,
  removePreLoader,
  showPreLoader,
  closeUtilityModal,
  capitalizeFirstLetter,
  getStoreConfigurations,
  createModal,
  showNotification,
} from './common-utils.js';
// base url for the intershop api calls
import {
  updateCartItemQuantity,
  updateBasketDetails,
  getProductDetailObject,
} from '../blocks/cartlanding/cartSharedFile.js';
import {
  assignPaymentInstrument,
  createPaymentInstrument,
  getPaymentIntent,
  addCardToOrder,
  updateCardForOrder,
  postPaymentIntent,
  postSetupIntent,
  confirmSetup,
  confirmPayment,
} from './stripe_utils.js';
import { initializeModules } from '../blocks/checkout/checkoutUtilities.js';
import { getStripeElements, getStripeInstance } from '../blocks/checkout/paymentModule.js';

const { getAuthenticationToken } = await import('./token-utils.js');
const baseURL = getCommerceBase();

/*
*
*
  Load Google Maps script dynamically
*
*
*/
export function loadGmapsScript(src) {
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

export const logoDiv = (itemToBeDisplayed, opcoBe, imgsrc) => {
  const logoDivInner = div(
    {
      class:
        'w-full self-stretch py-3 bg-gray-100 border-t border-gray-300 inline-flex justify-start items-center gap-1',
    },
    div(
      {
        class: 'w-28 px-5 flex justify-start items-center gap-3',
        id: imgsrc,
      },
      div(
        {
          class: 'justify-start text-black text-base font-semibold truncate',
        },
        opcoBe[0],
      ),
    ),
    div(
      {
        class: 'w-64 justify-start text-black text-base font-semibold',
        id: `product-Quantity-${opcoBe[0]}`,
      },
      `${itemToBeDisplayed[opcoBe].length} Items`,
    ),
    div(
      {
        class: 'hidden sm:block w-24 justify-start text-black text-base font-semibold',
      },
      'QTY',
    ),
    div(
      {
        class: 'hidden sm:block w-26 justify-start text-black text-base font-semibold',
      },
      'Unit Price',
    ),
    div(
      {
        class: 'hidden sm:block w-[7rem] justify-start text-right text-black text-base font-semibold',
      },
      'Total',
    ),
  );
  return logoDivInner;
};

export const divider = (val) => hr({
  class: `w-full border-black-${val}`,
});

/*
*
*
::::::::: skeleton for checkout modules ::::::
*
*
*/
export const checkoutSkeleton = () => {
  const checkoutSkeletonwrapper = div(
    {
      id: 'checkoutSkeleton',
      class: 'animate-pulse space-y-6 bg-white p-6 w-full mx-auto',
    },
    div(
      { class: 'h-8 bg-gray-300 rounded w-1/3' },
    ),
    div(
      { class: 'flex items-center space-x-4' },
      div({ class: 'w-16 h-16 bg-gray-300 rounded' }),
      div(
        { class: 'flex-1 space-y-2' },
        div({ class: 'h-4 bg-gray-300 rounded w-3/4' }),
        div({ class: 'h-4 bg-gray-200 rounded w-1/2' }),
      ),
    ),
    div({ class: 'h-6 bg-gray-300 rounded w-1/4' }),
    div({ class: 'h-4 bg-gray-200 rounded w-full' }),
    div({ class: 'h-4 bg-gray-200 rounded w-full' }),
    div({ class: 'h-4 bg-gray-200 rounded w-2/3' }),
  );
  return checkoutSkeletonwrapper;
};

/*
::::::::::::::
default shipping/billing address if available when user lands on checkout page
::::::::::::::
*/
export function defaultAddress(address, type) {
  const getDefaultAddressWrapper = document.querySelector(
    `#default${capitalizeFirstLetter(type)}Address`,
  );
  if (getDefaultAddressWrapper) {
    getDefaultAddressWrapper.remove();
  }
  if (address) {
    const defaultAddressContainer = div(
      {
        // class: 'hidden',
        id: `default${capitalizeFirstLetter(type)}Address`,
      },
      div(
        {
          class: 'flex p-6 border border-danahergray-300 justify-between ',
        },
        div(
          {},
          h5(
            {
              class: `font-semibold m-0 ${address?.companyName2 ? '' : 'hidden'}`,
            },
            address?.companyName2 ?? '',
          ),
          p(
            {
              class: 'text-black text-base ',
            },
            address?.addressLine1 ?? '',
          ),
          p(
            {
              class: 'text-black text-base ',
            },
            address?.city ?? '',
          ),
          p(
            {
              class: 'text-black text-base ',
            },
            `${address?.mainDivision ?? ''}, ${address?.countryCode ?? ''}, ${address?.postalCode ?? ''
            }`,
          ),
        ),
        button(
          {
            'data-type': type,
            'data-action': 'edit',
            class:
              'flex justify-start bg-white editAddressButton text-danaherpurple-500 hover:text-danaherpurple-800 p-0 pl-0 text-base font-semibold',
            id: `edit${capitalizeFirstLetter(type)}Address`,
          },
          'Edit Address',
        ),
      ),
    );

    return defaultAddressContainer;
  }
  return false;
}
/*
 :::::::::::::::::::::::::::::
 set shipping notes to default based on the method ID
  ::::::::::::::::::::::::::::::::::::::::::::
 * @param {Object} shippingNotesPayload - The payload to pass with the set shipping notes API call
 */
export async function setShippingNotes(shippingNotesPayload) {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  if (!shippingNotesPayload) {
    return { status: 'error', data: 'Error Updating Data.' };
  }
  try {
    sessionStorage.removeItem('useShippingNotes');
    const url = `${baseURL}/baskets/current/attributes`;

    const defaultHeaders = new Headers({
      'Content-Type': 'Application/json',
      'Authentication-Token': authenticationToken.access_token,
      Accept: 'application/vnd.intershop.basket.v1+json',
    });

    const response = await postApiData(
      url,
      JSON.stringify(shippingNotesPayload),
      defaultHeaders,
    );

    if (response?.status === 'success') {
      sessionStorage.setItem(
        'useShippingNotes',
        JSON.stringify({ status: 'success', data: response.data.data.value }),
      );
      return { status: 'success', data: response.data.data.value };
    }
    return { status: 'error', data: response };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
 :::::::::::::::::::::::::::::
 update shipping notes based on the method ID
 ::::::::::::::::::::::::::::::::::::::::::::
 * @param {Object} shippingNotesPayload - The payload to pass with the set shipping notes API call
 */
export async function updateShippingNotes(shippingNotesPayload) {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    sessionStorage.removeItem('useShippingNotes');
    const url = `${baseURL}/baskets/current/attributes/GroupShippingNote`;

    const defaultHeaders = new Headers({
      'Content-Type': 'Application/json',
      'Authentication-Token': authenticationToken.access_token,
      Accept: 'application/vnd.intershop.basket.v1+json',
    });

    const response = await patchApiData(
      url,
      JSON.stringify(shippingNotesPayload),
      defaultHeaders,
    );

    if (response?.status === 'success') {
      sessionStorage.setItem(
        'useShippingNotes',
        JSON.stringify({
          status: 'success',
          data: response?.data?.data?.value ?? '',
        }),
      );
      return { status: 'success', data: response?.data?.data?.value ?? '' };
    }
    return { status: 'error', data: response };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
:::::::::::::::::::::::::::
 Function to create basket
  :::::::::::::::::::::::::::
*/
export const createBasket = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
    Accept: 'application/vnd.intershop.basket.v1+json',
  });
  const url = `${baseURL}/baskets`;
  const data = JSON.stringify({});
  try {
    return await postApiData(url, data, defaultHeader);
  } catch (error) {
    return {
      data: error.message,
      status: 'error',
    };
  }
};
/*
:::::::::::::::::::::::::::
 Function to validate basket
  :::::::::::::::::::::::::::
*/
export const validateBasket = async (validateData) => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
  });
  const url = `${baseURL}/baskets/current/validations`;
  const data = JSON.stringify(validateData);
  try {
    const response = await postApiData(url, data, defaultHeader);
    if (response?.data?.data?.results?.valid === false) {
      return { status: 'error', data: {} };
    }
    return response;
  } catch (error) {
    return {
      data: error.message,
      status: 'error',
    };
  }
};
/*
:::::::::::::::::::::::::::
 Function to submit Order
  :::::::::::::::::::::::::::
*/
export const submitOrder = async (basketId, paymentMethod) => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    let response = '';
    if (paymentMethod === 'invoice') {
      const defaultHeader = new Headers({
        'Content-Type': 'Application/json',
        Accept: 'application/vnd.intershop.order.v1+json',
        'Authentication-Token': authenticationToken.access_token,
      });
      const url = `${baseURL}/orders?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrument`;
      const data = JSON.stringify({
        basket: basketId,
        termsAndConditionsAccepted: true,
      });
      response = await postApiData(url, data, defaultHeader);
    }

    if (paymentMethod === 'stripe') {
      const defaultHeader = new Headers({
        'Content-Type': 'Application/json',
        Accept: 'application/vnd.intershop.order.v1+json',
        'Authentication-Token': authenticationToken.access_token,
      });
      const url = `${baseURL}/orders?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrument`;
      const data = JSON.stringify({
        basket: basketId,
        termsAndConditionsAccepted: true,
      });
      response = await postApiData(url, data, defaultHeader);
    }
    if (response?.status === 'success') {
      sessionStorage.setItem(
        'orderSubmitDetails',
        JSON.stringify(response.data),
      );
      const cartItemsDetails = JSON.parse(
        sessionStorage.getItem('productDetailObject'),
      );
      sessionStorage.setItem(
        'cartItemsDetails',
        JSON.stringify(cartItemsDetails),
      );
      const userOrderDetails = JSON.parse(
        sessionStorage.getItem('userOrderDetails'),
      );
      if (!userOrderDetails) {
        const orderIdArray = [];
        orderIdArray.push(response?.data?.data?.id);
        sessionStorage.setItem(
          'userOrderDetails',
          JSON.stringify(orderIdArray),
        );
      } else {
        userOrderDetails.push(response?.data?.data?.id);
        sessionStorage.setItem(
          'userOrderDetails',
          JSON.stringify(userOrderDetails),
        );
      }
      return response;
    }
    throw new Error('Error Submitting Order');
  } catch (error) {
    return {
      data: error.message,
      status: 'error',
    };
  }
};

/*
 :::::::::::::::::::::::::::::
 get saved cards for payment
 ::::::::::::::::::::::::::::::::::::::::::::
 */
export async function getSavedCards() {
  const authenticationToken = await getAuthenticationToken();

  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const url = `${baseURL}/baskets/current/eligible-payment-methods?include=paymentInstruments`;

    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    defaultHeaders.append(
      'authentication-token',
      authenticationToken.access_token,
    );
    const response = await getApiData(url, defaultHeaders);
    return response.status === 'success' ? response.data : { status: 'error', data: 'Not Saved Cards Found' };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
 :::::::::::::::::::::::::::::
 get single adress details based on address id
 ::::::::::::::::::::::::::::::::::::::::::::
 * @param {string} addressURI - The ID of the Address.
 */
export async function getAddressDetails(addressURI) {
  const authenticationToken = await getAuthenticationToken();

  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const cachedAddress = JSON.parse(sessionStorage.getItem('addressList'));
    if (cachedAddress?.status === 'success') {
      const checkCachedAddress = cachedAddress?.data?.filter((adr) => adr.id === addressURI.split('/')[3]);
      if (checkCachedAddress) {
        return { status: 'success', data: checkCachedAddress[0] };
      }
    }
    const url = `${baseURL}/${addressURI}`;

    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    defaultHeaders.append(
      'authentication-token',
      authenticationToken.access_token,
    );
    const response = await getApiData(url, defaultHeaders);
    return response.status === 'success' ? response.data : [];
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
 :::::::::::::::::::::::::::::
 update use address object with cuyrrent address
  ::::::::::::::::::::::::::::::::::::::::::::
 * @param {Object} response - Response from the Set default address API.
 */
export async function setUseAddressObject(response) {
  if (window.location.pathname.includes('cartlanding')) return false;
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const useAddressObject = {};
    let addressDetails = '';
    if (response?.data?.invoiceToAddress) {
      const invoiceToAddressURI = response.data.invoiceToAddress.split(':')[4];
      addressDetails = await getAddressDetails(
        `customers/-/addresses/${invoiceToAddressURI}`,
      );
      useAddressObject.invoiceToAddress = addressDetails?.data;
    }
    if (response?.data?.commonShipToAddress) {
      const commonShipToAddressURI = response.data.commonShipToAddress.split(':')[4];
      addressDetails = await getAddressDetails(
        `customers/-/addresses/${commonShipToAddressURI}`,
      );
      useAddressObject.commonShipToAddress = addressDetails?.data;
    }
    if (Object.keys(useAddressObject).length !== 0) {
      return { status: 'success', data: useAddressObject };
    }
    return { status: 'error', data: {} };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
 :::::::::::::::::::::::::::::
  set use address to  show on ui based on adress id and type
   ::::::::::::::::::::::::::::::::::::::::::::
 * @param {string} id - The ID of the current address.
 * @param {string} type - Shipping/Billing.
 */
export const setUseAddress = async (id, type, action = '') => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    if (window.location.pathname.includes('cartlanding')) return false;
    const getUseAddressesObject = JSON.parse(sessionStorage.getItem('useAddress'));
    if (getUseAddressesObject?.status === 'success' && action !== 'useAddress') {
      const cachedAddress = JSON.parse(sessionStorage.getItem('addressList'));
      if (cachedAddress?.status === 'success') {
        const updatedUseObject = {
          status: 'success',
          data: {
            commonShipToAddress: '',
            invoiceToAddress: '',
          },
        };
        const checkCachedAddress = cachedAddress?.data?.filter((adr) => adr.id === id);

        if (type === 'shipping' && checkCachedAddress) {
          // eslint-disable-next-line prefer-destructuring
          updatedUseObject.data.commonShipToAddress = checkCachedAddress[0];
          updatedUseObject.data.invoiceToAddress = getUseAddressesObject?.data?.invoiceToAddress;
        }
        if (type === 'billing' && checkCachedAddress) {
          // eslint-disable-next-line prefer-destructuring
          updatedUseObject.data.invoiceToAddress = checkCachedAddress[0];
          // eslint-disable-next-line max-len
          updatedUseObject.data.commonShipToAddress = getUseAddressesObject?.data?.commonShipToAddress;
        }
        sessionStorage.removeItem('useAddress');
        sessionStorage.setItem('useAddress', JSON.stringify(updatedUseObject));
        return updatedUseObject;
      }
    }

    const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
    const data = {};
    if (type === 'shipping') {
      Object.assign(data, { commonShipToAddress: id });
    } else {
      Object.assign(data, { invoiceToAddress: id });
    }
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    defaultHeaders.append(
      'authentication-token',
      authenticationToken.access_token,
    );
    const response = await patchApiData(
      url,
      JSON.stringify(data),
      defaultHeaders,
    );

    if (response?.status === 'success') {
      const useAddressData = await setUseAddressObject(response.data);

      if (useAddressData?.status === 'success') {
        sessionStorage.removeItem('useAddress');

        sessionStorage.setItem('useAddress', JSON.stringify(useAddressData));
        return useAddressData;
      }
      return { status: 'error', data: useAddressData };
    }
    return { status: 'error', data: response };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};

/*
:::::::::::::::::::::::::::
Function to get current basket details
:::::::::::::::::::::::::::
*/
export async function getBasketDetails(userType = null) {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
    Accept: 'application/vnd.intershop.basket.v1+json',
  });
  const basketData = JSON.parse(sessionStorage.getItem('basketData'));

  if (basketData?.status === 'success' && userType !== 'customer') return basketData;

  const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
  try {
    if (basketData?.status === 'success' && userType === 'customer') {
      const mergeBasketUrl = `${baseURL}baskets/current/merges`;
      const mergeData = {
        sourceBasket: basketData.data.data.id,
      };
      const response = await postApiData(
        mergeBasketUrl,
        JSON.stringify(mergeData),
        defaultHeader,
      );

      if (response?.status === 'success') {
        const basketResponse = await getApiData(url, defaultHeader);

        if (basketResponse && basketResponse.status === 'success') {
          sessionStorage.setItem('basketData', JSON.stringify(basketResponse));

          return basketResponse;
        }
      } else {
        return { status: 'error', data: 'Error merging basket' };
      }
    }
    const basketResponse = await getApiData(url, defaultHeader);

    if (basketResponse && basketResponse.status === 'success') {
      sessionStorage.setItem('basketData', JSON.stringify(basketResponse));

      return basketResponse;
    }
    const response = await createBasket();
    if (response.status === 'success') {
      sessionStorage.setItem('basketData', JSON.stringify(response));
      if (response.data.invoiceToAddress) {
        const setUseBillingAddress = response.data.invoiceToAddress.split(':')[4];
        await setUseAddress(setUseBillingAddress, 'billing');
      }
    }
    return response;
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
 :::::::::::::::::::::::::::::
 update shipping methods
  ::::::::::::::::::::::::::::::::::::::::::::
 */
export const updateShippingMethods = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const shippingBucket = JSON.parse(sessionStorage.getItem('basketData'));
    if (shippingBucket.status === 'success') {
      sessionStorage.removeItem('shippingMethods');
      const url = `${baseURL}/baskets/current/buckets/${shippingBucket?.data?.data?.buckets[0]}/eligible-shipping-methods`;
      const defaultHeaders = new Headers();
      defaultHeaders.append('Content-Type', 'Application/json');
      defaultHeaders.append(
        'authentication-token',
        authenticationToken.access_token,
      );
      defaultHeaders.append(
        'Accept',
        'application/vnd.intershop.basket.v1+json',
      );
      const response = await getApiData(url, defaultHeaders);

      if (response.status === 'success') {
        sessionStorage.setItem(
          'shippingMethods',
          JSON.stringify({ status: 'success', data: response.data.data }),
        );
        return { status: 'success', data: response.data.data };
      }
      return { status: 'error', data: '' };
    }
    return { status: 'error', data: 'Error getting shipping methods:' };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};
/*
 :::::::::::::::::::::::::::::
 get shipping methods
  ::::::::::::::::::::::::::::::::::::::::::::
 */
export const getShippingMethods = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const shippingBucket = JSON.parse(sessionStorage.getItem('basketData'));
    if (shippingBucket.status === 'success') {
      const shippingMethods = JSON.parse(
        sessionStorage.getItem('shippingMethods'),
      );
      if (shippingMethods?.status === 'success') return await shippingMethods;
      sessionStorage.removeItem('shippingMethods');
      const url = `${baseURL}/baskets/current/buckets/${shippingBucket?.data?.data?.buckets[0]}/eligible-shipping-methods`;
      const defaultHeaders = new Headers();
      defaultHeaders.append('Content-Type', 'Application/json');
      defaultHeaders.append(
        'authentication-token',
        authenticationToken.access_token,
      );
      defaultHeaders.append(
        'Accept',
        'application/vnd.intershop.basket.v1+json',
      );
      const response = await getApiData(url, defaultHeaders);

      if (response.status === 'success') {
        sessionStorage.setItem(
          'shippingMethods',
          JSON.stringify({ status: 'success', data: response.data.data }),
        );
        return { status: 'success', data: response.data.data };
      }
      return { status: 'error', data: '' };
    }
    return { status: 'error', data: 'Error getting shipping methods:' };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};
/*
 :::::::::::::::::::::::::::::
 get payment  methods
  ::::::::::::::::::::::::::::::::::::::::::::
 */
export const getPaymentMethods = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const fetchPaymentMethods = JSON.parse(sessionStorage.getItem('paymentMethods'));
    if (fetchPaymentMethods?.status === 'success') {
      return fetchPaymentMethods;
    }
    const url = `${baseURL}/baskets/current/eligible-payment-methods?include=paymentInstruments`;
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    defaultHeaders.append(
      'authentication-token',
      authenticationToken.access_token,
    );
    const response = await getApiData(url, defaultHeaders);
    if (response?.status === 'success') {
      sessionStorage.setItem(
        'paymentMethods',
        JSON.stringify({ status: 'success', data: response.data.data }),
      );
      return { status: 'success', data: response.data.data };
    }
    return { status: 'error', data: 'Error getting Payment methods:' };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};

/*
 :::::::::::::::::::::::::::::
  set shipping method to default based on the method ID
  ::::::::::::::::::::::::::::::::::::::::::::
 * @param {string} methodId - The ID of the Shipping method.
 */
export const setShippingMethod = async (methodId) => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    sessionStorage.removeItem('useShippingMethod');
    const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrumentnclude=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrument`;
    const data = {
      commonShippingMethod: methodId,
    };
    const defaultHeaders = new Headers({
      'Content-Type': 'Application/json',
      'Authentication-Token': authenticationToken.access_token,
      Accept: 'application/vnd.intershop.basket.v1+json',
    });
    const response = await patchApiData(
      url,
      JSON.stringify(data),
      defaultHeaders,
    );

    if (response?.status === 'success') {
      sessionStorage.setItem(
        'useShippingMethod',
        JSON.stringify({
          status: 'success',
          data: response?.data?.data?.commonShippingMethod ?? '',
        }),
      );
      return {
        status: 'success',
        data: response?.data?.data?.commonShippingMethod ?? '',
      };
    }
    return { status: 'error', data: response.data };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};

/*
:::::::::::::::::::::::::::::
update addresses to be shown on ui
::::::::::::::::::::::::::::::::::::::::::::
 */
export async function updateAddresses() {
  if (window.location.pathname.includes('cartlanding')) return false;
  const authenticationToken = await getAuthenticationToken();

  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  sessionStorage.removeItem('addressList');
  const url = `${baseURL}/customers/-/addresses`;
  const defaultHeaders = new Headers();
  defaultHeaders.append('Content-Type', 'Application/json');
  defaultHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  try {
    const response = await getApiData(url, defaultHeaders);
    if (response?.status !== 'success') return [];
    const addressDetailsList = await Promise.all(
      response.data.elements.map((address) => {
        const addressURI = address.uri.split('addresses')[1];
        return getAddressDetails(`customers/-/addresses${addressURI}`);
      }),
    );
    if (addressDetailsList) {
      sessionStorage.setItem(
        'addressList',
        JSON.stringify({ status: 'success', data: addressDetailsList }),
      );
      return { status: 'success', data: addressDetailsList };
    }
    return { status: 'error', data: 'Address Not found.' };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
 :::::::::::::::::::::::::::::
 get addresses to be shown
 ::::::::::::::::::::::::::::::::::::::::::::
 */
export async function getAddresses() {
  const cachedAddress = JSON.parse(sessionStorage.getItem('addressList'));
  if (cachedAddress?.status === 'success') {
    return cachedAddress;
  }
  return updateAddresses();
}
/*
::::::::::::::
shipping address list will get it from the api under my-account -  get addresses
::::::::::::::
*/
export async function addressList(type) {
  const getAddressesData = await getAddresses();

  if (getAddressesData?.status === 'success') {
    return getAddressesData?.data?.filter((adr) => {
      if (type === 'shipping') {
        return adr?.shipToAddress === true;
      }
      return adr?.invoiceToAddress === true;
    });
  }
  return [];
}

/*
::::::::::::::::::::::
generate country and state slect fields
:::::::::::::::::::::::::::::::
*/
export const buildCountryStateSelectBox = (
  lable,
  field,
  inputName,
  required,
  dtName,
  itemsList,
  selected = '',
  classes = '',
) => {
  const dataRequired = required ? span({ class: 'text-red-500' }, '*') : '';

  let selectOptions = [];
  if (itemsList.length > 0) {
    selectOptions = itemsList.map((item) => {
      const value = item.id;
      const options = selected === value
        ? option({ value, selected }, item.name)
        : option({ value }, item.name);
      return options;
    });
  }
  selectOptions.unshift(
    option({ value: '', selected: true, disabled: true }, 'Select an option'),
  );

  return div(
    { class: ` ${classes} space-y-2 field-wrapper  mt-4` },
    label(
      {
        for: lable,
        class: 'font-normal text-sm leading-4',
      },
      field,
      dataRequired,
    ),
    select(
      {
        id: inputName,
        'aria-label': dtName,
        name: inputName,
        'data-required': required,
        class:
          'input-focus text-base w-full block px-2 py-4  border border-solid border-gray-600',
      },
      ...selectOptions,
    ),
    span({
      id: 'msg',
      'data-name': dtName,
      class: 'mt-1 text-sm font-normal leading-4 text-danaherpurple-500',
    }),
  );
};

/*
 :::::::::::::::::::::::::::::
 set address to default
 ::::::::::::::::::::::::::::::::::::::::::::
 */
export async function updateAddressToDefault(data) {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const url = `${baseURL}/customers/-/myAddresses`;
  const defaultHeaders = new Headers();
  defaultHeaders.append('Content-Type', 'Application/json');
  defaultHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  try {
    const response = await postApiData(
      url,
      JSON.stringify(data),
      defaultHeaders,
    );
    return response;
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
 :::::::::::::::::::::::::::::
 get addresses to be shown in UI
 ::::::::::::::::::::::::::::::::::::::::::::
 */
export async function getUseAddresses() {
  const cachedAddress = JSON.parse(sessionStorage.getItem('useAddress'));
  const commonShipToAddress = cachedAddress?.data?.commonShipToAddress?.id;
  const invoiceToAddress = cachedAddress?.data?.invoiceToAddress?.id;
  if (commonShipToAddress || invoiceToAddress) return cachedAddress;
  const useAddressData = await getBasketDetails();

  if (useAddressData?.status === 'success') {
    const useAddressObjectData = await setUseAddressObject(useAddressData.data);

    if (useAddressObjectData?.status === 'success') {
      sessionStorage.setItem(
        'useAddress',
        JSON.stringify(useAddressObjectData),
      );
      return { status: 'success', data: useAddressObjectData };
    }
    return { status: 'error', data: {} };
  }
  return { status: 'error', data: {} };
}

/*
 :::::::::::::::::::::::::::::
 Get promotion details based on promotion ID
  ::::::::::::::::::::::::::::::::::::::::::::
 * @param {String} promotionId - promotionId from the Basket Details API.
 */
export const getPromotionDetails = async (promotionId) => {
  try {
    if (!promotionId) return { status: 'error', data: 'Invalid promotion ID' };

    const autoDiscount = JSON.parse(sessionStorage.getItem('discountDetails')) || {};
    if (autoDiscount?.status === 'success') return autoDiscount;
    const getBasket = await getBasketDetails();
    if (getBasket?.status === 'success') {
      const getBasketDiscount = getBasket?.data?.data?.discounts?.valueBasedDiscounts;
      if (getBasketDiscount) {
        const defaultHeaders = new Headers();
        defaultHeaders.append('Content-Type', 'Application/json');
        const getDiscountDetails = await getApiData(
          `${baseURL}/promotions/${promotionId}`,
          defaultHeaders,
        );

        if (getDiscountDetails?.status === 'success') {
          sessionStorage.setItem(
            'discountDetails',
            JSON.stringify(getDiscountDetails),
          );
          return getDiscountDetails;
        }
        return { status: 'error', data: 'Invalid promotion ID' };
      }
    } else {
      return { status: 'error', data: 'Basket Not Found' };
    }
  } catch (error) {
    return { status: 'error', data: error.message };
  }
  return {};
};

/*
 ::::::::::::::
 tax exempt module.feed the create modal function with tax exempt content
 ::::::::::::::
 */
export const taxExemptModal = () => {
  const taxExemptWrapper = div(
    {
      class: 'flex w-full flex-col gap-7',
      id: 'taxExemptWrapper',
    },
    /*
    :::::::::::::::
     tax exempt header
     ::::::::::::::
     */
    div(
      {
        class: 'tax-exempt-header flex  flex-col gap-4',
      },
      div(
        {
          class: 'flex w-full  flex-col',
        },
        div(
          {
            class: 'tax-exempt-file flex items-center gap-4',
          },
          span({
            class:
              'fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
          p(
            {
              class: 'text-gray-900 text-3xl font-semibold',
            },
            'Tax Exempt',
          ),
        ),
      ),
      p(
        {
          class: 'text-extralight text-center',
        },
        'Please upload the tax exempt certificate for our team to validate Formats: .JPG, .PNG, .PDF, .DOC and .DOCX',
      ),
    ),
    /*
    ::::::::::::::
    tax exempt body
    ::::::::::::::
    */
    div(
      {
        class: 'tax-exempt-body cursor-pointer flex flex-col items-center',
        id: 'taxExemptUpload',
      },
      div(
        {
          class: 'tax-exempt-upload',
        },
        span({
          class: 'h-28 w-28',
        }),
      ),
      input({
        type: 'file',
        name: 'taxExemptFileInput',
        id: 'taxExemptFileInput',
        class: 'hidden',
      }),
      p(
        {
          class: 'text-center text-2xl font-500',
        },
        'Upload File',
      ),
      div(
        {
          class: 'text-red-500 text-md font-500 hidden',
          id: 'taxExemptModalErrorContainer',
        },
        'Error Uploading File. Only JPG, .PNG, .PDF, .DOC and .DOCX are allowed.',
      ),
    ),

    /*
     ::::::::::::::
     tax exempt footer
     ::::::::::::::
     */
    div(
      {
        class: 'tax-exempt-footer bg-danaherpurple-50 p-4 flex flex-col',
      },
      div(
        {
          class: 'flex w-full flex-col',
        },
        p(
          {
            class: ' text-black text-md font-extrabold',
          },
          'Tax Exempt tip.',
        ),
      ),
      p(
        {
          class: 'text-extralight',
        },
        'Please upload a clearly scanned copy of the tax exempt certificate for a quick review process.',
      ),
    ),
  );
  /*
    ::::::::::::::::::::::
    cloud file icon for tax exempt modal
     :::::::::::::::::::::::::::::::
    */
  const cloudFileIcon = taxExemptWrapper.querySelector('.tax-exempt-file span');
  cloudFileIcon.innerHTML = '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="24" fill="#F5EFFF"/><path d="M21 24H27M21 28H27M29 33H19C17.8954 33 17 32.1046 17 31V17C17 15.8954 17.8954 15 19 15H24.5858C24.851 15 25.1054 15.1054 25.2929 15.2929L30.7071 20.7071C30.8946 20.8946 31 21.149 31 21.4142V31C31 32.1046 30.1046 33 29 33Z" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /*
    ::::::::::::::::::::::
    upload file icon for tax exempt modal
     :::::::::::::::::::::::::::::::
    */
  const cloudUloadIcon = taxExemptWrapper.querySelector(
    '.tax-exempt-upload span',
  );
  cloudUloadIcon.innerHTML = '<svg width="122" height="122" viewBox="0 0 122 122" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Cloud upload"><path id="Icon" d="M40.6667 86.4167C26.6294 86.4167 15.25 75.0372 15.25 61C15.25 48.5536 24.1963 38.1968 36.0091 36.0091C38.1968 24.1963 48.5536 15.25 61 15.25C73.4464 15.25 83.8032 24.1963 85.9909 36.0091C97.8038 38.1968 106.75 48.5536 106.75 61C106.75 75.0372 95.3706 86.4167 81.3333 86.4167M45.75 61L61 45.75M61 45.75L76.25 61M61 45.75V106.75" stroke="#7523FF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';

  const taxExemptUploadButton = taxExemptWrapper.querySelector('#taxExemptUpload');

  const taxExemptFileInput = taxExemptWrapper.querySelector(
    '#taxExemptFileInput',
  );
  if (taxExemptUploadButton && taxExemptFileInput) {
    taxExemptUploadButton.addEventListener('click', () => {
      taxExemptFileInput.click();
    });
  }
  if (taxExemptFileInput) {
    taxExemptFileInput.addEventListener('change', (f) => {
      f.preventDefault();
      const file = f.target.files[0];
      if (file) {
        // Allowed formats
        const allowedTaxExemptFileFormats = [
          'jpg',
          'jpeg',
          'png',
          'pdf',
          'doc',
          'docx',
        ];
        const fileName = file.name;
        const fileType = fileName.split('.')[1].toLowerCase();
        if (allowedTaxExemptFileFormats.includes(fileType)) {
          const taxExemptUploadedFile = div(
            {
              class: ' flex flex-1 justify-between',
              id: 'taxExemptUploadedFile',
            },
            div(
              {},
              p(
                {
                  class: 'text-black text-md',
                },
                'Tax Exempt Document',
              ),
              p(
                {
                  class: 'text-danaherpurple-500 text-md',
                },
                fileName,
              ),
            ),
            div(
              {
                class: 'close-button',
                name: 'close',
              },
              span({
                class: 'icon icon-close cursor-pointer',
                id: 'removeTaxExemptUploadedFile',
              }),
            ),
          );

          const checkoutSummaryTax = document.querySelector(
            '#checkoutSummaryTax',
          );
          if (checkoutSummaryTax) {
            const checkoutSummaryTaxExempt = checkoutSummaryTax.querySelector(
              '#checkoutSummaryTaxExempt',
            );
            if (checkoutSummaryTaxExempt) {
              checkoutSummaryTaxExempt.classList.add('hidden');
            }
            decorateIcons(taxExemptUploadedFile);
            checkoutSummaryTax.classList.add('flex-wrap');
            checkoutSummaryTax.append(taxExemptUploadedFile);
            closeUtilityModal();
          }
        } else {
          const taxExemptModalErrorContainer = document.querySelector(
            '#taxExemptModalErrorContainer',
          );
          if (taxExemptModalErrorContainer) {
            if (taxExemptModalErrorContainer.classList.contains('hidden')) {
              taxExemptModalErrorContainer.classList.remove('hidden');
            }
            setTimeout(() => {
              taxExemptModalErrorContainer.classList.add('hidden');
            }, 10000);
          }
        }

        const removeTaxExemptUploadedFile = document.querySelector(
          '#removeTaxExemptUploadedFile',
        );
        if (removeTaxExemptUploadedFile) {
          removeTaxExemptUploadedFile.addEventListener('click', (e) => {
            e.preventDefault();
            const taxExemptUploadedFile = document.querySelector(
              '#taxExemptUploadedFile',
            );
            if (taxExemptUploadedFile) {
              taxExemptUploadedFile.remove();
              const checkoutSummaryTaxExempt = document.querySelector(
                '#checkoutSummaryTaxExempt',
              );
              if (checkoutSummaryTaxExempt) {
                if (checkoutSummaryTaxExempt.classList.contains('hidden')) {
                  checkoutSummaryTaxExempt.classList.remove('hidden');
                }
              }
              const checkoutSummaryTax = document.querySelector(
                '#checkoutSummaryTax',
              );
              if (checkoutSummaryTax) {
                if (checkoutSummaryTax.classList.contains('flex-wrap')) {
                  checkoutSummaryTax.classList.remove('flex-wrap');
                }
              }
            }
          });
        }
      }
    });
  }
  return taxExemptWrapper;
};

/*
*
*
 ::::::::::::::
 function to create PO number if its not present in the Baket
 ::::::::::::::
*
*
*
 */

export const createPoNumber = async (invoiceNumber) => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
    'Authentication-Token': authenticationToken.access_token,
  });
  const url = `${baseURL}/baskets/current/attributes`;
  const data = JSON.stringify({
    name: 'ReferenceNo',
    value: invoiceNumber,
    type: 'String',
  });
  try {
    const response = await postApiData(url, data, defaultHeader);
    if (response?.status === 'success') {
      return response;
    }
    return {
      data: response,
      status: 'error',
    };
  } catch (error) {
    return {
      data: error.message,
      status: 'error',
    };
  }
};
/*
*
*
 ::::::::::::::
 function to update PO number if its not present in the Baket
 ::::::::::::::
*
*
*
*/

export const updatePoNumber = async (invoiceNumber) => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
    'Authentication-Token': authenticationToken.access_token,
  });
  const url = `${baseURL}/baskets/current/attributes/ReferenceNo`;
  const data = JSON.stringify({
    name: 'ReferenceNo',
    value: invoiceNumber,
    type: 'String',
  });
  try {
    const response = await postApiData(url, data, defaultHeader);
    if (response?.status === 'success') {
      return response;
    }
    return {
      data: response,
      status: 'error',
    };
  } catch (error) {
    return {
      data: error.message,
      status: 'error',
    };
  }
};

export async function silentNavigation(path) {
  window.history.pushState({}, '', path);
  // eslint-disable-next-line no-use-before-define
  loadingModule();
}

/*
*
*
 ::::::::::::::
 handle the interaction when user click on proceed button or the steps icons
 ::::::::::::::
*
*
*
 */
export const changeStep = async (step) => {
  // showPreLoader();
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // handle browser forward and back button event
  window.addEventListener('popstate', () => {
    silentNavigation(window.location.pathname);
  });
  const checkoutWrapper = document.querySelector('#checkoutWrapper');
  checkoutWrapper?.classList.add('pointer-events-none');
  const checkoutProgressBar = document.querySelector('#checkoutProgressBar');

  const currentTab = (step?.target?.getAttribute('data-tab') || step?.target?.parentElement?.getAttribute('data-tab') || step?.target?.parentElement?.parentElement?.getAttribute('data-tab'));

  if (currentTab !== 'submitOrder') {
    const checkoutModulesWrapper = document.querySelector('#checkoutModulesWrapper');
    checkoutModulesWrapper.innerHTML = '';
    checkoutModulesWrapper.append(checkoutSkeleton());

    const checkoutSummaryContainer = document.querySelector('#checkoutSummaryContainer');
    if (checkoutSummaryContainer) {
      checkoutSummaryContainer.innerHTML = '';
      checkoutSummaryContainer.append(checkoutSkeleton());
    }
  }

  let validateData = '';
  let validatingBasket;
  try {
    checkoutProgressBar?.classList.add('hidden');
    if (currentTab === 'shippingAddress') {
      validateData = {
        adjustmentsAllowed: true,
        scopes: [
          'Products',
          'Promotion',
          'Value',
          'CostCenter',
        ],
      };
      validatingBasket = await validateBasket(validateData);
      if (validatingBasket?.status !== 'success') throw new Error('Invalid Basket');
      silentNavigation('/us/en/e-buy/addresses');
    }
    if (currentTab === 'shippingMethods') {
      validateData = {
        adjustmentsAllowed: true,
        scopes: [
          'InvoiceAddress',
          'ShippingAddress',
          'Addresses',
        ],
      };
      validatingBasket = await validateBasket(validateData);
      if (validatingBasket?.status !== 'success') throw new Error('Invalid Basket');
      silentNavigation('/us/en/e-buy/shipping');
    }

    if (currentTab === 'payment') {
      validateData = {
        adjustmentsAllowed: true,
        scopes: [
          'InvoiceAddress',
          'ShippingAddress',
          'Addresses',
          'Shipping',
        ],
      };
      validatingBasket = await validateBasket(validateData);
      if (validatingBasket?.status !== 'success') throw new Error('Invalid Basket');
      silentNavigation('/us/en/e-buy/payment');
    }

    const activateModule = document.querySelector(
      `#checkout-${currentTab}-module`,
    );

    const modules = document.querySelectorAll('.checkout-module');

    if (activateModule) {
      modules.forEach((m) => {
        if (m.classList.contains('active')) {
          m.classList.remove('active');
          m.classList.add('hidden');
        }
      });
      activateModule.classList.add('active');
      if (activateModule.classList.contains('hidden')) {
        activateModule.classList.remove('hidden');
      }
    }

    /*
    *
    *
      ::::::::: handle payment ::::::
    *
    *
    * */
    if (currentTab === 'submitOrder') {
      const submittedOrderUrl = '/us/en/e-buy/ordersubmit?orderId=';
      // check if payment methos is selected
      const getSelectedPaymentMethod = document.querySelector('#paymentMethodsWrapper')?.querySelector('input[name="paymentMethod"]:checked');

      if (!getSelectedPaymentMethod) throw new Error('Please select Payment Method');

      const getBasketForOrder = await getBasketDetails();

      if (getSelectedPaymentMethod?.value === 'invoice') {
        showPreLoader();
        const url = `${baseURL}/baskets/current/payments/open-tender?include=paymentMethod`;
        const defaultHeaders = new Headers();
        defaultHeaders.append('Content-Type', 'application/json');
        defaultHeaders.append('authentication-token', authenticationToken.access_token);

        const data = JSON.stringify({ paymentInstrument: 'Invoice' });
        const setupInvoice = await putApiData(url, data, defaultHeaders);

        if (setupInvoice?.status !== 'success') throw new Error('Error setting Invoice as payment Method for this Order.');

        // parameters to validate basket for payment
        const validatePaymentData = {
          adjustmentsAllowed: true,
          scopes: [
            'Payment',
          ],
        };
        // validating basket for payment
        const validatingBasketForPayment = await validateBasket(validatePaymentData);

        if (validatingBasketForPayment?.status !== 'success') throw new Error('Invalid Basket');

        const invoiceNumberValue = document.querySelector('#invoiceNumber')?.value?.trim();
        if (invoiceNumberValue) {
          const creatingInvoiceNumber = await createPoNumber(invoiceNumberValue);
          if (creatingInvoiceNumber?.status !== 'success') {
            throw new Error('Error creating invoice number.');
          }
        }

        if (getBasketForOrder?.status !== 'success') {
          throw new Error('Error getting basket.');
        }

        const basketId = getBasketForOrder?.data?.data?.id;
        const submittingOrder = await submitOrder(basketId, 'invoice');
        const orderId = submittingOrder?.data?.data?.id;

        if (!orderId) {
          throw new Error('Error submitting order.');
        }

        sessionStorage.setItem('submittedOrderData', JSON.stringify(submittingOrder));
        sessionStorage.removeItem('productDetailObject');
        sessionStorage.removeItem('basketData');

        window.location.href = `${submittedOrderUrl}${orderId}`;
      }

      /*
      *
      * :::::::::; handle stripe payment ::::::::
      */
      if (getSelectedPaymentMethod?.value === 'stripe') {
        showPreLoader();

        /*
        *
        :::::::::::
        Getting Stripe Instance
        ::::::::::
        *
        */
        const stripe = getStripeInstance();
        const paymentMethod = 'STRIPE_PAYMENT';

        const selectedStripeMethod = sessionStorage.getItem('selectedStripeMethod');

        const useStripeCardId = sessionStorage.getItem('useStripeCardId');

        /*
        *
        *
          ::::::::
          handle stripe payment for saved/new card
          :::::::::
        *
        */
        if (!useStripeCardId && selectedStripeMethod === 'savedCard') throw new Error('Please Select Payment Method');

        // Call setup-intent API to confirm setup for new card
        let settingIntent;
        const elements = getStripeElements();

        if (selectedStripeMethod === 'newCard' || !selectedStripeMethod) {
          /*
          *
          :::::::::::
          Get Payment Intent
          ::::::::::
          *
          */
          const getPaymentIntentData = await getPaymentIntent();
          if (getPaymentIntentData?.status !== 'success') throw new Error('Error Processing Request');
        }

        /*
        *
        :::::::::::
        Post Payment Intent
        ::::::::::
        *
        */
        const postingIntent = await postPaymentIntent();
        if (postingIntent?.status !== 'success') throw new Error('Error Processing Request');

        if (selectedStripeMethod === 'newCard' || !selectedStripeMethod) {
          /*
          *
          :::::::::::
          Post Setup Intent
          ::::::::::
          *
          */
          settingIntent = await postSetupIntent();
          if (settingIntent?.status !== 'success') throw new Error('Error Processing.');
        }
        /*
        *
        :::::::::::
        Creating Instrument
        ::::::::::
        *
        */
        // eslint-disable-next-line max-len
        const createInstrument = await createPaymentInstrument(paymentMethod, postingIntent?.data?.id, postingIntent?.data?.client_secret);
        if (createInstrument?.status !== 'success') throw new Error('Failed to create payment instrument.');

        const instrumentId = createInstrument?.data?.data?.id;
        if (!instrumentId) throw new Error('Instrument ID missing.');

        /*
        *
        :::::::::::
        Assigning Instrument
        ::::::::::
        *
        */
        const assignInstrument = await assignPaymentInstrument(instrumentId);
        if (assignInstrument?.status !== 'success') throw new Error('Failed to assign payment instrument.');

        // parameters to validate basket for payment
        const validateBasketData = {
          adjustmentsAllowed: true,
          scopes: [
            'Payment',
          ],
        };

        /*
        *
        :::::::::::
        validating basket
        ::::::::::
        *
        */
        const validatingBasketForPayment = await validateBasket(validateBasketData);

        if (validatingBasketForPayment?.status !== 'success') throw new Error('Invalid Basket');
        let confirmPM = '';

        if (selectedStripeMethod === 'savedCard') {
          /*
          *
          :::::::::::
          confirm payment method ::::
          ::::::::::
          *
          */
          const getPreConfirmedPI = await getPaymentIntent();
          if (getPreConfirmedPI?.status !== 'success') throw new Error('Failed to get payment intent.');

          // eslint-disable-next-line max-len
          const getPreConfirmedPIData = getPreConfirmedPI?.data?.data?.filter((dat) => dat?.id === useStripeCardId);
          if (!getPreConfirmedPIData) throw new Error('Payment intent ID missing.');
          confirmPM = getPreConfirmedPIData[0]?.id;
        }
        /*
        *
        :::::::::::
        confirm setup ::::
        ::::::::::
        *
        */
        if (selectedStripeMethod === 'newCard' || !selectedStripeMethod) {
          const confirmingSetup = await confirmSetup(stripe, elements, `${window.location.origin}/payment`);

          // if stripe setup confirmed, move to confirm payment
          const confirmSetupStatus = confirmingSetup?.setupIntent?.status;
          // if stripe setup confirmed, move to confirm payment
          confirmPM = confirmingSetup?.setupIntent?.payment_method;
          const validConfirmStatus = ['succeeded', 'requires_action'];
          if (!validConfirmStatus.includes(confirmSetupStatus)) {
            throw new Error('Error Processing Payment');
          }
        }
        let confirmingPayment = '';
        if (selectedStripeMethod === 'savedCard') {
          /*
          *
          :::::::::::
          confirm payment :::: final step
          ::::::::::
          *
          */
          confirmingPayment = await confirmPayment(stripe, postingIntent?.data?.client_secret, `${window.location.origin}/payment`, confirmPM);
        }
        if (confirmingPayment?.error) throw new Error(`Error: ${confirmingPayment.error.message}`);

        /*
        *
        :::::::::::
        validating confirm-payment status
        ::::::::::
        *
        */
        const status = confirmingPayment?.paymentIntent?.status;
        const validStatuses = ['succeeded', 'requires_capture', 'processing'];
        if (!validStatuses.includes(status)) throw new Error('Invalid payment status.');

        const paymentMethodId = confirmingPayment?.paymentIntent?.payment_method;

        // Call get payment-intent API

        const getConfirmedPI = await getPaymentIntent();
        if (getConfirmedPI?.status !== 'success') throw new Error('Failed to get payment intent.');
        // eslint-disable-next-line max-len
        const getConfirmedPID = getConfirmedPI?.data?.data?.filter((dat) => dat?.id === paymentMethodId);
        if (!getConfirmedPID) throw new Error('Payment intent ID missing.');
        // Remove email from the first item
        if (getConfirmedPID[0]?.billing_details?.email) {
          delete getConfirmedPID[0]?.billing_details?.email;
        }

        // add selected card to order
        const updatingCardData = {
          name: 'SelectedCard',
          value: JSON.stringify(getConfirmedPID[0]),
          type: 'String',
        };
        const addingCardData = {
          name: 'SelectedCard',
          value: JSON.stringify(getConfirmedPID[0]),
          type: 'String',
        };
        const updateCardToOrder = await updateCardForOrder(updatingCardData);

        if (updateCardToOrder?.status !== 'success') {
          const addingCardForOrder = await addCardToOrder(addingCardData);
          if (addingCardForOrder?.status !== 'success') throw new Error('Error Processing Request');
        }

        if (getBasketForOrder?.status !== 'success') throw new Error('Failed to get basket.');

        // payment confirmed from Stripe, now submitting order

        const submittingOrder = await submitOrder(getBasketForOrder?.data?.data?.id, 'stripe');
        const orderId = submittingOrder?.data?.data?.id;
        if (!orderId) throw new Error('Order submission failed.');

        sessionStorage.setItem('submittedOrderData', JSON.stringify(submittingOrder));
        sessionStorage.removeItem('productDetailObject');
        sessionStorage.removeItem('basketData');
        sessionStorage.removeItem('useAddress');
        sessionStorage.removeItem('useStripeCardId');
        sessionStorage.removeItem('selectedStripeMethod');

        window.location.href = `${submittedOrderUrl}${orderId}`;

        return true;
      }
    }
    if (checkoutWrapper?.classList.contains('pointer-events-none')) {
      checkoutWrapper.classList.remove('pointer-events-none');
    }
    return true;
  } catch (error) {
    if (checkoutProgressBar?.classList.contains('hidden')) {
      checkoutProgressBar.classList.remove('hidden');
    }
    if (checkoutWrapper?.classList.contains('pointer-events-none')) {
      checkoutWrapper.classList.remove('pointer-events-none');
    }
    removePreLoader();
    showNotification(error.message || 'Error Processing Request.', 'error');
    // silentNavigation('/us/en/e-buy/addresses');
    return false;
  }
};

/*
::::::::::::::
generate the  address form
.::::::::::::::

* @param {Object} data. The data object for edit form
* @param {String} type. Form type ( shipping / billing )
*/
export async function addressForm(type, data = {}) {
  const countriesData = await getCountries();

  let countriesList = [];
  let statesList = [];
  let statesData = '';
  if (data && countriesData?.status === 'success') {
    statesData = await getStates(data?.countryCode);

    if (statesData?.status === 'success') {
      statesList = statesData?.data?.data ?? [];
    }
  }
  if (countriesData?.status === 'success') {
    countriesList = countriesData?.data?.data ?? [];
  }

  const adressForm = form(
    {
      id: `${type}AddressForm`,
      class: `${type}-address-form text-sm w-full box-border overflow-hidden rounded-xl`,
      action: '',
      method: 'POST',
    },
    div(
      {
        class: 'form-title flex  gap-2',
      },
      h3(
        {
          class: 'justify-start text-black text-2xl font-normal  leading-loose',
        },
        `Add new ${type} address`,
      ),
    ),
    buildInputElement(
      'firstName',
      'First Name',
      'text',
      'firstName',
      false,
      true,
      'firstName',
      data ? data.firstName : '',
    ),
    buildInputElement(
      'lastName',
      'Last Name',
      'text',
      'lastName',
      false,
      true,
      'lastName',
      data ? data.lastName : '',
    ),
    buildInputElement(
      'companyName2',
      'Company Name',
      'text',
      'companyName2',
      false,
      true,
      'companyName2',
      data ? data.companyName2 : '',
    ),
    buildInputElement(
      'addressLine1',
      'Street Address',
      'text',
      'addressLine1',
      false,
      true,
      'addressLine1',
      data ? data.addressLine1 : '',
      data ? '' : '!w-full',
    ),
    buildInputElement(
      'addressLine2',
      'Street Address Line 2',
      'text',
      'addressLine2',
      false,
      false,
      'addressLine2',
      data ? data.addressLine2 : '',
      data ? '' : 'hidden',
    ),
    buildInputElement(
      `preferred${capitalizeFirstLetter(type)}Address`,
      '',
      'hidden',
      `preferred${capitalizeFirstLetter(type)}Address`,
      false,
      false,
      `preferred${capitalizeFirstLetter(type)}Address`,
      true,
      '!hidden',
    ),
    buildCountryStateSelectBox(
      'countryCode',
      'Country / Region',
      'countryCode',
      true,
      'countryCode',
      countriesList,
      data?.countryCode ?? '',
      data ? '' : 'hidden',
    ),
    buildCountryStateSelectBox(
      'mainDivision',
      'State',
      'mainDivision',
      true,
      'mainDivision',
      statesList,
      data?.mainDivision ?? '',
      data ? '' : 'hidden',
    ),
    buildInputElement(
      'city',
      'City',
      'text',
      'city',
      false,
      true,
      'city',
      data ? data.city : '',
      data ? '' : 'hidden',
    ),
    buildInputElement(
      'postalCode',
      'Zipcode',
      'text',
      'postalCode',
      false,
      true,
      'postalCode',
      data ? data.postalCode : '',
      data ? '' : 'hidden',
    ),
    buildButton(
      'Save',
      `save${capitalizeFirstLetter(type)}Address`,
      ' proceed-button text-xl  border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
    ),
  );
  /*
::::::::::::::::
get save address form buttonl...
:::::::::::::::::
*/
  const saveAddressButton = adressForm.querySelector(
    `#save${capitalizeFirstLetter(type)}Address`,
  );
  /*
::::::::::::::::
get counrty field and attach change event listener to populate states based on country code
:::::::::::::::::
*/
  const selectedCountry = adressForm.querySelector('#countryCode');
  selectedCountry?.addEventListener('change', async (event) => {
    showPreLoader();
    const selectedCountryCode = event.target.value;
    const getCountryStates = await getStates(selectedCountryCode);
    const getStatesField = adressForm.querySelector('#mainDivision');
    getStatesField.innerHTML = '';
    getCountryStates?.data?.data?.forEach((stateData) => {
      const stateOption = document.createElement('option');
      stateOption.value = stateData.id;
      stateOption.textContent = stateData.name;
      if (getStatesField) {
        getStatesField.appendChild(stateOption);
      }
    });
    removePreLoader();
  });
  adressForm?.querySelectorAll('label')?.forEach((lab) => {
    if (lab?.classList.contains('pl-4')) {
      lab.classList.remove('pl-4');
    }
  });
  // actions when save address button is clicked
  saveAddressButton?.addEventListener('click', async (event) => {
    event.preventDefault();
    showPreLoader();

    try {
      /*
       ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
       submitting form
       :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
       */

      const formToSubmit = document.querySelector(`#${type}AddressForm`);

      const formData = new FormData(formToSubmit);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      /*
       ::::::::::::::
       key to  set address as preferred billing or shipping address
       default${capitalizeFirstLetter(type)}AddressFormModal
       used for initial shipping and billing form
       ::::::::::::::
       */

      const isDefaultSBForm = formToSubmit?.classList.contains(`default${capitalizeFirstLetter(type)}AddressFormModal`);
      if (!isDefaultSBForm) {
        if (data) {
          delete formObject[`preferred${capitalizeFirstLetter(type)}Address`];
          Object.assign(formObject, {
            id: data.id,
            type: 'MyAddress',
            urn: data.urn,
          });
        } else {
          delete formObject[`preferred${capitalizeFirstLetter(type)}Address`];
        }
      }

      /*
       ::::::::::::::
       set the address as shipping or biling
       ::::::::::::::
       */
      const checkSameAsShippingCheckbox = document.querySelector('#shippingAsBillingAddress');
      const sameAsShipping = checkSameAsShippingCheckbox?.value === 'false' ? 'no' : 'yes';

      if (type === 'shipping') {
        if (isDefaultSBForm && sameAsShipping === 'yes') {
          formObject.preferredBillingAddress = 'true';
        }
        formObject.usage = [sameAsShipping === 'yes', true];
      } else if (type === 'billing') {
        if (isDefaultSBForm) {
          formObject.preferredBillingAddress = 'true';
        }
        formObject.usage = [true, false];
      } else {
        formObject.usage = [];
      }
      const method = data ? 'PUT' : 'POST';
      /*
      :::::::::::::::::::::
      submits the form
      ::::::::::::::::::::::::::::::::::::
      */

      const addAddressResponse = await submitForm(
        `${type}AddressForm`,
        'customers/-/myAddresses',
        method,
        formObject,
      );

      if (addAddressResponse?.status === 'success') {
        if (addAddressResponse?.data?.type === 'Link') {
          formToSubmit.classList.add('hidden');
          const showDefaultAddress = document.querySelector(
            `#${type}AddressHeader`,
          );

          const shippingAsBillingAddressCheckBox = document.querySelector(
            '#shippingAsBillingAddress',
          );
          shippingAsBillingAddressCheckBox?.parentElement.removeAttribute(
            'style',
          );

          saveAddressButton.insertAdjacentElement(
            'afterend',
            p(
              {
                class: 'text-green-500 font-medium pl-6 text-ll',
              },
              'Address Added Successfully.',
            ),
          );

          if (isDefaultSBForm) {
            /*
            ::::::::::::::::
            set default address starts
            ::::::::::::::
            */
            if (showDefaultAddress) {
              const addressURI = addAddressResponse?.data?.title?.split(':')[4];
              const address = await getAddressDetails(
                `customers/-/addresses/${addressURI}`,
                type,
              );

              const renderDefaultAddress = defaultAddress(address, type);
              if (showDefaultAddress && renderDefaultAddress) {
                /*
                  ::::::::::::::
                  set this address as default address
                  :::::::::::::
                  */
                showDefaultAddress.insertAdjacentElement(
                  'afterend',
                  renderDefaultAddress,
                );
                if (renderDefaultAddress.classList.contains('hidden')) {
                  renderDefaultAddress.classList.remove('hidden');
                }

                /*
                   ::::::::::::::
                   assign address to backet
                   ::::::::::::::::::
                   */
                await setUseAddress(addressURI, type);
                /*
                   ::::::::::::::
                   assign address to backet
                   ::::::::::::::::::
                   */
                if (sameAsShipping === 'yes' && type === 'shipping') {
                  await setUseAddress(addressURI, 'billing');
                }

                /*
                   ::::::::::::::
                   update basket details with the latest address
                   ::::::::::::::::::
                   */

                await updateBasketDetails();
              }
            }
          }
          /*
           ::::::::::::::
           update address list
           ::::::::::::::
           */
          await updateAddresses();

          /*
             ::::::::::::::
             set default address ends
             ::::::::::::::
             */
        } else if (
          addAddressResponse
          && addAddressResponse.data.type === 'Address'
        ) {
          formToSubmit.classList.add('hidden');

          /*
        ::::::::::::::
        update address list
        ::::::::::::::
        */
          await updateAddresses();
          /*
           ::::::::::::::
           update address list
           ::::::::::::::
           */
          await updateAddresses();

          removePreLoader();
          showNotification('Address updated successfully.', 'success');
        } else {
          throw new Error('Error Submitting form.');
        }
        /*
          ::::::::::::::
          close utility modal
          ::::::::::::::
          */
        closeUtilityModal();
      } else {
        throw new Error('Error Submitting form.');
      }
    } catch (error) {
      /*
          ::::::::::::
          remove preloader
          :::::::::::::
          */
      removePreLoader();
      showNotification(error.message, 'error');
    }
  });

  return adressForm;
}

/*
*
*
:::::::::::::::
 generates the checkout summary module.......
 ::::::::::::::::::
 *
 *
 */
export async function checkoutSummary(orderId = '') {
  /*
 ::::::::::::::::
 store config to use some predefined set of rules/values
 :::::::::::::::::::::::::::::
 */
  const storeConfigurations = await getStoreConfigurations();
  /*
:::::::::::::::
get price type if its net or gross
....:::::::::::::::::::
*/
  const checkoutPriceType = storeConfigurations?.pricing?.priceType ?? 'net';
  const currencyCode = '$';
  let getCheckoutSummaryData = '';
  let discountCode = '';
  let discountLabelData = '';
  let discountDetails = '';
  let discountPromoCode = '';
  let discountLabel = '';
  let discountPrice = '';
  let checkoutSummaryData = false;
  let userLoggedInStatus = false;
  if (orderId !== '') {
    getCheckoutSummaryData = JSON.parse(sessionStorage.getItem('submittedOrderData'));

    if (getCheckoutSummaryData?.status === 'success') {
      checkoutSummaryData = getCheckoutSummaryData.data.data;
      discountCode = getCheckoutSummaryData?.data?.data?.discounts?.valueBasedDiscounts?.[0]
        ?? '';
      discountDetails = getCheckoutSummaryData?.data?.included?.discounts[`${discountCode}`]
        ?? '';
      discountPromoCode = discountDetails?.promotion ?? '';
      discountLabelData = await getPromotionDetails(discountPromoCode);

      if (discountLabelData?.status === 'success') {
        discountLabel = discountLabelData?.data?.name ?? '';
        discountPrice = discountDetails?.amount[`${checkoutPriceType}`]?.value ?? '';
      }
    }
  } else {
    getCheckoutSummaryData = await getBasketDetails();
    if (getCheckoutSummaryData?.status === 'success') {
      checkoutSummaryData = getCheckoutSummaryData.data.data;
      discountCode = getCheckoutSummaryData?.data?.data?.discounts?.valueBasedDiscounts?.[0]
        ?? '';
      discountDetails = getCheckoutSummaryData?.data?.included?.discounts[`${discountCode}`]
        ?? '';
      discountPromoCode = discountDetails?.promotion ?? '';
      discountLabelData = await getPromotionDetails(discountPromoCode);

      if (discountLabelData?.status === 'success') {
        discountLabel = discountLabelData?.data?.name ?? '';
        discountPrice = discountDetails?.amount[`${checkoutPriceType}`]?.value ?? '';
      }
    }
  }

  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  if (authenticationToken.user_type === 'guest') {
    userLoggedInStatus = false;
  } else {
    userLoggedInStatus = true;
  }

  /*
::::::::::::::
 common function to get key value from checout summary object
 ::::::::::::::::::::::::::::
  */
  const getTotalValue = (type) => {
    const totalValue = `${checkoutSummaryData?.totals[type][
      checkoutPriceType === 'net' ? 'net' : 'gross'
    ]?.value ?? ''
      }`;
    return totalValue > 0 ? `${currencyCode}${totalValue}` : '$0';
  };

  /*
  ::::::::::::::
  map the data from checkout summary (basket) to the keys.
  ::::::::::::::
  */
  let checkoutSummaryKeys = {};
  if (orderId !== '') {
    checkoutSummaryKeys = {
      totalProductQuantity: checkoutSummaryData?.totalProductQuantity || '$0',
      undiscountedItemTotal: checkoutSummaryData?.totals?.undiscountedItemTotal
        ? getTotalValue('undiscountedItemTotal')
        : '',
      itemTotal: checkoutSummaryData?.totals?.itemTotal
        ? getTotalValue('itemTotal')
        : '$0',
      undiscountedShippingTotal: checkoutSummaryData?.totals
        ?.undiscountedShippingTotal
        ? getTotalValue('undiscountedShippingTotal')
        : '',
      shippingTotal: checkoutSummaryData?.totals?.shippingTotal
        ? getTotalValue('shippingTotal')
        : '$0',
      total: checkoutSummaryData?.totals?.grandTotal
        ? getTotalValue('grandTotal')
        : '$0',
      tax: checkoutSummaryData?.totals?.grandTotal
        ? `${currencyCode}${checkoutSummaryData?.totals?.grandTotal?.tax?.value ?? ''
        }`
        : '$0',
      taxExempt: '',
      discountPrice: discountPrice ? `${currencyCode}${discountPrice}` : '',
      discountLabel,
      totalLineItems: checkoutSummaryData?.lineItems?.length ?? '0',
    };
  } else {
    checkoutSummaryKeys = {
      totalProductQuantity: checkoutSummaryData?.totalProductQuantity || '$0',
      undiscountedItemTotal: checkoutSummaryData?.totals?.undiscountedItemTotal
        ? getTotalValue('undiscountedItemTotal')
        : '',
      itemTotal: checkoutSummaryData?.totals?.itemTotal
        ? getTotalValue('itemTotal')
        : '$0',
      undiscountedShippingTotal: checkoutSummaryData?.totals
        ?.undiscountedShippingTotal
        ? getTotalValue('undiscountedShippingTotal')
        : '',
      shippingTotal: checkoutSummaryData?.totals?.shippingTotal
        ? getTotalValue('shippingTotal')
        : '$0',
      total: checkoutSummaryData?.totals?.grandTotal
        ? getTotalValue('grandTotal')
        : '$0',
      tax: checkoutSummaryData?.totals?.grandTotal
        ? `${currencyCode}${checkoutSummaryData?.totals?.grandTotal?.tax?.value ?? ''
        }`
        : '$0',
      taxExempt: '',
      discountPrice: discountPrice ? `${currencyCode}${discountPrice}` : '',
      discountLabel,
      totalLineItems: checkoutSummaryData?.lineItems?.length ?? '0',
    };
  }
  const loggedOutUserDiv = div(
    {
      class: 'inline-flex flex-col gap-4',
    },
    div(
      {
        class: 'w-80 justify-start text-black text-3xl font-semibold  leading-10',
      },
      'Let’s get started',
    ),

    button(
      {
        class: 'h-12 btn btn-lg btn-primary-purple rounded-full px-6',
      },
      'Login / Create Account',
    ),
    hr({
      class: 'border-black-300',
    }),
    div({
      class: '',
    }),
  );
  loggedOutUserDiv?.querySelector('button')?.addEventListener('click', () => {
    window.location.href = '/us/en/e-buy/login';
  });

  /*
  :::::::::::::
  generate checkout summary  module
  ::::::::::::::::::::::::::::::
  */
  const summaryModule = div(
    {
      id: 'checkoutSummaryContainer',
      class: 'flex flex-col justify-start items-start gap-4 w-full',
    },
    div(
      {
        class:
          'p-5 flex flex-col bg-white p-6 border-l border-r border-t border-danahergray-75 border-b-4 justify-start items-start gap-y-6 w-full',
        id: 'checkoutSummaryWrapper',
      },
      div(
        {
          class: 'w-full flex flex-col justify-start items-start gap-4',
        },
        div(
          {
            class:
              'checkout-summary-subtotal  flex justify-between w-full gap-9',
            id: 'checkoutSummarySubtotal',
          },
          /*
 ::::::::::::
 subtotal
 ::::::::::::::::::
   */ span(
            {
              class: ' justify-start text-black text-base font-semibold ',
            },
            'Subtotal',
          ),
          span(
            {
              class:
                ' text-right flex flex-col justify-start text-black text-base font-semibold ',
            },
            strong(
              {
                class: '',
              },
              checkoutSummaryKeys.itemTotal,
            ),
            strong(
              {
                class:
                  'line-through decoration-danaherpurple-500 text-extralight font-normal',
              },
              checkoutSummaryKeys.undiscountedItemTotal
                !== checkoutSummaryKeys.itemTotal
                ? checkoutSummaryKeys.undiscountedItemTotal
                : '',
            ),
          ),
        ),
        /*
 ::::::::::::
 discount
 ::::::::::::::::::
   */ div(
          {
            class: 'checkoutSummaryDiscount  flex justify-between w-full',
            id: 'checkoutSummaryDiscount',
          },
          span(
            {
              class:
                ' justify-start text-black text-base text-right  ',
            },
            'Discount',
          ),
          div(
            {
              class: ' flex flex-col',
            },
            span(
              {
                class: 'text-right text-black text-base  ',
              },
              checkoutSummaryKeys.discountPrice,
            ),
            span(
              {
                class:
                  ' w-full text-right  text-gray-500 text-xs font-normal leading-none',
              },
              checkoutSummaryKeys.discountLabel,
            ),
          ),
        ),
        /*
 ::::::::::::
 sales tax
 ::::::::::::::::::
   */
        div(
          {
            class: 'checkoutSummaryTax  flex justify-between w-full gap-4',
            id: 'checkoutSummaryTax',
          },
          div(
            {
              class: ' flex justify-start items-start gap-4',
            },
            span(
              {
                class:
                  'w-20 justify-start text-black text-base  ',
              },
              'Sales Tax*',
            ),
            span(
              {
                id: 'checkoutSummaryTaxExempt',
                class:
                  `text-right text-violet-600 text-sm cursor-pointer hidden text-danaherpurple-500 hover:text-danaherpurple-800 font-normal underline ${window.location.pathname.includes('ordersubmit') ? 'hidden' : ''}`,
              },
              'Tax exempt?',
            ),
          ),
          span(
            {
              class:
                ' text-right justify-start text-black text-base  ',
            },
            checkoutSummaryKeys.tax,
          ),
        ),
        /*
 ::::::::::::
 shipping costs
 ::::::::::::::::::
   */ div(
          {
            class:
              'checkout-summary-shipping flex justify-between w-full gap-4',
            id: 'checkoutSummaryShipping',
          },
          span(
            {
              class: 'w-20 justify-start text-black text-base  ',
            },
            'Shipping*',
          ),
          span(
            {
              class:
                ' text-right flex flex-col justify-start text-black text-base  ',
            },
            strong(
              {
                class: '',
              },
              checkoutSummaryKeys.shippingTotal,
            ),
            strong(
              {
                class:
                  'line-through decoration-danaherpurple-500 text-extralight font-normal',
              },
              checkoutSummaryKeys.undiscountedShippingTotal
                !== checkoutSummaryKeys.shippingTotal
                ? checkoutSummaryKeys.undiscountedShippingTotal
                : '',
            ),
          ),
        ),
      ),
      /*
 ::::::::::::
 total
 ::::::::::::::::::
   */
      div(
        {
          class:
            'checkout-summary-total border-t justify-between flex w-full  border-gray-200 border-solid pt-6',
          id: 'checkoutSummaryTotal',
        },
        span(
          {
            class: ' justify-start text-black text-xl font-semibold ',
          },
          `Total (${checkoutSummaryKeys.totalLineItems} items)`,
        ),
        span(
          {
            class: ' text-right justify-start text-black text-xl font-semibold ',
          },
          checkoutSummaryKeys.total,
        ),
      ),
      /*
 ::::::::::::
 proceed button
 ::::::::::::::::::
   */
      div(
        {
          class:
            'flex flex-col justify-center w-full items-start gap-4',
        },
        button({
          class: `proceed-button w-full text-white text-xl  btn btn-lg font-medium btn-primary-purple rounded-full px-6 ${((authenticationToken.user_type === 'guest') || window.location.pathname.includes('order')) ? 'hidden' : ''} `,
          id: 'proceed-button',
          'data-tab': 'shippingMethods',
          'data-activetab': 'shippingAddress',
        }),
        div(
          {
            class:
              'w-full justify-start text-black-500 text-xs font-normal leading-none',
          },
          '*estimated sales tax. Additional tax may apply upon actual calculation of order',
        ),
      ),
    ),
  );

  /*
 ::::::::::::
 button to change steps when clicked on proceed or step icon
 ::::::::::::::::::
   */
  const proceedButton = summaryModule.querySelector('#proceed-button');
  if (proceedButton) {
    if (window.location.href.includes('cartlanding') && userLoggedInStatus) {
      proceedButton.textContent = 'Proceed to Checkout';
    } else {
      /*
      ::::::::::::::
      Update checkout summary button
      ::::::::::::::
      */
      const currentPath = window.location.pathname;
      if (currentPath.includes('address')) proceedButton.textContent = 'Proceed to Shipping';
      if (currentPath.includes('shipping')) {
        proceedButton.textContent = 'Proceed to Payment';
        proceedButton?.setAttribute('data-activetab', 'shippingMethod');
        proceedButton?.setAttribute('data-tab', 'payment');
      }
      if (currentPath.includes('payment')) {
        proceedButton.textContent = 'Place your order';
        proceedButton?.setAttribute('data-activetab', 'submitOrder');
        proceedButton?.setAttribute('data-tab', 'submitOrder');
      }
    }
    proceedButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.location.pathname.includes('cartlanding')) {
        window.location.href = '/us/en/e-buy/addresses';
      } else {
        changeStep(e);
      }
    });
  }
  const checkoutSummaryWrapper = summaryModule.querySelector(
    '#checkoutSummaryWrapper',
  );
  if (checkoutSummaryWrapper) {
    if (window.location.href.includes('cartlanding')) {
      if (!userLoggedInStatus) {
        checkoutSummaryWrapper.insertAdjacentElement(
          'afterbegin',
          loggedOutUserDiv,
        );
      }
    }
    const getUseAddressesResponse = await getUseAddresses();

    if (getUseAddressesResponse) {
      /*
 ::::::::::::
 check if billing address exists in basket and not same as the shipping address
 ::::::::::::::::::
   */
      if (window.location.pathname.includes('shipping') || window.location.pathname.includes('payment')
      ) {
        const invoiceToAddress = div(
          {
            id: 'checkoutSummaryCommonBillToAddress',
            class:
              'flex-col w-full border-solid bg-white border border-danahergray-75 p-6',
          },
          div(
            {
              class: ' flex flex-col pb-2',
            },
            h5(
              {
                class: 'font-semibold p-0 mb-3 mt-0 text-base',
              },
              'Bill to Address',
            ),
            div(
              {
                class: 'p-3 border border-danahergray-300',
              },
              h5(
                {
                  class: `font-normal m-0 p-0 ${getUseAddressesResponse?.data?.invoiceToAddress
                    ?.companyName2
                    ? ''
                    : 'hidden'
                    }`,
                },
                getUseAddressesResponse?.data?.invoiceToAddress?.companyName2
                ?? '',
              ),
              p(
                {
                  class: 'text-black text-base  m-0 p-0',
                },
                getUseAddressesResponse?.data?.invoiceToAddress?.addressLine1
                ?? '',
              ),
              p(
                {
                  class: 'text-black text-base  m-0 p-0',
                },
                getUseAddressesResponse?.data?.invoiceToAddress?.city ?? '',
              ),
              p(
                {
                  class: 'text-black text-base  m-0 p-0',
                },
                `${getUseAddressesResponse?.data?.invoiceToAddress
                  ?.mainDivision ?? ''
                }, ${getUseAddressesResponse?.data?.invoiceToAddress
                  ?.countryCode ?? ''
                }, ${getUseAddressesResponse?.data?.invoiceToAddress?.postalCode
                ?? ''
                }`,
              ),
            ),
          ),
        );

        if (invoiceToAddress) {
          checkoutSummaryWrapper.insertAdjacentElement(
            'beforebegin',
            invoiceToAddress,
          );
        }
      }
      /*
 ::::::::::::
 check if shipping address exists in basket
 ::::::::::::::::::
   */
      if (getUseAddressesResponse?.data?.commonShipToAddress && (window.location.pathname.includes('shipping') || window.location.pathname.includes('payment'))) {
        const commonShipToAddress = div(
          {
            id: 'checkoutSummaryCommonShipAddress',
            class:
              'flex-col w-full border-solid border border-danahergray-75 bg-white p-6',
          },
          div(
            {
              class: ' flex flex-col pb-2',
            },
            h5(
              {
                class: 'font-semibold p-0 mb-3 mt-0 text-base',
              },
              'Shipping Address',
            ),
            div(
              {
                class: 'p-3 border border-danahergray-300',
              },
              h5(
                {
                  class: 'font-normal  m-0 p-0',
                },
                getUseAddressesResponse?.data?.commonShipToAddress
                  ?.companyName2 ?? '',
              ),
              p(
                {
                  class: 'text-black text-base  m-0 p-0',
                },
                getUseAddressesResponse?.data?.commonShipToAddress
                  ?.addressLine1 ?? '',
              ),
              p(
                {
                  class: 'text-black text-base  m-0 p-0',
                },
                getUseAddressesResponse?.data?.commonShipToAddress?.city ?? '',
              ),
              p(
                {
                  class: 'text-black text-base  m-0 p-0',
                },
                `${getUseAddressesResponse?.data?.commonShipToAddress
                  ?.mainDivision ?? ''
                }, ${getUseAddressesResponse?.data?.commonShipToAddress
                  ?.countryCode ?? ''
                }, ${getUseAddressesResponse?.data?.commonShipToAddress
                  ?.postalCode ?? ''
                }`,
              ),
            ),
          ),
        );
        if (commonShipToAddress) {
          checkoutSummaryWrapper.insertAdjacentElement(
            'beforebegin',
            commonShipToAddress,
          );
        }
      }
    }
  }

  const showShippingModalButton = summaryModule.querySelector('#showShippingModal');
  if (showShippingModalButton) {
    showShippingModalButton.addEventListener('click', (e) => {
      e.preventDefault();
      const shippingFormModal = addressForm('shipping', '');
      createModal(shippingFormModal, true, false);
    });
  }
  if (summaryModule) {
    const checkoutSummaryTaxExempt = summaryModule.querySelector(
      '#checkoutSummaryTaxExempt',
    );
    if (checkoutSummaryTaxExempt) {
      checkoutSummaryTaxExempt.addEventListener('click', () => {
        const taxModal = taxExemptModal();
        createModal(taxModal, false, true);
      });
    }
  }
  return summaryModule;
}
// update checkout summary wrapper on request
export async function updateCheckoutSummary() {
  const checkoutSummaryWrapper = document.querySelector(
    '#checkoutSummaryContainer',
  );
  if (checkoutSummaryWrapper) {
    const updatedCheckoutSummary = await checkoutSummary();
    checkoutSummaryWrapper.innerHTML = '';
    checkoutSummaryWrapper.append(updatedCheckoutSummary);
    return { status: 'success', data: 'updated checkout summary' };
  }
  return { status: 'error', data: 'Error updating checkout summary' };
}

// load module on navigation
async function loadingModule() {
  const checkoutModulesWrapper = document.querySelector('#checkoutModulesWrapper');
  const checkoutProgressBar = document.querySelector('#checkoutProgressBar');

  initializeModules()?.then(async (modules) => {
    // Append modules to container
    modules.forEach(async (module) => {
      if (module.getAttribute('id') !== 'checkout-details') {
        checkoutModulesWrapper.innerHTML = '';
        checkoutModulesWrapper?.appendChild(module);
        if (checkoutProgressBar?.classList.contains('hidden')) {
          checkoutProgressBar.classList.remove('hidden');
        }
        await updateCheckoutSummary();
        removePreLoader();
      }
    });
  });
}

// load cart items
export const cartItemsContainer = (cartItemValue) => {
  const modifyCart = async (type, element, value, eventParent) => {
    showPreLoader();
    if (type === 'delete-item') {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        manufacturer: cartItemValue.manufacturer,
        type,
      };
      const response = await updateCartItemQuantity(item);
      if (response.status === 'success') {
        const getProductDetailsObject = await getProductDetailObject();
        if (getProductDetailsObject) {
          getProductDetailsObject.data.forEach(
            (itemToBeDisplayed) => {
              const opcoBe = Object.keys(itemToBeDisplayed);
              // const str = `product-Quantity-${opcoBe[0]}`;
              // const parts = str.split('-');
              const logodivId = document.getElementById(
                `product-Quantity-${opcoBe[0]}`,
              );
              logodivId.innerHTML = ` ${itemToBeDisplayed[opcoBe[0]].length} Items`;
            },
          );
        }
        await updateCheckoutSummary();
        removePreLoader();
      } else {
        await updateCartItemQuantity(item);
        removePreLoader();
        showNotification('Product removed from cart', 'success');
      }
    } else {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        value,
        manufacturer: cartItemValue.manufacturer,
        type,
      };
      const response = await updateCartItemQuantity(item);
      if (response.status === 'success') {
        await updateCheckoutSummary();
        const totalpriceElement = eventParent.querySelector('.total-price');
        const unitPriceElement = eventParent.querySelector('.unit-price');
        const numericValue = Number(unitPriceElement.textContent.replace('$', ''));
        const totalPrice = totalpriceElement;
        const totalPricValue = item.value * numericValue;
        totalPrice.innerHTML = `$${totalPricValue}`;
        removePreLoader();
        element.blur(); // Removes focus from the input
      } else {
        // alert(response);
        removePreLoader();
        element.blur(); // Removes focus from the input
      }
    }
  };
  const deleteButton = button(
    {
      class: 'sm:w-[7.5rem] sm:h-[3.5rem] bg-white',
    },
    span({
      id: `delteItem-${cartItemValue.sku}`,
      class: 'icon icon-icons8-delete cart-delete',
    }),
  );
  deleteButton.addEventListener('click', () => {
    const inputValue = document.getElementById(cartItemValue.lineItemId);
    modifyCart('delete-item', inputValue, '');
  });
  const inputBox = input({
    // id: cartItemValue.lineItemId,
    class:
      'w-[3.5rem] h-10 pl-4 bg-white font-medium text-black border-solid border-2 inline-flex justify-center items-center',
    type: 'number',
    min: cartItemValue.minOrderQuantity,
    max:
      cartItemValue.maxOrderQuantity === 0 ? 99 : cartItemValue.maxOrderQuantity,
    name: 'item-quantity',
    value: cartItemValue.itemQuantity,
  });
  inputBox.addEventListener('change', (event) => {
    const eventParent = event.target.parentElement.parentElement.parentElement;

    const selectedDiv = document.getElementById(cartItemValue.lineItemId); // or any div reference
    const inputItem = selectedDiv.querySelector('input');
    const productItem = inputItem.parentElement.parentElement;

    const enteredValue = event.target.value;
    if (enteredValue < Number(inputItem.min)) {
      productItem.style.border = '2px solid red';
      // eslint-disable-next-line no-alert
      showNotification(`Please enter a valid order quantity which should be greater then ${inputItem.min} and less then ${inputItem.max}`, 'error');
      // alert(
      //  `Please enter a valid order quantity which
      // should be greater then ${inputItem.min} and less then ${inputItem.max}`,
      // );
    } else if (enteredValue > Number(inputItem.max)) {
      productItem.style.border = '2px solid red';
      // eslint-disable-next-line no-alert

      showNotification(`Please enter a valid order quantity which should be greater then ${inputItem.min} and less then ${inputItem.max}`, 'error');
      // alert(
      //   `Please enter a valid order quantity which should be
      //  greater then ${inputItem.min} and less then ${inputItem.max}`,
      // );
    } else {
      productItem.style.border = '';
      modifyCart('quantity-added', inputItem, event.target.value, eventParent);
    }
    // modifyCart("quantity-added", event.target.value);
  });
  const unitPriceDiv = () => {
    if (cartItemValue.listPrice.value !== cartItemValue.salePrice.value) {
      return div(
        {
          class: 'w-38 justify-start text-black text-base font-semibold',
        },
        div(
          {
            class:
              'w-38 justify-start text-gray-500 text-base font-semibold item line-through',
          },
          `$${cartItemValue.listPrice.value}`,
        ),
        div(
          {
            class:
              'unit-price w-38 justify-start text-black text-base',
          },
          `$${cartItemValue.salePrice.value}`,
        ),
      );
    }

    return div(
      {
        class: 'w-38 justify-start text-black text-base font-semibold',
      },
      //  div(
      //     {
      //       class:
      //         "w-full justify-start text-gray-500 text-base font-semibold item line-through",
      //     },
      //     `$${cartItemValue.listPrice.value}`
      //   ),
      div(
        {
          class:
            'unit-price w-38 justify-start text-black text-base',
        },
        `$${cartItemValue.salePrice.value}`,
      ),
    );
  };

  const itemsscontainer = div(
    {
      class:
        'w-full py-3 cart-item-wrapper border-t border-gray-300 inline-flex sm:flex-row flex-col justify-start items-center gap-1',
      id: cartItemValue.lineItemId,
    },
    div(
      {
        class: 'py-3 inline-flex gap-2 ',
      },
      div(
        {
          class: 'w-28 p-2 flex justify-start items-center gap-3 border border-solid border-gray-300',
        },
        div(
          {
            class: 'justify-start text-black text-base font-semibold truncate m-1',
          },
          img({
            class: 'w-full h-auto',
            src: cartItemValue.images ? cartItemValue.images[0].effectiveUrl : 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble',
          }),
        ),
      ),
      div(
        {
          class: 'sm:w-64 w-[11rem] flex flex-col justify-center items-center text-black text-base font-semibold',
          // id: `product-Quantity-${opcoBe[0]}`,
        },
        div(
          {
            class: 'w-full justify-start items-center text-black text-base font-semibold',
          },
          cartItemValue.productName,
        ),
        div(
          {
            class:
              'w-full justify-start items-center text-gray-500 text-sm font-normal ',
          },
          cartItemValue.sku,
        ),

      ),
    ),
    div(
      {
        class: 'sm:pl-0 pl-3 inline-flex justify-start items-center',
      },
      div(
        {
          class: 'w-24 justify-start text-black text-base font-semibold',
        },
        inputBox,
      ),

      unitPriceDiv(),
      div(
        {
          class: 'total-price w-20 justify-start text-black text-base font-semibold sm:m-0 m-3',
          // id: 'total-price',
        },
        `$${cartItemValue.itemQuantity * cartItemValue.salePrice.value}`,
      ),
      deleteButton,
    ),

  );
  decorateIcons(itemsscontainer);
  return itemsscontainer;
};

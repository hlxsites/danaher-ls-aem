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
  assignPaymentInstrument, createPaymentInstrument, getPaymentIntent, loadStripe,
} from './stripe_utils.js';

const { getAuthenticationToken } = await import('./token-utils.js');
const baseURL = getCommerceBase();

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
        class: 'hidden sm:block w-48 justify-start text-black text-base font-semibold',
      },
      'Unit Price',
    ),
    div(
      {
        class: 'hidden sm:block w-[3rem] justify-start text-black text-base font-semibold',
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
        orderIdArray.push(response.data.data.id);
        sessionStorage.setItem(
          'userOrderDetails',
          JSON.stringify(orderIdArray),
        );
      } else {
        userOrderDetails.push(response.data.data.id);
        sessionStorage.setItem(
          'userOrderDetails',
          JSON.stringify(userOrderDetails),
        );
      }
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
      Object.assign(useAddressObject, { invoiceToAddress: addressDetails });
    }
    if (response?.data?.commonShipToAddress) {
      const commonShipToAddressURI = response.data.commonShipToAddress.split(':')[4];
      addressDetails = await getAddressDetails(
        `customers/-/addresses/${commonShipToAddressURI}`,
      );
      Object.assign(useAddressObject, {
        commonShipToAddress: addressDetails,
      });
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
export const setUseAddress = async (id, type) => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
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
 get addresses to be shown on ui
 ::::::::::::::::::::::::::::::::::::::::::::
 */
export async function getAddresses() {
  const cachedAddress = sessionStorage.getItem('addressList');
  return cachedAddress ? JSON.parse(cachedAddress) : updateAddresses();
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
    option({ value: '', selected: true }, 'Select an option'),
  );

  return div(
    { class: 'space-y-2 field-wrapper  mt-4' },
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
          'input-focus text-base w-full block px-2 py-4  border border-solid border-gray-300',
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
      class: 'flex w-full flex-col gap-[30px]',
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
/*
*
add selected card to order
*
*
*/

async function addCardToOrder(data = '') {
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
update selected card to order
*
*
*/

async function updateCardToOrder(data = '') {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  // post card payment intent
  const addCardToOrderUrl = `${baseURL}/baskets/current/attributes/SelectedCard`;
  const addCardToOrderHeaders = new Headers();
  addCardToOrderHeaders.append('Content-Type', 'Application/json');
  addCardToOrderHeaders.append('Accept', 'application/vnd.intershop.basket.v1+json');
  addCardToOrderHeaders.append(
    'authentication-token',
    authenticationToken.access_token,
  );
  const addCardToOrderBody = JSON.stringify(data);
  const response = await patchApiData(addCardToOrderUrl, addCardToOrderBody, addCardToOrderHeaders);
  if (response?.status === 'success') {
    return response;
  }
  return { status: 'error', data: {} };
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
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const currentTab = step?.target?.getAttribute('data-tab') || step?.getAttribute('data-tab');
  let validateData = '';
  if (currentTab === 'shippingMethods') {
    localStorage.setItem('activeCheckoutTab', currentTab);
    showPreLoader();
    validateData = {
      adjustmentsAllowed: true,
      scopes: [
        'InvoiceAddress',
        'ShippingAddress',
        'Addresses',
      ],
    };
  }

  if (currentTab === 'payment') {
    showPreLoader();
    localStorage.setItem('activeCheckoutTab', currentTab);
    validateData = {
      adjustmentsAllowed: true,
      scopes: [
        'InvoiceAddress',
        'ShippingAddress',
        'Addresses',
        'Shipping',
      ],
    };
  }
  if (currentTab === 'submitOrder') {
    validateData = '';
  }
  let validatingBasket = { status: 'success' };
  if (validateData !== '') {
    validatingBasket = await validateBasket(validateData);
  } if (validatingBasket?.status === 'error') {
    if (currentTab === 'payment') {
      removePreLoader();
      showNotification('Invalid Basket', 'error');
      return false;
    }

    if (currentTab === 'submitOrder') {
      const checkMethods = document
        .querySelector('#paymentMethodsWrapper input[type="radio"]:checked');

      if (!checkMethods) {
        showNotification('Please select Payment Method', 'error');
        return false;
      }
    }

    removePreLoader();
    showNotification('Invalid Basket', 'error');
    return false;
  }

  if (validatingBasket?.status === 'success' && currentTab === 'submitOrder') {
    const checkMethods = document
      .querySelector('#paymentMethodsWrapper input[type="radio"]:checked');

    if (!checkMethods) {
      removePreLoader();
      showNotification('Please select Payment Method', 'error');
      return false;
    }
    const getBasketForOrder = await getBasketDetails();
    const getSelectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (getSelectedPaymentMethod?.value === 'invoice') {
      showPreLoader();

      try {
        const url = `${baseURL}/baskets/current/payments/open-tender?include=paymentMethod`;
        const defaultHeaders = new Headers();
        defaultHeaders.append('Content-Type', 'application/json');
        defaultHeaders.append('authentication-token', authenticationToken.access_token);

        const data = JSON.stringify({ paymentInstrument: 'Invoice' });
        const setupInvoice = await putApiData(url, data, defaultHeaders);

        if (setupInvoice?.status !== 'success') {
          throw new Error('Error setting Invoice as payment Method for this Order.');
        }

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

        window.location.href = `/us/en/e-buy/ordersubmit?orderId=${orderId}`;
      } catch (err) {
        showNotification(err?.message || 'An unexpected error occurred.', 'error');
      } finally {
        removePreLoader();
      }
    }
    if (getSelectedPaymentMethod?.value === 'stripe' && validatingBasket?.status === 'success') {
      showPreLoader();
      const stripe = await loadStripe();
      const { stripeElements } = window;
      const elements = stripeElements;

      const pIID = sessionStorage.getItem('stripePIId');
      const cS = sessionStorage.getItem('stripeCS');
      const paymentMethod = 'STRIPE_PAYMENT';

      try {
        const createInstrument = await createPaymentInstrument(paymentMethod, pIID, cS);
        if (createInstrument?.status !== 'success') throw new Error('Failed to create payment instrument.');

        const instrumentId = createInstrument?.data?.data?.id;
        if (!instrumentId) throw new Error('Instrument ID missing.');

        const assignInstrument = await assignPaymentInstrument(instrumentId);
        if (assignInstrument?.status !== 'success') throw new Error('Failed to assign payment instrument.');

        const getPI = await getPaymentIntent();
        if (getPI?.status !== 'success') throw new Error('Failed to get payment intent.');

        // get payment intent id
        const gPIID = JSON.stringify(getPI?.data?.data[0]);
        if (!gPIID) throw new Error('Payment intent ID missing.');

        const addData = {
          name: 'SelectedCard',
          value: gPIID,
          type: 'String',
        };

        let addingCardToOrder = await addCardToOrder(addData);
        if (addingCardToOrder?.status === 'error') {
          addingCardToOrder = await updateCardToOrder(addData);
          if (addingCardToOrder?.status !== 'success') throw new Error('Failed to update card to order.');
        }

        const confirmPayment = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout`,
            payment_method_data: {
              billing_details: {
                name: 'John Doe',
                email: 'john@example.com',
                address: {
                  country: 'US',
                  line1: '123 Main St',
                  city: 'New York',
                  state: 'NY',
                  postal_code: '10001',
                },
              },
            },
          },
          redirect: 'if_required',
        });

        if (confirmPayment?.error) throw new Error(confirmPayment.error.message);

        const status = confirmPayment?.paymentIntent?.status;
        const validStatuses = ['succeeded', 'requires_capture', 'processing'];
        if (!validStatuses.includes(status)) throw new Error('Invalid payment status.');

        if (getBasketForOrder?.status !== 'success') throw new Error('Failed to get basket.');

        const submittingOrder = await submitOrder(getBasketForOrder?.data?.data?.id, 'stripe');
        const orderId = submittingOrder?.data?.data?.id;
        if (!orderId) throw new Error('Order submission failed.');

        sessionStorage.setItem('submittedOrderData', JSON.stringify(submittingOrder));
        sessionStorage.removeItem('productDetailObject');
        sessionStorage.removeItem('basketData');

        window.location.href = `/us/en/e-buy/ordersubmit?orderId=${orderId}`;
        return true;
      } catch (error) {
        removePreLoader();
        showNotification(error.message || 'Error Processing Payment.', 'error');
        return false;
      }
    }
  }
  const activateModule = document.querySelector(
    `#checkout-${currentTab}-module`,
  );

  const modules = document.querySelectorAll('.checkout-module');
  const segment1 = document.getElementById('checkout-segment1');
  const segment2 = document.getElementById('checkout-segment2');
  const proceedButton = document.querySelector('#proceed-button');

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

  // Persist active tab in localStorage
  localStorage.setItem('activeCheckoutTab', currentTab);

  /*
  ::::::::::::::
  Update line segments between steps
  ::::::::::::::
  */
  switch (currentTab) {
    case 'shippingAddress':
      segment1.style.width = '0';
      segment2.style.width = '0';
      document.querySelectorAll('.checkout-step')?.forEach((st) => {
        if (st?.classList.contains('active')) {
          st.classList.remove('active');
        }
        if (st.id === 'checkout-shippingAddress') {
          st.classList.add('active');
        }
      });
      proceedButton.setAttribute('data-tab', 'shippingMethods');
      proceedButton.setAttribute('data-activeTab', 'shippingAddress');
      proceedButton.textContent = 'Proceed to Shipping';
      break;
    case 'shippingMethods':
      segment1.style.width = '50%';
      segment2.style.width = '0';
      document.querySelectorAll('.checkout-step')?.forEach((st) => {
        if (st?.classList.contains('active')) {
          st.classList.remove('active');
        }
        if (st.id === 'checkout-shippingMethods') {
          st.classList.add('active');
        }
        if (st.id === 'checkout-shippingAddress') {
          st.classList.add('active');
        }
      });
      proceedButton.textContent = 'Proceed to Payment';
      proceedButton.setAttribute('data-activeTab', 'shippingMethods');
      proceedButton.setAttribute('data-tab', 'payment');
      break;
    case 'payment':
      segment1.style.width = '50%';
      segment2.style.width = '50%';

      document.querySelectorAll('.checkout-step')?.forEach((st) => {
        if (!st?.classList.contains('active')) {
          st.classList.add('active');
        }
      });
      proceedButton.setAttribute('data-activeTab', 'paymentMethods');
      proceedButton.setAttribute('data-tab', 'submitOrder');
      proceedButton.textContent = 'Place your order';
      break;
    case 'submitOrder':
      segment1.style.width = '50%';
      segment2.style.width = '50%';
      document.querySelectorAll('.checkout-step')?.forEach((st) => {
        if (!st?.classList.contains('active')) {
          st.classList.add('active');
        }
      });
      proceedButton.setAttribute('data-tab', 'submitOrder');
      proceedButton.setAttribute('data-activeTab', 'submitOrder');
      proceedButton.textContent = 'Place your order';
      break;
    default:
      segment1.style.width = '0';
      segment2.style.width = '0';
      proceedButton.setAttribute('data-tab', 'shippingMethods');
      proceedButton.setAttribute('data-activeTab', 'shippingAddress');
      proceedButton.textContent = 'Proceed to Shipping';
  }
  removePreLoader();
  return {};
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
    ),
    buildCountryStateSelectBox(
      'countryCode',
      'Country / Region',
      'countryCode',
      true,
      'countryCode',
      countriesList,
      data?.countryCode ?? '',
    ),
    buildCountryStateSelectBox(
      'mainDivision',
      'State',
      'mainDivision',
      true,
      'mainDivision',
      statesList,
      data?.mainDivision ?? '',
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
    ),
    buildButton(
      'Save',
      `save${capitalizeFirstLetter(type)}Address`,
      ' proceed-button text-xl  border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
    ),
  );
  /*
::::::::::::::::
get save address buttonl...
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
      const errorDiv = formToSubmit.querySelector('#addressFormErrorMessage');
      if (errorDiv) {
        errorDiv.remove();
      }
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

      if (
        !formToSubmit.classList.contains(
          `default${capitalizeFirstLetter(type)}AddressFormModal`,
        )
      ) {
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

      if (type === 'shipping') {
        formObject.usage = [false, true];
      } else if (type === 'billing') {
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

          if (
            formToSubmit.classList.contains(
              `default${capitalizeFirstLetter(type)}AddressFormModal`,
            )
          ) {
            /*
            ::::::::::::::::
            set default address starts
            ::::::::::::::
            */
            if (showDefaultAddress) {
              const addressURI = addAddressResponse.data.title.split(':')[4];
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

          // saveAddressButton.insertAdjacentElement(
          //   'afterend',
          //   p(
          //     {
          //       class: 'text-green-500 font-medium pl-6 text-l',
          //     },
          //     'Address Updated Successfully.',
          //   ),
          // );

          /*
        ::::::::::::::
        update address list
        ::::::::::::::
        */
          await updateAddresses();
          /*
            ::::::::::::
            remove preloader
            :::::::::::::
            */
          removePreLoader();
          showNotification('Address updated successfully.', 'success');
        } else {
          // saveAddressButton.insertAdjacentElement(
          //   'afterend',
          //   p(
          //     {
          //       id: 'addressFormErrorMessage',
          //       class: 'text-red-500 font-medium pl-6 text-l text-center',
          //     },
          //     'Error submitting address.',
          //   ),
          // );
          /*
            ::::::::::::
            remove preloader
            :::::::::::::
            */
          removePreLoader();
          showNotification('Error submitting address.', 'error');
        }
        /*
          ::::::::::::::
          close utility modal
          ::::::::::::::
          */
        closeUtilityModal();
      } else {
        saveAddressButton.insertAdjacentElement(
          'afterend',
          p(
            {
              class: 'text-red-500 pl-6 font-medium text-l',
              id: 'addressFormErrorMessage',
            },
            addAddressResponse?.data,
          ),
        );

        /*
          ::::::::::::
          remove preloader
          :::::::::::::
          */
        removePreLoader();
      }
    } catch (error) {
      saveAddressButton.insertAdjacentElement(
        'afterend',
        p(
          {
            id: 'addressFormErrorMessage',
            class: 'text-red-500 pl-6 font-medium text-l',
          },
          error.message,
        ),
      );

      /*
          ::::::::::::
          remove preloader
          :::::::::::::
          */
      removePreLoader();
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
    // button(
    //   {
    //     class:
    //       "btn btn-outline-primary border-solid border-purple rounded-full px-6",
    //   },
    //   "Checkout as Guest"
    // ),
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
      class: 'flex flex-col justify-start items-start gap-4 ',
    },
    div(
      {
        class:
          'p-[22px] flex flex-col bg-white p-6 border-l border-r border-t border-danahergray-75 border-b-[5px] justify-start items-start gap-y-6',
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
          class: `proceed-button w-full text-white text-xl  btn btn-lg font-medium btn-primary-purple rounded-full px-6 ${((authenticationToken.user_type === 'guest') || window.location.pathname.includes('order')) ? 'hidden' : ''
            } `,
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
      localStorage.removeItem('activeCheckoutTab');
      proceedButton.textContent = 'Proceed to Checkout';
    } else {
      proceedButton.textContent = 'Proceed to Shipping';
    }
    proceedButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.location.href.includes('cartlanding')) {
        window.location.href = '/us/en/e-buy/checkout';
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
      if (
        getUseAddressesResponse?.data?.invoiceToAddress
        && getUseAddressesResponse?.data?.invoiceToAddress?.id
        !== getUseAddressesResponse?.data?.commonShipToAddress?.id && window.location.pathname.includes('checkout')
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
      if (getUseAddressesResponse?.data?.commonShipToAddress && window.location.pathname.includes('checkout')) {
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
          class: 'w-[150px] justify-start text-black text-base font-semibold',
        },
        div(
          {
            class:
              'w-[150px] justify-start text-gray-500 text-base font-semibold item line-through',
          },
          `$${cartItemValue.listPrice.value}`,
        ),
        div(
          {
            class:
              'unit-price w-[150px] justify-start text-black text-base',
          },
          `$${cartItemValue.salePrice.value}`,
        ),
      );
    }

    return div(
      {
        class: 'w-[150px] justify-start text-black text-base font-semibold',
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
            'unit-price w-[150px] justify-start text-black text-base',
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
            class: 'justify-start text-black text-base font-semibold truncate m-[5px]',
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
        class: 'sm:pl-[0px] pl-[13px] inline-flex justify-start items-center',
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
          class: 'total-price w-[80px] justify-start text-black text-base font-semibold sm:m-[0px] m-[7px]',
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

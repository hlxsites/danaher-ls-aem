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
import { postApiData, getApiData, patchApiData } from './api-utils.js';
import { decorateIcons } from './lib-franklin.js';
import {
  buildInputElement,
  buildButton,
  submitForm,
  getStates,
  getCountries,
  removeObjectKey,
  removePreLoader,
  showPreLoader,
  closeUtilityModal,
  capitalizeFirstLetter,
  getStoreConfigurations,
  createModal,
} from './common-utils.js';
// base url for the intershop api calls
import {
  updateCartItemQuantity,
  updateBasketDetails,
  getProductDetailObject,
} from '../blocks/cartlanding/cartSharedFile.js';
import { makePublicUrl, imageHelper } from './scripts.js';

const { getAuthenticationToken } = await import('./token-utils.js');
const baseURL = getCommerceBase();

export const logoDiv = (itemToBeDisplayed, opcoBe, imgsrc) => {
  // const logoDiv = div({}, hr({
  //     class: `w-full border-black-300`,
  //   }),
  //   div(
  //     {
  //       class: "w-full px-4 py-3 inline-flex justify-between items-center",
  //       id: imgsrc,
  //     },
  //     div(
  //       {
  //         class:
  //           "w-24 justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
  //       },
  //       img({
  //         class: "",
  //         src: `/icons/${imgsrc}.png`,
  //       })
  //     ),
  //     div(
  //       {
  //         class:
  //           "w-[30rem] justify-start text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
  //       },
  //       opcoBe[0]
  //     ),
  //     div(
  //       {
  //         class:
  //           "justify-start text-black text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
  //         id: `product-Quantity-${opcoBe[0]}`,
  //       },
  //       `${itemToBeDisplayed[opcoBe].length} Items`
  //     )
  //   ),
  //   hr({
  //     class: `w-full border-black-200`,
  //   }))
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
          class: 'justify-start text-black text-base font-bold truncate',
        },
        opcoBe[0],
      ),
    ),
    div(
      {
        class: 'w-64 justify-start text-black text-base font-bold',
        id: `product-Quantity-${opcoBe[0]}`,
      },
      `${itemToBeDisplayed[opcoBe].length} Items`,
    ),
    div(
      {
        class:
          'hidden sm:block w-24 justify-start text-black text-base font-bold',
      },
      'QTY',
    ),
    div(
      {
        class:
          'hidden sm:block w-48 justify-start text-black text-base font-bold',
      },
      'Unit Price',
    ),
    div(
      {
        class:
          'hidden sm:block w-[3rem] justify-start text-black text-base font-bold',
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
        class: 'hidden',
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
              class: `font-bold m-0 ${address?.companyName2 ? '' : 'hidden'}`,
            },
            address?.companyName2 ?? '',
          ),
          p(
            {
              class: 'text-black text-base font-extralight',
            },
            address?.addressLine1 ?? '',
          ),
          p(
            {
              class: 'text-black text-base font-extralight',
            },
            address?.city ?? '',
          ),
          p(
            {
              class: 'text-black text-base font-extralight',
            },
            `${address?.mainDivision ?? ''}, ${address?.countryCode ?? ''}, ${
              address?.postalCode ?? ''
            }`,
          ),
        ),
        button(
          {
            'data-type': type,
            'data-action': 'edit',
            class:
              'flex justify-start bg-white editAddressButton text-danaherpurple-500 p-0 pl-0 text-base font-bold',
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
    const url = `${baseURL}baskets/current/attributes`;

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
    const url = `${baseURL}baskets/current/attributes/GroupShippingNote`;

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
export const submitOrder = async (basketId) => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
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
    const url = `${baseURL}${addressURI}`;

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
    const url = `${baseURL}baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
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
export async function getBasketDetails() {
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

  if (basketData?.status === 'success') return basketData;
  const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
  try {
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
      const url = `${baseURL}baskets/current/buckets/${shippingBucket?.data?.data?.buckets[0]}/eligible-shipping-methods`;
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
    const url = `${baseURL}baskets/current/eligible-payment-methods?include=paymentInstruments`;
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
      return { status: 'success', data: 'Error getting Payment methods:' };
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
    const url = `${baseURL}baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrumentnclude=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrument`;
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

  if (getAddressesData.status === 'success') {
    return getAddressesData.data.filter((adr) => (type === 'billing' ? adr.usage[0] === true : adr.usage[1] === true));
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
          'input-focus text-base w-full block px-2 py-4 font-extralight border border-solid border-gray-300',
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
  if (cachedAddress) return cachedAddress;
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
          `${baseURL}promotions/${promotionId}`,
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
              class: 'text-gray-900 text-3xl font-bold',
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
 handle the interaction when user click on proceed button or the steps icons
 ::::::::::::::
*
*
*
 */
export const changeStep = async (step) => {
  showPreLoader();
  const currentTab = step.target.getAttribute('data-tab');
  const activeTab = step.target.getAttribute('data-activeTab');
  let validateData = '';

  if (currentTab === 'shippingMethods') {
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
    validateData = {
      adjustmentsAllowed: true,
      scopes: [
        'Payment',
      ],
    };
  }
  const validatingBasket = await validateBasket(validateData);
  if (validatingBasket?.status === 'error') {
    alert('In-valid basket');
    removePreLoader();
    return false;
  }
  if (currentTab === 'submitOrder') {
    const getBasketForOrder = await getBasketDetails();
    if (getBasketForOrder?.status === 'success') {
      const submittingOrder = await submitOrder(getBasketForOrder?.data?.data?.id);
      
      if (submittingOrder?.data?.data?.documentNumber) {
        window.location.href = `/us/en/e-buy/checkout/ordersubmit?orderId=${submittingOrder?.data?.data?.documentNumber}`;
      }
    }
  }
  if (activeTab && activeTab === 'shippingMethods') {
    const getShippingNotesField = document.querySelector('#shippingNotes');

    if (getShippingNotesField) {
      showPreLoader();
      if (getShippingNotesField.value.trim() === '') {
        getShippingNotesField.classList.add('border-red-500');
        removePreLoader();
        return false;
      }
      /*
 :::::::::::::
 get current basket details
 :::::::::::::
*/
      const getCurrentBasketDetails = await getBasketDetails();

      /*
 :::::::::::::
 check if basket has the shipping notes attribute
 :::::::::::::
*/
      if (getCurrentBasketDetails?.data?.data?.attributes) {
        const getNotes = getCurrentBasketDetails.data.data.attributes[0];

        /*
 :::::::::::::
 check if notes with same value esists
 :::::::::::::
*/
        if (
          getNotes.name === 'GroupShippingNote'
          && getNotes.value.trim() === getShippingNotesField.value.trim()
        ) {
          removePreLoader();
        } else {
          /*
 :::::::::::::
 if basket has the shipping notes attribute and has value. Update the shipping notes
 :::::::::::::
*/
          if (getShippingNotesField.classList.contains('border-red-500')) {
            getShippingNotesField.classList.remove('border-red-500');
          }
          const shippingNotesPayload = {
            name: 'GroupShippingNote',
            value: getShippingNotesField.value,
            type: 'String',
          };
          const updateShippingNotesResponse = await updateShippingNotes(
            shippingNotesPayload,
          );
          if (updateShippingNotesResponse.status === 'error') {
            removePreLoader();
            getShippingNotesField.classList.add('border-red-500');
            return false;
          }
          if (updateShippingNotesResponse.status === 'success') {
            await updateBasketDetails();
            removePreLoader();
          }
        }
      } else {
        /*
 :::::::::::::
 if basket has the shipping notes attribute and doesn't has value. Add the shipping notes
 :::::::::::::
*/
        if (getShippingNotesField.classList.contains('border-red-500')) {
          getShippingNotesField.classList.remove('border-red-500');
        }
        const shippingNotesPayload = {
          name: 'GroupShippingNote',
          value: getShippingNotesField.value,
          type: 'String',
        };
        const setShippingNotesResponse = await setShippingNotes(
          shippingNotesPayload,
        );
        if (setShippingNotesResponse.status === 'error') {
          getShippingNotesField.classList.add('border-red-500');
        }
        if (setShippingNotesResponse.status === 'success') {
          await updateBasketDetails();
          removePreLoader();
        }
      }
      // return false;
    } else {
      // return false;
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

  /*
  ::::::::::::::
  Update line segments between steps
  ::::::::::::::
  */
  switch (currentTab) {
    case 'shippingAddress':
      segment1.style.width = '0';
      segment2.style.width = '0';
      proceedButton.setAttribute('data-tab', 'shippingMethods');
      proceedButton.setAttribute('data-activeTab', 'shippingAddress');
      proceedButton.textContent = 'Proceed to Shipping';
      break;
    case 'shippingMethods':
      segment1.style.width = '50%';
      segment2.style.width = '0';
      proceedButton.textContent = 'Proceed to Payment';
      proceedButton.setAttribute('data-activeTab', 'shippingMethods');
      proceedButton.setAttribute('data-tab', 'payment');
      break;
    case 'payment':
      segment2.style.width = '50%';
      proceedButton.setAttribute('data-activeTab', 'paymentMethods');
      proceedButton.setAttribute('data-tab', 'submitOrder');
      break;
    case 'submitOrder':
      segment2.style.width = '50%';
      proceedButton.setAttribute('data-tab', 'submitOrder');
      proceedButton.setAttribute('data-activeTab', 'submitOrder');
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
      class: `${type}-address-form text-sm w-full max-w-xl box-border overflow-hidden rounded-xl`,
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
      ' proceed-button text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
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
          removeObjectKey(
            formObject,
            `preferred${capitalizeFirstLetter(type)}Address`,
          );
          Object.assign(formObject, {
            id: data.id,
            type: 'MyAddress',
            urn: data.urn,
          });
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

          saveAddressButton.insertAdjacentElement(
            'afterend',
            p(
              {
                class: 'text-green-500 font-medium pl-6 text-l',
              },
              'Address Updated Successfully.',
            ),
          );

          /*
        ::::::::::::::
        update address list
        ::::::::::::::
        */
          await updateAddresses();
        } else {
          saveAddressButton.insertAdjacentElement(
            'afterend',
            p(
              {
                id: 'addressFormErrorMessage',
                class: 'text-red-500 font-medium pl-6 text-l text-center',
              },
              'Error submitting address.',
            ),
          );
        }
        /*
          ::::::::::::
          remove preloader
          :::::::::::::
          */
        removePreLoader();
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
export async function checkoutSummary() {
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
  const getCheckoutSummaryData = await getBasketDetails();
  let discountCode = '';
  let discountLabelData = '';
  let discountDetails = '';
  let discountPromoCode = '';
  let discountLabel = '';
  let discountPrice = '';
  let checkoutSummaryData = false;
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

  let userLoggedInStatus = false;
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
    const totalValue = `${
      checkoutSummaryData?.totals[type][
        checkoutPriceType === 'net' ? 'net' : 'gross'
      ]?.value ?? ''
    }`;
    return totalValue > 0 ? `${currencyCode}${totalValue}` : '';
  };

  /*
  ::::::::::::::
  map the data from checkout summary (basket) to the keys.
  ::::::::::::::
  */
  const checkoutSummaryKeys = {
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
      ? `${currencyCode} ${
        checkoutSummaryData?.totals?.grandTotal?.tax?.value ?? ''
      }`
      : '$0',
    discountPrice: discountPrice ? `${currencyCode}${discountPrice}` : '',
    discountLabel,
    totalLineItems: checkoutSummaryData?.lineItems?.length ?? '0',
  };

  const loggedOutUserDiv = div(
    {
      class: 'inline-flex flex-col gap-4',
    },
    div(
      {
        class: 'w-80 justify-start text-black text-3xl font-bold  leading-10',
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
          class: ' flex flex-col justify-start items-start gap-4',
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
              class: ' justify-start text-black text-base font-bold ',
            },
            'Subtotal',
          ),
          span(
            {
              class:
                ' text-right flex flex-col justify-start text-black text-base font-bold ',
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
                ' justify-start text-black text-base text-right font-extralight ',
            },
            'Discount',
          ),
          div(
            {
              class: ' flex flex-col',
            },
            span(
              {
                class: 'text-right text-black text-base font-extralight ',
              },
              checkoutSummaryKeys.discountPrice,
            ),
            span(
              {
                class:
                  ' w-80 text-right  text-gray-500 text-xs font-normal leading-none',
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
                  'w-20 justify-start text-black text-base font-extralight ',
              },
              'Sales Tax*',
            ),
            span(
              {
                id: 'checkoutSummaryTaxExempt',
                class:
                  'text-right text-violet-600 text-sm cursor-pointer text-danaherpurple-500 hover:text-danaherpurple-800 font-normal underline',
              },
              'Tax exempt?',
            ),
          ),
          span(
            {
              class:
                ' text-right justify-start text-black text-base font-extralight ',
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
              class: 'w-20 justify-start text-black text-base font-extralight ',
            },
            'Shipping*',
          ),
          span(
            {
              class:
                ' text-right flex flex-col justify-start text-black text-base font-extralight ',
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
            'checkout-summary-total border-t justify-between flex w-full  border-gray-200 border-solid mb-4 pt-6',
          id: 'checkoutSummaryTotal',
        },
        span(
          {
            class: ' justify-start text-black text-xl font-bold ',
          },
          `Total (${checkoutSummaryKeys.totalLineItems} items)`,
        ),
        span(
          {
            class: ' text-right justify-start text-black text-xl font-bold ',
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
            'p-[22px] flex flex-col justify-center w-full items-start gap-4',
        },
        button({
          class: `proceed-button w-full text-white text-xl font-extralight btn btn-lg font-medium btn-primary-purple rounded-full px-6 ${
            authenticationToken.user_type === 'guest' ? 'hidden' : ''
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
      } else {
        checkoutSummaryWrapper.insertAdjacentElement(
          'afterbegin',
          div({
            class: 'h-[0px]',
          }),
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
          !== getUseAddressesResponse?.data?.commonShipToAddress?.id
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
                class: 'font-bold p-0 mb-3 mt-0',
              },
              'Bill to Address',
            ),
            div(
              {
                class: 'p-3 border border-danahergray-300',
              },
              h5(
                {
                  class: `font-normal m-0 p-0 ${
                    getUseAddressesResponse?.data?.invoiceToAddress
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
                  class: 'text-black text-base font-extralight m-0 p-0',
                },
                getUseAddressesResponse?.data?.invoiceToAddress?.addressLine1
                  ?? '',
              ),
              p(
                {
                  class: 'text-black text-base font-extralight m-0 p-0',
                },
                getUseAddressesResponse?.data?.invoiceToAddress?.city ?? '',
              ),
              p(
                {
                  class: 'text-black text-base font-extralight m-0 p-0',
                },
                `${
                  getUseAddressesResponse?.data?.invoiceToAddress
                    ?.mainDivision ?? ''
                }, ${
                  getUseAddressesResponse?.data?.invoiceToAddress
                    ?.countryCode ?? ''
                }, ${
                  getUseAddressesResponse?.data?.invoiceToAddress?.postalCode
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
      if (getUseAddressesResponse?.data?.commonShipToAddress) {
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
                class: 'font-bold p-0 mb-3 mt-0',
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
                  class: 'text-black text-base font-extralight m-0 p-0',
                },
                getUseAddressesResponse?.data?.commonShipToAddress
                  ?.addressLine1 ?? '',
              ),
              p(
                {
                  class: 'text-black text-base font-extralight m-0 p-0',
                },
                getUseAddressesResponse?.data?.commonShipToAddress?.city ?? '',
              ),
              p(
                {
                  class: 'text-black text-base font-extralight m-0 p-0',
                },
                `${
                  getUseAddressesResponse?.data?.commonShipToAddress
                    ?.mainDivision ?? ''
                }, ${
                  getUseAddressesResponse?.data?.commonShipToAddress
                    ?.countryCode ?? ''
                }, ${
                  getUseAddressesResponse?.data?.commonShipToAddress
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

export const cartItemsContainer = async (cartItemValue) => {
  const modifyCart = async (type, element, value) => {
    showPreLoader();
    if (type === 'delete-item') {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        manufacturer: cartItemValue.manufacturer,
        type,
      };
      const response = await updateCartItemQuantity(item);
      if (response === 'success') {
        await updateCheckoutSummary();
        const getProductDetailsObject = await getProductDetailObject();
        if (getProductDetailsObject) {
          const response = getProductDetailsObject.data.map(
            (itemToBeDisplayed) => {
              const opcoBe = Object.keys(itemToBeDisplayed);
              const str = `product-Quantity-${opcoBe[0]}`;
              const parts = str.split('-');
              const logodivId = document.getElementById(
                `product-Quantity-${opcoBe[0]}`,
              );
              logodivId.innerHTML = ` ${
                itemToBeDisplayed[opcoBe[0]].length
              } Items`;
            },
          );

          await updateCheckoutSummary();
        }
        removePreLoader();
      } else {
        alert(response);
        removePreLoader();
      }
    } else {
      const item = {
        lineItemId: cartItemValue.lineItemId,
        value,
        manufacturer: cartItemValue.manufacturer,
        type,
      };
      const response = await updateCartItemQuantity(item);
      if (response === 'success') {
        await updateCheckoutSummary();
        removePreLoader();
        element.blur(); // Removes focus from the input
      } else {
        alert(response);
        removePreLoader();
        element.blur(); // Removes focus from the input
      }
    }
  };
  const modalCloseButton = button(
    {
      class: 'sm:w-[7.5rem] sm:h-[3.5rem] bg-white',
    },
    span({
      id: `delteItem-${cartItemValue.sku}`,
      class: 'icon icon-icons8-delete cart-delete',
    }),
  );
  modalCloseButton.addEventListener('click', (event) => {
    const input = document.getElementById(cartItemValue.lineItemId);
    modifyCart('delete-item', input, '');
  });
  const modalInput = input({
    // id: cartItemValue.lineItemId,
    class:
      'w-[3.5rem] h-10 pl-4 bg-white font-medium text-black border-solid border-2 inline-flex justify-center items-center',
    type: 'number',
    min: cartItemValue.minOrderQuantity,
    max:
      cartItemValue.maxOrderQuantity == 0 ? 99 : cartItemValue.maxOrderQuantity,
    name: 'item-quantity',
    value: cartItemValue.itemQuantity,
  });
  modalInput.addEventListener('change', (event) => {
    const selectedDiv = document.getElementById(cartItemValue.lineItemId); // or any div reference
    const input = selectedDiv.querySelector('input');
    const productItem = input.parentElement.parentElement;

    const enteredValue = event.target.value;
    if (enteredValue < Number(input.min)) {
      productItem.style.border = '2px solid red';
      alert(
        `Please enter a valid order quantity which should be greater then ${input.min} and less then ${input.max}`,
      );
    } else if (enteredValue > Number(input.max)) {
      productItem.style.border = '2px solid red';
      alert(
        `Please enter a valid order quantity which should be greater then ${input.min} and less then ${input.max}`,
      );
    } else {
      productItem.style.border = '';
      modifyCart('quantity-added', input, event.target.value);
    }
    // modifyCart("quantity-added", event.target.value);
  });
  const image = imageHelper(
    'https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg',
    cartItemValue.productName,
    {
      href: makePublicUrl(
        'https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg',
      ),
      title: cartItemValue.productName,
      class: 'justify-center',
    },
  );
  // const itemContainer = div(
  //   {
  //     class: "flex w-full justify-between items-center",
  //     id: cartItemValue.lineItemId,
  //   },
  //   div(
  //     {
  //       class:
  //         "w-[73px] h-[93px] flex flex-col justify-center items-center cursor-pointer",
  //     },
  //     image
  //   ),
  //   div(
  //     {
  //       class: "w-96",
  //     },
  //     div(
  //       {
  //         class: "",
  //       },
  //       cartItemValue.productName
  //     ),
  //     div(
  //       {
  //         class: " text-gray-500 text-base font-extralight",
  //       },
  //       `SKU: ${cartItemValue.sku}`
  //     )
  //   ),
  //   div(
  //     {
  //       class: "",
  //     },
  //     modalInput
  //   ),
  //   div(
  //     {
  //       class: "w-11 text-right text-black text-base font-bold",
  //     },
  //     `$${cartItemValue.salePrice.value}`
  //   ),
  //   modalCloseButton
  // );
  // const itemContainer = div(
  //   {
  //     class:
  //       "w-full self-stretch p-4 relative inline-flex justify-start items-center",
  //   },
  //   div(
  //     { class: "inline-flex justify-start items-center gap-3.5" },
  //     div(
  //       {
  //         class:
  //           "w-28 p-2.5 bg-white outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-start items-center gap-2.5",
  //       },
  //       // div(
  //       //   {
  //       //     class: "w-16 self-stretch relative overflow-hidden",
  //       //   },
  //         image
  //         // img({
  //         //   class: "w-20 h-28 left-[-4px] top-[-24px] absolute",
  //         //   src: `/images/wesee/dummy.png `,
  //         // })
  //       // )
  //     ),
  //     div(
  //       { class: "w-64 inline-flex flex-col justify-start items-start" },
  //       div(
  //         {
  //           class: "self-stretch justify-start text-black text-base font-bold",
  //         },
  //         cartItemValue.productName
  //       ),
  //       div(
  //         {
  //           class:
  //             "self-stretch justify-start text-gray-500 text-sm font-normal ",
  //         },
  //         cartItemValue.sku
  //       )
  //     )
  //   ),
  //   div(
  //     { class: "w-11 inline-flex flex-col justify-start items-start" },
  //     // div({
  //     //     class:"w-11 h-10 px-4 py-3 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] inline-flex justify-start items-center overflow-hidden"
  //     // },
  //     // div({
  //     //     class:"justify-start text-gray-700 text-base font-normal"
  //     // }, "2")
  //     modalInput
  //     // )
  //   ),
  //   div(
  //     { class: "w-44 inline-flex flex-col justify-start items-end" },
  //     div(
  //       {
  //         class:
  //           "self-stretch text-right justify-start text-black text-base font-bold",
  //       },
  //       `$${cartItemValue.salePrice.value}`
  //     ),
  //     div(
  //       {
  //         class:
  //           "self-stretch text-right justify-start text-gray-500 text-base",
  //       },
  //       " $100.00"
  //     )
  //   ),
  //   div(
  //     { class: "w-28 inline-flex flex-col justify-start items-end" },
  //     div(
  //       {
  //         class:
  //           "self-stretch text-right justify-start text-black text-base font-bold",
  //       },
  //       "$200.00"
  //     )
  //   ),
  //   div(
  //     { class: "w-6 h-6 left-[747px] top-[49px] absolute overflow-hidden" },
  //     modalCloseButton
  //   )
  // );
  const itemsscontainer = div(
    {
      class:
        'w-full py-3 border-t border-gray-300 inline-flex sm:flex-row flex-col justify-start items-center gap-1',
      id: cartItemValue.lineItemId,
    },
    div(
      {
        class: 'py-3 inline-flex gap-2 ',
      },
      div(
        {
          class:
            'w-28 p-2 flex justify-start items-center gap-3 border border-solid border-gray-300',
        },
        div(
          {
            class:
              'justify-start text-black text-base font-bold truncate m-[5px]',
          },
          img({
            class: 'w-full h-auto',
            src: cartItemValue.images
              ? cartItemValue.images[0].effectiveUrl
              : 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble',
          }),
        ),
      ),
      div(
        {
          class:
            'sm:w-64 w-[11rem] flex flex-col justify-center items-center text-black text-base font-bold',
          // id: `product-Quantity-${opcoBe[0]}`,
        },
        div(
          {
            class:
              'w-full justify-start items-center text-black text-base font-bold',
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
          class: 'w-24 justify-start text-black text-base font-bold',
        },
        modalInput,
      ),
      div(
        {
          class:
            'sm:w-48 w-[5rem] justify-start text-black text-base font-bold',
        },
        div(
          {
            class:
              'w-full justify-start text-gray-500 text-base font-bold item line-through',
          },
          `$${cartItemValue.salePrice.value}`,
        ),
        div(
          {
            class: 'w-full justify-start text-black text-base',
          },
          `$${cartItemValue.salePrice.value}`,
        ),
      ),
      div(
        {
          class:
            'w-[59px] justify-start text-black text-base font-bold sm:m-[0px] m-[7px]',
        },
        `$${cartItemValue.salePrice.value}`,
      ),
      modalCloseButton,
    ),
  );
  decorateIcons(itemsscontainer);
  return itemsscontainer;
};

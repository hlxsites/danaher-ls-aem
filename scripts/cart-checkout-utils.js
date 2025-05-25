import { getCommerceBase } from './commerce.js';
import { postApiData, getApiData, patchApiData } from './api-utils.js';

// const { getAuthenticationToken } = await import('./auth-utils.js');

const baseURL = getCommerceBase(); // base url for the intershop api calls
const siteID = window.DanaherConfig?.siteID;
const hostName = window.location.hostname;
let env;
if (hostName.includes('local')) {
  env = 'local';
} else if (hostName.includes('dev')) {
  env = 'dev';
} else if (hostName.includes('stage')) {
  env = 'stage';
} else {
  env = 'prod';
}

/*
:::::::::::::::::::::::::::
 Function to create basket
  :::::::::::::::::::::::::::
*/
export const createBasket = async () => {
  const authenticationToken = sessionStorage.getItem(
    `${siteID}_${env}_apiToken`,
  );
  if (!authenticationToken) {
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
 :::::::::::::::::::::::::::::
 get single adress details based on address id
 ::::::::::::::::::::::::::::::::::::::::::::
 * @param {string} addressURI - The ID of the Address.
 */
export async function getAddressDetails(addressURI) {
  const authenticationToken = sessionStorage.getItem(
    `${siteID}_${env}_apiToken`,
  );
  if (!authenticationToken) {
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
  const authenticationToken = sessionStorage.getItem(
    `${siteID}_${env}_apiToken`,
  );
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const useAddressObject = {};
    let addressDetails = '';
    if (response?.data?.invoiceToAddress) {
      const [, , , , addressURI] = response.data.invoiceToAddress.split(':')[4];
      addressDetails = await getAddressDetails(
        `customers/-/addresses/${addressURI}`,
      );
      Object.assign(useAddressObject, { invoiceToAddress: addressDetails });
    }
    if (response?.data?.commonShipToAddress) {
      const [, , , , addressURI] = response.data.commonShipToAddress.split(':')[4];
      addressDetails = await getAddressDetails(
        `customers/-/addresses/${addressURI}`,
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
  const authenticationToken = sessionStorage.getItem(
    `${siteID}_${env}_apiToken`,
  );
  if (!authenticationToken) {
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
  const authenticationToken = sessionStorage.getItem(
    `${siteID}_${env}_apiToken`,
  );
  if (!authenticationToken) {
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
:::::::::::::::::::::::::::
Function to update current basket details
:::::::::::::::::::::::::::
*/
export async function updateBasketDetails() {
  const authenticationToken = sessionStorage.getItem(
    `${siteID}_${env}_apiToken`,
  );
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
    Accept: 'application/vnd.intershop.basket.v1+json',
  });
  const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
  try {
    sessionStorage.removeItem('basketData');
    const response = await getApiData(url, defaultHeader);
    sessionStorage.setItem('basketData', JSON.stringify(response));
    return response;
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
 * Request function to perform fetch, based on the parameters
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {string} method - The method to make the API call.
 * @param {Object} headers - Optional headers for the request.
 * @params {Object} - Returns the response object from the API or an error object.

*/
/*
export async function validateBasket(type) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': authenticationToken.access_token,
    Accept: 'application/vnd.intershop.basket.v1+json',
  });
  const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
  try {
    sessionStorage.removeItem('basketData');
    const response = await getApiData(url, defaultHeader);
    sessionStorage.setItem('basketData', JSON.stringify(response));
    return response;
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
*/

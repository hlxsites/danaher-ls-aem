import {
  div,
  p,
  input,
  label,
  span,
  img,
  button,
  select,
  option,
} from './dom-builder.js';
import { getCommerceBase } from './commerce.js';
import { decorateIcons } from './lib-franklin.js';

export const baseURL = getCommerceBase(); // base url for the intershop api calls
export const siteID = window.DanaherConfig?.siteID;
export const hostName = window.location.hostname;
export const env = hostName.includes('local')
  ? 'local'
  : hostName.includes('dev')
    ? 'dev'
    : hostName.includes('stage')
      ? 'stage'
      : 'prod';

/*
:::::::::::::::::::::::::::::::::::::::::::::::
 API POST/GET/PUT/PATH operations
 ::::::::::::::::::::::::::::::
*/

/*
 * Request function to perform fetch, based on the parameters
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {string} method - The method to make the API call.
 * @param {Object} headers - Optional headers for the request.
 * @params {Object} - Returns the response object from the API or an error object.

*/
async function request(url, method = 'GET', data = {}, headers = {}) {
  const options = {
    method,
    headers,
    redirect: 'follow',
  };

  if (data && method.toUpperCase() !== 'GET') {
    options.body = data;
  }
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = '';
      if (response.status === 400) errorMessage = 'Bad request! please try again.';
      if (response.status === 401) errorMessage = 'Unauthorized! please try again.';
      if (response.status === 403) errorMessage = 'Request failed! URL was forbidden, please try again.';
      if (response.status === 404) errorMessage = 'Request not found, please try again.';
      if (response.status === 422) errorMessage = 'Unprocess the request, please try again.';
      if (response.status === 500) errorMessage = 'Server error, unable to get the response.';
      throw new Error(errorMessage);
    }
    const apiResponse = await response.json();

    return { status: 'success', data: apiResponse };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
 * Get data from a specified API endpoint with provided  headers.
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 */
export async function getApiData(url, headers) {
  try {
    return await request(url, 'GET', {}, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
 * Sends a POST request to the specified API endpoint with provided data and headers.
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 */

export async function postApiData(url, data, headers) {
  try {
    return await request(url, 'POST', data, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
::::::::::::::::::
 patch api data.. make use of the request function
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 :::::::::::::::::
 */
export async function patchApiData(url, data, headers) {
  try {
    return await request(url, 'PATCH', data, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
::::::::::::::::::
 put api data.. make use of the request function
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 :::::::::::::::::
 */
export async function putApiData(url, data, headers) {
  try {
    return await request(url, 'PUT', data, headers);
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
 ::::::::::::::::::::
 Show preloader (animation)
 :::::::::::::::::
 */
export function showPreLoader() {
  const mainPreLoader = document.querySelector('#mainPreLoader');
  mainPreLoader?.classList.remove('hidden');
}

/*
 ::::::::::::::::::::
 creates a preloader (animation)
 :::::::::::::::::
 */
export function preLoader() {
  return div(
    {
      class:
        ' flex w-full relative top-1/2 left-[46%] justify-start items-center',
      id: 'preLoader',
    },
    img({
      class: ' h-24',
      src: 'https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/loading_icon.gif',
    }),
  );
}

/*
::::::::::::::::::::::
function to remove preloader whenever required
:::::::::::::::::::::::
*/
export function removePreLoader() {
  const mainPreLoader = document.querySelector('#mainPreLoader');
  setTimeout(() => {
    mainPreLoader?.classList.add('hidden');
  });
}

/*
:::::::::::::::::::::::::::
Function to get current basket details
:::::::::::::::::::::::::::
*/
export async function getBasketDetails() {
  const authenticationToken = await getAuthenticationToken();
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
        const { setUseAddress } = await import(
          '../blocks/checkout/checkoutUtilities.js'
        );
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
 Function to create basket
  :::::::::::::::::::::::::::
*/
export const createBasket = async () => {
  const authenticationToken = await getAuthenticationToken();
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
:::::::::::::::::::::::::::
Function to update current basket details
:::::::::::::::::::::::::::
*/
export async function updateBasketDetails() {
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

/*
  create modal function... Creates a popup/modal with the input content
  @param: content : html content to load into the modal
  @param hasCancelButton : boolean. Optional cancel button
  @param hasCloseButton : boolean. Optional close button
*/
export function createModal(content, hasCancelButton, hasCloseButton) {
  const modalWrapper = div({
    class:
      'inset-0 fixed w-full  bg-black z-50 bg-opacity-50 flex items-center justify-center',
    id: 'utilityModal',
  });
  const modalContainer = div({
    class: 'relative max-w-xl w-full items-center bg-white p-8',
    id: 'utilityModalWrapper',
  });

  let modalBody = div({});
  if (content) {
    modalBody = div(
      {
        class: 'modal-body py-6 pb-6',
      },
      content,
    );
  }
  let cancelButton = '';
  if (hasCancelButton) {
    cancelButton = span(
      {
        class: 'mt-6 text-danaherpurple-500 cursor-pointer',
        id: 'closeUtilityModal',
      },
      'Cancel',
    );
    if (content && modalBody) {
      const getModalButtonWrapper = modalBody.querySelector('.button-wrapper');
      if (getModalButtonWrapper) {
        getModalButtonWrapper.classList.add(
          'flex',
          'justify-between',
          'items-center',
        );
        getModalButtonWrapper.append(cancelButton);
      }
    }
    cancelButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeUtilityModal();
    });
  }
  if (hasCloseButton) {
    const modalCloseButton = p(
      {
        class: 'close-button absolute right-10 top-6',
        name: 'close',
      },
      span({
        class: 'icon icon-close cursor-pointer',
      }),
    );
    modalCloseButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeUtilityModal();
    });

    decorateIcons(modalCloseButton);
    modalContainer.append(modalCloseButton);
  }
  modalContainer.append(modalBody);

  modalWrapper.append(modalContainer);
  const mainContainer = document.querySelector('main');
  if (mainContainer) {
    mainContainer.append(modalWrapper);
  }
}
/*
 ::::::::::::::::::::::::
 utility function to close the modal...
 can be imported and used globally
 for the modal created using utlility createModal function
 ::::::::::::::::::::::::::::::::::::
*/
export function closeUtilityModal() {
  const utilityModal = document.querySelector('#utilityModal');
  if (utilityModal) {
    utilityModal.remove();
  }
}
/*
:::::::::::::::
 Login the user (Customer/Guest)
 :::::::::::::::::::::::::::
*/
export async function loginUser(type) {
  let loginData = {};
  sessionStorage.clear();
  try {
    if (type === 'customer') {
      loginData = {
        username: 'aadi28@tdhls.com',
        password: '!InterShop00!12345',
        grant_type: 'password',
        checkoutType: 'customer',
      };
    } else {
      loginData = {
        grant_type: 'anonymous',
        checkoutType: 'guest',
      };
    }

    const grant_type = type === 'customer' ? 'password' : 'anonymous';
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', grant_type);
    if (grant_type === 'password') {
      urlencoded.append('scope', 'openid+profile');
      urlencoded.append('username', loginData.username);
      urlencoded.append('password', loginData.password);
    }
    try {
      const userLoggedIn = await postApiData(
        `${baseURL}token`,
        urlencoded,
        headers,
      );

      if (userLoggedIn?.status === 'success') {
        sessionStorage.removeItem('addressList');
        sessionStorage.setItem(
          `${siteID}_${env}_apiToken`,
          userLoggedIn.data.access_token,
        );
        sessionStorage.setItem(
          `${siteID}_${env}_refresh-token`,
          userLoggedIn.data.refresh_token,
        );
        sessionStorage.setItem(
          `${siteID}_${env}_user_data`,
          JSON.stringify(loginData),
        );
        sessionStorage.setItem(
          `${siteID}_${env}_user_type`,
          type === 'guest' ? 'guest' : 'customer',
        );

        /*
 ::::::::::::
 get the basket details and create if doen't exists
 ::::::::::::::::::
   */
        const basketData = await getBasketDetails();

        if (basketData.status === 'success') {
          const useAddressObject = {};
          let addressDetails = '';
          let addressURI = '';
          const { getAddressDetails } = await import(
            '../blocks/checkout/checkoutUtilities.js'
          );
          if (basketData?.data?.data?.invoiceToAddress) {
            addressURI = basketData.data.data.invoiceToAddress.split(':')[4];
            addressDetails = await getAddressDetails(
              `customers/-/addresses/${addressURI}`,
            );
            Object.assign(useAddressObject, {
              invoiceToAddress: addressDetails,
            });
          }
          if (basketData.data.data.commonShipToAddress) {
            addressURI = basketData.data.data.commonShipToAddress.split(':')[4];
            addressDetails = await getAddressDetails(
              `customers/-/addresses/${addressURI}`,
            );
            Object.assign(useAddressObject, {
              commonShipToAddress: addressDetails,
            });
          }

          sessionStorage.setItem(
            'useAddress',
            JSON.stringify({ status: 'success', data: useAddressObject }),
          );
        }
        return await userLoggedIn.data;
      }
      return { status: 'error', data: userLoggedIn.data };
    } catch (error) {
      return { status: 'error', data: error.message };
    }
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
:::::::::::::::
Gets the Authentication-Token for user (Customer/Guest)
:::::::::::::::::::::::::::
*/
export const getAuthenticationToken = async () => {
  try {
    if (sessionStorage.getItem(`${siteID}_${env}_apiToken`)) {
      return {
        access_token: sessionStorage.getItem(`${siteID}_${env}_apiToken`),
        refresh_token: sessionStorage.getItem(`${siteID}_${env}_refresh-token`),
        user_type: sessionStorage.getItem(`${siteID}_${env}_user_type`),
        user_data: sessionStorage.getItem(`${siteID}_${env}_user_data`),
      };
    }
    const userToken = await loginUser('customer');

    if (userToken) {
      return {
        access_token: sessionStorage.getItem(`${siteID}_${env}_apiToken`),
        refresh_token: sessionStorage.getItem(`${siteID}_${env}_refresh-token`),
        user_type: sessionStorage.getItem(`${siteID}_${env}_user_type`),
        user_data: sessionStorage.getItem(`${siteID}_${env}_user_data`),
      };
    }
    return { status: 'error', data: userToken.data };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};

/*
::::::::::::::::::::::
function to remove session preloader whenever required
:::::::::::::::::::::::
*/
export function removeSessionPreLoader() {
  setTimeout(() => {
    const sessionPreLoaderContainer = document.querySelector('#sessionPreLoader');
    sessionPreLoaderContainer?.remove();
  }, 1000);
}
/*
 ::::::::::::::::::::
 creates a preloader for expired login session (animation)
  :::::::::::::::::
 */
export function sessionPreLoader() {
  const sessionPreLoaderContent = div(
    {
      class:
        'text-center flex flex-col w-full relative h-24 justify-center items-center ',
      id: 'sessionPreLoader',
    },
    span(
      {
        class: 'text-red-500',
      },
      'Session Expired. Please login to continue.',
    ),
    span(
      {
        id: 'tempLoginButton',
        class: 'mt-6 text-green-500 font-bold cursor-pointer',
      },
      'Login Again',
    ),
  );
  const tempLoginButton = sessionPreLoaderContent.querySelector('#tempLoginButton');
  if (tempLoginButton) {
    tempLoginButton.addEventListener('click', async (event) => {
      event.preventDefault();
      tempLoginButton.insertAdjacentElement('beforeend', preLoader());
      const loginResponse = await loginUser('customer');
      if (loginResponse && loginResponse.status !== 'error') {
        removePreLoader();
        removeSessionPreLoader();
      } else {
        return false;
      }
    });
  }
  return createModal(sessionPreLoaderContent, true, true);
}

/*
:::::::::::::::::::::::::::::::
 Validates the form to check for empty fields
 ::::::::::::::::::::::::::::::::
  @param: {string} : Form ID
*/
export function formValidate(formId) {
  const formToSubmit = document.querySelector(`#${formId}`);
  if (formToSubmit) {
    let isValid = true;
    formToSubmit.querySelectorAll('[data-required]').forEach((el) => {
      if (el.dataset.required === 'true') {
        const msgEl = formToSubmit.querySelector(`[data-name=${el.name}]`);
        if (msgEl !== null) {
          if (el.value.length === 0) {
            msgEl.innerHTML = 'This field is required';
            isValid = false;
          } else {
            msgEl.innerHTML = '';
          }
        }
      }
    });
    return isValid;
  }
  return false;
}
/*
:::::::::::::::::::::::::::::::
Submits the form asper the passed parameters
 ::::::::::::::::::::::::::::::::
  @param: {string} : Form ID
  @param {String}  : action. Endpoints for the API to submit the form
  @param {String} : method. POST/PUT
  @param {Object} : data. Pass the form data to be handeled by the API.
*/
export async function submitForm(id, action, method, data) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized.' };
  }
  try {
    const formToSubmit = document.querySelector(`#${id}`);

    if (formToSubmit && formValidate(id)) {
      const url = `${baseURL}${action}`;

      const defaultHeaders = new Headers();
      defaultHeaders.append('Content-Type', 'Application/json');
      defaultHeaders.append(
        'authentication-token',
        authenticationToken.access_token,
      );
      const requestedMethod = method === 'POST' ? postApiData : putApiData;
      const submitFormResponse = await requestedMethod(
        url,
        JSON.stringify(data),
        defaultHeaders,
      );
      return submitFormResponse;
    }
    return { status: 'error', data: 'Error Submitting Form.' };
  } catch (error) {
    return { status: 'error', data: error.message };
  } finally {
    removePreLoader();
  }
}
/*
 ::::::::::::::::::::::::
 Capitalize any string
 ::::::::::::::::::::::::::::::::::::
*/
export function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*
:::::::::::::::::::::::::::
Function to get states from the api based oncountry
:::::::::::::::::::::::::::
 * @param {string} countryCode - The country code to get the states.
*/
export async function getCountries() {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const countriesList = JSON.parse(localStorage.getItem('countries'));
    if (countriesList?.status === 'success') return await countriesList;
    localStorage.removeItem('countires');
    const url = `${baseURL}/countries`;
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    const response = await getApiData(url, defaultHeaders);

    if (response.status === 'success') {
      localStorage.setItem('countries', JSON.stringify(response));
    }
    return response;
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
:::::::::::::::::::::::::::
Function to get countries from the API
:::::::::::::::::::::::::::
*/
export async function updateCountries() {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }

  try {
    localStorage.removeItem('countires');
    const url = `${baseURL}countries`;
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    const response = await getApiData(url, defaultHeaders);

    if (response.status === 'success') {
      localStorage.setItem('countries', JSON.stringify(response));
    }
    return response;
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}

/*
:::::::::::::::::::::::::::
Function to get states from the api based oncountry
:::::::::::::::::::::::::::
 * @param {string} countryCode - The country code to get the states.
*/
export async function getStates(countryCode) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const url = `${baseURL}countries/${countryCode}/main-divisions`;
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    defaultHeaders.append(
      'authentication-token',
      authenticationToken.access_token,
    );
    const response = await getApiData(url, defaultHeaders);
    if (response.status === 'success') {
      return response;
    }
    return [];
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
/*
:::::::::::::::::::::::::::
Function to get general store configurations
:::::::::::::::::::::::::::
*/
export async function getStoreConfigurations() {
  try {
    const configurations = sessionStorage.getItem('generalConfigurations');
    if (configurations) return await JSON.parse(configurations);
    sessionStorage.removeItem('generalConfigurations');
    const url = `${baseURL}configurations`;
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    // defaultHeaders.append("authentication-token", authenticationToken);
    const response = await getApiData(url, defaultHeaders);

    if (response.status === 'success') {
      sessionStorage.setItem('generalConfigurations', JSON.stringify(response));
    }
    return response;
  } catch (error) {
    return { status: 'error', data: error.message };
  }
}
/*
:::::::::::::::::::::::::::
Function to remove any key from the object
 :::::::::::::::::::::::::::

 * @param {string} keyToRemove - The key to be removed from the object.
 * @param {Object} dataObject - The object from which the key to be removed.
*/
export function removeObjectKey(dataObject, keyToRemove) {
  if (dataObject.hasOwnProperty(keyToRemove)) {
    delete dataObject[keyToRemove];
  }
  return dataObject;
}
/*

:::::::::::::::::::::::::::
inbuilt and custom dom functions
::::::::::::::::::::::::::::::

*/

export const buildButton = (label, id, classes) => div(
  { class: 'space-y-2 button-wrapper mt-6 flex items-center' },
  button(
    {
      type: 'button',
      class: classes,
      id,
    },
    label,
  ),
);

export const buildInputElement = (
  fieldLable,
  field,
  inputType,
  inputName,
  autoCmplte,
  required,
  dtName,
  value = '',
) => {
  const dataRequired = required ? span({ class: 'text-red-500' }, '*') : '';
  const hiddenField = inputType === 'hidden' ? 'hidden' : '';
  return div(
    {
      class: `space-y-2 field-wrapper    ${hiddenField}`,
    },
    label(
      {
        for: fieldLable,
        class: 'font-normal text-sm leading-4 rounded-md',
      },
      field,
      dataRequired,
    ),
    input({
      type: inputType,
      name: inputName,
      value,
      id: inputName,
      autocomplete: autoCmplte,
      'data-required': required,
      class:
        'input-focus text-base w-full block text-gray-600 font-extralight border border-solid border-gray-300 rounded-md px-3 py-2',
      'aria-label': dtName,
    }),
    span({
      id: 'msg',
      'data-name': dtName,
      class: 'mt-1 text-sm font-normal leading-4 text-danaherpurple-500',
    }),
  );
};

/*
::::::::::::::::::
 custom function to build a search input field with icon...
 ::::::::::::::::::::::
 */
export const buildSearchWithIcon = (
  fieldLable,
  field,
  inputType,
  inputName,
  autoCmplte,
  required,
  dtName,
  placeholder,
) => {
  const searchElement = div(
    {
      class: 'space-y-2 field-wrapper relative',
      id: 'searchWithIcon',
    },
    div(
      {
        class: 'search-with-icon relative',
      },
      span({
        class: ' icon icon-search absolute mt-2 ml-2',
      }),
      input({
        type: inputType,
        name: inputName,
        id: inputName,
        placeholder,
        autocomplete: autoCmplte,
        'data-required': required,
        class:
          ' min-w-[320px] h-10 rounded-md pl-9 input-focus text-base w-full block px-2 py-4 text-gray-600 font-extralight border border-solid border-gray-300',
        'aria-label': dtName,
      }),
    ),
    span({
      id: 'msg',
      'data-name': dtName,
      class: 'mt-1 text-sm font-normal leading-4 text-danaherpurple-500',
    }),
  );
  decorateIcons(searchElement);
  return searchElement;
};
/*
::::::::::::::::::::::
 custom function to render select box
 :::::::::::::::::::::::
 */
export const buildSelectBox = (
  fieldLable,
  field,
  inputName,
  required,
  dtName,
  itemsList,
) => {
  const dataRequired = required ? span({ class: 'text-red-500' }, '*') : '';
  let options = [];
  if (itemsList && itemsList.length > 0) {
    options = itemsList.map((item) => {
      const value = item.id;
      const optionsList = option({ value }, item.name);
      return optionsList;
    });
  }
  return div(
    { class: 'space-y-2 field-wrapper ' },
    label(
      {
        for: fieldLable,
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
      options,
    ),
    span({
      id: 'msg',
      'data-name': dtName,
      class: 'mt-1 text-sm font-normal leading-4 text-danaherpurple-500',
    }),
  );
};
export function createDropdown(itemsList) {
  /*
  ::::::::::::::::
   Ensure itemsList is an array without reassigning the parameter
   :::::::::::::::::::
   */
  const items = Array.isArray(itemsList) ? itemsList : [itemsList];
  const list = document.createElement('ul');
  list.classList.add(
    ...'absolute w-full max-h-48 overflow-scroll hidden peer-checked:block z-10 bg-white py-2 text-sm text-gray-700 rounded-lg shadow'.split(
      ' ',
    ),
  );
  items.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add(
      ...'block px-4 py-2 hover:bg-danaherpurple-50 cursor-pointer'.split(' '),
    );
    li.textContent = item;
    list.append(li);
  });
  return list;
}

export function buildSelectElement(
  lableFor,
  fieldName,
  inputType,
  inputId,
  dataName,
  inputList,
) {
  const selectIcon = div(
    { class: 'space-y-2' },
    label(
      {
        for: lableFor,
        class: 'font-normal text-sm leading-4',
      },
      fieldName,
      span({ class: 'text-red-500' }, '*'),
    ),
    div(
      { class: 'relative bg-white' },
      input({
        type: inputType,
        id: inputId,
        class: 'peer hidden',
      }),
      label(
        {
          for: inputId,
          class:
            'w-full flex justify-between items-center p-4 text-base text-gray-600 font-extralight border border-solid border-gray-300 cursor-pointer focus:outline-none focus:ring-danaherpurple-500',
        },
        span({ class: 'text-gray-600' }, 'Select'),
        span({ class: 'icon icon-dropdown w-3 h-3' }),
      ),
      createDropdown(inputList),
      span({
        id: 'msg',
        'data-name': dataName,
        class: 'mt-1 text-sm font-normal leading-4 text-danaherpurple-500',
      }),
    ),
  );
  return selectIcon;
}

export const buildCheckboxElement = (
  fieldLable,
  field,
  inputType,
  inputName,
  value,
  required,
  extraClasses = '',
  hidden = '',
) => {
  const hiddenField = hidden ? 'hidden' : '';
  return div(
    { class: `flex items-baseline gap-2 ${hiddenField} ${extraClasses}` },
    input({
      type: inputType,
      name: inputName,
      class: 'input-focus-checkbox',
      id: inputName,
      value,
      'data-required': required,
      'aria-label': inputName,
    }),
    label(
      {
        for: fieldLable,
        class: 'pl-2',
      },
      field,
    ),
  );
};

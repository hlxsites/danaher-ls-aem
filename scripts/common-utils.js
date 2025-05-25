import {
  div,
  input,
  label,
  span,
  button,
  select,
  option,
} from './dom-builder.js';
import { getCommerceBase } from './commerce.js';
import { decorateIcons } from './lib-franklin.js';
import { getAuthenticationToken } from './auth-utils.js';
import { postApiData, getApiData, putApiData } from './api-utils.js';
import { removePreLoader } from './shared-utils.js';

const baseURL = getCommerceBase(); // base url for the intershop api calls
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
  if (dataObject.prototype.hasOwnProperty.call(dataObject, keyToRemove)) {
    delete dataObject[keyToRemove];
  }
  return dataObject;
}
/*

:::::::::::::::::::::::::::
inbuilt and custom dom functions
::::::::::::::::::::::::::::::

*/

export const buildButton = (buttonLabel, id, classes) => div(
  { class: 'space-y-2 button-wrapper mt-6 flex items-center' },
  button(
    {
      type: 'button',
      class: classes,
      id,
    },
    buttonLabel,
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

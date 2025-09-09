import {
  div,
  input,
  label,
  span,
  button,
  select,
  option,
  p,
  h3,
} from './dom-builder.js';
// eslint-disable-next-line import/no-cycle
import { getCommerceBase } from './commerce.js';
import { decorateIcons } from './lib-franklin.js';
import { getAuthenticationToken } from './token-utils.js';
import { postApiData, getApiData, putApiData } from './api-utils.js';

export const baseURL = getCommerceBase(); // base url for the intershop api calls

/*
 ::::::::::::::::::::::::
 Capitalize any string
 ::::::::::::::::::::::::::::::::::::
*/
export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  const preloaderContainer = div(
    {
      class:
        'fixed top-0 left-0 flex items-center justify-center w-screen h-screen z-[100] backdrop-blur-sm',
      id: 'preLoader',
    },
  );
  preloaderContainer?.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" class="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg" style="fill: rgb(117, 35, 255);" data-di-res-id="3267c44e-874c83f9" data-di-rand="1757308281037"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path></svg>');
  return preloaderContainer;
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
const generatePreloader = div(
  {
    class: 'hidden',
    id: 'mainPreLoader',
  },
  preLoader(),
);
const getMainDiv = document.querySelector('body');
getMainDiv.insertAdjacentElement('afterbegin', generatePreloader);

/*
::::::::::::::::::::::
function to append notification container
:::::::::::::::::::::::
*/
const generateNotification = div(
  {
    class: 'fixed flex flex-col bottom-24 left-0 right-10 overflow-hidden pointer-events-none z-[9999]',
    id: 'notificationWrapper',
  },
  div(
    {
      class: 'notification-container max-w-md w-full p-4 space-y-4 border-2 bg-white rounded-md pointer-events-auto ml-auto hidden',
      role: 'alert',
      id: 'notificationContainer',
    },
    div(
      {
        class: 'flex gap-4',
        id: 'notificationContentWrapper',
      },
      div(
        {
          class: 'max-w-[20px]',
          id: 'notificationIconWrapper',
        },
        span(
          {
            id: 'notificationIcon',
            class: 'icon w-6 h-6 fill-current icon-check-circle [&_svg>use]:stroke-[#027243]',
          },
        ),
      ),
      div(
        {
          class: 'flex flex-col gap-2',
        },
        h3({
          class: 'text-2xl p-0 m-0',
        }),
        p({
          class: 'text-base',
        }),
      ),
    ),
  ),
);
decorateIcons(generateNotification);
getMainDiv?.insertAdjacentElement('afterbegin', generateNotification);

/*
::::::::::::::::::::::
function to show / hide notification whenever required
:::::::::::::::::::::::
*/
export function showNotification(content, type, wrapper = '') {
  const container = wrapper ? document.querySelector(wrapper) : getMainDiv;
  const notificationElement = generateNotification; // Should be a DOM element
  container?.insertAdjacentElement('beforebegin', notificationElement);

  const notificationWrapper = document.querySelector('#notificationWrapper');
  if (!notificationWrapper) return;

  const notificationTitle = notificationWrapper.querySelector('h3');
  const notificationContent = notificationWrapper.querySelector('p');
  const notificationContentWrapper = document.querySelector('#notificationContentWrapper');
  const notificationContainer = document.querySelector('#notificationContainer');
  const notificationIconWrapper = document.querySelector('#notificationIconWrapper');
  const notificationIcon = document.querySelector('#notificationIcon');

  const isSuccess = type === 'success';
  const color = isSuccess ? '#027243' : '#AC2734';
  const bgColor = isSuccess ? '#F0FFEF' : '#FFEFEF';
  const iconClass = isSuccess ? 'icon-check-circle' : 'icon-xcircle-red';
  notificationIcon?.querySelector('svg')?.classList.add('rounded-full');
  if (isSuccess) {
    if (notificationIcon?.classList?.contains('[&_svg>use]:stroke-[#AC2734]')) {
      notificationIcon?.classList?.remove('[&_svg>use]:stroke-[#AC2734]');
    }
  } else if (notificationIcon?.classList?.contains('[&_svg>use]:stroke-[#027243]')) {
    notificationIcon?.classList?.remove('[&_svg>use]:stroke-[#027243]');
  }

  // Reset and style wrapper
  notificationWrapper.style.display = 'block';
  if (wrapper) {
    notificationWrapper.className = '';
    notificationContentWrapper?.classList.add('items-center');
    notificationIconWrapper?.classList.add('items-center', 'flex');
    notificationTitle?.classList.add('hidden');
  }

  // Title
  if (notificationTitle) {
    notificationTitle.textContent = isSuccess ? 'Success' : type.toUpperCase();
    notificationTitle.style.color = color;
  }

  // Content
  if (notificationContent) {
    notificationContent.textContent = content;
  }

  // Container styling
  if (notificationContainer) {
    notificationContainer.style.display = 'block';
    notificationContainer.style.backgroundColor = bgColor;
    notificationContainer.style.borderColor = color;
    notificationContainer.style.color = color;
    notificationContainer.classList?.remove('-translate-y-full');
  }

  // Icon
  if (notificationIcon) {
    if (notificationIcon?.classList.contains('icon-check-circle')) {
      notificationIcon.classList.remove('icon-check-circle');
    }
    if (notificationIcon?.classList.contains('icon-xcircle-red')) {
      notificationIcon.classList.remove('icon-xcircle-red');
    }
    notificationIcon?.classList.remove();
    notificationIcon.classList.add(iconClass);
    notificationIcon.classList.add(`[&_svg>use]:stroke-[${color}]`);
  }

  decorateIcons(notificationContainer);
  notificationContainer?.querySelector('svg')?.classList.add('rounded-full');
  setTimeout(() => {
    notificationWrapper.classList.add('-translate-y-full');
    notificationWrapper.style.display = 'none';
  }, 4000);
}
/*
*
*
::::::::::: Scroll View to Top ::::::::
*
*/
export function scrollViewToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  create modal function... Creates a popup/modal with the input content
  @param: content : html content to load into the modal
  @param hasCancelButton : boolean. Optional cancel button
  @param hasCloseButton : boolean. Optional close button
*/
export function createModal(content, hasCancelButton, hasCloseButton, dataType = '', dataAction = '') {
  const modalWrapper = div({
    class:
      'inset-0 fixed w-full  bg-black z-50 bg-opacity-50 flex items-center justify-center',
    id: 'utilityModal',
  });
  const modalContainer = div({
    class: 'relative max-w-2xl w-full items-center bg-white p-8',
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
        'data-type': dataType || 'close',
        'data-action': dataAction || 'close',
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

/**
 * Fetches product information from APIs based on product ID.
 * @param {string} id - Product ID to fetch data for.
 * @returns {Promise<Object|null>} - Product data or null if fetch fails.
 */
export async function getProductInfo(id, needInterShop = true) {
  const api = true;

  if (api) {
    try {
      const coveoResponse = await getApiData(
        `https://${window.DanaherConfig.host}/us/en/product-data/productInfo/?product=${id}`,
      );
      if (coveoResponse?.status === 'success') {
        let productData = {};
        const product = coveoResponse?.data?.results?.[0];
        if (!product) return {};
        const coveoData = {
          title: product?.title,
          url: product?.clickUri,
          images: product?.raw?.images,
          brand: product?.raw?.ec_brand[0],
          objecttype: product?.raw?.objecttype,
          description: product?.raw?.description,
          defaultcategoryname: product?.raw?.defaultcategoryname,
        };

        // if needs intershop data
        if (needInterShop) {
          const intershopProductId = id.slice(0, id.lastIndexOf('-'));
          const intershopData = await getApiData(
            `${baseURL}/products/${intershopProductId}`,
          );

          if (intershopData?.status === 'success') {
            const shopData = intershopData.data;

            const showCart = shopData?.attributes?.some(
              (attr) => attr.name === 'show_add_to_cart' && attr.value === 'True',
            );

            productData = {
              title: coveoData?.title,
              url: coveoData?.url,
              images: coveoData?.images,
              brand: coveoData?.brand,
              objecttype: coveoData?.objecttype,
              description: coveoData?.description,
              defaultcategoryname: coveoData?.defaultcategoryname,
              availability: shopData?.availability?.inStockQuantity,
              uom:
                shopData.packingUnit > 0
                  ? `${shopData.packingUnit}/Bundle`
                  : '1/Bundle',
              minQty: shopData?.minOrderQuantity,
              maxQty: shopData?.maxOrderQuantity,
              showCart,
              price: shopData?.salePrice?.value,
            };
          } else {
            productData = {};
          }
        } else {
          productData = {
            title: coveoData?.title,
            url: coveoData?.url,
            images: coveoData?.images,
            brand: coveoData?.brand,
            objecttype: coveoData?.objecttype,
            description: coveoData?.description,
            defaultcategoryname: coveoData?.defaultcategoryname,
          };
        }
        return productData;
      }
      return {};
    } catch (e) {
      return { status: 'error', data: e };
    }
  } else {
    // Placeholder for future API implementation
    return {};
  }
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
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized.' };
  }
  try {
    const formToSubmit = document.querySelector(`#${id}`);

    if (formToSubmit && formValidate(id)) {
      const url = `${baseURL}/${action}`;

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
    showNotification('Error Submitting Form.', 'error');
    return { status: 'error', data: 'Error Submitting Form.' };
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
export async function getCountries() {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
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
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }

  try {
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
Function to get states from the api based oncountry
:::::::::::::::::::::::::::
 * @param {string} countryCode - The country code to get the states.
*/
export async function getStates(countryCode) {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  try {
    const url = `${baseURL}/countries/${countryCode}/main-divisions`;
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
    const configurations = localStorage.getItem('generalConfigurations');
    if (configurations) return await JSON.parse(configurations);
    localStorage.removeItem('generalConfigurations');
    const url = `${baseURL}/configurations`;
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'Application/json');
    // defaultHeaders.append("authentication-token", authenticationToken);
    const response = await getApiData(url, defaultHeaders);

    if (response.status === 'success') {
      localStorage.setItem('generalConfigurations', JSON.stringify(response));
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
  if (dataObject?.prototype?.hasOwnProperty.call(dataObject, keyToRemove)) {
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
  classes = '',
) => {
  const dataRequired = required ? span({ class: 'text-red-500' }, '*') : '';
  const hiddenField = inputType === 'hidden' ? 'hidden' : '';
  return div(
    {
      class: `space-y-2 field-wrapper relative  ${hiddenField} ${classes}`,
    },
    label(
      {
        for: fieldLable,
        class: 'font-normal pl-4 text-sm peer-hover:bg-danaherpurple-500 peer-checked:bg-danaherpurple-500 leading-4',
      },
      field,
      dataRequired,
    ),
    input({
      type: inputType,
      name: inputName,
      value,
      id: fieldLable,
      autocomplete: autoCmplte,
      'data-required': required,
      class:
        `input-focus ${(inputType === 'radio' || inputType === 'checkbox') ? 'absolute' : ''} left-0 text-base w-full block text-gray-600  border border-solid border-gray-600 peer px-3 py-2`,
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
          ' min-w-xs h-10 pl-9 input-focus text-base w-full block px-2 py-4 text-gray-600  border border-solid border-gray-600',
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
          'input-focus text-base w-full block px-2 py-4  border border-solid border-gray-600',
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
    ...'absolute w-full max-h-48 overflow-scroll hidden peer-checked:block z-10 bg-white py-2 text-sm text-gray-700  shadow'.split(
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
            'w-full flex justify-between items-center p-4 text-base text-gray-600  border border-solid border-gray-600 cursor-pointer focus:outline-none focus:ring-danaherpurple-500',
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

export const buildBillingCheckboxElement = (
  fieldLable,
  field,
  inputType,
  inputName,
  fieldValue,
  required,
  extraClasses = '',
  hidden = '',
) => {
  const shipAsBillBox = div(
    {
      id: 'shippingAsBillingCheckboxWrapper',
      class: `flex center gap-2 mt-6 false relative ${extraClasses} ${hidden}`,
    },
    div(
      {
        class: 'hidden',
        id: 'sameShipAsBillCheck',
      },
      span(
        {
          class: 'icon icon-check-circle-filled',
        },
      ),
    ),
    input({
      type: inputType,
      name: inputName,
      class: 'input-focus-checkbox absolute mt-1',
      id: inputName,
      value: fieldValue,
      'aria-label': fieldLable,
    }),
    label(
      {
        for: inputName,
        class: 'pl-6 z-10',
      },
      field,
    ),
  );
  decorateIcons(shipAsBillBox);
  return shipAsBillBox;
};

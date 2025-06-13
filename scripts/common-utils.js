import {
  div,
  input,
  label,
  span,
  button,
  select,
  option,
  p,
} from './dom-builder.js';
import { getCommerceBase } from './commerce.js';
import { decorateIcons } from './lib-franklin.js';

export const baseURL = getCommerceBase(); // base url for the intershop api calls
export const siteID = window.DanaherConfig?.siteID;
export const hostName = window.location.hostname;

/*
 ::::::::::::::::::::::::
 utility function to close the modal...
 can be imported and used globally
 for the modal created using
 utlility createModal function
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

export async function getCategoryInfo(category) {
  const useApi = true;

  if (useApi) {
    try {
      const response = await fetch('https://lifesciences.danaher.com/us/en/products-index.json');
      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.error(`API request failed with status ${response.status}`);
        return {};
      }
      const responseData = await response.json();

      const products = responseData.data;
      if (!Array.isArray(products)) {
        // eslint-disable-next-line no-console
        console.error("API response 'data' is not an array:", products);
        return {};
      }

      const product = products.find((item) => item.fullCategory === category);
      if (!product) {
        // eslint-disable-next-line no-console
        console.warn(`No product found for category: ${category}`);
        return {};
      }

      return {
        title: product.title,
        path: product.path,
        image: product.image,
        description: product.description,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in getCategoryInfo:', error);
      return {};
    }
  } else {
    // Placeholder for future API implementation
    return {};
  }
}

/**
 * Fetches product information from APIs based on product ID.
 * @param {string} id - Product ID to fetch data for.
 * @returns {Promise<Object|null>} - Product data or null if fetch fails.
 */
export async function getProductInfo(id) {
  const useApi = true;

  if (useApi) {
    try {
      const productResponse = await fetch(
        `https://stage.lifesciences.danaher.com/us/en/product-data/productInfo/?product=${id}`,
      );
      if (!productResponse.ok) {
        return {};
      }
      const productData = await productResponse.json();
      const product = productData.results?.[0];
      if (!product) return {};

      const sku = product.raw?.sku || '';
      const shopResponse = await fetch(
        `https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`,
      );
      if (!shopResponse.ok) {
        return {};
      }
      const shopData = await shopResponse.json();

      const showCart = shopData?.attributes?.some(
        (attr) => attr.name === 'show_add_to_cart' && attr.value === 'True',
      );
      const showAvailability = product.raw?.mappingtype?.toLowerCase() === 'family';

      return {
        title: product.title || '',
        url: product.clickUri || '#',
        images: product.raw?.images || [],
        showAvailability,
        carrierFree: product.raw.defaultcategoryname,
        availability: shopData.availability?.inStockQuantity,
        uom:
          shopData.packingUnit > 0
            ? `${shopData.packingUnit}/Bundle`
            : '1/Bundle',
        minQty: shopData.minOrderQuantity,
        description: product.raw?.ec_shortdesc || '',
        showCart,
        price: shopData.salePrice?.value,
      };
    } catch (error) {
      return { status: 'error', error };
    }
  } else {
    // Placeholder for future API implementation
    return {};
  }
}
/*

:::::::::::::::::::::::::::
inbuilt and custom dom functions
::::::::::::::::::::::::::::::

*/

export const buildButton = (buttonlabel, id, classes) => div(
  { class: 'space-y-2 button-wrapper mt-6 flex items-center' },
  button(
    {
      type: 'button',
      class: classes,
      id,
    },
    buttonlabel,
  ),
);

export const buildInputElement = (
  lable,
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
        for: lable,
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
  lable,
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
  lable,
  field,
  inputName,
  required,
  dtName,
  itemsList,
) => {
  const dataRequired = required ? span({ class: 'text-red-500' }, '*') : '';
  let selectOptions = [];
  if (itemsList && itemsList.length > 0) {
    selectOptions = itemsList.map((item) => {
      const value = item.id;
      const options = option({ value }, item.name);
      return options;
    });
  }
  return div(
    { class: 'space-y-2 field-wrapper ' },
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
      selectOptions,
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
  lable,
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
        for: lable,
        class: 'pl-2',
      },
      field,
    ),
  );
};

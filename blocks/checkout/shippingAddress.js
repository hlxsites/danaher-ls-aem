import {
  h2, h3, h5, span, div, p, button, input, label,
} from '../../scripts/dom-builder.js';
/*
 ::::::::::::::
 prebuilt function to render icons based on the class used i.e: icon icon-search
 ::::::::::::::
 */
import { decorateIcons } from '../../scripts/lib-franklin.js';

/*
::::::::::::::::
import  functions / modules from common utilities
... :::::::::::::::::
*/
import {
  buildBillingCheckboxElement,
  buildSearchWithIcon,
  capitalizeFirstLetter,
  closeUtilityModal,
  createModal,
  removePreLoader,
  showNotification,
  showPreLoader,
  getStates,
} from '../../scripts/common-utils.js';
/*
::::::::::::::::::
import  functions / modules from checkout utilities...
:::::::::::::
*/
import {
  addressForm,
  addressList,
  defaultAddress,
  getAddresses,
  getBasketDetails,
  getUseAddresses,
  setUseAddress,
  updateAddresses,
  updateAddressToDefault,
  updateCheckoutSummary,
  loadGmapsScript,
  updateShippingMethods,
  validateBasket,
} from '../../scripts/cart-checkout-utils.js';
import { updateBasketDetails } from '../cartlanding/cartSharedFile.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';

// load google maps script
await loadGmapsScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCCLCWBAwQawztgIw0AobQk8q-2OlEzuzQ&libraries=places');

// get current basket details
const getCurrentBasketDetails = await getBasketDetails();

// google maps api to autopopulate fields
function initGmapsAutocomplete(addressType, addressInput = '') {
  let gInput;
  if (addressInput) {
    gInput = addressInput;
  } else {
    gInput = document.getElementById('addressLine1');
  }

  // eslint-disable-next-line no-undef
  const autocomplete = new google.maps.places.Autocomplete(gInput, {
    types: ['address'], // restrict to addresses
    componentRestrictions: { country: 'us' },
    // optional: restrict to India
  });

  autocomplete.addListener('place_changed', async () => {
    showPreLoader();
    const place = autocomplete.getPlace();

    const components = place.address_components;

    const getComponent = (type) => {
      const comp = components.find((c) => c.types.includes(type));
      if (type === 'country' || type === 'locality') {
        return comp ? comp.short_name : '';
      }
      return comp ? comp.long_name : '';
    };

    const streetNumber = getComponent('street_number');
    const street = getComponent('route') || '';
    const gCity = getComponent('locality') || getComponent('administrative_area_level_2');
    const state = getComponent('locality') || getComponent('administrative_area_level_1');
    const postcode = getComponent('postal_code');
    const country = getComponent('country');
    /*
    console.log('streetNumber: ', streetNumber);
    console.log('street: ', street);
    console.log('gCity: ', gCity);
    console.log('state: ', state);
    console.log('postcode: ', postcode);
    console.log('country: ', country); */

    const getFormId = document.querySelector(`#${addressType}AddressForm`);
    if (getFormId) {
      getFormId.querySelectorAll('.field-wrapper')?.forEach((fd) => {
        if (fd?.classList.contains('!w-full')) {
          fd.classList.remove('!w-full');
        }
        if (fd?.classList.contains('hidden')) {
          fd.classList.remove('hidden');
        }
      });
      gInput.value = street;
      const addressLine2 = getFormId.querySelector('#addressLine2');
      if (addressLine2) {
        addressLine2.value = streetNumber;
      }
      const city = getFormId.querySelector('#city');
      if (city) {
        city.value = gCity;
      }
      const postalCode = getFormId.querySelector('#postalCode');
      if (postalCode) {
        postalCode.value = postcode;
      }
      const countryCode = getFormId.querySelector('#countryCode');
      if (countryCode) {
        countryCode.value = country;
      }
      const mainDivision = getFormId.querySelector('#mainDivision');
      if (mainDivision) {
        const statesList = await getStates(country);
        statesList?.data?.data?.forEach((stat) => {
          const option = document.createElement('option');
          option.value = stat.id;
          option.text = stat.name;
          if (stat.name === state) {
            option.selected = true;
          }
          mainDivision.appendChild(option);
        });
      }
    }
    removePreLoader();
  });
}

/*
 :::::::::::::::::::::::::::::
 Render Adress list for the address modal for shipping/billing
 ::::::::::::::::::::::::::::::
 * @param {HTML} id - The ID of the current address.
 * @param {Array} addressList - Shipping/Billing address list array.
 * @param {String} type - shipping/billing.
 */
const renderAddressList = (addressItems, addressListArray, type) => {
  if (typeof addressListArray !== 'undefined' && addressListArray.length > 0) {
    addressItems.textContent = '';
    const filteredArray = addressListArray.filter((adr) => {
      if (type === 'shipping') {
        return adr?.shipToAddress === true;
      }
      return adr?.invoiceToAddress === true;
    });
    let selectedAddress;
    let checkedUseAddress;
    const checkUseAddresses = JSON.parse(sessionStorage.getItem('useAddress'));
    if (checkUseAddresses?.status === 'success') {
      checkedUseAddress = checkUseAddresses?.data;
    }
    filteredArray.forEach((item, index) => {
      if (typeof item !== 'undefined') {
        let defaultBgClass = '';
        if (type === 'shipping' && typeof item !== 'undefined') {
          if (item.preferredShippingAddress) {
            defaultBgClass = `is-default-${type}-address`;
          }
        }
        if (type === 'billing' && typeof item !== 'undefined') {
          if (item.preferredBillingAddress) {
            defaultBgClass = `is-default-${type}-address`;
          }
        }
        if (checkedUseAddress) {
          if (type === 'shipping') {
            selectedAddress = checkedUseAddress?.commonShipToAddress?.id === item.id;
          }
          if (type === 'billing') {
            selectedAddress = checkedUseAddress?.invoiceToAddress?.id === item.id;
          }
        }
        /*
        ::::::::::::::
        button to set the ${type}(billing/shipping) address as the default  address
        ::::::::::::::
        */
        let makeDefaultButton = '';
        if ((item?.preferredShippingAddress === 'true' && type === 'shipping') || (type === 'billing' && item?.preferredBillingAddress === 'true')) {
          makeDefaultButton = div(
            {
              class: `flex justify-between items-center gap-3 is-default-${type}-address mt-6 cursor-pointer`,
            },
            input(
              {
                type: 'checkbox',
                name: `default${type}address`,
                id: `c_${type}_${index}`,
                class: `input-focus-checkbox  is-default-${type}-address `,
                'data-required': false,
              },
            ),
            label(
              {
                for: `c_${type}_${index}`,
                class: 'text-black text-base',
              },
              'Default Address',
            ),
          );
        } else {
          makeDefaultButton = div(
            {
              class: `relative flex gap-3 text-right is-default-${type}-address mt-6 cursor-pointer`,
            },
            input(
              {
                type: 'checkbox',
                name: `default${type}address`,
                id: `c_${type}_${index}`,
                class: `input-focus-checkbox  not-default-${type}-address`,
                'data-required': false,
              },
            ),
            label(
              {
                for: `c_${type}_${index}`,
                class: 'text-black text-base',
              },
              'Make this my default address',
            ),
          );
        }

        const addressListItem = div(
          {
            id: `item_c_${type}_${index}`,
            'data-address': JSON.stringify(item),
            class: `:hover:bg-gray-100 flex justify-between p-6 border ${selectedAddress ? 'border-danaherpurple-500' : 'border-danahergray-300'}  ${type}-address-list-item ${defaultBgClass}`,
          },
          div(
            {
              class: `flex flex-col ${type}-address-list-item-content`,
              id: `${type}AddressListContentActions-${index}`,
            },
            h5(
              {
                class: 'font-semibold m-0 p-0',
              },
              typeof item.companyName2 !== 'undefined' ? item.companyName2 : '',
            ),
            p(
              {
                class: 'text-black text-base ',
              },
              item.addressLine1 || '',
            ),
            p(
              {
                class: 'text-black text-base ',
              },
              item.city || '',
            ),
            p(
              {
                class: 'text-black text-base ',
              },
              `${item.mainDivision || ''}, ${item.countryCode || ''}, ${item.postalCode || ''}`,
            ),
            makeDefaultButton,
          ),
          div(
            {
              class: `${type}-address-list-item-actions flex flex-col justify-between`,
              id: `${type}AddressListItemActions-${index}`,
            },
            div(
              {
                class: 'flex items-center',
              },
              span(
                {
                  class: `text-danaherpurple-500 cursor-pointer edit-${type}-address-button flex hover:text-danaherpurple-800 justify-start  text-base font-semibold`,
                  'data-address': JSON.stringify(item),
                },
                'Edit',
              ),
              span(
                {
                  class: 'flex text-danaherpurple-500',
                },
                '|',
              ),
              span(
                {
                  class:
                    'flex  justify-start text-base font-semibold text-danaherpurple-500 hover:text-danaherpurple-800 cursor-pointer',
                  'data-address': JSON.stringify(item),
                },
                'Copy',
              ),
            ),
            button(
              {
                id: item.id,
                class: `${type}-address-use-button text-xl  border-danaherpurple-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6`,
              },
              selectedAddress ? 'Selected Address' : 'Use address',
            ),
          ),
        );
        // mark the default address as checked
        addressListItem?.querySelectorAll('input[type="checkbox"]')?.forEach((element) => {
          if (element.classList.contains('is-default-shipping-address') || element.classList.contains('is-default-billing-address')) {
            element.checked = true;
          }
        });
        /*
:::::::::::::::::::::::::::::
click use address button to set the address as default for current order
:::::::::::::::::::::::::::::
        */
        const useAddressButton = addressListItem.querySelector(
          `.${type}-address-use-button`,
        );
        useAddressButton?.addEventListener('click', async (event) => {
          event.preventDefault();
          try {
            if (event.target?.textContent === 'Selected Address') throw new Error('Already Selected.');
            showPreLoader();
            const useAddressId = event.target.id;
            const useAddressButtonResponse = await setUseAddress(
              useAddressId,
              type,
              'useAddress',
            );
            const basketShipToAddress = getCurrentBasketDetails?.data?.data?.commonShipToAddress;
            const basketInvoiceToAddress = getCurrentBasketDetails?.data?.data?.invoiceToAddress;

            if ((type === 'billing' && useAddressId !== basketShipToAddress?.split(':')[4]) || (type === 'shipping' && useAddressId !== basketInvoiceToAddress?.split(':')[4])) {
              const getShipAsBillBox = document.querySelector('#shippingAsBillingCheckboxWrapper');
              if (getShipAsBillBox) {
                if (getShipAsBillBox?.classList.contains('pointer-events-none')) {
                  getShipAsBillBox?.classList.remove('pointer-events-none');
                }
                const shipAsBillCheck = getShipAsBillBox?.querySelector('#sameShipAsBillCheck');
                const shipAsBillLabel = getShipAsBillBox?.querySelector('label');
                const shipAsBillInput = getShipAsBillBox?.querySelector('input');
                if (shipAsBillInput?.classList.contains('hidden')) {
                  shipAsBillInput?.classList.remove('hidden');
                }
                if (shipAsBillLabel?.classList.contains('pl-2')) {
                  shipAsBillLabel?.classList.remove('pl-2');
                  shipAsBillLabel?.classList.add('pl-6');
                }
                shipAsBillCheck?.classList.add('hidden');
              }
            }
            if (useAddressButtonResponse?.status === 'success') {
              const renderDefaultAddress = defaultAddress(
                type === 'shipping'
                  ? useAddressButtonResponse.data?.commonShipToAddress
                  : useAddressButtonResponse.data?.invoiceToAddress,
                type,
              );
              const getDefaultAddressWrapper = document.querySelector(
                `#${type}AddressHeader`,
              );
              if (getDefaultAddressWrapper && renderDefaultAddress) {
                /*
                  ::::::::::::::
                  show this address as default address
                  :::::::::::::
                  */
                getDefaultAddressWrapper.insertAdjacentElement(
                  'afterend',
                  renderDefaultAddress,
                );
                if (renderDefaultAddress.classList.contains('hidden')) {
                  renderDefaultAddress.classList.remove('hidden');
                }
              }

              /*
              ::::::::::::::
              update address list
              ::::::::::::::
              */
              // await updateAddresses();
              /*
              ::::::::::::::
              update basket with the current use address
              ::::::::::::::
              */
              await updateBasketDetails();
              /*
              ::::::::::::::
              update checkout summary module
              ::::::::::::::
              */
              await updateCheckoutSummary();

              /*
              ::::::::::::::
              close utility modal
              :::::::::::::::::::
              */
              closeUtilityModal();
              const getSameAsShippingCheckbox = document.querySelector('#shippingAsBillingAddress');
              if (getSameAsShippingCheckbox) {
                getSameAsShippingCheckbox.checked = false;
              }
              // remove preloader
              removePreLoader();

              showNotification('Address set for current order.', 'success');
            } else {
              throw new Error('Error processing request.');
            }
          } catch (error) {
            removePreLoader();
            showNotification(error.message, 'error');
          }
        });
        addressItems.append(addressListItem);
      }
    });
    addressItems?.addEventListener('click', async (event) => {
      let clickedCheckbox;
      let checkboxId;

      // If label clicked, find associated checkbox
      if (event.target.tagName === 'LABEL') {
        checkboxId = event.target.getAttribute('for');
        clickedCheckbox = document.getElementById(checkboxId);
      }

      // If checkbox clicked directly
      if (event.target.classList.contains(`not-default-${type}-address`)) {
        clickedCheckbox = event.target;
        checkboxId = event.target.id;
      }

      if (!clickedCheckbox && !event.target.classList.contains(`edit-${type}-address-button`)) return;

      if (clickedCheckbox?.classList.contains(`not-default-${type}-address`)) {
        const getParent = addressItems?.querySelector(`#item_${checkboxId}`);

        showPreLoader();
        const setAddressDetails = JSON.parse(
          getParent.getAttribute('data-address'),
        );
        if (type === 'shipping' && (setAddressDetails && typeof setAddressDetails === 'object')) {
          Object.assign(setAddressDetails, {
            preferredShippingAddress: 'true',
          });
          Object.assign(setAddressDetails, { type: 'MyAddress' });
        }

        if (type === 'billing' && (setAddressDetails && typeof setAddressDetails === 'object')) {
          Object.assign(setAddressDetails, {
            preferredBillingAddress: 'true',
          });
          Object.assign(setAddressDetails, { type: 'MyAddress' });
        }

        /*
        ::::::::::::::
        update address
        ::::::::::::::
        */
        await updateAddressToDefault(setAddressDetails);
        /*
        ::::::::::::::
        update address list
        ::::::::::::::
        */
        await updateAddresses();
        /*
        ::::::::::::::
        close utility modal
        ::::::::::::::
        */
        // closeUtilityModal();

        const currentDefaultAddress = addressItems?.querySelectorAll(`.${type}-address-list-item`);
        currentDefaultAddress?.forEach((it) => {
          if (it?.classList.contains('border-danaherpurple-500')) {
            it.classList.remove('border-danaherpurple-500');
            it.classList.add('border-danahergray-300');
          }
          const currentInput = it.querySelector('input');
          currentInput.checked = false;
          const currentInputSpan = it.querySelector('label');
          currentInput.checked = false;
          currentInputSpan.textContent = 'Make this my default address';
          if (it?.classList.contains(`is-default-${type}-address`)) {
            it.classList.remove(`is-default-${type}-address`);
          }
          if (currentInput?.classList.contains(`is-default-${type}-address`)) {
            currentInput.classList.remove(`is-default-${type}-address`);
          }
          it.classList.add(`not-default-${type}-address`);
          currentInput.classList.add(`not-default-${type}-address`);
        });
        if (getParent) {
          const gCurrentInput = getParent.querySelector('input');
          const gCurrentInputSpan = getParent.querySelector('label');
          gCurrentInput.checked = true;
          getParent.classList.add(`is-default-${type}-address`);
          gCurrentInput.classList.add(`is-default-${type}-address`);
          if (getParent?.classList.contains(`not-default-${type}-address`)) {
            getParent.classList.remove(`not-default-${type}-address`);
          }
          if (getParent?.classList.contains('border-danahergray-300')) {
            getParent.classList.remove('border-danahergray-300');
            getParent.classList.add('border-danaherpurple-500');
          }
          if (gCurrentInput?.classList.contains(`not-default-${type}-address`)) {
            gCurrentInput.classList.remove(`not-default-${type}-address`);
          }
          gCurrentInputSpan.textContent = 'Default Address';
        }

        removePreLoader();
        showNotification('Address set as default.', 'success');
      }

      if (event.target.classList.contains(`edit-${type}-address-button`)) {
        showPreLoader();
        const editAddress = JSON.parse(
          event.target.getAttribute('data-address'),
        );
        if (editAddress) {
          const addressFormModal = await addressForm(type, editAddress);
          if (addressFormModal) {
            closeUtilityModal();
            createModal(addressFormModal, true, true);
            removePreLoader();
          }
        }
      }
    });
  } else {
    addressItems.textContent = '';
    const emptyAddressListWrapper = div(
      {
        class: 'flex flex-col justify-between items-center w-full',
      },
      h3(
        {
          class: 'text-black text-center flex items-center justify-center',
        },
        'Hmm, it looks like there are no addresses that match',
      ),
      p(
        {
          class: 'text-gray-500 mb-6',
        },
        'Lets see how we can fix that',
      ),
      div(
        {
          class: 'flex w-full justify-center gap-4 items-center mt-6',
        },
        button(
          {
            class:
              'text-xl  border-danaherpurple-500 border-solid btn btn-lg font-medium btn-primary-purple mt-6 rounded-full px-6',
            id: `addNew${capitalizeFirstLetter(type)}AddressButton`,
          },
          'Add new address',
        ),
        button(
          {
            class:
              'text-xl  border-danaherpurple-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6',
            id: `clear${capitalizeFirstLetter(type)}AddressListSearch`,
          },
          'Clear Search',
        ),
      ),
    );
    addressItems.append(emptyAddressListWrapper);

    const addNewAddressButton = addressItems.querySelector(
      `#addNew${capitalizeFirstLetter(type)}AddressButton`,
    );
    const clearSearchButton = addressItems.querySelector(
      `#clear${capitalizeFirstLetter(type)}AddressListSearch`,
    );

    if (addNewAddressButton) {
      addNewAddressButton.addEventListener('click', async () => {
        closeUtilityModal();
        const addressFormModal = await addressForm(type, '');
        if (addressFormModal) {
          createModal(addressFormModal, true, true);
          initGmapsAutocomplete(type);
        }
      });
    }

    if (clearSearchButton) {
      clearSearchButton.addEventListener('click', () => {
        /*
        ::::::::::::::
        clear search functionality for search for address list popup
        ::::::::::::::
        */
        const addressListSearchInput = document.querySelector(
          '#searchWithIcon input',
        );
        if (addressListSearchInput) {
          addressListSearchInput.value = '';
          addressListSearchInput.dispatchEvent(
            new Event('input', { bubbles: true }),
          );
        }
      });
    }
  }
  return addressItems;
};

/*
::::::::::::::
generate the shipping address list module
::::::::::::::
*/
export const addressListModal = async (type) => {
  const addressListWrapper = div({
    class: 'flex flex-col',
    id: `${type}AddressListModal`,
  });
  const addressListHeader = div(
    {
      class: 'flex flex-col',
      id: `${type}AddressListModalHeader`,
    },
    p(
      {
        class: 'text-bold text-3xl',
      },
      'My Addresses',
    ),
    div(
      {
        class: 'flex justify-between items-center my-4 py-4',
        id: `${type}AddressListHeaderActions`,
      },
      buildSearchWithIcon(
        'search',
        'search',
        'text',
        'search',
        false,
        false,
        'search',
        'Search addresses',
      ),
      div(
        {
          class: 'flex justify-between gap-2',
          id: `${type}AddressListAddButton`,
        },
        // span({
        //   class: 'icon icon-plus-circle',
        //   id: 'plusCircleIcon',
        // }),
        button(
          {
            class: 'flex w-full text-white text-xl  btn btn-lg font-medium btn-primary-purple rounded-full px-6',
          },
          'Add New Address',
        ),
      ),
    ),
  );
  if (addressListHeader) {
    const addNewAddress = addressListHeader.querySelector(
      `#${type}AddressListAddButton`,
    );
    if (addNewAddress) {
      addNewAddress.addEventListener('click', async () => {
        closeUtilityModal();
        /*
         :::::::::::::::::::::::
         generates addresses form
         ::::::::::::::::::::::::::::::::::::::
         */
        const addressFormModal = await addressForm(type, '');
        if (addressFormModal) {
          createModal(addressFormModal, true, true);
          initGmapsAutocomplete(type);
        }
      });
    }
  }
  const addressListContent = div({
    class: 'flex flex-col',
    id: `${type}AddressListModalContent`,
  });
  const addressItems = div({
    class:
      'max-h-97 overflow-auto flex flex-col gap-6 pt-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500',
    id: `${type}AddressListItemsWrapper`,
  });
  showPreLoader();
  /*
  :::::::::::::::::::::::
  get addresses from the Address API
  ::::::::::::::::::::::::::::::::::::::
  */
  const addressListData = await addressList(type);

  addressItems.textContent = '';
  renderAddressList(addressItems, addressListData, type);

  /*
  ::::::::::::::
  search functionality for search for address list popup
  ::::::::::::::
  */
  const addressListSearchInput = addressListHeader.querySelector(
    '#searchWithIcon input',
  );
  if (addressListSearchInput) {
    addressListSearchInput.addEventListener('input', (e) => {
      e.preventDefault();

      const searchTerm = e.target.value.toLowerCase();
      const searchedAddress = addressListData.filter((ad) => {
        const lowerCaseCompanyName = ad?.companyName2?.toLowerCase();
        const lowerCaseAddressLine1 = ad?.addressLine1?.toLowerCase();
        const lowerCasefirstName = ad?.firstName?.toLowerCase();
        const lowerCaselastName = ad?.lastName?.toLowerCase();
        const lowerCasestreet = ad?.street?.toLowerCase();
        const lowerCasestate = ad?.state?.toLowerCase();
        const lowerCasecountry = ad?.country?.toLowerCase();
        const lowerCasecity = ad?.city?.toLowerCase();
        const lowerCasemainDivisionName = ad?.mainDivisionName?.toLowerCase();
        const lowerCasepostalCode = ad?.postalCode;
        return (
          lowerCaseAddressLine1?.includes(searchTerm)
          || lowerCaseCompanyName?.includes(searchTerm)
          || lowerCasefirstName?.includes(searchTerm)
          || lowerCaselastName?.includes(searchTerm)
          || lowerCasestreet?.includes(searchTerm)
          || lowerCasestate?.includes(searchTerm)
          || lowerCasestreet?.includes(searchTerm)
          || lowerCasecountry?.includes(searchTerm)
          || lowerCasecity?.includes(searchTerm)
          || lowerCasepostalCode?.includes(searchTerm)
          || lowerCasemainDivisionName?.includes(searchTerm)
        );
      });
      renderAddressList(addressItems, searchedAddress, type);
    });
  }

  if (addressListHeader) addressListWrapper.append(addressListHeader);
  if (addressItems) addressListContent.append(addressItems);
  if (addressListContent) addressListWrapper.append(addressListContent);
  decorateIcons(addressListWrapper);

  return addressListWrapper;
};

/*
::::::::::::::::
add event listener to show address list modal...
:::::::::::::::::
*/
document.addEventListener('click', async (e) => {
  e.preventDefault();
  if (e.target.matches('.editAddressButton')) {
    /*
      ::::::::::::::
      load modal for shipping address list
      ::::::::::::::
      */
    const type = e.target.getAttribute('data-type');
    const action = e.target.getAttribute('data-action');
    if (type && action === 'edit') {
      const addressesModal = await addressListModal(type);
      createModal(addressesModal, false, true);
      removePreLoader();
      return Promise.resolve({});
    }
    return Promise.resolve({});
  }
  return Promise.resolve({});
});
/* ::::::::::::::::::::
// if the use billing address is not set, we will show default address
// else will show add billing address button
// :::::::::::::::::::::::
*/
function generateDefaultAddress(
  getDefaultAddressesResponse,
  defaultBillingAddressButton,
  moduleContent,
) {
  if (getDefaultAddressesResponse?.status === 'success') {
    const address = getDefaultAddressesResponse?.data?.filter(
      (adr) => adr.preferredBillingAddress === 'true',
    );

    if (address.length > 0) {
      const defaultBillingAddress = defaultAddress(address[0], 'billing');

      if (defaultBillingAddress) {
        moduleContent.append(defaultBillingAddress);
        if (defaultBillingAddress.classList.contains('hidden')) {
          defaultBillingAddress.classList.remove('hidden');
        }
      }
    } else if (defaultBillingAddressButton) {
      moduleContent.append(defaultBillingAddressButton);
      const checkIfDefaultAddress = moduleContent.querySelector(
        '#defaultBillingAddress',
      );
      if (checkIfDefaultAddress) {
        checkIfDefaultAddress.remove();
      }
    }
  } else if (defaultBillingAddressButton) {
    moduleContent.append(defaultBillingAddressButton);
    const checkIfDefaultAddress = moduleContent.querySelector(
      '#defaultBillingAddress',
    );
    if (checkIfDefaultAddress) {
      checkIfDefaultAddress.remove();
    }
  }
}
/*
  ::::::::::::::
  generates the shipping address module for the checkout module/page
::::::::::::::
*/
export const shippingAddressModule = async () => {
  try {
    if (!window.location.pathname.includes('addresses')) return false;
    const authenticationToken = await getAuthenticationToken();
    if (authenticationToken?.status === 'error') {
      throw new Error('Unauthorized Access');
    }
    const validateData = {
      adjustmentsAllowed: true,
      scopes: [
        'Products',
        'Promotion',
        'Value',
        'CostCenter',
      ],
    };
    const validatingBasket = await validateBasket(validateData);
    if (validatingBasket?.status === 'error') throw new Error('Invalid Basket');
    const moduleContent = div({});
    const moduleShippingDetails = div(
      {
        class: 'relative flex flex-col mb-6',
        id: 'shippingAddressHeader',
      },
      h2(
        {
          class:
            'text-black text-left text-3xl font-normal leading-12 p-0 m-0  pb-6',
        },
        'Shipping address',
      ),
      p(
        {
          class:
            'self-stretch justify-start text-black text-base font-normal ',
        },
        'Where should we ship your products to? Add a new address or picked from your saved addresses to streamline your checkout process.',
      ),
    );
    const moduleBillingDetails = div(
      {
        class: 'flex flex-col pt-6 pb-4 mb-4',
        id: 'billingAddressHeader',
      },
      h2(
        {
          class: 'text-black text-3xl text-left font-normal leading-12',
        },
        'Bill to address',
      ),
      p(
        {
          class:
            'self-stretch justify-start text-black text-base   ',
        },
        'Where should we ship your products to? Add a new address or picked from your saved addresses to streamline your checkout process.',
      ),
    );
    /*
    ::::::::::::::::::::::
    generates the checkbox to set biiling as shipping address
    ::::::::::::::
    */
    const shippingAsBillingAddress = buildBillingCheckboxElement(
      'shippingAsBillingAddress',
      'Same as shipping address',
      'checkbox',
      'shippingAsBillingAddress',
      true,
      false,
      'mt-6',
      false,
      false,
    );
    /*
     ::::::::::::::
     handle the checkbox to set/unset shipping as billing address
     ::::::::::::::
     */
    const shippingAsBillingAddressInput = shippingAsBillingAddress.querySelector('input');
    /*
   ::::::::::::::
   get all addresses details added
   ::::::::::::::
   */
    const getDefaultAddressesResponse = await getAddresses();

    /*
   ::::::::::::::
   get addresses which are set as use address for the current order shipping/billing
   ::::::::::::::
   */
    const getUseAddressesResponse = await getUseAddresses();
    const useInvoiceToAddress = getUseAddressesResponse?.data?.invoiceToAddress;
    const useShipToAddress = getUseAddressesResponse?.data?.commonShipToAddress;
    /*
    *
     ::::::::::::::::::::::::
     checkbox action for shipping as billing address
     (shippingAsBilling Checkbox :checked action)
     ::::::::::::::::::::::::
    *
    */
    const basketInvoiceToAddress = getCurrentBasketDetails?.data?.data?.invoiceToAddress;
    const basketShipToAddress = getCurrentBasketDetails?.data?.data?.commonShipToAddress;
    if (basketInvoiceToAddress === basketShipToAddress) {
      if (shippingAsBillingAddress) {
        shippingAsBillingAddress.checked = true;
        setTimeout(() => {
          const getShipAsBillBox = document.querySelector('#shippingAsBillingCheckboxWrapper');
          if (getShipAsBillBox) {
            getShipAsBillBox?.classList.add('pointer-events-none');

            const sameShipAsBillCheck = getShipAsBillBox?.querySelector('#sameShipAsBillCheck');
            const shipAsBillLabel = getShipAsBillBox?.querySelector('label');

            getShipAsBillBox?.querySelector('input')?.classList.add('hidden');
            if (sameShipAsBillCheck?.classList.contains('hidden')) {
              sameShipAsBillCheck?.classList.remove('hidden');
            }

            if (shipAsBillLabel?.classList.contains('pl-6')) {
              shipAsBillLabel?.classList.remove('pl-6');
              shipAsBillLabel?.classList.add('pl-2');
            }
          }
        }, 0);
      }
    }
    // actions when shippingAsBilling :checked clicked
    shippingAsBillingAddress?.addEventListener('click', async (c) => {
      let targetCheckbox;
      let targetFrom;

      // If label clicked, find associated checkbox
      if (c.target.tagName === 'LABEL') {
        const checkboxId = c.target.getAttribute('for');
        targetCheckbox = document.getElementById(checkboxId);
        targetFrom = 'label';
      }

      // If checkbox clicked directly
      if (c.target.id === 'shippingAsBillingAddress') {
        targetCheckbox = c.target;
        targetFrom = 'checkbox';
      }

      if (!targetCheckbox) return;

      //   c.preventDefault();
      /*
 ::::::::::::::
 get addresses which are set as use address for the current order
 ::::::::::::::
 */
      /*
  *
   ::::::::::::::::::::::::
   checkbox for shipping as billing address
   ::::::::::::::::::::::::
  *
  */
      const checkoutSummaryBillAddress = document.querySelector(
        '#checkoutSummaryCommonBillToAddress',
      );
      const showDefaultBillingAddress = document.querySelector(
        '#defaultBillingAddress',
      );
      const showDefaultBillingAddressButton = document.querySelector(
        '#defaultBillingAddressButton',
      );

      /*
   :::::::::::::::::
   check if  checkbox for shipping as billing address is checked
    ::::::::::::::::::::::::
  */
      // console.log('checbox checked: ', targetCheckbox.checked);

      if (!targetCheckbox.checked && targetFrom === 'label') {
        // showDefaultBillingAddress?.classList.add('hidden');

        if (!basketInvoiceToAddress) showDefaultBillingAddressButton?.classList.remove('hidden');

        if (
          basketInvoiceToAddress?.split(
            ':',
          )[4]
          !== basketShipToAddress?.split(
            ':',
          )[4]
        ) {
          showPreLoader();
          /*
   :::::::::::::::::
   check if  we have use address is set for shipping
    ::::::::::::::::::::::::
  */
          const setAddressDetails = {
            firstName:
              useShipToAddress?.firstName
              ?? '',
            lastName:
              useShipToAddress?.lastName
              ?? '',
            companyName2:
              useShipToAddress
                ?.companyName2 ?? '',
            addressLine1:
              useShipToAddress
                ?.addressLine1 ?? '',
            addressLine2:
              useShipToAddress
                ?.addressLine2 ?? '',
            city:
              useShipToAddress?.city ?? '',
            mainDivision:
              useShipToAddress
                ?.mainDivision ?? '',
            countryCode:
              useShipToAddress
                ?.countryCode ?? '',
            postalCode:
              useShipToAddress
                ?.postalCode ?? '',
            usage: [true, true],
          };
          /*
        ::::::::::::::
        update address to default
        ::::::::::::::
        */
          const updatingToDefault = await updateAddressToDefault(
            setAddressDetails,
          );
          if (updatingToDefault?.status === 'success') {
            /*
             ::::::::::::::
             assign billing address to basket
             ::::::::::::::::
             */
            const setAddressAsShipping = await setUseAddress(
              useShipToAddress?.id,
              'billing',
              'useAddress',
            );
            if (setAddressAsShipping?.status === 'success') {
              const renderDefaultAddress = defaultAddress(
                useShipToAddress,
                'billing',
              );

              const getDefaultAddressWrapper = document.querySelector(
                '#billingAddressHeader',
              );
              if (getDefaultAddressWrapper && renderDefaultAddress) {
                /*
              ::::::::::::::
              show this address as default billing address
              :::::::::::::
              */
                getDefaultAddressWrapper.insertAdjacentElement(
                  'afterend',
                  renderDefaultAddress,
                );
                // hide the billing address from checkout summary

                checkoutSummaryBillAddress?.remove();
              }
            }
          } else if (
            checkoutSummaryBillAddress?.classList.contains('hidden')
          ) {
            checkoutSummaryBillAddress?.classList.remove('hidden');
          }

          /*
          ::::::::::::::
          update shipping methods based on address change
          ::::::::::::::
          */

          await updateShippingMethods();
          /*
          ::::::::::::::
          update basket with the current use address
          ::::::::::::::
          */

          await updateBasketDetails();
          if (targetFrom === 'label') targetCheckbox.checked = true;
          const getShipAsBillBox = document.querySelector('#shippingAsBillingCheckboxWrapper');
          if (getShipAsBillBox) {
            getShipAsBillBox?.classList.add('pointer-events-none');

            const sameShipAsBillCheck = getShipAsBillBox?.querySelector('#sameShipAsBillCheck');
            const shipAsBillLabel = getShipAsBillBox?.querySelector('label');

            getShipAsBillBox?.querySelector('input')?.classList.add('hidden');
            if (sameShipAsBillCheck?.classList.contains('hidden')) {
              sameShipAsBillCheck?.classList.remove('hidden');
            }
            getShipAsBillBox?.querySelector('input')?.classList.add('hidden');
            if (shipAsBillLabel?.classList.contains('pl-6')) {
              shipAsBillLabel?.classList.remove('pl-6');
              shipAsBillLabel?.classList.add('pl-2');
            }
          }
          removePreLoader();
        }
        if (checkoutSummaryBillAddress?.classList.contains('hidden')) {
          checkoutSummaryBillAddress?.classList.remove('hidden');
        }
        if (targetFrom === 'label') targetCheckbox.checked = false;
        targetCheckbox.value = false;
      } else {
        // eslint-disable-next-line max-len
        if ((!basketInvoiceToAddress || (basketInvoiceToAddress === undefined)) && showDefaultBillingAddressButton) {
          setTimeout(() => {
            document.querySelector('#defaultBillingAddressButton')?.classList.add('hidden');
          }, 0);
        }

        /*
             ::::::::::::::
             if shipping as billing address not checked
             ::::::::::::::::
             */
        if (
          showDefaultBillingAddress
          && showDefaultBillingAddress.classList.contains('hidden')
        ) {
          showDefaultBillingAddress.classList.remove('hidden');
        }

        if (
          showDefaultBillingAddressButton
          && showDefaultBillingAddressButton.classList.contains('hidden')
        ) {
          showDefaultBillingAddressButton.classList.remove('hidden');
        }

        if (targetFrom === 'label') targetCheckbox.checked = true;

        targetCheckbox.value = true;
      }
      removePreLoader();
    });

    /*
    :::::::::::::: load shipping address form::::::::::::::
    */
    const shippingForm = await addressForm('shipping', '');

    moduleContent?.append(moduleShippingDetails);

    const getShippingAdressesModuleHeader = moduleContent.querySelector(
      '#shippingAddressHeader',
    );
    /*
    *
    *
     ::::::::::::::::::::
     if the use-shipping-address is not set,
     we will show default address
     else will show add billing address button
     :::::::::::::::::::::::
     *
     *
     */
    if (
      getUseAddressesResponse?.status === 'success'
      && useInvoiceToAddress
    ) {
      const showDefaultShippingAddress = defaultAddress(
        getUseAddressesResponse.data?.commonShipToAddress,
        'shipping',
      );
      if (getShippingAdressesModuleHeader && showDefaultShippingAddress) {
        getShippingAdressesModuleHeader.insertAdjacentElement(
          'afterend',
          showDefaultShippingAddress,
        );
        if (showDefaultShippingAddress.classList.contains('hidden')) {
          showDefaultShippingAddress.classList.remove('hidden');
        }
      }

      const defaultShippingAddressWrapper = document.querySelector(
        '#defaultShippingAddress',
      );
      if (
        defaultShippingAddressWrapper
        && defaultShippingAddressWrapper.classList.contains('hidden')
      ) {
        defaultShippingAddressWrapper.classList.remove('hidden');
      }
    } else {
      const address = getDefaultAddressesResponse.data.filter(
        (adr) => adr.preferredShippingAddress === 'true',
      );

      if (address.length > 0) {
        const showDefaultShippingAddress = defaultAddress(
          address[0],
          'shipping',
        );
        if (getShippingAdressesModuleHeader && showDefaultShippingAddress) {
          getShippingAdressesModuleHeader.insertAdjacentElement(
            'afterend',
            showDefaultShippingAddress,
          );

          // call set use address only if don't have object
          await setUseAddress(address[0].id, 'shipping');

          if (showDefaultShippingAddress.classList.contains('hidden')) {
            showDefaultShippingAddress.classList.remove('hidden');
          }
        }
        const defaultShippingAddressWrapper = document.querySelector(
          '#defaultShippingAddress',
        );
        if (defaultShippingAddressWrapper) {
          if (defaultShippingAddressWrapper.classList.contains('hidden')) {
            defaultShippingAddressWrapper.classList.remove('hidden');
          }
        }
      } else if (getShippingAdressesModuleHeader && shippingForm) {
        getShippingAdressesModuleHeader.insertAdjacentElement(
          'afterend',
          shippingForm,
        );
        shippingForm.classList.remove('hidden');
        if (shippingForm.classList.contains('defaultBillingAddressFormModal')) {
          shippingForm.classList.remove('defaultBillingAddressFormModal');
        }
        shippingForm.classList.add('defaultShippingAddressFormModal');
        if (
          !shippingForm.classList.contains('defaultShippingAddressFormModal')
        ) {
          shippingForm.classList.add('defaultShippingAddressFormModal');
        }

        if (shippingForm) {
          shippingForm.querySelectorAll('.field-wrapper')?.forEach((fw) => {
            fw.classList.add('mt-4');
          });
          shippingForm.querySelectorAll('label')?.forEach((labe) => {
            if (labe?.classList.contains('pl-4')) {
              labe.classList.remove('pl-4');
            }
          });
          if (shippingForm.querySelector('#addressLine1')) {
            initGmapsAutocomplete('shipping', shippingForm.querySelector('#addressLine1'));
          }
          shippingAsBillingAddress?.querySelector('input[name="shippingAsBillingAddress"]')?.setAttribute('checked', true);
        }
      }
      // :::::::::::: remove preloader :::::::::::::
      // removePreLoader();
      // ::::::::::::::close utility modal :::::::::::::::::::
      // closeUtilityModal();
    }

    /*
    *
     ::::::::::::::::::::::::
     add billing / shipping details to shipping module
      ::::::::::::::::::::::::
    */
    moduleContent.append(moduleBillingDetails);
    moduleBillingDetails.append(shippingAsBillingAddress);
    /*
    *
     ::::::::::::::::::::::::
     default billing address section
      ::::::::::::::::::::::::
    *
    */
    const defaultBillingAddressButton = div(
      {
        class: 'flex w-full items-start mt-6 hidden justify-start',
        id: 'defaultBillingAddressButton',
      },
      button(
        {
          class:
            'w-xl text-white text-xl  btn btn-lg font-medium btn-primary-purple rounded-full px-6',
        },
        'Add Billing Address',
      ),
    );

    /*
::::::::::::::::::::::::::::
add click event to default billing address button
 ::::::::::::::::::::::::::::::
    */
    defaultBillingAddressButton?.addEventListener('click', async (event) => {
      event.preventDefault();

      // load modal for billing form modal...
      closeUtilityModal();
      const addressFormModal = await addressForm('billing', '');
      if (addressFormModal) {
        if (
          addressFormModal.classList.contains('defaultShippingAddressFormModal')
        ) {
          addressFormModal.classList.remove('defaultShippingAddressFormModal');
        }
        if (
          !addressFormModal.classList.contains('defaultBillingAddressFormModal')
        ) {
          addressFormModal.classList.add('defaultBillingAddressFormModal');
        }
        createModal(addressFormModal, true, true);
        if (addressFormModal) {
          addressFormModal.querySelectorAll('.field-wrapper')?.forEach((fw) => {
            fw.classList.add('mt-4');
          });
          addressFormModal.querySelectorAll('label')?.forEach((labe) => {
            if (labe?.classList.contains('pl-4')) {
              labe.classList.remove('pl-4');
            }
          });
          if (addressFormModal.querySelector('#addressLine1')) {
            initGmapsAutocomplete('billing', addressFormModal.querySelector('#addressLine1'));
          }
        }
      }
    });

    /*
    *
    *
    *
  ::::::::::::::
  set default billing address
  ::::::::::::::

   :::::::::::::
   check if the use address is set by
   ::::::::::::::::::::::::::
   *
   */
    if (
      getUseAddressesResponse?.status === 'success'
      && getUseAddressesResponse?.data?.invoiceToAddress
    ) {
      /*
       * ::::::::::::::::::::::::::::::
       * call default address function and set the address from useAdress as default address
       * ::::::::::::::::::::::::::
       */
      const defaultBillingAddress = defaultAddress(
        getUseAddressesResponse.data?.invoiceToAddress,
        'billing',
      );

      if (defaultBillingAddress) {
        moduleContent.append(defaultBillingAddress);
        /*
::::::::::::::::::::::::::::
show default billing address else mark shippingAsBilling checkbox as checked
::::::::::::::::::::::::::::
*/

        if (
          basketInvoiceToAddress
          !== basketShipToAddress
        ) {
          defaultBillingAddress.classList.remove('hidden');
          const shippingAsBillingAddressCheckBox = moduleContent.querySelector(
            '#shippingAsBillingAddress',
          );

          if (
            shippingAsBillingAddressCheckBox
            && !getUseAddressesResponse?.data?.commonShipToAddress
          ) {
            // shippingAsBillingAddressCheckBox.parentElement.style.pointerEvents = 'none';
            // shippingAsBillingAddressCheckBox.parentElement.style.opacity = '0.5';
          }
        }

        // defaultBillingAddress.classList.add('hidden');
        const invoiceTo = getCurrentBasketDetails?.data?.data?.invoiceToAddress?.split(':')[4];
        const shipTo = getCurrentBasketDetails?.data?.data?.commonShipToAddress?.split(':')[4];

        if (shippingAsBillingAddressInput) {
          shippingAsBillingAddressInput.checked = invoiceTo === shipTo;
        }
      }
    } else {
      /*
      ::::::::::::::::::::
       if the use billing address is not set,
       we will show default address
       else will show add billing address button
       :::::::::::::::::::::::
      */
      generateDefaultAddress(
        getDefaultAddressesResponse,
        defaultBillingAddressButton,
        moduleContent,
        'billing',
      );
    }
    // :::::::::::: remove preloader :::::::::::::
    // removePreLoader();

    // :::::::::::::: close utility modal ::::::::::::::
    closeUtilityModal();

    return moduleContent;
  } catch (error) {
    // :::::::::::: remove preloader :::::::::::::
    removePreLoader();

    // :::::::::::::: close utility modal ::::::::::::::
    closeUtilityModal();
    if (error.message === 'Unauthorized Access') {
      window.location.href = '/us/en/e-buy/cartlanding';
    }
    if (error.message === 'Invalid Basket') {
      window.location.href = '/us/en/e-buy/cartlanding';
    }
    showNotification(error.message, 'error');
    return false;
  }
};

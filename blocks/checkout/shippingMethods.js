import {
  h2,
  h5,
  div,
  p,
  textarea,
  button,
} from '../../scripts/dom-builder.js';
import {
  getStoreConfigurations,
  removePreLoader,
  showNotification,
  showPreLoader,
} from '../../scripts/common-utils.js';
import { cartItem } from '../cartlanding/cartItem.js';
import {
  getBasketDetails,
  getShippingMethods,
  setShippingMethod,
  updateCheckoutSummary,
  setShippingNotes,
  updateShippingNotes,
} from '../../scripts/cart-checkout-utils.js';
import { updateBasketDetails } from '../cartlanding/cartSharedFile.js';

async function setShippingNotesOnBlur() {
  showPreLoader();
  const getShippingNotesField = document.querySelector('#shippingNotes');

  if (getShippingNotesField) {
    if (getShippingNotesField.value.trim() === '') {
      // removePreLoader();
      // showNotification('Please update Order Note.', 'error');
      // return false;
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
    if (getCurrentBasketDetails?.data?.data?.attributes?.some(
      (attr) => attr?.name === 'GroupShippingNote',
    )
    ) {
      const getNotes = getCurrentBasketDetails.data.data.attributes?.find(
        (attr) => attr?.name === 'GroupShippingNote',
      );

      /*
 :::::::::::::
 check if notes with same value esists
 :::::::::::::
*/

      if (
        (getNotes.name === 'GroupShippingNote')
        && (getNotes?.value?.trim() === getShippingNotesField?.value?.trim()) && (getShippingNotesField?.value?.trim() !== '')
      ) {
        removePreLoader();
        return false;
      }
      showPreLoader();
      /*
:::::::::::::
if basket has the shipping notes attribute and has value. Update the shipping notes
:::::::::::::
*/
      const shippingNotesPayload = {
        name: 'GroupShippingNote',
        value: getShippingNotesField.value,
        type: 'String',
      };
      const updateShippingNotesResponse = await updateShippingNotes(
        shippingNotesPayload,
      );
      if (updateShippingNotesResponse?.status === 'error') {
        removePreLoader();
        showNotification('Error updating order note.', 'error');
        return false;
      }
      if (updateShippingNotesResponse?.status === 'success') {
        showNotification('Order note updated successfully.', 'success');
        await updateBasketDetails();
        removePreLoader();
        return true;
      }
    } else {
      /*
 :::::::::::::
 if basket has the shipping notes attribute and doesn't has value. Add the shipping notes
 :::::::::::::
*/
      // eslint-disable-next-line no-lonely-if
      if (getShippingNotesField?.value?.trim() !== '') {
        const shippingNotesPayload = {
          name: 'GroupShippingNote',
          value: getShippingNotesField.value,
          type: 'String',
        };
        const setShippingNotesResponse = await setShippingNotes(
          shippingNotesPayload,
        );
        if (setShippingNotesResponse.status === 'error') {
          removePreLoader();
          showNotification('Error adding Order Note', 'error');
          return false;
        }
        if (setShippingNotesResponse.status === 'success') {
          showNotification('Order note added successfully.', 'success');
          await updateBasketDetails();
          removePreLoader();
        }
      }
    }
    return {};
  }
  return {};
}

/*
 :::::::::::::::
 generates the shipping address module for the checkout module/page
 ::::::::::::::
 */
const shippingMethodsModule = async () => {
  if (!window.location.pathname.includes('shipping')) return false;
  const storeConfigurations = await getStoreConfigurations();
  /*
  ::::::::::::::
  get price type if its net or gross.
  ::::::::::::::
  */
  let checkoutPriceType = 'net';
  if (storeConfigurations.pricing?.priceType) {
    checkoutPriceType = storeConfigurations.pricing.priceType;
  }
  const currencyCode = '$';
  try {
    const moduleContent = div({});
    const moduleHeader = div(
      {
        class:
          'relative flex flex-col mb-6',
      },
      h2({
        class: 'text-black text-left text-4xl font-normal leading-12 p-0 m-0  pb-6',
      }, 'Confirm your shipping method(s)'),
      p(
        {},
        'Your choice, your speed. Select your preferred shipping method. Have a special note thats okay add that to the notes field and we will do our best to facilitate.',
      ),
    );

    const moduleToggleButtonsWrapper = div(
      {
        class: 'flex justify-between mt-12 hidden',
      },
      div(
        {
          class: 'flex gap-6 flex-col',
        },
        div(
          {
            class: 'flex gap-6',
          },
          button(
            {
              class:
                'w-lg text-white text-l text-uppercase hidden btn btn-lg font-medium btn-primary-purple rounded-full px-6 m-0',
            },
            'Ship for me',
          ),
          button(
            {
              class:
                'm-0 text-xl hover:bg-danaherpurple-500 hidden  border-danaherblue-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6',
            },
            'Use my carrier',
          ),
        ),
        p(
          {
            class: 'w-full',
          },
          'Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business.',
        ),
      ),
    );
    /*
  ::::::::::::::
  get current basket/cart details.
  ::::::::::::::
  */
    const getCurrentBasketDetails = await getBasketDetails();
    let basketShippingNotes = '';
    /*
  ::::::::::::::
  check if the shipping notes exists
  ::::::::::::::
  */
    if (
      getCurrentBasketDetails?.status === 'success'
      && getCurrentBasketDetails?.data?.data?.attributes
    ) {
      const getNotes = getCurrentBasketDetails.data.data.attributes[0];

      if (getNotes.name === 'GroupShippingNote') {
        basketShippingNotes = getNotes.value;
      }
    }
    const modulesMethodsWrapper = div(
      { class: 'flex-col gap-4 w-full' },
      div({
        id: 'modulesMethodsItemsWrapper',
        class: 'flex flex-wrap gap-4 my-6',
      }),
      div(
        {
          class: 'my-6 flex flex-col gap-4',
        },
        p(
          {
            class: 'text-extralight',
          },
          'Notes',
        ),
        textarea(
          {
            id: 'shippingNotes',
            name: 'notes',
            autocomplete: 'off',
            'data-required': false,
            rows: '3',
            cols: '50',
            class:
              'input-focus outline-none text-base w-full block px-2 rounded py-4  border border-solid border-gray-400',
            'aria-label': 'notes',
            label: 'Notes',
            placeholder: 'Add a note',
            value: basketShippingNotes || '',
          },
          basketShippingNotes || '',
        ),
      ),
    );

    const getShippingNotesField = modulesMethodsWrapper?.querySelector('#shippingNotes');
    getShippingNotesField?.addEventListener('blur', setShippingNotesOnBlur);
    if (moduleContent) {
      if (moduleHeader) moduleContent.append(moduleHeader);
      const showCartItems = await cartItem();
      if (showCartItems) {
        showCartItems.querySelectorAll('button')?.forEach((btn) => {
          btn.remove();
        });
        showCartItems.querySelectorAll('input')?.forEach((inp) => {
          inp.removeAttribute('type');
          if (inp.classList.contains('border-solid')) {
            inp.classList.remove('border-solid');
          }
          inp.classList.add('focus:outline-none');
          inp.classList.add('outline-none');
          if (inp.classList.contains('border-2')) {
            inp.classList.remove('border-2');
          }
        });
        moduleContent.append(showCartItems);
      }
      // if (moduleOpcos) moduleContent.append(moduleOpcos);
      if (moduleToggleButtonsWrapper) moduleContent.append(moduleToggleButtonsWrapper);

      /*
       ::::::::::::::
       get shipping bucket/methods with  id
       ::::::::::::::
       */
      const shippingMethods = await getShippingMethods();
      if (shippingMethods?.data.length > 0) {
        const modulesMethodsItemsWrapper = modulesMethodsWrapper.querySelector(
          '#modulesMethodsItemsWrapper',
        );

        if (modulesMethodsWrapper) {
          let highlightDefaultShippingMethod = '';
          let checkDefaultShippingMethod = '';

          if (getCurrentBasketDetails?.data?.data?.commonShippingMethod) {
            highlightDefaultShippingMethod = 'border-danaherpurple-500';
            checkDefaultShippingMethod = getCurrentBasketDetails?.data?.data?.commonShippingMethod;
          }
          if (getCurrentBasketDetails?.status === 'success') {
            const defaultShippingMethodIcon = '<svg class="absolute right-2 bottom-2" width="29" height="32" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.1543 16L13.1543 18L17.1543 14M23.1543 16C23.1543 20.9706 19.1249 25 14.1543 25C9.18373 25 5.1543 20.9706 5.1543 16C5.1543 11.0294 9.18373 7 14.1543 7C19.1249 7 23.1543 11.0294 23.1543 16Z" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            /*
             ::::::::::::::::::
             generates shipping methods cards
             ::::::::::::::::::::::::::::::::::::::::
             */
            shippingMethods?.data.forEach((method) => {
              const methodData = div(
                {
                  id: method.id,
                  class: `flex relative flex-col w-full shippingMethod gap-2 hover:border-danaherpurple-500  cursor-pointer max-w-xs border-solid border-2  p-4 ${method.id === checkDefaultShippingMethod
                    ? highlightDefaultShippingMethod
                    : 'border-gray-400'
                  }`,
                },
                p(
                  {
                    class: 'font-semibold text-sm',
                  },
                  method.name || '',
                ),
                p(
                  {
                    class: 'text-extralight text-sm',
                  },
                  method.description || '',
                ),
                p(
                  {
                    class: 'text-extralight text-sm',
                  },
                  `${currencyCode}${method.shippingCosts[
                    checkoutPriceType === 'net' ? 'net' : 'gross'
                  ].value
                  }` || '',
                ),
              );
              if (methodData) {
                if (defaultShippingMethodIcon) {
                  if (method.id === checkDefaultShippingMethod) {
                    methodData.insertAdjacentHTML(
                      'beforeend',
                      defaultShippingMethodIcon,
                    );
                  }
                }
                modulesMethodsItemsWrapper?.append(methodData);
              }
            });
            if (modulesMethodsWrapper) {
              /*
               ::::::::::::::::::
               attach event listener
               to set methods as
               default shipping method
               ::::::::::::::::::::::::::::::::::::::::
               */
              modulesMethodsWrapper.addEventListener('click', async (event) => {
                event.preventDefault();
                const selectedMethod = event.target.parentElement;
                if (selectedMethod?.classList.contains('shippingMethod')) {
                  if (selectedMethod?.id) {
                    showPreLoader();
                    const setShippingMethodResponse = await setShippingMethod(
                      selectedMethod?.id,
                    );
                    if (setShippingMethodResponse) {
                      let highlightShippingMethod = false;
                      if (setShippingMethodResponse.status !== 'error') {
                        /*
                           ::::::::::::::::::::::
                           update basket with selected shipping method
                           :::::::::::::::::::::::::::::::
                           */
                        await updateBasketDetails();
                        const getAllShippingMethods = modulesMethodsWrapper.querySelectorAll(
                          '.shippingMethod',
                        );
                        if (getAllShippingMethods) {
                          getAllShippingMethods.forEach((method) => {
                            if (
                              method.classList.contains(
                                'border-danaherpurple-500',
                              )
                            ) {
                              method.classList.remove(
                                'border-danaherpurple-500',
                              );
                            }
                            if (method.querySelector('svg')) {
                              method.querySelector('svg').remove();
                            }
                          });
                        }
                        /*
                            ::::::::::::::
                            highlight selected shipping method
                            ::::::::::::::
                            */
                        highlightShippingMethod = modulesMethodsWrapper.querySelector(
                          `#${selectedMethod?.id}`,
                        );

                        if (highlightShippingMethod) {
                          await updateCheckoutSummary();
                          highlightShippingMethod.classList.add(
                            'border-danaherpurple-500',
                          );
                          if (defaultShippingMethodIcon) {
                            highlightShippingMethod.insertAdjacentHTML(
                              'beforeend',
                              defaultShippingMethodIcon,
                            );
                          }
                          removePreLoader();
                        }
                      } else {
                        removePreLoader();
                      }
                    }
                  }
                }
              });
            }
          }
        }
      }
      if (modulesMethodsWrapper) moduleContent.append(modulesMethodsWrapper);
    }

    return moduleContent;
  } catch (error) {
    return div(
      h5({ class: 'text-red' }, 'Error Loading Shipping Address Module.'),
    );
  }
};

export default shippingMethodsModule;

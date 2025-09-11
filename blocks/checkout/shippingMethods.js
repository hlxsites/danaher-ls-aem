import {
  h2,
  div,
  p,
  textarea,
  button,
  span,
} from '../../scripts/dom-builder.js';
// eslint-disable-next-line import/no-cycle
import {
  getStoreConfigurations,
  removePreLoader,
  scrollViewToTop,
  showNotification,
  showPreLoader,
} from '../../scripts/common-utils.js';
// eslint-disable-next-line import/no-cycle
import { cartItem } from '../cartlanding/cartItem.js';
import {
  getBasketDetails,
  getShippingMethods,
  setShippingMethod,
  updateCheckoutSummary,
  setShippingNotes,
  updateShippingNotes,
  validateBasket,
  silentNavigation,
} from '../../scripts/cart-checkout-utils.js';
import { updateBasketDetails } from '../cartlanding/cartSharedFile.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

async function setShippingNotesOnBlur() {
  showPreLoader();
  const getShippingNotesField = document.querySelector('#shippingNotes');

  if (getShippingNotesField) {
    /*

 get current basket details

*/
    const getCurrentBasketDetails = await getBasketDetails();

    /*

 check if basket has the shipping notes attribute

*/
    if (getCurrentBasketDetails?.data?.data?.attributes?.some(
      (attr) => attr?.name === 'GroupShippingNote',
    )
    ) {
      const getNotes = getCurrentBasketDetails.data.data.attributes?.find(
        (attr) => attr?.name === 'GroupShippingNote',
      );

      /*

 check if notes with same value esists

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

if basket has the shipping notes attribute and has value. Update the shipping notes

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
        await updateBasketDetails();
        removePreLoader();
        showNotification('Order note updated successfully.', 'success');
        return true;
      }
    } else {
      /*

 if basket has the shipping notes attribute and doesn't has value. Add the shipping notes

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
          await updateBasketDetails();
          removePreLoader();
          showNotification('Order note added successfully.', 'success');
        }
      }
    }
    return {};
  }
  return {};
}

/*

 generates the shipping address module for the checkout module/page

 */
const shippingMethodsModule = async () => {
  if (!window.location.pathname.includes('shipping')) return false;

  const validateData = {
    adjustmentsAllowed: true,
    scopes: [
      'InvoiceAddress',
      'ShippingAddress',
      'Addresses',
      'Shipping',
    ],
  };
  const validatingBasket = await validateBasket(validateData);
  try {
    if (validatingBasket?.status === 'error') throw new Error('Invalid Basket');
    const storeConfigurations = await getStoreConfigurations();
    /*

    get price type if its net or gross.

    */
    let checkoutPriceType = 'net';
    if (storeConfigurations.pricing?.priceType) {
      checkoutPriceType = storeConfigurations.pricing.priceType;
    }
    const currencyCode = '$';
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

  get current basket/cart details.

  */
    const getCurrentBasketDetails = await getBasketDetails();
    let basketShippingNotes = '';
    /*

  check if the shipping notes exists

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
      // if (moduleOpcos) moduleContent.append(moduleOpcos);
      if (moduleToggleButtonsWrapper) moduleContent.append(moduleToggleButtonsWrapper);

      /*

       get shipping bucket/methods with  id

       */
      const shippingMethods = await getShippingMethods();
      if (shippingMethods?.data?.length > 0 && shippingMethods?.status === 'success') {
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
            const defaultShippingMethodIcon = div(
              {
                class: 'absolute right-2 bottom-2',
              },
              span(
                {
                  class: 'icon icon-check-circle [&_svg>use]:stroke-danaherpurple-500 ',
                },
              ),
            );
            decorateIcons(defaultShippingMethodIcon);
            /*
             :::
             generates shipping methods cards
             ::::::::::
             */
            shippingMethods?.data?.forEach((method) => {
              const methodData = div(
                {
                  id: method.id,
                  class: `flex relative flex-col w-full shippingMethod gap-2 hover:border-danaherpurple-500  cursor-pointer max-w-xs border-solid border-2  p-4 ${method.id === checkDefaultShippingMethod
                    ? highlightDefaultShippingMethod
                    : 'border-solid'
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
                    methodData.insertAdjacentElement(
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
               :::
               attach event listener
               to set methods as
               default shipping method
               ::::::::::
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
                           :::::::
                           update basket with selected shipping method
                           :
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

                            highlight selected shipping method

                            */
                        highlightShippingMethod = modulesMethodsWrapper.querySelector(
                          `#${selectedMethod?.id}`,
                        );

                        if (highlightShippingMethod) {
                          await updateCheckoutSummary();
                          if (highlightShippingMethod?.classList?.contains('border-gray-400')) {
                            highlightShippingMethod?.classList?.remove('border-gray-400');
                          }
                          highlightShippingMethod.classList.add(
                            'border-danaherpurple-500',
                          );
                          decorateIcons(defaultShippingMethodIcon);
                          if (defaultShippingMethodIcon) {
                            highlightShippingMethod.insertAdjacentElement(
                              'beforeend',
                              defaultShippingMethodIcon,
                            );
                          }
                          showNotification('Shipping method updated successfully.', 'success');
                          removePreLoader();
                        }
                      } else {
                        removePreLoader();
                        showNotification('Error updating shipping method.', 'error');
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
    }

    return moduleContent;
  } catch (error) {
    scrollViewToTop();
    showNotification(error.message, 'error');
    if (error.message === 'Invalid Basket') {
      silentNavigation(window.EbuyConfig?.addressPageUrl);
    }
    return false;
  }
};

export default shippingMethodsModule;

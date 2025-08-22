import {
  buildInputElement, removePreLoader, showPreLoader,
  buildSearchWithIcon,
  showNotification,
} from '../../scripts/common-utils.js';
import {
  h2, h5, h4, div, p, span, button, input, label,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getPaymentMethods } from '../../scripts/cart-checkout-utils.js';
import {
  loadStripe, getPaymentIntent, postPaymentIntent, getSavedCards,
  setGetCardAsDefault,
  setUseCard,
} from '../../scripts/stripe_utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';

function createCardItem(item, defaultCard) {
  const useCard = sessionStorage.getItem('useStripeCardId');
  const itemObject = {
    expiryMonth: String(item?.card?.exp_month).padStart(2, '0'),
    expiryYear: item?.card?.exp_year,
    lastFourDigits: item?.card?.last4,
    brand: item?.card?.brand,
    itemId: item?.id,
  };
  let defaultPaymentCheckbox = '';
  let defaultPaymentCheckboxText = '';
  defaultPaymentCheckbox = input(
    {
      type: 'checkbox',
      name: 'defaultStripeCard',
      class: 'input-focus-checkbox',
      id: `c_${itemObject.itemId}`,
      value: itemObject.itemId,
      'data-required': false,
      'aria-label': 'Default Payment',
    },
  );

  defaultPaymentCheckboxText = 'Make this my default payment';

  if (defaultCard === itemObject.itemId) {
    defaultPaymentCheckbox.checked = true;
    sessionStorage.setItem('useStripeCardId', itemObject.itemId);
    sessionStorage.setItem('selectedStripeMethod', 'savedCard');
    defaultPaymentCheckboxText = 'Default Payment';
  }

  const itemCard = div(
    {
      class: `bg-checkout payment-card-wrapper border p-6 flex flex-col gap-6 ${useCard === itemObject.itemId ? 'border-danaherpurple-500' : ''}`,
      id: `card${item.id}`,
    },
    div(
      {
        class: 'payment-card-details bg-white items-center flex justify-between w-full p-6 gap-6',
      },
      div(
        {
          class: 'flex gap-6 items-center',
        },
        div(
          {
            class: 'payment-card-icon flex items-center w-16',
          },
          span({
            class: `icon flex-none icon-${itemObject.brand} 16 h-12 w-full`,
          }),
        ),
        div(
          {
            class: 'payment-card-description flex flex-col',
          },
          h4(
            {
              class: 'font-medium text-xl m-0 p-0 leading-7 text-black',
            },
            `Card ending in ${itemObject.lastFourDigits}`,
          ),
          p(
            {
              class: 'font-normal text-base',
            },
            `Expires ${itemObject.expiryMonth}/${itemObject.expiryYear}`,
          ),
        ),
      ),
      button(
        {
          class: 'stripe-card-use-button cursor-pointer text-xl  border-danaherpurple-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6 m-0 hover:bg-danaherpurple-500',
          id: itemObject?.itemId,
        },
        useCard === itemObject.itemId ? 'Selected Card' : 'Use Card',
      ),
    ),
    div(
      {
        class: 'flex gap-3',
      },
      defaultPaymentCheckbox,
      label(
        {
          for: `c_${itemObject.itemId}`,
          class: 'text-base font-normal',
        },
        defaultPaymentCheckboxText,
      ),
    ),
  );
  return itemCard;
}

/*
 :::::::::::::::
 generates the payment module for the checkout module/page
 ::::::::::::::
 */
const paymentModule = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized.' };
  }
  /*
  ::::::::::::::
  get price type if its net or gross.
  ::::::::::::::
  */
  try {
    const moduleContent = div({});
    const moduleHeader = div(
      {
        class: 'relative flex flex-col mb-6',
      },
      h2(
        {
          class:
            'text-black text-left text-4xl font-normal leading-12 p-0 m-0 pb-6',
        },
        'Choose your payment method',
      ),
      p(
        {},
        'Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business.',
      ),
    );
    const paymentMethodsWrapper = div({
      id: 'paymentMethodsWrapper',
      class: 'flex flex-col w-full hidden',
    });
    let stripeCardsWrapper = div({ class: 'hidden' });
    let invoiceWrapper = div({ class: 'hidden' });

    // get available payment methods
    const allPaymentMethods = await getPaymentMethods();

    // get saved stripe cards
    const getSavedStripeCardsList = await getSavedCards();

    const savedStripeCardsHeader = div(
      {
        class: `flex ${(getSavedStripeCardsList?.status === 'success' && getSavedStripeCardsList?.data?.data.length > 0) ? '' : 'hidden'} justify-between items-center w-full bg-white`,
        id: 'savedStripeCardsHeader',
      },
      buildSearchWithIcon(
        'search',
        'search',
        'text',
        'search',
        false,
        false,
        'search',
        'Search Card',
      ),
      div(
        {
          class: 'flex justify-between gap-2',
          id: 'addNewCard',
        },
        // span({
        //   class: 'icon icon-plus-circle',
        //   id: 'plusCircleIcon',
        // }),
        button(
          {
            class: 'flex w-full text-white text-xl  btn btn-lg font-medium btn-primary-purple rounded-full px-6',
            id: 'addNewStripeCard',
          },
          'Add New Card',
        ),
      ),
    );
    const savedStripeCardsList = div(
      {
        class: 'w-full gap-6 flex flex-col max-h-[645px] pr-2 overflow-auto flex flex-col gap-6 pt-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500',
        id: 'savedStripeCardsList',
      },
    );
    // check if has saved cards and render list
    const checkSavedStripeCards = getSavedStripeCardsList?.data?.data;
    const getDefaultCard = await setGetCardAsDefault();
    let defaultCard = '';
    if (getDefaultCard?.status === 'success') {
      defaultCard = getDefaultCard?.data?.invoice_settings?.default_payment_method?.id;
    }
    if (checkSavedStripeCards?.length > 0) {
      checkSavedStripeCards?.forEach((item) => {
        savedStripeCardsList?.append(createCardItem(item, defaultCard));
      });
    }

    const invoiceNumber = buildInputElement(
      'invoiceNumber',
      'Invoice Number',
      'text',
      'invoiceNumber',
      false,
      false,
      'invoiceNumber',
      '',
    );
    invoiceNumber.className = '';
    invoiceNumber.classList.add('w-full');
    invoiceNumber?.querySelector('input')?.classList?.add('outline-none');
    invoiceNumber?.querySelector('label')?.classList?.remove('font-semibold');
    invoiceNumber?.querySelector('label')?.classList?.add('font-normal');

    const stripeCardsContainer = div(
      {
        id: 'stripeCardsContainer',
        class: 'flex-col flex w-full items-start hidden',
      },
    );
    const savedStripeCardsWrapper = div(
      {
        class: 'saved-cards-wrapper w-full flex flex-col gap-6',
      },
    );

    const newStripeCardsWrapper = div(
      {
        class: `no-cards-wrapper ${(getSavedStripeCardsList?.status === 'success' && getSavedStripeCardsList?.data?.data.length > 0) ? 'hidden' : ''}  flex-1 flex-col flex p-6  gap-6 w-full items-start bg-checkout`,
        id: 'newStripeCardsWrapper',
      },
      div(
        {
          class: 'flex flex-col w-full gap-2 items-start',
        },
        buildInputElement(
          'sameAsShipping',
          'Same as shipping Address',
          'radio',
          'stripeAddress',
          true,
          false,
          'mt-6 checked:bg-danaherpurple-500',
          'sameAsShipping',
        ),
        buildInputElement(
          'sameAsBilling',
          'Same as bill to Address',
          'radio',
          'stripeAddress',
          true,
          false,
          'mt-6 checked:bg-danaherpurple-500',
          'sameAsBilling',
        ),
        buildInputElement(
          'newAddress',
          'New Address',
          'radio',
          'stripeAddress',
          true,
          false,
          'mt-6 checked:bg-danaherpurple-500',
          'newAddress',
        ),
      ),
    );

    const newStripeCardPaymentWrapper = div(
      {
        id: 'newStripeCardPaymentWrapper',
        class: 'bg-white w-full p-6',
      },
    );
    const newStripeCardAddressWrapper = div(
      {
        id: 'newStripeCardAddressWrapper',
        class: 'bg-white w-full p-6',
      },
    );

    newStripeCardsWrapper?.querySelectorAll('label')?.forEach((item) => {
      item?.classList?.remove('font-semibold');
      item?.classList?.remove?.classList?.add('font-normal');
    });

    newStripeCardPaymentWrapper.querySelectorAll('.field-wrapper')?.forEach((fld) => {
      fld.className = '';
      const inputField = fld?.querySelector('input');
      const inputLabel = fld?.querySelector('label');
      if (inputField.id !== 'expirationDate' && inputField.id !== 'cardCvc') {
        fld.classList.add('w-full');
      }
      if (inputField.id === 'expirationDate') {
        fld.classList.add('w-[70%]');
      }
      if (inputField.id === 'cardCvc') {
        fld.classList.add('w-[30%]');
      }
      inputField?.classList?.add('outline-none');
      inputLabel?.classList?.remove('font-semibold');
      inputLabel?.classList?.add('font-normal');
    });
    // adding new card form
    newStripeCardsWrapper.append(newStripeCardAddressWrapper);
    newStripeCardsWrapper.append(newStripeCardPaymentWrapper);

    if (getSavedStripeCardsList?.data?.data?.length > 0) {
      newStripeCardsWrapper.append(button({ class: 'w-full m-0 stripe-card-use-button text-xl border-danaherpurple-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6 hover:bg-danaherpurple-500 max-w-xs', id: 'showStripePaymentList' }, 'Back'));
    }
    stripeCardsContainer.append(newStripeCardsWrapper);

    // adding saved cards header and list
    savedStripeCardsWrapper.append(savedStripeCardsHeader);
    // add saved stripe cards list

    savedStripeCardsWrapper.append(savedStripeCardsList);
    stripeCardsContainer.append(savedStripeCardsWrapper);

    allPaymentMethods?.data?.forEach(async (pm, ind) => {
      if (pm?.id === 'STRIPE_PAYMENT') {
        stripeCardsWrapper.innerHTML = '';
        stripeCardsWrapper = div(
          {
            id: `paymentMethod${pm?.displayName}`,
            class:
              `border-solid border-gray-300 flex flex-col gap-3 items-start p-4 border-2  items-start  ${ind > 0 ? 'border-t-0 ' : ''}`,
          },
          div(
            {
              class: 'flex justify-between w-full',
            },
            div(
              {
                class: 'border-solid border-gray-300 flex gap-2 flex-none items-center',
              },
              buildInputElement(
                'stripe',
                'Credit Card',
                'radio',
                'paymentMethod',
                true,
                false,
                'mt-6',
                'stripe',
              ),
            ),
            span({
              class: 'icon flex-none icon-payment-cards h-9 w-40',
            }),
          ),
        );

        stripeCardsWrapper.append(stripeCardsContainer);
        paymentMethodsWrapper?.append(stripeCardsWrapper);

        const stripe = await loadStripe();

        const getPI = await getPaymentIntent();
        if (getPI?.status === 'success') {
          const postPI = await postPaymentIntent();
          if (postPI?.status === 'success') {
            const postPIData = postPI?.data || '';
            const clientSecret = postPIData?.client_secret || '';
            if (clientSecret) {
              const appearance = {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#7523FF',
                  colorBackground: '#ffffff',
                  colorText: '#4b5563',
                  colorDanger: '#df1b41',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  spacingUnit: '4px',
                  borderRadius: '4px',
                },
                rules: {
                  '.AccordionItem': {
                    border: 'none',
                    boxShadow: 'none',
                    paddingLeft: '0',
                    paddingRight: '0',
                  },
                },
              };
              const addressOptions = {
                mode: 'billing', display: {}, blockPoBox: true, fields: { phone: 'always' },
              };
              const options = {
                setup_future_usage: 'off_session',
                layout: {
                  type: 'tabs',
                  defaultCollapsed: false,
                  radios: true,
                  spacedAccordionItems: true,
                },
                fields: {
                  cardDetails: {
                    cardHolderName: 'auto',
                  },
                  billingDetails: {
                    address: 'never',
                  },
                },
              };
              if (newStripeCardPaymentWrapper && newStripeCardAddressWrapper) {
                const stripeElements = stripe.elements({ clientSecret, appearance, disallowedCardBrands: ['discover_global_network'] });

                // mount address elements
                const addressElements = stripeElements.create('address', addressOptions);
                addressElements.mount('#newStripeCardAddressWrapper');

                // mount payment elements
                const paymentElements = stripeElements.create('payment', options);
                paymentElements.mount('#newStripeCardPaymentWrapper');
              }
            }
          }
        }
      }
      if (pm?.id === 'Invoice') {
        const invoiceNumberWrapper = div(
          {
            id: 'invoiceNumberWrapper',
            class: 'flex-col flex p-6 w-full items-start bg-checkout hidden',
          },
        );
        invoiceNumberWrapper.append(invoiceNumber);
        invoiceWrapper.innerHTML = '';
        invoiceWrapper = div(
          {
            id: `paymentMethod${pm?.displayName}`,
            class:
              `border-solid border-gray-300 flex flex-col gap-6 items-start p-4 border-2 ${ind > 0 ? 'border-t-0 ' : ''} items-start`,
          },
          buildInputElement(
            'invoice',
            'Invoice',
            'radio',
            'paymentMethod',
            false,
            false,
            'mt-6',
            'invoice',
          ),
        );
        invoiceWrapper.append(invoiceNumberWrapper);
        paymentMethodsWrapper?.append(invoiceWrapper);
      }
    });
    if (allPaymentMethods?.data?.length > 0) {
      if (paymentMethodsWrapper?.classList.contains('hidden')) {
        paymentMethodsWrapper.classList.remove('hidden');
      }
      paymentMethodsWrapper
        ?.querySelectorAll('.field-wrapper')
        ?.forEach((inp) => {
          const inputElement = inp?.querySelector('input');
          if (inputElement) {
            inputElement.className = '';
            inputElement.classList.add('!mt-0', 'absolute', 'left-0');
          }
          inp?.classList.add(
            'flex',
            'flex-row-reverse',
            'items-center',
            'gap-2',
          );
          const inpuLabel = inp?.querySelector('label');
          if (inpuLabel?.classList.contains('font-normal')) {
            inpuLabel?.classList.remove('font-normal');
          }
          if (inpuLabel?.classList.contains('text-sm')) {
            inpuLabel?.classList.remove('text-sm');
          }
          inpuLabel?.classList.add('text-base', 'font-semibold', 'ml-[-30px]', 'pl-10', 'z-10', 'relative');
        });
      decorateIcons(stripeCardsWrapper);

      paymentMethodsWrapper?.addEventListener('click', (c) => {
        let targetRadio;
        let targetRadioId;
        let targetFrom;

        const eventTarget = c.target;
        // If label clicked, find associated radio
        if (eventTarget.matches('label')) {
          const radioId = eventTarget.getAttribute('for');
          targetRadio = document.getElementById(radioId);
          targetRadioId = radioId;
          targetFrom = 'label';
        }
        // If radio clicked directly
        if (eventTarget.matches('input[type="radio"]')) {
          targetRadio = eventTarget;
          targetFrom = 'radio';
          targetRadioId = eventTarget.id;
        }
        // check if radio input available
        if (!targetRadio) return;
        const getInvoiceNumberWrapper = paymentMethodsWrapper.querySelector('#invoiceNumberWrapper');
        const getStripeCardsWrapper = paymentMethodsWrapper.querySelector('#stripeCardsContainer');

        // this is for selecting invoice payment method
        if (targetRadioId === 'invoice') {
          getInvoiceNumberWrapper?.classList?.remove('hidden');
          getStripeCardsWrapper?.classList?.add('hidden');
          if (targetFrom === 'label') targetRadio.checked = true;
        }
        // this is for selecting stripe payment method
        if (targetRadioId === 'stripe') {
          getStripeCardsWrapper?.classList?.remove('hidden');
          getInvoiceNumberWrapper?.classList?.add('hidden');
          if (targetFrom === 'label') targetRadio.checked = true;
        }
        if (targetRadioId === 'sameAsShipping') {
          if (targetFrom === 'label') targetRadio.checked = true;
          newStripeCardAddressWrapper?.classList.add('hidden');
        }
        if (targetRadioId === 'sameAsBilling') {
          if (targetFrom === 'label') targetRadio.checked = true;
          newStripeCardAddressWrapper?.classList.add('hidden');
        }
        if (targetRadioId === 'newAddress') {
          if (targetFrom === 'label') targetRadio.checked = true;
          if (newStripeCardAddressWrapper?.classList.contains('hidden')) {
            newStripeCardAddressWrapper?.classList.remove('hidden');
          }
        }
      });
    }
    const savedCardsSearchWrapper = paymentMethodsWrapper?.querySelector('#searchWithIcon');
    if (savedCardsSearchWrapper) {
      savedCardsSearchWrapper.classList.add('max-w-xs', 'w-full');
      savedCardsSearchWrapper?.querySelector('.search-with-icon')?.classList.add('w-full');
    }
    const savedCardsSearch = paymentMethodsWrapper?.querySelector('#search');
    if (savedCardsSearch) {
      savedCardsSearch.className = 'h-10 pl-9 input-focus text-base w-full block px-2 py-4 text-gray-600  border border-solid border-gray-600 outline-none';
    }

    // show new cards wrapper when clicked add new card
    savedStripeCardsHeader?.querySelector('#addNewStripeCard')?.addEventListener('click', () => {
      sessionStorage.setItem('selectedStripeMethod', 'newCard');
      const savedCardsHeader = document.querySelector('#savedStripeCardsHeader');
      const savedCardList = document.querySelector('#savedStripeCardsList');
      const getStripeCardsWrapper = document.querySelector('#newStripeCardsWrapper');
      savedCardsHeader.classList.add('hidden');
      savedCardList.classList.add('hidden');
      if (getStripeCardsWrapper?.classList.contains('hidden')) {
        getStripeCardsWrapper.classList.remove('hidden');
      }
    });
    // show payment methods list
    newStripeCardsWrapper?.querySelector('#showStripePaymentList')?.addEventListener('click', () => {
      sessionStorage.setItem('selectedStripeMethod', 'savedCard');
      const savedCardsHeader = document.querySelector('#savedStripeCardsHeader');
      const savedCardList = document.querySelector('#savedStripeCardsList');
      const getStripeCardsWrapper = document.querySelector('#newStripeCardsWrapper');
      getStripeCardsWrapper.classList.add('hidden');
      if (savedCardsHeader?.classList.contains('hidden')) {
        savedCardsHeader.classList.remove('hidden');
      }
      if (savedCardList?.classList.contains('hidden')) {
        savedCardList.classList.remove('hidden');
      }
    });
    /*
    ::::::::::::::
    search functionality for search for cards list
    ::::::::::::::
    */
    const cardsListSearchInput = savedStripeCardsHeader.querySelector(
      '#searchWithIcon input',
    );
    if (cardsListSearchInput) {
      cardsListSearchInput.addEventListener('input', (e) => {
        e.preventDefault();
        if (checkSavedStripeCards?.length > 0) {
          const searchTerm = e.target.value.toLowerCase();
          const searchedCards = checkSavedStripeCards?.filter((cd) => {
            const cardNumber = String(cd?.card?.last4 || '');
            const expiryMonth = String(cd?.card?.exp_month).padStart(2, '0');
            const expiryYear = String(cd?.card?.exp_year || '');
            return (
              cardNumber.includes(searchTerm)
              || expiryMonth.includes(searchTerm)
              || expiryYear.includes(searchTerm)
            );
          });
          savedStripeCardsList.innerHTML = '';
          searchedCards?.forEach((item) => {
            savedStripeCardsList?.append(createCardItem(item));
          });
          decorateIcons(savedStripeCardsList);
        }
      });
    }

    // set default payment
    savedStripeCardsList?.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const allPaymentCards = savedStripeCardsList.querySelectorAll('.payment-card-wrapper');
        const currentTarget = e.target;

        if (currentTarget?.classList.contains('stripe-card-use-button')) {
          showPreLoader();
          const pMId = currentTarget.id;
          if (pMId) {
            const settingUseCard = await setUseCard(pMId);
            if (settingUseCard?.status !== 'success') throw new Error('Error processing request');

            allPaymentCards.forEach((method) => {
              if (method?.classList.contains('border-danaherpurple-500')) {
                method.classList.remove('border-danaherpurple-500');
              }
              const methodUseButton = method.querySelector('button');
              if (methodUseButton) {
                methodUseButton.textContent = 'Use Card';
              }
            });
            savedStripeCardsList?.querySelector(`#card${pMId}`)?.classList.add('border-danaherpurple-500');
            currentTarget.textContent = 'Selected Card';
            removePreLoader();
            showNotification('Setup to use for current order.', 'success');
          }
        }
        let targetCheckbox;
        let checkboxId;

        // If label clicked, find associated checkbox
        if (currentTarget.tagName === 'LABEL') {
          checkboxId = currentTarget.getAttribute('for');
          targetCheckbox = document.getElementById(checkboxId);
        }
        // If checkbox clicked directly
        if (currentTarget.name === 'defaultStripeCard') {
          targetCheckbox = currentTarget;
        }
        if (!targetCheckbox) return;

        if (targetCheckbox) {
          showPreLoader();
          // eslint-disable-next-line prefer-destructuring
          const value = targetCheckbox.value;
          const setAsDefault = await setGetCardAsDefault(value);
          if (setAsDefault?.status !== 'success') throw new Error('Error processing request');
          allPaymentCards.forEach((method) => {
            const methodCheckbox = method.querySelector('input[name="defaultStripeCard"]');
            const methodCheckboxLabel = methodCheckbox.nextElementSibling;
            if (methodCheckboxLabel) {
              methodCheckboxLabel.textContent = 'Make this my default payment';
            }
            if (methodCheckbox) {
              methodCheckbox.checked = false;
            }
          });
          const targetLabel = targetCheckbox.nextElementSibling;
          if (targetLabel) {
            targetLabel.textContent = 'Default Payment';
          }
          targetCheckbox.checked = true;

          targetCheckbox.dispatchEvent(
            new Event('input', { bubbles: true }),
          );
          removePreLoader();
          showNotification('Setup as default payment method.', 'success');
        }
      } catch (error) {
        removePreLoader();
        showNotification(error, 'error');
      }
    });

    moduleContent?.append(moduleHeader, paymentMethodsWrapper);
    decorateIcons(moduleContent);
    return moduleContent;
  } catch (error) {
    return div(h5({ class: 'text-red' }, 'Error Loading Payment Module.'));
  }
};

export default paymentModule;

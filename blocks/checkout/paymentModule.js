import {
  buildInputElement, removePreLoader, showNotification, showPreLoader,
} from '../../scripts/common-utils.js';
import {
  h2, h5, div, p, span, form,
  h3,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { putApiData } from '../../scripts/api-utils.js';
import { getPaymentMethods } from '../../scripts/cart-checkout-utils.js';
import { getCommerceBase } from '../../scripts/commerce.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
/*
 :::::::::::::::
 generates the shipping address module for the checkout module/page
 ::::::::::::::
 */
const paymentModule = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized.' };
  }
  const baseURL = getCommerceBase();
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
            'text-black text-left text-4xl font-normal leading-[48px] p-0 m-0 pb-6',
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
    const allPaymentMethods = await getPaymentMethods();

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
        class: 'flex-col flex p-6 w-full items-start bg-checkout hidden',
      },
    );
    const savedStripeCardsWrapper = div(
      {
        class: 'saved-cards-wrapper',
      },
    );

    const newStripeCardsWrapper = div(
      {
        class: 'no-cards-wrapper flex-1 flex-col flex  gap-6 w-full items-start bg-checkout',
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
          'mt-6',
          'sameAsShipping',
        ),
        buildInputElement(
          'sameAsBilling',
          'Same as bill to Address',
          'radio',
          'stripeAddress',
          true,
          false,
          'mt-6',
          'sameAsBilling',
        ),
        buildInputElement(
          'newAddress',
          'New Address',
          'radio',
          'stripeAddress',
          true,
          false,
          'mt-6',
          'newAddress',
        ),
      ),
    );

    const newStripeCardForm = form(
      {
        id: 'newStripeCardForm',
        class:
        'text-sm w-full bg-white box-border flex flex-col gap-5 p-6 items-start flex flex-col',
        action: '',
        method: 'POST',
      },
      h3(
        {
          class: 'text-2xl font-medium text-black leading-[48px] m-0 p-0',
        },
        'Credit Card Information',
      ),
      buildInputElement(
        'name',
        'Name on Card',
        'text',
        'name',
        false,
        true,
        'name',
        '',
      ),
      buildInputElement(
        'cardNumber',
        'Card Number',
        'text',
        'cardNumber',
        false,
        true,
        'cardNumber',
        '',
      ),
      div(
        {
          class: 'w-full flex gap-4',
        },
        buildInputElement(
          'expirationDate',
          'Expiration Date',
          'text',
          'expirationDate',
          false,
          true,
          'expirationDate',
          '',
        ),
        buildInputElement(
          'cardCvc',
          'CVC',
          'text',
          'cardCvc',
          false,
          true,
          'cardCvc',
          '',
        ),
      ),
    );

    newStripeCardsWrapper?.querySelectorAll('label')?.forEach((item) => {
      item?.classList?.remove('font-semibold');
      item?.classList?.remove?.classList?.add('font-normal');
    });

    newStripeCardForm.querySelectorAll('.field-wrapper')?.forEach((fld) => {
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
    newStripeCardsWrapper.append(newStripeCardForm);
    stripeCardsContainer.append(newStripeCardsWrapper);
    stripeCardsContainer.append(savedStripeCardsWrapper);
    allPaymentMethods?.data?.forEach((pm, ind) => {
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
                pm?.displayName,
                'radio',
                'paymentMethod',
                true,
                false,
                'mt-6',
                'stripe',
              ),
            ),
            span({
              class: 'icon flex-none icon-payment-cards max-w-[115px] w-full',
            }),
          ),
        );

        stripeCardsWrapper.append(stripeCardsContainer);
        paymentMethodsWrapper?.append(stripeCardsWrapper);
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
              `border-solid border-gray-300 flex flex-col gap-3 items-start p-4 border-2 ${ind > 0 ? 'border-t-0 ' : ''} items-start`,
          },
          buildInputElement(
            'invoice',
            'Invoice',
            'radio',
            'paymentMethod',
            true,
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
            inputElement.classList.add('!mt-0');
          }
          inp?.classList.add(
            'flex',
            'flex-row-reverse',
            'items-center',
            'gap-2',
          );
          const inpu = inp?.querySelector('label');
          if (inpu?.classList.contains('font-normal')) {
            inpu?.classList.remove('font-normal');
          }
          if (inpu?.classList.contains('text-sm')) {
            inpu?.classList.remove('text-sm');
          }
          inpu?.classList.add('text-base', 'font-semibold');
        });
      decorateIcons(stripeCardsWrapper);
      paymentMethodsWrapper?.addEventListener('click', async (c) => {
        setTimeout(async () => {
          c.preventDefault();
          const eventTarget = c.target;
          const getInvoiceNumberWrapper = paymentMethodsWrapper.querySelector('#invoiceNumberWrapper');
          const getStripeCardsWrapper = paymentMethodsWrapper.querySelector('#stripeCardsContainer');
          if (!eventTarget.checked) {
            // handle invoice payment method
            if (eventTarget?.id === 'invoice') {
              showPreLoader();
              getInvoiceNumberWrapper?.classList?.remove('hidden');
              getStripeCardsWrapper?.classList?.add('hidden');
              const url = `${baseURL}baskets/current/payments/open-tender?include=paymentMethod`;
              const defaultHeaders = new Headers();
              defaultHeaders.append('Content-Type', 'Application/json');
              defaultHeaders.append(
                'authentication-token',
                authenticationToken.access_token,
              );
              const data = JSON.stringify({ paymentInstrument: 'Invoice' });
              const setupInvoice = await putApiData(url, data, defaultHeaders);
              if (setupInvoice?.status === 'success') {
                showNotification('Invoice set as payment Method for this Order.', 'success');
              }
              if (setupInvoice?.status === 'error') {
                showNotification('Error setting Invoice as payment Method for this Order.', 'error');
              }
            }
            // handle stripe payment method
            if (eventTarget?.id === 'stripe') {
              showPreLoader();
              getStripeCardsWrapper?.classList?.remove('hidden');
              getInvoiceNumberWrapper?.classList.add('hidden');
              // setup intent when user select the stripe as payment method
              const url = `${baseURL}baskets/current/setup-intent`;
              const defaultHeaders = new Headers();
              defaultHeaders.append('Content-Type', 'Application/json');
              defaultHeaders.append(
                'authentication-token',
                authenticationToken.access_token,
              );
              const data = JSON.stringify({ });
              const setuptIntent = await putApiData(url, data, defaultHeaders);
              if (setuptIntent.status === 'success') {
                showNotification('Stripe set as payment Method for this Order.', 'success');
              }
              if (setuptIntent.status === 'error') {
                showNotification('Error setting Stripe set as payment Method for this Order.', 'error');
              }
            }
            c.target.checked = true;
          } else {
            getInvoiceNumberWrapper?.classList.add('hidden');
            c.target.checked = false;
          }
          removePreLoader();
        }, 0);
      });
    }
    moduleContent?.append(moduleHeader, paymentMethodsWrapper);
    return moduleContent;
  } catch (error) {
    return div(h5({ class: 'text-red' }, 'Error Loading Payment Module.'));
  }
};

export default paymentModule;

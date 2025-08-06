import { buildInputElement, removePreLoader, showPreLoader } from '../../scripts/common-utils.js';
import {
  h2, h5, div, p, span,
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
    let cardsWrapper = div({ class: 'hidden' });
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

    const cardsContainer = div(
      {
        class: 'flex-col flex p-6 hidden w-full items-start bg-checkout',
      },
    );
    const savedCardsWrapper = div(
      {
        class: 'saved-cards-wrapper',
      },
    );

    const newCardsWrapper = div(
      {
        class: 'no-cards-wrapper flex-1 flex-col flex  gap-2 w-full items-start bg-checkout',
      },
      buildInputElement(
        'sameAsShipping',
        'Same as shipping Address',
        'radio',
        'sameAsShipping',
        true,
        false,
        'mt-6',
        'sameAsShipping',
      ),
      buildInputElement(
        'sameAsBilling',
        'Same as bill to Address',
        'radio',
        'sameAsBilling',
        true,
        false,
        'mt-6',
        'sameAsBilling',
      ),
      buildInputElement(
        'newAddress',
        'New Address',
        'radio',
        'newAddress',
        true,
        false,
        'mt-6',
        'newAddress',
      ),
    );
    newCardsWrapper?.querySelectorAll('label')?.forEach((item) => {
      item?.classList?.remove('font-semibold');
      item?.classList?.remove?.classList?.add('font-normal');
    });

    cardsContainer.append(newCardsWrapper);
    cardsContainer.append(savedCardsWrapper);
    allPaymentMethods?.data?.forEach((pm, ind) => {
      if (pm?.displayName === 'Stripe') {
        cardsWrapper.innerHTML = '';
        cardsWrapper = div(
          {
            id: `paymentMethod${pm?.displayName}`,
            class:
              `border-solid border-gray-300 flex-col gap-2 border-2  ${ind > 0 ? 'border-t-0 ' : ''}  items-start`,
          },
          div(
            {
              class: 'flex p-4 justify-between',
            },
            div(
              {
                class: 'border-solid border-gray-300 flex gap-2 flex-none items-center',
              },
              buildInputElement(
                'creditCard',
                pm?.displayName,
                'radio',
                'paymentMethod',
                true,
                false,
                'mt-6',
                'creditCard',
              ),
            ),
            span({
              class: 'icon flex-none icon-payment-cards w-[176px]',
            }),
          ),
        );

        cardsWrapper.append(cardsContainer);
        paymentMethodsWrapper?.append(cardsWrapper);
      }
      if (pm?.displayName === 'Invoice') {
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
      decorateIcons(cardsWrapper);
      paymentMethodsWrapper?.addEventListener('click', async (c) => {
        setTimeout(async () => {
          c.preventDefault();
          const eventTarget = c.target;
          const getInvoiceNumberWrapper = paymentMethodsWrapper.querySelector('#invoiceNumberWrapper');
          if (!eventTarget.checked) {
            if (eventTarget?.id === 'invoice') {
              showPreLoader();
              getInvoiceNumberWrapper?.classList.remove('hidden');
              const url = `${baseURL}baskets/current/payments/open-tender?include=paymentMethod`;
              const defaultHeaders = new Headers();
              defaultHeaders.append('Content-Type', 'Application/json');
              defaultHeaders.append(
                'authentication-token',
                authenticationToken.access_token,
              );
              const data = JSON.stringify({ paymentInstrument: 'Invoice' });
              await putApiData(url, data, defaultHeaders);
            }
            if (eventTarget?.id === 'creditCard') {
              showPreLoader();
              getInvoiceNumberWrapper?.classList.add('hidden');
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

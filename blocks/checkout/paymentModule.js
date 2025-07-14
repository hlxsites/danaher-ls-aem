import { buildInputElement } from '../../scripts/common-utils.js';
import { h2, h5, div, p, span, input } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

/*
 :::::::::::::::
 generates the shipping address module for the checkout module/page
 ::::::::::::::
 */
const paymentModule = async () => {
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
        'Choose your payment method'
      ),
      p(
        {},
        'Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business.'
      )
    );

    const paymentMethodsWrapper = div({
      id: 'paymentMethodsWrapper',
      class: 'flex flex-col w-full',
    });

    const cardsWrapper = div(
      {
        class:
          'border-solid border-gray-300 flex justify-between p-4 border-2 items-center',
      },
      div(
        {
          class: 'border-solid border-gray-300 flex gap-2 items-center',
        },
        buildInputElement(
          'creditCard',
          'Credit Card',
          'radio',
          'paymentMethod',
          true,
          false,
          'mt-6',
          false,
          false
        )
      ),
      span({
        class: 'icon icon-payment-cards w-[176px]',
      })
    );
    const invoiceWrapper = div(
      {
        class:
          'border-solid border-gray-300 flex gap-2 items-center p-4 border-2 border-t-0 items-center',
      },
      buildInputElement(
        'invoice',
        'Invoice',
        'radio',
        'paymentMethod',
        true,
        false,
        'mt-6',
        false,
        false
      )
    );

    cardsWrapper?.querySelector('div > div')?.classList.add('flex','flex-row-reverse','items-center');
    invoiceWrapper?.querySelector('div')?.classList.add('flex','flex-row-reverse','items-center');
    paymentMethodsWrapper?.append(cardsWrapper, invoiceWrapper);
    paymentMethodsWrapper?.querySelectorAll('input')?.forEach((inp) => {
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
    moduleContent?.append(moduleHeader, paymentMethodsWrapper);
    return moduleContent;
  } catch (error) {
    return div(h5({ class: 'text-red' }, 'Error Loading Payment Module.'));
  }
};

export default paymentModule;

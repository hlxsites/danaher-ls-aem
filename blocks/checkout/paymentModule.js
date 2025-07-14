import {
  h2, h5, div, p, span
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
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
          class: 'text-black text-left text-4xl font-normal leading-[48px] p-0 m-0'
        }, 
        'Choose your payment method'),
        p(
          {},
          'Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business.',
        ),
    );

    const paymentMethodsWrapper = div({
      id: 'paymentMethodsWrapper',
      class: 'border-solid flex flex-col border-2 border-gray-300 w-full',
    });

    const cardsWrapper = div({
    },input({
        name: `credit-card`,
        type: 'radio',
        id: `credit-card`,
        class: 'peer',
      }),
      div(
        { 
        }, span({
          class: 'icon icon-payment-cards'
        })
      )
    );
    const invoiceWrapper = div({
    },input({
        name: `invoiceWrapper`,
        type: 'radio',
        id: `invoiceWrapper`,
        class: 'peer',
      }),
    );

    paymentMethodsWrapper.append(cardsWrapper,invoiceWrapper);
    moduleContent?.append(moduleHeader, paymentMethodsWrapper);
    decorateIcons(cardsWrapper);
    return moduleContent;
  } catch (error) {
    return div(h5({ class: 'text-red' }, 'Error Loading Payment Module.'));
  }
};

export default paymentModule;

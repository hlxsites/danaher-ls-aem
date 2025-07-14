import {
  h2, h5, div, p,
} from '../../scripts/dom-builder.js';

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
        class: 'relative flex flex-col pb-6',
      },
      h2({}, 'Choose your payment method'),
      p(
        {},
        'Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business.',
      ),
    );

    const paymentMethodsWrapper = div({
      id: 'paymentMethodsWrapper',
      class: 'border-solid flex flex-col border-2 border-gray-300 w-full',
    });

    moduleContent?.append(moduleHeader, paymentMethodsWrapper);

    return moduleContent;
  } catch (error) {
    return div(h5({ class: 'text-red' }, 'Error Loading Payment Module.'));
  }
};

export default paymentModule;

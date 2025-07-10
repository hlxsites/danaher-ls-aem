import {
  div, p, h2, button,
} from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { shippingAddressModule } from './shippingAddress.js';
import shippingMethodsModule from './shippingMethods.js';
import paymentModule from './paymentModule.js';
import {
  changeStep,
  checkoutSummary,
} from '../../scripts/cart-checkout-utils.js';

/*
 ::::::::::::::
 shipping states will get from api based on the selected country
 ::::::::::::::
 */
export const shippingStates = '';
/*
 ::::::::::::::
 get default address either shipping or billing
 :::::::::::::::::
 */
export const getDefaultAddress = () => {
  const address = '';
  return address;
};

/*
 ::::::::::::::
 Create modules.. used for shipping address, shipping methods and payment module
 ::::::::::::::
 */
export const createModule = (id, isActive, content, buttons) => {
  const module = div({
    class: `checkout-module ${isActive ? 'active' : 'hidden'}`,
    id,
  });

  module.append(content);

  buttons.forEach((buttonData) => {
    const proceedButton = button(
      {
        class:
          'proceed-button btn btn-lg font-medium btn-primary-purple rounded-full px-6 mt-6',
        id: 'proceed-button',
        'data-tab': buttonData.tab,
      },
      buttonData.text,
    );

    proceedButton.addEventListener('click', (event) => {
      event.preventDefault();
      changeStep(event);
    });
    module.appendChild(proceedButton);
  });

  return module;
};

/*
::::::::::::::
render the modules
::::::::::::::
*/

export const loadModule = async (module) => {
  const moduleWrapper = div({
    class: `checkout-${module}-container`,
  });
  const moduleContent = div({
    class: `checkout-${module}-content`,
  });
  const moduleHeader = div({
    class: `checkout-${module}-header`,
  });
  // const moduleTitle = h2({});
  // const moduleDescription = p({});
  if (module === 'shippingAddress') {
    const loadShippingAddressModule = await shippingAddressModule();

    moduleContent.append(loadShippingAddressModule);
  }
  if (module === 'summary') {
    const checkoutSummaryModule = await checkoutSummary();

    moduleContent.append(checkoutSummaryModule);
  }
  if (module === 'shippingMethods') {
    const loadShippingMethodsModule = await shippingMethodsModule();
    moduleContent.append(loadShippingMethodsModule);
  }
  if (module === 'payment') {
    const loadPaymentModule = await paymentModule();
    moduleContent.append(loadPaymentModule);
  }
  // moduleHeader.append(moduleTitle);
  // moduleHeader.append(moduleDescription);

  moduleWrapper.append(moduleHeader);

  moduleWrapper.append(moduleContent);
  return moduleWrapper;
};

/*
  ::::::::::::::
  gerenarte the progressbar...for the checkout module to enhance user interaction
  .::::::::::::::
  */
export const progressModule = () => {
  /*
  ::::::::::::::
  Create progress-bar
  ::::::::::::::
  */
  const progressBar = div({
    class:
      'checkout-progress-bar flex items-center justify-between mb-[60px] relative w-full',
  });

  // Add elements to progress-bar
  const line = div({
    class: 'checkout-line',
  });

  const segment1 = div({
    class: 'checkout-line-segment',
    id: 'checkout-segment1',
  });

  const segment2 = div({
    class: 'checkout-line-segment',
    id: 'checkout-segment2',
  });

  const address = div({
    class: 'checkout-step active relative cursor-pointer',
    id: 'checkout-shippingAddress',
    'data-tab': 'shippingAddress',
    'data-activeTab': 'shippingAddress',
  });
  address.innerHTML = '<span data-tab= "shippingAddress" data-activeTab= "shippingAddress" class="checkout-progress-bar-icons"></span> <span  data-tab= "shippingAddress" data-activeTab= "shippingAddress" >Address</span>';

  const shipping = div({
    class: 'checkout-step cursor-pointer relative',
    id: 'checkout-shippingMethods',
    'data-tab': 'shippingMethods',
    'data-activeTab': 'shippingMethods',
  });
  shipping.innerHTML = '<span data-tab= "shippingMethods" data-activeTab= "shippingMethods"  class="checkout-progress-bar-icons"></span> <span  data-tab= "shippingMethods" data-activeTab= "shippingMethods" >Shipping</span>';

  const payment = div({
    class: ' checkout-step cursor-pointer relative',
    id: 'checkout-payment',
    'data-tab': 'payment',
    'data-activeTab': 'paymentMethods',
  });
  payment.innerHTML = '<span data-tab="payment" data-activeTab="paymentMethods"  class="checkout-progress-bar-icons"></span> <span  data-tab="payment" data-activeTab="paymentMethods" >Payment</span>';

  /*
 ::::::::::::::
 Append steps and segments to progress-bar
 ::::::::::::::
 */
  progressBar.append(line, segment1, segment2, address, shipping, payment);

  const checkoutSteps = progressBar.querySelectorAll('.checkout-step');
  checkoutSteps.forEach((step) => {
    step.addEventListener('click', (s) => {
      changeStep(s);
    });
  });
  return progressBar;
};

/*
::::::::::::::
initialize module to render at page load.
.::::::::::::::
 */
export const initializeModules = async () => {
  const authenticationToken = await getAuthenticationToken();

  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }

  const getShippingAddressModule = await loadModule('shippingAddress');
  const detailsModule = await loadModule('summary');
  const getShippingMethodsModule = await loadModule('shippingMethods');
  const paymentModuleContent = await loadModule('payment');
  /*
   ::::::::::::::
   Define module details
   ::::::::::::::
   */
  const modules = [
    createModule(
      'checkout-shippingAddress-module',
      true,
      getShippingAddressModule,
      [],
    ),
    createModule('checkout-details', false, detailsModule, []),
    createModule(
      'checkout-shippingMethods-module',
      false,
      getShippingMethodsModule,
      [],
    ),
    createModule('checkout-payment-module', false, paymentModuleContent, []),
  ];
  return modules;
};

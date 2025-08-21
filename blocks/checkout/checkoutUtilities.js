import {
  div, button, span,
} from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { shippingAddressModule } from './shippingAddress.js';
import shippingMethodsModule from './shippingMethods.js';
import paymentModule from './paymentModule.js';
import {
  changeStep,
  checkoutSummary,
} from '../../scripts/cart-checkout-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

/*
 ::::::::::::::
 shipping states will get from api based on the selected country
 ::::::::::::::
 */
export const shippingStates = '';

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
    class: `checkout-${module}-container w-full`,
  });
  const moduleContent = div({
    class: `checkout-${module}-content`,
  });
  const moduleHeader = div({
    class: `checkout-${module}-header`,
  });
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
      'checkout-progress-bar flex items-center justify-between mb-16 relative w-full',
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

  const address = div(
    {
      class: 'checkout-step active relative cursor-pointer bg-white border-gray-300',
      id: 'checkout-shippingAddress',
      'data-tab': 'shippingAddress',
      'data-activeTab': 'shippingAddress',
    },
    span(
      {
        class: 'checkout-progress-bar-icons',
        'data-tab': 'shippingAddress',
        'data-activeTab': 'shippingAddress',
      },
    ),
    span(
      {
        'data-tab': 'shippingAddress',
        'data-activeTab': 'shippingAddress',
        class: 'icon icon-check-circle-filled checkout-progress-bar-check hidden',
      },
    ),
    span({
      'data-tab': 'shippingAddress',
      'data-activeTab': 'shippingAddress',
    }, 'Address'),
  );
  const shipping = div(
    {
      class: 'checkout-step cursor-pointer relative bg-white border-gray-300',
      id: 'checkout-shippingMethods',
      'data-tab': 'shippingMethods',
      'data-activeTab': 'shippingAddress',
    },
    span(
      {
        class: 'checkout-progress-bar-icons',
        'data-tab': 'shippingMethods',
        'data-activeTab': 'shippingMethods',
      },
    ),
    span(
      {
        'data-tab': 'shippingMethods',
        'data-activeTab': 'shippingMethods',
        class: 'icon icon-check-circle-filled checkout-progress-bar-check hidden',
      },
    ),
    span({
      'data-tab': 'shippingMethods',
      'data-activeTab': 'shippingMethods',
    }, 'shipping'),
  );
  const payment = div(
    {
      class: ' checkout-step cursor-pointer relative bg-white border-gray-300',
      id: 'checkout-payment',
      'data-tab': 'payment',
      'data-activeTab': 'paymentMethods',
    },
    span(
      {
        class: 'checkout-progress-bar-icons',
        'data-tab': 'payment',
        'data-activeTab': 'paymentMethods',
      },
    ),
    span(
      {
        class: 'icon icon-check-circle-filled checkout-progress-bar-check hidden',
      },
    ),
    span(
      {
        'data-tab': 'payment',
        'data-activeTab': 'paymentMethods',
      },
      'Payment',
    ),
  );

  /*
 ::::::::::::::
 Append steps and segments to progress-bar
 ::::::::::::::
 */
  progressBar.append(line, segment1, segment2, address, shipping, payment);
  decorateIcons(progressBar);
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

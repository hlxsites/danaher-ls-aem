import {
  div, button, span,
} from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
// eslint-disable-next-line import/no-cycle
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
          'proceed-button bg-danaherpurple-500 text-white font-medium rounded-[30px] px-[25px] mt-6 mb-6 py-[13px] text-base flex justify-center items-center hover:bg-danaherpurple-800',
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

export const loadCheckoutModule = async (module) => {
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
    id: 'checkoutProgressBar',
    class:
      'checkout-progress-bar hidden flex items-center justify-between mb-16 relative w-full max-w-[94%] mx-auto',
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
      class: 'checkout-step active flex items-center justify-center cursor-pointer bg-white border-gray-300',
      id: 'checkout-shippingAddress',
      'data-tab': 'shippingAddress',
      'data-activeTab': 'shippingAddress',
    },
    span(
      {
        class: 'checkout-progress-bar-icons w-[10px] h-[10px] absolute left-0 top-0',
        'data-tab': 'shippingAddress',
        'data-activeTab': 'shippingAddress',
      },
    ),
    div(
      {
        class: 'absolute left-0 top-0',
      },
      span(
        {
          'data-tab': 'shippingAddress',
          'data-activeTab': 'shippingAddress',
          class: 'icon icon-check-circle-filled checkout-progress-bar-check hidden',
        },
      ),
    ),
    span({
      class: 'font-bold text-xl pt-8 mt-12',
      'data-tab': 'shippingAddress',
      'data-activeTab': 'shippingAddress',
    }, 'Address'),
  );
  const shipping = div(
    {
      class: 'checkout-step flex items-center justify-center cursor-pointer bg-white border-gray-300',
      id: 'checkout-shippingMethods',
      'data-tab': 'shippingMethods',
      'data-activeTab': 'shippingAddress',
    },
    span(
      {
        class: 'checkout-progress-bar-icons w-[10px] h-[10px] absolute left-0 top-0',
        'data-tab': 'shippingMethods',
        'data-activeTab': 'shippingMethods',
      },
    ),
    div(
      {
        class: 'absolute left-0 top-0',
      },
      span(
        {
          'data-tab': 'shippingMethods',
          'data-activeTab': 'shippingMethods',
          class: 'icon icon-check-circle-filled checkout-progress-bar-check hidden',
        },
      ),
    ),
    span({
      class: 'font-bold text-xl pt-8 mt-12',
      'data-tab': 'shippingMethods',
      'data-activeTab': 'shippingMethods',
    }, 'Shipping'),
  );
  const payment = div(
    {
      class: 'checkout-step flex items-center justify-center cursor-pointer bg-white border-gray-300',
      id: 'checkout-payment',
      'data-tab': 'payment',
      'data-activeTab': 'paymentMethods',
    },
    span(
      {
        class: 'checkout-progress-bar-icons w-[10px] h-[10px] absolute left-0 top-0',
        'data-tab': 'payment',
        'data-activeTab': 'paymentMethods',
      },
    ),
    div(
      {
        class: 'absolute left-0 top-0',
      },
      span(
        {
          class: 'icon icon-check-circle-filled checkout-progress-bar-check hidden',
        },
      ),
    ),
    span(
      {
        class: 'font-bold text-xl pt-8 mt-12',
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
  decorateIcons(address);
  decorateIcons(shipping);
  decorateIcons(payment);
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
  Update line segments between steps
  ::::::::::::::
  */
function updateCheckoutUI(steps, stepKey) {
  const path = window.location.pathname;
  document.querySelectorAll('.checkout-step')?.forEach((ste) => {
    if (ste?.classList.contains('pointer-events-none')) {
      ste?.classList.remove('pointer-events-none');
    }
  });
  if (path.includes('address')) {
    document.querySelector('#checkout-shippingAddress')?.classList.add('pointer-events-none');
  }
  if (path.includes('shipping')) {
    document.querySelector('#checkout-shippingMethods')?.classList.add('pointer-events-none');
  }
  if (path.includes('payment')) {
    document.querySelector('#checkout-payment')?.classList.add('pointer-events-none');
  }
  const config = steps[stepKey];
  if (!config) return;

  const segment1 = document.getElementById('checkout-segment1');
  const segment2 = document.getElementById('checkout-segment2');

  // Update segment widths
  // eslint-disable-next-line prefer-destructuring
  segment1.style.width = config.width[0];
  // eslint-disable-next-line prefer-destructuring
  segment2.style.width = config.width[1];

  // Update active steps
  document.querySelectorAll('.checkout-step').forEach((st) => {
    st.classList.toggle('active', config.activeSteps.includes(st.id));
  });

  // Update progress bar icons
  Object.entries(config.progress).forEach(([id, { show, check, color }]) => {
    const stepEl = document.getElementById(id);
    if (!stepEl) return;

    const progressIcon = stepEl.querySelector('.checkout-progress-bar-icons');
    const checkIcon = stepEl.querySelector('.icon-check-circle-filled');

    progressIcon?.classList.toggle('hidden', !show);
    checkIcon?.classList.toggle('hidden', !check);

    if (color) {
      progressIcon?.classList.add('!bg-danaherpurple-500');
    } else {
      progressIcon?.classList.remove('!bg-danaherpurple-500');
    }
  });
}

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

  const modules = [];

  const steps = {
    addresses: {
      width: ['0', '0'],
      activeSteps: ['checkout-shippingAddress'],
      progress: {
        'checkout-shippingAddress': { show: true, check: false, color: true },
        'checkout-shippingMethods': { show: true, check: false },
      },
      button: {
        text: 'Proceed to Shipping',
        activeTab: 'shippingAddress',
        tab: 'shippingMethods',
      },
    },
    shipping: {
      width: ['50%', '0'],
      activeSteps: ['checkout-shippingAddress', 'checkout-shippingMethods'],
      progress: {
        'checkout-shippingAddress': { show: false, check: true },
        'checkout-shippingMethods': { show: true, check: false },
      },
      button: {
        text: 'Proceed to Payment',
        activeTab: 'shippingMethods',
        tab: 'payment',
      },
    },
    payment: {
      width: ['50%', '50%'],
      activeSteps: ['checkout-shippingAddress', 'checkout-shippingMethods', 'checkout-payment'],
      progress: {
        'checkout-shippingAddress': { show: false, check: true },
        'checkout-shippingMethods': { show: false, check: true },
      },
      button: {
        text: 'Place your order',
        activeTab: 'paymentMethods',
        tab: 'submitOrder',
      },
    },
  };

  const checkPath = window.location.pathname;
  // Determine which step to render
  if (checkPath.includes('addresses')) updateCheckoutUI(steps, 'addresses');
  else if (checkPath.includes('shipping')) updateCheckoutUI(steps, 'shipping');
  else if (checkPath.includes('payment')) updateCheckoutUI(steps, 'payment');

  if (checkPath.includes('addresses')) {
    const shippingAddressPage = await loadCheckoutModule('shippingAddress');
    modules.push(
      createModule('checkout-shippingAddress-module', true, shippingAddressPage, []),
    );
  }

  if (checkPath.includes('shipping')) {
    const shippingMethodsPage = await loadCheckoutModule('shippingMethods');
    modules.push(
      createModule('checkout-shippingMethods-module', true, shippingMethodsPage, []),
    );
  }

  if (checkPath.includes('payment')) {
    const paymentPage = await loadCheckoutModule('payment');
    modules.push(
      createModule('checkout-payment-module', true, paymentPage, []),
    );
  }

  // Optional: Always load summary/details module
  const detailsModule = await loadCheckoutModule('summary');
  modules.push(createModule('checkout-details', false, detailsModule, []));
  return modules;
};

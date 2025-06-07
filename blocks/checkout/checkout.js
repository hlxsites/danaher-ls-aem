import { div } from '../../scripts/dom-builder.js';
import { progressModule, initializeModules } from './checkoutUtilities.js';
import { showPreLoader } from '../../scripts/common-utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';

export default async function decorate(block) {
  showPreLoader();
  const authenticationToken = await getAuthenticationToken();

  if (authenticationToken?.status === 'error') {
    window.location.href = '/us/en/eds-stage-test/login.html?ref=feature-cart-checkout-summary';
    // return { status: 'error', data: 'Unauthorized access.' };
  }
  block.innerHtml = '';

  /*
  ::::::::::::::
  Create container
  ::::::::::::::
  */
  const checkoutWrapper = div({
    class:
      'checkout-wrapper dhls-container  w-full flex flex-col mx-auto flex justify-between',
  });

  /*
  ::::::::::::::
  Create Modules outer
  ::::::::::::::
  */
  const modulesContent = div({
    class: 'checkout-content flex flex-col gap-16 justify-between  lg:flex-row',
  });

  /*
  ::::::::::::::
  Create Modules container
  ::::::::::::::
  */
  const modulesContainer = div({
    class: 'checkout-modules-wrapper w-7/10',
  });

  const progressBar = progressModule();
  checkoutWrapper.appendChild(progressBar);
  /*
  ::::::::::::::
  Append container to document body
  ::::::::::::::
  */
  block.appendChild(checkoutWrapper);

  /*
  ::::::::::::::
  initialize the shipping address, shipping methods and payment module at page load
  ::::::::::::::
  */
  initializeModules()
    .then((modules) => {
      // Append modules to container
      modules.forEach((module) => {
        if (module.getAttribute('id') === 'checkout-details') {
          module.className = '';
          module.className = 'checkout-summary-wrapper flex justify-center';
          modulesContent.appendChild(module);
        } else {
          modulesContainer.appendChild(module);
        }
      });
    })
    .catch((error) => ({
      status: 'error',
      data: `Error initializing modules: ${error}`,
    }));

  modulesContent.append(modulesContainer);
  checkoutWrapper.append(modulesContent);
  return {};
}

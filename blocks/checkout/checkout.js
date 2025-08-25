import { div } from '../../scripts/dom-builder.js';
import { progressModule, initializeModules } from './checkoutUtilities.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { checkoutSkeleton } from '../../scripts/cart-checkout-utils.js';

// eslint-disable-next-line consistent-return
export default async function decorate(block) {
  document.querySelector('main')?.classList.add('bg-checkout');
  const authenticationToken = await getAuthenticationToken();

  if (
    authenticationToken?.status === 'error'
    || authenticationToken.user_type === 'guest' || !sessionStorage.getItem('productDetailObject')
  ) {
    window.location.href = '/us/en/e-buy/cartlanding';
    return false;
  }
  block.innerHtml = '';

  /*
  ::::::::::::::
  Create container
  ::::::::::::::
  */
  const checkoutWrapper = div({
    id: 'checkoutWrapper',
    class:
      'checkout-wrapper dhls-container !mt-0 w-full flex flex-col mx-auto flex justify-between',
  });

  /*
  ::::::::::::::
  Create Modules outer
  ::::::::::::::
  */
  const modulesContent = div({
    class: 'checkout-content flex flex-col gap-5 justify-between  lg:flex-row',
  });

  /*
  ::::::::::::::
  Create Modules container
  ::::::::::::::
  */
  const modulesContainer = div({
    class:
      'checkout-modules-wrapper hidden h-max border border-danahergray-75 bg-white w-full lg:w-7/10 p-6',
    id: 'checkoutModulesWrapper',
  });

  const progressBar = progressModule();

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
          module.className = 'checkout-summary-wrapper h-max flex justify-center w-full lg:w-[30%]';
          modulesContent.appendChild(module);
        } else {
          modulesContainer.appendChild(module);
          if (progressBar?.classList.contains('hidden')) {
            progressBar.classList.remove('hidden');
          }
          if (modulesContainer?.classList.contains('hidden')) {
            modulesContainer.classList.remove('hidden');
          }
          modulesContent.querySelector('#checkoutSkeleton')?.remove();
        }
      });
    })
    .catch((error) => ({
      status: 'error',
      data: `Error initializing modules: ${error}`,
    }));
  modulesContent.append(checkoutSkeleton());
  modulesContent.append(modulesContainer);
  checkoutWrapper.appendChild(progressBar);
  checkoutWrapper.append(modulesContent);
  /*
  ::::::::::::::
  Append container to document body
  ::::::::::::::
  */
  block.appendChild(checkoutWrapper);
}

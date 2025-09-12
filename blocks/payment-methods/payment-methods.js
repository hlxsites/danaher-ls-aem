import { div, h2 } from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { paymentModule } from '../checkout/paymentModule.js';
import { checkoutSkeleton } from '../../scripts/cart-checkout-utils.js';

// eslint-disable-next-line consistent-return
export default async function decorate(block) {
  const authenticationToken = await getAuthenticationToken();
  if ((authenticationToken?.status === 'error') || (authenticationToken.user_type === 'guest')) {
    window.location.href = window.EbuyConfig?.cartPageUrl;
    return false;
  }
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

  document.querySelector('main')?.classList.add('bg-checkout');
  const wrapper = div(
    {
      id: 'dashboardWrapper',
      class: 'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
    },
  );
  const dashboardSideBarContent = await dashboardSidebar();

  const paymentmethodsWrapper = div(
    {
      class: 'w-[70%] bg-white p-6',
      id: 'paymentMethodsWrapper',
    },
    h2(
      {
        class: 'text-2xl',
      },
      'Payment Methods Wrapper',
    ),
  );
  paymentmethodsWrapper.append(checkoutSkeleton());
  /*

  initialize the payment module

  */
  paymentModule(true)?.then(async (module) => {
    paymentmethodsWrapper.innerHTML = '';
    paymentmethodsWrapper.append(module);
    const paymentHeading = paymentmethodsWrapper.querySelector('h2');
    const paymentSubHeading = paymentmethodsWrapper.querySelector('p');
    if (paymentHeading) {
      paymentHeading.textContent = 'Payment Methods';
    }
    if (paymentSubHeading) {
      paymentSubHeading.textContent = 'Manage your saved payment methods';
    }
    module?.querySelector('#paymentMethodInvoice')?.classList.add('opacity-50', 'pointer-events-none');
    const paymentMethodStripe = module?.querySelector('#paymentMethodSTRIPE_PAYMENT');
    const savedStripeCardsList = module?.querySelector('#savedStripeCardsList');
    if (paymentMethodStripe) {
      savedStripeCardsList.className = 'w-full gap-6 flex flex-col max-h-[645px] pr-2 overflow-auto flex flex-col gap-6 pt-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500';
      if (paymentMethodStripe?.querySelector('input[type="radio"]')) {
        paymentMethodStripe.querySelector('input[type="radio"]').checked = true;
      }
    }
  });
  wrapper.append(dashboardSideBarContent, paymentmethodsWrapper);

  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
}

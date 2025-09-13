import { div, h2 } from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import {
  getStripeElements, getStripeInstance, paymentModule, createCardItem,
} from '../checkout/paymentModule.js';
import { checkoutSkeleton } from '../../scripts/cart-checkout-utils.js';
import { confirmSetup, setGetCardAsDefault, getPaymentIntent } from '../../scripts/stripe_utils.js';
import { removePreLoader, showNotification, showPreLoader } from '../../scripts/common-utils.js';

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
    try {
      if (paymentHeading) {
        paymentHeading.textContent = 'Payment Methods';
      }
      if (paymentSubHeading) {
        paymentSubHeading.textContent = 'Manage your saved payment methods';
      }
      module?.querySelector('#paymentMethodInvoice')?.classList.add('opacity-50', 'pointer-events-none');
      const paymentMethodStripe = module?.querySelector('#paymentMethodSTRIPE_PAYMENT');
      const savedStripeCardsList = module?.querySelector('#savedStripeCardsList');
      const newStripeCardsWrapper = module?.querySelector('#newStripeCardsWrapper');
      const saveStripeCard = module?.querySelector('#saveStripeCard');
      const savedStripeCardsHeader = module?.querySelector('#savedStripeCardsHeader');
      if (paymentMethodStripe) {
        savedStripeCardsList.className = 'w-full gap-6 flex flex-col max-h-[645px] pr-2 overflow-auto flex flex-col gap-6 pt-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500';
        if (paymentMethodStripe?.querySelector('input[type="radio"]')) {
          paymentMethodStripe.querySelector('input[type="radio"]').checked = true;
        }
        saveStripeCard?.addEventListener('click', async () => {
          showPreLoader();
          const getStripe = await getStripeInstance();
          const stripeEle = await getStripeElements();
          const savingCard = await confirmSetup(getStripe, stripeEle, `${window.location.origin}/payment`);

          const addressElements = stripeEle.getElement('address');
          const paymentElements = stripeEle.getElement('payment');
          // if stripe setup confirmed
          const confirmSetupStatus = savingCard?.setupIntent?.status;
          const validConfirmStatus = ['succeeded', 'requires_action'];
          if (!validConfirmStatus.includes(confirmSetupStatus)) {
            throw new Error('Error Processing Payment');
          }
          const updateSavedCards = await getPaymentIntent();
          if (updateSavedCards?.status !== 'success') throw new Error('No Saved Cards Found.');
          const getDefaultCard = await setGetCardAsDefault();
          let defaultCard = '';
          if (getDefaultCard?.status !== 'success') throw new Error('Error getting default card');

          addressElements?.unmount();
          paymentElements?.unmount();
          // check if has saved cards and render list
          const checkSavedStripeCards = updateSavedCards?.data?.data;
          defaultCard = getDefaultCard?.data?.invoice_settings?.default_payment_method?.id;
          if (checkSavedStripeCards?.length > 0) {
            checkSavedStripeCards?.forEach((item) => {
              savedStripeCardsList?.append(createCardItem(item, defaultCard));
            });
          }
          newStripeCardsWrapper?.classList.add('hidden');
          if (savedStripeCardsHeader?.classList?.contains('hidden')) {
            savedStripeCardsHeader?.classList.remove('hidden');
          }
          if (savedStripeCardsList?.classList?.contains('hidden')) {
            savedStripeCardsList?.classList.remove('hidden');
          }
          removePreLoader();
          showNotification('Card added successfully.', 'success');
        });
      }
    } catch (error) {
      removePreLoader();
      showNotification('Error Processing Request.', 'error');
    }
  });
  wrapper.append(dashboardSideBarContent, paymentmethodsWrapper);

  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
}

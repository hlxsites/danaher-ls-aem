import { div, h2, p } from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { checkoutSkeleton } from '../../scripts/cart-checkout-utils.js';
import { addressListModal } from '../checkout/shippingAddress.js';
import { removePreLoader } from '../../scripts/common-utils.js';

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

  const addressesWrapper = div(
    {
      class: 'w-[70%] bg-white p-6',
      id: 'addressesWrapper',
    },
    h2(
      {
        class: 'text-2xl',
      },
      'My Address',
    ),
  );
  const addressesWrapperSubHeading = p(
    {
      class: 'text-sm text-black',
    },
    'Manage your shipping and billing info—your address book is always within reach.',
  );

  addressesWrapper.append(checkoutSkeleton());

  const addressesList = await addressListModal('shipping', false);
  if (addressesList) {
    addressesWrapper.innerHTML = '';
    addressesWrapper.append(addressesList);
    const addressListItemsWrapper = addressesList?.querySelector('#shippingAddressListItemsWrapper');
    const addressListHeader = addressesList?.querySelector('#shippingAddressListModalHeader');
    if (addressListItemsWrapper) {
      if (addressListItemsWrapper?.classList?.contains('max-h-97')) {
        addressListItemsWrapper?.classList?.remove('max-h-97');
        addressListItemsWrapper.style.maxHeight = '880px';
      }
    }
    addressListItemsWrapper?.querySelectorAll('button')?.forEach((btn) => {
      btn?.classList.add('hover:bg-danaherpurple-500');
    });
    addressListItemsWrapper?.querySelectorAll('.shipping-address-list-item-actions')?.forEach((act) => {
      act?.querySelectorAll('span')?.forEach((actbtn) => actbtn?.removeAttribute('data-canclebutton'));
    });
    addressListItemsWrapper?.querySelectorAll('button')?.forEach((btn) => {
      btn?.removeAttribute('data-canclebutton');
    });
    if (addressListHeader) {
      addressListHeader.querySelector('p').textContent = 'My Address';
      addressListHeader.querySelector('p').insertAdjacentElement('afterend', addressesWrapperSubHeading);
      addressListHeader?.querySelector('#search')?.removeAttribute('data-source');
    }
  }
  /*
  ::::::::::::::
  initialize the payment module
  ::::::::::::::
  */

  wrapper.append(dashboardSideBarContent, addressesWrapper);

  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

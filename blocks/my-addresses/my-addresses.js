import { div, span } from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { checkoutSkeleton, addressList } from '../../scripts/cart-checkout-utils.js';
import { addressListModal } from '../checkout/shippingAddress.js';
import { removePreLoader } from '../../scripts/common-utils.js';

// eslint-disable-next-line consistent-return
export default async function decorate(block) {
  const authenticationToken = await getAuthenticationToken();
  let searchedAddressLength;
  if (
    authenticationToken?.status === 'error'
    || authenticationToken.user_type === 'guest'
  ) {
    window.location.href = window.EbuyConfig?.cartPageUrl;
    return false;
  }
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

  document.querySelector('main')?.classList.add('bg-checkout');
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const addressTitleDiv = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-4',
    },
    div(
      {
        class:
          'self-stretch justify-start !text-gray-900 text-3xl font-normal leading-10',
      },
      'My Address',
    ),
    div(
      {
        class:
          'self-stretch justify-start text-black text-base font-extralight leading-snug',
      },
      'Manage your shipping and billing info—your address book is always within reach.',
    ),
  );
  const dashboardSideBarContent = await dashboardSidebar();
  const addressWrapper = div({
    class: 'w-[70%] inline-flex flex-col justify-start items-start gap-5 ',
  });
  const addressesWrapper = div(
    {
      class: 'w-full bg-white p-6',
      id: 'addressesWrapper',
    },

  );
  addressWrapper.append(addressTitleDiv);
  addressesWrapper.append(checkoutSkeleton());
  const emptyAddressListWrapper = (
    addressSearchedLength,
    searchedWord = null,
  ) => {
    const emptyAddressListContainer = div(
      {
        class: 'self-stretch p-14 inline-flex justify-start items-start gap-5',
      },
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-start items-center gap-9',
        },
        div(
          {
            class:
              'self-stretch flex flex-col justify-start items-center gap-2',
          },
          div(
            {
              class: ' flex justify-start items-center gap-3',
            },
            span({
              class: 'icon icon-Location-marker w-[200px] h-[60px] [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
            }),
          ),
          div(
            {
              class:
                'self-stretch flex flex-col justify-start items-center gap-4',
            },
            div(
              {
                class: 'w-[656px] flex flex-col text-center justify-start',
              },
              span(
                {
                  class: '!text-gray-900 text-4xl font-normal leading-[48px]',
                },
                'We’re sorry. ',
              ),
              span(
                {
                  class: 'text-gray-900 text-2xl font-normal leading-loose',
                },
                addressSearchedLength !== 0
                  ? 'We could not find any Addresses for the relevant account.'
                  : `We could not find a Address match for “${searchedWord}"`,
              ),
            ),
            div(
              {
                class: 'w-[692px] flex flex-col justify-start items-start',
              },
              div(
                {
                  class:
                    'self-stretch text-center justify-start text-black text-base font-extralight leading-snug',
                },
                addressSearchedLength !== 0
                  ? 'Try adding the address'
                  : 'Check for typos, spelling errors, search by part number or try an different keyword',
              ),
            ),
          ),
        ),
      ),
    );
    return emptyAddressListContainer;
  };

  const addressesList = await addressListModal('shipping', false);
  if (addressesList) {
    addressesWrapper.innerHTML = '';
    addressesWrapper.append(addressesList);
    const addressListItemsWrapper = addressesList?.querySelector(
      '#shippingAddressListItemsWrapper',
    );
    const addressListHeader = addressesList?.querySelector(
      '#shippingAddressListModalHeader',
    );
    const addressListSearchInput = addressListHeader.querySelector(
      '#searchWithIcon input',
    );
    addressListSearchInput.style.width = '455px';
    const addressListData = await addressList('shipping');
    if (addressListSearchInput) {
      addressListSearchInput.addEventListener('input', (e) => {
        e.preventDefault();
        const searchTerm = e.target.value.toLowerCase();
        const searchedAddress = addressListData.filter((ad) => {
          const lowerCaseCompanyName = ad?.companyName2?.toLowerCase();
          const lowerCaseAddressLine1 = ad?.addressLine1?.toLowerCase();
          const lowerCasefirstName = ad?.firstName?.toLowerCase();
          const lowerCaselastName = ad?.lastName?.toLowerCase();
          const lowerCasestreet = ad?.street?.toLowerCase();
          const lowerCasestate = ad?.state?.toLowerCase();
          const lowerCasecountry = ad?.country?.toLowerCase();
          const lowerCasecity = ad?.city?.toLowerCase();
          const lowerCasemainDivisionName = ad?.mainDivisionName?.toLowerCase();
          const lowerCasepostalCode = ad?.postalCode;
          return (
            lowerCaseAddressLine1?.includes(searchTerm)
            || lowerCaseCompanyName?.includes(searchTerm)
            || lowerCasefirstName?.includes(searchTerm)
            || lowerCaselastName?.includes(searchTerm)
            || lowerCasestreet?.includes(searchTerm)
            || lowerCasestate?.includes(searchTerm)
            || lowerCasestreet?.includes(searchTerm)
            || lowerCasecountry?.includes(searchTerm)
            || lowerCasecity?.includes(searchTerm)
            || lowerCasepostalCode?.includes(searchTerm)
            || lowerCasemainDivisionName?.includes(searchTerm)
          );
        });
        if (searchedAddress.length === 0) {
          searchedAddressLength = 0;
          addressListItemsWrapper.style.overflowX = 'hidden';
          const emptyAddressListItemsWrapper = addressesList?.querySelector(
            '.emptyAddressListWrapper',
          );
          emptyAddressListItemsWrapper.innerHTML = '';
          emptyAddressListItemsWrapper.append(
            emptyAddressListWrapper(searchedAddressLength, searchTerm),
          );
        }
      });
    }
    if (
      addressListItemsWrapper?.querySelectorAll(
        '.shipping-address-list-item-actions',
      ).length === 0
    ) {
      searchedAddressLength = 1;
      addressListItemsWrapper.style.overflowX = 'hidden';
      const emptyAddressListItemsWrapper = addressesList?.querySelector(
        '.emptyAddressListWrapper',
      );
      emptyAddressListItemsWrapper.innerHTML = '';
      emptyAddressListItemsWrapper.append(
        emptyAddressListWrapper(searchedAddressLength),
      );
    }
    if (addressListItemsWrapper) {
      if (addressListItemsWrapper?.classList?.contains('max-h-97')) {
        addressListItemsWrapper?.classList?.remove('max-h-97');
        addressListItemsWrapper.style.maxHeight = '880px';
      }
    }
    addressListItemsWrapper?.querySelectorAll('button')?.forEach((btn) => {
      btn?.classList.add('hover:bg-danaherpurple-500');
    });
    addressListItemsWrapper
      ?.querySelectorAll('.shipping-address-list-item-actions')
      ?.forEach((act) => {
        act
          ?.querySelectorAll('span')
          ?.forEach((actbtn) => actbtn?.removeAttribute('data-canclebutton'));
      });
    addressListItemsWrapper?.querySelectorAll('button')?.forEach((btn) => {
      btn?.removeAttribute('data-canclebutton');
    });
    if (addressListHeader) {
      addressListHeader.querySelector('p').textContent = 'Shipping address';
      addressListHeader
        ?.querySelector('#search')
        ?.removeAttribute('data-source');
    }
  }

  /*

  initialize the payment module

  */
  addressWrapper.append(addressesWrapper);

  wrapper.append(dashboardSideBarContent, addressWrapper);

  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

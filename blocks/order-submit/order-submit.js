import { div } from '../../scripts/dom-builder.js';
import { cartItem } from '../cartlanding/cartItem.js';
import { checkoutSummary } from '../../scripts/cart-checkout-utils.js';
import { removePreLoader, showPreLoader } from '../../scripts/common-utils.js';

export default async function decorate(block) {
  showPreLoader();
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');
  if (orderId) {
    const orderDetails = JSON.parse(sessionStorage.getItem('orderSubmitDetails'));
    let notes = '';
    orderDetails?.data?.attributes?.forEach((item) => {
      if (item.name === 'GroupShippingNote') {
        notes = item.value;
      }
    });

    const orderConfirmationWrapper = div({
      class:
        'self-stretch px-10 py-14 bg-gray-50 inline-flex flex-col justify-start items-start gap-5',
    });
    const orderDescription = div(
      {
        class: 'self-stretch flex flex-col justify-start items-start gap-6',
      },
      div(
        {
          class: 'justify-start text-4xl font-bold leading-[48px]',
        },
        'Order submitted',
      ),
      div(
        {
          class:
            'self-stretch justify-start text-gray-900 text-3xl font-semibold leading-10',
        },
        `Order number: ${orderDetails.data.documentNumber}`,
      ),
      div(
        {
          class:
            'self-stretch justify-start text-black text-base font-extralight leading-snug',
        },
        'Congratulations! Your order is submitted. Get ready for the excitement as we process your purchase. Thank you for choosing us – your satisfaction is our top priority!',
      ),
    );
    const checkoutSummaryContainer = await checkoutSummary(orderId);

    const cartItems = await cartItem();
    const notesValue = () => {
      const notesDiv = div(
        {
          class: `${!orderDetails?.data?.attributes[0]?.value ? 'hidden' : ''}
    }`,
        },
        div(
          {
            class: 'w-28 justify-start text-gray-700 text-base font-bold',
          },
          'Notes',
        ),
        div(
          {
            class:
              'w-[744px] justify-start text-gray-700 text-base font-extralight',
          },
          orderDetails?.data?.attributes[0]?.value || '',
        ),
      );

      return notesDiv;
    };
    const cartItemsWrapper = div(
      {
        class: 'self-stretch flex flex-col justify-start items-start gap-9',
      },
      div(
        {
          class: 'self-stretch inline-flex justify-start items-start gap-5',
        },
        div(
          {
            class:
              'self-stretch p-6 bg-white outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col justify-start items-start gap-7',
            id: 'cart-item',
          },
          div(
            {
              class: 'self-stretch p-6 bg-white',
            },
            cartItems,
          ),
          div(
            {
              class:
                'w-[775px] ml-[25px] self-stretch outline outline-1 outline-gray-200 flex flex-col justify-start items-start gap-6',
            },
            div(
              {
                class:
                  'self-stretch p-6 bg-white flex flex-col justify-start items-start gap-6',
              },
              div(
                {
                  class: 'inline-flex justify-start items-center gap-6',
                },
                div(
                  {
                    class: 'justify-start text-gray-700 text-base font-bold',
                  },
                  'Estimated Shipping',
                ),
                div(
                  {
                    class:
                      'w-80 justify-start text-gray-700 text-base font-extralight',
                  },
                  `${ orderDetails?.included?.commonShippingMethod?.STD_GROUND?.name } `,
                ),
                div(
                  {
                    class: 'justify-start text-gray-700 text-base font-bold',
                  },
                  'Estimated Delivery',
                ),
                div(
                  {
                    class:
                      'w-80 justify-start text-gray-700 text-base font-extralight',
                  },
                  'April 8-11',
                ),
              ),
              div(
                {
                  class:
                    'self-stretch inline-flex justify-start items-center gap-6',
                },
                notes !== ''
                  ? notesValue()
                  : '',
              ),
            ),
          ),
        ),
        div(
          {
            class: 'w-96 inline-flex flex-col justify-start items-start gap-4',
          },
          div(
            {
              class:
                'w-full flex flex-col justify-start items-start gap-9',
            },
            checkoutSummaryContainer,
          ),
        ),
      ),
    );

    orderConfirmationWrapper.append(orderDescription);
    cartItemsWrapper?.querySelector('#cartListContainer')?.querySelectorAll('.cart-item-wrapper')?.forEach((item) => {
      if (item?.classList.contains('flex-col')) {
        item?.classList.remove('flex-col');
      }
    });
    orderConfirmationWrapper.append(cartItemsWrapper);
    const inputElements = cartItemsWrapper.querySelectorAll('input');
    inputElements.forEach((element) => {
      element.style.border = 'none';
      element.disabled = true;
    });
    const deleteButtondiv = cartItemsWrapper.querySelectorAll('.cart-delete');
    deleteButtondiv.forEach((element) => {
      element.parentElement.remove();
    });
    removePreLoader();
    block.append(orderConfirmationWrapper);
  } else {
    const noPageFound = div({
      class: 'justify-start text-4xl font-bold leading-[48px]',
    }, '404: PAGE NOT FOUND');
    removePreLoader();
    block.append(noPageFound);
  }
}

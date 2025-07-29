import { div } from '../../scripts/dom-builder.js';
import cartItem from '../cartlanding/cartItem.js';
import { checkoutSummary } from '../../scripts/cart-checkout-utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { baseURL } from '../../scripts/common-utils.js';
import { postApiData } from '../../scripts/api-utils.js';

const orderSubmitted = async () => {
  const basketData = sessionStorage.getItem('basketData');
  const basketId = JSON.parse(basketData);
  console.log('basketId', basketId);
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Content-Type': 'Application/json',
    'Authentication-Token': token,
    Accept: 'application/vnd.intershop.order.v1+json',
  });
  const url = `${baseURL}/orders?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrument&Authentication-Token='{{token}}'`;
  const data = {
    basket: basketId.id,
    termsAndConditionsAccepted: true,
  };
  console.log('data', data);
  try {
    const response = await postApiData(
      url,
      JSON.stringify(data),
      defaultHeader,
    );
    if (response) {
      console.log('response', response.data);
      sessionStorage.setItem(
        'orderSubmitDetails',
        JSON.stringify(response.data),
      );
      const userOrderDetails = JSON.parse(
        sessionStorage.getItem('userOrderDetails'),
      );
      if (!userOrderDetails) {
        const orderIdArray = [];
        orderIdArray.push(response.data.data.id);
        sessionStorage.setItem(
          'userOrderDetails',
          JSON.stringify(orderIdArray),
        );
      } else {
        userOrderDetails.push(response.data.data.id);
        sessionStorage.setItem(
          'userOrderDetails',
          JSON.stringify(userOrderDetails),
        );
      }

      return response;
    }
  } catch (error) {
    console.log('error', error);
  }
};

export default async function decorate(block) {
  console.log(' block ');
  
  const params = new URLSearchParams(window.location.search);
  console.log('params', params.get('orderId'));
  if (params.get('orderId')) {
    let orderDetails = JSON.parse(sessionStorage.getItem('orderSubmitDetails'));
    let notes = '';
    orderDetails.data.attributes.forEach((item) => {
      if (item.name === 'GroupShippingNote') {
        notes = item.value;
      }
    });

    if (!orderDetails) {
      const resp = await orderSubmitted();
      if (resp?.status === 'success') {
        orderDetails = JSON.parse(sessionStorage.getItem('orderSubmitDetails'));
        orderDetails.data.attributes.forEach((item) => {
          if (item.name === 'GroupShippingNote') {
            notes = item.value;
          }
        });
        const cartItemsDetails = JSON.parse(
          sessionStorage.getItem('productDetailObject'),
        );
        console.log('cartItemsDetails', cartItemsDetails);
        sessionStorage.setItem(
          'cartItemsDetails',
          JSON.stringify(cartItemsDetails),
        );
        sessionStorage.removeItem('productDetailObject');
        sessionStorage.removeItem('basketData');
        console.log(
          'productDetailObject',
          JSON.parse(sessionStorage.getItem('productDetailObject')),
        );
        console.log('orderDetailssss', orderDetails);
      }
    }
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
    const checkoutSummaryContainer = await checkoutSummary();
    const cartItems = await cartItem();
    const notesValue = () => {
      const notesDiv = div(
        {
          class: '',
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
          orderDetails.data.attributes[0].value,
        ),
      );

      return notesDiv;
    };
    const addressContainer = (address) => {
      const addressDiv = div(
        {
          class:
            'self-stretch p-6 bg-white flex flex-col justify-start items-start gap-6',
        },
        div(
          {
            class: 'self-stretch flex flex-col justify-start items-start gap-3',
          },
          div(
            {
              class:
                'self-stretch flex flex-col justify-start items-start gap-3',
            },
            div(
              {
                class: 'self-stretch inline-flex justify-start items-start',
              },
              div({
                class: 'justify-start text-black text-3xl font-bold leading-7',
              }),
              address,
            ),
            div(
              {
                class:
                  'self-stretch p-3 bg-white outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-start items-start gap-6',
              },
              div(
                {
                  class: 'flex inline-flex flex-col justify-start items-start',
                },
                div(
                  {
                    class:
                      'self-stretch justify-start text-black text-xl font-bold',
                  },
                  'Company Headquarters',
                ),
                div(
                  {
                    class:
                      'self-stretch justify-start text-black text-base font-extralight',
                  },
                  '1459 Main street',
                ),
                div(
                  {
                    class:
                      'self-stretch justify-start text-black text-base font-extralight',
                  },
                  'Suite 205',
                ),
                div(
                  {
                    class:
                      'self-stretch justify-start text-black text-base font-extralight',
                  },
                  'New York, NY 10992',
                ),
              ),
            ),
          ),
        ),
      );
      return addressDiv;
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
                  `${orderDetails.included.commonShippingMethod.STD_GROUND.name}`,
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
                'self-stretch outline outline-1 outline-gray-200 flex flex-col justify-start items-start gap-6',
            },
            addressContainer('Shipping Address'),
          ),
          div(
            {
              class:
                'self-stretch outline outline-1 outline-gray-200 flex flex-col justify-start items-start gap-6',
            },
            addressContainer('Billing Address'),
          ),
          div(
            {
              class:
                'w-96 p-9 bg-white border-l outline outline-1 outline-gray-200 flex flex-col justify-start items-start gap-9',
            },
            checkoutSummaryContainer,
          ),
        ),
      ),
    );

    orderConfirmationWrapper.append(orderDescription);
    orderConfirmationWrapper.append(cartItemsWrapper);
    console.log('queryselector', cartItemsWrapper.querySelectorAll('input'));
    const inputElements = cartItemsWrapper.querySelectorAll('input');
    inputElements.forEach((element) => {
      element.style.border = 'none';
      element.disabled = true;
    });
    const deleteButtondiv = cartItemsWrapper.querySelectorAll('.cart-delete');
    deleteButtondiv.forEach((element) => {
      element.parentElement.remove();
    });
    block.append(orderConfirmationWrapper);
  } else {
    const noPageFound = div({
      class: 'justify-start text-4xl font-bold leading-[48px]',
    }, '404: PAGE NOT FOUND');
    block.append(noPageFound);
  }
}

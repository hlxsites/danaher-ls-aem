import {
  div, h1, p, span, a,
} from '../../scripts/dom-builder.js';
import {
  showPreLoader,
  removePreLoader,
  capitalizeFirstLetter,
} from '../../scripts/common-utils.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

// eslint-disable-next-line
export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const authenticationToken = await getAuthenticationToken();
  let userData = {};
  if (authenticationToken?.status === 'error') {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  userData = JSON.parse(authenticationToken.user_data);

  const dashboardTitle = block.querySelector(
    "[data-aue-prop='dashboardTitle']",
  );

  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const sidebar = div(
    {
      id: 'dashboardSidebar',
      class: 'bg-white gap-5 w-full md:w-[20%] flex flex-col items-center pb-6',
    },
    div(
      { class: 'w-full px-6 flex flex-col items-center gap-5' },
      div({
        class:
          'h-[131px] w-full mt-4 w-full bg-danaherpurple-800 justify-center  flex flex-col items-center',
      }),
      div(
        {
          class:
            'h-[100px] w-[100px] mt-[-75px] border-2 bg-danaherpurple-500 border-white rounded-full flex items-center justify-center',
        },
        p(
          {
            class: 'text-white !text-4xl font-medium leading-[48px]',
          },
          userData?.userData?.firstName?.charAt(0).toUpperCase(),
          userData?.userData?.lastName?.charAt(0).toUpperCase(),
        ),
      ),
      p(
        {
          class: 'text-xl text-black font-medium leading-7',
        },
        `${capitalizeFirstLetter(
          userData?.userData?.firstName,
        )} ${capitalizeFirstLetter(userData?.userData?.lastName)}`,
      ),
      p(
        {
          class: 'text-sm  text-black font-medium leading-tight',
        },
        capitalizeFirstLetter(userData?.customerData?.companyName),
      ),
    ),
    div({
      class: 'w-full bg-gray-100 h-[2px]',
    }),
    div(
      { class: 'w-full px-6 flex flex-col' },
      a(
        {
          href: '/us/en/e-buy/cartlanding?ref=em1-checkout-payment-module',
          class:
            'w-full text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
        },
        'View Cart',
      ),
    ),
    div(
      { class: 'w-full px-6 flex flex-col' },
      a(
        {
          href: '/us/en/products/cart-checkout/orderSubmit?orderId=10000123',
          class:
            'w-full text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6',
        },
        'View Order Submit',
      ),
    ),
  );
  const content = div(
    {
      id: 'dashboardContent',
      class: 'flex p-6 pt-0 w-full flex-col gap-5 md:w-[80%]',
    },
    h1(
      {
        class: 'p-0 m-0',
      },
      dashboardTitle ?? '',
    ),
    div(
      {
        class: 'flex gap-5',
      },
      div(
        {
          class: 'bg-white flex items-center justify-center  gap-6 p-6',
        },
        span({
          class:
            'icon icon-shopping-cart [&_svg>use]:stroke-danaherpurple-500  bg-danaherpurple-25  rounded-full !w-[60px] !h-[60px] p-[18px] transition-transform group-hover:-translate-x-0.5',
        }),
        div(
          {
            class: 'flex flex-col',
          },
          p(
            {
              class: 'text-black !text-4xl font-medium leading-[48px]',
            },
            '14',
          ),
          p(
            {
              class: 'text-black',
            },
            'Open Order',
          ),
        ),
      ),
      div(
        {
          class: 'bg-white flex gap-6 p-6  items-center justify-center ',
        },
        span({
          class:
            'icon  icon-chat [&_svg>use]:stroke-danaherpurple-500 bg-danaherpurple-25 rounded-full  !w-[60px] !h-[60px] p-[18px] transition-transform group-hover:-translate-x-0.5',
        }),
        div(
          {
            class: 'flex flex-col',
          },
          p(
            {
              class: 'text-black !text-4xl font-medium leading-[48px]',
            },
            '25',
          ),
          p(
            {
              class: 'text-black',
            },
            'Requested Quote Item',
          ),
        ),
      ),
    ),
  );
  wrapper.append(sidebar, content);

  decorateIcons(wrapper);
  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  removePreLoader();
}

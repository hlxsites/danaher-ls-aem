import { div, span, a } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const orderId = new URLSearchParams(window.location.search).get('orderId');
  console.log('orderId', orderId);
  const orderDetailsWrapper = div({
    class: 'w-full inline-flex flex-col justify-start items-start gap-5 ',
  });
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
          'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const goBackToOrderStatusLink = a(
    {
      class: 'inline-flex justify-start items-start gap-2',
      href: '/us/en/e-buy/orderstatus',
    },
    div(
      {
        class:
              'w-[24px] h-[24px] relative overflow-hidden cursor-pointer',
      },
      span({
        class:
              'icon icon-arrow-left cursor-pointer pointer-events-none w-[24px] h-[24px] fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
    div({
      class: 'justify-start text-violet-600 text-base font-bold leading-snug',
    }, 'Go Back to Order Status'),
  );

  const orderDetailTitleDiv = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-4',
    },
    div({
      class: 'self-stretch justify-start text-black text-3xl font-normal leading-10',
    }, 'Order Details'),
    div({
      class: 'self-stretch justify-start text-black text-base font-extralight leading-snug',
    }, 'Your order details, all in one place—from items to shipping and everything in between.'),
  );
  const orderDetailsContainer = div({
    class: 'w-full inline-flex gap-5',
  });
  const orderDetail = div({
    class: 'w-[70%] p-6 bg-white border-t border-l border-r border-b border-gray-300 inline-flex flex-col justify-start items-center gap-6',
  });
  const addressDetail = div({
    class: 'w-[30%] border-t border-l border-r border-b border-gray-300 p-5 bg-white inline-flex flex-col justify-start items-start gap-6',
  }, 'Address');

  const orderSummary = div(
    {
      class:
      'self-stretch p-6 bg-violet-50 inline-flex flex-col justify-center items-start gap-5 overflow-hidden',
    },
    div(
      {
        class: 'self-stretch inline-flex justify-start items-start gap-2',
      },
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-start items-start gap-2',
        },
        div(
          {
            class:
            'self-stretch justify-start text-black text-2xl font-normal leading-loose',
          },
          `Order # - ${orderId}`,
        ),
        div(
          {
            class:
            'self-stretch justify-start text-black text-base font-extralight leading-snug',
          },
          'Ordered on 03/28/2022 10:00 am',
        ),
      ),
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-center items-end gap-2',
        },
        div(
          {
            class:
            'self-stretch text-right justify-start text-black text-2xl font-normal leading-loose',
          },
          ' $54,85,000.00',
        ),
        div(
          {
            class:
            'px-2.5 py-2 bg-green-50 inline-flex justify-center items-center',
          },
          div(
            {
              class:
              "text-center justify-start text-green-700 text-xs font-medium font-['Inter'] leading-none",
            },
            'Approved',
          ),
        ),
      ),
    ),
  );
  orderDetail.append(orderSummary);
  orderDetailsContainer.append(orderDetail);
  orderDetailsContainer.append(addressDetail);
  orderDetailsWrapper.append(goBackToOrderStatusLink);
  orderDetailsWrapper.append(orderDetailTitleDiv);
  orderDetailsWrapper.append(orderDetailsContainer);
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper.append(dashboardSideBarContent, orderDetailsWrapper);

  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

import {
  div, span, a,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import { userOrderDetails } from '../dashboard/dashboardutils.js';
import { orderItems } from './orderItems.js';
import { orderSummary } from './orderSummary.js';
import { customerInformation } from './customerInformation.js';

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const orderId = new URLSearchParams(window.location.search).get('orderId');
  const userOrderDetailsResponse = await userOrderDetails(orderId);
  // Assuming `response` is the full JSON object you provided

  const orderDetailsWrapper = div({
    class: 'w-[70%] inline-flex flex-col justify-start items-start gap-5 ',
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
      class: 'self-stretch justify-start text-black font-bold font-normal text-[32px] leading-10',
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
    class: 'w-[30%]',
  });

  const orderItemTitle = div(
    {
      class: 'self-stretch inline-flex justify-start items-start gap-5',
    },
    div({
      class: 'justify-start font-bold text-black text-xl font-normal leading-7',
    }, 'Order Items'),
  );
  const orderItemDisplayContainer = orderItems(userOrderDetailsResponse);
  const orderSummaryContainer = orderSummary(userOrderDetailsResponse);
  const customerInformationContainer = customerInformation(userOrderDetailsResponse);
  orderDetail.append(orderSummaryContainer);
  orderDetail.append(orderItemTitle);
  orderDetail.append(orderItemDisplayContainer);
  orderDetailsContainer.append(orderDetail);
  addressDetail.append(customerInformationContainer);
  orderDetailsContainer.append(addressDetail);
  orderDetailsWrapper.append(goBackToOrderStatusLink);
  orderDetailsWrapper.append(orderDetailTitleDiv);
  orderDetailsWrapper.append(orderDetailsContainer);
  // orderDetailsWrapper.append(orderItemTitle);
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper.append(dashboardSideBarContent, orderDetailsWrapper);

  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

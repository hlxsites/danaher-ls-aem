import {
  div, h1, p, span,
} from '../../scripts/dom-builder.js';
import {
  showPreLoader,
  removePreLoader,
} from '../../scripts/common-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import recentOrders from './recentOrder.js';
import { orderDetails, requestedQuotes } from './dashboardutils.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';

// eslint-disable-next-line
export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const dashboardSideBarContent = await dashboardSidebar();
  const orderDetailResponse = await orderDetails();
  const requestedQuotesResponse = await requestedQuotes();
  // console.log("orderDetailResponse", orderDetailResponse);
  const shippedItems = orderDetailResponse.filter((item) => item.status.toLowerCase() === 'shipped');
  // console.log("cancelledItems", shippedItems );
  const excludedStatuses = ['cancelled', 'shipped'];
  const openOrder = orderDetailResponse.filter(
    (item) => !excludedStatuses.includes(item.status.toLowerCase()),
  );
  // console.log("cancelledItems", openOrder );
  const totalShippedItems = shippedItems.length;
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const dashboardTitle = 'Dashboard';
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
          class: 'w-[310px] h-[118px] bg-white flex items-center justify-center  gap-6 p-6',
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
            openOrder.length === 0 ? 0 : openOrder.length,
          ),
          p(
            {
              class: 'w-[178px] text-black',
            },
            'Open Order',
          ),
        ),
      ),
      openOrder.length !== 0
        ? div(
          {
            class: 'w-[310px] h-[118px] bg-white flex items-center justify-center  gap-6 p-6',
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
              totalShippedItems,
            ),
            p(
              {
                class: 'w-[178px] text-black',
              },
              'Shipped Order',
            ),
          ),
        ) : '',
      div(
        {
          class: 'w-[310px] h-[118px] bg-white flex gap-6 p-6  items-center justify-center ',
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
            requestedQuotesResponse.length === 0 ? 0 : requestedQuotesResponse.length,
          ),
          p(
            {
              class: 'w-[178px] text-black',
            },
            'Requested Quote Item',
          ),
        ),
      ),

      // orderStatus()
    ),
  );
  const contentWrapper = div({
    class: 'w-[70%] self-stretch inline-flex flex-col justify-start items-start gap-5',
  });
  // const orderBlock = await orderStatus();
  const order = await recentOrders();
  contentWrapper.append(content);
  // contentWrapper.append(orderBlock);
  contentWrapper.append(order);
  wrapper.append(dashboardSideBarContent, contentWrapper);

  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

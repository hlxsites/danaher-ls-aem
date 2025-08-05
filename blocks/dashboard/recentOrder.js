import { div, span } from '../../scripts/dom-builder.js';

const recentOrders = () => {
  const recentDetailsContainer = div({
    class: 'flex gap-6 w-full dhls-container',
  });
  const recentOrder = div(
    {
      class: 'self-stretch w-[480px] h-[210px] p-6 bg-white outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex flex-col justify-start items-center gap-4',
    },
    div(
      {
        class: 'self-stretch pr-8 inline-flex justify-start items-center gap-5',
      },
      div({
        class: 'justify-start text-gray-900 text-xl font-medium leading-7',
      }, 'Recent Orders'),
    ),
    div(
      {
        class: 'w-[205px] h-[118px] flex flex-col justify-center items-center gap-2',
      },
      div(
        {
          class: 'w-full  h-[4.5rem] relative overflow-hidden',
        },
        span({
          class:
          'icon icon-shopping-cart w-[200px] h-[3.5rem] [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      ),
      div({
        class: 'w-[205px] h-[20px] text-center justify-start text-gray-900 text-sm font-medium leading-tight',
      }, 'No Recent Orders'),
    ),
  );
  const recenQuotes = div(
    {
      class: 'self-stretch w-[480px] h-[210px] p-6 bg-white outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex flex-col justify-start items-center gap-4',
    },
    div(
      {
        class: 'self-stretch pr-8 inline-flex justify-start items-center gap-5',
      },
      div({
        class: 'justify-start text-gray-900 text-xl font-medium leading-7',
      }, 'Recent Requested Quotes'),
    ),
    div(
      {
        class: 'w-[205px] h-[118px] flex flex-col justify-center items-center gap-2',
      },
      div(
        {
          class: 'w-full  h-[4.5rem] relative overflow-hidden',
        },
        span({
          class:
          'icon icon-chat w-[200px] h-[3.5rem] [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      ),
      div({
        class: 'w-[205px] h-[20px] text-center justify-start text-gray-900 text-sm font-medium leading-tight',
      }, 'No Recent Requested Quotes'),
    ),
  );
  recentDetailsContainer.append(recentOrder);
  recentDetailsContainer.append(recenQuotes);
  return recentDetailsContainer;
};
export default recentOrders;

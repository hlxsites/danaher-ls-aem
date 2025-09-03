import { div, span } from '../../scripts/dom-builder.js';
import { orderDetails, requestedQuotes } from './dashboardutils.js';

const recentOrders = async () => {
  const orderDetailResponse = await orderDetails();
  const requestedQuotesResponse = await requestedQuotes();
  let topRequestedQuote;
  let topRecentOrder;
  if (requestedQuotesResponse?.length > 4) {
    topRequestedQuote = requestedQuotesResponse.slice(0, 4);
  } else {
    topRequestedQuote = requestedQuotesResponse;
  }
  if (orderDetailResponse?.length > 3) {
    topRecentOrder = orderDetailResponse?.slice(0, 3);
  } else {
    topRecentOrder = orderDetailResponse;
  }

  const recentDetailsContainer = div({
    class: 'self-stretch inline-flex justify-start items-start',
  });
  const noOrdersDiv = div(
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
  );

  const topThreeOrdersDiv = (order, po, status, creationDate, orderTotal) => {
    const formattedAmount = parseFloat(orderTotal).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const date = new Date(creationDate);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;
    const formattedWords = status
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    const statusColor = (orderStatus) => {
      if (orderStatus === 'Approved') {
        return {
          text: 'text-center justify-start text-green-700 text-xs font-normal leading-none bg-green-50',
        };
      } if (orderStatus === 'Cancelled') {
        return {
          text: 'text-center justify-start text-xs font-normal leading-none text-red-800 bg-red-100',
        };
      } if (orderStatus === 'Shipped') {
        return {
          text: 'text-center justify-start text-xs font-normal leading-none text-sky-800 bg-sky-50',
        };
      } if (orderStatus === 'Invoiced') {
        return {
          text: 'text-center justify-start text-xs font-normal leading-none text-gray-800 bg-gray-100',
        };
      }
      return {
        text: 'text-center justify-start text-green-700 text-xs font-normal leading-none bg-green-50',
      };
    };
    const statusTextColor = statusColor(status);
    const orderDescriptionDiv = div(
      {
        class:
          'self-stretch py-3 bg-white border-b border-gray-200 inline-flex justify-start items-start',
      },
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-start items-start gap-1',
        },
        div(
          {
            class:
              'self-stretch justify-start text-violet-600 text-sm font-normal leading-tight',
          },
          order,
        ),
        div(
          {
            class: 'self-stretch justify-start',
          },
          span(
            {
              class:
                "text-gray-500 text-xs font-normal font-['TWK_Lausanne_Pan'] leading-none",
            },
            'Order Date: ',
          ),
          span(
            {
              class:
                "text-black text-xs font-normal font-['TWK_Lausanne_Pan'] leading-none",
            },
            formattedDate,
          ),
        ),
        div(
          {
            class: 'self-stretch justify-start',
          },
          span(
            {
              class:
                "text-gray-500 text-xs font-normal font-['TWK_Lausanne_Pan'] leading-none",
            },
            'PO: ',
          ),
          span(
            {
              class:
                "text-black text-xs font-normal font-['TWK_Lausanne_Pan'] leading-none",
            },
            po,
          ),
        ),
      ),
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-start items-end gap-3',
        },
        div(
          {
            class:
              'w-20 px-2.5 py-1 bg-green-50 inline-flex justify-center items-center',
          },
          div(
            {
              class: statusTextColor.text,
            },
            formattedWords,
          ),
        ),
        div(
          {
            class:
              'self-stretch text-right justify-start text-[16px] text-black text-base font-normal leading-snug',
          },
          `$${formattedAmount}`,
        ),
      ),
    );
    return orderDescriptionDiv;
  };

  const noRequestedQuotes = div(
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
  );

  const recentOrder = div(
    {
      class: 'flex-1 flex justify-start items-start gap-6',
    },
    div(
      {
        class: 'flex-1 inline-flex flex-col justify-start items-start gap-4 overflow-hidden',
      },

    ),

  );

  const recentOrderWrapper = div(
    {
      class: 'self-stretch w-[480px] p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center gap-4',
    },
  );
  recentOrder.append(recentOrderWrapper);

  const recentOrderDiv = div(
    {
      class: 'self-stretch inline-flex flex-col justify-start gap-5',
      id: 'recentOrder',
    },
    div({
      class: 'justify-start text-gray-900 text-[20px] font-medium leading-7',
    }, 'Recent Orders'),
  );
  recentOrderWrapper.append(recentOrderDiv);

  if (orderDetailResponse?.length === 0) {
    recentOrderDiv?.append(noOrdersDiv);
  } else {
    topRecentOrder?.forEach((element) => {
      const order = {
        order: element.documentNumber,
        po: '',
        status: element.status,
        creationDate: element.creationDate,
        orderTotal: element.totals.grandTotal.gross.value,
      };

      const orderDiv = topThreeOrdersDiv(
        order.order,
        order.po,
        order.status,
        order.creationDate,
        order.orderTotal,
      );

      recentOrderDiv.append(orderDiv);
    });
  }

  const topQuotesDiv = (quoteNo, creationDate) => {
    const date = new Date(creationDate);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;
    const topRequestedQuoteDiv = div(
      {
        class:
          'self-stretch py-3 bg-white border-b border-gray-200 inline-flex justify-start items-start',
      },
      div(
        {
          class: 'flex-1 inline-flex flex-col justify-start items-start gap-1',
        },
        div(
          {
            class:
              'self-stretch justify-start text-violet-600 text-sm font-normal leading-tight',
          },
          quoteNo,
        ),
        div(
          {
            class: 'self-stretch justify-start',
          },
          span(
            {
              class: 'text-gray-500 text-xs font-normal leading-none',
            },
            'Request Date:  ',
          ),
          span(
            {
              class:
                "text-black text-xs font-normal font-['TWK_Lausanne_Pan'] leading-none",
            },
            formattedDate,
          ),
        ),
      ),
    );
    return topRequestedQuoteDiv;
  };

  const recentQuotes = div(
    {
      class: 'flex-1 flex justify-start items-start gap-6',
    },
    div(
      {
        class: 'flex-1 inline-flex flex-col justify-start items-start gap-4 overflow-hidden',
      },

    ),

  );

  const recentQuotesWrapper = div(
    {
      class: 'self-stretch w-[480px] p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center gap-4',
    },
  );
  recentQuotes.append(recentQuotesWrapper);

  const recentQuoteDiv = div(
    {
      class: 'self-stretch pr-8 inline-flex flex-col justify-start gap-5',
    },
    div({
      class: 'justify-start text-gray-900 text-[20px] font-medium leading-7',
    }, 'Recent Requested Quotes'),
  );
  recentQuotesWrapper.append(recentQuoteDiv);

  if (requestedQuotesResponse?.length === 0) {
    recentQuoteDiv.append(noRequestedQuotes);
  } else {
    topRequestedQuote?.forEach((element) => {
      const quote = {};

      element.attributes?.forEach((item) => {
        if (item.name === 'number') {
          quote.quoteNo = item.value;
        } else if (item.name === 'creationDate') {
          quote.creationDate = item.value;
        }
      });
      const quoteDiv = topQuotesDiv(quote.quoteNo, quote.creationDate);
      recentQuoteDiv.append(quoteDiv);
    });
  }

  recentDetailsContainer.append(recentOrder);
  recentDetailsContainer.append(recentQuotes);
  return recentDetailsContainer;
};
export default recentOrders;

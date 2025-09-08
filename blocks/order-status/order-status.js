import {
  div,
  span,
  table,
  tr,
  tbody,
  a,
} from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { baseURL, showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import { getApiData } from '../../scripts/api-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';

// let totalOrdersPlaced = '';
const orderDetails = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Authentication-Token': token,
    Accept: 'application/vnd.intershop.order.v1+json',
  });
  const url = `${baseURL}/orders?include=lineItems`;

  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      const orderDetailResponse = response.data;
      if (response.data === 'Unauthorized! please try again.') window.location.href = '/us/en/e-buy/login';
      return orderDetailResponse.data;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
  }
};

const dynamicTableContent = async (orderDetailsResponse) => {
  const tableRow = (orderId, order, po, status, creationDate, orderTotal) => {
    const date = new Date(creationDate);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;
    const formattedAmount = parseFloat(orderTotal).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedWords = status
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    const statusColor = (orderStatus) => {
      if (orderStatus === 'Approved') {
        return {
          text: 'self-stretch text-center justify-start text-green-700 bg-green-50 text-medium font-[400] leading-tight',
        };
      } if (orderStatus === 'Cancelled') {
        return {
          text: 'self-stretch text-center justify-start text-red-800 bg-red-100 text-medium font-[400] leading-tight',
        };
      } if (orderStatus === 'Shipped') {
        return {
          text: 'self-stretch text-center justify-start text-sky-800 bg-sky-50 text-medium font-[400] leading-tight',
        };
      } if (orderStatus === 'Invoiced') {
        return {
          text: 'self-stretch text-center justify-start text-gray-800 bg-gray-100 text-medium font-[400] leading-tight',
        };
      }
      return {
        text: 'self-stretch text-center justify-start text-green-700 bg-green-50 text-medium font-[400] leading-tight',
      };
    };
    const statusTextColor = statusColor(status);
    const row = a(
      {
        class: 'inline-flex justify-start border-b border-gray-200 gap-1',
        href: `/us/en/e-buy/orderdetails?orderId=${orderId}`,
      },
      div(
        {
          class:
            'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
        },
        div(
          {
            class:
              'self-stretch justify-start text-left text-danaherpurple-500 text-medium font-[400] leading-tight',
          },
          order,
        ),
      ),

      div(
        {
          class:
            'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
        },
        div(
          {
            class:
              'self-stretch justify-start text-gray-900 text-medium font-[400] leading-tight',
          },
          formattedDate,
        ),
      ),
      div(
        {
          class:
            'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
        },
        div(
          {
            class:
              'self-stretch justify-start text-gray-900 text-medium font-[400] leading-tight',
          },
          po,
        ),
      ),
      div(
        {
          class:
            'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-end',
        },
        div(
          {
            class:
              'self-stretch text-right justify-start text-gray-900 text-medium font-[400] leading-tight',
          },
          `$${formattedAmount}`,
        ),
      ),
      div(
        {
          class: 'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-center items-center',
        },
        div(
          {
            class: statusTextColor.text,
          },
          formattedWords,
        ),
      ),
    );
    return row;
  };
  let tableRows = [];
  if (orderDetailsResponse?.length > 0) {
    tableRows = orderDetailsResponse?.map(
      (element) => {
        const order = {
          order: element.documentNumber,
          orderId: element.id,
          po: '',
          status: element.status,
          creationDate: element.creationDate,
          orderTotal: element.totals.grandTotal.gross.value,
        };
        return tableRow(
          order.orderId,
          order.order,
          order.po,
          order.status,
          order.creationDate,
          order.orderTotal,
        );
      },
    );
  }

  const tableDataRows = tbody({ class: 'w-[930px] flex flex-col', id: 'tableRow' }, ...tableRows);
  return tableDataRows;
};

const noContentDiv = a(
  {
    class: 'inline-flex justify-start border-b border-gray-200 gap-1',
    // href: `/us/en/e-buy/orderdetails?orderId=${orderId}`,
  },
  div(
    {
      class:
        'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
    },
    div(
      {
        class:
          'self-stretch justify-start text-left text-danaherpurple-500 text-medium font-[400] leading-tight',
      },

    ),
  ),

  div(
    {
      class:
        'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
    },
    div(
      {
        class:
          'self-stretch justify-start text-gray-900 text-medium font-[400] leading-tight',
      },

    ),
  ),
  div(
    {
      class:
        'w-[186.4px] h-[46px] self-stretch inline-flex flex-col justify-start items-start',
    },
    div(
      {
        class:
          'self-stretch justify-start text-black text-medium font-[400] leading-tight',
      },
      'No Records Found',
    ),
  ),
  div(
    {
      class:
        'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-end',
    },
    div(
      {
        class:
          'self-stretch text-right justify-start text-gray-900 text-medium font-[400] leading-tight',
      },

    ),
  ),
  div(
    {
      class: 'w-[186.4px] h-[46px] self-stretch p-3 inline-flex flex-col justify-center items-center',
    },
    div(
      {
        class: 'self-stretch text-center justify-start text-medium font-[400] leading-tight',
      },

    ),
  ),
);

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const dashboardSideBarContent = await dashboardSidebar();
  const orderStatusTitle = div(
    {
      class: 'ml-[23px] self-stretch inline-flex flex-col justify-start items-start gap-4',
    },
    div({
      class: 'self-stretch justify-start text-black text-3xl font-medium leading-10',
    }, 'Order Status'),
    div({
      class: 'self-stretch justify-start text-black text-base font-extralight leading-snug',
    }, 'Track your order every step of the way see real-time updates and delivery details here.'),
  );
  const orderDetailsResponse = await orderDetails();
  const orderWrapper = div({
    class:
      'w-full ml-[20px] p-6 bg-white border-t border-l border-r border-b border-gray-300 inline-flex flex-col justify-start ',
    id: 'orderWrapper',
  });
  const orderDesc = div(
    {
      class: ' py-3 inline-flex justify-between items-center',
    },
    div(
      {
        class: 'pr-8 inline-flex justify-start items-center gap-5',
      },
      div(
        {
          class:
            'justify-start text-gray-900 text-2xl font-medium leading-loose',
        },
        'Orders',
      ),
      div(
        {
          class:
            'justify-between text-gray-700 text-sm font-normal leading-tight',
        },
        'New orders may take up to 72 hours to display',
      ),
    ),
  );
  const tableData = (name) => {
    const row = div(
      {
        class:
          'w-[186.4px] h-[46px] self-stretch p-3 border-b-2 border-gray-200 inline-flex justify-start items-center gap-1',
      },
      div(
        {
          class: 'justify-start text-right text-black text-base font-bold leading-snug',
        },
        name,
      ),
      div(
        {
          class: 'inline-flex flex-col justify-center items-start',
        },
        span({
          class: 'w-[10px] h-[10px] icon icon-chevron-up [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
        span({
          class: 'w-[10px] h-[10px] icon icon-chevron-down [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      ),
    );
    return row;
  };

  const orderTable = table(
    {
      class:
        'w-full border border-gray-200 h-[500px] inline-flex flex-col justify-start items-start max-h-[642px] pr-[10px] overflow-x-hidden overflow-y-auto gap-6 pt-0 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500',
      id: 'orderTable',
    },
    tr(
      {
        class: 'w-[930px] flex',
      },
      tableData('Order #'),
      tableData('Order Date'),
      tableData('PO'),
      tableData('Order Total'),
      tableData('Status'),
    ),

  );
  orderWrapper.append(orderDesc);
  if (orderDetailsResponse?.length !== 0) {
    const orderRows = await dynamicTableContent(orderDetailsResponse);
    orderTable.append(orderRows);
  } else {
    orderTable.append(noContentDiv);
  }
  orderWrapper.append(orderTable);

  const orderStatusPageWrapper = div({
    class: 'w-[80%] inline-flex flex-col gap-4',
  });
  orderStatusPageWrapper.append(orderStatusTitle);
  orderStatusPageWrapper.append(orderWrapper);
  wrapper.append(dashboardSideBarContent, orderStatusPageWrapper);

  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);

  removePreLoader();
}

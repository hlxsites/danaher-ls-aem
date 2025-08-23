import {
  div,
  span,
  table,
  tr,
  tbody,
} from '../../scripts/dom-builder.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
import { baseURL, showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import { getApiData } from '../../scripts/api-utils.js';
import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

let totalOrdersPlaced = '';
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
  const url = `${baseURL}orders?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems_discounts,lineItems,payments,payments_paymentMethod,payments_paymentInstrument&Authentication-Token=${token}`;

  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      const orderDetailResponse = response.data;
      totalOrdersPlaced = orderDetailResponse.data.length;
      if (totalOrdersPlaced < 10) {
        return orderDetailResponse.data;
      }

      const orders = [];
      for (let i = 0; i < 10; i + 1) {
        orders.push(orderDetailResponse.data[i]);
      }
      return orders;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    return { status: 'error', data: 'Something went wrong fetching order details.' };
  }
};

export const dynamicTableContent = async (orderDetailsResponse) => {
  const tableRow = (order, po, status, creationDate, orderTotal) => {
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
    const row = div(
      {
        class: 'inline-flex justify-start border-b border-gray-200 gap-1',
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
  const tableRows = orderDetailsResponse.map(
    (element) => {
      const order = {
        order: element.documentNumber,
        po: '',
        status: element.status,
        creationDate: element.creationDate,
        orderTotal: element.totals.grandTotal.gross.value,
      };
      return tableRow(order.order, order.po, order.status, order.creationDate, order.orderTotal);
    },
  );

  const tableDataRows = tbody({ class: 'w-[930px] flex flex-col', id: 'tableRow' }, ...tableRows);
  return tableDataRows;
};

export const decorate = async (block) => {
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
  // const days = ['Period', 'Last 90 days', 'This month', 'this Year', 'Last Year'];
  // const status = ['Status', 'All', 'Approved', 'Cancelled',
  // 'Invoiced', 'Shipped', 'Submitted', 'New'];
  const orderDetailsResponse = await orderDetails();
  // const dropDown = (day) => {
  //   const selectElement = document.createElement('select');
  //   selectElement.classList.add(
  //     'bg-gray-100',
  //     'border',
  //     'border-gray-300',
  //     'p-[0.5rem]',
  //   );
  //   day.forEach((day, index) => {
  //     const option = document.createElement('option');
  //     option.value = day.toLowerCase().
  // replace(/\s+/g, '-'); // e.g., "Last 7 days" -> "last-7-days"
  //     option.textContent = day;
  //     if (index === 0) {
  //       option.selected = true; // "All Dates" selected by default
  //     }
  //     selectElement.append(option);
  //   });
  //   return selectElement;
  // };
  // const buildSearchWithIcon = (
  //   lable,
  //   field,
  //   inputType,
  //   inputName,
  //   autoCmplte,
  //   required,
  //   dtName,
  //   placeholder,
  // ) => {
  //   // const dataRequired = required ? span({ class: 'text-red-500' }, '*') : '';
  //   const searchElement = div(
  //     {
  //       class: 'space-y-2 field-wrapper relative',
  //       id: 'searchWithIcon',
  //     },
  //     div(
  //       {
  //         class:
  //           'search-with-icon inline-flex justify-between relative pt-[5px] pb-[3px] ',
  //       },
  //       span({
  //         class: 'icon icon-search fill-gray-400 absolute mt-2 ml-2',
  //       }),
  //       input({
  //         type: inputType,
  //         name: inputName,
  //         id: inputName,
  //         placeholder,
  //         'data-required': required,
  //         class:
  //           'searchbox min-w-[415px] h-10 rounded-md pl-9 text-base
  // block px-8 py-5 text-gray-600 font-extralight
  //   border-t border-l border-r border-b border-gray-300 ',
  //         'aria-label': dtName,
  //       }),
  //       div(
  //         {
  //           class: 'absolute mr-[8px] right-0',
  //         },
  //         span({
  //           class: 'hidden searchbox-clear icon icon-close fill-gray-400 ',
  //         }),
  //       ),
  //     ),
  //   );
  //   decorateIcons(searchElement);

  //   // searchElement.addEventListener("input", handleSearchInput);
  //   return searchElement;
  // };
  const orderWrapper = div({
    class:
      'w-[980px] ml-[20px] p-6 bg-white border-t border-l border-r border-b border-gray-300 inline-flex flex-col justify-start ',
    id: 'orderWrapper',
  });
  // const searchProduct = div(
  //   {
  //     class:
  //       'w-full pb-3 gap-5 inline-flex flex-col justify-center items-start',
  //   },
  //   div(
  //     {
  //       class: 'flex flex-col justify-start items-start',
  //     },
  //     div(
  //       {
  //         class: 'flex flex-col justify-end items-start gap-4',
  //       },
  //       div(
  //         {
  //           class:
  //             'w-80 justify-start text-gray-700 text-base font-bold leading-snug',
  //         },
  //         'Search for a product',
  //       ),
  //       div(
  //         {
  //           class: 'inline-flex justify-center items-center gap-4',
  //         },
  //         buildSearchWithIcon(
  //           '',
  //           '',
  //           'text',
  //           'searchInput',
  //           false,
  //           true,
  //           'cart-search',
  //           'Search by PO # and order #',
  //         ),
  //         div(
  //           {
  //             class: '',
  //           },
  //           button(
  //             {
  //               class:
  //                 'w-[200px] btn btn-lg btn-primary-purple m-0 rounded-full',
  //             },
  //             'Search',
  //           ),
  //         ),
  //       ),
  //       div(
  //         {
  //           class: 'flex gap-4',
  //         },
  //         dropDown(days),
  //         dropDown(status),
  //       ),
  //     ),
  //   ),
  // );
  // const downloadSvg = div(
  //   {
  //     class: 'sidePanel-content flex justify-start items-center',
  //   },
  //   span({
  //     class: 'icon icon-Download [&_svg>use]:stroke-danaherpurple-500
  // !w-[60px] !h-[60px] p-[18px] [&_svg>use]:hover:stroke-danaherpurple-800',
  //   }),
  //   div(
  //     {
  //       class:
  //         'bg-white justify-start text-danaherpurple-500 text-xs font-medium leading-none',
  //       id: 'download',
  //     },
  //     'Download',
  //   ),
  // );
  // decorateIcons(downloadSvg);
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
    // div(
    //   {
    //     class:
    //       'w-28 pl-2 pr-2.5 py-1.5 rounded shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]
    //  flex justify-center items-center gap-2 overflow-hidden',
    //   },
    //   downloadSvg,
    // ),
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
        'w-[932px] border border-gray-200 inline-flex flex-col justify-start items-start',
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

  // orderWrapper.append(searchProduct);
  orderWrapper.append(orderDesc);
  // orderWrapper.append(orderTable);
  const orderRows = await dynamicTableContent(orderDetailsResponse);
  orderTable.append(orderRows);
  orderWrapper.append(orderTable);
  // const paginationWrapper = div({
  //   class: '',
  // });
  // const pagination = renderPagination(totalOrdersPlaced, paginationWrapper);
  // paginationWrapper.append(pagination);
  // orderWrapper.append(paginationWrapper);
  wrapper.append(dashboardSideBarContent, orderWrapper);

  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
};

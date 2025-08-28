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
  const url = `${baseURL}orders?include=lineItems`;

  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      const orderDetailResponse = response.data;
      if(response.data === "Unauthorized! please try again.")
        window.location.href = '/us/en/e-buy/login';
      // totalOrdersPlaced = orderDetailResponse.data.length;
      // if (totalOrdersPlaced < 10) {
      return orderDetailResponse.data;
      // }

      // const orders = [];
      // for (let i = 0; i < 10; i + 1) {
      //   orders.push(orderDetailResponse.data[i]);
      // }
      // return orders;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
    // return { status: 'error', data: 'Something went wrong fetching order details.' };
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
  const tableRows = orderDetailsResponse.map(
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

  const tableDataRows = tbody({ class: 'w-[930px] flex flex-col', id: 'tableRow' }, ...tableRows);
  return tableDataRows;
};

const noContentDiv =  a(
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
          "No Records Found"
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
            class: "self-stretch text-center justify-start text-medium font-[400] leading-tight",
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
      'w-full ml-[20px] p-6 bg-white border-t border-l border-r border-b border-gray-300 inline-flex flex-col justify-start ',
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

  // orderWrapper.append(searchProduct);
  orderWrapper.append(orderDesc);
  // orderWrapper.append(orderTable);
  // let orderRows;
  // async function renderNextBatch() {
  //   const nextBatch = allOrders.slice(currentIndex, currentIndex + pageSize);
  if(orderDetailsResponse?.length !== 0){
    const orderRows = await dynamicTableContent(orderDetailsResponse);
    orderTable.append(orderRows);
    
  }
  else {
    orderTable.append(noContentDiv);
  }
  orderWrapper.append(orderTable);
  
  //   currentIndex += pageSize;

  //   // Hide button if all data has been loaded
  //   if (currentIndex >= allOrders.length) {
  //     loadMoreBtn.style.display = 'none';
  //   }
  // }
  // renderNextBatch();
  // window.addEventListener('scroll', () => {
  //   const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  //   if (nearBottom) {
  //     renderNextBatch();
  //   }
  // });

  //   const observer = new MutationObserver(() => {
  //   const scrollContainer = document.getElementById('orderTable');
  //   if (scrollContainer) {
  //     scrollContainer.addEventListener('scroll', () => {
  //       const nearBottom =
  //         scrollContainer.scrollTop
  //  + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 100;

  //       if (nearBottom) {
  //         renderNextBatch();
  //       }
  //     });

  //     // Stop observing once we’ve found and attached the listener
  //     observer.disconnect();
  //   }
  // });

  // Start observing the document body (or another parent node)
  // observer.observe(document.body, { childList: true, subtree: true });

  // orderTable.append(orderRows);
  // orderWrapper.append(orderTable);
  // const paginationWrapper = div({
  //   class: '',
  // });
  // const pagination = renderPagination(totalOrdersPlaced, paginationWrapper);
  // paginationWrapper.append(pagination);
  // orderWrapper.append(paginationWrapper);
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

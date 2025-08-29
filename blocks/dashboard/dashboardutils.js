// import { div, span } from '../../scripts/dom-builder.js';
// import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getAuthenticationToken } from '../../scripts/token-utils.js';
// import { dynamicTableContent } from './orderStatus.js';
import { baseURL } from '../../scripts/common-utils.js';
import { getApiData } from '../../scripts/api-utils.js';

// const currentPage = 1;
// export function renderPagination(totalProducts, paginationWrapper) {
//   paginationWrapper.innerHTML = '';
//   //   const itemsPerPage = isGridView ? GRID_ITEMS_PER_PAGE : LIST_ITEMS_PER_PAGE;
//   const totalPages = Math.ceil(totalProducts / 10);
//   if (totalPages <= 1) {
//     paginationWrapper.style.display = 'none';
//     return;
//   }

//   paginationWrapper.style.display = 'flex';

//   const localPaginationContainer = div({
//     class: 'self-stretch h-9 relative w-full',
//   });
//   const grayLine = div({
//     class: 'w-full h-px absolute left-0 top-0 bg-gray-200 z-0',
//   });
//   const contentWrapper = div({
//     class:
//       'w-full left-0 top-0 absolute flex justify-between items-center px-4',
//   });

//   const getUrlValues = async (newUrl, page) => {
//     showPreLoader();
//     const tbody = document.querySelector('tbody');
//     tbody.remove();
//     const orderTableContainer = document.getElementById('orderTable');
//     const orderWrapperContainer = document.getElementById('orderWrapper');
//     const url = newUrl.search;
//     // const urlParams = new URLSearchParams(url);
//     newUrl.searchParams.set('page', page);
//     window.history.replaceState({}, '', newUrl);
//     const authenticationToken = await getAuthenticationToken();
//     if (!authenticationToken) {
//       return { status: 'error', data: 'Unauthorized access.' };
//     }
//     const token = authenticationToken.access_token;
//     const defaultHeader = new Headers({
//       'Authentication-Token': token,
//       Accept: 'application/vnd.intershop.order.v1+json',
//     });
//     const apiUrl = `${baseURL}orders?page[limit]=10&offset=${11}&
// include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,
// lineItems_discounts,lineItems,payments,payments_paymentMethod,
// payments_paymentInstrument&Authentication-Token=${token}`;
//     const response = await getApiData(apiUrl, defaultHeader);
//     if (response) {
//       const orderDetailResponse = response.data;
//       const dynamicTableContentt = await dynamicTableContent(orderDetailResponse.data);
//       orderTableContainer.append(dynamicTableContentt);
//       const pageWrapper = div({
//         class: '',
//       });
//       const pagination = renderPagination(17, pageWrapper);
//       pageWrapper.append(pagination);
//       orderWrapperContainer.append(pageWrapper);
//       removePreLoader();
//     } else {
//       console.log('inside else');
//     }
//   };
//   // Previous Button
//   const prevEnabled = currentPage > 1;
//   const prevButton = div({
//     'data-direction': 'Previous',
//     'data-state': prevEnabled ? 'Default' : 'Disabled',
//     class: 'inline-flex flex-col justify-start items-start',
//   });
//   prevButton.append(
//     div({ class: 'self-stretch h-0.5 bg-transparent' }),
//     div(
//       {
//         class: `self-stretch pr-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
//           prevEnabled ? 'pointer' : 'not-allowed'
//         } z-10`,
//       },
//       div(
//         { class: 'w-5 h-5 relative overflow-hidden' },
//         span({
//           class: `icon icon-arrow-left w-5 h-5 absolute fill-current ${
//             prevEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
//           } [&_svg>use]:stroke-current`,
//         }),
//       ),
//       div(
//         {
//           class: `justify-start text-${
//             prevEnabled ? 'danaherpurple-500' : 'gray-400'
//           } text-sm font-medium leading-5`,
//         },
//         'Previous',
//       ),
//     ),
//   );
//   decorateIcons(prevButton);
//   prevButton.addEventListener('click', () => {
//     if (currentPage > 1) {
//       currentPage -= 1;
//       const newUrl = new URL(window.location);
//       getUrlValues(newUrl, currentPage);
//     }
//   });

//   // Page Numbers
//   const pageNumbersContainer = div({
//     class: 'flex justify-center items-start gap-2 z-10 md:flex',
//   });
//   let startPage = 1;
//   let endPage = totalPages;

//   if (totalPages >= 5) {
//     if (currentPage <= 3) {
//       startPage = 1;
//       endPage = currentPage + 2;
//     } else if (currentPage >= totalPages - 2) {
//       startPage = currentPage - 2;
//       endPage = totalPages;
//     } else {
//       startPage = currentPage - 2;
//       endPage = currentPage + 2;
//     }
//   }

//   // Helper function to create page number buttons
//   const createPageNumber = (page) => {
//     const pageNumber = div({
//       'data-current': currentPage === page ? 'True' : 'False',
//       'data-state': 'Default',
//       class: 'inline-flex flex-col justify-start items-start',
//     });
//     pageNumber.append(
//       div({
//         class: `self-stretch h-0.5 ${
//           currentPage === page ? 'bg-danaherpurple-500' : 'bg-transparent'
//         }`,
//       }),
//       div(
//         {
//           class:
//             'self-stretch px-4 pt-4 inline-flex justify-center items-start cursor-pointer',
//         },
//         div(
//           {
//             class: `text-center justify-start text-${
//               currentPage === page ? 'danaherpurple-500' : 'gray-700'
//             } text-sm font-medium leading-tight`,
//           },
//           page.toString(),
//         ),
//       ),
//     );
//     pageNumber.addEventListener('click', () => {
//       currentPage = page;
//       const newUrl = new URL(window.location);
//       getUrlValues(newUrl, page);
//     });
//     return pageNumber;
//   };

//   if (startPage > 1) {
//     pageNumbersContainer.append(createPageNumber(1));
//     if (startPage > 2) {
//       pageNumbersContainer.append(
//         div(
//           {
//             class: 'inline-flex flex-col justify-start items-start',
//           },
//           div({ class: 'self-stretch h-0.5 bg-transparent' }),
//           div(
//             {
//               class:
//                 'self-stretch px-4 pt-4 inline-flex justify-center items-start',
//             },
//             div(
//               {
//                 class:
//                   'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
//               },
//               '...',
//             ),
//           ),
//         ),
//       );
//     }
//   }
//   for (let i = startPage; i <= endPage; i += 1) {
//     pageNumbersContainer.append(createPageNumber(i));
//   }

//   if (endPage < totalPages - 1) {
//     pageNumbersContainer.append(
//       div(
//         {
//           class: 'inline-flex flex-col justify-start items-start',
//         },
//         div({ class: 'self-stretch h-0.5 bg-transparent' }),
//         div(
//           {
//             class:
//               'self-stretch px-4 pt-4 inline-flex justify-center items-start',
//           },
//           div(
//             {
//               class:
//                 'text-center justify-start text-gray-700 text-sm font-medium leading-tight',
//             },
//             '...',
//           ),
//         ),
//       ),
//     );
//   }

//   if (endPage < totalPages) {
//     pageNumbersContainer.append(createPageNumber(totalPages));
//   }

//   // Next Button
//   const nextEnabled = currentPage < totalPages;
//   const nextButton = div({
//     'data-direction': 'Next',
//     'data-state': nextEnabled ? 'Default' : 'Disabled',
//     class: 'inline-flex flex-col justify-start items-start',
//   });
//   nextButton.append(
//     div({ class: 'self-stretch h-0.5 bg-transparent' }),
//     div(
//       {
//         class: `self-stretch pl-1 pt-4 inline-flex justify-start items-center gap-3 cursor-${
//           nextEnabled ? 'pointer' : 'not-allowed'
//         } z-10`,
//       },
//       div(
//         {
//           class: `justify-start text-${
//             nextEnabled ? 'danaherpurple-500' : 'gray-400'
//           } text-sm font-medium leading-5`,
//         },
//         'Next',
//       ),
//       div(
//         { class: 'w-5 h-5 relative overflow-hidden' },
//         span({
//           class: `icon icon-arrow-right w-5 h-5 absolute fill-current ${
//             nextEnabled ? 'text-danaherpurple-500' : 'text-gray-400'
//           } [&_svg>use]:stroke-current`,
//         }),
//       ),
//     ),
//   );
//   decorateIcons(nextButton);
//   nextButton.addEventListener('click', () => {
//     if (currentPage < totalPages) {
//       currentPage += 1;
//       const newUrl = new URL(window.location);
//       getUrlValues(newUrl, currentPage);
//     }
//   });

//   contentWrapper.append(prevButton, pageNumbersContainer, nextButton);
//   localPaginationContainer.append(grayLine, contentWrapper);
//   return localPaginationContainer;
// }

export const orderDetails = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    // window.location.href = '/us/en/e-buy/login';
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
      const orderDetailResponse = response.data.data;
      return orderDetailResponse;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
    // return { status: 'error', data: 'Something went wrong fetching order details.' };
  }
};

export const requestedQuotes = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Authentication-Token': token,
    // Accept: 'application/vnd.intershop.order.v1+json',
  });
  const basketDataFromSession = JSON.parse(sessionStorage.getItem('basketData'));
  let userId;
  let customerNo;
  if (basketDataFromSession) {
    userId = basketDataFromSession.data.data.buyer.accountID;
    customerNo = basketDataFromSession.data.data.buyer.customerNo;
  } else {
    window.location.href = '/us/en/e-buy/login';
  }
  const url = `${baseURL}/customers/${customerNo}/users/${userId}/quoterequests?attrs=number,name,lineItems,creationDate,validFromDate,validToDate,rejected`;

  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      if (response.data === 'Unauthorized! please try again.') {
        window.location.href = '/us/en/e-buy/login';
      }
      const quotesResponse = response.data.elements;
      return quotesResponse;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
  }
};

export const userOrderDetails = async (orderId) => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    // window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Authentication-Token': token,
    Accept: 'application/vnd.intershop.order.v1+json',
  });
  const url = `${baseURL}orders/${orderId}?include=invoiceToAddress,commonShipToAddress,lineItems`;

  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      const userOrderDetailResponse = response.data;
      return userOrderDetailResponse;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
    // return { status: 'error', data: 'Something went wrong fetching order details.' };
  }
};

export const requestedQuotesDetails = async (quoteId) => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: 'error', data: 'Unauthorized access.' };
  }
  const token = authenticationToken.access_token;
  const defaultHeader = new Headers({
    'Authentication-Token': token,
    // Accept: 'application/vnd.intershop.order.v1+json',
  });
  const basketDataFromSession = JSON.parse(sessionStorage.getItem('basketData'));
  let userId;
  let customerNo;
  if (basketDataFromSession) {
    userId = basketDataFromSession.data.data.buyer.accountID;
    customerNo = basketDataFromSession.data.data.buyer.customerNo;
  } else {
    window.location.href = '/us/en/e-buy/login';
  }
  const url = `${baseURL}/rfqcart/${quoteId}`
  try {
    const response = await getApiData(url, defaultHeader);
    if (response) {
      if (response.data === 'Unauthorized! please try again.') {
        window.location.href = '/us/en/e-buy/login';
      }
      const quotesResponse = response.data;
      return quotesResponse;
    }
    return { status: 'error', data: 'No response data.' };
  } catch (error) {
    window.location.href = '/us/en/e-buy/login';
    return { status: 'error', data: 'Exception occurred, redirecting.' };
  }
};

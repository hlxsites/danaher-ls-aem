import dashboardSidebar from '../dashboardSideBar/dashboardSideBar.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import {
  div,
  table,
  tbody,
  tr,
  span,
  a,
  button,
} from '../../scripts/dom-builder.js';
import {
  approvedQuotes,
  approvedQuotesDetails,
} from '../dashboard/dashboardutils.js';

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  document.querySelector('main').style = 'background: #f4f4f4';
  const basketDataFromSession = JSON.parse(localStorage.getItem('basketData'));
  if (basketDataFromSession?.data?.data?.buyer === undefined) {
    window.location.href = window.EbuyConfig.loginPageUrl;
  }
  const customerName = `${basketDataFromSession?.data?.data?.buyer?.firstName} ${basketDataFromSession?.data?.data?.buyer?.lastName}`;
  const userId = basketDataFromSession?.data?.data?.buyer?.accountID;
  const approvedQuotesResponse = await approvedQuotes();
  const approvedQuoteWrapper = div({
    class:
      'w-[70%] self-stretch inline-flex flex-col justify-start items-start gap-5',
  });
  const approvedquoteTitleDiv = div(
    {
      class: 'self-stretch p-6 flex flex-col justify-start items-start gap-4',
    },
    div(
      {
        class:
          'self-stretch justify-start text-black text-3xl font-normal leading-10',
      },
      'Approved Quote',
    ),
    div(
      {
        class:
          'self-stretch justify-start text-black text-base font-extralight leading-snug',
      },
      'Track approved quotes effortlessly—everything you need, right here.',
    ),
  );
  const wrapper = div({
    id: 'dashboardWrapper',
    class:
      'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
  });
  const quoteWrapper = div({
    class:
      'w-[980px] ml-[20px] p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center',
    id: 'orderWrapper',
  });

  const dynamicQuoteDetail = (approvedQuotesDetailsResponse) => {
    const tableHeader = (name) => div(
      {
        class:
          'w-[175px] h-[46px] self-stretch p-3 inline-flex justify-start items-center gap-1',
      },
      div(
        {
          class: 'justify-start text-black text-base font-bold leading-snug',
        },
        name,
      ),
    );
    const quoteDetail = div(
      {
        class:
          'mx-w-[930px] h-96 p-6 bg-gray-50 inline-flex flex-col justify-start items-start gap-6',
        id: `${approvedQuotesDetailsResponse.id}`,
      },
      div(
        {
          class:
            'self-stretch bg-white outline outline-1 outline-gray-200 flex flex-col justify-start items-start gap-6',
        },
        div(
          {
            class:
              'self-stretch p-5 bg-white flex flex-col justify-start items-start gap-6',
          },
          div(
            {
              class:
                'self-stretch flex flex-col justify-start items-start gap-3',
            },
            div(
              {
                class:
                  'self-stretch flex flex-col justify-start items-start gap-3',
              },
              div(
                {
                  class:
                    'self-stretch h-10 border-b-2 border-dashed border-gray-300 flex flex-col justify-start items-start gap-2.5',
                },
                div(
                  {
                    class:
                      'self-stretch inline-flex justify-start items-start gap-5',
                  },
                  div(
                    {
                      class:
                        'justify-start text-black text-base font-bold leading-snug',
                    },
                    'Contact Information',
                  ),
                ),
              ),
              div(
                {
                  class:
                    'self-stretch inline-flex justify-start items-start gap-3',
                },
                div(
                  {
                    class:
                      'w-[272.67px] flex-1 inline-flex flex-col justify-start items-start',
                  },
                  div(
                    {
                      class:
                        'self-stretch justify-start text-black text-sm font-normal leading-tight',
                    },
                    'Name',
                  ),
                  div(
                    {
                      class:
                        'self-stretch justify-start text-black text-base font-bold leading-snug',
                    },
                    customerName,
                  ),
                ),
                div(
                  {
                    class:
                      'w-[272.67px] flex-1 inline-flex flex-col justify-start items-start leading-tight',
                  },
                  div(
                    {
                      class:
                        'self-stretch justify-start text-black text-sm font-normal',
                    },
                    'Email',
                  ),
                  div(
                    {
                      class:
                        'self-stretch justify-start text-black text-base font-bold leading-snug',
                    },
                    userId,
                  ),
                ),
                div(
                  {
                    class:
                      'w-[272.67px] flex-1 inline-flex flex-col justify-start items-start leading-tight',
                  },
                  div(
                    {
                      class:
                        'self-stretch justify-start text-black text-sm font-normal',
                    },
                    'Contact Number',
                  ),
                  div(
                    {
                      class:
                        'self-stretch justify-start text-black text-base font-bold leading-snug',
                    },
                    '-',
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
    const quoteDetailTable = div(
      {
        class:
          'self-stretch bg-white border border-[1px] border-gray-300 inline-flex flex-col justify-start items-start',
      },
      tr(
        {
          class: 'self-stretch bg-white border-b-2 border-gray-200',
        },
        tableHeader('SKU'),
        tableHeader('Name'),
        tableHeader('UOM'),
        tableHeader('QTY'),
        tableHeader('Unit Price'),
      ),
    );

    const dynamicQuoteDetailContent = (productSKU, quantity, singlePrice) => {
      const detailedRow = div(
        {
          class: 'flex-1 inline-flex justify-start items-start',
        },
        div(
          {
            class:
              'w-[176.4px] self-stretch p-3 border-b border-gray-200 flex flex-col justify-start items-start',
          },
          a(
            {
              href: `/us/en/products/sku/${productSKU}`,
              class:
                'self-stretch justify-start text-danaherpurple-500 text-sm font-normal leading-tight',
            },
            `${productSKU}`,
          ),
        ),
        div(
          {
            class:
              'w-[176.4px] self-stretch p-3 border-b border-gray-200 flex flex-col justify-start items-start',
          },
          div(
            {
              class:
                'self-stretch justify-start text-gray-900 text-sm font-normal leading-tight',
            },
            'DMi1 for Core Cell Culture Test',
            // `${item.description}`,
          ),
        ),
        div(
          {
            class:
              'w-[176.4px] self-stretch p-3 border-b border-gray-200 flex flex-col justify-start items-start',
          },
          div(
            {
              class:
                'self-stretch justify-start text-gray-900 text-sm font-normal leading-tight',
            },
            'PC',
          ),
        ),
        div(
          {
            class:
              'w-[176.4px] self-stretch p-3 border-b border-gray-200 flex flex-col justify-start items-start',
          },
          div(
            {
              class:
                'self-stretch justify-start text-gray-900 text-sm font-normal leading-tight',
            },
            `${quantity}`,
          ),
        ),
        div(
          {
            class:
              'w-[176.4px] self-stretch p-3 border-b border-gray-200 flex flex-col justify-start items-start',
          },
          div(
            {
              class:
                'self-stretch justify-start text-gray-900 text-sm font-normal leading-tight',
            },
            `$${singlePrice}`,
          ),
        ),
      );
      return detailedRow;
    };
    //   approvedQuoteRow.append(quoteDetail);
    approvedQuotesDetailsResponse.items?.map(async (element) => {
      // eslint-disable-next-line max-len
      const quoteDetailRows = dynamicQuoteDetailContent(element.productSKU, element.originQuantity.value, element.originSinglePrice.value);
      quoteDetailTable.append(quoteDetailRows);
    });

    quoteDetail.append(quoteDetailTable);
    return quoteDetail;
  };

  const dynamicTableContent = async (approvedQuotesResp) => {
    const tableRow = (
      quoteId,
      quoteNo,
      creationDate,
      totalValue,
      status,
      approvedQuotesDetailsResponse,
    ) => {
      const date = new Date(creationDate);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      const formattedAmount = parseFloat(totalValue).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const buyButton = (buttonStatus) => {
        let addButton;
        if (buttonStatus === 'Approved') {
          addButton = div(
            {
              class:
                'w-[113px] self-stretch inline-flex justify-center items-center',
            },
            button(
              {
                class:
                  'h-[40px] text-center text-white text-base font-normal btn-primary-purple rounded-full px-6 ',
                id: 'addButton',
              },
              'Buy',
            ),
          );
        } else {
          addButton = div({
            class: 'w-[113px] self-stretch text-center justify-start',
          });
        }
        return addButton;
      };
      const formattedWords = status
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const statusColor = (orderStatus) => {
        if (orderStatus === 'Approved') {
          return {
            text: 'w-[113px] self-stretch text-center justify-start text-green-700 bg-green-50 text-medium font-[400] leading-tight',
          };
        }
        return {
          text: 'w-[113px] self-stretch text-center justify-start text-red-800 bg-red-100 text-medium font-[400] leading-tight',
        };
      };
      const statusTextColor = statusColor(status);
      const chevronDownContainer = span({
        class:
          'w-[10px] h-[15px] icon icon-chevron-down [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
        id: 'dropdown',
      });

      const chevronUpContainer = span({
        class:
          'w-[10px] h-[15px] icon icon-chevron-up [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800 hidden',
        id: 'chevronUp',
      });
      chevronDownContainer.addEventListener('click', () => {
        chevronDownContainer.classList.add('hidden');
        chevronUpContainer.classList.remove('hidden');
        const detailedRow = document.getElementById(
          approvedQuotesDetailsResponse.id,
        );
        if (detailedRow) detailedRow.classList.remove('hidden');
        const quoteRowClicked = document.getElementById(
          approvedQuotesDetailsResponse.number,
        );
        const dynamicQuoteDetailRow = dynamicQuoteDetail(
          approvedQuotesDetailsResponse,
        );
        quoteRowClicked.append(dynamicQuoteDetailRow);
      });
      chevronUpContainer.addEventListener('click', () => {
        chevronUpContainer.classList.add('hidden');
        chevronDownContainer.classList.remove('hidden');
        const detailedRow = document.getElementById(
          approvedQuotesDetailsResponse.id,
        );
        detailedRow.remove();
      });

      const approvedQuoteRow = div(
        {
          class: 'flex flex-col',
          id: `${approvedQuotesDetailsResponse.number}`,
        },
        a(
          {
            class:
              'inline-flex h-[46px] justify-start border-b border-gray-200 gap-1',
            // eslint-disable-next-line max-len
            // href: `${window.EbuyConfig.requestQuoteDetailsPageUrl}?quoteId=${quoteId}`, // Add this if needed
          },

          div(
            {
              class:
                'w-[226px] h-[46px] self-stretch p-3 inline-flex justify-start items-start',
            },
            div(
              {
                class:
                  'w-[40px] p-2 inline-flex flex-col justify-center items-center cursor-pointer',
                id: 'chevronContainer',
              },
              chevronDownContainer,
              chevronUpContainer,
            ),
            div(
              {
                class:
                  'self-stretch w-[130px] text-center justify-start text-danaherpurple-500 text-medium font-[400] leading-tight',
              },
              quoteNo,
            ),
          ),
          div(
            {
              class:
                'w-[226px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
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
                'w-[226px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-end',
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
              class:
                'w-[226px] h-[46px] self-stretch p-3 inline-flex justify-start items-start',
            },
            div(
              {
                class: statusTextColor.text,
              },
              formattedWords,
            ),
            buyButton(status),
          ),
        ),
      );

      return approvedQuoteRow;
    };

    // Build table rows with async details
    const tableRows = await Promise.all(
      approvedQuotesResp?.map(async (element) => {
        const quote = {};
        const approvedQuotesDetailsResponse = await approvedQuotesDetails(
          element.title,
        );

        element.attributes.forEach((item) => {
          if (item.name === 'number') {
            quote.quoteNo = item.value;
          } else if (item.name === 'creationDate') {
            quote.creationDate = item.value;
          } else if (item.name === 'rejected') {
            if (item.value === false) {
              quote.status = 'Approved';
            } else {
              quote.status = 'Expired';
            }
          }
        });
        const totalValue = approvedQuotesDetailsResponse?.total?.value ?? 'N/A';

        return tableRow(
          element.title,
          quote.quoteNo,
          quote.creationDate,
          totalValue,
          quote.status,
          approvedQuotesDetailsResponse,
        );
      }),
    );

    // Return the tbody with all rows
    return tbody(
      { class: 'w-full flex flex-col', id: 'tableRow' },
      ...tableRows,
    );
  };

  const tableData = (name) => {
    let row;
    if (name === 'Quote #') {
      row = div(
        {
          class:
            'w-[226px] h-[46px] self-stretch p-3 inline-flex justify-start items-center gap-1',
        },
        div(
          {
            class:
              'justify-start w-[130px] text-right text-black text-base font-bold leading-snug',
          },
          name,
        ),
        div(
          {
            class: 'inline-flex flex-col justify-center items-start',
          },
          span({
            class:
              'w-[10px] h-[10px] icon icon-chevron-up [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
          span({
            class:
              'w-[10px] h-[10px] icon icon-chevron-down [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
        ),
      );
    } else {
      row = div(
        {
          class:
            'w-[226px] h-[46px] self-stretch p-3 inline-flex justify-start items-center gap-1',
        },
        div(
          {
            class: 'justify-start text-black text-base font-bold leading-snug',
          },
          name,
        ),
        div(
          {
            class: 'inline-flex flex-col justify-center items-start',
          },
          span({
            class:
              'w-[10px] h-[10px] icon icon-chevron-up [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
          span({
            class:
              'w-[10px] h-[10px] icon icon-chevron-down [&_svg>use]:stroke-black [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
        ),
      );
    }

    return row;
  };
  const quoteTable = table(
    {
      class:
        'self-stretch w-full border border-solid border-gray-300 inline-flex flex-col justify-start items-start',
      id: 'orderTable',
    },
    tr(
      {
        class: 'self-stretch w-full border-b-2 border-solid border-gray-300',
      },
      tableData('Quote #'),
      tableData('Quote Date'),
      tableData('Total Value'),
      tableData('Status'),
    ),
  );
  quoteWrapper.append(quoteTable);
  const orderRows = await dynamicTableContent(approvedQuotesResponse);
  quoteTable.append(orderRows);
  approvedQuoteWrapper.append(approvedquoteTitleDiv);
  approvedQuoteWrapper.append(quoteWrapper);
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper.append(dashboardSideBarContent, approvedQuoteWrapper);
  block.innerHTML = '';
  block.textContent = '';
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

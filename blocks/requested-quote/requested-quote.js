import dashboardSidebar from "../dashboardSideBar/dashboardSideBar.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import { showPreLoader, removePreLoader } from "../../scripts/common-utils.js";
import { div, table, tbody, tr, span, a } from "../../scripts/dom-builder.js";
import { requestedQuotes, requestedQuotesDetails } from "../dashboard/dashboardutils.js";

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  document.querySelector("main").style = "background: #f4f4f4";
  const requestedQuotesResponse = await requestedQuotes();
   const requestedQuoteWrapper = div({
      class: 'w-[70%] self-stretch h-[831px] inline-flex flex-col justify-start items-start gap-5',
    });
    const resquestedquoteTitleDiv = div({
        class: "self-stretch p-6 flex flex-col justify-start items-start gap-4"
    },
    div({
        class: "self-stretch justify-start text-black text-3xl font-normal leading-10"
    }, "Requested Quote"),
    div({
        class: "self-stretch justify-start text-black text-base font-extralight leading-snug"
    }, "Track the status of your quote requests and stay in the loop.")
    );
    const wrapper = div({
      id: 'dashboardWrapper',
      class:
            'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
    });
    const quoteWrapper = div(
      {
        class:
          "w-full ml-[20px] p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center",
        id: "orderWrapper",
      },
    //   div(
    //     {
    //       class:
    //         "self-stretch h-[500px] border border-solid border-gray-300 inline-flex flex-col justify-start items-start",
    //     },
    //     div({
    //       class: "self-stretch inline-flex justify-start items-center",
    //     })
    //   )
    );

    const dynamicTableContent = async (requestedQuotesResponse) => {
  const tableRow = (quoteId, quoteNo, creationDate, brand) => {
    const date = new Date(creationDate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;

    return a(
      {
        class: 'inline-flex justify-start border-b border-gray-200 gap-1',
        href: `/us/en/e-buy/requestquotedetails?quoteId=${quoteId}`, // Add this if needed
      },
      div(
        {
          class:
            'w-[262.67px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
        },
        div(
          {
            class:
              'self-stretch justify-start text-left text-danaherpurple-500 text-medium font-[400] leading-tight',
          },
          quoteNo
        )
      ),
      div(
        {
          class:
            'w-[262.67px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
        },
        div(
          {
            class:
              'self-stretch justify-start text-gray-900 text-medium font-[400] leading-tight',
          },
          formattedDate
        )
      ),
      div(
        {
          class:
            'w-[262.67px] h-[46px] self-stretch p-3 inline-flex flex-col justify-start items-start',
        },
        div(
          {
            class:
              'self-stretch justify-start text-gray-900 text-medium font-[400] leading-tight',
          },
          brand
        )
      )
    );
  };

  // Build table rows with async details
  const tableRows = await Promise.all(
    requestedQuotesResponse.map(async (element) => {
      const quote = {};
      const requestedQuotesDetailsResponse = await requestedQuotesDetails(element.title);

      element.attributes.forEach((item) => {
        if (item.name === 'number') {
          quote.quoteNo = item.value;
        } else if (item.name === 'creationDate') {
          quote.creationDate = item.value;
        }
      });

      const brand = requestedQuotesDetailsResponse?.items?.[0]?.brand ?? 'N/A';

      return tableRow(element.title, quote.quoteNo, quote.creationDate, brand);
    })
  );

  // Return the tbody with all rows
  return tbody(
    { class: 'w-full flex flex-col', id: 'tableRow' },
    ...tableRows
  );
};

    
    const tableData = (name) => {
        const row = div(
          {
            class:
              'w-[262.67px] h-[46px] self-stretch p-3 border-b-2 border-gray-200 inline-flex justify-start items-center gap-1',
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
       const quoteTable = table(
          {
            class:'self-stretch h-[500px] border border-solid border-gray-300 inline-flex flex-col justify-start items-start',
            id: 'orderTable',
          },
          tr(
            {
              class: '',
            },
            tableData('Quote Request #'),
            tableData('Request Date'),
            tableData('Brand'),
          ),
      
        );
        quoteWrapper.append(quoteTable);
         const orderRows = await dynamicTableContent(requestedQuotesResponse);
        quoteTable.append(orderRows);
    requestedQuoteWrapper.append(resquestedquoteTitleDiv);
    requestedQuoteWrapper.append(quoteWrapper);
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper.append(dashboardSideBarContent, requestedQuoteWrapper);
  block.innerHTML = "";
  block.textContent = "";
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

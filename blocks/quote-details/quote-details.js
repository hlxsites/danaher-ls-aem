import { div, a, span } from "../../scripts/dom-builder.js";
import { showPreLoader, removePreLoader } from "../../scripts/common-utils.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import dashboardSidebar from "../dashboardSideBar/dashboardSideBar.js";
import { requestedQuotesDetails } from "../dashboard/dashboardutils.js";
import { quoteSummary } from "./quotesummary.js";
import { quoteItems } from "./quoteItems.js";
import { requesterInformation } from "./requesterInformation.js";

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const quoteId = new URLSearchParams(window.location.search).get("quoteId");
  console.log("quoteId", quoteId);
  const requestedQuotesDetailsResponse = await requestedQuotesDetails(quoteId);
  console.log("requestedQuotesDetailsResponse", requestedQuotesDetailsResponse);
  const quoteDetailsWrapper = div({
    class: "w-[70%] inline-flex flex-col justify-start items-start gap-5 ",
  });
  const wrapper = div({
    id: "dashboardWrapper",
    class:
      "flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12",
  });
  const goBackToQuoteStatusLink = a(
      {
        class: 'inline-flex justify-start items-start gap-2',
        href: '/us/en/e-buy/requestedquotes',
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
      }, 'Go Back to Requested Quotes'),
    );
const quoteDetailTitleDiv = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-4',
    },
    div({
      class: 'self-stretch justify-start text-black font-bold font-normal text-[32px] leading-10',
    }, 'Requested Quotes Details'),
    div({
      class: 'self-stretch justify-start text-black text-base font-extralight leading-snug',
    }, 'Your quote request details—see what you submitted and track its progress.'),
  );
  const quoteDetailsContainer = div({
    class: 'w-full inline-flex gap-5',
  });
  const quoteDetail = div({
    class: 'w-[70%] p-6 bg-white border border-solid border-gray-300 inline-flex flex-col justify-start items-center gap-6',
  });
  const addressDetail = div({
    class: 'w-[30%]',
  });
  const quoteItemTitle = div(
    {
      class: 'self-stretch inline-flex justify-start items-start gap-5',
    },
    div({
      class: 'justify-start font-bold text-black text-xl font-normal leading-7',
    }, 'Quote Request Item'),
  );
   
  const quoteSummaryContainer = quoteSummary(requestedQuotesDetailsResponse);
  const quoteItemsContainer = quoteItems(requestedQuotesDetailsResponse);
  const requesterInformationContainer = requesterInformation(requestedQuotesDetailsResponse);
  quoteDetail.append(quoteSummaryContainer);
  quoteDetail.append(quoteItemTitle);
   quoteDetail.append(quoteItemsContainer);
  quoteDetailsContainer.append(quoteDetail);
  addressDetail.append(requesterInformationContainer);
  quoteDetailsContainer.append(addressDetail);
  quoteDetailsWrapper.append(goBackToQuoteStatusLink);
  quoteDetailsWrapper.append(quoteDetailTitleDiv);
  quoteDetailsWrapper.append(quoteDetailsContainer);
  const dashboardSideBarContent = await dashboardSidebar();
  wrapper.append(dashboardSideBarContent, quoteDetailsWrapper);
  block.innerHTML = "";
  block.textContent = "";
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

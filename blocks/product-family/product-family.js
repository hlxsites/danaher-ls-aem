import { decorateIcons } from "../../scripts/lib-franklin.js";
import { div, p, span } from '../../scripts/dom-builder.js';
import { getProductsForCategories } from '../../scripts/commerce.js';
import { makePublicUrl, imageHelper, generateUUID } from '../../scripts/scripts.js';

async function fetchProducts() {
  try {
    const productCategories = await getProductsForCategories();
    console.log("Fetched product categories:", productCategories?.results);
    return productCategories?.results || [];
  } catch (error) {
    return [];
  }
}

export default async function decorate(block) {
  const main = document.querySelector("main");

  const filterWrapper = div({
    class: "w-72 p-5 inline-flex flex-col justify-start items-start gap-3",
  });

  // Header Row
  const header = div(
    { class: "self-stretch inline-flex justify-start items-center gap-4" },
    div(
      { class: "w-12 h-12 relative bg-violet-50 rounded-3xl" },
      div(
        { class: "w-6 h-6 left-[12px] top-[12px] absolute overflow-hidden" },
        span({
          class: 'icon icon-adjustments w-6 h-6 absolute right-0 fill-current text-gray-400 chevron-down [&_svg>use]:stroke-gray-400',
        })
      )
    ),
    div(
      { class: "flex-1 h-6 relative" },
      div(
        { class: "w-64 h-6 left-0 top-0 absolute" },
        div({
          class:
            "w-64 left-0 top-[-6px] absolute justify-start text-gray-900 text-3xl font-normal  leading-10",
        }, "Filters")
      )
    )
  );

  const expandAll = div({
    class: "self-stretch h-5 p-3 inline-flex justify-end items-center gap-2.5",
  },
    div({
      class: "text-right justify-start text-violet-600 text-base font-bold  leading-snug",
    }, "Expand All"),
    div(
      { class: "w-4 h-4 relative mb-2" },
      span({ class: 'icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 ml-1' })
    ),
  );

  decorateIcons(expandAll);
  decorateIcons(header);

  const facet = (title = "Facet Title", items = []) =>
    div({
      class: "self-stretch p-3 bg-white border-t border-gray-300 flex flex-col justify-start items-start gap-3",
    },
      div({ class: "self-stretch pr-3 pt-2 pb-2.5 inline-flex justify-between items-start" },
        div({ class: "flex-1 justify-start text-black text-base font-semibold font-['Inter'] leading-normal" }, title),
        div(
          { class: "w-4 h-4 relative mb-2" },
          span({ class: 'icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 ml-1' })
        ),
        div({ class: "text-right justify-start text-gray-400 text-base font-semibold font-['Inter'] leading-normal" }, "–")
      ),
      ...items
    );



  const facetItem = (label) =>
    div({
      class: "inline-flex justify-start items-center gap-2",
    },
      div({ class: "w-4 h-4 relative bg-white rounded border border-gray-300" }),
      div({ class: "justify-start text-black text-sm font-normal  leading-tight" }, label)
    );

  const facetItemsList = [
    "Beckman Life Science",
    "IDBS",
    "Leica Microsystems",
    "Molecular Devices",
    "Phenomenex",
    "Sciex"
  ].map(facetItem);

  const searchBar = div({
    class: "self-stretch h-8 px-3 py-1.5 bg-gray-100 outline outline-[0.50px] outline-gray-300 inline-flex justify-start items-center gap-1.5",
  },
    div({
      class: "flex justify-start items-center gap-1.5"
    },
      span({
        class: 'icon icon-search w-4 h-4 text-gray-400'
      }),
      div({
        class: "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-tight"
      }, "Search")
    )
  );
  

  decorateIcons(searchBar)
  const fullFacet = facet("Facet Title", [searchBar, div({ class: "h-52 flex flex-col justify-start items-start gap-4" }, ...facetItemsList)]);

  filterWrapper.append(header, expandAll, div({ class: "self-stretch flex flex-col justify-start items-start" }, fullFacet));
  decorateIcons(filterWrapper);
  const productCategories = await fetchProducts();

  const productTitle = div({
    class: 'text-black text-2xl font-normal  leading-loose whitespace-nowrap mb-4',
  }, 'Top Selling Products');

  const cardWrapper = div({
    class: 'w-full flex flex-wrap gap-5 justify-start',
  });

  const cardsToDisplay = productCategories.slice(0, 9); // 3 rows of 3

  cardsToDisplay.forEach(item => {

    const card = div({
      class:
        "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.33%-13.33px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
    });
  
    const imageElement = imageHelper(item.raw.images[0], item.title, {
      href: makePublicUrl(item.path),
      title: item.title,
      class: "w-full h-40 object-cover",
    });
  
    const titleElement = p(
      { class: "p-3 text-black text-xl font-normal leading-7" },
      item.title
    );
  
    const descriptionElement = p(
      { class: "p-3 text-gray-700 text-base font-extralight leading-snug" },
      item?.raw?.source
    );
  
    const contentWrapper = div({
      class: "flex flex-col justify-start items-start w-full flex-grow",
    });
  
    contentWrapper.append(titleElement, descriptionElement);
  
    const pricingDetails = div(
      {
        class:
          "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
      },
      div(
        {
          class:
            "text-right justify-start text-black text-2xl font-normal  leading-loose",
        },
        "$1,000.00"
      ),
      div(
        { class: "self-stretch flex flex-col justify-start items-start gap-2" },
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class:
                "text-black text-base font-extralight  leading-snug",
            },
            "Unit of Measure:"
          ),
          div(
            {
              class:
                "text-black text-base font-bold  leading-snug",
            },
            item?.raw?.uom || "1/Bundle"
          )
        ),
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class:
                "text-black text-base font-extralight  leading-snug",
            },
            "Min. Order Qty:"
          ),
          div(
            {
              class:
                "text-black text-base font-bold  leading-snug",
            },
            item?.raw?.minQty || "50"
          )
        )
      )
    );
  
    const actionButtons = div(
      { class: "inline-flex justify-start items-center ml-3 mt-5 gap-3" },
      div(
        {
          class:
            "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class:
              "justify-start text-black text-base font-normal font-['Inter'] leading-normal",
          },
          "1"
        )
      ),
      div(
        {
          class:
            "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class:
              "text-white text-base font-normal  leading-snug",
          },
          "Buy"
        )
      ),
      div(
        {
          class:
            "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class:
              "text-violet-600 text-base font-normal  leading-snug",
          },
          "Quote"
        )
      )
    );
  
    const viewDetailsButton = div(
      { class: "self-stretch p-3 flex justify-start items-center" },
      div(
        { class: "text-violet-600 text-base font-bold leading-snug" },
        "View Details →"
      )
    );
  
    // Append elements in a structured way
    card.append(imageElement, contentWrapper, pricingDetails, actionButtons, viewDetailsButton);
    cardWrapper.append(card);
  });

  const contentWrapper = div({
    class: 'flex-1 flex flex-col gap-4',
  }, productTitle, cardWrapper);

  const layoutWrapper = div({
    class: 'w-full flex flex-col lg:flex-row gap-8 items-start',
  }, filterWrapper, contentWrapper);

  block.append(layoutWrapper);
}

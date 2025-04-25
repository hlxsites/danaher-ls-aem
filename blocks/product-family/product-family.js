import { decorateIcons } from "../../scripts/lib-franklin.js";
import {
  div,
  h3,
  input,
  label,
  span,
  button,
  fieldset,
  ul,
  li,
  a,
  img,
  p,
} from "../../scripts/dom-builder.js";
import { getProductsForCategories } from "../../scripts/commerce.js";
import {
  makePublicUrl,
  imageHelper,
  generateUUID,
} from "../../scripts/scripts.js";

async function fetchProducts() {
  try {
    const productsCategories = await getProductsForCategories();
    console.log("Fetched products categories:", productsCategories?.results);
    return productsCategories?.results || [];
  } catch (error) {
    return [];
  }
}

export default async function decorate(block) {
  block.textContent = "";
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
          class:
            "icon icon-adjustments w-6 h-6 absolute right-0 fill-current text-gray-400 chevron-down [&_svg>use]:stroke-gray-400",
        })
      )
    ),
    div(
      { class: "flex-1 h-6 relative" },
      div(
        { class: "w-64 h-6 left-0 top-0 absolute" },
        div(
          {
            class:
              "w-64 left-0 top-[-6px] absolute justify-start text-gray-900 text-3xl font-normal font-['TWK_Lausanne_Pan'] leading-10",
          },
          "Filters"
        )
      )
    )
  );

  const expandAll = div(
    {
      class:
        "self-stretch h-5 p-3 inline-flex justify-end items-center gap-2.5",
    },
    div(
      {
        class:
          "text-right justify-start text-violet-600 text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
      },
      "Expand All"
    ),
    div(
      { class: "w-4 h-4 relative mb-2" },
      span({
        class:
          "icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 ml-1",
      })
    )
  );

  decorateIcons(expandAll);
  decorateIcons(header);

  const facet = (title = "Facet Title", items = []) =>
    div(
      {
        class:
          "self-stretch p-3 bg-white border-t border-gray-300 flex flex-col justify-start items-start gap-3",
      },
      div(
        {
          class:
            "self-stretch pr-3 pt-2 pb-2.5 inline-flex justify-between items-start",
        },
        div(
          {
            class:
              "flex-1 justify-start text-black text-base font-semibold font-['Inter'] leading-normal",
          },
          title
        ),
        div(
          { class: "w-4 h-4 relative mb-2" },
          span({
            class:
              "icon icon-chevron-down [&_svg>use]:stroke-danaherpurple-500 ml-1",
          })
        ),
        div(
          {
            class:
              "text-right justify-start text-gray-400 text-base font-semibold font-['Inter'] leading-normal",
          },
          "–"
        )
      ),
      ...items
    );

  decorateIcons(facet);

  const facetItem = (label) =>
    div(
      {
        class: "inline-flex justify-start items-center gap-2",
        "data-checked": "False",
        "data-help-text": "False",
        "data-label": "True",
        "data-state": "Default",
      },
      div({
        class: "w-4 h-4 relative bg-white rounded border border-gray-300",
      }),
      div(
        {
          class:
            "justify-start text-black text-sm font-normal font-['TWK_Lausanne_Pan'] leading-tight",
        },
        label
      )
    );

  const facetItemsList = [
    "Beckman Life Science",
    "IDBS",
    "Leica Microsystems",
    "Molecular Devices",
    "Phenomenex",
    "Sciex",
  ].map(facetItem);

  const searchBar = div(
    {
      class:
        "self-stretch h-8 px-3 py-1.5 bg-gray-100 outline outline-[0.50px] outline-gray-300 inline-flex justify-start items-center gap-1.5",
    },
    div(
      { class: "w-2.5 h-2.5 relative overflow-hidden" },
      div({
        class: "w-2.5 h-2.5 left-[0.59px] top-[0.59px] absolute bg-gray-500",
      })
    ),
    div(
      {
        class:
          "justify-start text-gray-500 text-sm font-normal font-['Inter'] leading-tight",
      },
      "Search"
    )
  );

  const fullFacet = facet("Facet Title", [
    searchBar,
    div(
      { class: "h-52 flex flex-col justify-start items-start gap-4" },
      ...facetItemsList
    ),
  ]);

  filterWrapper.append(
    header,
    expandAll,
    div(
      { class: "self-stretch flex flex-col justify-start items-start" },
      fullFacet
    )
  );

  const productsCategories = await fetchProducts();

  const productTitle = div(
    {
      class:
        'text-black text-2xl font-normal font-["TWK_Lausanne_Pan"] leading-loose whitespace-nowrap mb-4',
    },
    "Top Selling Products"
  );

  const cardWrapper = div({
    class: "w-full flex flex-wrap gap-5 justify-start",
  });

  const cardsToDisplay = productsCategories.slice(0, 9); // 3 rows of 3

  cardsToDisplay.forEach((item) => {
    const card = div({
      class:
        "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.33%-13.33px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
    });

    const image = imageHelper(item.raw.images[0], item.title, {
      href: makePublicUrl(item.path),
      title: item.title,
      class: "w-full h-40 object-cover",
    });

    const head = p(
      {
        class: "p-3 text-black text-xl font-normal leading-7",
      },
      item.title
    );

    const desc = p(
      {
        class: "p-3 text-gray-700 text-base font-extralight leading-snug",
      },
      item?.raw?.source
    );

    const details = div(
      {
        class:
          "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
      },
      div(
        {
          class:
            "text-right justify-start text-black text-2xl font-normal font-['TWK_Lausanne_Pan'] leading-loose",
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
                "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
            },
            "Unit of Measure:"
          ),
          div(
            {
              class:
                "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
            },
            "1/Bundle"
          )
        ),
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class:
                "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
            },
            "Min. Order Qty:"
          ),
          div(
            {
              class:
                "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
            },
            "50"
          )
        )
      ),
      div(
        { class: "inline-flex justify-start items-center gap-3" },
        div(
          {
            class:
              "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
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
            "data-state": "Default",
            "data-type": "Primary",
            class:
              "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
          },
          div(
            {
              class:
                "justify-start text-white text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
            },
            "Buy"
          )
        ),
        div(
          {
            "data-state": "Default",
            "data-type": "Primary",
            class:
              "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
          },
          div(
            {
              class:
                "justify-start text-violet-600 text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
            },
            "Quote"
          )
        )
      )
    );

    const spacer = div({ class: "flex-grow" });

    const desc1 = div(
      { class: "self-stretch p-3 flex justify-start items-center" },
      div(
        { class: "text-violet-600 text-base font-bold leading-snug" },
        "View Details →"
      )
    );

    card.append(image, head, desc, details, spacer, desc1);
    cardWrapper.append(card);
  });

  const contentWrapper = div(
    {
      class: "flex-1 flex flex-col gap-4",
    },
    productTitle,
    cardWrapper
  );

  const layoutWrapper = div(
    {
      class: "w-full flex flex-col lg:flex-row gap-8 items-start",
    },
    filterWrapper,
    contentWrapper
  );

  block.append(layoutWrapper);
}

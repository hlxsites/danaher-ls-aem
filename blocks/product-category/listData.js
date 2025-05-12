import { div, img } from "../../scripts/dom-builder.js";

function renderListCard(item) {
  const imageUrl = item.raw.images && item.raw.images[0] ? item.raw.images[0] : "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";

  return div(
    {
      class:
        "self-stretch w-full outline outline-1 outline-gray-300 inline-flex justify-start items-center flex-wrap md:flex-nowrap",
    },
    div(
      {
        class:
          "flex-1 self-stretch p-6 bg-white flex justify-start items-start gap-6",
      },
      div(
        {
          class: "w-24 inline-flex flex-col justify-start items-center gap-3",
        },
        div(
          {
            class:
              "self-stretch max-h-24 relative rounded-md outline outline-1 outline-offset-[-1px] outline-gray-900",
          },
          div({
            class: "w-24 h-24 left-0 top-0 absolute bg-white rounded-md",
          }),
          img({
            class:
              "w-24 h-24 left-0 top-0 absolute rounded-md border border-gray-200 object-fit",
            src: imageUrl,
            alt: item.title || "",
          })
        )
      ),
      div(
        {
          class:
            "self-stretch h-44 inline-flex flex-col justify-between items-start",
        },
        div(
          {
            class: "self-stretch flex flex-col justify-start items-start gap-3",
          },
          div(
            {
              class:
                "self-stretch flex flex-col justify-start items-start gap-1",
            },
            item?.raw?.tag || "Carrier Free" &&
              div(
                {
                  class:
                    "px-4 py-1 bg-violet-50 inline-flex justify-center items-center gap-2.5",
                },
                div(
                  {
                    class:
                      "text-center justify-start text-violet-600 text-sm font-normal  leading-tight",
                  },
                  item.raw.tag || "Carrier Free"
                )
              ),
            div(
              {
                class:
                  "self-stretch justify-start text-black text-xl font-normal  leading-7",
              },
              item.title
            )
          ),
          div(
            {
              class: "hidden md:flex w-full flex-col gap-2 mt-4",
            },
            div(
              {
                class: "text-left text-violet-600 font-bold",
              },
              "View Details →"
            ),
            
          )
        )
      )
    ),
    div(
      {
        class: "w-full flex flex-wrap md:hidden",
      },
      div(
        {
          class: "ml-5 text-left text-violet-600 font-bold w-full",
        },
        "View Details →"
      )
    ),
    div(
      {
        class:
          "self-stretch p-6 bg-gray-50 inline-flex flex-col justify-start items-end gap-4",
      },
      div(
        {
          class:
            "w-64 text-right justify-start text-black text-2xl font-normal  leading-loose",
        },
        `$${item?.raw?.price || "50.00"}`
      ),
      div(
        {
          class: "w-64 flex flex-col gap-2",
        },
        div(
          {
            class: "flex justify-between items-center",
          },
          div(
            {
              class:
                "text-black text-base font-extralight  leading-snug",
            },
            "Availability:"
          ),
          div(
            {
              class:
                "text-black text-base font-bold  leading-snug",
            },
            `${item?.raw?.availability || 0} Available`
          )
        ),
        div(
          {
            class: "flex justify-between items-center",
          },
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
            item?.raw?.uom || "2/Bundle"
          )
        ),
        div(
          {
            class: "flex justify-between items-center",
          },
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
            item?.raw?.minQty || "4"
          )
        )
      ),
      div(
        {
          class: "inline-flex justify-start items-center gap-3",
        },
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
            class:
              "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
          },
          div(
            {
              class:
                "justify-start text-white text-base font-normal  leading-snug",
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
                "justify-start text-violet-600 text-base font-normal  leading-snug",
            },
            "Quote"
          )
        )
      )
    )
  );
}

export default renderListCard;

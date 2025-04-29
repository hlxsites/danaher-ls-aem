import { div, p } from "../../scripts/dom-builder.js";
import { makePublicUrl, imageHelper } from "../../scripts/scripts.js";

function renderGridCard(item) {
  const card = div({
    class:
      "w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
  });

  const image = imageHelper(item.raw.images[0], item.title, {
    href: makePublicUrl(item.path),
    title: item.title,
    class: "w-full h-40 object-cover",
  });

  const head = p(
    { class: "p-3 text-black text-xl font-normal leading-7" },
    item.title
  );
  const desc = p(
    { class: "p-3 text-gray-700 text-base font-extralight leading-snug" },
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
          item?.raw?.uom || "1/Bundle"
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
          item?.raw?.minQty || "50"
        )
      )
    ),
    div(
      { class: "inline-flex justify-start items-center gap-3" },
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
              "text-white text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
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
              "text-violet-600 text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
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
  return card;
}

export default renderGridCard;

import { div, p } from "../../scripts/dom-builder.js";
import { makePublicUrl, imageHelper } from "../../scripts/scripts.js";

function renderGridCard(item) {
  const card = div({
    class:
      "w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
  });

  // Image Wrapper with Carrier Free Badge
  const imageWrapper = div({
    class: "relative w-full",
  });

  // Check if the image exists; if not, use the fallback image
  const imageUrl = item.raw.images && item.raw.images[0] ? item.raw.images[0] : "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";

  const imageElement = imageHelper(imageUrl, item.title, {
    href: makePublicUrl(item.path),
    title: item.title,
    class: "w-full h-40 object-cover",
  });

  const carrierFreeBadge = div({
    class: "px-4 py-1 absolute left-2 top-40 bg-violet-50 inline-flex justify-center items-center gap-2.5 z-10",
    "data-state": "Static",
  },
    div({
      class: "pt-1 text-center text-violet-600 text-sm font-normal leading-tight"
    }, "Carrier Free")
  );

  imageWrapper.append(imageElement, carrierFreeBadge);

  // Title Element
  const titleElement = p(
    { class: "p-3 text-black text-xl font-normal leading-7" },
    item.title
  );

  // Content Wrapper for Title and Description
  const contentWrapper = div({
    class: "flex flex-col justify-start items-start w-full flex-grow",
  });

  contentWrapper.append(titleElement);

  // Pricing Details - This will stay at the bottom
  const pricingDetails = div(
    {
      class:
        "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
    },
    div(
      {
        class:
          "text-right justify-start text-black text-2xl font-normal leading-loose",
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
              "text-black text-base font-extralight leading-snug",
          },
          "Unit of Measure:"
        ),
        div(
          {
            class:
              "text-black text-base font-bold leading-snug",
          },
          item?.raw?.uom || "1/Bundle"
        )
      ),
      div(
        { class: "flex justify-between items-center w-full" },
        div(
          {
            class:
              "text-black text-base font-extralight leading-snug",
          },
          "Min. Order Qty:"
        ),
        div(
          {
            class:
              "text-black text-base font-bold leading-snug",
          },
          item?.raw?.minQty || "50"
        )
      )
    )
  );

  // Action Buttons (e.g., Buy, Quote)
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
            "text-white text-base font-normal leading-snug",
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
            "text-violet-600 text-base font-normal leading-snug",
        },
        "Quote"
      )
    )
  );

  // View Details Button - Always at the bottom
  const viewDetailsButton = div(
    { class: "self-stretch p-3 flex justify-start items-center" },
    div(
      { class: "text-violet-600 text-base font-bold leading-snug" },
      "View Details →"
    )
  );

  // Append all elements into the card
  card.append(imageWrapper, contentWrapper, pricingDetails, actionButtons, viewDetailsButton);

  // Add onerror handler to the <img> element inside the card
  const imgElement = card.querySelector("img");
  if (imgElement) {
    imgElement.onerror = function() {
      if (!imgElement.getAttribute('data-fallback-applied')) {
        imgElement.src = 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
        imgElement.setAttribute('data-fallback-applied', 'true');
      }
    };
  }

  return card;
}

export default renderGridCard;
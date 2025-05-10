import { div, p, a } from "../../scripts/dom-builder.js";
import { makePublicUrl, imageHelper } from "../../scripts/scripts.js";

function renderGridCard(item) {
  const card = div({
    class: "w-full flex flex-col col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-xl",
  });

  // Image Wrapper with Carrier Free Badge
  const imageWrapper = div({
    class: "relative w-full h-full",
  });

  const imageElement = imageHelper(item.raw.images[0], item.title, {
    href: makePublicUrl(item.path),
    title: item.title,
    class: "category-image mb-2 h-48 w-full object-contain",
  });

  const carrierFreeBadge = item?.raw?.tag || "Carrier Free" ? div({
    class: "px-4 py-1 absolute left-2 top-40 bg-violet-50 inline-flex justify-center items-center gap-2.5 z-10",
    "data-state": "Static",
  },
    div({
      class: "pt-1 text-center text-violet-600 text-sm font-normal leading-tight",
    }, item.raw.tag || "Carrier Free")
  ) : null;

  imageWrapper.append(imageElement);
  if (carrierFreeBadge) imageWrapper.append(carrierFreeBadge);

  // Title Element
  const titleElement = a({
    class: "!px-7 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14",
    href: makePublicUrl(item.path),
    target: "_self",
  }, item.title);

  // Pricing and Action Buttons
  const pricingDetails = div(
    {
      class: "inline-flex items-center w-full px-6 py-5 space-x-4 bg-gray-100",
    },
    div(
      {
        class: "text-right justify-start text-black text-2xl font-normal leading-loose",
      },
      `$${item?.raw?.price || "9999.99"}`
    ),
    div(
      {
        class: "btn-primary-purple border-8 px-2 !rounded-full",
        "aria-label": "View Products",
      },
      "View Products"
    )
  );

  // Append all elements into the card
  card.append(imageWrapper, titleElement, pricingDetails);

  return card;
}

export default renderGridCard;
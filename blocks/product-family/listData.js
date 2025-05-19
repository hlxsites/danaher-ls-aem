import { div, a, img } from "../../scripts/dom-builder.js";

function renderListCard(item) {
  const card = div({
    class: "w-full flex flex-col md:flex-row col-span-1 relative mx-auto justify-center transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg overflow-hidden bg-white max-w-5xl",
  });

  // Image Wrapper with Carrier Free Badge
  const imageWrapper = div({
    class: "relative w-full md:w-48 h-48 md:h-full",
  });

  // Check if the image exists; if not, use the fallback image
  const imageUrl = item?.raw?.images?.[0] || "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";

  const imageElement = img({
    class: "category-image mb-2 h-48 w-full object-contain",
    src: imageUrl,
    alt: item.title || "",
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

  // Title and Description
  const contentWrapper = div({
    class: "flex-grow p-4",
  });

  const titleElement = a({
    class: "!px-3 !text-lg !font-semibold !text-danahergray-900 !line-clamp-3 !break-words !h-14",
    href: item.clickUri,
    target: "_self",
  }, item.title);

  const descriptionElement = div({
    class: "description !px-3 mb-4 text-sm text-gray-900 break-words line-clamp-4 !h-20 py-4",
  }, item.raw.description || "No description available");

  contentWrapper.append(titleElement, descriptionElement);

  // Pricing and Action Buttons
  const pricingDetails = div(
    {
      class: "inline-flex items-center w-full md:w-64 px-6 py-5 space-x-4 bg-gray-100",
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
  card.append(imageWrapper, contentWrapper, pricingDetails);

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

export default renderListCard;
import { div, p, img, a, button } from "../../scripts/dom-builder.js";

/**
 * Renders a product card in grid view.
 * @param {Object} item - Product data containing title, url, images, description, price, etc.
 * @returns {HTMLElement} - The rendered grid card element.
 */
export function renderGridCard(item) {
  const card = div({
    class: "w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
  });

  const imageWrapper = div({ class: "relative w-full" });
  const imageUrl = item.images?.[0] || "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";
  const imageElement = a(
    { href: item.url, title: item.title, class: "block w-full" },
    img({ src: imageUrl, alt: item.title, class: "w-full min-h-40 max-h-40 object-cover" })
  );

  const createCarrierFreeBadge = div(
    { class: "px-4 py-1 -mt-4 bg-violet-50 inline-flex justify-center items-center gap-2.5" },
    div(
      { class: "text-center justify-start text-violet-600 text-sm font-normal leading-tight" },
      "Carrier Free"
    )
  );
  imageWrapper.append(imageElement, createCarrierFreeBadge);

  const contentWrapper = div({ class: "flex flex-col justify-start items-start w-full flex-grow" });
  contentWrapper.append(p({ class: "p-3 text-black text-xl font-normal leading-7" }, item.title));

  const pricingDetails = div({ class: "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6" });
  if (item.showCart && item.price !== undefined) {
    pricingDetails.append(
      div({ class: "text-right justify-start text-black text-2xl font-normal leading-loose" }, `$${item.price.toLocaleString()}`),
      div(
        { class: "self-stretch flex flex-col justify-start items-start gap-2" },
        div(
          { class: "flex justify-between items-center w-full" },
          div({ class: "text-black text-base font-extralight leading-snug" }, "Unit of Measure:"),
          div({ class: "text-black text-base font-bold leading-snug" }, item?.uom)
        ),
        div(
          { class: "flex justify-between items-center w-full" },
          div({ class: "text-black text-base font-extralight leading-snug" }, "Min. Order Qty:"),
          div({ class: "text-black text-base font-bold leading-snug" }, item?.minQty)
        )
      )
    );
  }

  let actionButtons;
  if (item.showCart && item.price !== undefined) {
    actionButtons = div(
      { class: "self-stretch px-4 py-3 bg-gray-50 inline-flex justify-start items-center gap-3" },
      div(
        { class: "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden" },
        div({ class: "justify-start text-black text-base font-normal font-['Inter'] leading-normal" }, "1")
      ),
      button(
        { class: "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden" },
        div({ class: "text-white text-base font-normal leading-snug" }, "Buy")
      ),
      button(
        { class: "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden" },
        div({ class: "text-violet-600 text-base font-normal leading-snug" }, "Quote")
      )
    );
  } else {
    actionButtons = div(
      { class: "self-stretch h-48 px-4 py-3 bg-gray-50 inline-flex flex-col justify-center items-center gap-6" },
      div(
        { class: "self-stretch h-28 inline-flex justify-start items-center gap-3" },
        div(
          { class: "flex-1 inline-flex flex-col justify-start items-start" },
          div({ class: "self-stretch justify-start text-gray-700 text-base font-extralight leading-snug line-clamp-5" }, item.description)
        )
      ),
      div(
        { class: "self-stretch inline-flex justify-start items-center gap-3" },
        button(
          { class: "flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden" },
          div({ class: "text-violet-600 text-base font-normal leading-snug" }, "Quote")
        )
      )
    );
  }

  const viewDetailsButton = div(
    { class: "self-stretch p-3 flex justify-start items-center" },
    div({ class: "text-violet-600 text-base font-bold leading-snug" }, "View Details →")
  );

  card.append(imageWrapper, contentWrapper, pricingDetails, actionButtons, viewDetailsButton);

  const imgElement = card.querySelector("img");
  if (imgElement) {
    imgElement.onerror = () => {
      if (!imgElement.getAttribute("data-fallback-applied")) {
        imgElement.src = "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";
        imgElement.setAttribute("data-fallback-applied", "true");
      }
    };
  }

  return card;
}
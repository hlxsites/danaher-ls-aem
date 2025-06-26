import { div, p, span, img, a } from "../../scripts/dom-builder.js";

import { decorateIcons } from "../../scripts/lib-franklin.js";
/**
 * Renders a product card in grid view.
 * @param {Object} item - Product data containing title, url, images, description, price, etc.
 * @returns {HTMLElement} - The rendered grid card element.
 */
export default function renderGridCard(item) {
  const imageUrl = item.images?.[0];
  const card = div(
    {
      class:
        "w-full transform transition duration-500 hover:scale-105 min-w-[264px] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start gap-3",
    },
    img({
      src: imageUrl,
      alt: item?.title.replace(/<[^>]*>/g, "") || "",
      class: "w-full h-[164px] object-contain",
    }),
    p(
      {
        class:
          "text-sm font-medium text-danaherpurple-800  !px-3  leading-tight",
      },
      item?.brand.replace(/<[^>]*>/g, "") || ""
    ),
    p(
      {
        class:
          "text-xl !m-0 !p-0  !px-3  text-black flex-grow font-medium leading-7 !line-clamp-3 !break-words",
      },
      item.title.replace(/<[^>]*>/g, "") || ""
    ),
    a(
      {
        href: item.url || "#",
        class:
          "text-danaherpurple-500   !px-3  self-stretch px-3 pb-3 flex justify-start items-center text-base font-bold leading-snug flex items-center",
      },
      "View Details",
      span({
        class:
          "icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
      })
    )
  );
  decorateIcons(card);

  const imgElement = card.querySelector("img");
  if (imgElement) {
    imgElement.onerror = () => {
      if (!imgElement.getAttribute("data-fallback-applied")) {
        imgElement.src =
          "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";
        imgElement.setAttribute("data-fallback-applied", "true");
      }
    };
  }

  return card;
}

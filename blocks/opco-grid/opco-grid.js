import { decorateIcons } from "../../scripts/lib-franklin.js";
import { a, div, img, h3, p } from "../../scripts/dom-builder.js";
import { makePublicUrl } from "../../scripts/scripts.js";

export default function decorate(block) {
  // document
  //   .querySelector(".opco-grid-wrapper")
  //   ?.parentElement?.removeAttribute("class");
  // document
  //   .querySelector(".opco-grid-wrapper")
  //   ?.parentElement?.removeAttribute("style");
  if (
    block.parentElement.parentElement.classList.contains("opco-grid-container")
  ) {
    block.parentElement.parentElement.classList.remove(
      ..."bg-danaherlightblue-50".split(" ")
    );
  }

  if (block.classList.contains("cols-4")) block.classList.add("lg:grid-cols-4");
  else block.classList.add("lg:grid-cols-3");

  const opcoGridWrapper = div({
    class:
      "opco-grid cols-4 block list-none m-0 py-0 grid grid-cols-1 dhls-container lg:px-10 dhlsBp:p-0 sm:grid-cols-2 gap-x-5 gap-y-5 mb-12 lg:grid-cols-4",
  });
  const opcoGridItems = [];
  [...block.children].forEach((child, index) => {
    opcoGridItems.push(child);
  });
  opcoGridItems?.forEach((row) => {
    const cardWrapper = a({});
    const [
      itemImage,
      itemAltText,
      itemTitle,
      itemDescription,
      itemLink,
      itemLinkTarget,
    ] = row.children;

    const readMoreLink = itemLink?.querySelector("a");
    if (readMoreLink) {
      cardWrapper.href = makePublicUrl(readMoreLink?.href);
      cardWrapper.title = itemTitle?.textContent?.trim() || "";
    }
    cardWrapper.className =
      "opco-grid-wrapper  w-[294px] flex flex-col col-span-1 mx-auto justify-center max-w-xl overflow-hidden p-0 border-l-[0.5px] border-gray-300 transform transition duration-500 hover:scale-105";
    cardWrapper.classList.add(
      "cursor-pointer relative transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg".split(
        " "
      )
    );

    const opcoContent = div(
      {
        class: "opco-grid-item-body p-3 bg-white rounded-b gap-3 flex flex-col",
      },
      div(
        { class: "opco-grid-item-image h-[164px] w-[294px] leading-5 mb-0" },
        img({
          src:
            itemImage?.querySelector("img")?.src ||
            "/content/dam/danaher/products/fallback-image.png",
          alt: itemAltText?.textContent.trim() || "",
          class: "h-[164px] w-[294px] !object-contain",
        })
      ),
      h3(
        {
          class:
            "!line-clamp-2 font-medium text-black !text-xl !h-16 !m-0 !p-0",
        },
        itemTitle?.textContent.trim() || ""
      ),
      p(
        {
          class:
            "font-normal !m-0 !p-0 text-base text-black !h-16 !line-clamp-3 !break-words leading-snug",
        },
        itemDescription?.textContent.trim() || ""
      )
    );
    // Add CTA link at the bottom if available
    if (itemLink) {
      const cta = div(
        { class: " !m-0 !p-0" },
        a(
          {
            href: itemLink?.getAttribute("href") || "#",
            target: itemLinkTarget.textContent.trim() ? "_blank" : "_self",
            class:
              "text-danaherpurple-500  [&_svg>use]:hover:stroke-danaherpurple-800  hover:text-danaherpurple-800 text-sm font-semibold",
          },
          `${itemLink.textContent.trim() || ""}`,
          span({
            class:
              "icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
          })
        )
      );
      opcoContent.append(cta);
    }
    cardWrapper.append(opcoContent);
    opcoGridWrapper.append(cardWrapper);
  });
  decorateIcons(opcoGridWrapper);
  block.textContent = "";
  block.append(opcoGridWrapper);
}

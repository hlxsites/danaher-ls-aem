import {
  createOptimizedPicture,
  decorateIcons,
} from "../../scripts/lib-franklin.js";
import { a, div, span } from "../../scripts/dom-builder.js";
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

  block.classList.add(
    ..."list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16".split(
      " "
    )
  );
  if (block.classList.contains("cols-4")) block.classList.add("lg:grid-cols-4");
  else block.classList.add("lg:grid-cols-3");

  [...block.children].forEach((row) => {
    let type = "";
    const heading = row.querySelector("h2");
    if (heading)
      heading.className =
        "opco-grid-item-title text-gray-900 my-2 font-extrabold text-3xl py-2";

    const h3Heading = row.querySelector("h3")?.textContent?.trim();
    const typeP = h3Heading?.previousElementSibling;
    if (typeP) {
      type = typeP.textContent;
      typeP.remove();
      block.classList.add(type.toLowerCase());
    }

    const readMoreLink = row.querySelector("a");
    const cardWrapper = readMoreLink
      ? a({ href: makePublicUrl(readMoreLink.href), title: readMoreLink.title })
      : div();

    cardWrapper.className =
      "opco-grid-wrapper mt-12 flex flex-col col-span-1 mx-auto justify-center max-w-xl overflow-hidden pl-8 pr-2 border-l-[0.5px] border-gray-300 transform transition duration-500 hover:scale-105";
    // if (!block.classList.contains("opco"))
    //   cardWrapper.classList.remove(
    //     ..."border-l-[0.5px]
    //  border-gray-300 pl-8 pr-2 transform
    // transition duration-500 hover:scale-105".split(
    //       " "
    //     )
    //   );
    if (!type) {
      cardWrapper.classList.add(
        "cursor-pointer relative transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg".split(
          " "
        )
      );
    }

    row.append(heading || "");

    // Remove any duplicate link from DOM before rebuilding
    const existingLink = row.querySelector('p[data-aue-prop="card_href"]');
    const existingLabel = row.querySelector('p[data-aue-prop="card_hrefText"]');
    const linkText = existingLink?.textContent?.trim();
    const linkLabel = existingLabel?.textContent?.trim();
    if (existingLink) existingLink.remove();
    if (existingLabel) existingLabel.remove();

    [...row.children].forEach((elem) => {
      cardWrapper.append(elem);
      elem.querySelector('[data-aue-prop="card_alt"]')?.remove();
      const aTags = elem.querySelectorAll("a");

      aTags?.forEach((anchor) => {
        anchor?.classList.add(
          "card-link",
          "inline-flex",
          "w-full",
          "items-center",
          "pt-5",
          "text-base",
          "text-danaherpurple-500",
          "font-semibold"
        );
        anchor?.classList.remove("btn", "btn-outline-primary");
        anchor?.insertAdjacentElement(
          "beforeend",
          span({
            class:
              "icon icon-arrow-right  w-4 h-4 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
          })
        );
      });
      // Style image container
      if (elem.querySelector("picture, img")) {
        elem.className = "opco-grid-item-image h-40 leading-5 mb-0";
      } else {
        elem.className = "opco-grid-item-body p-4 bg-white rounded-b px-0 py-2";
      }

      const h3 = elem?.querySelector("h3");
      const para = elem?.querySelector("p");

      if (para && para.dataset?.aueProp !== "card_href") {
        para.className =
          "text-gray-700 mb-4 text-base font-extralight !h-16 !line-clamp-3 !break-words leading-snug";
      }

      if (h3) {
        h3.className = "!line-clamp-2 !h-16 mt-0";
      }

      row.append(cardWrapper);
    });
    decorateIcons(cardWrapper);
    // Add CTA link at the bottom if available
    if (linkText && linkLabel) {
      const cta = div(
        { class: "pl-2 pt-2" },
        a(
          {
            href: linkText,
            class: "text-blue-600 text-sm font-semibold",
          },
          `${linkLabel}`
        )
      );
      cardWrapper.querySelector("div.opco-grid-item-body")?.append(cta);
    }
  });

  // Replace raw <img> with optimized picture
  block.querySelectorAll("img").forEach((img) => {
    const picture = img.closest("picture");
    const cardImage = createOptimizedPicture(img.src, img.alt, false, [
      { width: "750" },
    ]);
    if (block.classList.contains("opco")) {
      cardImage.querySelector("img").className =
        "h-48 w-full rounded-t !object-contain";
    }
    if (picture) picture.replaceWith(cardImage);
  });
}

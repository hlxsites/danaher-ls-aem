import { div, p, img, a, span } from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const titleEl = block.querySelector('[data-aue-prop="offer_title"]');
  const imgEl = block.querySelector('img[data-aue-prop="fileReference"]');
  const linkTextEl = block.querySelector("a");
  const linkLabelEl = block.querySelector('[data-aue-prop="linkLabel"]');
  const bgColorEl = block.querySelector('[data-aue-prop="bg-color"]');

  const title = titleEl?.textContent?.trim().replace(/<[^>]*>/g, "") || "";
  const imgSrc = imgEl?.getAttribute("src").replace(/<[^>]*>/g, "") || "";
  const imgAlt = imgEl?.getAttribute("alt") || "Banner image";
  const linkText =
    linkTextEl?.textContent?.trim().replace(/<[^>]*>/g, "") || "";
  const linkLabel =
    linkLabelEl?.textContent?.trim().replace(/<[^>]*>/g, "") || "";
  const bgColor =
    bgColorEl?.textContent?.trim().replace(/<[^>]*>/g, "") || "#E5E7EB";

  const bannerSection = div(
    {
      style: `background-color: ${bgColor};`,
      class:
        "flex flex-col md:flex-row items-start md:items-center gap-16  dhls-container mx-5 dhlsBp:mx-auto p-6 md:p-12",
    },

    // Logo
    imgSrc
      ? img({
          src: imgSrc.replace(/<[^>]*>/g, ""),
          alt: imgAlt.replace(/<[^>]*>/g, ""),
          class: "h-16 w-auto",
        })
      : "",

    // Text Block
    div(
      { class: "flex flex-col items-start max-w-3xl" },

      // Main Message
      p({ class: "text-3xl font-medium text-black leading-10 md:pl-8" }, title),

      // Discover Link
      linkText
        ? a(
            {
              href: linkTextEl || "#",
              class:
                "text-base text-danaherpurple-500 font-semibold mt-4 flex items-center  md:pl-8",
            },
            linkLabel || "",
            span({
              class:
                "icon icon-arrow-right  dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
            })
          )
        : ""
    )
  );
  decorateIcons(bannerSection);
  block.innerHTML = "";
  block.appendChild(bannerSection);
}

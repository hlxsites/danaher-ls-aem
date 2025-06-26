import { div, span } from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const addressSectionContent = block.querySelector(
    '[data-aue-prop="brandaddress"]'
  );
  addressSectionContent?.classList.add(
    "flex",
    "flex-col",
    "gap-4",
    "text-black",
    "text-base",
    "text-black",
    "leading-snug",
    "items-start"
  );
  const addressSectionAnchor =
    addressSectionContent?.querySelectorAll("a") ?? [];
  if (addressSectionAnchor.length) {
    addressSectionAnchor?.forEach((anchor) => {
      const linkHref = anchor?.getAttribute("href");
      anchor.setAttribute(
        "target",
        linkHref?.includes("http") ? "_blank" : "_self"
      );
      anchor?.classList.add(
        "text-danaherpurple-500",
        "cursor-pointer",
        "hover:text-danaherpurple-800",
        "[&_svg>use]:hover:stroke-danaherpurple-800",
        "text-base",
        "font-semibold",
        "flex",
        "items-center",
        "leading-snug",
        "link"
      );
      anchor?.classList.remove("btn", "btn-outline-primary");
      anchor?.parentElement?.classList.remove("btn", "btn-outline-primary");
      anchor.textContent = anchor.textContent.replace(/->/g, "");
      anchor?.append(
        span({
          class:
            "icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
        })
      );
    });
  }
  const callSectionContent = block.querySelector(
    '[data-aue-prop="callDescription"]'
  );
  callSectionContent?.classList.add(
    "flex",
    "flex-col",
    "gap-4",
    "text-black",
    "text-base",
    "text-black",
    "leading-snug",
    "items-start"
  );
  const callSectionAnchor = callSectionContent?.querySelectorAll("a") ?? [];
  if (callSectionAnchor.length) {
    callSectionAnchor?.forEach((anchor) => {
      const linkHref = anchor?.getAttribute("href");
      anchor.setAttribute(
        "target",
        linkHref?.includes("http") ? "_blank" : "_self"
      );
      anchor?.classList.add(
        "text-danaherpurple-500",
        "cursor-pointer",
        "hover:text-danaherpurple-800",
        "[&_svg>use]:hover:stroke-danaherpurple-800",
        "text-base",
        "font-semibold",
        "flex",
        "items-center",
        "leading-snug",
        "link"
      );
      anchor?.classList.remove("btn", "btn-outline-primary");
      anchor?.parentElement?.classList.remove("btn", "btn-outline-primary");
      anchor.textContent = anchor.textContent.replace(/->/g, "");
      anchor?.append(
        span({
          class:
            "icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
        })
      );
    });
  }

  const browseDescriptionContent = block.querySelector(
    '[data-aue-prop="browseDescription"]'
  );
  browseDescriptionContent?.classList.add(
    "flex",
    "flex-col",
    "gap-4",
    "text-black",
    "text-base",
    "text-black",
    "leading-snug",
    "items-start"
  );
  const browseDescriptionAnchor =
    browseDescriptionContent?.querySelectorAll("a") ?? [];

  if (browseDescriptionAnchor.length) {
    browseDescriptionAnchor?.forEach((anchor) => {
      const linkHref = anchor?.getAttribute("href");
      anchor.setAttribute(
        "target",
        linkHref?.includes("http") ? "_blank" : "_self"
      );
      anchor?.classList.add(
        "text-danaherpurple-500",
        "cursor-pointer",
        "hover:text-danaherpurple-800",
        "[&_svg>use]:hover:stroke-danaherpurple-800",
        "text-base",
        "font-semibold",
        "flex",
        "items-center",
        "leading-snug",
        "link"
      );
      anchor?.classList.remove("btn", "btn-outline-primary");
      anchor?.parentElement?.classList.remove("btn-outline-primary");
      anchor.textContent = anchor.textContent.replace(/->/g, "");
      anchor?.append(
        span({
          class:
            "icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
        })
      );
    });
  }
  const getText = (prop) =>
    block.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() ||
    "Learn more";

  // === Main Container
  const learnMoreContainer = div({
    class: " dhls-container px-5 lg:px-10 dhlsBp:p-0 mb-12",
  });

  // === Inner Flex Row
  const innerLearnMore = div({
    class: `
        md:pl-0 md:pr-0 
      flex flex-col md:flex-row justify-between items-start
      gap-6 md:gap-12 text-sm text-gray-700
    `.trim(),
  });

  // === Left: Title
  const titleLearnMore = div(
    { class: "min-w-[120px] font-medium text-black text-3xl leading-[1.5rem]" },
    getText("title")
  );

  // === Middle: SCIEX address
  // const addressNodes = getHTMLNodes("brandaddress");
  let addressSection = "";

  // === Right: Call & Browse
  let callSection = "";

  let browseSection = "";
  if (addressSectionContent) {
    addressSection = div({ class: "text-center md:text-left mt-2" });
    addressSection?.append(addressSectionContent);
  }
  if (callSectionContent) {
    callSection = div({ class: "space-y-1" });
    callSection?.append(callSectionContent);
  }
  if (browseDescriptionContent) {
    browseSection = div({ class: "space-y-1" });
    browseSection?.append(browseDescriptionContent);
  }
  const rightSection = div(
    { class: "space-y-6 text-right md:text-left mt-2" },
    callSection,
    browseSection
  );

  // === Assemble Columns
  innerLearnMore.append(titleLearnMore, addressSection, rightSection);
  learnMoreContainer.appendChild(innerLearnMore);

  decorateIcons(learnMoreContainer);
  block.appendChild(learnMoreContainer);
  // Hide authored content
  [...block.children].forEach((child) => {
    if (!child.contains(learnMoreContainer)) {
      child.style.display = "none";
    }
  });
}

import { div, span } from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

export default function decorate(block) {
  document
    .querySelector(".learn-more-wrapper")
    ?.parentElement?.removeAttribute("class");
  document
    .querySelector(".learn-more-wrapper")
    ?.parentElement?.removeAttribute("style");
  const addressSectionContent = block.querySelector(
    '[data-aue-label="Brand Address"]'
  );
  addressSectionContent.classList.add(
    "flex",
    "flex-col",
    "gap-4",
    "text-black",
    "text-base",
    "font-extralight",
    "leading-snug",
    "items-start"
  );
  const addressSectionAnchor =
    addressSectionContent?.querySelectorAll("a") || [];
  addressSectionAnchor?.forEach((anchor) => {
    anchor?.classList.add(
      "text-danaherpurple-500",
      "hover:underline",
      "cursor-pointer",
      "text-base",
      "font-semibold",
      "pb-8",
      "pt-8",
      "leading-snug",
      "link"
    );
    anchor?.classList.remove("btn", "btn-outline-primary");
    anchor.innerHtml = anchor.innerHtml.replace(
      /->/g,
      span({
        class:
          "icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
      })
    );
  });
  const callSectionContent = block.querySelector(
    '[data-aue-label="Call-Description"]'
  );
  callSectionContent.classList.add(
    "flex",
    "flex-col",
    "gap-4",
    "text-black",
    "text-base",
    "font-extralight",
    "leading-snug",
    "items-start"
  );
  const callSectionAnchor = callSectionContent?.querySelectorAll("a") || [];
  callSectionAnchor?.forEach((anchor) => {
    anchor?.classList.add(
      "text-danaherpurple-500",
      "hover:underline",
      "cursor-pointer",
      "text-base",
      "font-semibold",
      "pb-8",
      "pt-8",
      "leading-snug",
      "link"
    );
    anchor?.classList.remove("btn", "btn-outline-primary");
    anchor.innerHtml = anchor.innerHtml.replace(
      /->/g,
      span({
        class:
          "icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
      })
    );
  });

  const browseDescriptionContent = block.querySelector(
    '[data-aue-label="Browse-Description"]'
  );
  browseDescriptionContent.classList.add(
    "flex",
    "flex-col",
    "gap-4",
    "items-start"
  );
  const browseDescriptionAnchor =
    browseDescriptionContent?.querySelectorAll("a") || [];
  browseDescriptionAnchor?.forEach((anchor) => {
    anchor?.classList.add(
      "text-danaherpurple-500",
      "hover:underline",
      "cursor-pointer",
      "text-base",
      "font-semibold",
      "pb-8",
      "pt-8",
      "leading-snug",
      "link"
    );
    anchor?.classList.remove("btn", "btn-outline-primary");
    anchor.innerHtml = anchor.innerHtml.replace(
      /->/g,
      span({
        class:
          "icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
      })
    );
  });

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
    { class: "min-w-[120px] font-normal text-black text-3xl leading-10" },
    getText("title")
  );

  // === Middle: SCIEX address
  // const addressNodes = getHTMLNodes("brandaddress");
  const addressSection = div({ class: " text-center md:text-left mt-2" });

  // === Right: Call & Browse
  const callSection = div({ class: "space-y-1" });

  const browseSection = div({ class: "space-y-1" });
  addressSection.append(addressSectionContent);
  callSection.append(callSectionContent);
  browseSection.append(browseDescriptionContent);
  const rightSection = div(
    { class: "space-y-6 text-right md:text-left mt-2" },
    callSection,
    browseSection
  );

  // === Assemble Columns
  innerLearnMore.append(titleLearnMore, addressSection, rightSection);
  learnMoreContainer.appendChild(innerLearnMore);

  // === Final Render
  block.innerHTML = "";
  decorateIcons(learnMoreContainer);
  block.appendChild(learnMoreContainer);
}

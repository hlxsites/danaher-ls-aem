import { div } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  document
    .querySelector(".separator-line-wrapper")
    ?.parentElement?.removeAttribute("class");
  document.querySelector(".separator-line-wrapper");
  const bgColorContainer = block.querySelector('[data-aue-prop="bg-color"]');
  const separatorHeight = block.querySelector(
    '[data-aue-prop="separatorHeight"]'
  );

  const bgColor = bgColorContainer?.textContent?.trim() || "#E5E7EB";
  const height = separatorHeight?.textContent?.trim() || "1";

  const bannerSection = div(
    {
      style: `background-color: ${bgColor};height: ${height}px`,
      class: "mt-12 dhls-container p-[20px] md:p-0",
    },

    // Text Block
    div({ class: "flex flex-col items-start max-w-3xl" })
  );
  block.appendChild(bannerSection);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = "none";
    }
  });
}

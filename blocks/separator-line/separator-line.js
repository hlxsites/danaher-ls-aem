import { div } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const bgColorContainer = block.querySelector('[data-aue-prop="bg-color"]');
  const separatorHeight = block.querySelector(
    '[data-aue-prop="separatorHeight"]'
  );

  const bgColor = bgColorContainer?.textContent?.trim() || "#D1D5DB";
  const height = separatorHeight?.textContent?.trim() || "1";

  const separatorSection = div({
    style: `background-color: ${bgColor};height: ${height}px`,
    class: " dhls-container px-5 lg:px-10 dhlsBp:p-0 ",
  });
  block.innerHtml = "";
  block.textContent = "";
  block.append(separatorSection);
}

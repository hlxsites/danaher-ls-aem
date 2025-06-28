import { div } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");

  const [heightInput, bgColorInput] = block.children;
  const bgColorContainer = bgColorInput?.textContent?.trim() || "#D1D5DB";
  const separatorHeight = heightInput?.textContent?.trim() || "1";

  const bgColor = bgColorContainer;
  const height = separatorHeight;

  const separatorSection = div({
    style: `background-color: ${bgColor};height: ${height}px`,
    class: " dhls-container px-5 lg:px-10 dhlsBp:p-0 ",
  });
  block.innerHtml = "";
  block.appendChild(separatorSection);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(separatorSection)) {
      child.style.display = "none";
    }
  });
}

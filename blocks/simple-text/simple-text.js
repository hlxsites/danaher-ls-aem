import { div } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  document
    .querySelector(".simple-text-wrapper")
    ?.parentElement?.removeAttribute("class");
  document
    .querySelector(".simple-text-wrapper")
    ?.parentElement?.removeAttribute("style");
  const wrapper = block.closest(".simple-text-wrapper");

  const leftTextEl = wrapper.querySelector('[data-aue-label="Left-Text"]');
  const rightTextEl = wrapper.querySelector('[data-aue-label="Right-Text"]');

  // Create the left side
  const leftDiv = div(
    {
      class: "pl-0 p-4 font-normal text-3xl text-black md:w-1/2 leading-10",
    },
    leftTextEl?.textContent?.trim() || ""
  );

  // Create the right side
  const rightDiv = div(
    {
      class:
        "md:p-4 text-base text-black font-extralight md:w-1/2 leading-snug",
    },
    rightTextEl?.textContent?.trim() || ""
  );
  const simpleTextWrapper = div({
    class: "w-full pt-8 pl-0 pr-0 pb-0 m-0 flex flex-col md:flex-row",
  });
  simpleTextWrapper.append(leftDiv, rightDiv);
  // Wrap both in flex container
  const container = div(
    {
      class:
        "flex flex-wrap flex-col md:flex-row dhls-container md:p-0 dhls-mobile-spacing pt-12 border-t border-gray-300",
    },
    simpleTextWrapper
  );
  block.appendChild(container);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = "none";
    }
  });
}

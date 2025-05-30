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
      class: "pl-0 p-4 font-normal text-3xl text-black md:w-1/2",
    },
    leftTextEl?.textContent?.trim() || ""
  );

  // Create the right side
  const rightDiv = div(
    {
      class: "md:p-4 text-base text-gray-700 md:w-1/2",
    },
    rightTextEl?.textContent?.trim() || ""
  );

  // Wrap both in flex container
  const container = div(
    {
      class:
        "flex flex-wrap flex-col md:flex-row mx-auto max-w-[1238px] md:p-0 p-[20px] mt-12",
    },
    leftDiv,
    rightDiv
  );

  block.appendChild(container);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = "none";
    }
  });
}

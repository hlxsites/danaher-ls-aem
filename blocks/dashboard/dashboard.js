import { div, h1 } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const dashboardTitle = block.querySelector(
    "[data-aue-prop='dashboardTitle']"
  );

  const wrapper = div({
    class:
      "flex flex-col gap-5 bg-gray-100 md:flex-row w-full dhls-container lg:px-10 dhlsBp:p-0 items-center",
  });
  const content = div(
    {
      class: "bg-white flex items-center p-6 w-full md:w-[80%]",
    },
    h1({}, dashboardTitle ?? "")
  );
  const sidebar = div({
    class: "bg-white p-6 w-full md:w-[20%] flex flex-col items-center",
  });

  wrapper.append(sidebar, content);

  block.append(wrapper);
}

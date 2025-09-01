import { div } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
//   const quoteId = new URLSearchParams(window.location.search).get("quoteId");
//   console.log("quoteId", quoteId);
  const quoteDetailsWrapper = div({
    class: "w-[70%] inline-flex flex-col justify-start items-start gap-5 ",
  });
  const wrapper = div({
    id: "dashboardWrapper",
    class:
      "flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12",
  });
  //const dashboardSideBarContent = await dashboardSidebar();
  //wrapper.append(dashboardSideBarContent, quoteDetailsWrapper);
  block.textContent = "";
  block.append(wrapper);
}

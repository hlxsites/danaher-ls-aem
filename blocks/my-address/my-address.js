import { div } from "../../scripts/dom-builder.js";
import dashboardSidebar from "../dashboardSideBar/dashboardSideBar.js";
import { removePreLoader, showPreLoader } from "../../scripts/common-utils.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const wrapper = div({
    id: "dashboardWrapper",
    class:
      "flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12",
  });
  const dashboardSideBarContent = await dashboardSidebar();
  const quoteDetailsWrapper = div({
    class: "w-[70%] inline-flex flex-col justify-start items-start gap-5 ",
  });
  wrapper.append(dashboardSideBarContent, quoteDetailsWrapper);
  block.innerHTML = "";
  block.textContent = "";
  block.append(wrapper);
  decorateIcons(wrapper);
  removePreLoader();
}

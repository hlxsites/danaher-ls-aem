import dashboardSidebar from "../dashboardSideBar/dashboardSideBar.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import { showPreLoader, removePreLoader } from "../../scripts/common-utils.js";
import { div } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
    showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  document.querySelector("main").style = "background: #f4f4f4";
   const wrapper = div({
      id: 'dashboardWrapper',
      class:
            'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
    });
const requestedQuoteWrapper = div({
      class: 'w-[70%] self-stretch h-[831px] inline-flex flex-col justify-start items-start gap-5',
    });
      const dashboardSideBarContent = await dashboardSidebar();
      wrapper.append(dashboardSideBarContent, requestedQuoteWrapper);
      block.innerHTML = "";
      block.textContent = "";
      block.append(wrapper);
      decorateIcons(wrapper);
      removePreLoader();
}
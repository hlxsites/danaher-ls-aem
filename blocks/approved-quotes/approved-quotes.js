
import { div } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  document.querySelector("main").style = "background: #f4f4f4";
   const wrapper = div({
      id: 'dashboardWrapper',
      class:
            'flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12',
    });
      block.innerHTML = "";
      block.textContent = "";
      block.append(wrapper);
}
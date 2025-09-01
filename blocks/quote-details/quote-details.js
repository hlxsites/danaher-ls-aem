import { showPreLoader, removePreLoader } from "../../scripts/common-utils";

export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const quoteId = new URLSearchParams(window.location.search).get("quoteId");
  console.log("quoteId", quoteId);
  block.innerHTML = "";
  block.textContent = "";
  //   block.append(wrapper);
  //   decorateIcons(wrapper);
  removePreLoader();
}

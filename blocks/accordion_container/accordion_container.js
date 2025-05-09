import { div, span, img, p } from "../../scripts/dom-builder.js";

export default async function decorate(block) {

console.log("BLOCK", block);

const accordion_container_title = block.querySelector('[data-aue-prop="accordion_container_title"]')?.textContent.trim() || '';
const accordionBannerTitle = p(
    {
      class: "text-black text-4xl font-normal leading-[48px]",
    },
    accordion_container_title
  );

  block.innerHTML='';
  block.append(accordionBannerTitle);
}
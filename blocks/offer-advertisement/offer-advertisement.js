import { div, p, a } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  
  const titleEl = block.querySelector('[data-aue-prop="offer_advertisement_title"]')?.textContent;
  const linkTextEl = block.querySelector('[data-aue-prop="offer_link"]')?.textContent;
  const contentElements = [
    div(
      {
        class: "self-stretch justify-start text-black text-2xl font-bold font-normal leading-loose",
      },
      titleEl
    ),

    div(
      {
        class: "justify-start text-violet-600 text-base font-bold leading-snug",
      },
      a(
        {
          href: "#"
        },
        linkTextEl
      )
    ),
  ];

  const outerContainer = div(
    {
      class: " bg-gray-200 px-24 flex flex-col md:flex-row items-center bg-gray gap-16 max-w-[1200px]",
    },
    ...contentElements
  );

  block.innerHTML = "";
  block.appendChild(outerContainer);
}

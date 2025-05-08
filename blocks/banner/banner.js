import { div, p, a } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  const contentElements = [
    div(
      {
        class: "self-stretch justify-start text-black text-2xl font-bold font-normal leading-loose",
      },
      "Buys a Light microscope get $200 in accessories"
    ),

    div(
      {
        class: "justify-start text-violet-600 text-base font-bold leading-snug",
      },
      a(
        {
          href: "#",
          class: "hover:underline",
        },
        "Learn More →"
      )
    ),
  ];

  const outerContainer = div(
    {
      class: "self-stretch px-12 w-full py-8 bg-gray-200 inline-flex justify-between items-center gap-6",
    },
    ...contentElements
  );

  block.innerHTML = "";
  block.appendChild(outerContainer);
}

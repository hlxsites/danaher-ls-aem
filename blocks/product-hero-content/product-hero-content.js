import { div } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  const subProductData = [
    {
      subProductTitle: block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent,
      subProductDescription: block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML,
    },
  ];

  subProductData.forEach((banner) => {
    const { subProductTitle, subProductDescription } = banner;

    const leftDiv = div(
      {
        class: "w-96 flex justify-start items-center gap-12",
      },
      div(
        {
          class: "flex-1 text-black text-3xl font-normal leading-10",
        },
        subProductTitle || ""
      )
    );

    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = subProductDescription || "";

    tempContainer.querySelectorAll("p").forEach((paragraph) => {
      paragraph.classList.add("text-black", "mb-2");
    });

    tempContainer.querySelectorAll("a").forEach((link) => {
      link.classList.add("text-violet-600", "font-bold", "leading-snug", "inline");
    });

    const rightDiv = div(
      {
        class: "flex-1 self-stretch inline-flex flex-col justify-start items-start gap-4",
      },
      div(
        {
          class: "self-stretch h-16 justify-start",
        }
      )
    );

    const rightDivChild = rightDiv.querySelector("div");
    while (tempContainer.firstChild) {
      rightDivChild.appendChild(tempContainer.firstChild);
    }

    const innerContainer = div(
      {
        class: "self-stretch inline-flex justify-start items-start gap-5",
      },
      leftDiv,
      rightDiv
    );

    const outerContainer = div(
      {
        class: "self-stretch py-12 bg-white border-b border-gray-400 inline-flex flex-col justify-center items-start gap-12 overflow-hidden",
      },
      innerContainer
    );

    block.innerHTML = "";
    block.appendChild(outerContainer);
  });
}
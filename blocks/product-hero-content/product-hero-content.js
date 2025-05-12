import {
  div,
  span,
} from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  
  const subProductData = [{
    subProductTitle: block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent,
    subProductDescription: block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML, // Use innerHTML to parse HTML
  }];

  
  subProductData.forEach((banner) => {
    const { subProductTitle, subProductDescription } = banner;

    const leftDiv = div(
      {
        class: 'w-1/4 flex justify-start text-black text-3xl font-normal leading-10',
      },
      subProductTitle || ''
    );

    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = subProductDescription || '';

    tempContainer.querySelectorAll("p").forEach((paragraph) => {
      paragraph.classList.add("text-black", "mb-2"); 
    });

    tempContainer.querySelectorAll("a").forEach((link) => {
      link.classList.add("text-violet-600", "font-medium", "hover:underline", "inline"); 
    });

    const rightDiv = div(
      {
        class: 'w-3/4 text-base font-extralight leading-snug', 
      }
    );
    rightDiv.innerHTML = tempContainer.innerHTML;

    const container = div(
      { class: 'flex flex-wrap max-w-[1200px]' },
      leftDiv,
      rightDiv
    );

    block.innerHTML = '';
    block.appendChild(container);
  });
}
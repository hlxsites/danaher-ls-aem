import {
  div,
  span,
} from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  console.log('product-hero-content.js', block);

  const subProductData = [{
    subProductTitle: block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent,
    subProductDescription: block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML, // Use innerHTML to preserve links
  }];

  console.log("block.querySelector", block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent);

  subProductData.forEach((banner) => {
    const { subProductTitle, subProductDescription } = banner;


    const leftDiv = div(
      {
        class: 'flex-1 justify-start text-black text-3xl font-normal leading-10',
      },
      subProductTitle || ''
    );

    // Create a temporary container to parse and style the HTML content
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = subProductDescription || '';

    // Style all paragraph elements to have black text
    tempContainer.querySelectorAll("p").forEach((paragraph) => {
      paragraph.classList.add("text-black");
    });

    // Style all links to have violet color
    tempContainer.querySelectorAll("a").forEach((link) => {
      link.classList.add("text-violet-600", "font-medium", "hover:underline");
    });

    // Create the right side with styled content
    const rightDiv = div(
      {
        class: 'text-black text-base font-extralight leading-snug',
      },
      tempContainer.innerHTML
    );

    // Wrap both in flex container
    const container = div(
      { class: 'flex flex-wrap max-w-[1200px]' },
      leftDiv,
      rightDiv
    );

    block.innerHTML = '';
    block.appendChild(container);
  });
}
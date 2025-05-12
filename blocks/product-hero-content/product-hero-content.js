import {
  div,
  span,
} from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  console.log('product-hero-content.js', block);

  const subProductData = [{
    subProductTitle: block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent,
    subProductDescription: block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML, // Use innerHTML initially to parse HTML
  }];

  console.log("block.querySelector", block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent);

  subProductData.forEach((banner) => {
    const { subProductTitle, subProductDescription } = banner;

    // Create the left side (title) with 25% width
    const leftDiv = div(
      {
        class: 'w-1/4 flex justify-start text-black text-3xl font-normal leading-10', // 25% width
      },
      subProductTitle || ''
    );

    // Create a temporary container to parse the HTML content
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = subProductDescription || '';

    // Style paragraphs and links (for reference, though we'll use textContent)
    tempContainer.querySelectorAll("p").forEach((paragraph) => {
      paragraph.classList.add("text-black");
    });

    tempContainer.querySelectorAll("a").forEach((link) => {
      link.classList.add("text-violet-600", "font-medium", "hover:underline");
    });

    // Extract plain text from the HTML content
    const descriptionText = tempContainer.textContent || '';

    // Create the right side with plain text and 75% width
    const rightDiv = div(
      {
        class: 'w-3/4 text-black text-base font-extralight leading-snug', // 75% width
      },
      descriptionText // Render as plain text
    );

    // Wrap both in a flex container
    const container = div(
      { class: 'flex flex-wrap max-w-[1200px]' },
      leftDiv,
      rightDiv
    );

    block.innerHTML = '';
    block.appendChild(container);
  });
}
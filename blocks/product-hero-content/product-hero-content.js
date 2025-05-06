import {
    div,
    span,
  } from "../../scripts/dom-builder.js";
export default async function decorate(block) {
console.log('product-hero-content.js',block);

// Create an array for the product hero data
const subProductData = [{
  subProductTitle: block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent ,
  subProductDescription: block.querySelector('[data-aue-prop="prod_hero_description"]')?.textContent
}];

console.log("block.querySelector", block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent);

subProductData.forEach((banner) => {
  const { subProductTitle, subProductDescription, subRead } = banner;

  const primaryAntibodies = div({
    class:
      "primary_antibodies self-stretch py-12 bg-white border-b border-gray-400 inline-flex flex-col justify-center items-start gap-12 overflow-hidden",
  });

  const primaryHeader = div({
    class:
      "primary_antibodies-header self-stretch flex flex-col justify-start items-start gap-5",
  });

  // Title Wrapper
  const primaryTitleWrapper = div(
    {
      class: "self-stretch inline-flex justify-start items-center gap-12",
    },
    div(
      {
        class:
          'flex-1 justify-start text-black text-3xl font-normal leading-10',
      },
      subProductTitle
    )
  );

  // Description Section
  const primaryDescription = div(
    {
      class: "self-stretch flex flex-col justify-start items-start gap-4",
    },
    div(
      {
        class: "self-stretch justify-start",
      },
      span(
        {
          class: 'text-black text-base font-extralight leading-snug',
        },
        subProductDescription
      ),
      span(
        {
          class: 'text-violet-600 text-base font-bold leading-snug',
        },
        subRead
      )
    )
  );

  primaryHeader.append(primaryTitleWrapper, primaryDescription);
  primaryAntibodies.append(primaryHeader);

  block.append(primaryAntibodies);
});

}
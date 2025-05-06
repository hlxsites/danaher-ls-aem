
export default async function decorate(block) {
console.log('product-hero-content.js',block);

// Create an array for the product hero data
const subProductData = [{
  subProductTitle: block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent || "Primary Antibodies",
  subProductDescription: block.querySelector('[data-aue-prop="prod_hero_description"]')?.textContent ||
    "Our extensive primary antibody catalog features widely referenced monoclonal and polyclonal antibodies, along with an exceptional selection of recombinant monoclonal antibodies. Additionally, we provide a wide selection of fluorescently conjugated antibodies and carrier-free, conjugation-ready antibodies.",
  subRead: "Read More",
}];

console.log("block.querySelector", block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent);

// Iterating through the subProductData
subProductData.forEach((banner) => {
  const { subProductTitle, subProductDescription, subRead } = banner;

  // ---- Primary Antibodies Section ----
  const primaryAntibodies = div({
    class:
      "primary_antibodies self-stretch py-12 bg-white border-b border-gray-400 inline-flex flex-col justify-center items-start gap-12 overflow-hidden",
  });

  // Primary Header Section
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

  // Append everything into the primaryAntibodies div
  primaryHeader.append(primaryTitleWrapper, primaryDescription);
  primaryAntibodies.append(primaryHeader);

  // Finally, append the primaryAntibodies block to the parent container (block)
  block.append(primaryAntibodies);
});

}
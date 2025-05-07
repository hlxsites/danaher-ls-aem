import {
    div,
    ul,
    li,
    span,
  } from "../../scripts/dom-builder.js";
  
  export default async function decorate(block) {
    console.log('product-info-content.js', block);
  
    // Extract heading and description list items
    const titleEl = block.querySelector('[data-aue-prop="prod_info_title"]');
    const descEl = block.querySelector('[data-aue-prop="prod_info_description"]');
  
    const sectionLabel = titleEl?.textContent?.trim().toUpperCase() || 'FEATURES';
  
    // Collect <li> items from the richtext area
    const contentListItems = [...descEl.querySelectorAll('li')].map((liEl) =>
      li({ class: "self-stretch justify-start" }, liEl.textContent.trim())
    );
  
    const productInfoFooter = div({
      class:
        "self-stretch flex flex-col justify-start items-start gap-12 pt-12 px-4 md:px-0",
    });
  
    const sectionWrapper = ul({
      class: "w-full flex flex-col justify-start items-start gap-10",
    });
  
    // Build the single 'features' section layout
    const sectionElement = li(
      {
        class:
          "self-stretch flex flex-col lg:flex-row justify-start items-start gap-6 mb-5",
      },
      div(
        {
          class: 'w-full lg:w-96 justify-start text-black text-4xl leading-[48px]',
        },
        sectionLabel
      ),
      div(
        {
          class: "w-full lg:w-[921px] flex flex-col justify-start items-start gap-4",
        },
        ul(
          {
            class: 'ml-10 self-stretch justify-start leading-8 list-disc text-xl font-normal text-black leading-loose',
          },
          ...contentListItems
        )
      )
    );
  
    sectionWrapper.append(sectionElement);
    productInfoFooter.append(sectionWrapper);
    block.innerHTML = ""; 
    block.appendChild(productInfoFooter);
  }
  
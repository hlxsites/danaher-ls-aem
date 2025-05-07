import {
    div,
    ul,
    li,
    span,
  } from "../../scripts/dom-builder.js";
  
  export default async function decorate(block) {
    console.log('product-info-content.js', block);
  
    // Extract from block
    const titleEl = block.querySelector('[data-aue-prop="prod_info_title"]');
    const descEl = block.querySelector('[data-aue-prop="prod_info_description"]');
  
    const title = titleEl?.textContent?.trim() || '';
    const contentListItems = [...descEl.querySelectorAll('li')].map((li) =>
      li.textContent.trim()
    ).filter(Boolean); // Remove empty strings
  
    const data = {
      features: {
        title,
        content: contentListItems,
      },
    };
  
    const splitContentToLi = (contentArray) =>
      contentArray.map((text) =>
        li({ class: "self-stretch justify-start" }, text)
      );
  
    const productInfoFooter = div({
      class:
        "self-stretch flex flex-col justify-start items-start gap-12 pt-12 px-4 md:px-0",
    });
  
    const sectionWrapper = ul({
      class: "w-full flex flex-col justify-start items-start gap-10",
    });
  
    Object.entries(data).forEach(([sectionKey, sectionData]) => {
      const sectionElement = li(
        {
          class:
            "self-stretch flex flex-col lg:flex-row justify-start items-start gap-6 mb-5",
        },
        div(
          {
            class: 'w-full lg:w-96 justify-start text-black text-4xl leading-[48px]',
          },
          sectionKey.toUpperCase()
        ),
        div(
          {
            class: "w-full lg:w-[921px] flex flex-col justify-start items-start gap-4",
          },
          div(
            {
              class: 'self-stretch mt-2 text-black text-2xl font-bold leading-snug',
            },
            sectionData.title
          ),
          ul(
            {
              class: 'ml-10 self-stretch justify-start leading-8 list-disc text-xl font-normal text-black leading-loose',
            },
            ...splitContentToLi(sectionData.content)
          )
        )
      );
  
      sectionWrapper.append(sectionElement);
    });
  
    productInfoFooter.append(sectionWrapper);
    block.innerHTML = '';
    block.appendChild(productInfoFooter);
  }
  
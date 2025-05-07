import { div, ul, li, span } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  console.log('product-info-content.js', block);

  // Extract heading and description list items
  const titleEl = block.querySelector('[data-aue-prop="prod_info_title"]');
  const descEl = block.querySelector('[data-aue-prop="prod_info_description"]');

  const sectionLabel = titleEl?.textContent?.trim().toUpperCase() ;
  const contentElements = [];

  const ulEl = descEl.querySelector('ul');
  if (ulEl) {
    const listItems = [...ulEl.querySelectorAll('li')].map((liEl) =>
      li({ class: "self-stretch justify-start" }, liEl.textContent.trim())
    );
    contentElements.push(...listItems);
  } else {
    // If no <ul> exists, process <div> elements with <b> tags
    const divs = [...descEl.querySelectorAll('div')];
    divs.forEach((divEl) => {
      const boldText = divEl.querySelector('b');
      if (boldText) {
        const spanEl = span({ class: "font-bold" }, boldText.textContent.trim());
        contentElements.push(spanEl);
      }
    });
  }

  const productInfoFooter = div({
    class: "self-stretch flex flex-col justify-start items-start gap-12 pt-12 px-4 md:px-0",
  });

  const sectionWrapper = ul({
    class: "w-full flex flex-col justify-start items-start gap-10",
  });

  const sectionElement = li(
    {
      class: "self-stretch flex flex-col lg:flex-row justify-start items-start gap-6 mb-5",
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
      ...contentElements
    )
  );

  sectionWrapper.append(sectionElement);
  productInfoFooter.append(sectionWrapper);
  block.innerHTML = "";
  block.appendChild(productInfoFooter);
}

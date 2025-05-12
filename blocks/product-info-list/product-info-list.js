import { div, ul, li, span } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  const titleEl = block.querySelector('[data-aue-prop="prod_info_title"]');
  const descEl = block.querySelector('[data-aue-prop="prod_info_description"]');
  const sectionLabel = titleEl?.textContent?.trim();

  const contentElements = [];

  descEl.childNodes.forEach((node) => {
    if (node.nodeName === 'P') {
      const pContent = [];
      node.childNodes.forEach((child) => {
        if (child.nodeName === 'STRONG') {
          pContent.push(span({ class: 'font-bold' }, child.textContent.trim()));
        } else if (child.nodeType === Node.TEXT_NODE) {
          pContent.push(child.textContent.trim());
        }
      });
      contentElements.push(div({ class: 'text-xl leading-loose text-black' }, ...pContent));
    } else if (node.nodeName === 'UL') {
      const listItems = [...node.querySelectorAll('li')].map((liEl) => {
        const liContent = [];
        liEl.childNodes.forEach((child) => {
          if (child.nodeName === 'STRONG') {
            liContent.push(span({ class: 'font-bold' }, child.textContent.trim()));
          } else if (child.nodeType === Node.TEXT_NODE) {
            liContent.push(child.textContent.trim());
          }
        });
        return li({ class: 'ml-10 list-disc text-xl font-normal text-black leading-loose' }, ...liContent);
      });
      contentElements.push(ul({ class: 'w-full flex flex-col justify-start items-start gap-10' }, ...listItems));
    }
  });

  const productInfoFooter = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-12 pt-12 px-4 md:px-0',
  });

  const sectionWrapper = ul({
    class: 'w-full flex flex-col justify-start items-start gap-10',
  });

  const sectionElement = li(
    { class: 'self-stretch flex flex-col lg:flex-row justify-start items-start gap-6 mb-5' },
    div(
      { class: 'w-full lg:w-96 justify-start text-black text-3xl leading-[48px] font-bold' },
      sectionLabel
    ),
    div(
      { class: 'w-full lg:w-[921px] flex flex-col justify-start items-start gap-4' },
      ...contentElements
    )
  );

  sectionWrapper.append(sectionElement);
  productInfoFooter.append(sectionWrapper);
  block.innerHTML = '';
  block.appendChild(productInfoFooter);
  
  const lineBr = div({
    class: "w-full h-px bg-gray-400 mt-10",
  })
  block.append(lineBr)
}
import {
  div, ul, li, span,
} from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const productInfoListWrapper = div({
    class: 'dhls-container mx-auto flex flex-col md:flex-row gap-6',
  });
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
      contentElements.push(div({ class: 'text-xl leading-relaxed text-black font-extralight' }, ...pContent));
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
        return li({ class: 'list-disc text-xl font-normal text-black leading-loose' }, ...liContent);
      });
      contentElements.push(ul({ class: 'w-full pl-10 lg:pl-8 break-words flex flex-col justify-start items-start' }, ...listItems));
    }
  });

  const productInfoFooter = div({
    class: 'flex flex-col justify-start gap-12 px-5 md:px-0',
  });

  const sectionWrapper = ul({
    class: 'w-full flex flex-col justify-start gap-10',
  });

  const sectionElement = li(
    { class: 'flex flex-col lg:flex-row justify-start gap-x-5' },
    div(
      { class: 'w-full lg:w-[400px] justify-start leading-[48px] font-medium text-3xl text-black lg:leading-10' },
      sectionLabel,
    ),
    div(
      { class: 'w-full lg:w-[819px] flex flex-col justify-start items-start gap-4' },
      ...contentElements,
    ),
  );

  sectionWrapper.append(sectionElement);
  productInfoFooter.append(sectionWrapper);
  productInfoListWrapper.appendChild(productInfoFooter);
  block.innerHTML = '';
  block.appendChild(productInfoListWrapper);
}

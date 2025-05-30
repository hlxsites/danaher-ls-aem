import {
  div, ul, li, span,
} from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  document
    .querySelector('.product-info-list-wrapper')
    ?.parentElement?.removeAttribute('class');
  document
    .querySelector('.product-info-list-wrapper')
    ?.parentElement?.removeAttribute('style');
  const productInfoListWrapper = div({
    class: 'max-w-[1238px] mx-auto flex flex-col md:flex-row gap-6 mt-12',
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
        return li({ class: 'list-disc text-xl font-normal text-black leading-loose' }, ...liContent);
      });
      contentElements.push(ul({ class: 'w-full pl-10 lg:pl-0 break-words flex flex-col justify-start items-start' }, ...listItems));
    }
  });

  const productInfoFooter = div({
    class: 'flex flex-col max-w-[1238px] justify-start gap-12 px-4 md:px-0',
  });

  const sectionWrapper = ul({
    class: 'w-full flex flex-col justify-start gap-10',
  });

  const sectionElement = li(
    { class: 'flex flex-col lg:flex-row justify-start gap-x-6' },
    div(
      { class: 'w-full lg:w-96 justify-start text-black text-4xl leading-[48px] font-normal lg:text-2xl lg:leading-10' },
      sectionLabel,
    ),
    div(
      { class: 'w-full lg:w-[921px] flex flex-col justify-start items-start gap-4' },
      ...contentElements,
    ),
  );

  sectionWrapper.append(sectionElement);
  productInfoFooter.append(sectionWrapper);
  productInfoListWrapper.appendChild(productInfoFooter);
  block.innerHTML = '';
  block.appendChild(productInfoListWrapper);

  const lineBr = div({
    class: 'w-[1238px] mx-auto h-px bg-gray-400 my-12',
  });
  block.append(lineBr);
}

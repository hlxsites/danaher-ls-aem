import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const productInfoListWrapper = div({
    class: 'dhls-container px-5 lg:px-0',
  });
  const titleEl = block.querySelector(
    '[data-aue-prop="prod_info_title"]',
  )?.innerHTML;
  const descEl = block.querySelector('[data-aue-prop="prod_info_description"]');
  if (descEl) {
    descEl.querySelectorAll('p').forEach((pEle) => {
      pEle.classList.add(...'text-base font-extralight'.split(' '));
    });
  }
  const ulEle = block.querySelector('ul');
  if (ulEle) {
    ulEle.classList.add(...'list-disc pl-8 font-extralight'.split(' '));
  }
  const productInfoList = div(
    {
      class: 'product-info-list flex flex-col lg:flex-row justify-start gap-5',
    },
    div({ class: 'product-info-left lg:w-[400px]' }),
    div({ class: 'product-info-right lg:w-[840px]' }),
  );
  productInfoList.querySelector('.product-info-left').innerHTML = titleEl;
  productInfoList.querySelector('.product-info-right').innerHTML = descEl.innerHTML;
  productInfoListWrapper.appendChild(productInfoList);
  block.innerHTML = '';
  block.appendChild(productInfoListWrapper);
}

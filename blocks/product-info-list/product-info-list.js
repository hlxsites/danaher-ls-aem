import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const productInfoListWrapper = div({
    class: 'dhls-container px-5 lg:px-0',
  });
  const titleP = block?.firstElementChild?.firstElementChild?.firstElementChild;
  const titleEl = titleP?.textContent.trim() || '';
  if (titleEl && titleP) {
    titleP.remove();
  }
  const descElString = block?.innerHTML || '';
  let descEl = '';
  if (descElString) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = descElString;
    tempDiv.querySelectorAll('p').forEach((pEle) => {
      pEle.classList.add('text-base', 'font-extralight');
    });
    const ulEle = tempDiv.querySelector('ul');
    if (ulEle) {
      ulEle.classList.add(...'list-disc pl-8 font-extralight'.split(' '));
    }
    descEl = tempDiv.innerHTML;
  }
  const productInfoList = div(
    {
      class: 'product-info-list flex flex-col lg:flex-row justify-start gap-5',
    },
    div({ class: 'product-info-left lg:w-[400px] !font-medium !text-black !text-[32px] !leading-10' }),
    div({ class: 'product-info-right lg:w-[840px]' }),
  );
  const productInfoLeft = productInfoList.querySelector('.product-info-left');
  productInfoLeft.textContent = titleEl;
  const target = productInfoList.querySelector('.product-info-right');
  if (target) {
    target.innerHTML = descEl;
  }
  productInfoListWrapper.appendChild(productInfoList);
  productInfoList?.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    el.style.margin = '0';
    el.style.padding = '0';
  });
  block.innerHTML = '';
  block.appendChild(productInfoListWrapper);
}

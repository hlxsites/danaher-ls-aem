import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const [leftText, rightText] = block.children;

  const leftTextEl = leftText?.innerHTML || '';
  const rightTextEl = rightText?.innerHTML || '';

  let leftDiv = div();
  if (leftTextEl) {
    // Create the left side
    leftDiv = div({
      class: 'pl-0  font-medium text-3xl text-black md:w-1/2 leading-10',
    });
    leftDiv.insertAdjacentHTML('beforeend', leftTextEl);
    const descriptionLinks = leftDiv?.querySelectorAll('a');
    descriptionLinks?.forEach((link) => {
      const linkHref = link?.getAttribute('href');
      link.setAttribute(
        'target',
        linkHref.includes('http') ? '_blank' : '_self',
      );
    });
  }
  let rightDiv = div();
  if (rightTextEl) {
    // Create the right side
    rightDiv = div({
      class: 'text-base text-black md:w-1/2 font-normal leading-snug mt-1',
    });
    rightDiv.insertAdjacentHTML('beforeend', rightTextEl);
    const descriptionLinks = rightDiv?.querySelectorAll('a');
    descriptionLinks?.forEach((link) => {
      const linkHref = link?.getAttribute('href');
      link.setAttribute(
        'target',
        linkHref.includes('http') ? '_blank' : '_self',
      );
    });
  }
  const simpleTextWrapper = div({
    class: 'w-full pl-0 pr-0 pb-0 m-0 flex flex-col md:flex-row gap-6',
  });
  simpleTextWrapper.append(leftDiv, rightDiv);
  // Wrap both in flex container
  const container = div(
    {
      class:
        'flex flex-wrap flex-col md:flex-row  dhls-container px-5 lg:px-10 dhlsBp:p-0 ',
    },
    simpleTextWrapper,
  );
  block.textContent = '';
  block.append(container);
}

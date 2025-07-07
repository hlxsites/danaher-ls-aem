import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
<<<<<<< HEAD
  const [leftText, rightText] = block.children;

  const leftTextEl = leftText?.innerHTML || '';
  const rightTextEl = rightText?.innerHTML || '';
=======
  const wrapper = block.closest('.simple-text-wrapper');

  const leftTextEl = wrapper.querySelector(
    '[data-aue-prop="leftText"]',
  )?.innerHTML;
  const rightTextEl = wrapper.querySelector(
    '[data-aue-prop="rightText"]',
  )?.innerHTML;
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

  let leftDiv = div();
  if (leftTextEl) {
    // Create the left side
    leftDiv = div({
      class: 'pl-0  font-medium text-3xl text-black md:w-1/2 leading-10',
    });
    leftDiv.insertAdjacentHTML('beforeend', leftTextEl);
<<<<<<< HEAD
    leftDiv.querySelectorAll('p')?.forEach((ite, inde, arr) => {
      if (inde !== arr.length - 1) {
        ite.classList.add('pb-4');
      }
      if (ite?.textContent?.trim() === '') {
        ite.remove();
      }
    });
    const descriptionLinks = leftDiv?.querySelectorAll('a');
    descriptionLinks?.forEach((link) => {
      link.classList.add(
        'text-black',
        'underline',
        'decoration-danaherpurple-500',
        'hover:bg-danaherpurple-500',
        'hover:text-white',
      );
      const linkHref = link?.getAttribute('href');
      link.setAttribute(
        'target',
        linkHref.includes('http') ? '_blank' : '_self',
      );
    });
=======
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  }
  let rightDiv = div();
  if (rightTextEl) {
    // Create the right side
    rightDiv = div({
<<<<<<< HEAD
      class: 'text-base text-black md:w-1/2 font-normal leading-snug mt-1',
    });
    rightDiv?.insertAdjacentHTML('beforeend', rightTextEl);
    rightDiv?.querySelectorAll('p')?.forEach((ite, inde, arr) => {
      if (inde !== arr.length - 1) {
        ite.classList.add('pb-4');
      }
      if (ite?.textContent?.trim() === '') {
        ite.remove();
      }
    });
    const descriptionLinks = rightDiv?.querySelectorAll('a');
    descriptionLinks?.forEach((link) => {
      link.classList.add(
        'text-black',
        'underline',
        'decoration-danaherpurple-500',
        'hover:bg-danaherpurple-500',
        'hover:text-white',
      );
      const linkHref = link?.getAttribute('href');
      link.setAttribute(
        'target',
        linkHref.includes('http') ? '_blank' : '_self',
      );
    });
=======
      class: 'text-base text-black font-extralight md:w-1/2 leading-snug mt-1',
    });
    rightDiv.insertAdjacentHTML('beforeend', rightTextEl);
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD
  block.textContent = '';
  block.append(container);
=======
  block.appendChild(container);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = 'none';
    }
  });
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
}

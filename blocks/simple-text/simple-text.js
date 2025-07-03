import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Prevent multiple decoration on repeated editor re-renders

  if (block.dataset.decorated) return;

  block.dataset.decorated = 'true';

  // Clean up block

  block.textContent = '';

  // Clean parent

  const parent = block?.parentElement?.parentElement;

  parent?.removeAttribute('class');

  parent?.removeAttribute('style');

  // Get block's raw children once

  const rawChildren = [...block.children];

  const leftTextEl = rawChildren[0]?.innerHTML || '';

  const rightTextEl = rawChildren[1]?.innerHTML || '';

  // Left side

  const leftDiv = div({
    class: 'pl-0 font-medium text-3xl text-black md:w-1/2 leading-10',
  });

  if (leftTextEl) {
    leftDiv.insertAdjacentHTML('beforeend', leftTextEl);

    leftDiv.querySelectorAll('p').forEach((p, i, arr) => {
      if (i !== arr.length - 1) p.classList.add('pb-4');

      if (!p.textContent.trim()) p.remove();
    });

    leftDiv.querySelectorAll('a').forEach((link) => {
      link.classList.add(
        'text-black',

        'underline',

        'decoration-danaherpurple-500',

        'hover:bg-danaherpurple-500',

        'hover:text-white'
      );

      link.setAttribute(
        'target',

        link.href.includes('http') ? '_blank' : '_self'
      );
    });
  }

  // Right side

  const rightDiv = div({
    class: 'text-base text-black md:w-1/2 font-normal leading-snug mt-1',
  });

  if (rightTextEl) {
    rightDiv.insertAdjacentHTML('beforeend', rightTextEl);

    rightDiv.querySelectorAll('p').forEach((p, i, arr) => {
      if (i !== arr.length - 1) p.classList.add('pb-4');

      if (!p.textContent.trim()) p.remove();
    });

    rightDiv.querySelectorAll('a').forEach((link) => {
      link.classList.add(
        'text-black',

        'underline',

        'decoration-danaherpurple-500',

        'hover:bg-danaherpurple-500',

        'hover:text-white'
      );

      link.setAttribute(
        'target',

        link.href.includes('http') ? '_blank' : '_self'
      );
    });
  }

  // Wrap

  const simpleTextWrapper = div(
    {
      class: 'w-full pl-0 pr-0 pb-0 m-0 flex flex-col md:flex-row gap-6',
    },
    leftDiv,
    rightDiv
  );

  const container = div(
    {
      class:
        'flex flex-wrap flex-col md:flex-row dhls-container px-5 lg:px-10 dhlsBp:p-0',
    },
    simpleTextWrapper
  );

  block.append(container);
}

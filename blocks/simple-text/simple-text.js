import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Clean parent

  block?.parentElement?.parentElement?.removeAttribute('class');

  block?.parentElement?.parentElement?.removeAttribute('style');

  const [leftText, rightText] = block.children;

  if (leftText) {
    leftText.classList.add(
      'pl-0',

      'font-medium',

      'text-3xl',

      'text-black',

      'md:w-1/2',

      'leading-10'
    );

    leftText.querySelectorAll('p')?.forEach((p, idx, arr) => {
      if (idx !== arr.length - 1) p.classList.add('pb-4');

      if (p.textContent.trim() === '') p.remove();
    });

    leftText.querySelectorAll('a')?.forEach((link) => {
      link.classList.add(
        'text-black',

        'underline',

        'decoration-danaherpurple-500',

        'hover:bg-danaherpurple-500',

        'hover:text-white'
      );

      const href = link.getAttribute('href') || '';

      link.setAttribute('target', href.includes('http') ? '_blank' : '_self');
    });
  }

  if (rightText) {
    rightText.classList.add(
      'text-base',

      'text-black',

      'md:w-1/2',

      'font-normal',

      'leading-snug',

      'mt-1'
    );

    rightText.querySelectorAll('p')?.forEach((p, idx, arr) => {
      if (idx !== arr.length - 1) p.classList.add('pb-4');

      if (p.textContent.trim() === '') p.remove();
    });

    rightText.querySelectorAll('a')?.forEach((link) => {
      link.classList.add(
        'text-black',

        'underline',

        'decoration-danaherpurple-500',

        'hover:bg-danaherpurple-500',

        'hover:text-white'
      );

      const href = link.getAttribute('href') || '';

      link.setAttribute('target', href.includes('http') ? '_blank' : '_self');
    });
  }

  // Wrap the children without destroying block

  const wrapper = div({
    class: 'w-full p-0 m-0 flex flex-col md:flex-row gap-6',
  });

  // move the left/right into the wrapper

  wrapper.append(leftText, rightText);

  block.append(wrapper); // note: not clearing block, just appending a wrapper

  block.classList.add(
    'flex',

    'flex-wrap',

    'flex-col',

    'md:flex-row',

    'dhls-container',

    'px-5',

    'lg:px-10',

    'dhlsBp:p-0'
  );
}

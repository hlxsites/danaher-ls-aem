export default function decorate(block) {
  const [leftText, rightText] = block.children;

  // Only add classes/attributes, never restructure DOM

  if (leftText) {
    leftText.classList.add(
      'pl-0',
      'font-medium',
      'text-3xl',
      'text-black',
      'md:w-1/2',
      'leading-10'
    );

    leftText.querySelectorAll('p').forEach((p, idx, arr) => {
      if (idx !== arr.length - 1) p.classList.add('pb-4');

      if (!p.textContent.trim()) p.remove();
    });

    leftText.querySelectorAll('a').forEach((link) => {
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

    rightText.querySelectorAll('p').forEach((p, idx, arr) => {
      if (idx !== arr.length - 1) p.classList.add('pb-4');

      if (!p.textContent.trim()) p.remove();
    });

    rightText.querySelectorAll('a').forEach((link) => {
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

  // Only add layout classes to block root, do not wrap

  block.classList.add(
    'flex',
    'flex-col',
    'md:flex-row',
    'w-full',
    'gap-6',
    'pl-0',
    'pr-0',
    'pb-0',
    'm-0',
    'dhls-container',
    'px-5',
    'lg:px-10',
    'dhlsBp:p-0'
  );
}

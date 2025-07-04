export default function decorate(block) {
  // Get UE-generated children (leftText and rightText)

  const [leftText, rightText] = block.children;

  // Decorate in place, never re-wrap or re-append!

  if (leftText) {
    leftText.classList.add(
      'pl-0',
      'font-medium',
      'text-3xl',
      'text-black',
      'md:w-1/2',
      'leading-10'
    );

    // style links, paragraphs, etc, as needed

    leftText.querySelectorAll('p').forEach((p, idx, arr) => {
      if (idx !== arr.length - 1) p.classList.add('pb-4');
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

      link.setAttribute('target', href.startsWith('http') ? '_blank' : '_self');
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

      link.setAttribute('target', href.startsWith('http') ? '_blank' : '_self');
    });
  }

  // Add layout classes to the block root (never re-wrap!)

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

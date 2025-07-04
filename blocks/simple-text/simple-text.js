import { div } from '../../scripts/dom-builder.js';
export default function decorate(block) {
  // universal editor safe: do not clear textContent
  // instead, decorate in place
  // get left and right children
  const [leftText, rightText] = block.children;
  if (!leftText || !rightText) return;
  // check if already decorated
  if (block.classList.contains('decorated')) return;
  block.classList.add('decorated');
  // decorate left side in place
  leftText.classList.add(
    'pl-0',
    'font-medium',
    'text-3xl',
    'text-black',
    'md:w-1/2',
    'leading-10'
  );
  leftText.querySelectorAll('p')?.forEach((p, index, arr) => {
    if (index !== arr.length - 1) {
      p.classList.add('pb-4');
    }
    if (p?.textContent?.trim() === '') p.remove();
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
  // decorate right side in place
  rightText.classList.add(
    'text-base',
    'text-black',
    'md:w-1/2',
    'font-normal',
    'leading-snug',
    'mt-1'
  );
  rightText.querySelectorAll('p')?.forEach((p, index, arr) => {
    if (index !== arr.length - 1) {
      p.classList.add('pb-4');
    }
    if (p?.textContent?.trim() === '') p.remove();
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
  // apply flex styles to block container
  block.classList.add(
    'w-full',
    'pl-0',
    'pr-0',
    'pb-0',
    'm-0',
    'flex',
    'flex-col',
    'md:flex-row',
    'gap-6',
    'flex-wrap',
    'dhls-container',
    'px-5',
    'lg:px-10',
    'dhlsBp:p-0'
  );
}

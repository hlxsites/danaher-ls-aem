import {
  div, img, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const buildQuote = div(span({ class: 'icon icon-quote' }));
  block.classList.add('py-6');
  const divEl = block.querySelector('div');
  divEl.classList.add(...'flex items-center gap-8 justify-center'.split(' '));
  const divOfDivEl = block.querySelector(':scope div > div:nth-child(2)');
  divOfDivEl.classList.add(...'text-2xl leading-9 font-medium text-danahergreyblue-500 relative'.split(' '));
  const picDivEl = divEl.parentNode.querySelector(':scope div > div:nth-child(1)');
  picDivEl.classList.add(...'hidden lg:block lg:flex-shrink-0'.split(' '));
  decorateIcons(buildQuote);
  buildQuote.firstChild.classList.add('absolute', 'top-16', 'left-28', 'text-indigo-200', 'w-36', 'h-36', '-translate-x-8', '-translate-y-24', 'transform', 'opacity-50');
  const image = block.querySelector('img');
  const imagecopy = image ? img({ src: image?.src, class: 'rounded-full h-16 w-16' }) : null;
  if (image) {
    block.classList.add('has-image');
    image.classList.add(...'main-image w-64 h-64 rounded-full'.split(' '));
  }
  const divElem = block.querySelector('.testimonial > div');
  const footerElem = div(
    { class: 'testimonial-footer flex text-base leading-6 font-medium text-danahergray-900 mt-4 items-center gap-4' },
    divElem?.querySelectorAll('div')[image ? 2 : 1] ? imagecopy || '' : '',
    div({ class: 'flex flex-col' }, divElem?.querySelectorAll('div')[image ? 2 : 1] ? divElem?.querySelectorAll('div')[image ? 2 : 1] : '', divElem?.querySelectorAll('div')[image ? 3 : 2] ? divElem?.querySelectorAll('div')[image ? 3 : 2] : ''),
  );
  divElem?.querySelectorAll('div')[image ? 1 : 0]?.append(footerElem);
  divElem?.querySelectorAll('div')[image ? 1 : 0]?.append(buildQuote);
}

import { div, a } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const titleEl = block.querySelector('[data-aue-prop="offer_advertisement_title"]')?.textContent;
  const linkTextEl = block.querySelector('[data-aue-prop="offer_text"]')?.textContent.trim() || '';
  const linkEl = block.querySelector('[data-aue-prop="offer_link"] a')?.textContent.trim() || '#';
  const contentElements = [
    div(
      {
        class: 'text-black text-2xl font-bold font-normal leading-loose',
      },
      titleEl,
    ),

    div(
      {
        class: 'text-violet-600 text-base font-bold leading-snug',
      },
      a(
        {
          href: linkEl,
        },
        linkTextEl,
      ),
    ),
  ];

  const outerContainer = div(
    {
      class: 'bg-gray-200 px-12 flex justify-between items-center py-8 max-width',
    },
    ...contentElements,
  );

  block.innerHTML = '';
  block.appendChild(outerContainer);
}

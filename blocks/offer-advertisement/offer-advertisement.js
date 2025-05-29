import { div, a } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const titleEl = block.querySelector('[data-aue-prop="offer_advertisement_title"]')?.textContent?.trim() || '';
  const linkTextEl = block.querySelector('[data-aue-prop="offer_text"]')?.textContent?.trim() || '';
  const linkHref = block.querySelector('div *:not([data-aue-label]) a')?.getAttribute('href') || '#';

  // === Title block container ===
  const titleContainer = div(
    {
      class: 'self-stretch flex flex-col justify-start items-start gap-4',
    },
    div(
      {
        class: 'self-stretch justify-start text-black text-2xl font-normal leading-loose',
      },
      titleEl,
    ),
  );

  const linkContainer = div(
    {
      class: 'justify-start text-violet-600 text-base font-bold leading-snug',
    },
    a({ href: linkHref }, linkTextEl),
  );

  // === Outer wrapper ===
  const outerContainer = div(
    {
      class: 'self-stretch p-6 bg-gray-200 inline-flex flex-col justify-start items-start gap-6',
    },
    titleContainer,
    linkContainer,
  );

  block.innerHTML = '';
  block.appendChild(outerContainer);
}

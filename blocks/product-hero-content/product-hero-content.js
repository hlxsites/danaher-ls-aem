import { div } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const subProductTitle = block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent || '';
  const subProductDescription = block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML || '';

  const leftDiv = div(
    {
      class: 'w-96 flex justify-start items-center gap-12',
    },
    div(
      {
        id: subProductTitle.toLowerCase().replace(/\s+/g, '-'),
        class: 'flex-1 text-black text-3xl font-normal leading-10',
      },
      subProductTitle,
    ),
  );

  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = subProductDescription;

  tempContainer.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add('text-black', 'mb-2');
  });

  tempContainer.querySelectorAll('a').forEach((link) => {
    link.classList.add('text-violet-600', 'font-bold', 'leading-snug', 'inline');
  });

  const rightDiv = div(
    {
      class: 'flex-1 self-stretch inline-flex flex-col justify-start items-start gap-4',
    },
    div({
      class: 'self-stretch h-16 justify-start',
    }),
  );

  const rightDivChild = rightDiv.querySelector('div');
  while (tempContainer.firstChild) {
    rightDivChild.appendChild(tempContainer.firstChild);
  }

  const innerContainer = div(
    {
      class: 'self-stretch inline-flex justify-start items-start gap-5',
    },
    leftDiv,
    rightDiv,
  );

  block.innerHTML = '';
  block.appendChild(innerContainer);
}

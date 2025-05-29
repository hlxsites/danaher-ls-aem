import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Add my-0 to product-hero-content-container
  block.closest('section.product-hero-content-container')?.classList.add('m-0', 'p-0');
  // Extract title and description
  const subProductTitle = block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent || '';
  const subProductDescription = block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML || '';

  // Title section
  const titleDiv = div(
    {
      class: 'w-full md:w-96 flex justify-start items-start gap-12',
    },
    div(
      {
        class: 'flex-1 text-black text-3xl font-normal leading-10',
      },
      subProductTitle,
    ),
  );

  // Process description HTML
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = subProductDescription;

  // Style paragraphs
  tempContainer.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add(
      'text-black',
      'text-base',
      'font-extralight',
      'leading-snug',
    );
  });

  // Style "Read More" links
  tempContainer.querySelectorAll('a').forEach((link) => {
    if (link.textContent.trim().toLowerCase() === 'read more') {
      link.classList.add(
        'text-violet-600',
        'text-base',
        'font-bold',
        'leading-snug',
      );
    }
  });

  // Description section
  const descriptionDiv = div(
    {
      class: 'flex-1 w-full flex flex-col justify-start items-start gap-4',
    },
    div(
      {
        class: 'self-stretch w-full justify-start md:h-16',
      },
      ...Array.from(tempContainer.children),
    ),
  );

  // Inner container
  const innerContainer = div(
    {
      class: 'self-stretch w-full flex flex-col md:flex-row justify-start items-start gap-3 md:gap-5',
    },
    titleDiv,
    descriptionDiv,
  );

  // Outer container
  const outerContainer = div(
    {
      class: 'self-stretch w-full py-12 bg-white border-b border-gray-400 flex flex-col justify-center items-start gap-8 md:gap-12 overflow-hidden',
    },
    innerContainer,
  );

  // Clear block content and append
  block.innerHTML = '';
  block.appendChild(outerContainer);
}

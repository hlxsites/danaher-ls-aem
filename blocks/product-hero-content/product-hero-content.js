import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  document
    .querySelector('.product-hero-content-wrapper')
    ?.parentElement?.removeAttribute('class');
  document
    .querySelector('.product-hero-content-wrapper')
    ?.parentElement?.removeAttribute('style');
  const productHeroContentWrapper = div({
    class: 'lg:max-w-[1238px] mx-auto flex flex-col md:flex-row gap-6',
  });
  // Extract title and description
  const subProductTitle = block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent || '';
  const subProductDescription = block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML || '';

  // Title section
  const titleDiv = div(
    {
      style: '',
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
      class: 'self-stretch mt-12 w-full bg-white flex flex-col justify-center items-start gap-8 md:gap-12 overflow-hidden',
    },
    innerContainer,
  );

  productHeroContentWrapper.append(outerContainer);
  // Clear block content and append
  block.innerHTML = '';
  block.appendChild(productHeroContentWrapper);
}

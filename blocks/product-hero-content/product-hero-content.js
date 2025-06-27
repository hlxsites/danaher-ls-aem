import {
  a, div, p,
  span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const blockId = block.querySelector('[data-aue-prop="prod_hero_id"]')?.textContent || '';
  const productHeroContentWrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0 scroll-mt-32',
    id: blockId,
  });
  // Extract title and description
  const subProductTitle = block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent || '';
  const subProductDescription = block.querySelector('[data-aue-prop="prod_hero_description"]')?.textContent
    || '';
  const readMoreLabel = block.querySelector('[data-aue-prop="readMore_label"]')?.textContent || '';
  const readMoreLink = block.querySelector('a')?.href || '';
  const openNewTab = block.querySelector('[data-aue-prop="subscribe"]')?.textContent;

  // Title section
  const titleDiv = div(
    {
      style: '',
      class: 'w-full lg:w-[400px] flex justify-start items-start gap-12',
    },
    div(
      {
        id: subProductTitle.toLowerCase().replace(/\s+/g, '-'),
        class: 'flex-1 text-black text-[32px] !font-medium !leading-10',
      },
      subProductTitle,
    ),
  );

  // Process description HTML
  // const tempContainer = document.createElement('div');
  // tempContainer.innerHTML = subProductDescription;

  // Style paragraphs
  // tempContainer.querySelectorAll('p').forEach((paragraph) => {
  //   paragraph.classList.add(
  //     'text-black',
  //     'text-base',
  //     'font-extralight',
  //     'leading-snug',
  //   );
  // });

  // Style "Read More" links
  // tempContainer.querySelectorAll('a').forEach((link) => {
  //   setLinkTarget(link);
  // });

  // Description section
  const descriptionDiv = div(
    {
      class: 'flex-1 w-full flex flex-col justify-start items-start',
    },
    div(
      {
        class: 'prod-desc relative self-stretch w-full justify-start line-clamp-3 text-black text-base font-extralight leading-snug',
      },
      p({ class: 'desc-para' }, subProductDescription),
    ),
  );
  if (readMoreLabel.trim().length > 0 && readMoreLink.trim().length > 0) {
    const readMore = a({
      class: 'text-danaherpurple-500 hover:text-danaherpurple-800 font-bold text-base leading-snug',
      href: readMoreLink,
      target: `${openNewTab ? '_blank' : '_self'}`,
    }, readMoreLabel, span({ class: 'icon icon icon-arrow-right !size-5 pl-1.5 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800' }));
    descriptionDiv.append(readMore);
  }
  decorateIcons(descriptionDiv);

  // Inner container
  const innerContainer = div(
    {
      class:
        'self-stretch w-full flex flex-col lg:flex-row justify-start items-start gap-3 md:gap-5',
    },
    titleDiv,
    descriptionDiv,
  );

  // Outer container
  const outerContainer = div(
    {
      class:
        'self-stretch w-full bg-white flex flex-col justify-center items-start gap-8 md:gap-12 overflow-hidden',
    },
    innerContainer,
  );

  productHeroContentWrapper.append(outerContainer);
  // Clear block content and append
  block.innerHTML = '';
  block.appendChild(productHeroContentWrapper);
}

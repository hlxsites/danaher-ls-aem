<<<<<<< HEAD
import {
  a, div, p,
  span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
=======
import { div } from '../../scripts/dom-builder.js';

function setLinkTarget(anchor, openInNewTab = true) {
  const href = anchor.getAttribute('href');
  if (href?.startsWith('https')) {
    anchor.setAttribute('target', openInNewTab ? '_blank' : '_self');
  } else {
    anchor.removeAttribute('target');
  }
}
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
<<<<<<< HEAD
  const blockId = block.firstElementChild?.firstElementChild?.firstElementChild?.textContent.trim() || '';
  const productHeroContentWrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0 scroll-mt-32',
    id: blockId,
  });
  // Extract title and description
  const subProductTitle = block.firstElementChild?.firstElementChild?.children[1]?.textContent?.trim() || '';
  const subProductDescription = block.firstElementChild?.firstElementChild?.children[2]?.textContent?.trim() || '';
  const readMoreLabel = block.children[1]?.firstElementChild?.firstElementChild?.textContent.trim() || '';
  const readMoreLink = block.children[1]?.querySelector('a')?.href || '';
  const openNewTab = block.children[2]?.querySelector('p')?.textContent;
=======
  const blockId = block.querySelector('[data-aue-prop="prod_hero_id"]')?.textContent || '';
  const productHeroContentWrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0',
    id: blockId,
  });
  // Extract title and description
  const subProductTitle = block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent || '';
  const subProductDescription = block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML
    || '';
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

  // Title section
  const titleDiv = div(
    {
      style: '',
<<<<<<< HEAD
      class: 'w-full lg:w-[400px] flex justify-start items-start gap-12',
=======
      class: 'w-full md:w-96 flex justify-start items-start gap-12',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    },
    div(
      {
        id: subProductTitle.toLowerCase().replace(/\s+/g, '-'),
        class: 'flex-1 text-black text-[32px] !font-medium !leading-10',
      },
      subProductTitle,
    ),
  );

<<<<<<< HEAD
  // Description section
  const descriptionDiv = div(
    {
      class: 'flex-1 w-full flex flex-col justify-start items-start gap-y-1',
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
      class: 'text-danaherpurple-500 hover:text-danaherpurple-800 font-bold text-base leading-snug group flex gap-x-2',
      href: readMoreLink,
      target: `${openNewTab === 'true' ? '_blank' : '_self'}`,
    }, readMoreLabel, span({ class: 'icon icon icon-arrow-right w-[18px] fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800 group-hover:[&_svg>use]:stroke-danaherpurple-800' }));
    descriptionDiv.append(readMore);
  }
  decorateIcons(descriptionDiv);
=======
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
    setLinkTarget(link);
  });

  // Description section
  const descriptionDiv = div(
    {
      class: 'flex-1 w-full flex flex-col justify-start items-start gap-4',
    },
    div(
      {
        class: 'self-stretch w-full justify-start',
      },
      ...Array.from(tempContainer.children),
    ),
  );
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

  // Inner container
  const innerContainer = div(
    {
      class:
<<<<<<< HEAD
        'self-stretch w-full flex flex-col lg:flex-row justify-start items-start gap-3 md:gap-5',
=======
        'self-stretch w-full flex flex-col md:flex-row justify-start items-start gap-3 md:gap-5',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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

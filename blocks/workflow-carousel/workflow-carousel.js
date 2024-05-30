import Carousel from '../../scripts/carousel.js';
import {
  div, a, button, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const uuid = crypto.randomUUID(4).substring(0, 6);
  block.setAttribute('id', uuid);
  block.classList.add(...'carousel-wrapper flex flex-col gap-3 mt-4'.split(' '));
  const clonedBlock = [...block.children];
  const carousel = div(
    { class: 'carousel grid grid-flow-col overflow-x-auto space-x-2 snap-x snap-mandatory gap-6 rounded-md scroll-smooth auto-cols-[calc(100%)] md:auto-cols-[calc((100%/2)-20px)] lg:auto-cols-[calc((100%/3)-20px)] pb-2' },
    ...clonedBlock.map((element, eleIndex) => {
      const cardImage = element.querySelector('picture');
      const link = element.querySelector('p > a');
      let anchor;
      if (cardImage && link) {
        const cardContent = div({ class: 'h-full flex flex-col p-4' });
        const opcoToolIndex = element.querySelector('p:not(strong) ~ p');
        cardImage.querySelector('img').classList.add(...'flex-shrink-0 w-full h-36 object-cover rounded-sm'.split(' '));
        opcoToolIndex.classList.add(...'mt-2 mb-1 text-xl font-bold text-gray-900 break-words leading-tight tracking-normal line-clamp-4'.split(' '));
        opcoToolIndex.children[0].classList.add(...'text-base text-gray-400 group-hover:font-bold group-hover:underline'.split(' '));
        link.classList.add(...'w-full flex-initial flex flex-row gap-1 items-center text-base text-danaherblue-600 font-semibold mt-auto'.split(' '));
        link.append(span({ class: 'icon icon-icon-arrow-right' }));
        cardContent.append(opcoToolIndex);
        const opcoTool = element.querySelector('p ~ p');
        opcoTool.classList.add(...'text-lg font-bold text-gray-900 break-words leading-tight tracking-normal line-clamp-4 mb-3'.split(' '));
        cardContent.append(opcoTool);
        cardContent.append(link);
        anchor = a({
          class: 'card carousel-slider flex snap-start list-none bg-white flex-col rounded-md h-full mx-px relative flex flex-col border cursor-pointer shadow-md hover:shadow-lg rounded-md overflow-hidden group',
          'data-carousel-item': eleIndex,
          href: link?.href,
        });

        anchor.append(cardImage, cardContent);
      }
      return anchor;
    }).filter(Boolean),
  );
  /* Create the carousel controls */
  const viewAll = block?.parentElement?.parentElement?.querySelector('a');
  viewAll.classList.add(...'flex h-full items-center gap-1 mr-2 text-sm text-danaherblue-600 font-semibold break-words'.split(' '));
  viewAll.append(span({ class: 'icon icon-icon-arrow-right' }));
  const carouselActions = div(
    { class: 'flex justify-between items-center' },
    div(
      { class: 'inline-flex gap-x-4' },
      button({ type: 'button', 'aria-label': 'previous-workflow-carousel', id: `previous-${uuid}-workflow` }, span({ class: 'icon icon-round-arrow-left' })),
      button({ type: 'button', 'aria-label': 'next-workflow-carousel', id: `next-${uuid}-workflow` }, span({ class: 'icon icon-round-arrow-right' })),
    ),
    viewAll,
  );
  block.innerHTML = '';
  block.append(carouselActions, carousel);
  decorateIcons(block);
  if (block.className.includes('carousel-wrapper')) {
    setTimeout(() => {
      /* eslint-disable no-new */
      new Carousel({
        wrapperEl: uuid,
        mainEl: '.carousel',
        delay: 2000,
        isAutoPlay: false,
        previousElAction: `button#previous-${uuid}-workflow`,
        nextElAction: `button#next-${uuid}-workflow`,
      });
    }, 3000);
  }
}

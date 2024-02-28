import Carousel from '../../scripts/carousel.js';
import { div, a, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const uuid = crypto.randomUUID(4).substring(0, 6);
  block.setAttribute('id', uuid);
  block.classList.add(...'carousel-wrapper flex flex-col gap-3 mt-4'.split(' '));
  const clonedBlock = [...block.children];
  block.innerHTML = '';
  const carousel = div(
    { class: 'carousel auto-cols-[calc((100%)-20px)] md:auto-cols-[calc((100%/2)-20px)] lg:auto-cols-[calc((100%/3)-20px)] pb-2' },
    ...clonedBlock.map((element, eleIndex) => {
      const cardImage = element.querySelector('picture');
      cardImage.querySelector('img').classList.add(...'flex-shrink-0 w-full h-36 object-cover rounded-sm'.split(' '));
      const category = element.querySelector('div:last-child');
      const cardContent = element.querySelector('div:not(picture) ~ *');
      cardContent.classList.add(...'h-full flex flex-col p-4'.split(' '));
      cardContent.querySelector('strong').classList.add(...'text-base text-gray-400 group-hover:font-bold group-hover:underline'.split(' '));
      cardContent.querySelector('p:not(strong) ~ p').classList.add(...'flex-1 mt-2 mb-3 text-xl font-bold text-gray-900 break-words leading-tight tracking-normal line-clamp-4'.split(' '));
      const link = cardContent.querySelector('p > a');
      link.classList.add(...'w-full flex-initial flex flex-row gap-1 items-center text-base text-danaherblue-600 font-semibold'.split(' '));
      link.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path></svg>';
      cardContent.append(link);
      const anchor = a({ class: `card carousel-slider h-full z-10 mx-px relative flex flex-col border cursor-pointer shadow-md hover:shadow-lg rounded-md overflow-hidden group ${category ? category.textContent : ''}`, 'data-carousel-item': eleIndex, href: link?.href });
      anchor.append(cardImage, cardContent);
      return anchor;
    }),
  );
  /* Create the carousel controls */
  const previousAction = button({ type: 'button', class: '', id: 'previous-workflow' });
  previousAction.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-di-res-id="7a361a0e-38854228" data-di-rand="1707748600967" class="w-9 h-9 text-indigo-900 cursor-pointer transition transform"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
  const nextAction = button({ type: 'button', class: '', id: 'next-workflow' });
  nextAction.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-di-res-id="c28a7d6b-24943905" data-di-rand="1707748600967" class="w-9 h-9 text-indigo-900 cursor-pointer transition transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
  const viewAll = block.parentElement.parentElement?.querySelector('a');
  viewAll.classList.add(...'flex h-full items-center gap-1 mr-2 text-sm text-danaherblue-600 font-semibold break-words'.split(' '));
  viewAll.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path></svg>';
  const carouselActions = div(
    { class: 'flex justify-between items-center' },
    div(
      { class: 'space-x-4' },
      previousAction,
      nextAction,
    ),
    viewAll,
  );

  block.append(carouselActions, carousel);
  if (block.className.includes('carousel-wrapper')) {
    setTimeout(() => {
      /* eslint-disable no-new */
      new Carousel({
        wrapperEl: uuid,
        mainEl: '.carousel',
        delay: 2000,
        isAutoPlay: false,
        previousElAction: 'button#previous-workflow',
        nextElAction: 'button#next-workflow',
        copyChild: 3,
      });
    }, 5000);
  }
}

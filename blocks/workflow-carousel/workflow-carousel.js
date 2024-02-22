import Carousel from '../../scripts/carousel.js';
import { div, a, button, ul, li } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
    console.log(block);
    const uuid = crypto.randomUUID(4).substring(0, 6);
    block.setAttribute('id', uuid);
    block.classList.add(...'carousel-wrapper flex flex-col gap-3'.split(' '));
    const previousAction = button({ type: 'button', class: '', id: 'previous-workflow' });
    previousAction.innerHTML = `<svg data-v-5a8950e6="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-di-res-id="7a361a0e-38854228" data-di-rand="1707748600967" class="w-9 h-9 text-indigo-900 cursor-pointer transition transform"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    const nextAction = button({ type: 'button', class: '', id: 'next-workflow' });
    nextAction.innerHTML = `<svg data-v-5a8950e6="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-di-res-id="c28a7d6b-24943905" data-di-rand="1707748600967" class="w-9 h-9 text-indigo-900 cursor-pointer transition transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    const carouselActions = div(
        { class: 'flex justify-between items-center' }, 
        div(
            { class: 'space-x-4' },
            previousAction,
            nextAction
        ),
        block.parentElement.parentElement?.querySelector('a')
    );
    const carousels = div({class: 'carousel', style: 'grid-auto-columns: calc((100% / 3) - 20px)'});
    [...block.children].forEach((element, index) => {
        // const liItem = li({ class: 'card carousel-slider' });
        const anchor = a({class: 'card carousel-slider h-full z-10 mx-px relative flex flex-col border cursor-pointer shadow-md rounded-md overflow-hidden !bg-white !no-underline group'});
        const cardImage = element.querySelector('picture');
        cardImage.querySelector('img').classList.add(...'flex-shrink-0 w-full h-36 object-cover rounded-sm'.split(' '));
        const cardContent = element.querySelector('div:not(picture) ~ *');
        cardContent.classList.add(...'h-full flex flex-col p-4'.split(' '));
        cardContent.querySelector('strong').classList.add(...'text-base text-gray-400 group-hover:font-bold group-hover:underline'.split(' '));
        cardContent.querySelector('p:not(strong) ~ p').classList.add(...'flex-1 mt-2 mb-3 text-xl font-bold text-gray-900 break-words leading-tight tracking-normal line-clamp-4'.split(' '));
        cardContent.querySelector('p > a').classList.add(...'w-full flex-initial flex flex-col gap-0.5 text-base text-danaherblue-600 font-semibold group-hover:underline group-hover:!bg-white group-hover:!text-danaherblue-600'.split(' '));
        cardContent.append(cardContent.querySelector('p > a'));
        anchor.append(cardImage, cardContent);
        // liItem.append(anchor);
        carousels.append(anchor);
    });
    // console.log(carousels, carouselActions);
    block.innerHTML = '';
    block.append(carouselActions, carousels);
    // setTimeout(() => {
    //     const carousel = new Carousel({
    //         wrapperEl: block.id,
    //         mainEl: '.carousel',
    //         delay: 2000,
    //         isAutoPlay: false,
    //         previousElAction: 'button#previous-workflow',
    //         nextElAction: 'button#next-workflow'
    //     });
    // }, 4000);
}
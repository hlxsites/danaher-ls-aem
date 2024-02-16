import Carousel from '../../scripts/carousel.js';
import { div, a, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
    console.log(block);
    // const uuid = crypto.randomUUID(4).substring(0, 6);
    // block.setAttribute('id', uuid);
    // block.classList.add(...'carousel-wrapper flex flex-col gap-3'.split(' '));
    // const previousAction = button({ type: 'button', class: '', id: 'previous-workflow' });
    // previousAction.innerHTML = `<svg data-v-5a8950e6="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-di-res-id="7a361a0e-38854228" data-di-rand="1707748600967" class="w-9 h-9 text-indigo-900 cursor-pointer transition transform"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    // const nextAction = button({ type: 'button', class: '', id: 'next-workflow' });
    // nextAction.innerHTML = `<svg data-v-5a8950e6="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-di-res-id="c28a7d6b-24943905" data-di-rand="1707748600967" class="w-9 h-9 text-indigo-900 cursor-pointer transition transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    // const carouselActions = div(
    //     { class: 'flex justify-between items-center' }, 
    //     div(
    //         { class: 'space-x-4' },
    //         previousAction,
    //         nextAction
    //     ),
    //     block.firstElementChild?.querySelector('div > a')
    // );
    // const carousels = div({class: 'carousel', style: 'grid-auto-columns: calc((100% / 3) - 20px)'});
    // [...block.children].forEach((element, index) => {
    //     if(index !== 0) {
    //         element.classList.add(...'w-[290.6px] mr-5 gap-3'.split(' '));
    //         const anc = a({class: 'card carousel-slider h-full z-10 mx-px relative flex flex-col border cursor-pointer shadow-md rounded-md overflow-hidden bg-white transition hover:transform hover:scale-95'});
    //         const card = element.querySelector('div');
    //         card.querySelector('p > picture > img').classList.add(...'flex-shrink-0 w-full h-36 object-cover rounded-sm transition hover:transform hover:scale-105 hover:skew-x-3'.split(' '));
    //         card.querySelector('p > strong').classList.add(...'flex-1 space-y-0.5 px-4 py-2.5 text-base text-gray-400 hover:font-bold hover:underline'.split(' '));
    //         card.querySelector('p:nth-child(3)').classList.add(...'flex-1 space-y-0.5 px-4 py-2.5 text-xl font-bold text-gray-900 break-words leading-tight tracking-normal line-clamp-4'.split(' '));
    //         card.querySelector('p > a').classList.add(...'w-full flex flex-col gap-0.5 px-4 py-3 text-base text-danaherblue-600 font-semibold !no-underline hover:!bg-white hover:!text-danaherblue-600'.split(' '));
    //         anc.innerHTML = card.innerHTML;
    //         carousels.append(anc)
    //     };
    // });
    // console.log(carousels, carouselActions);
    // block.innerHTML = '';
    // // block.append(data, carousels);
    // block.append(carouselActions, carousels);
    // setTimeout(() => {
    //     // const carousel = new Carousel({
    //     //     wrapperEl: block.id,
    //     //     mainEl: '.carousel',
    //     //     delay: 2000,
    //     //     isAutoPlay: false,
    //     //     previousElAction: 'button#previous-workflow',
    //     //     nextElAction: 'button#next-workflow'
    //     // });
    // }, 4000);
}
import { div, a } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
    block.classList.add(...'flex flex-col gap-3'.split(' '))
    const data = block.firstElementChild;
    const viewAll = block.firstElementChild.querySelector('div > a');
    viewAll.classList.remove(...'btn btn-outline-primary'.split(' '));
    viewAll.classList.add(...'flex h-full items-center gap-1 mr-2 text-sm text-danaherblue-600 font-semibold break-words'.split(' '));
    data.classList.add(...'justify-between items-center flex'.split(' '));
    data.prepend(div({class: 'carousel-data flex gap-2 w-full'}));
    data.querySelector('.carousel-data').innerHTML = `<svg data-v-5a8950e6="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-di-res-id="7a361a0e-38854228" data-di-rand="1707748600967" class="w-9 h-9 text-indigo-900 cursor-pointer transition transform"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
                    +`<svg data-v-5a8950e6="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-di-res-id="c28a7d6b-24943905" data-di-rand="1707748600967" class="w-9 h-9 text-indigo-900 cursor-pointer transition transform"><path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    data.querySelector('.carousel-data').append(viewAll);
    const carousels = div({class: 'carousel-card flex flex-row duration-0 -translate-x-0'});
    [...block.children].forEach((element, index) => {
        if(index !== 0) {
            element.classList.add(...'w-[290.6px] mr-5 gap-3'.split(' '));
            const anc = a({class: 'min-w-min w-full h-full z-10 mx-px relative flex flex-col border cursor-pointer shadow-md rounded-md overflow-hidden bg-white transition'});
            const card = element.querySelector('div:nth-child(2)');
            card.querySelector('p > picture > img').classList.add(...'w-full h-36 object-cover rounded-sm transition'.split(' '));
            card.querySelector('p:nth-child(2)').prepend(element.querySelector('div:nth-child(1)'));
            card.querySelector('p:nth-child(2)').classList.add(...'flex-1 space-y-0.5 px-4 py-2.5 text-xl font-bold text-gray-900 break-words leading-tight tracking-normal line-clamp-4'.split(' '));
            card.querySelector('p:nth-child(3)').classList.add(...'w-full flex flex-col gap-0.5 px-4 py-3 text-base text-danaherblue-600 font-semibold'.split(' '));
            anc.append(card);
            carousels.append(anc)
        };
    });
    block.innerHTML = '';
    block.append(data, carousels);
}
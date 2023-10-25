import {
    div, img
  } from '../../scripts/dom-builder.js';
import { buildBlock } from '../../scripts/lib-franklin.js';

const quote = `<svg class="absolute top-16 left-28 h-36 w-36 -translate-x-8 -translate-y-24 transform text-indigo-200 opacity-50" stroke="currentColor" fill="none" viewBox="0 0 144 144" aria-hidden="true" data-di-res-id="dba273e5-656e1038" data-di-rand="1698245837284"><path data-v-0bb06b90="" stroke-width="2" d="M41.485 15C17.753 31.753 1 59.208 1 89.455c0 24.664 14.891 39.09 32.109 39.09 16.287 0 28.386-13.03 28.386-28.387 0-15.356-10.703-26.524-24.663-26.524-2.792 0-6.515.465-7.446.93 2.327-15.821 17.218-34.435 32.11-43.742L41.485 15zm80.04 0c-23.268 16.753-40.02 44.208-40.02 74.455 0 24.664 14.891 39.09 32.109 39.09 15.822 0 28.386-13.03 28.386-28.387 0-15.356-11.168-26.524-25.129-26.524-2.792 0-6.049.465-6.98.93 2.327-15.821 16.753-34.435 31.644-43.742L121.525 15z"></path></svg>`;

export default async function decorate(block) {
    const buildQuote = buildBlock('blockquote', { elems: [quote] });
    const image = block.querySelector('img');
    const imagecopy = image? img({ src: image?.src, class: 'rounded-full h-16 w-16' }): null;
    if(image){
        block.classList.add('has-image');
        image.classList.add('main-image');
    }
    const divElem = block.querySelector('.testimonial .testimonial > div');
    const footerElem = div(
        { class: 'flex testimonial-footer' }, 
        imagecopy? imagecopy: '',
        div({class: 'flex flex-col'}, divElem?.querySelectorAll('div')[image? 2: 1]? divElem?.querySelectorAll('div')[image? 2: 1]: '', divElem?.querySelectorAll('div')[image? 3: 2]? divElem?.querySelectorAll('div')[image? 3: 2]: '')
    );
    divElem?.querySelectorAll('div')[image? 1: 0]?.append(footerElem);
    divElem?.querySelectorAll('div')[image? 1: 0]?.append(buildQuote);
}

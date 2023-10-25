import {
    div, img, span
  } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
    const buildQuote = div(span({ class: 'icon icon-quote' }));
    block.querySelector('.testimonial').classList.add('py-6');
    decorateIcons(buildQuote);
    buildQuote.firstChild.classList.add('absolute', 'top-16', 'left-28', 'text-indigo-200', 'w-36', 'h-36', '-translate-x-8', '-translate-y-24', 'transform', 'opacity-50');
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

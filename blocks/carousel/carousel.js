import { div } from "../../scripts/dom-builder";

export default function decorate(block) {
    console.log(block);
    block.classList.add(...'relative h-56 overflow-hidden rounded-lg md:h-96'.split(' '));
    if (block.parentElement.className.includes('carousel-wrapper')) {
        block.parentElement.classList.add(...'relative w-full'.split(' '));
    }  
    let i = 0;
    let result = []; 
    [...block.children].forEach(item => {
        const caouselSlider = div({ class: 'carousel-slider hidden duration-700 ease-in-out'}, div({ class: ''}));
            if(item % 2 === 0){
               i = 1;                
               //console.log('even: ',item+':i:'+i);     
            } else {
               //console.log('odd: ',item);
               i = 0;     
            }   
    });

  }
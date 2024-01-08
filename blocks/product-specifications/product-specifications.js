import { div, h1 } from '../../scripts/dom-builder.js';

export default function decorate(block) {
    let response;    
    if (localStorage.getItem('product-hero')) response = JSON.parse(localStorage.getItem('product-hero'));
    if (response) {        
        const main = document.querySelector('main');
        const productSpec = main.querySelector('.product-specifications');
        console.log(productSpec);
        //productSpec.append(h1({ class: 'text-xl font-normal leading-6 text-black' }, productSpec));
        let defaultContent = div();
        defaultContent.innerHTML = response[0]?.raw.specificationsjson;
        console.log(defaultContent);
        // defaultContent.append(
        //     div(
        //         p(response[0]?.raw.specificationsjson),
        //     ),
        // );
        // productSpec.parentElement.classList.add(...'stretch'.split(' '));
        // productSpec.innerHTML = '';
        // productSpec.append(div({ class: 'hero-default-content' }, defaultContent));
    }
}
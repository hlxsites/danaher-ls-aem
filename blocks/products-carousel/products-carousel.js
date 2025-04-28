import {
    div,img,a,h2,span
  } from '../../scripts/dom-builder.js';
// DOM Builder function
const div = (props = {}, ...children) => {
    const el = Object.assign(document.createElement('div'), props);
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            el.appendChild(child);
        }
    });
    return el;
};

const img = (props = {}) => Object.assign(document.createElement('img'), props);
const button = (props = {}, ...children) => {
    const el = Object.assign(document.createElement('button'), props);
    children.forEach(child => el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child));
    return el;
};

// Product data
const products = [
    { name: 'X500 QTOF SYSTEM', part: '00F-457-768N', price: '$99,999.99', img: 'product1.jpg' },
    { name: 'TRIPLE QUAD 7500 SYSTEM', part: '00F-457-768N', price: '$99,999.99', img: 'product2.jpg' },
    { name: 'ZENOTOF 7600 SYSTEM', part: '00F-457-768N', price: '$99,999.99', img: 'product3.jpg' },
    { name: 'X500B QTOF SYSTEM', part: '00F-457-768N', price: '$99,999.99', img: 'product4.jpg' },
];

// Main decorate function
export default function decorate(block) {
    let currentIndex = 0;
    let isHorizontal = true;
    const productsPerSlide = 4;
    const totalSlides = Math.ceil(products.length / productsPerSlide);

    // Main container
    const container = div({ class: 'relative w-full max-w-6xl mx-auto p-5' });

    // Toggle button
    const toggleBtn = button(
        { 
            class: 'absolute top-2 right-2 px-4 py-2 bg-gray-600 text-white rounded cursor-pointer',
            onclick: () => toggleView()
        },
        'Toggle View'
    );

    // Arrow buttons
    const prevBtn = button(
        { 
            class: 'absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed',
            onclick: () => navigate(-1)
        },
        '←'
    );

    const nextBtn = button(
        { 
            class: 'absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed',
            onclick: () => navigate(1)
        },
        '→'
    );

    // Products wrapper
    const productsWrapper = div({ class: 'flex gap-5 transition-all duration-300' });

    // Render products
    const renderProducts = () => {
        productsWrapper.innerHTML = '';
        const start = currentIndex * productsPerSlide;
        const end = Math.min(start + productsPerSlide, products.length);

        for (let i = start; i < end; i++) {
            const product = products[i];
            const productCard = div(
                { class: 'flex-1 min-w-[200px] border border-gray-200 p-4 rounded-lg text-center' },
                img({ 
                    src: product.img, 
                    alt: product.name, 
                    class: 'w-full h-40 object-cover rounded' 
                }),
                div({ class: 'text-base font-bold mt-3 mb-1' }, product.name),
                div({ class: 'text-sm text-gray-600' }, product.part),
                div({ class: 'text-base text-black my-3' }, product.price),
                div({ class: 'flex gap-3 justify-center' },
                    button({ class: 'px-4 py-2 bg-gray-200 rounded' }, 'QUOTE'),
                    button({ class: 'px-4 py-2 bg-blue-600 text-white rounded' }, 'BUY')
                )
            );
            productsWrapper.appendChild(productCard);
        }

        // Update arrow states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;

        // Update layout based on view
        productsWrapper.className = isHorizontal 
            ? 'flex gap-5 transition-all duration-300'
            : 'flex flex-col gap-5 transition-all duration-300';
        
        const cards = productsWrapper.children;
        for (let card of cards) {
            card.className = isHorizontal 
                ? 'flex-1 min-w-[200px] border border-gray-200 p-4 rounded-lg text-center'
                : 'w-full border border-gray-200 p-4 rounded-lg text-center';
        }
    };

    // Navigation
    const navigate = (direction) => {
        currentIndex = Math.max(0, Math.min(currentIndex + direction, totalSlides - 1));
        renderProducts();
    };

    // Toggle view
    const toggleView = () => {
        isHorizontal = !isHorizontal;
        renderProducts();
    };

    // Initial render
    container.append(toggleBtn, prevBtn, productsWrapper, nextBtn);
    renderProducts();

    // Clear block and append container
    block.innerHTML = '';
    block.appendChild(container);
}
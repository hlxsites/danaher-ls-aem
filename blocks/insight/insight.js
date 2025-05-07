import {
    div, p, h2, a, section, span
  } from '../../scripts/dom-builder.js';
  
  export default function decorate(block) {
    // Extract left-side content
    const leftTitle = block.querySelector('[data-aue-prop="left-title"]')?.textContent.trim() || '';
    const leftDescriptionHTML = block.querySelector('[data-aue-prop="left-description"]')?.innerHTML || '';
  
    // Extract right cards
    const rightItems = [
      {
        title: block.querySelector('[data-aue-prop="right-first-title"]')?.textContent.trim() || '',
        desc: block.querySelector('[data-aue-prop="right-first-description"]')?.innerHTML || '',
        link: block.querySelector('[data-aue-prop="right-first-link"]')?.textContent.trim() || '',
      },
      {
        title: block.querySelector('[data-aue-prop="right-second-title"]')?.textContent.trim() || '',
        desc: block.querySelector('[data-aue-prop="right-second-description"]')?.innerHTML || '',
        link: block.querySelector('[data-aue-prop="right-second-link"]')?.textContent.trim() || '',
      },
      {
        title: block.querySelector('[data-aue-prop="right-third-title"]')?.textContent.trim() || '',
        desc: block.querySelector('[data-aue-prop="right-third-description"]')?.innerHTML || '',
        link: block.querySelector('[data-aue-prop="right-third-link"]')?.textContent.trim() || '',
      },
    ];
  
    // Left Column
    const leftCol = div(
      { class: 'w-full md:w-1/2 pr-6' },
      h2({ class: 'text-2xl font-semibold text-black leading-snug mb-4' }, leftTitle),
      div(
        { class: 'text-base text-gray-700 leading-relaxed' },
        ...Array.from(new DOMParser().parseFromString(leftDescriptionHTML, 'text/html').body.childNodes)
      )
    );
  
    // Right Column
    const rightCol = div(
      { class: 'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-6 mt-10 md:mt-0' },
      ...rightItems.map(({ title, desc, link }) =>
        div({ class: 'py-6' },
          p({ class: 'font-semibold text-black text-lg mb-1' }, title),
          div(
            { class: 'text-sm text-gray-700 mb-3' },
            ...Array.from(new DOMParser().parseFromString(desc, 'text/html').body.childNodes)
          ),
          link && a(
            {
              href: '#',
              class: 'text-sm text-purple-700 font-semibold hover:underline flex items-center gap-1'
            },
            link,
            span({ class: 'text-purple-700', textContent: '→' })
          )
        )
      )
    );
  
    // Final layout container
    const content = div(
      {
        class: 'flex flex-col md:flex-row items-start justify-between max-w-[1200px] mx-auto px-6 py-12 gap-8'
      },
      leftCol,
      rightCol
    );
  
    // Clear original block content and inject
    block.innerHTML = '';
    block.classList.add('section', 'insight-container');
    block.appendChild(content);
  }
  
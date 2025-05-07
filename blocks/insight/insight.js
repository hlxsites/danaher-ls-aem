import {
    div, p, h2, a, span
  } from '../../scripts/dom-builder.js';
  
  export default function decorate(block) {
    // Clear existing content
    block.textContent = '';
  
    // === Extract authored content ===
    const leftTitle = block.querySelector('[data-aue-prop="left-title"]')?.textContent.trim() || '';
    const leftDesc = block.querySelector('[data-aue-prop="left-description"]')?.innerHTML || '';
  
    const rightItems = [
      {
        title: block.querySelector('[data-aue-prop="right-first-title"]')?.textContent.trim(),
        desc: block.querySelector('[data-aue-prop="right-first-description"]')?.innerHTML || '',
        link: block.querySelector('[data-aue-prop="right-first-link"]')?.textContent.trim(),
      },
      {
        title: block.querySelector('[data-aue-prop="right-second-title"]')?.textContent.trim(),
        desc: block.querySelector('[data-aue-prop="right-second-description"]')?.innerHTML || '',
        link: block.querySelector('[data-aue-prop="right-second-link"]')?.textContent.trim(),
      },
      {
        title: block.querySelector('[data-aue-prop="right-third-title"]')?.textContent.trim(),
        desc: block.querySelector('[data-aue-prop="right-third-description"]')?.innerHTML || '',
        link: block.querySelector('[data-aue-prop="right-third-link"]')?.textContent.trim(),
      }
    ];
  
    // === Left Section ===
    const leftCol = div(
      { class: 'w-full md:w-1/2 pr-6' },
      h2({ class: 'text-2xl font-semibold text-black leading-snug mb-4' }, leftTitle),
      div({
        class: 'text-base text-gray-700 leading-relaxed'
      }, ...Array.from(new DOMParser().parseFromString(leftDesc, 'text/html').body.childNodes))
    );
  
    // === Right Section ===
    const rightCol = div(
      { class: 'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-6 mt-10 md:mt-0' },
      ...rightItems.map(item =>
        div({ class: 'py-4' },
          p({ class: 'font-semibold text-black text-lg mb-1' }, item.title),
          div({
            class: 'text-sm text-gray-700 mb-2'
          }, ...Array.from(new DOMParser().parseFromString(item.desc, 'text/html').body.childNodes)),
          a({
            href: '#',
            class: 'text-sm text-purple-700 font-semibold hover:underline flex items-center gap-1'
          },
            item.link,
            span({ class: 'text-purple-700', textContent: '→' })
          )
        )
      )
    );
  
    // === Final Layout Wrapper ===
    const wrapper = div(
      {
        class: 'flex flex-col md:flex-row justify-between gap-8 max-w-[1200px] mx-auto px-6 py-12'
      },
      leftCol,
      rightCol
    );
  
    // Append to block
    block.appendChild(wrapper);
  }
  
import {
    div, p, h2, a, span
  } from '../../scripts/dom-builder.js';
  
  export default function decorate(block) {
    // Reference the real .insight content
    const insight = block.querySelector('.insight');
    if (!insight) return;
  
    // Extract data
    const getText = (prop) => insight.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() || '';
    const getHTML = (prop) => insight.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || '';
  
    const leftTitle = getText('left-title');
    const leftDescHTML = getHTML('left-description');
  
    const rightItems = [
      {
        title: getText('right-first-title'),
        desc: getHTML('right-first-description'),
        link: getText('right-first-link'),
      },
      {
        title: getText('right-second-title'),
        desc: getHTML('right-second-description'),
        link: getText('right-second-link'),
      },
      {
        title: getText('right-third-title'),
        desc: getHTML('right-third-description'),
        link: getText('right-third-link'),
      },
    ];
  
    // Left Column
    const leftColumn = div(
      { class: 'w-full md:w-1/2 pr-6' },
      h2({ class: 'text-2xl font-semibold text-black leading-snug mb-4' }, leftTitle),
      div(
        { class: 'text-base text-gray-700 leading-relaxed' },
        ...Array.from(new DOMParser().parseFromString(leftDescHTML, 'text/html').body.childNodes)
      )
    );
  
    // Right Column
    const rightColumn = div(
      { class: 'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-6 mt-10 md:mt-0' },
      ...rightItems.map(({ title, desc, link }) =>
        div({ class: 'py-4' },
          p({ class: 'font-semibold text-black text-lg mb-1' }, title),
          div(
            { class: 'text-sm text-gray-700 mb-2' },
            ...Array.from(new DOMParser().parseFromString(desc, 'text/html').body.childNodes)
          ),
          a(
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
  
    // Final Layout
    const layout = div(
      {
        class: 'flex flex-col md:flex-row justify-between gap-8 max-w-[1200px] mx-auto px-6 py-12'
      },
      leftColumn,
      rightColumn
    );
  
    // Replace existing content safely
    block.innerHTML = '';
    block.appendChild(layout);
  }
  
import {
    div, p, h2, a, section, h3
  } from '../../scripts/dom-builder.js';
  
  export default function decorate(block) {
    const getText = (prop) =>
      block.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() || '';
    const getHTML = (prop) =>
      block.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || '';
  
    // === Section wrapper (now clean) ===
    const eyesection = section();
  
    // === New inner layout wrapper with styling ===
    const wrapper = div({
      class: `
        flex flex-col md:flex-row gap-6
        max-w-[1200px] mx-auto px-6 md:px-10 py-10 mt-12
      `.trim()
    });
  
    // === LEFT COLUMN ===
    const leftTitle = getText('left-title');
    const leftDescription = getHTML('left-description');
    const leftCol = div(
      { class: 'w-full md:w-1/2 pr-0 md:pr-6 min-h-[200px]' },
      h2({ class: 'text-2xl md:text-3xl font-semibold mb-4 text-black' }, leftTitle),
      div(
        { class: 'text-base text-gray-700 leading-relaxed' },
        ...Array.from(new DOMParser().parseFromString(leftDescription, 'text/html').body.childNodes)
      )
    );
  
    // === RIGHT COLUMN ===
    const rightCol = div({
      class: 'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-0 md:pl-6 mt-8 md:mt-0 min-h-[200px]'
    });
  
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
  
    rightItems.forEach(({ title, desc, link }) => {
      const container = div(
        { class: 'py-6' },
        h3({ class: 'text-lg font-semibold mb-1 text-black' }, title),
        div(
          { class: 'text-sm text-gray-700 mb-3' },
          ...Array.from(new DOMParser().parseFromString(desc, 'text/html').body.childNodes)
        ),
        a(
          {
            href: '#',
            class: 'text-purple-700 text-sm font-semibold hover:underline flex items-center gap-1'
          },
          link
        )
      );
      rightCol.appendChild(container);
    });
  
    // === Final assembly ===
    wrapper.append(leftCol, rightCol);
    eyesection.appendChild(wrapper);
    //block.innerHTML = '';
    block.appendChild(eyesection);
  }
  
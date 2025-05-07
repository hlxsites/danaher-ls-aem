import {
  div, p, h2, a, section, h3
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Helper functions
  const getText = (prop) =>
    block.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() || '';
  const getHTML = (prop) =>
    block.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || '';

  // === Section container
  const eyesection = section({
    class: `
      flex flex-col md:flex-row justify-between gap-10
      px-6 py-10 mt-12 rounded-md
      max-w-[1440px] w-full mx-auto
    `.trim()
  });

  // === Left Column
  const leftTitle = getText('left-title');
  const leftDescription = getHTML('left-description');
  const leftCol = div(
    { class: 'flex-1' },
    h2({ class: 'text-2xl md:text-3xl font-semibold mb-4' }, leftTitle),
    div(
      { class: 'text-base text-gray-700 leading-relaxed' },
      ...Array.from(new DOMParser().parseFromString(leftDescription, 'text/html').body.childNodes)
    )
  );

  // === Right Column
  const rightCol = div({ class: 'flex-1 space-y-10' });

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
      { class: 'border-b border-gray-300 pb-6' },
      h3({ class: 'text-xl font-semibold mb-1' }, title),
      div(
        { class: 'text-sm text-gray-700 mb-3' },
        ...Array.from(new DOMParser().parseFromString(desc, 'text/html').body.childNodes)
      ),
      a(
        {
          href: '#',
          class: 'text-blue-600 text-sm font-semibold hover:underline',
        },
        link
      )
    );
    rightCol.appendChild(container);
  });

  // === Compose
  eyesection.append(leftCol, rightCol);
  block.innerHTML = '';
  block.appendChild(eyesection);
}

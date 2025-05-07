import {
  div, p, img, h2, button, section
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Extract authored content
  const title1 = block.querySelector('[data-aue-prop="title1"]')?.textContent.trim() || '';
  const title2 = block.querySelector('[data-aue-prop="title2"]')?.textContent.trim() || '';
  const descriptionHTML = block.querySelector('[data-aue-prop="description"]')?.innerHTML || '';
  const imgEl = block.querySelector('img[data-aue-prop="fileReference"]');
  const ctaText = block.querySelector('[data-aue-prop="link"]')?.textContent.trim() || 'Learn More';
  const rightColor = block.querySelectorAll('.button-container a')[1]?.textContent.trim() || '#660099';

  const imgSrc = imgEl?.getAttribute('src') || '';
  const imgAlt = imgEl?.getAttribute('alt') || title1;

  // === Section Container
  const bannerSection = section({
    class: 'flex flex-col md:flex-row items-stretch w-full max-w-[1440px] mx-auto my-12 overflow-hidden'
  });

  // === Left Section (Image fills height)
  const leftSection = div({
    class: 'flex-1 flex items-stretch justify-center'
  },
    div({
      class: 'flex items-center justify-center h-full w-full'
    },
      img({
        src: imgSrc,
        alt: imgAlt,
        class: 'w-full h-full object-cover'
      })
    )
  );

  // === Right Section (Content)
  const rightSection = div({
    class: 'flex-1 flex flex-col justify-center px-10 py-12 text-white',
    style: `background-color: ${rightColor}`
  },
    p({ class: 'text-sm font-semibold mb-2' }, title1),
    h2({ class: 'text-2xl md:text-3xl font-semibold mb-4 leading-snug text-white' }, title2),
    div({
      class: 'text-sm leading-relaxed mb-4'
    }, ...Array.from(new DOMParser().parseFromString(descriptionHTML, 'text/html').body.childNodes)),
    button({
      class: `
        self-start mt-2 border border-white bg-white text-black 
        text-sm font-semibold px-6 py-3 rounded-full 
        hover:bg-opacity-90 transition duration-300
      `.trim()
    }, ctaText)
  );

  // === Compose and Inject
  bannerSection.append(leftSection, rightSection);
  block.innerHTML = '';
  block.appendChild(bannerSection);
}

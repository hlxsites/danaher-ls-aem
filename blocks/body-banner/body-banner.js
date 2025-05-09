import {
  div, p, h2, img, button, section, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const title1 = block.querySelector('[data-aue-prop="title1"]')?.textContent.trim() || '';
  const title2 = block.querySelector('[data-aue-prop="title2"]')?.textContent.trim() || '';
  const descriptionHTML = block.querySelector('[data-aue-prop="description"]')?.innerHTML || '';
  const imgEl = block.querySelector('img[data-aue-prop="fileReference"]');
  const ctaText = block.querySelector('[data-aue-prop="link"]')?.textContent.trim() || 'Learn More';
  const rightColor = block.querySelectorAll('.button-container a')[1]?.textContent.trim() || '#660099';

  const imgSrc = imgEl?.getAttribute('src') || '';
  const imgAlt = imgEl?.getAttribute('alt') || title1;

  const bannerSection = section({
    class: 'flex flex-col md:flex-row items-stretch w-full max-w-[1440px] mx-auto overflow-hidden rounded-md'
  });

  // === Left Image Section ===
  const leftSection = div({
    class: 'flex w-[608px] flex-col items-start'
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

  // === Right Text Section ===
  const rightSection = div({
    class: 'flex w-[630px] justify-center items-center',
    style: `background-color: ${rightColor}; padding: 83.667px 32px 83.563px 32px;`,
  },
    div({
      class: 'flex flex-col gap-6',
    },
      p({ class: 'text-white text-sm font-semibold px-0 py-1 flex justify-center items-center gap-2' }, title1),

      h2({
        class: 'text-white text-[24px] leading-[32px] font-normal font-["TWK Lausanne Pan"]'
      }, title2),

      p({
        class: 'text-white text-base font-bold leading-[22px] font-["TWK Lausanne Pan"]'
      }, 'Comprehensive charge variant analysis made simple'),

      div({
        class: 'text-white text-base font-extralight leading-[22px] font-["TWK Lausanne Pan"]'
      }, ...Array.from(new DOMParser().parseFromString(descriptionHTML, 'text/html').body.childNodes)),

      button({
        class: 'flex justify-center items-center px-[25px] py-[13px] bg-white text-black rounded-full text-sm font-semibold hover:bg-opacity-90 transition duration-300 self-start'
      }, ctaText)
    )
  );

  bannerSection.append(leftSection, rightSection);
  block.innerHTML = '';
  block.appendChild(bannerSection);
}

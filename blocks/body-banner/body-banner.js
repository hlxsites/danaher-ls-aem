import {
  div, p, img, h2, button, section
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

  const leftSection = div({ class: 'flex items-center justify-center h-full w-full p-12' },
    img({
      src: imgSrc,
      alt: imgAlt,
      class: 'w-full h-auto object-contain'
    })
  );

  const rightSection = div({
    class: 'flex flex-col justify-center items-start gap-6 px-8 py-12',
    style: `background-color: ${rightColor}`
  },
    p({ class: 'text-sm font-semibold text-white' }, title1),
    h2({ class: 'text-[24px] leading-[32px] text-white font-normal' }, title2),
    div({
      class: 'text-sm leading-relaxed text-white'
    }, ...Array.from(new DOMParser().parseFromString(descriptionHTML, 'text/html').body.childNodes)),
    button({
      class: 'bg-white text-black text-sm font-semibold px-6 py-2 rounded-full hover:bg-opacity-90 transition',
    }, ctaText)
  );

  bannerSection.append(leftSection, rightSection);
  block.innerHTML = '';
  block.appendChild(bannerSection);
}

import {
  div, p, img, a, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const titleEl = block.querySelector('[data-aue-prop="offer_title"]');
  const imgEl = block.querySelector('img[data-aue-prop="fileReference"]');
  const linkTextEl = block.querySelector('[data-aue-prop="link"]');
  const bgColorEl = block.querySelector('[data-aue-prop="bg-color"]');

  const title = titleEl?.textContent?.trim() || '';
  const imgSrc = imgEl?.getAttribute('src') || '';
  const imgAlt = imgEl?.getAttribute('alt') || 'Banner image';
  const linkText = linkTextEl?.textContent?.trim() || '';
  const bgColor = bgColorEl?.textContent?.trim() || 'bg-gray-100';

  const bannerSection = div(
    {
      class: `${bgColor} py-10 px-24 flex flex-col md:flex-row items-center gap-16 max-w-[1200px] mx-auto rounded-md`
    },

    // Logo
    img({
      src: imgSrc,
      alt: imgAlt,
      class: 'h-16 w-auto'
    }),

    // Text Block
    div(
      { class: 'flex flex-col items-start max-w-3xl' },

      // Main Message
      p(
        { class: 'text-2xl font-bold text-gray-900 leading-snug pl-8' },
        title
      ),

      // Discover Link
      linkText && a(
        {
          href: '#',
          class: 'text-sm text-purple-700 font-semibold mt-4 flex items-center gap-1 hover:underline pl-8'
        },
        linkText,
        span({
          class: 'text-purple-700',
          textContent: '→'
        })
      )
    )
  );

  block.innerHTML = '';
  block.appendChild(bannerSection);
}

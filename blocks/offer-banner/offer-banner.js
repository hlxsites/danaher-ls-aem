import {
  div, p, img, a, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const bannerSection = div(
    { class: 'bg-gray-100 py-10 px-24 flex flex-col md:flex-row items-center gap-16 max-w-[1200px] mx-auto rounded-md' },
  
    // Logo
    img({
      src: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/leica-banner.webp', 
      alt: 'SCIEX Logo',
      class: 'h-16 w-auto'
    }),
  
    // Text Block
    div(
      { class: 'flex flex-col items-start max-w-3xl' },
  
      // Main Message with left padding
      p(
        { class: 'text-2xl font-bold text-gray-900 leading-snug pl-8' }, // Added `pl-8` for left padding
        'We see a way to reduce 384-well plate LC-MS analysis from',
        ' ',
        '10 hours to 10 minutes.'
      ),
  
      // Discover Link
      a(
        {
          href: '#',
          class: 'text-sm text-purple-700 font-semibold mt-4 flex items-center gap-1 hover:underline pl-8'
        },
        'Discover how ',
        span({
          class: 'text-purple-700',
          textContent: '→'
        })
      )
    )
  );
  
  block.appendChild(bannerSection);
}

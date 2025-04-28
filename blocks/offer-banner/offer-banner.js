import {
    div, p, img, a, span
  } from '../../scripts/dom-builder.js';
  
  export default function decorate(block) {
    const bannerSection = div(
      { class: 'bg-gray-100 p-6 flex items-center gap-4 max-w-[1200px] mx-auto' },
  
      // Logo
      img({
        src: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/sciex-logo.png', // replace with your correct logo URL
        alt: 'SCIEX Logo',
        class: 'h-10 w-auto'
      }),
  
      // Text Block
      div(
        { class: 'flex flex-col' },
  
        // Main Message
        p(
          { class: 'text-gray-800 font-medium' },
          'We see a way to reduce 384-well plate LC-MS analysis from 10 hours to 10 minutes.'
        ),
  
        // Discover Link
        a(
          {
            href: '#',
            class: 'text-xs text-blue-600 mt-2 hover:underline flex items-center gap-1'
          },
          span({ innerHTML: '→' }),
          'Discover how'
        )
      )
    );
  
    // Append built section into the given block
    block.appendChild(bannerSection);
  }
  
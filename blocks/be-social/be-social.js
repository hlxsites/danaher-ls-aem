import {
  div, p,img,a,h2,span
} from '../../scripts/dom-builder.js';
export default function decorate(block) {

// Be social block
const socialSection = div(
  { class: 'max-w-[1200px] mx-auto px-6 py-10' },

  // Header
  div(
    { class: 'flex justify-between items-center mb-6' },
    h2({ class: 'text-2xl font-semibold text-black' }, 'Be social'),
    a(
      {
        href: '#',
        class: 'text-sm text-blue-600 font-medium hover:underline flex items-center gap-1'
      },span({ innerHTML: '→' }),'See all'
    )
  ),

  // Card Row
  div(
    { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
    ...Array(3).fill().map(() =>
      div(
        { class: 'bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden' },

        // Image
        img({
          src: '/icons/be-social.png', // Use your image path here
          alt: 'Social Image',
          class: 'w-full h-auto object-cover'
        }),

        // Card Content
        div(
          { class: 'p-4' },

          // Header with icon + company name
          div(
            { class: 'flex items-center gap-2 mb-2' },
            img({
              src: '/icons/danaher-logo.png', // Twitter icon or similar
              alt: 'Twitter',
              class: 'w-5 h-5'
            }),
            div(
              {},
              p({ class: 'text-sm font-semibold text-gray-900' }, 'Danaher Corporation'),
              p({ class: 'text-xs text-gray-500' }, '@Danaher · 2 days ago')
            )
          ),

          // Tweet Text
          p(
            { class: 'text-sm text-gray-700 leading-snug mb-2' },
            'Today, we announced results for the third quarter 2023. ',
            span(
              { class: 'text-blue-600 underline' },
              'https://lnkd.in/e3bmfPU'
            ),
            ' #speedoflife'
          ),

          // LinkedIn logo on right
          div(
            { class: 'flex justify-end' },
            img({
              src: '/icons/linked-in.png',
              alt: 'LinkedIn',
              class: 'w-5 h-5'
            })
          )
        )
      )
    )
  )
);

// Append it to your root or wherever
block.appendChild(socialSection);
}
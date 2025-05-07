// import {
//     div, p, h2, a, span
//   } from '../../scripts/dom-builder.js';
  
//   export default function decorate(block) {
//     const getText = (prop) =>
//       block.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() || '';
//     const getHTML = (prop) =>
//       block.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || '';
  
//     const leftTitle = getText('left-title');
//     const leftDesc = getHTML('left-description');
  
//     const rightItems = [
//       {
//         title: getText('right-first-title'),
//         desc: getHTML('right-first-description'),
//         link: getText('right-first-link'),
//       },
//       {
//         title: getText('right-second-title'),
//         desc: getHTML('right-second-description'),
//         link: getText('right-second-link'),
//       },
//       {
//         title: getText('right-third-title'),
//         desc: getHTML('right-third-description'),
//         link: getText('right-third-link'),
//       },
//     ];
  
//     // === Left Section (you requested exact class match)
//     const leftSection = div(
//       { class: 'w-full md:w-1/2 pr-0 md:pr-6 min-h-[200px]' },
//       h2({ class: 'text-2xl font-semibold text-black leading-snug mb-4' }, leftTitle),
//       div(
//         { class: 'text-base text-gray-700 leading-relaxed space-y-4' },
//         ...Array.from(new DOMParser().parseFromString(leftDesc, 'text/html').body.childNodes)
//       )
//     );
  
//     // === Right Section (3 items stacked)
//     const rightSection = div(
//       { class: 'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-0 md:pl-6 mt-8 md:mt-0 min-h-[200px]' },
//       ...rightItems.map(({ title, desc, link }) =>
//         div({ class: 'py-6' },
//           p({ class: 'font-semibold text-black text-lg mb-2' }, title),
//           div(
//             { class: 'text-sm text-gray-700 mb-3' },
//             ...Array.from(new DOMParser().parseFromString(desc, 'text/html').body.childNodes)
//           ),
//           a(
//             {
//               href: '#',
//               class:
//                 'text-sm text-purple-700 font-semibold hover:underline flex items-center gap-1',
//             },
//             link,
//             span({ class: 'text-purple-700', textContent: '→' })
//           )
//         )
//       )
//     );
  
//     // === Parent Flex Container (exact class structure)
//     const parentContainer = div(
//       {
//         class: 'flex flex-col md:flex-row items-start justify-between max-w-[1200px] mx-auto px-6 py-12 gap-8',
//       },
//       leftSection,
//       rightSection
//     );
  
//     // Clear and insert
//     block.innerHTML = '';
//     block.classList.add('section', 'insight-container');
//     block.appendChild(parentContainer);
//   }
  
// import {
//   div, p,img,a,h6
// } from '../../scripts/dom-builder.js';
// export default function decorate(block) {

// //Learn more section// ---------------- Learn More Section ----------------
// const learnMoreContainer = div(
//   {
//      class: 'border-t border-gray-300 pt-6 mt-10' 
//   });
// const innerLearnMore = div(
//   {
//      class: 'max-w-[1100px] mx-auto px-4 flex flex-wrap justify-between items-start gap-6' 
//   });
// // Left Title
// const titleLearnMore = document.createElement('h3');
// titleLearnMore.className = 'text-base font-semibold text-black min-w-[120px]';
// titleLearnMore.textContent = 'Learn more';

// // Flex container for contact sections

// const contactFlex = div(
//   {
//      class: 'flex flex-wrap justify-start gap-14 text-sm text-gray-700 w-full max-w-4xl' 
//   });
// // Address section
// const addressSection = div(
//   { class: 'space-y-1' },
//   h6({ class: 'font-medium text-black' }, 'Leica Microsystems'),
//   h6({}, 'Ernst-Leitz-Straße 17–37'),
//   h6({}, '35578'),
//   h6({}, 'Wetzlar'),
//   h6({}, 'Germany'),
//   h6({ class: 'text-violet-600 hover:underline cursor-pointer mt-2' }, 'View in maps →')
// );

// // Wrapper for Call and Browse (stacked)
// const callAndBrowseWrapper = div(
//   { class: 'space-y-6' }, // vertical gap between sections
//   div(
//     { class: 'space-y-1' },
//     h6({ class: 'font-medium text-black' }, 'Call'),
//     h6({ class: 'text-violet-600 hover:underline cursor-pointer' }, '1 800-248-0123 →')
//   ),
//   div(
//     { class: 'space-y-1' },
//     h6({ class: 'font-medium text-black' }, 'Browse'),
//     h6({ class: 'text-violet-600 hover:underline cursor-pointer' }, 'Visit Leica Microsystems →')
//   )
// );

// // Combine
// contactFlex.append(addressSection, callAndBrowseWrapper);
// innerLearnMore.append(titleLearnMore, contactFlex);
// learnMoreContainer.appendChild(innerLearnMore);

// // Final append
// block.appendChild(learnMoreContainer);
// }
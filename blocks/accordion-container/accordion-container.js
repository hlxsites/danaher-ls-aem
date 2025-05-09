// import {
//   div, h3, input, label, span,
// } from '../../scripts/dom-builder.js';
// import { generateUUID } from '../../scripts/scripts.js';
// import { decorateIcons } from '../../scripts/lib-franklin.js';

// /**
//  * Toggles the accordion state
//  * @param {string} blockUUID - The UUID of the accordion block
//  * @param {HTMLElement} activeAccordion - The accordion item being toggled
//  */
// function toggleAccordion(blockUUID, activeAccordion) {
//   const allAccordions = document.querySelectorAll(`div#accordion-${blockUUID} div.accordion-item`);
//   allAccordions.forEach((accordion) => {
//     if (accordion.id === activeAccordion.id) {
//       const checkbox = accordion.querySelector('input[type="checkbox"]');
//       const summaryLabel = accordion.querySelector('label');
      
//       if (checkbox.checked) {
//         summaryLabel.setAttribute('aria-expanded', 'true');
//       } else {
//         summaryLabel.setAttribute('aria-expanded', 'false');
//       }
//     } else {
//       const checkbox = accordion.querySelector('input[type="checkbox"]');
//       const summaryLabel = accordion.querySelector('label');
      
//       if (checkbox.checked) {
//         checkbox.checked = false;
//         summaryLabel.setAttribute('aria-expanded', 'false');
//       }
//     }
//   });
// }

// /**
//  * Creates an accordion item
//  * @param {string} question - The accordion title
//  * @param {Array} answer - The accordion content
//  * @param {string} image - Optional image
//  * @param {string} uuid - UUID for the item
//  * @param {HTMLElement} parentElement - Parent element to append to
//  * @param {number} index - Index of the accordion item
//  * @param {string} customUUID - UUID for the accordion block
//  * @returns {HTMLElement} - The created accordion item
//  */
// function createAccordionBlock(question, answer, image, uuid, parentElement, index, customUUID) {
//   // Clear the parent element
//   parentElement.innerHTML = '';
  
//   // Add classes to the parent element
//   parentElement.classList.add('accordion-item', 'relative', 'py-2', 'border-t', 'border-gray-300');
//   parentElement.id = `accordion-item-${index}`;

//   // Create the checkbox input
//   const summaryInput = input({
//     type: 'checkbox',
//     class: 'peer hidden absolute',
//     name: 'accordions',
//     value: uuid,
//     id: `accordion-${uuid}-${index}`,
//     'aria-labelledby': question,
//   });

//   // Create the label/summary
//   const summaryContent = label(
//     {
//       for: `accordion-${uuid}-${index}`,
//       title: question,
//       'aria-controls': `accordion-${uuid}-${index}`,
//       'aria-expanded': 'false',
//       class: 'flex items-center justify-between w-full text-left font-semibold py-2 cursor-pointer ' +
//              'peer-[&_span.chevron-up]:opacity-100 peer-checked:[&_span.chevron-up]:opacity-0 ' +
//              'peer-[&_span.chevron-down]:opacity-0 peer-checked:[&_span.chevron-down]:opacity-100',
//     },
//     h3({ class: '!text-xl font-medium leading-7 my-0 mr-12', title: question }, question),
//     span({
//       class: 'icon icon-chevron-down w-6 h-6 absolute right-0 fill-current text-gray-500 chevron-up [&_svg>use]:stroke-gray-500',
//     }),
//     span({
//       class: 'icon icon-chevron-up w-6 h-6 absolute right-0 fill-current text-gray-500 chevron-down [&_svg>use]:stroke-gray-500',
//     }),
//   );

//   // Show the first item if there's an image
//   if (image && index === 0) summaryContent.classList.add('show');

//   // Create the content panel
//   const panel = div(
//     {
//       class: 'grid text-sm overflow-hidden transition-all duration-300 ease-in-out ' +
//              'grid-rows-[0fr] opacity-0 peer-checked:py-2 peer-checked:grid-rows-[1fr] peer-checked:opacity-100',
//     },
//     div({ class: 'accordion-answer text-base leading-7 overflow-hidden' }),
//   );

//   // Handle different types of answer content
//   if (typeof answer === 'string') {
//     panel.querySelector('.accordion-answer').innerHTML = answer;
//   } else if (Array.isArray(answer)) {
//     answer.forEach((element) => {
//       if (typeof element === 'string') {
//         panel.querySelector('.accordion-answer').innerHTML += element;
//       } else if (element instanceof HTMLElement) {
//         panel.querySelector('.accordion-answer').appendChild(element);
//       }
//     });
//   }

//   // Style links in the answer
//   panel.querySelectorAll('a').forEach((link) => {
//     link.classList.remove('btn', 'btn-outline-primary');
//     link.classList.add('text-sm', 'font-bold', 'text-danaherpurple-500', '!no-underline');
//   });

//   // Add click event listener
//   summaryContent.addEventListener('click', () => {
//     // Toggle the checkbox state
//     summaryInput.checked = !summaryInput.checked;
    
//     // Update accordion state
//     toggleAccordion(customUUID, parentElement);
    
//     // Handle image display if needed
//     if (image) {
//       const selectedImage = document.querySelector(`div[data-id="${uuid}"]`);
//       selectedImage?.parentElement?.childNodes.forEach((imageEl) => {
//         if (imageEl.classList?.contains('block')) {
//           imageEl.classList.add('hidden');
//           imageEl.classList.remove('block');
//         }
//         if (imageEl.getAttribute('data-id') === String(uuid)) {
//           imageEl.classList.add('block');
//           imageEl.classList.remove('hidden');
//         }
//       });
//     }
//   });

//   // Append elements to the parent
//   parentElement.append(summaryInput, summaryContent, panel);
//   return parentElement;
// }

// /**
//  * Main function to decorate the accordion block
//  * @param {HTMLElement} block - The block element to decorate
//  */
// export default async function decorate(block) {
//   // Create a container for the accordion with a unique ID
//   const customUUID = generateUUID();
//   const accordionWrapper = div({ id: `accordion-${customUUID}`, class: 'accordion-wrapper' });
  
//   // Get the super title from the container
//   const accordion_container_title = block.querySelector('[data-aue-prop="accordion_container_title"]')?.textContent.trim() || '';

//   // Find all accordion items
//   const accordionItems = [...block.querySelectorAll('[data-aue-model="accordion-item"]')];
  
//   // Process each accordion item
//   const dynamicAccordionItems = accordionItems.map((item, index) => {
//     const uuid = generateUUID();
//     const question = item.querySelector('[data-aue-prop="accordion_title"]')?.textContent || '';
//     const answer = item.querySelector('[data-aue-prop="accordion_description"]')?.textContent || '';
    
//     // Skip items without content
//     if (!question || !answer) return null;
    
//     const parentElement = div();
//     return createAccordionBlock(question, answer, null, uuid, parentElement, index, customUUID);
//   }).filter(Boolean); // Remove null items

//   // Create the layout container
//   const layoutContainer = div({ class: 'flex space-x-8 accordion-rendered' });
  
//   // Create the title container
//   const titleContainer = div({
//     class: 'w-[30%]',
//   }, h3({ class: 'text-2xl font-bold' }, accordion_container_title));

//   // Create the accordion container
//   const accordionContainer = div({
//     class: 'w-[70%] space-y-4',
//   }, ...dynamicAccordionItems);

//   // Assemble the layout
//   layoutContainer.append(titleContainer, accordionContainer);
//   accordionWrapper.append(layoutContainer);
  
//   // Replace the block content
//   block.innerHTML = '';
//   block.append(accordionWrapper);

//   // Decorate icons
//   decorateIcons(block);

//   // Hide original content
//   block.querySelectorAll('[data-aue-model]').forEach((el) => {
//     el.style.display = 'none';
//   });
// }

export default async function decorate(block) {
  console.log("accordion block",block);
}
import {
    div, h3, input, label, span, p
  } from '../../scripts/dom-builder.js';
  import { generateUUID } from '../../scripts/scripts.js';
  import { decorateIcons } from '../../scripts/lib-franklin.js';
  
  function toggleAccordion(blockUUID, activeAccordion) {
    const allAccordions = document.querySelectorAll(`div#accordion-${blockUUID} div.accordion-item`);
    allAccordions.forEach((accordion) => {
      if (accordion.id === activeAccordion.id) {
        if (activeAccordion.children[0].checked) {
          activeAccordion.children[1].setAttribute('aria-expanded', false);
        } else {
          activeAccordion.children[1].setAttribute('aria-expanded', true);
        }
      }
      if (accordion.id !== activeAccordion.id && accordion.children[0].checked) {
        accordion.children[0].click();
        accordion.children[1].setAttribute('aria-expanded', false);
      }
    });
  }
  
  function createAccordionBlock(question, answer, image, uuid, parentElement, index, customUUID) {
    parentElement.innerHTML = '';
    parentElement.classList.add('accordion-item', 'relative', 'py-2', 'border-t', 'border-gray-300'); // Added border-t and border-gray-300
    parentElement.id = `accordion-item-${index}`;
  
    const summaryInput = input({
      type: 'checkbox',
      class: 'peer hidden absolute',
      name: 'accordions',
      value: uuid,
      id: `accordion-${uuid}-${index}`,
      'aria-labelledby': question,
    });
  
    const summaryContent = label(
      {
        for: `accordion-${uuid}-${index}`,
        title: question,
        'aria-controls': `accordion-${uuid}-${index}`,
        class: 'flex items-center justify-between w-full text-left font-semibold py-2 cursor-pointer ' +
               'peer-[&_span.chevron-up]:opacity-100 peer-checked:[&_span.chevron-up]:opacity-0 ' +
               'peer-[&_span.chevron-down]:opacity-0 peer-checked:[&_span.chevron-down]:opacity-100',
      },
      h3({ class: '!text-xl font-medium leading-7 my-0 mr-12', title: question }, question),
      span({
        class: 'icon icon-chevron-down w-6 h-6 absolute right-0 fill-current text-gray-500 chevron-up [&_svg>use]:stroke-gray-500',
      }),
      span({
        class: 'icon icon-chevron-up w-6 h-6 absolute right-0 fill-current text-gray-500 chevron-down [&_svg>use]:stroke-gray-500',
      }),
    );
  
    if (image && index === 0) summaryContent.classList.add('show');
  
    const panel = div(
      {
        class: 'grid text-sm overflow-hidden transition-all duration-300 ease-in-out ' +
               'grid-rows-[0fr] opacity-0 peer-checked:py-2 peer-checked:grid-rows-[1fr] peer-checked:opacity-100',
      },
      div({ class: 'accordion-answer text-base leading-7 overflow-hidden' }),
    );
  
    answer.forEach((element) => {
      panel.querySelector('.accordion-answer').innerHTML += element;
    });
  
    panel.querySelectorAll('a').forEach((link) => {
      link.classList.remove('btn', 'btn-outline-primary');
      link.classList.add('text-sm', 'font-bold', 'text-danaherpurple-500', '!no-underline');
    });
  
    summaryContent.addEventListener('click', () => {
      toggleAccordion(customUUID, parentElement);
      if (image) {
        const selectedImage = document.querySelector(`div[data-id="${uuid}"]`);
        selectedImage?.parentElement?.childNodes.forEach((imageEl) => {
          if (imageEl.classList?.contains('block')) {
            imageEl.classList.add('hidden');
            imageEl.classList.remove('block');
          }
          if (imageEl.getAttribute('data-id') === String(uuid)) {
            imageEl.classList.add('block');
            imageEl.classList.remove('hidden');
          }
        });
      }
    });
  
    parentElement.append(summaryInput, summaryContent, panel);
    return parentElement;
  }
  
  export default async function decorate(block) {
     const accordion_container_title = block.querySelector('[data-aue-prop="accordion_container_title"]')?.textContent.trim() || '';
    const accordion_title = block.querySelector('[data-aue-prop="accordion_title"]')?.textContent.trim() || '';
    const accordion_description = block.querySelector('[data-aue-prop="accordion_description"]')?.textContent.trim() || '';

    console.log("block", block);
    console.log("accordion_container_title",accordion_container_title, "accordion_title", accordion_title);
    console.log("accordion_description", accordion_description);
   const accordionBannerTitle = p(
    {
      class: "text-black text-4xl font-normal leading-[48px]",
    },
    accordion_container_title
  );

  block.innerHTML='';
  block.append(accordionBannerTitle);
    const customUUID = generateUUID();
  
    const dynamicData = [...block.children].map((element, index) => {
      const question = element.querySelector('[data-aue-prop="accordion_title"]')?.textContent;
      const answer = element.querySelector('[data-aue-prop="accordion_description"]')?.textContent;
      return { question, answer };
    });
  
    const filteredDynamicData = dynamicData.filter((item) => item.question !== undefined && item.answer !== undefined);
  
    const dynamicAccordionItems = filteredDynamicData.map((data, index) => {
      const uuid = generateUUID();
      const parentElement = div();
      return createAccordionBlock(
        data.question,
        [data.answer], 
        null,  
        uuid,
        parentElement,
        index,
        customUUID,
      );
    });
  
    const accordionImages = filteredDynamicData.map((data, index) => {
      const imageElement = data.image;
      if (!imageElement) return null;
      imageElement.classList.add('accordion-image', 'h-full', index === 0 ? 'block' : 'hidden');
      imageElement.setAttribute('data-id', data.uuid);
      return imageElement;
    }).filter(Boolean);
  
    const images = div(
      { class: 'accordion-images hidden lg:block' },
      ...accordionImages,
    );
    const layoutContainer = div({ class: 'flex space-x-8' });
    const faqTextContainer = div({
      class: 'w-[30%]',
    }, h3({ class: 'text-2xl font-bold' }, accordion_container_title));
  
    const accordionContainer = div({
      class: 'w-[70%] space-y-4',
    }, ...dynamicAccordionItems);
  
    layoutContainer.append(faqTextContainer, accordionContainer);
    block.innerHTML='';
    block.appendChild(layoutContainer);
  
    block.append(images);
  
    const titleEl = [...block.children][0];
    const title = titleEl.querySelector(':scope > div > h2');
    if (titleEl && title) {
      title.classList.add('lg:text-center', 'align-middle', 'lg:pl-44', 'eyebrow');
      block.parentElement.prepend(titleEl);
    }
  
    decorateIcons(block); 
  }
  
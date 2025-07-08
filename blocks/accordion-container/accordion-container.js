import {
  div, h3, input, label, span,
} from '../../scripts/dom-builder.js';
import { generateUUID } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function toggleAccordion(blockUUID, activeAccordion) {
  const allAccordions = document.querySelectorAll(
    `div#accordion-${blockUUID} div.accordion-item`,
  );
  allAccordions.forEach((accordion) => {
    const checkbox = accordion.querySelector('input[type="checkbox"]');
    const panel = accordion.querySelector('div[aria-expanded]');

    if (accordion.id === activeAccordion.id) {
      panel?.setAttribute(
        'aria-expanded',
        checkbox?.checked ? 'false' : 'true',
      );
    }

    if (accordion.id !== activeAccordion.id && checkbox?.checked) {
      checkbox.click();
      panel?.setAttribute('aria-expanded', 'false');
    }
  });
}

function createAccordionBlock(
  question,
  answer,
  image,
  uuid,
  parentElement,
  index,
  customUUID,
) {
  parentElement.innerHTML = '';
  parentElement.classList.add(
    'accordion-item',
    'relative',
    'py-6',
    'border-t',
    'border-gray-300',
  );
  parentElement.id = `accordion-item-${index}`;

  const inputId = `accordion-${uuid}-${index}`;

  const summaryInput = input({
    type: 'checkbox',
    class: 'peer hidden absolute',
    name: 'accordions',
    value: uuid,
    id: inputId,
    'aria-labelledby': question,
  });

  const summaryContent = label(
    {
      for: inputId,
      title: question,
      'aria-controls': inputId,
      class: `flex items-center justify-between w-full text-left font-semibold py-2 cursor-pointer
        peer-[&_span.chevron-up]:opacity-100 peer-checked:[&_span.chevron-up]:opacity-0
        peer-[&_span.chevron-down]:opacity-0 peer-checked:[&_span.chevron-down]:opacity-100`,
    },
    h3(
      { class: '!text-xl font-medium leading-7 my-0 mr-12', title: question },
      question,
    ),
    span({
      class:
        'icon icon-chevron-down w-6 h-6 absolute right-0 fill-current text-gray-500 chevron-up [&_svg>use]:stroke-gray-500',
    }),
    span({
      class:
        'icon icon-chevron-up w-6 h-6 absolute right-0 fill-current text-gray-500 chevron-down [&_svg>use]:stroke-gray-500',
    }),
  );

  if (image && index === 0) summaryContent.classList.add('show');

  const panel = div(
    {
      class: `grid text-sm overflow-hidden transition-all duration-300 ease-in-out
        grid-rows-[0fr] opacity-0 peer-checked:py-2
        peer-checked:grid-rows-[1fr] peer-checked:opacity-100`,
      'aria-expanded': 'false',
    },
    div({
      class:
        'accordion-answer text-base font-extralight leading-7 overflow-hidden',
    }),
  );

  answer.forEach((element) => {
    panel.querySelector('.accordion-answer').innerHTML += element;
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.classList.remove('btn', 'btn-outline-primary');
    link.classList.add(
      'text-black',
      'underline',
      'decoration-black',
      'hover:decoration-danaherpurple-500',
      'hover:bg-danaherpurple-25',
      'text-danaherpurple-500',
      'hover:bg-danaherpurple-25',
      'hover:text-danaherpurple-500',
    );
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
  const wrapper = document.querySelector('.accordion-container-wrapper');
  wrapper?.parentElement?.removeAttribute('class');
  wrapper?.parentElement?.removeAttribute('style');

  const accordionContainerWrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 px-5 lg:px-0',
  });

  const accordionContainerTitle = block.firstElementChild?.querySelector('p')?.textContent.trim() || '';
  const customUUID = generateUUID();

  const dynamicData = Array.from(block.children)
    .slice(1)
    .map((element) => {
      const paragraphs = element.querySelectorAll('p');
      const firstParagraph = paragraphs[0];
      const question = firstParagraph?.textContent.trim() || '';

      element.children[0].firstElementChild.remove();
      const allChildren = Array.from(element.children);

      const answer = allChildren.map((child) => child.outerHTML).join('');

      return { question, answer };
    })
    .filter((item) => item.question && item.answer);

  const dynamicAccordionItems = dynamicData.map((data, index) => {
    const uuid = generateUUID();
    return createAccordionBlock(
      data.question,
      [data.answer],
      null,
      uuid,
      div(),
      index,
      customUUID,
    );
  });

  const layoutContainer = div({
    class: 'flex flex-col lg:flex-row gap-x-5 w-full accordion-rendered',
  });
  const faqTextContainer = div(
    { class: 'lg:w-[400px]' },
    h3({ class: '!text-[32px] font-bold !m-0 !p-0' }, accordionContainerTitle),
  );
  const accordionContainer = div(
    { class: 'lg:w-[840px] flex flex-col' },
    ...dynamicAccordionItems,
  );

  layoutContainer.append(faqTextContainer, accordionContainer);
  accordionContainerWrapper.append(layoutContainer);

  decorateIcons(accordionContainerWrapper);
  block.append(accordionContainerWrapper);

  [...block.children].forEach((child) => {
    if (!child.contains(accordionContainerWrapper)) {
      child.style.display = 'none';
    }
  });
}

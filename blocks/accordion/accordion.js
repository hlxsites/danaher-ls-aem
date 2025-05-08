import { div, h3, input, label, span } from '../../scripts/dom-builder.js';
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
  parentElement.classList.add('accordion-item', 'relative', 'py-2');
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
      class: 'icon icon-chevron-down w-6 h-6 absolute right-0 fill-current text-gray-400 chevron-up [&_svg>use]:stroke-gray-400',
    }),
    span({
      class: 'icon icon-chevron-up w-6 h-6 absolute right-0 fill-current text-gray-400 chevron-down [&_svg>use]:stroke-gray-400',
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
  const customUUID = generateUUID();

  const staticData = [...block.children].map((element, index) => {
    const question = element.querySelector('[data-aue-prop="accordion_question"]')?.textContent;
    const answer = element.querySelector('[data-aue-prop="accordion_answer"]')?.textContent;
    return { question, answer };
  });

  const staticAccordionItems = staticData.map((item, index) => {
    const uuid = generateUUID();
    const parentElement = div();
    return createAccordionBlock(
      item.question,
      item.answer,
      null,
      uuid,
      parentElement,
      index,
      customUUID,
    );
  });
e
  const questions = [...block.children].map((element) => {
    const questionElement = element.querySelector(':scope > div > h3');
    const imageElements = element.querySelector(':scope > div > picture');
    const answerElements = imageElements
      ? Array.from(element.querySelector(':scope > div:nth-child(2)').children).slice(1)
      : Array.from(element.querySelector(':scope > div').children).slice(1);
    return {
      question: questionElement?.textContent,
      image: imageElements?.parentElement,
      answer: answerElements.map((elem) => elem.outerHTML),
      uuid: generateUUID(),
      parentElement: element,
    };
  });

  const filteredQuestions = questions.filter((item) => item.question !== undefined);

  const dynamicAccordionItems = filteredQuestions.map((question, index) =>
    createAccordionBlock(
      question.question,
      question.answer,
      question.image,
      question.uuid,
      question.parentElement,
      index + staticAccordionItems.length,
      customUUID,
    ),
  );

  const accordionImages = filteredQuestions.map((question, index) => {
    if (!question.image) return null;
    question.image.classList.add('accordion-image', 'h-full', index === 0 ? 'block' : 'hidden');
    question.image.setAttribute('data-id', question.uuid);
    return question.image;
  }).filter(Boolean);

  const images = div(
    { class: 'accordion-images hidden lg:block' },
    ...accordionImages,
  );

  const titleEl = [...block.children][0];
  const title = titleEl.querySelector(':scope > div > h2');
  if (titleEl && title) {
    title.classList.add('lg:text-center', 'align-middle', 'lg:pl-44', 'eyebrow');
    block.parentElement.prepend(titleEl);
  }
  if (block.classList.contains('image')) {
    block.classList.add(
      'grid', 'max-w-7xl', 'w-full', 'mx-auto', 'grid-cols-1',
      'lg:grid-cols-2', 'gap-16', 'pt-4',
    );
    block.append(images);
  }

  const allAccordionItems = [...staticAccordionItems, ...dynamicAccordionItems];

  block.innerHTML = '';
  block.appendChild(
    div({ id: `accordion-${customUUID}`, class: 'divide-y divide-gray-900/10' }, ...allAccordionItems),
  );

  decorateIcons(block);
}

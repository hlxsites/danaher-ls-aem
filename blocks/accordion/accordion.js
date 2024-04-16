import {
  div, h3, input, label, span,
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

function createAccordionBlock(question, answer, image, uuid, index, customUUID) {
  const divEl = div({ id: `accordion-item-${index}`, class: 'accordion-item relative py-2' });
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
      class: 'flex items-center justify-between w-full text-left font-semibold py-2 cursor-pointer peer-[&_span.plus]:opacity-100 peer-checked:[&_span.plus]:opacity-0 peer-checked:[&_span.plus]:rotate-45 peer-[&_span.minus]:opacity-0 peer-[&_span.minus]:rotate-90 peer-checked:[&_span.minus]:rotate-180 peer-checked:[&_span.minus]:opacity-100 peer-checked:[&_span.minus]:opacity-100',
    },
    h3({ class: 'text-xl font-medium leading-7 my-0 mr-12', title: question }, question),
    span({ class: 'icon icon-dam-Plus w-6 h-6 absolute right-0 fill-current text-gray-400 rotate-0 transform transition-all ease-in-out plus [&_svg>use]:stroke-black' }),
    span({ class: 'icon icon-dam-Minus w-6 h-6 absolute right-0 fill-current text-gray-400 rotate-0 transform transition-all ease-in-out minus [&_svg>use]:stroke-black' }),
  );
  if (image && index === 0) {
    summaryContent.classList.add('show');
  }

  decorateIcons(summaryContent);

  const panel = div(
    { class: 'grid text-sm overflow-hidden transition-all duration-300 ease-in-out grid-rows-[0fr] opacity-0 peer-checked:py-2 peer-checked:grid-rows-[1fr] peer-checked:opacity-100' },
    div({ class: 'accordion-answer text-base leading-7 overflow-hidden' }),
  );

  answer.forEach((element) => {
    panel.querySelector('.accordion-answer').innerHTML += element;
  });

  panel.querySelector('a')?.classList.remove(...'btn btn-outline-primary'.split(' '));
  panel.querySelectorAll('a').forEach((link) => {
    link.classList.add(...'text-sm font-bold text-danaherpurple-500 !no-underline'.split(' '));
  });

  summaryContent.addEventListener('click', () => {
    toggleAccordion(customUUID, divEl);
    if (image) {
      const selectedImage = document.querySelector(`div[data-id="${uuid}"]`);
      selectedImage.parentElement.childNodes.forEach((imageEl) => {
        if (imageEl.classList.contains('block')) {
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
  divEl.append(summaryInput, summaryContent, panel);
  return divEl;
}

export default function decorate(block) {
  const customUUID = generateUUID();
  const questions = [...block.children].map((element) => {
    const questionElement = element.querySelector(':scope > div > h3');
    const imageElements = element.querySelector(':scope > div > picture');
    const answerElements = imageElements ? Array.from(element.querySelector(':scope > div:nth-child(2)').children).slice(1)
      : Array.from(element.querySelector(':scope > div').children).slice(1);
    return {
      question: questionElement?.textContent,
      image: imageElements?.parentElement,
      answer: answerElements.map((elem) => elem.outerHTML),
      uuid: generateUUID(),
    };
  });

  const filteredQuestions = questions.filter((item) => item.question !== undefined);
  const accordionItems = filteredQuestions
    .map((question, index) => createAccordionBlock(
      question.question,
      question.answer,
      question.image,
      question.uuid,
      index,
      customUUID,
    ));

  const accordionImages = filteredQuestions.map((question, index) => {
    if (index === 0) question.image?.classList.add(...'accordion-image h-full block'.split(' '));
    else question.image?.classList.add(...'accordion-image h-full hidden'.split(' '));
    question.image?.setAttribute('data-id', question.uuid);
    return question.image;
  });

  const images = div(
    { class: 'accordion-images hidden lg:block' },
    ...accordionImages,
  );

  const title = [...block.children][0].querySelector(':scope > div > h2');
  block.innerHTML = '';
  if (title && title.textContent) block.parentElement.prepend(title);
  if (block.classList.contains('image')) {
    block.classList.add(...'grid max-w-7xl w-full mx-auto grid-cols-1 lg:grid-cols-2 gap-16 pt-8'.split(' '));
    block.append(images);
  }
  decorateIcons(block);
  block.append(div({ id: `accordion-${customUUID}`, class: 'divide-y divide-gray-900/10' }, ...accordionItems));
}

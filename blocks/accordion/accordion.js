import {
  div, h3, details, summary,
} from '../../scripts/dom-builder.js';
import { generateUUID } from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function toggleAccordion(blockUUID, activeAccordion) {
  const allAccordions = document.querySelectorAll(`div#accordion-${blockUUID} details`);

  allAccordions.forEach((accordion) => {
    if (accordion.id === activeAccordion.id) {
      if (activeAccordion.children[0].getAttribute('aria-expanded') === 'true') {
        activeAccordion.children[0].setAttribute('aria-expanded', false);
      } else {
        activeAccordion.children[0].setAttribute('aria-expanded', true);
      }
    }
    if (accordion.id !== activeAccordion.id) {
      accordion.removeAttribute('open');
      accordion.children[0].setAttribute('aria-expanded', false);
    }
  });
}

function createAccordionBlock(question, answer, image, uuid, index, customUUID) {
  const divImageEl = div({ class: 'block lg:hidden pb-4' }, image);
  const divEl = details({ id: `accordion-item-${index}`, class: 'py-4 [&_div.panel]:transition-all [&_div.panel]:duration-700 [&_div.panel]:open:mt-4 [&_div.panel]:open:grid-rows-[1fr] [&_div.panel]:open:opacity-100 [&_svg.plus]:opacity-100 [&_svg.plus]:open:opacity-0 [&_svg.plus]:open:rotate-45 [&_svg.minus]:opacity-0 [&_svg.minus]:rotate-90 [&_svg.minus]:open:rotate-180 [&_svg.minus]:open:opacity-100 [&_svg.minus]:open:opacity-100' });
  const summaryContent = summary(
    { class: 'relative flex cursor-pointer list-none items-center gap-4 peer', 'aria-expanded': false, 'aria-controls': `${uuid}` },
    h3({ class: 'text-base font-semibold leading-7 my-0' }, question),
  );
  summaryContent.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 absolute right-0 fill-current rotate-0 transform transition-all ease-in-out plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>';
  summaryContent.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 absolute right-0 fill-current rotate-0 transform transition-all ease-in-out minus" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/></svg>';
  if (image && index === 0) {
    summaryContent.classList.add('show');
    summaryContent.setAttribute('aria-expanded', true);
  }

  const panel = div(
    { id: `${uuid}`, class: 'panel grid text-sm text-slate-600 overflow-hidden grid-rows-[0fr] opacity-0' },
    div({ class: 'accordion-answer text-base leading-7 text-gray-600 overflow-hidden' }),
  );

  // eslint-disable-next-line no-unsafe-optional-chaining
  if (image) panel.querySelector('.accordion-answer').innerHTML += divImageEl?.innerHTML;

  answer.forEach((element) => {
    panel.querySelector('.accordion-answer').innerHTML += element;
  });

  panel.querySelector('a')?.classList.remove(...'btn btn-outline-primary'.split(' '));
  panel.querySelector('a')?.classList.add(...'text-sm font-bold text-danaherpurple-500 !no-underline'.split(' '));

  summaryContent.addEventListener('click', () => toggleAccordion(customUUID, divEl));
  divEl.append(summaryContent, panel);
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

  const accordion = div(
    { class: 'divide-y divide-gray-900/10', id: `accordion-${customUUID}` },
    ...accordionItems,
  );

  const images = div(
    { class: 'accordion-images hidden lg:block' },
    ...accordionImages,
  );

  const title = [...block.children][0].querySelector(':scope > div > h2');
  block.innerHTML = '';
  if (title && title.textContent) { title?.classList.add('pb-8'); accordion.prepend(title); }
  if (block.classList.contains('image')) {
    block.classList.add(...'grid max-w-7xl w-full mx-auto grid-cols-1 lg:grid-cols-2 gap-16 py-8'.split(' '));
    block.append(images);
  }
  decorateIcons(accordion);
  block.append(accordion);
}

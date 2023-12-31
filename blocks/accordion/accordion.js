import {
  dl, dt, dd, div, h3, button, span,
} from '../../scripts/dom-builder.js';
import { generateUUID } from '../../scripts/scripts.js';

function toggleAccordion(activeButton) {
  const isOpen = activeButton.classList.contains('show');
  activeButton.setAttribute('aria-expanded', !isOpen);
  activeButton.classList.toggle('show', !isOpen);
  activeButton.querySelector('span svg').classList.toggle('rotate-180', !isOpen);
}

function createAccordionBlock(question, answer) {
  const uuid = generateUUID();
  const divEl = dl();
  const btn = dt(
    { class: 'button peer py-4', 'aria-expanded': false, 'aria-controls': `${uuid}` },
    button(
      { type: 'button', class: 'flex w-full items-start justify-between text-left text-gray-900' },
      h3({ class: 'text-base font-semibold leading-7 my-0' }, question),
      span({ class: 'ml-6 flex items-center pr-2 my-auto' }),
    ),
  );
  btn.querySelector('span').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ml-2 h-5 w-5 transition"><path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"></path></svg>';

  const panel = dd(
    { id: `${uuid}`, class: 'panel pr-12 pb-4 peer-[.show]:block hidden' },
    div({ class: 'accordion-answer text-base leading-7 text-gray-600 href-text' }),
  );

  answer.forEach((element) => {
    panel.querySelector('.accordion-answer').innerHTML += element;
  });

  btn.addEventListener('click', () => toggleAccordion(btn));
  divEl.append(btn, panel);
  return divEl;
}

export default function decorate(block) {
  const questions = [...block.children].map((element) => {
    const questionElement = element.querySelector(':scope > div > h3');
    const answerElements = Array.from(element.querySelector(':scope > div').children).slice(1);
    return {
      question: questionElement?.textContent,
      answer: answerElements.map((elem) => elem.outerHTML),
    };
  });

  const filteredQuestions = questions.filter((item) => item.question !== undefined);
  const accordionItems = filteredQuestions
    .map((question, index) => createAccordionBlock(question.question, question.answer, index));
  const accordion = div(
    { class: 'divide-y divide-gray-900/10' },
    ...accordionItems,
  );

  const title = [...block.children][0].querySelector(':scope > div > h2');
  block.innerHTML = '';
  if (title && title.textContent) block.append(title, document.createElement('hr'));
  block.append(accordion);
}

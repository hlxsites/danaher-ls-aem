import {
  dl, dt, dd, div, h3, button, span, p,
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
  const divEl = div();
  const btn = dt(
    { class: 'button peer', 'aria-expanded': false, 'aria-controls': `${uuid}` },
    button(
      { type: 'button', class: 'flex w-full items-start justify-between text-left text-gray-900' },
      h3({ class: 'text-base font-semibold leading-7' }, question),
      span({ class: 'ml-6 flex h-14 items-center pr-2' }),
    ),
  );
  btn.querySelector('span').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ml-2 h-5 w-5 transition"><path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"></path></svg>';

  const panel = dd(
    { id: `${uuid}`, class: 'panal mt-2 pr-12 pb-4 peer-[.show]:block hidden' },
    p({ class: 'text-base leading-7 text-gray-600 href-text' }),
    p(answer),
  );

  btn.addEventListener('click', () => toggleAccordion(btn));
  divEl.append(document.createElement('hr'), btn, panel);
  return divEl;
}

export default function decorate(block) {
  const questions = [...block.children].map((element) => ({
    question: element.querySelector('strong').textContent,
    answer: element.querySelectorAll('p')[1].textContent,
  }));

  const accordionItems = questions
    .map((question, index) => createAccordionBlock(question.question, question.answer, index));
  const accordion = dl(
    { class: 'mt-10 space-y-4 divide-y divide-gray-900/10' },
    div({ class: 'pt-6' }),
  );
  accordionItems.map((items) => accordion.querySelector('div.pt-6').append(items));

  block.innerHTML = '';
  block.className = 'divide-y divide-gray-900/10';
  block.append(accordion);
}

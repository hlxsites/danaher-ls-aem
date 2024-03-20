import {
  dl, dt, dd, div, h3, button, span,
} from '../../scripts/dom-builder.js';
import { generateUUID } from '../../scripts/scripts.js';

function toggleAccordion(activeButton) {
  const selectedItem = activeButton.getAttribute('aria-controls');
  const allImages = document.querySelectorAll('div.accordion-image');
  allImages.forEach((image) => {
    image?.classList.add('hidden');
  });
  const selectedImage = document.querySelector(`div[data-id="${selectedItem}"]`);
  selectedImage?.classList.toggle('hidden');

  const allContents = document.querySelectorAll('dt');
  allContents.forEach((content) => {
    content?.classList.remove('show');
    content?.setAttribute('aria-expanded', false);
    content?.querySelector('span svg').classList.toggle('rotate-180', false);
  });

  const isOpen = activeButton.classList.contains('show');
  activeButton.setAttribute('aria-expanded', !isOpen);
  activeButton.classList.toggle('show', !isOpen);
  activeButton.querySelector('span svg').classList.toggle('rotate-180', !isOpen);
}

function createAccordionBlock(question, answer, image, uuid, index) {
  const divImageEl = div({ class: 'block lg:hidden pb-4' }, image);
  const divEl = dl();
  const btn = dt(
    { class: 'button peer py-4', 'aria-expanded': false, 'aria-controls': `${uuid}` },
    button(
      { type: 'button', class: 'flex w-full items-start justify-between text-left text-gray-900' },
      h3({ class: 'text-base font-semibold leading-7 my-0' }, question),
      span({ class: 'ml-6 flex items-center pr-2 my-auto' }),
    ),
  );
  if (image && index === 0) {
    btn.classList.add('show');
    btn.setAttribute('aria-expanded', true);
  }
  btn.querySelector('span').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ml-2 h-5 w-5 transition"><path fill-rule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"></path></svg>';

  const panel = dd(
    { id: `${uuid}`, class: 'panel pr-12 pb-4 peer-[.show]:block hidden' },
    div({ class: 'accordion-answer text-base leading-7 text-gray-600 href-text' }),
  );

  // eslint-disable-next-line no-unsafe-optional-chaining
  panel.querySelector('.accordion-answer').innerHTML += divImageEl?.outerHTML;

  answer.forEach((element) => {
    console.log(element);
    panel.querySelector('.accordion-answer').innerHTML += element;
  });
  
  panel.querySelector('a')?.classList.remove(...'btn btn-outline-primary'.split(' '));
  panel.querySelector('a')?.classList.add(...'text-sm font-bold text-danaherpurple-500 !no-underline'.split(' '));

  btn.addEventListener('click', () => toggleAccordion(btn));
  divEl.append(btn, panel);
  return divEl;
}

export default function decorate(block) {
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
    ));

  const accordionImages = filteredQuestions.map((question, index) => {
    if (index === 0) question.image?.classList.add(...'accordion-image h-full block'.split(' '));
    else question.image?.classList.add(...'accordion-image h-full hidden'.split(' '));
    question.image?.setAttribute('data-id', question.uuid);
    return question.image;
  });

  const accordion = div(
    { class: 'divide-y divide-gray-900/10' },
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
    block.classList.add(...'grid max-w-7xl w-full mx-auto grid-cols-1 lg:grid-cols-2 gap-20 py-8'.split(' '));
    block.append(images);
  }
  block.append(accordion);
}

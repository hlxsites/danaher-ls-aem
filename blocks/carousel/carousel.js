import { button, div, span } from '../../scripts/dom-builder.js';
import Carousel from '../../scripts/Carousel.js';

const SLIDE_DELAY = 5000;
const SLIDE_TRANSITION = 500;

function configureNavigation(elementControls) {
  const previousBtn = button({ type: 'button', class: 'flex items-center justify-center h-full cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  previousBtn.innerHTML = `
    <span
      class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25"
    >
      <svg class="w-3 h-3 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 1 1 5l4 4" />
      </svg>
      <span class="sr-only">Previous</span>
    </span>
  `;
  const nextBtn = button({ type: 'button', class: 'flex items-center justify-center h-full cursor-pointer group focus:outline-none', 'data-carousel-next': '' });
  nextBtn.innerHTML = `
    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25">
      <svg class="w-3 h-3 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m1 9 4-4-4-4" />
      </svg>
      <span class="sr-only">Next</span>
    </span>
  `;
  elementControls.prepend(previousBtn);
  elementControls.append(nextBtn);
  return elementControls;
}

function configurePagination(carouselControls, totalSlides) {
  carouselControls.append(span({ class: 'carousel-paginate text-base font-bold' }, `1/${totalSlides}`));
  return carouselControls;
}

export default function decorate(block) {
  const uuid = crypto.randomUUID(4).substring(0, 6);
  block.classList.add(...'relative min-h-[30rem] md:min-h-[37rem] overflow-hidden'.split(' '));
  const clonedBlock = [...block.children];
  block.innerHTML = '';
  const slides = clonedBlock.map((ele, eleIndex) => {
    const carouselSlider = div({ class: `carousel-slider duration-${SLIDE_TRANSITION} ease-in-out absolute inset-0 transition-transform transform`, 'data-carousel-item': '' });
    const content = ele.querySelector('div:has(h2), div:has(p)');
    const picture = ele.querySelector('picture');
    let changedBtn = 0;
    if (content) {
      content.classList.add(...'lg:w-1/2 px-0 lg:px-8 xl:pr-10 space-y-6 pb-10 pt-6 md:pt-4 lg:py-20'.split(' '));
      const heading = content.querySelector('h2');
      const paragraphs = content.querySelectorAll('p:not(.button-container)');
      const allBtns = content.querySelectorAll('.button-container .btn');
      if (heading) heading.classList.add(...'text-2xl md:text-4xl tracking-wide md:tracking-tight font-medium md:font-normal leading-8 md:leading-[55px]'.split(' '));
      if (paragraphs.length > 0) {
        paragraphs.forEach((paragraph) => {
          if (['H1', 'H2', 'H3'].includes(paragraph.nextElementSibling.nodeName)) paragraph.classList.add(...'text-danaherpurple-500'.split(' '));
          else paragraph.classList.add(...'text-xl font-extralight tracking-tight leading-7'.split(' '));
        });
      }
      if (allBtns.length > 0) {
        const actions = div({ class: 'flex flex-col md:flex-row gap-5' });
        allBtns.forEach((elBtn) => {
          elBtn.className = `btn btn-lg ${(changedBtn === 0) ? 'btn-primary-purple' : 'btn-outline-trending-brand'} rounded-full px-6`;
          actions.append(elBtn);
          elBtn.parentElement.remove();
          changedBtn = 1;
        });
        content.append(actions);
      }
      carouselSlider.append(div({ class: 'max-w-7xl mx-auto w-full md:h-auto overflow-hidden lg:text-left' }, content));
    }
    if (picture) {
      picture.querySelector('img').classList.add(...'relative lg:absolute block w-full lg:w-1/2 lg:h-full lg:-translate-y-1/2 lg:top-1/2 lg:left-1/2 object-contain lg:object-cover'.split(' '));
      carouselSlider.append(picture);
    }
    changedBtn = 0;
    block.append(carouselSlider);
    return { position: parseInt(eleIndex, 10), el: carouselSlider };
  }).filter((item) => item);
  if (block.parentElement.className.includes('carousel-wrapper')) {
    let carouselControls;
    block.parentElement.classList.add(...'relative w-full'.split(' '));
    block.parentElement.setAttribute('data-carousel', 'slide');
    block.parentElement.setAttribute('id', uuid);
    if (block.children.length > 1) {
      carouselControls = div({ class: 'carousel-controls absolute z-10 flex items-center gap-x-4 -translate-x-1/2 bottom-5 left-24 lg:left-28 space-x-3' });
      block.parentElement.append(div({ class: 'relative lg:max-w-7xl mx-auto' }, configurePagination(carouselControls, slides.length), configureNavigation(carouselControls)));
    }
    const options = {
      defaultPosition: 0,
      interval: SLIDE_DELAY,
      onChange: (elIndex) => {
        if (block.children.length > 1) block.parentElement.querySelector('.carousel-paginate').innerHTML = `${elIndex + 1}/${slides.length}`;
      },
    };
    const carousel = new Carousel(block, slides, options);
    if (block.children.length > 1) {
      carouselControls.querySelector('button[data-carousel-prev]').addEventListener('click', carousel.prev);
      carouselControls.querySelector('button[data-carousel-next]').addEventListener('click', carousel.next);
      carousel.loop();
    } else if (block.children.length === 1) {
      block.children[0].classList.remove(...'translate-x-full z-[1]'.split(' '));
      block.children[0].classList.add(...'translate-x-0 z-[2]'.split(' '));
    }
  }
}

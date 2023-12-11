import { button, div, span } from '../../scripts/dom-builder.js';
import Carousel from '../../scripts/Carousel.js';

const SLIDE_DELAY = 5000;
const SLIDE_TRANSITION = 500;

function configureNavigation(element) {
  const elementControls = element.querySelector('.carousel-controls');
  const previousBtn = button({ type: 'button', class: 'flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  previousBtn.element = element;
  previousBtn.innerHTML = `
    <span
      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25"
    >
      <svg class="w-4 h-4 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 1 1 5l4 4" />
      </svg>
      <span class="sr-only">Previous</span>
    </span>
  `;
  const nextBtn = button({ type: 'button', class: 'flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none', 'data-carousel-next': '' });
  nextBtn.element = element;
  nextBtn.innerHTML = `
    <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25">
      <svg class="w-4 h-4 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m1 9 4-4-4-4" />
      </svg>
      <span class="sr-only">Next</span>
    </span>
  `;
  elementControls.prepend(previousBtn);
  elementControls.append(nextBtn);
  return elementControls;
}

function configurePagination(element) {
  const paginateWrapper = div({ class: 'carousel-controls absolute z-10 flex items-center -translate-x-1/2 bottom-5 left-32 space-x-3' });
  paginateWrapper.append(span({ class: 'carousel-paginate text-base font-bold' }, `1/${element.querySelectorAll('.carousel-slider').length}`));
  element.append(paginateWrapper);
}

export default function decorate(block) {
  const uuid = crypto.randomUUID(4).substring(0, 6);
  block.classList.add(...'relative min-h-[35rem] md:h-[44rem] overflow-hidden'.split(' '));
  const groupElements = [...block.children].reduce((prev, curr) => {
    prev.push([...curr.children]);
    return prev;
  }, []);
  block.innerHTML = '';
  const slides = groupElements.map((ele, eleIndex) => {
    if (ele.length > 1) {
      const carouselSlider = div({ class: `carousel-slider duration-${SLIDE_TRANSITION} ease-in-out absolute inset-0 transition-transform transform z-10`, 'data-carousel-item': '' });
      ele.map((el, index) => {
        if (index === 0) {
          el.classList.add(...'lg:w-1/2 px-0 lg:px-8 xl:pr-10 space-y-6 pb-16 pt-8 md:pt-10 lg:py-20'.split(' '));
          if (el.querySelector('h2')) el.querySelector('h2').classList.add(...'text-2xl md:text-4xl tracking-wide md:tracking-tight font-medium md:font-normal leading-8 md:leading-[55px]'.split(' '));
          if (el.querySelector('p')) el.querySelector('p').classList.add(...'text-xl font-extralight tracking-tight leading-7'.split(' '));
          if (el.querySelector('.button-container')) {
            el.querySelector('.button-container').querySelectorAll('.btn').forEach((elBtn, elBtnIndex) => {
              if (index === 0) elBtn.className = `btn btn-lg ${elBtnIndex === 0 ? 'btn-primary-purple' : 'btn-outline-trending-brand'} rounded-full px-6`;
            });
          }
          carouselSlider.append(div({ class: 'max-w-7xl mx-auto w-full md:h-auto overflow-hidden lg:text-left' }, el));
        } else {
          el.classList.add(...'relative h-full w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2'.split(' '));
          el.querySelector('img').classList.add(...'md:absolute block w-full h-full md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:left-1/2'.split(' '));
          carouselSlider.append(el);
        }
        return index;
      });
      block.append(carouselSlider);
      return { position: parseInt(eleIndex, 10), el: carouselSlider };
    }
    return null;
  }).filter((item) => item);
  if (block.parentElement.className.includes('carousel-wrapper')) {
    let controls;
    block.parentElement.classList.add(...'relative w-full'.split(' '));
    block.parentElement.setAttribute('data-carousel', 'slide');
    block.parentElement.setAttribute('id', uuid);
    if (block.children.length > 1) {
      configurePagination(block.parentElement);
      controls = configureNavigation(block.parentElement);
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
      controls.querySelector('button[data-carousel-prev]').addEventListener('click', carousel.prev);
      controls.querySelector('button[data-carousel-next]').addEventListener('click', carousel.next);
      carousel.loop();
    } else if (block.children.length === 1) {
      block.children[0].classList.remove(...'translate-x-full z-[1]'.split(' '));
      block.children[0].classList.add(...'translate-x-0 z-[2]'.split(' '));
    }
  }
}

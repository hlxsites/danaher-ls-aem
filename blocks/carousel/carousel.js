import { button, div, span } from '../../scripts/dom-builder.js';
import Carousel from '../../scripts/Carousel.js';

const SLIDE_DELAY = 5000;
const SLIDE_TRANSITION = 500;

function configureNavigation(element) {
  const elementControls = element.querySelector('.carousel-controls');
  const previousBtn = button({ type: 'button', class: 'flex items-center justify-center h-full cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  previousBtn.element = element;
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
  nextBtn.element = element;
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

function configurePagination(element) {
  const paginateWrapper = div({ class: 'relative lg:max-w-7xl mx-auto' }, div({ class: 'carousel-controls absolute z-10 flex items-center gap-x-4 -translate-x-1/2 bottom-5 left-24 lg:left-28 space-x-3' }));
  paginateWrapper.querySelector('.carousel-controls').append(span({ class: 'carousel-paginate text-base font-bold' }, `1/${element.querySelectorAll('.carousel-slider').length}`));
  element.append(paginateWrapper);
}

export default function decorate(block) {
  const uuid = crypto.randomUUID(4).substring(0, 6);
  block.classList.add(...'relative min-h-[30rem] md:min-h-[37rem] overflow-hidden'.split(' '));
  const groupElements = [...block.children].reduce((prev, curr) => {
    prev.push([...curr.children]);
    return prev;
  }, []);
  block.innerHTML = '';
  const slides = groupElements.map((ele, eleIndex) => {
    if (ele.length > 1) {
      const carouselSlider = div({ class: `carousel-slider duration-${SLIDE_TRANSITION} ease-in-out absolute inset-0 transition-transform transform z-10`, 'data-carousel-item': '' });
      ele.map((el, index) => {
        let changedBtn = 0;
        if (index === 0) {
          el.classList.add(...'lg:w-1/2 px-0 lg:px-2 xl:pr-10 space-y-6 pb-10 pt-6 md:pt-4 lg:py-20'.split(' '));
          const heading = el.querySelector('h2');
          if (heading) {
            heading.classList.add(...'text-2xl md:text-4xl tracking-wide md:tracking-tight font-medium md:font-normal leading-8 md:leading-[55px]'.split(' '));
            if (heading.previousElementSibling) {
              heading.previousElementSibling.classList.add(...'text-danaherpurple-500'.split(' '));
            }
            if (heading.nextElementSibling) {
              heading.nextElementSibling.classList.add(...'text-xl font-extralight tracking-tight leading-7'.split(' '));
            }
          }
          if (el.querySelector('.button-container')) {
            const actions = div({ class: 'flex flex-col md:flex-row gap-5' });
            el.querySelectorAll('.button-container').forEach((btnContainer) => {
              btnContainer.querySelectorAll('.btn').forEach((elBtn) => {
                elBtn.className = `btn btn-lg ${(changedBtn === 0) ? 'btn-primary-purple' : 'btn-outline-trending-brand'} rounded-full px-6`;
                actions.append(elBtn);
                changedBtn = 1;
              });
            });
            el.append(actions);
          }
          carouselSlider.append(div({ class: 'max-w-7xl mx-auto w-full md:h-auto overflow-hidden lg:text-left' }, el));
        } else {
          el.classList.add(...'relative h-full w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2'.split(' '));
          el.querySelector('img').classList.add(...'relative lg:absolute block w-full lg:w-1/2 lg:h-full lg:-translate-y-1/2 lg:top-1/2 lg:left-1/2 object-contain lg:object-cover'.split(' '));
          carouselSlider.append(el.querySelector('img').parentElement);
        }
        changedBtn = 0;
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

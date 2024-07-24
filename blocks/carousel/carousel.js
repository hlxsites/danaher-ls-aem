import Carousel from '../../scripts/carousel.js';
import { button, div, span } from '../../scripts/dom-builder.js';
import { decorateModals } from '../../scripts/scripts.js';

const SLIDE_DELAY = 3000;
const SLIDE_TRANSITION = 1000;

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
  block.parentElement.parentElement.querySelector('h1')?.classList.add('hidden');
  const uuid = crypto.randomUUID(4).substring(0, 6);
  if (block.querySelector('a[title="link"]')) block.parentElement.parentElement.classList.add(...'!px-6 !py-16 !sm:py-16'.split(' '));
  block.classList.add(...'relative min-h-[30rem] md:min-h-[37rem]'.split(' '));
  block.style = 'grid-auto-columns: 100%';
  block.classList.remove('block');
  block.classList.add(...'grid grid-flow-col overflow-x-auto space-x-2 snap-x snap-mandatory gap-6 rounded-md scroll-smooth'.split(' '));
  const slides = [...block.children].map((ele, eleIndex) => {
    ele.classList.add(...`card carousel-slider flex snap-start list-none bg-white flex-col rounded-md duration-${SLIDE_TRANSITION} ease-in-out inset-0 transition-transform transform`.split(' '));
    ele.setAttribute('data-carousel-item', (eleIndex + 1));
    const contentEl = ele.querySelector('h2, p');
    const picture = ele.querySelector('picture');
    let changedBtn = 0;
    if (contentEl) {
      const content = contentEl.closest('div');
      content.classList.add(...'lg:w-1/2 px-4 lg:px-8 xl:pr-10'.split(' '));
      const heading = content.querySelector('h2');
      const paragraphs = content.querySelectorAll('p:not(.button-container)');
      const allBtns = content.querySelectorAll('p.button-container');
      if (heading) heading.classList.add(...'lg:text-[40px] text-2xl md:text-4xl tracking-wide md:tracking-tight m-0 font-medium leading-6 md:leading-[44px]'.split(' '));
      paragraphs.forEach((paragraph) => {
        if (!paragraph.querySelector('a[title="link"]')) {
          if (paragraph.nextElementSibling && ['H1', 'H2', 'H3'].includes(paragraph.nextElementSibling.nodeName)) paragraph.classList.add(...'eyebrow'.split(' '));
          else paragraph.classList.add(...'text-xl font-extralight tracking-tight leading-7 mt-6'.split(' '));
        } else {
          const linkBtn = paragraph.querySelector('a[title="link"]');
          if (linkBtn.title === 'link') paragraph.classList.add(...'btn btn-lg font-medium btn-primary-purple rounded-full px-6 mt-10'.split(' '));
        }
      });
      if (allBtns.length > 0) {
        const actions = div({ class: 'flex flex-col md:flex-row gap-5 mt-10' });
        allBtns.forEach((elBtn) => {
          if (elBtn.title === 'link') {
            elBtn.className = 'flex items-center gap-x-2 text-danaherpurple-500 font-bold group';
            elBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 transition group-hover:translate-x-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
            </svg>`;
          } else {
            elBtn.querySelector('a')?.classList.remove(...'btn btn-outline-primary'.split(' '));
            elBtn.className = `btn btn-lg font-medium ${(changedBtn === 0) ? 'btn-primary-purple' : 'btn-outline-trending-brand'} rounded-full px-6`;
            if (elBtn.querySelector('a[href="#request-quote"]')) {
              const anc = elBtn.querySelector('a[href="#request-quote"]');
              anc.parentElement.classList.add('show-modal-btn');
            }
          }
          actions.append(elBtn);
          elBtn.parentElement.remove();
          changedBtn = 1;
        });
        content.append(actions);
      }
      ele.append(div({ class: 'lg:m-auto w-full h-auto max-w-7xl py-8 lg:py-0 overflow-hidden' }, content));
    }
    if (picture) {
      picture.querySelector('img').classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
      ele.append(div({ class: 'relative h-48 w-full md:h-[35rem] block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2' }, picture));
    }
    changedBtn = 0;
    decorateModals(ele);
    return { position: parseInt(eleIndex, 10), el: ele };
  }).filter((item) => item);
  if (block.children.length > 2 && block.parentElement.className.includes('carousel-wrapper')) {
    block.parentElement.classList.add(...'relative w-full'.split(' '));
    block.parentElement.setAttribute('data-carousel', 'slide');
    block.parentElement.setAttribute('id', uuid);
    const carouselControls = div({ class: 'relative md:absolute md:bottom-16 flex gap-x-4 items-center space-x-3 z-10 px-4 lg:px-8 xl:pr-10' });
    configurePagination(carouselControls, slides.length);
    configureNavigation(carouselControls);
    block.parentElement.append(div({ class: 'carousel-controls relative max-w-7xl mx-auto' }, carouselControls));
    if (block.classList.contains('add-border')) block.classList.add(...'border-t border-b border-solid border-black'.split(' '));
    setTimeout(() => {
      /* eslint-disable no-new */
      new Carousel({
        wrapperEl: uuid,
        mainEl: '.carousel',
        delay: SLIDE_DELAY,
        previousElAction: 'button[data-carousel-prev]',
        nextElAction: 'button[data-carousel-next]',
        isAutoPlay: true,
        copyChild: 1,
        onChange: (elPosition) => {
          const currentSlide = elPosition.target.getAttribute('data-carousel-item');
          const carouselPaginate = block?.parentElement?.querySelector('.carousel-paginate');
          if (block.children.length > 1 && elPosition && elPosition.target) {
            if (carouselPaginate) carouselPaginate.innerHTML = `${parseInt(currentSlide, 10)}/${slides.length}`;
          }
        },
      });
    }, 5000);
  }
}

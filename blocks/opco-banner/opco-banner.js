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
  console.log(block);
  [...block.children].forEach((row) => {
    
 
  const left = div({ class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' },
    img({
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/SCIEX_logo.svg/2560px-SCIEX_logo.svg.png',
      alt: 'SCIEX Logo',
      class: 'h-8 w-auto',
    }),
    h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, 'The power of precision'),
    p({ class: 'text-gray-600' },
      'There, where it counts. Time and time again. Providing the precision detection and quantitation of molecules needed for scientists to make discoveries that change the world.'),
    button({
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
    }, 'Browse Categories'),
  );
block.append(left);
    [...row.children].forEach((elem) => {
    })
  })

}
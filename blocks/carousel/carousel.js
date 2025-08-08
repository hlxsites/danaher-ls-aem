import Carousel from '../../scripts/carousel.js';
import { div, h2, p, a, picture, img } from '../../scripts/dom-builder.js';
import { decorateModals } from '../../scripts/scripts.js';

export default function decorateSlidesFromData(block, slidesData) {
  block.innerHTML = '';

  const SLIDE_DEFAULT_DELAY = 3000;
  const SLIDE_DEFAULT_TRANSITION = 1000;

  // Extract global settings from first slide or defaults
  const autoPlay = slidesData[0]?.auto_play ?? true;
  const slideDelay = slidesData[0]?.slide_delay || SLIDE_DEFAULT_DELAY;
  const slideTransition = slidesData[0]?.slide_transition || SLIDE_DEFAULT_TRANSITION;
  const showPagination = slidesData[0]?.show_pagination ?? true;
  const showNavigation = slidesData[0]?.show_navigation ?? true;

  slidesData.forEach((slide, idx) => {
    const slideEl = div({
      class: `card carousel-slider flex snap-start list-none bg-white flex-col`,
      'data-carousel-item': idx + 1,
      style: `transition-duration: ${slideTransition}ms;`
    });

    // Left Column
    const leftCol = div({ class: 'lg:w-1/2 px-4 lg:px-8 xl:pr-10 flex flex-col justify-center' });

    if (slide.left_subheading) leftCol.append(p({ class: 'eyebrow' }, slide.left_subheading));
    if (slide.left_main_heading) leftCol.append(h2({ class: 'lg:text-[40px] text-2xl md:text-4xl font-medium leading-tight mt-2' }, slide.left_main_heading));
    if (slide.left_product_info) leftCol.append(p({ class: 'text-xl font-extralight mt-6 leading-7' }, slide.left_product_info));

    // CTA buttons container
    const ctas = div({ class: 'flex flex-col md:flex-row gap-5 mt-10' });

    if (slide.left_cta_1_text && slide.left_cta_1_link?.url) {
      const btn1 = a({
        href: slide.left_cta_1_link.url,
        title: 'link',
        class: 'btn btn-lg font-medium btn-primary-purple rounded-full px-6',
        target: slide.left_cta_1_link.target || '_self',
        rel: 'noopener noreferrer',
      }, slide.left_cta_1_text);
      ctas.append(btn1);
    }

    if (slide.left_cta_2_text && slide.left_cta_2_link?.url) {
      const btn2 = a({
        href: slide.left_cta_2_link.url,
        title: 'link',
        class: 'btn btn-lg font-medium btn-outline-trending-brand rounded-full px-6',
        target: slide.left_cta_2_link.target || '_self',
        rel: 'noopener noreferrer',
      }, slide.left_cta_2_text);
      ctas.append(btn2);
    }

    if (ctas.children.length > 0) leftCol.append(ctas);

    // Right Column (image or rich text/table)
    let rightCol = div({ class: 'relative h-48 w-full md:h-[35rem] block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-hidden' });

    if (slide.right_image?.src) {
      const pic = picture();
      const imgEl = img({ src: slide.right_image.src, alt: slide.right_image.alt || '', class: 'absolute bottom-0 h-full w-full object-cover' });
      pic.append(imgEl);
      rightCol.append(pic);
    } else if (slide.right_text_table) {
      // sanitize or trust this content
      rightCol.innerHTML = slide.right_text_table;
    }

    // Slide main container
    const mainContainer = div({
      class: 'lg:m-auto w-full h-auto max-w-7xl py-8 lg:py-0 overflow-hidden relative flex flex-col lg:flex-row',
    });
    mainContainer.append(leftCol, rightCol);
    slideEl.append(mainContainer);

    // Modal decoration if any
    decorateModals(slideEl);

    block.append(slideEl);
  });

  // Setup carousel controls container
  const uuid = crypto.randomUUID().substring(0, 6);
  const parentWrapper = block.parentElement;
  parentWrapper.setAttribute('id', uuid);
  parentWrapper.setAttribute('data-carousel', 'slide');
  parentWrapper.classList.add('relative', 'w-full');

  const controls = div({ class: 'carousel-controls relative max-w-7xl mx-auto' });
  const controlsInner = div({ class: 'relative md:absolute md:bottom-16 flex gap-x-4 items-center space-x-3 z-10 px-4 lg:px-8 xl:pr-10' });

  if (showPagination) {
    const paginate = div({ class: 'carousel-paginate text-base font-bold' }, `1/${slidesData.length}`);
    controlsInner.append(paginate);
  }

  if (showNavigation) {
    const prevBtn = div({ class: 'carousel-prev cursor-pointer' });
    prevBtn.innerHTML = `
      <button type="button" class="flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-prev>
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25">
          <svg class="w-3 h-3 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 1 1 5l4 4" />
          </svg>
          <span class="sr-only">Previous</span>
        </span>
      </button>
    `;
    const nextBtn = div({ class: 'carousel-next cursor-pointer' });
    nextBtn.innerHTML = `
      <button type="button" class="flex items-center justify-center h-full cursor-pointer group focus:outline-none" data-carousel-next>
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25">
          <svg class="w-3 h-3 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m1 9 4-4-4-4" />
          </svg>
          <span class="sr-only">Next</span>
        </span>
      </button>
    `;
    controlsInner.prepend(prevBtn);
    controlsInner.append(nextBtn);
  }

  controls.append(controlsInner);
  parentWrapper.append(controls);

  // Initialize Carousel instance
  setTimeout(() => {
    new Carousel({
      wrapperEl: uuid,
      mainEl: 'div.carousel-slider',
      delay: slideDelay,
      previousElAction: 'button[data-carousel-prev]',
      nextElAction: 'button[data-carousel-next]',
      isAutoPlay: autoPlay,
      copyChild: 1,
      onChange: (event) => {
        if (showPagination) {
          const currentSlide = event.target.getAttribute('data-carousel-item');
          const paginateEl = parentWrapper.querySelector('.carousel-paginate');
          if (paginateEl) paginateEl.textContent = `${parseInt(currentSlide, 10)}/${slidesData.length}`;
        }
      }
    });
  }, 100);

}

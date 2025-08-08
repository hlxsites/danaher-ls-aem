import Carousel from '../../scripts/carousel.js';
import { button, div, span } from '../../scripts/dom-builder.js';
import { decorateModals } from '../../scripts/scripts.js';

// Default slide settings (you can customize these)
const SLIDE_DELAY = 3000;
const SLIDE_TRANSITION = 1000;

function configureNavigation(elementControls) {
  const previousBtn = button({ type: 'button', class: 'flex items-center justify-center h-full cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  previousBtn.innerHTML = `
    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:danaherpurple-25">
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
  // Hide h1 in the grandparent if exists
  block.parentElement?.parentElement?.querySelector('h1')?.classList.add('hidden');

  // Add classes to block for styling
  block.classList.add(...'relative min-h-[30rem] md:min-h-[37rem] grid grid-flow-col overflow-x-auto space-x-2 snap-x snap-mandatory gap-6 scroll-smooth'.split(' '));
  block.style.gridAutoColumns = '100%';
  block.classList.remove('block');

  // Add padding classes to grandparent if link with title 'link' exists
  if (block.querySelector('a[title="link"]')) {
    block.parentElement?.parentElement?.classList.add(...'!px-6 !py-16 !sm:py-16'.split(' '));
  }

  // Prepare slides: add classes and restructure content
  const slides = [...block.children].map((ele, eleIndex) => {
    ele.classList.add(...`card carousel-slider flex snap-start list-none bg-white flex-col duration-${SLIDE_TRANSITION} ease-in-out inset-0 transition-transform transform`.split(' '));
    ele.setAttribute('data-carousel-item', (eleIndex + 1));

    // Find the main container holding content - adjust selector if needed
    const content = ele.querySelector('div') || ele;

    // Extract main heading text and heading tag type from data attributes or CMS data attributes
    // You may need to adjust this part depending on how the data is attached in your actual HTML.
    // For example, if the block or slide elements have dataset attributes:
    const mainHeadingText = ele.dataset.leftMainHeadingText || content.querySelector('[data-name="left_main_heading_text"]')?.textContent?.trim() || '';
    const mainHeadingTag = ele.dataset.leftMainHeadingType || content.querySelector('[data-name="left_main_heading_type"]')?.textContent?.trim() || 'h2';

    // Remove any existing heading tags to avoid duplicates
    const existingHeading = content.querySelector('h1, h2, h3, h4, h5, h6');
    if (existingHeading) existingHeading.remove();

    // Create the heading element dynamically using the tag type
    let headingEl;
    try {
      headingEl = document.createElement(mainHeadingTag);
    } catch {
      headingEl = document.createElement('h2'); // fallback
    }
    headingEl.textContent = mainHeadingText;

    // Add your heading classes here
    headingEl.classList.add('lg:text-[40px]', 'text-2xl', 'md:text-4xl', 'tracking-wide', 'md:tracking-tight', 'm-0', 'font-medium', 'leading-6', 'md:leading-[44px]');

    // Insert heading at the top of content container
    content.prepend(headingEl);

    // Handle eyebrow subheading (if you have one)
    const eyebrow = content.querySelector('p.eyebrow') || content.querySelector('[data-name="left_subheading"]');
    if (eyebrow) {
      eyebrow.classList.add('eyebrow');
      content.prepend(eyebrow);
    }

    // Handle paragraphs that are product info or others
    const paragraphs = content.querySelectorAll('p:not(.button-container):not(.eyebrow)');
    paragraphs.forEach(paragraph => {
      paragraph.classList.add(...'text-xl font-extralight tracking-tight leading-7 mt-6'.split(' '));
    });

    // Handle buttons and links
    const allBtns = content.querySelectorAll('p.button-container');
    if (allBtns.length > 0) {
      const actions = div({ class: 'flex flex-col md:flex-row gap-5 mt-10' });
      let changedBtn = 0;
      allBtns.forEach(elBtn => {
        if (elBtn.title === 'link') {
          elBtn.className = 'flex items-center gap-x-2 text-danaherpurple-500 font-bold group';
          elBtn.innerHTML += `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5 transition group-hover:translate-x-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
            </svg>
          `;
        } else {
          elBtn.querySelector('a')?.classList.remove('btn', 'btn-outline-primary');
          elBtn.className = `btn btn-lg font-medium ${(changedBtn === 0) ? 'btn-primary-purple' : 'btn-outline-trending-brand'} rounded-full px-6`;
          if (elBtn.querySelector('a[href="#request-quote"]')) {
            const anc = elBtn.querySelector('a[href="#request-quote"]');
            anc.parentElement.classList.add('show-modal-btn');
          }
        }
        actions.append(elBtn);
        elBtn.parentElement.remove();
        changedBtn++;
      });
      content.append(actions);
    }

    // Handle right side picture image
    const picture = ele.querySelector('picture');
    if (picture) {
      picture.querySelector('img').classList.add(...'absolute bottom-0 h-full w-full object-cover'.split(' '));
      ele.append(div({ class: 'relative h-48 w-full md:h-[35rem] block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2' }, picture));
    }

    decorateModals(ele);

    return { position: eleIndex, el: ele };
  });

  // Make sure we have at least 2 slides and the parent has carousel-wrapper class
  if (block.children.length >= 2 && block.parentElement.classList.contains('carousel-wrapper')) {
    block.parentElement.classList.add('relative', 'w-full');

    // Generate a fixed, easy to debug ID for the wrapper
    const uuid = 'carousel-wrapper';
    block.parentElement.setAttribute('data-carousel', 'slide');
    block.parentElement.setAttribute('id', uuid);

    // Create carousel controls container
    const carouselControls = div({ class: 'relative md:absolute md:bottom-16 flex gap-x-4 items-center space-x-3 z-10 px-4 lg:px-8 xl:pr-10' });

    configurePagination(carouselControls, slides.length);
    configureNavigation(carouselControls);

    block.parentElement.append(div({ class: 'carousel-controls relative max-w-7xl mx-auto' }, carouselControls));

    if (block.classList.contains('add-border')) {
      block.classList.add('border-t', 'border-b', 'border-solid', 'border-black');
    }

    setTimeout(() => {
      // Verify elements before initializing carousel
      const wrapperEl = document.getElementById(uuid);
      const mainEl = wrapperEl?.querySelector('.carousel');

      if (!wrapperEl || !mainEl) {
        console.error('Carousel initialization failed: wrapper or main element not found.');
        return;
      }

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
    }, 100); // Reduced timeout to 100ms, adjust as needed
  }
}

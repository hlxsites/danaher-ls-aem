import { button, div, span } from '../../scripts/dom-builder.js';

/* eslint no-underscore-dangle: 0 */
const DEFAULT = {
  defaultPosition: 0,
  indicators: {
    items: [],
    activeClasses: 'bg-white dark:bg-gray-800',
    inactiveClasses:
      'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
  },
  interval: 3000,
  onNext: () => {},
  onPrev: () => {},
  onChange: () => {},
};

function Carousel(carouselEl, items, options) {
  /**
   * Clears the cycling interval
   */
  const pause = () => clearInterval(this._intervalInstance);

  /**
   * Get the currently active item
  */
  const getActiveItem = () => this._activeItem;

  /**
   * Set the currently active item and data attribute
   * @param {*} position
  */
  const setActiveItem = (item) => {
    this._activeItem = item;
    const { position } = item;

    // update the indicators if available
    if (this._indicators.length) {
      this._indicators = this._indicators.map((indicator) => {
        indicator.el.setAttribute('aria-current', 'false');
        indicator.el.classList.remove(...this._options.indicators.activeClasses.split(' '));
        indicator.el.classList.add(...this._options.indicators.inactiveClasses.split(' '));
        return indicator;
      });
      this._indicators[position].el.classList.add(...this._options.indicators.activeClasses.split(' '));
      this._indicators[position].el.classList.remove(...this._options.indicators.inactiveClasses.split(' '));
      this._indicators[position].el.setAttribute('aria-current', 'true');
    }
  };

  /**
   * Set an interval to loop through the carousel items
  */
  this.loop = () => {
    if (typeof window !== 'undefined') {
      this._intervalInstance = window.setInterval(() => {
        this.next();
      }, this._intervalDuration);
    }
  };

  /**
   * This method applies the transform classes
   * based on the left, middle, and right rotation carousel items
   * @param {*} rotationItems
  */
  const rotate = (rotationItems) => {
    // reset
    this._slides = this._slides.map((item) => {
      item.el.classList.add('hidden');
      return item;
    });

    if (
      this._slides.length === 2
      && parseInt(rotationItems.left.position, 10) === parseInt(rotationItems.right.position, 10)
    ) {
      if (parseInt(rotationItems.middle.position, 10) === 0) {
        // left item (previously active)
        rotationItems.left.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[2]'.split(' '));
        rotationItems.left.el.classList.add(...'-translate-x-full z-[1]'.split(' '));
      } else if (parseInt(rotationItems.middle.position, 10) === 1) {
        // right item (upcoming active)
        rotationItems.right.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[2]'.split(' '));
        rotationItems.right.el.classList.add(...'translate-x-full z-[1]'.split(' '));
      }
      // currently active item
      rotationItems.middle.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[1]'.split(' '));
      rotationItems.middle.el.classList.add(...'translate-x-0 z-[2]'.split(' '));
    } else {
      // left item (previously active)
      rotationItems.left.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[2]'.split(' '));
      rotationItems.left.el.classList.add(...'-translate-x-full z-[1]'.split(' '));

      // currently active item
      rotationItems.middle.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[1]'.split(' '));
      rotationItems.middle.el.classList.add(...'translate-x-0 z-[2]'.split(' '));

      // right item (upcoming active)
      rotationItems.right.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[2]'.split(' '));
      rotationItems.right.el.classList.add(...'translate-x-full z-[1]'.split(' '));
    }
  };

  /**
   * Slide to the element based on id
   * @param {*} position
  */
  const slideTo = (position) => {
    const nextItem = this._slides[position];
    const rotationItems = {
      left:
        nextItem.position === 0
          ? this._slides[this._slides.length - 1]
          : this._slides[nextItem.position - 1],
      middle: nextItem,
      right:
        nextItem.position === this._slides.length - 1
          ? this._slides[0]
          : this._slides[nextItem.position + 1],
    };
    if (this._slides.length > 1) rotate(rotationItems);
    setActiveItem(nextItem);
    if (this._intervalInstance) {
      pause();
      this.loop();
    }

    this._options.onChange(position);
  };

  /**
   * Based on the currently active item it will go to the next position
  */
  this.next = () => {
    const activeItem = getActiveItem();
    const { position } = activeItem;
    let nextItem = null;

    // check if last item
    if (position === this._slides.length - 1) {
      // eslint-disable-next-line prefer-destructuring
      nextItem = this._slides[0];
    } else nextItem = this._slides[position + 1];

    slideTo(nextItem.position);

    // callback function
    this._options.onNext(nextItem.position);
  };

  /**
   * Based on the currently active item it will go to the previous position
  */
  this.prev = () => {
    const activeItem = getActiveItem();
    let prevItem = null;

    // check if first item
    if (activeItem.position === 0) {
      prevItem = this._slides[this._slides.length - 1];
    } else {
      prevItem = this._slides[activeItem.position - 1];
    }

    slideTo(prevItem.position);

    // callback function
    this._options.onPrev(prevItem.position);
  };

  const getItem = (position) => this._slides[position];

  const init = () => {
    if (this._slides.length && !this._initialized) {
      this._slides = this._slides.map((item) => {
        item.el.classList.add(...'absolute inset-0 transition-transform transform'.split(' '));
        return item;
      });

      // if no active item is set then first position is default
      if (getActiveItem()) slideTo(getActiveItem().position);
      else slideTo(0);

      this._indicators = this._indicators.map((indicator, position) => {
        indicator.el.addEventListener('click', () => {
          slideTo(position);
        });
        return indicator;
      });

      this._initialized = true;
    }
  };

  this._element = carouselEl;
  this._slides = items;
  this._options = {
    ...DEFAULT,
    ...options,
    indicators: { ...DEFAULT.indicators, ...options.indicators },
  };
  this._activeItem = getItem(this._options.defaultPosition);
  this._indicators = this._options.indicators.items;
  this._intervalDuration = this._options.interval;
  this._intervalInstance = null;
  this._initialized = false;
  init();
}

const SLIDE_DELAY = 7000;
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
  block.classList.add(...'relative min-h-[30rem] md:min-h-[37rem] overflow-hidden'.split(' '));
  const clonedBlock = [...block.children];
  block.innerHTML = '';
  const slides = clonedBlock.map((ele, eleIndex) => {
    const carouselSlider = div({ class: `carousel-slider duration-${SLIDE_TRANSITION} ease-in-out absolute inset-0 transition-transform transform`, 'data-carousel-item': '' });
    const contentEl = ele.querySelector('h2, p');
    const picture = ele.querySelector('picture');
    let changedBtn = 0;
    if (contentEl) {
      const content = contentEl.closest('div');
      content.classList.add(...'lg:w-1/2 px-4 lg:px-8 xl:pr-10 pb-10 pt-6 md:pt-4 lg:py-20'.split(' '));
      const heading = content.querySelector('h2');
      const paragraphs = content.querySelectorAll('p:not(.button-container):not(:has(a[title="link"]))');
      const allBtns = content.querySelectorAll('p.button-container .btn, a[title="link"]');
      if (heading) heading.classList.add(...'text-2xl md:text-4xl tracking-wide md:tracking-tight m-0 font-medium md:font-normal leading-8 md:leading-[55px]'.split(' '));
      if (paragraphs.length > 0) {
        paragraphs.forEach((paragraph) => {
          if (paragraph.nextElementSibling && ['H1', 'H2', 'H3'].includes(paragraph.nextElementSibling.nodeName)) paragraph.classList.add(...'text-danaherpurple-500'.split(' '));
          else paragraph.classList.add(...'text-xl font-extralight tracking-tight leading-7 mt-6'.split(' '));
        });
      }
      if (allBtns.length > 0) {
        const actions = div({ class: 'flex flex-col md:flex-row gap-5 mt-10' });
        allBtns.forEach((elBtn) => {
          if (elBtn.title === 'link') {
            elBtn.className = 'flex items-center gap-x-2 text-danaherpurple-500 font-bold group';
            elBtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-5 h-5 transition group-hover:translate-x-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
            </svg>`;
          } else elBtn.className = `btn btn-lg ${(changedBtn === 0) ? 'btn-primary-purple' : 'btn-outline-trending-brand'} rounded-full px-6`;
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

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

export default function Carousel(carouselEl, items, options) {
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

    // left item (previously active)
    rotationItems.left.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[2]'.split(' '));
    rotationItems.left.el.classList.add(...'-translate-x-full z-[1]'.split(' '));

    // currently active item
    rotationItems.middle.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[1]'.split(' '));
    rotationItems.middle.el.classList.add(...'translate-x-0 z-[2]'.split(' '));

    // right item (upcoming active)
    rotationItems.right.el.classList.remove(...'-translate-x-full translate-x-full translate-x-0 hidden z-[2]'.split(' '));
    rotationItems.right.el.classList.add(...'translate-x-full z-[1]'.split(' '));
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
    rotate(rotationItems);
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

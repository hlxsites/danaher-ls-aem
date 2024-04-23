function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export default function Carousel({
  wrapperEl,
  mainEl,
  previousElAction,
  nextElAction,
  onChange,
  delay = 5000,
  isAutoPlay = true,
}) {
  const wrapper = document.getElementById(wrapperEl);

  if (!wrapper) throw new Error('Carousel not initialised properly');
  else {
    const carousel = wrapper?.querySelector(mainEl);
    const carouselChildrens = [...carousel.children];
    if (carouselChildrens.length <= 1) {
      return;
    }
    let isDragging = false;
    let startX;
    let startScrollLeft;
    let timeoutId;

    const firstCardWidth = carousel.querySelector('.carousel-slider').offsetWidth;
    // Get the number of cards that can fit in the carousel at once
    const cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

    // Insert copies of the last few cards to beginning of carousel for infinite scrolling
    const copiesLastThree = carouselChildrens.slice(-cardPerView).reverse();
    copiesLastThree.map((card) => {
      const clonedCard = card.cloneNode(true);
      carousel.prepend(clonedCard);
      return null;
    });
    // Insert copies of the first few cards to end of carousel for infinite scrolling
    const copiesFirstThree = carouselChildrens.slice(0, cardPerView);
    copiesFirstThree.map((card) => {
      const clonedCard = card.cloneNode(true);
      carousel.append(clonedCard);
      return null;
    });
    // Add event listeners for the arrow buttons to scroll the carousel left and right
    wrapper.querySelector(previousElAction)?.addEventListener('click', () => {
      const value = firstCardWidth;
      carousel.scrollLeft += -value;
      if (onChange) {
        onChange({ target: carousel.children[Math.floor(carousel.scrollLeft / value) - 1] });
      }
    });
    wrapper.querySelector(nextElAction)?.addEventListener('click', () => {
      const value = firstCardWidth;
      carousel.scrollLeft += value;
      if (onChange) {
        onChange({ target: carousel.children[Math.floor(carousel.scrollLeft / value) + 1] });
      }
    });
    const dragStart = (e) => {
      isDragging = true;
      carousel.classList.remove('scroll-smooth', 'snap-x', 'snap-mandatory');
      carousel.classList.add('dragging', 'snap-none', 'scroll-auto');
      // Records the initial cursor and scroll position of the carousel
      startX = e.pageX;
      startScrollLeft = carousel.scrollLeft;
    };
    const dragging = (e) => {
      if (!isDragging) return; // if isDragging is false return from here
      // Updates the scroll position of the carousel based on the cursor movement
      carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    };
    const dragStop = () => {
      isDragging = false;
      carousel.classList.remove('dragging', 'snap-none', 'scroll-auto');
      carousel.classList.add('scroll-smooth', 'snap-x', 'snap-mandatory');
    };
    const autoPlay = () => {
      // Return if window is smaller than 800 or isAutoPlay is false
      if (window.innerWidth < 800 || !isAutoPlay) return;
      // Autoplay the carousel after every {delay} ms
      const value = firstCardWidth;
      timeoutId = setTimeout(() => {
        carousel.scrollLeft += value;
      }, delay);
    };
    const infiniteScroll = debounce(() => {
      // [ ELSE IF ] the carousel is at the end, scroll to the beginning
      if (carousel.scrollLeft <= 10) {
        carousel.classList.remove('scroll-smooth');
        carousel.classList.add('no-transition', 'scroll-auto');
        carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
        carousel.classList.remove('no-transition', 'scroll-auto');
        carousel.classList.add('scroll-smooth');
      }
      if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.remove('scroll-smooth');
        carousel.classList.add('no-transition', 'scroll-auto');
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove('no-transition', 'scroll-auto');
        carousel.classList.add('scroll-smooth');
      }
      // Clear existing timeout & start autoplay if mouse is not hovering over carousel
      clearTimeout(timeoutId);
      if (wrapper && !wrapper.matches(':hover') && isAutoPlay) {
        if (onChange) {
          const target = Math.floor(carousel.scrollLeft / (firstCardWidth));
          onChange({ target: carousel.children[target] });
        }
        autoPlay();
      }
    });
    if (isAutoPlay) autoPlay();
    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('mousemove', dragging);
    wrapper.addEventListener('mouseup', dragStop);
    carousel.addEventListener('scroll', infiniteScroll);
    if (isAutoPlay) wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
    if (isAutoPlay) wrapper.addEventListener('mouseleave', autoPlay);
  }
}

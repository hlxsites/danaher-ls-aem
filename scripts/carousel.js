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
  const carousel = wrapper?.querySelector(mainEl);
  // console.log(wrapper, carousel);
  if (!wrapper || !carousel) throw new Error('Carousel not initialised properly');
  else {
    const carouselChildrens = [...carousel.children];
    let isDragging = false;
    let startX;
    let startScrollLeft;
    let timeoutId;

    // Insert copies of the last few cards to beginning of carousel for infinite scrolling
    const copiesLastThree = carouselChildrens.slice(-3).reverse();
    copiesLastThree.map((card) => {
      const clonedCard = card.cloneNode(true);
      carousel.prepend(clonedCard);
      return null;
    });
    // Insert copies of the first few cards to end of carousel for infinite scrolling
    const copiesFirstThree = carouselChildrens.slice(0, 3);
    copiesFirstThree.map((card) => {
      const clonedCard = card.cloneNode(true);
      carousel.append(clonedCard);
      return null;
    });
    // Add event listeners for the arrow buttons to scroll the carousel left and right
    document.querySelector(previousElAction)?.addEventListener('click', () => {
      const value = carousel.querySelector('.carousel-slider').offsetWidth;
      carousel.scrollLeft += -value;
      if (onChange) onChange(carousel.children[Math.floor(carousel.scrollLeft / value) + 1]);
    });
    document.querySelector(nextElAction)?.addEventListener('click', () => {
      const value = carousel.querySelector('.carousel-slider').offsetWidth;
      carousel.scrollLeft += value;
      if (onChange) onChange(carousel.children[Math.floor(carousel.scrollLeft / value) + 1]);
    });
    const dragStart = (e) => {
      isDragging = true;
      carousel.classList.add('dragging');
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
      carousel.classList.remove('dragging');
    };
    const autoPlay = () => {
      // Return if window is smaller than 800 or isAutoPlay is false
      if (window.innerWidth < 800 || !isAutoPlay) return;
      // Autoplay the carousel after every {delay} ms
      const value = carousel.querySelector('.carousel-slider').offsetWidth;
      timeoutId = setTimeout(() => {
        carousel.scrollLeft += value;
      }, delay);
    };
    const infiniteScroll = debounce(() => {
      // [ ELSE IF ] the carousel is at the end, scroll to the beginning
      if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add('no-transition');
        carousel.scrollLeft = 0;
        carousel.classList.remove('no-transition');
      }
      // Clear existing timeout & start autoplay if mouse is not hovering over carousel
      clearTimeout(timeoutId);
      if (wrapper && !wrapper.matches(':hover') && isAutoPlay) {
        if (onChange) {
          const target = Math.floor(carousel.scrollLeft / (carousel.querySelector('.carousel-slider').offsetWidth));
          onChange({ target: carousel.children[target] });
        }
        autoPlay();
      }
    });
    if (isAutoPlay) autoPlay();
    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragStop);
    carousel.addEventListener('scroll', infiniteScroll);
    if (isAutoPlay) wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
    if (isAutoPlay) wrapper.addEventListener('mouseleave', autoPlay);
  }
}

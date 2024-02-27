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
  copyChild = 1
}) {
  const wrapper = document.getElementById(wrapperEl);

  // // Callback function to execute when mutations are observed
  // const callback = function(mutationsList, observer) {
  //   for(const mutation of mutationsList) {
  //       if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
  //         // console.log('worked', mutation);
  //           // Check if the added node is the target element
  //           const addedNode = mutation.addedNodes[0];
  //           console.log(addedNode, document.querySelector('.carousel'));
  //           if (addedNode === document.querySelector('.carousel')) {
  //               // Element is rendered completely
  //               console.log('Element rendered completely');
  //               // Disconnect the observer since it's no longer needed
  //               observer.disconnect();
  //           }
  //       }
  //   }
  // };

  // // Create a MutationObserver instance
  // const observer = new MutationObserver(callback);
  
  // // Options for the observer (which mutations to observe)
  // const config = { childList: true, subtree: true };
  
  // // Start observing the target node for configured mutations
  // observer.observe(document.querySelector('.workflow-tabs-wrapper'), config);
  
  console.log(wrapper);
  if (!wrapper) throw new Error('Carousel not initialised properly');
  else {
    // setTimeout(() => {
      const carousel = wrapper?.querySelector(mainEl);
      const carouselChildrens = [...carousel.children];
      let isDragging = false;
      let startX;
      let startScrollLeft;
      let timeoutId;

      // Get the number of cards that can fit in the carousel at once
      let cardPerView = Math.round(carousel.offsetWidth / carousel.querySelector(".carousel-slider").offsetWidth);
      console.log(carousel, carousel.offsetWidth, carousel.querySelector(".carousel-slider").offsetWidth, cardPerView);

      // Insert copies of the last few cards to beginning of carousel for infinite scrolling
      const copiesLastThree = carouselChildrens.slice(-copyChild).reverse();
      copiesLastThree.map((card) => {
        const clonedCard = card.cloneNode(true);
        carousel.prepend(clonedCard);
        return null;
      });
      // Insert copies of the first few cards to end of carousel for infinite scrolling
      const copiesFirstThree = carouselChildrens.slice(0, copyChild);
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
        if (carousel.scrollLeft <= 10) {
          carousel.classList.add("no-transition");
          carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
          carousel.classList.remove("no-transition");
        }
        if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
          carousel.classList.add('no-transition');
          carousel.scrollLeft = carousel.offsetWidth;
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
    // }, 5000);
  }
}

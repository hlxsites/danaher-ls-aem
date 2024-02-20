export default function Carousel({wrapperEl, mainEl, previousElAction, nextElAction, onChange, delay=5000, isAutoPlay=true, pauseOnHover=false}) {
    const wrapper = document.getElementById(wrapperEl);
    // console.log(wrapper, wrapperEl, isAutoPlay, document.querySelector(previousElAction));
    const carousel = wrapper?.querySelector(mainEl);
    if (!wrapper || !carousel) throw new Error('Carousel not initialised properly');
    else {
        const firstCardWidth = carousel.querySelector(".carousel-slider").offsetWidth;
        setTimeout(() => {
            const carouselChildrens = [...carousel.children];
            // console.log(carouselChildrens);
            let isDragging = false,
            startX,
            startScrollLeft,
            timeoutId;
            // Get the number of cards that can fit in the carousel at once
            let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
            // console.log(cardPerView, carousel.offsetWidth, firstCardWidth, carousel);

            // Insert copies of the last few cards to beginning of carousel for infinite scrolling
            carouselChildrens
            .slice(-cardPerView)
            .reverse()
            .forEach((card) => {
                // console.log(card, card.outerHTML);
                // carousel.prepend(card);
                carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
            });

            // Insert copies of the first few cards to end of carousel for infinite scrolling
            carouselChildrens.slice(0, cardPerView).forEach((card) => {
                carousel.insertAdjacentHTML("beforeend", card.outerHTML);
            });

            // Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove("no-transition");
            // Add event listeners for the arrow buttons to scroll the carousel left and right
            document.querySelector(previousElAction)?.addEventListener("click", () => {
                const value = carousel.querySelector(".carousel-slider").offsetWidth;
                carousel.scrollLeft += -value;
            });
            document.querySelector(nextElAction)?.addEventListener("click", () => {
                const value = carousel.querySelector(".carousel-slider").offsetWidth;
                carousel.scrollLeft += value;
            });
            const dragStart = (e) => {
                isDragging = true;
                carousel.classList.add("dragging");
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
                carousel.classList.remove("dragging");
            };
            const infiniteScroll = () => {
                // If the carousel is at the beginning, scroll to the end
                if (carousel.scrollLeft === 0) {
                    carousel.classList.add("no-transition");
                    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
                    carousel.classList.remove("no-transition");
                }
                // If the carousel is at the end, scroll to the beginning
                else if (
                    Math.ceil(carousel.scrollLeft) ===
                    carousel.scrollWidth - carousel.offsetWidth
                ) {
                    carousel.classList.add("no-transition");
                    carousel.scrollLeft = carousel.offsetWidth;
                    carousel.classList.remove("no-transition");
                }
                // Clear existing timeout & start autoplay if mouse is not hovering over carousel
                clearTimeout(timeoutId);
                if (wrapper && !wrapper.matches(":hover") && isAutoPlay) {
                    autoPlay();
                }
            };
            const autoPlay = () => {
                if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
                // Autoplay the carousel after every {delay} ms
                const value = carousel.querySelector(".carousel-slider").offsetWidth;
                timeoutId = setTimeout(() => (carousel.scrollLeft += value), delay);
            };
            if (isAutoPlay) autoPlay();
            carousel.addEventListener("mousedown", dragStart);
            carousel.addEventListener("mousemove", dragging);
            document.addEventListener("mouseup", dragStop);
            carousel.addEventListener("scroll", infiniteScroll);
            if (isAutoPlay && pauseOnHover) wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
            if (isAutoPlay && pauseOnHover) wrapper.addEventListener("mouseleave", autoPlay);
        }, 2000);
    }
}
import {
  div, h2, p, button, img, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  const slides = [
    {
      title: "Lorem ipsum dolor sit amet",
      description: "Praesent sagittis nulla eget suscipit varius. Mauris nec odio eu eros pulvinar hendrerit non at odio.",
      image: "/path-to/image1.webp"
    },
    {
      title: "Consectetur adipiscing elit",
      description: "Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
      image: "/path-to/image2.webp"
    },
    {
      title: "Aenean lacinia bibendum",
      description: "Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor.",
      image: "/path-to/image3.webp"
    }
  ];

  let currentSlide = 0;

  const wrapper = div({ class: 'flex h-screen bg-white' });

  const content = div({ class: 'w-1/2 flex flex-col justify-center px-10 space-y-4' });

  const titleEl = h2({ class: 'text-2xl font-semibold text-black' }, slides[0].title);
  const descEl = p({ class: 'text-gray-600' }, slides[0].description);

  const buttons = div({ class: 'space-x-3' },
    button({ class: 'bg-purple-600 text-white px-4 py-2 rounded-full' }, 'Primary call to action'),
    button({ class: 'border border-purple-600 text-purple-600 px-4 py-2 rounded-full' }, 'Secondary call to action')
  );

  // Indicator and Arrows under buttons
  const navContainer = div({
    class: 'flex items-center justify-center gap-4 mt-6'
  });

  const leftArrow = button({
    class: 'w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold'
  }, '‹');

  const slideNumber = span({
    class: 'font-bold text-black'
  }, `${currentSlide + 1}/${slides.length}`);

  const rightArrow = button({
    class: 'w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold'
  }, '›');

  navContainer.append(leftArrow, slideNumber, rightArrow);

  content.append(titleEl, descEl, buttons, navContainer);

  // Right image side
  const carousel = div({ class: 'w-1/2 flex justify-center items-center bg-gray-50' });

  const imageEl = img({
    src: slides[0].image,
    alt: 'Carousel image',
    class: 'w-full max-w-3xl object-contain transition duration-700 ease-in-out'
  });

  carousel.appendChild(imageEl);
  wrapper.append(content, carousel);
  block.appendChild(wrapper);

  // Slide change function
  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    imageEl.src = slides[currentSlide].image;
    titleEl.textContent = slides[currentSlide].title;
    descEl.textContent = slides[currentSlide].description;
    slideNumber.textContent = `${currentSlide + 1}/${slides.length}`;
  }

  // Arrows manual control
  leftArrow.addEventListener('click', () => goToSlide(currentSlide - 1));
  rightArrow.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Auto-slide every 3 sec
  setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 3000);
}

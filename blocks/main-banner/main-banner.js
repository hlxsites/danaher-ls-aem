import {
  div, p, img, h1, button, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = "";

  // Carousel data
  const slides = [
    {
      brand: "SCIEX",
      heading: "The power of precision",
      description: "Three where it counts. Time and time again. Providing the precision detection and quantitation of molecules needed for scientists to make discoveries that change the world.",
      buttonText: "Browse Categories",
      image: "https://via.placeholder.com/400x250?text=SCIEX+System",
    },
    {
      brand: "SCIEX Triple Quad 6500+ system",
      heading: "Capillary Electrophoresis Systems    Triple Quad",
      description: "The QTRAP 6500+ offers revolutionary sensitivity, speed, and performance for your most challenging methods.",
      buttonText: "View Product",
      image: "https://via.placeholder.com/400x250?text=Triple+Quad+6500%2B",
    },
  ];

  let currentSlide = 0;

  const renderSlide = (index) => {
    const slide = slides[index];

    const left = div(
      { class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' },
      p({ class: 'text-sm text-indigo-600 font-medium' }, slide.brand),
      h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900 whitespace-pre-line' }, slide.heading),
      p({ class: 'text-gray-600' }, slide.description),
      button({
        class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition'
      }, slide.buttonText)
    );

    const right = div(
      { class: 'md:w-1/2 flex items-center justify-center bg-gray-50 p-8' },
      img({
        src: slide.image,
        alt: slide.heading,
        class: 'w-full max-w-3xl object-contain'
      })
    );

    return [left, right];
  };

  const container = div({
    class: 'relative w-full overflow-hidden',
  });

  const slideWrapper = div({
    class: 'flex flex-col md:flex-row transition-all duration-500 ease-in-out',
  });

  const updateSlide = () => {
    slideWrapper.innerHTML = '';
    slideWrapper.append(...renderSlide(currentSlide));
    updateIndicators();
  };

  const createArrow = (dir) => {
    return button(
      {
        class: `absolute top-1/2 -translate-y-1/2 ${dir === 'left' ? 'left-4' : 'right-4'} bg-gray-300 hover:bg-gray-400 text-black rounded-full p-2 z-10`,
        'aria-label': dir === 'left' ? 'Previous Slide' : 'Next Slide',
      },
      span({ class: 'text-lg' }, dir === 'left' ? '←' : '→')
    );
  };

  const prevArrow = createArrow('left');
  const nextArrow = createArrow('right');

  prevArrow.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  });

  nextArrow.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  });

  // Indicator dots
  const indicators = div({ class: 'flex justify-center gap-2 mt-4' });

  const updateIndicators = () => {
    indicators.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = div({
        class: `h-2 w-2 rounded-full ${i === currentSlide ? 'bg-purple-600' : 'bg-gray-300'} transition`
      });
      indicators.appendChild(dot);
    });
  };

  // Initial render
  slideWrapper.append(...renderSlide(currentSlide));
  container.append(prevArrow, nextArrow, slideWrapper, indicators);
  block.appendChild(container);
  updateIndicators();
}

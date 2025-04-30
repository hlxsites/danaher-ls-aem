import {
  div, p, img, h1, button, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = "";

  // Slides with separate left/right button text
  const slides = [
    {
      brand: "SCIEX",
      heading: "The power of precision",
      description: "Three where it counts. Time and time again. Providing the precision detection and quantitation of molecules needed for scientists to make discoveries that change the world.",
      leftButtonText: "Browse Categories",
      image: "https://via.placeholder.com/400x250?text=SCIEX+System",
    },
    {
      brand: "SCIEX Triple Quad 6500+ system",
      heading: "Capillary Electrophoresis Systems\nTriple Quad",
      description: "The QTRAP 6500+ offers extraordinary sensitivity, speed, and performance for your most challenging methods.",
      leftButtonText: "Explore Models",
      image: "https://via.placeholder.com/400x250?text=Triple+Quad+6500%2B",
    },
  ];

  let currentSlide = 0;

  // Main container
  const container = div({ class: 'w-full overflow-hidden bg-white' });

  // Slide wrapper
  const slideWrapper = div({ class: 'flex flex-col md:flex-row transition-all duration-500 ease-in-out' });

  // Left side (text)
  const left = div({ class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' });

  // Right side (image + buttons)
  const right = div({ class: 'md:w-1/2 flex flex-col items-center justify-center bg-gray-50 p-8' });

  const imageContainer = div({ class: 'w-full max-w-3xl flex flex-col items-center space-y-4' });

  const imageEl = img({ class: 'w-full object-contain', alt: '' });

  const ctaButton = button({
    class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
  }, 'View Product');

  const navControls = div({ class: 'flex items-center gap-4' });

  const prevButton = button({
    class: 'w-10 h-10 bg-gray-300 hover:bg-gray-400 text-black rounded-full flex items-center justify-center',
    'aria-label': 'Previous',
  }, '←');

  const nextButton = button({
    class: 'w-10 h-10 bg-gray-300 hover:bg-gray-400 text-black rounded-full flex items-center justify-center',
    'aria-label': 'Next',
  }, '→');

  const slideNumber = span({ class: 'text-sm font-bold text-gray-700' });

  // Assemble controls
  navControls.append(prevButton, slideNumber, nextButton);
  imageContainer.append(imageEl, ctaButton, navControls);
  right.appendChild(imageContainer);

  // Assemble layout
  slideWrapper.append(left, right);
  container.appendChild(slideWrapper);
  block.appendChild(container);

  // Render current slide
  const renderSlide = (index) => {
    const slide = slides[index];
    left.innerHTML = '';

    left.append(
      p({ class: 'text-sm text-indigo-600 font-medium' }, slide.brand),
      h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900 whitespace-pre-line' }, slide.heading),
      p({ class: 'text-gray-600' }, slide.description),
      button({
        class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
      }, slide.leftButtonText)
    );

    imageEl.src = slide.image;
    imageEl.alt = slide.heading;
    ctaButton.textContent = 'View Product';
    slideNumber.textContent = `${index + 1} / ${slides.length}`;
  };

  // Navigation events
  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    renderSlide(currentSlide);
  });

  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlide(currentSlide);
  });

  // Init first slide
  renderSlide(currentSlide);
}

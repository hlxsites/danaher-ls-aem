import { div, p, a, button, span } from '../../scripts/dom-builder.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const slides = [...block.querySelectorAll('[data-aue-model="main-banner"]')];
  block.innerHTML = '';
  block.className = 'carousel-right w-full sm:w-1/2 relative overflow-hidden';

  const track = div({ class: 'carousel-track flex transition-transform duration-500 ease-in-out' });
  let currentIndex = 0;

  slides.forEach((slide) => {
    const title = slide.querySelector('p[data-aue-prop="brand_title"]')?.textContent;
    const desc = slide.querySelector('p[data-aue-prop="brand_description"]')?.textContent;
    const img = slide.querySelector('img');
    const link = slide.querySelector('p[data-aue-prop="link"]')?.textContent;

    const imageEl = img ? createOptimizedPicture(img.src, img.alt || title, false, [{ width: '600' }]) : '';

    const card = div({ class: 'carousel-slide w-full flex-shrink-0 px-6 py-8 text-center' },
      imageEl,
      p({ class: 'mt-6 text-xl font-semibold text-gray-900' }, title),
      p({ class: 'text-sm text-gray-600 my-2' }, desc),
      a({ href: '#', class: 'inline-block mt-4 px-4 py-2 bg-danaherpurple-500 text-white rounded-full text-sm font-semibold' }, link),
    );
    track.append(card);
  });

  // Navigation buttons
  const navLeft = button({
    class: 'carousel-nav-left absolute top-1/2 left-2 -translate-y-1/2 bg-white text-danaherpurple-500 rounded-full shadow-md w-10 h-10 flex items-center justify-center z-10',
    'aria-label': 'Previous Slide',
  }, '‹');

  const navRight = button({
    class: 'carousel-nav-right absolute top-1/2 right-2 -translate-y-1/2 bg-white text-danaherpurple-500 rounded-full shadow-md w-10 h-10 flex items-center justify-center z-10',
    'aria-label': 'Next Slide',
  }, '›');

  // Dots
  const dots = slides.map((_, index) =>
    span({
      class: `w-2 h-2 rounded-full ${index === 0 ? 'bg-danaherpurple-500' : 'bg-gray-300'}`,
      'data-index': index,
    }));

  const navDots = div({ class: 'carousel-dots flex justify-center items-center mt-4 gap-2' }, ...dots);

  // Append all to block
  block.append(track, navLeft, navRight, navDots);

  const updateCarousel = (index) => {
    const slideWidth = block.offsetWidth;
    track.style.transform = `translateX(-${index * slideWidth}px)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.className = `w-2 h-2 rounded-full ${i === index ? 'bg-danaherpurple-500' : 'bg-gray-300'}`;
    });
  };

  navLeft.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel(currentIndex);
  });

  navRight.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel(currentIndex);
  });

  // Optional: click on dots
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      currentIndex = parseInt(dot.getAttribute('data-index'), 10);
      updateCarousel(currentIndex);
    });
  });

  // Initial position
  updateCarousel(0);
}

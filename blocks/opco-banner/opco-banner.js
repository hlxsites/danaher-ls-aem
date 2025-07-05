import { div, img, h2 } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Grab the first child as left content

  const leftChild = block.children[0];

  const leftContent = div({ class: 'my-carousel-left md:w-1/2 p-4' });

  if (leftChild) {
    leftContent.innerHTML = leftChild.innerHTML;
  }

  // Right side carousel

  const rightCarousel = div({
    class: 'my-carousel-right md:w-1/2 relative overflow-hidden',
  });

  const carouselInner = div({
    class: 'carousel-inner flex transition-transform duration-300 ease-in-out',
  });

  // Remaining block children become slides

  const slides = Array.from(block.children).slice(1);

  slides.forEach((slideItem) => {
    const title = slideItem.querySelector('h2, .title')?.textContent || '';

    const image = slideItem.querySelector('img')?.src || '';

    const slide = div({
      class: 'carousel-slide min-w-full flex flex-col items-center',
    });

    slide.append(
      h2({ class: 'text-lg font-semibold mb-2' }, title),

      img({ src: image, alt: title, class: 'w-full h-auto rounded' })
    );

    carouselInner.append(slide);
  });

  // Carousel buttons

  const prev = div(
    { class: 'carousel-prev absolute left-2 top-1/2 cursor-pointer z-10' },
    '⟨'
  );

  const next = div(
    { class: 'carousel-next absolute right-2 top-1/2 cursor-pointer z-10' },
    '⟩'
  );

  rightCarousel.append(carouselInner, prev, next);

  // Combine

  const container = div({
    class: 'my-carousel flex flex-col md:flex-row gap-4',
  });

  container.append(leftContent, rightCarousel);

  // Safely replace children

  block.replaceChildren(container);

  // Carousel nav logic

  let index = 0;

  const total = slides.length;

  prev.addEventListener('click', () => {
    index = (index - 1 + total) % total;

    carouselInner.style.transform = `translateX(-${index * 100}%)`;
  });

  next.addEventListener('click', () => {
    index = (index + 1) % total;

    carouselInner.style.transform = `translateX(-${index * 100}%)`;
  });
}

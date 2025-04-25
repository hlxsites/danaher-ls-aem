import {
  div, h2, p, button, img, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  // Data for the slides
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

  // Container
  const wrapper = div({ class: 'flex h-screen bg-white' });

  // Left content
  const content = div({ class: 'w-1/2 flex flex-col justify-center px-10 space-y-4' });

  const titleEl = h2({ class: 'text-2xl font-semibold text-black' }, slides[0].title);
  const descEl = p({ class: 'text-gray-600' }, slides[0].description);

  const buttons = div({ class: 'space-x-3' },
    button({ class: 'bg-purple-600 text-white px-4 py-2 rounded-full' }, 'Primary call to action'),
    button({ class: 'border border-purple-600 text-purple-600 px-4 py-2 rounded-full' }, 'Secondary call to action')
  );

  content.append(titleEl, descEl, buttons);

  // Right carousel
  const carousel = div({ class: 'w-1/2 flex justify-center items-center relative bg-gray-50' });

  const imageEl = img({
    src: slides[0].image,
    alt: 'Carousel image',
    class: 'w-full max-w-3xl object-contain transition duration-700 ease-in-out'
  });

  carousel.appendChild(imageEl);

  // Pagination
  const pagination = div({ class: 'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2' });

  const dots = slides.map((_, i) =>
    span({
      class: `w-3 h-3 rounded-full ${i === 0 ? 'bg-purple-600' : 'bg-gray-300'}`
    })
  );

  dots.forEach(dot => pagination.appendChild(dot));
  carousel.appendChild(pagination);

  wrapper.append(content, carousel);
  block.appendChild(wrapper);

  // Carousel logic
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;

    imageEl.src = slides[currentSlide].image;
    titleEl.textContent = slides[currentSlide].title;
    descEl.textContent = slides[currentSlide].description;

    dots.forEach((dot, i) => {
      dot.className = `w-3 h-3 rounded-full ${i === currentSlide ? 'bg-purple-600' : 'bg-gray-300'}`;
    });
  }, 3000);
}

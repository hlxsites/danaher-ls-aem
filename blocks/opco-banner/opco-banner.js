import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  const wrapper = block;

  // === Extract Left Content ===
  const leftTitleEl = wrapper.querySelector("[data-aue-label='LeftTitle']");
  const leftDescEl = wrapper.querySelector("[data-aue-label='LeftDescription'] p");
  const leftImgEl = wrapper.querySelector("img[data-aue-label='LeftImage']");
  const leftCtaEl = wrapper.querySelector("p[data-aue-label='Link']");

  const left = div({ class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' },
    leftImgEl && img({ src: leftImgEl.src, alt: leftImgEl.alt || 'Left image', class: 'h-8 w-auto' }),
    leftTitleEl && h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, leftTitleEl.textContent.trim()),
    leftDescEl && p({ class: 'text-gray-600' }, leftDescEl.textContent.trim()),
    leftCtaEl && button({ class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition' }, leftCtaEl.textContent.trim())
  );

  // === Extract Right Content (Carousel Items) ===
  const items = wrapper.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  const slides = [];

  items.forEach((item, index) => {
    const title = item.querySelector("[data-aue-label='Title']")?.textContent.trim();
    const desc = item.querySelector("[data-aue-label='RightDescription'] p")?.textContent.trim();
    const image = item.querySelector("img[data-aue-label='RightImage']")?.getAttribute('src');
    const link1 = item.querySelector("[data-aue-label='Link1']")?.textContent.trim();
    const link2 = item.querySelector("[data-aue-label='Link2']")?.textContent.trim();
    const link3 = item.querySelector("[data-aue-label='Link3']")?.textContent.trim();

    const slide = div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} text-center space-y-4`,
      'data-index': index,
    },
      image && img({ src: image, alt: title || 'Slide image', class: 'w-full max-w-md object-contain mx-auto' }),
      title && h1({ class: 'text-xl md:text-2xl font-semibold text-gray-900' }, title),
      div({ class: 'flex justify-center gap-6 text-sm font-medium text-purple-600' },
        link1 && p({ class: 'cursor-pointer hover:underline' }, link1),
        link2 && p({ class: 'cursor-pointer hover:underline' }, link2)
      ),
      desc && p({ class: 'text-gray-600 text-sm md:text-base max-w-lg mx-auto' }, desc),
      link3 && button({ class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition' }, link3)
    );

    slides.push(slide);
  });

  const numberIndicator = span({ class: 'font-bold text-gray-700' }, `1/${slides.length}`);
  let currentIndex = 0;

  const updateSlides = (dir) => {
    const total = slides.length;
    slides[currentIndex].classList.add('hidden');
    currentIndex = (currentIndex + dir + total) % total;
    slides[currentIndex].classList.remove('hidden');
    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
  };

  const controls = div({ class: 'flex items-center justify-center gap-4 mt-4' },
    button({
      class: 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300',
      onclick: () => updateSlides(-1),
    }, '<'),
    numberIndicator,
    button({
      class: 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300',
      onclick: () => updateSlides(1),
    }, '>')
  );

  const right = div({
    class: 'md:w-1/2 bg-gray-50 flex flex-col justify-center items-center px-10 py-12',
  },
    ...slides,
    controls
  );

  const container = div({ class: 'flex flex-col md:flex-row w-full bg-white' }, left, right);
  block.append(container);
}

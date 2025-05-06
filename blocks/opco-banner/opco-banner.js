import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const wrapper = block.cloneNode(true); // Clone for safe querying
  block.textContent = ''; // Clear authored content

  console.log('🟣 Starting decorate() for opco-banner');

  // === Extract Left Content ===
  const leftTitleEl = wrapper.querySelector("[data-aue-label='LeftTitle']");
  console.log('🔹 LeftTitle:', leftTitleEl);

  const leftDescEl = wrapper.querySelector("[data-aue-label='LeftDescription'] p");
  console.log('🔹 LeftDescription <p>:', leftDescEl);

  const leftImgEl = wrapper.querySelector("img[data-aue-label='LeftImage']");
  console.log('🔹 LeftImage <img>:', leftImgEl);

  const leftCtaEl = wrapper.querySelector("p[data-aue-label='Link']");
  console.log('🔹 Left CTA (Link):', leftCtaEl);

  const left = div({ class: 'md:w-1/2 h-full flex flex-col justify-center items-center px-10 py-4 space-y-4' },
    leftImgEl && img({ src: leftImgEl.src, alt: leftImgEl.alt || 'Left image', class: 'h-40 w-auto' }),
    leftTitleEl && h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900 text-center' }, leftTitleEl.textContent.trim()),
    leftDescEl && p({ class: 'text-gray-600 text-center' }, leftDescEl.textContent.trim()),
    leftCtaEl && button({ class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition' }, leftCtaEl.textContent.trim())
  );

  // === Extract Right Content (Carousel Items) ===
  const items = wrapper.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  console.log(`🟠 Found ${items.length} carousel item(s)`);

  const slides = [];

  items.forEach((item, index) => {
    console.log(`🧩 Carousel Item ${index + 1}`, item);

    const titleEl = item.querySelector("[data-aue-label='Title']");
    const descEl = item.querySelector("[data-aue-label='RightDescription'] p");
    const imgEl = item.querySelector("img[data-aue-label='RightImage']");
    const link1El = item.querySelector("[data-aue-label='Link1']");
    const link2El = item.querySelector("[data-aue-label='Link2']");
    const link3El = item.querySelector("[data-aue-label='Link3']");

    const slide = div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} text-center space-y-4`,
      'data-index': index,
    },
    img({ src: imgEl.src, alt: titleEl?.textContent || 'Slide image', class: 'w-full max-w-sm h-40 object-contain mx-auto' }),
      titleEl && h1({ class: 'text-lg md:text-xl font-semibold text-gray-900' }, titleEl.textContent.trim()),
      div({ class: 'flex justify-center gap-6 text-sm font-medium text-purple-600' },
        link1El && p({ class: 'cursor-pointer hover:underline' }, link1El.textContent.trim()),
        link2El && p({ class: 'cursor-pointer hover:underline' }, link2El.textContent.trim())
      ),
      descEl && p({ class: 'text-gray-600 text-sm md:text-base max-w-lg mx-auto' }, descEl.textContent.trim()),
      link3El && button({ class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition' }, link3El.textContent.trim())
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
    console.log(`🔄 Slide changed to ${currentIndex + 1}`);
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
    class: 'md:w-1/2 h-full bg-gray-50 flex flex-col justify-center items-center px-10 py-4',
  },
    ...slides,
    controls
  );

  const container = div({
    class: 'flex flex-col md:flex-row w-full bg-white min-h-screen',
  }, left, right);

  block.append(container);

  console.log('✅ decorate() complete.');
}

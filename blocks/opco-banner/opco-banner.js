import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

function getTextContent(parent, selector) {
  const el = parent.querySelector(selector);
  if (!el) return null;

  // Traverse inner tags (p > span > etc.)
  const nested = el.querySelector('*');
  return nested ? nested.textContent.trim() : el.textContent.trim();
}

function getImageSrc(parent) {
  const imgEl = parent.querySelector('img');
  return imgEl?.getAttribute('src') || null;
}

export default function decorate(block) {
  block.textContent = '';
  const root = block.closest('.opco-banner-wrapper');
  if (!root) return;

  const allDivs = root.querySelectorAll(':scope > .opco-banner > div');

  // === Static left section data ===
  const staticTitle = getTextContent(allDivs[0], '[data-aue-prop="brand_title"]');
  const staticDescription = getTextContent(allDivs[0], '[data-aue-prop="brand_description"]');
  const staticImage = getImageSrc(allDivs[1]);
  const staticCta = getTextContent(allDivs[2], '[data-aue-prop="link"]');

  console.log('STATIC: ', { staticTitle, staticDescription, staticImage, staticCta });

  const left = div({
    class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6',
  },
    staticImage && img({ src: staticImage, alt: 'Brand Image', class: 'h-8 w-auto' }),
    staticTitle && h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, staticTitle),
    staticDescription && p({ class: 'text-gray-600' }, staticDescription),
    staticCta && button({ class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition' }, staticCta)
  );

  // === Carousel items ===
  const carouselItems = root.querySelectorAll('[data-aue-model="opco-banner-item"]');
  console.log('Found carousel items:', carouselItems.length);

  const carouselSlides = Array.from(carouselItems).map((item, index) => {
    const title = getTextContent(item, '[data-aue-prop="brand_title"]');
    const description = getTextContent(item, '[data-aue-prop="brand_description"]');
    const image = getImageSrc(item);
    const link1 = getTextContent(item, '[data-aue-prop="link1"]');
    const link2 = getTextContent(item, '[data-aue-prop="link2"]');
    const cta = getTextContent(item, '[data-aue-prop="link3"]');

    console.log(`Slide ${index + 1}:`, { title, description, image, link1, link2, cta });

    return div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} text-center space-y-4`,
      'data-index': index,
    },
      image && img({ src: image, alt: title, class: 'w-full max-w-md object-contain mx-auto' }),
      title && h1({ class: 'text-xl md:text-2xl font-semibold text-gray-900' }, title),
      div({ class: 'flex justify-center gap-6 text-sm font-medium text-purple-600' },
        link1 && p({ class: 'cursor-pointer hover:underline' }, link1),
        link2 && p({ class: 'cursor-pointer hover:underline' }, link2)
      ),
      description && p({ class: 'text-gray-600 text-sm md:text-base max-w-lg mx-auto' }, description),
      cta && button({ class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition' }, cta)
    );
  });

  // === Carousel controls ===
  let currentIndex = 0;
  const numberIndicator = span({ class: 'font-bold text-gray-700' }, `1/${carouselSlides.length}`);

  const updateSlides = (dir) => {
    const total = carouselSlides.length;
    carouselSlides[currentIndex].classList.add('hidden');
    currentIndex = (currentIndex + dir + total) % total;
    carouselSlides[currentIndex].classList.remove('hidden');
    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
  };

  const controls = div({ class: 'flex items-center justify-center gap-4 mt-4' },
    button({
      class: 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300',
      'aria-label': 'Previous',
      onclick: () => updateSlides(-1),
    }, '<'),
    numberIndicator,
    button({
      class: 'w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300',
      'aria-label': 'Next',
      onclick: () => updateSlides(1),
    }, '>')
  );

  const carouselWrapper = div({
    class: 'md:w-1/2 bg-gray-50 flex flex-col justify-center items-center px-10 py-12',
  },
    ...carouselSlides,
    controls
  );

  const container = div({ class: 'flex flex-col md:flex-row w-full bg-white' }, left, carouselWrapper);
  block.appendChild(container);
}

import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  const root = block.closest('.opco-banner-wrapper');
  if (!root) return;

  const allDivs = root.querySelectorAll(':scope > .opco-banner > div');
  const staticTitle = allDivs[0]?.querySelector('[data-aue-prop="brand_title"]')?.textContent?.trim();
  const staticDescription = allDivs[0]?.querySelector('[data-aue-prop="brand_description"]')?.textContent?.trim();
  const staticImage = allDivs[1]?.querySelector('img')?.getAttribute('src');
  const staticCta = allDivs[2]?.querySelector('[data-aue-prop="link"]')?.textContent?.trim();

  // === Left Section ===
  const left = div({
    class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6',
  },
    staticImage && img({
      src: staticImage,
      alt: 'Brand Image',
      class: 'h-8 w-auto',
    }),
    staticTitle && h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, staticTitle),
    staticDescription && p({ class: 'text-gray-600' }, staticDescription),
    staticCta && button({
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
    }, staticCta),
  );

  // === Right Section Carousel Items ===
  const carouselItems = root.querySelectorAll('[data-aue-model="opco-banner-item"]');

  const carouselSlides = Array.from(carouselItems).map((item, index) => {
    const title = item.querySelector('[data-aue-prop="brand_title"]')?.textContent?.trim();
    const description = item.querySelector('[data-aue-prop="brand_description"]')?.textContent?.trim();
    const image = item.querySelector('img')?.getAttribute('src');
    const link1 = item.querySelector('[data-aue-prop="link1"]')?.textContent?.trim();
    const link2 = item.querySelector('[data-aue-prop="link2"]')?.textContent?.trim();
    const cta = item.querySelector('[data-aue-prop="link3"]')?.textContent?.trim();

    return div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} text-center space-y-4`,
      'data-index': index,
    },
      image && img({
        src: image,
        alt: title,
        class: 'w-full max-w-md object-contain mx-auto',
      }),
      title && h1({ class: 'text-xl md:text-2xl font-semibold text-gray-900' }, title),
      div({ class: 'flex justify-center gap-6 text-sm font-medium text-purple-600' },
        link1 && p({ class: 'cursor-pointer hover:underline' }, link1),
        link2 && p({ class: 'cursor-pointer hover:underline' }, link2),
      ),
      description && p({ class: 'text-gray-600 text-sm md:text-base max-w-lg mx-auto' }, description),
      cta && button({
        class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
      }, cta)
    );
  });

  // Carousel Controls
  let currentIndex = 0;

  const updateSlides = (dir) => {
    const total = carouselSlides.length;
    carouselSlides[currentIndex].classList.add('hidden');
    currentIndex = (currentIndex + dir + total) % total;
    carouselSlides[currentIndex].classList.remove('hidden');
    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
  };

  const numberIndicator = span({ class: 'font-bold text-gray-700' }, `1/${carouselSlides.length}`);

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

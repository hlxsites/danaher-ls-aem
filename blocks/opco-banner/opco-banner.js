import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

function getTextFrom(selector, root) {
  const el = root.querySelector(selector);
  return el?.textContent?.trim() || '';
}

function getImageSrcFrom(root) {
  const imgEl = root.querySelector('img');
  return imgEl?.getAttribute('src') || '';
}

export default function decorate(block) {
  block.textContent = '';

  const wrapper = block;
  if (!wrapper) {
    console.error('No content wrapper found');
    return;
  }

  const allChildren = Array.from(wrapper.children);

  // === LEFT CONTENT ===
  const leftTextDiv = allChildren[0]?.querySelector(':scope > div') || allChildren[0];
  const leftImgDiv = allChildren[1]?.querySelector(':scope > div') || allChildren[1];
  const leftCtaDiv = allChildren[2]?.querySelector(':scope > div') || allChildren[2];

  const leftTitle = getTextFrom('[data-aue-prop="brand_title"]', leftTextDiv);
  const leftDescription = getTextFrom('[data-aue-prop="brand_description"]', leftTextDiv);
  const leftImageSrc = getImageSrcFrom(leftImgDiv);
  const leftCtaText = getTextFrom('[data-aue-prop="link"]', leftCtaDiv);

  const left = div({ class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' },
    leftImageSrc && img({ src: leftImageSrc, alt: 'Brand Image', class: 'h-8 w-auto' }),
    h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, leftTitle),
    p({ class: 'text-gray-600' }, leftDescription),
    button({
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
    }, leftCtaText)
  );

  // === RIGHT CAROUSEL ===
  const carouselItems = allChildren.filter(div =>
    div.getAttribute('data-aue-model') === 'opco-banner-item'
  );

  const slides = carouselItems.map((item, index) => {
    const title = getTextFrom('[data-aue-prop="brand_title"]', item);
    const description = getTextFrom('[data-aue-prop="brand_description"]', item);
    const image = getImageSrcFrom(item);
    const link1 = getTextFrom('[data-aue-prop="link1"]', item);
    const link2 = getTextFrom('[data-aue-prop="link2"]', item);
    const cta = getTextFrom('[data-aue-prop="link3"]', item);

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
      p({ class: 'text-gray-600 text-sm md:text-base max-w-lg mx-auto' }, description),
      cta && button({
        class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
      }, cta)
    );
  });

  // Carousel controls
  let currentIndex = 0;
  const numberIndicator = span({ class: 'font-bold text-gray-700' }, `1/${slides.length}`);

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

  const right = div({
    class: 'md:w-1/2 bg-gray-50 flex flex-col justify-center items-center px-10 py-12 text-center',
  },
    ...slides,
    controls
  );

  // Final output
  const container = div({ class: 'flex flex-col md:flex-row w-full bg-white' }, left, right);
  block.appendChild(container);
}

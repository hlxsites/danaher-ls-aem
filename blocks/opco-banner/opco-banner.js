import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const wrapper = block;
  console.log('🟣 Starting decorate() for opco-banner');

  const getText = (selector) => wrapper.querySelector(selector)?.textContent?.trim();
  const getImageSrc = (selector) => wrapper.querySelector(selector)?.getAttribute('src');

  const leftTitle = getText("[data-aue-label='LeftTitle']");
  const leftHeading = getText("[data-aue-label='LeftHeading']");
  const leftDescription = wrapper.querySelector("[data-aue-label='LeftDescription'] p")?.textContent?.trim();
  const leftImageSrc = wrapper.querySelector("img[data-aue-label='LeftImage']")?.getAttribute('src');
  const leftImageAlt = wrapper.querySelector("img[data-aue-label='LeftImage']")?.getAttribute('alt') || 'Left image';
  const leftCtaText = getText("p[data-aue-label='Right Button']");

  const linkLabels = Array.from({ length: 6 }, (_, i) =>
    getText(`p[data-aue-label='Link${i + 1}']`)
  ).filter(Boolean);

  const linkGrid = div({ class: 'flex flex-col gap-2' });
  for (let i = 0; i < linkLabels.length; i += 2) {
    const row = div({ class: 'flex gap-2 flex-wrap' });
    if (linkLabels[i]) {
      row.append(
        span({
          class: 'text-purple-700 bg-purple-50 text-sm font-medium px-3 py-1 rounded whitespace-nowrap',
        }, linkLabels[i])
      );
    }
    if (linkLabels[i + 1]) {
      row.append(
        span({
          class: 'text-purple-700 bg-purple-50 text-sm font-medium px-3 py-1 rounded whitespace-nowrap',
        }, linkLabels[i + 1])
      );
    }
    linkGrid.appendChild(row);
  }

  const left = div({ class: 'md:w-1/2 h-full flex flex-col justify-center items-start px-10 py-4 space-y-4' });
  if (leftImageSrc) left.append(img({ src: leftImageSrc, alt: leftImageAlt, class: 'h-40 w-auto' }));
  if (leftHeading) left.append(p({ class: 'text-blue-700 font-semibold text-sm' }, leftHeading));
  if (leftTitle) left.append(h1({ class: 'text-2xl font-bold text-gray-900 leading-snug' }, leftTitle));
  if (leftDescription) left.append(p({ class: 'text-gray-600 text-start' }, leftDescription));
  if (linkGrid.childNodes.length > 0) left.append(linkGrid);
  if (leftCtaText) {
    left.append(button({
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
      onclick: () => {},
    }, leftCtaText));
  }

  // === Right Carousel Content ===
  const items = wrapper.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  console.log(`🟠 Found ${items.length} carousel item(s)`);

  const slides = [];
  items.forEach((item, index) => {
    const title = item.querySelector("[data-aue-label='Title']")?.textContent?.trim();
    const desc = item.querySelector("[data-aue-label='RightDescription'] p")?.textContent?.trim();
    const smallTitle = item.querySelector("[data-aue-label='smallTitle']")?.textContent?.trim();
    const imgEl = item.querySelector("img[data-aue-label='RightImage']");
    const imgSrc = imgEl?.getAttribute('src');
    const imgAlt = imgEl?.getAttribute('alt') || title || 'Slide image';
    const ctaText = item.querySelector("p[data-aue-label='Left Button']")?.textContent?.trim();

    const slide = div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} text-center space-y-4`,
      'data-index': index,
    });

    if (imgSrc) {
      slide.append(img({
        src: imgSrc,
        alt: imgAlt,
        class: 'w-full max-w-sm h-40 object-contain mx-auto',
      }));
    }

    if (title) slide.append(h1({ class: 'text-lg md:text-xl font-semibold text-gray-900' }, title));
    if (smallTitle) slide.append(p({ class: 'text-base font-medium text-gray-600' }, smallTitle));
    if (desc) slide.append(p({ class: 'text-gray-600 text-sm md:text-base max-w-lg mx-auto' }, desc));
    if (ctaText) {
      slide.append(button({
        class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
        onclick: () => {},
      }, ctaText));
    }

    if (slide.childNodes.length > 0) slides.push(slide);
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
    class: 'md:w-1/2 h-full bg-gray-100 flex flex-col justify-center items-center px-10 py-4',
  }, ...slides, controls);

  const container = div({
    class: 'flex flex-col md:flex-row w-full bg-white min-h-screen',
  });

  container.append(left, right);
  block.append(container);

  console.log('✅ decorate() complete.');
}

import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // === Extract Left Content ===
  const leftTitleEl = block.querySelector("[data-aue-label='LeftTitle']");
  const leftHeadingEl = block.querySelector("[data-aue-label='LeftHeading']");
  const leftDescEl = block.querySelector("[data-aue-label='LeftDescription'] p");
  const leftImgEl = block.querySelector("img[data-aue-label='LeftImage']");
  const leftCtaEl = block.querySelector("p[data-aue-label='Left Button']");
  const leftCtaUrl = block.querySelector("a[href]:not([data-aue-label])")?.getAttribute("href") || '#';

  const linkEls = Array.from({ length: 6 }).map((_, i) =>
    block.querySelector(`p[data-aue-label='Link${i + 1}']`)
  ).filter(Boolean);

  const linkGrid = div({ class: 'flex flex-wrap w-[344px] items-start gap-2' });
  linkEls.forEach((linkEl) => {
    linkGrid.append(
      span({
        class: 'text-purple-800 text-center text-sm font-normal leading-[20px] bg-purple-50 px-3 py-1 rounded',
      }, linkEl.textContent.trim())
    );
  });

  const left = div({
    class: 'w-full md:w-1/2 flex flex-col items-start justify-center px-[60px] py-0 gap-[48px] border-b border-gray-300 bg-white'
  });

  if (leftImgEl) {
    left.append(img({
      src: leftImgEl.src,
      alt: leftImgEl.alt || 'Left image',
      class: 'w-[120px] h-auto',
    }));
  }

  if (leftTitleEl) {
    left.append(h1({
      class: 'w-[572px] text-black font-normal text-[40px] leading-[48px]'
    }, leftTitleEl.textContent.trim()));
  }

  if (leftDescEl) {
    left.append(p({
      class: 'w-[505px] text-black font-extralight text-base leading-[22px]'
    }, leftDescEl.textContent.trim()));
  }

  if (linkGrid.childNodes.length > 0) {
    left.append(linkGrid);
  }

  if (leftCtaEl) {
    left.append(button({
      class: 'flex items-center justify-center px-[25px] py-[13px] bg-purple-600 text-white rounded-[30px] shadow-sm hover:bg-purple-700 transition',
      onclick: () => window.open(leftCtaUrl, '_blank'),
    }, leftCtaEl.textContent.trim()));
  }

  // === Right Content Carousel ===
  const items = block.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  const slides = [];

  items.forEach((item, index) => {
    const titleEl = item.querySelector("[data-aue-label='Title']");
    const descEl = item.querySelector("[data-aue-label='RightDescription'] p");
    const imgEl = item.querySelector("img[data-aue-label='RightImage']");
    const smallTitle = item.querySelector("[data-aue-label='smallTitle']");
    const rightCtaEl = item.querySelector("p[data-aue-label='Right Button']");
    const rightCtaUrl = item.querySelector("a[href]")?.getAttribute("href") || '#';

    const slide = div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} flex flex-col items-center justify-center text-center space-y-4 h-[600px] bg-gray-100`,
      'data-index': index,
    });

    if (imgEl) {
      slide.append(img({
        src: imgEl.src,
        alt: titleEl?.textContent || 'Slide image',
        class: 'w-[300px] h-[184px] object-contain mix-blend-multiply',
      }));
    }

    if (titleEl) {
      slide.append(h1({
        class: 'text-[32px] leading-[40px] font-normal text-black text-center'
      }, titleEl.textContent.trim()));
    }

    if (smallTitle) {
      slide.append(p({
        class: 'text-[20px] leading-[28px] font-normal text-black text-center'
      }, smallTitle.textContent.trim()));
    }

    if (descEl) {
      slide.append(p({
        class: 'text-[16px] leading-[22px] font-extralight text-black text-center max-w-[505px]'
      }, descEl.textContent.trim()));
    }

    if (rightCtaEl) {
      slide.append(button({
        class: 'flex items-center justify-center px-[25px] py-[13px] bg-purple-600 text-white rounded-[30px] shadow-sm hover:bg-purple-700 transition',
        onclick: () => window.open(rightCtaUrl, '_blank'),
      }, rightCtaEl.textContent.trim()));
    }

    slides.push(slide);
  });

  const numberIndicator = span({ class: 'font-bold text-black text-sm' }, `1/${slides.length}`);
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
      class: 'w-8 h-8 flex items-center justify-center border border-purple-500 rounded-full text-purple-500',
      onclick: () => updateSlides(-1),
    }, '←'),
    numberIndicator,
    button({
      class: 'w-8 h-8 flex items-center justify-center border border-purple-500 rounded-full text-purple-500',
      onclick: () => updateSlides(1),
    }, '→')
  );

  const right = div({
    class: 'w-full md:w-1/2 flex flex-col justify-center items-center px-10 py-0',
  }, ...slides, controls);

  const container = div({
    class: 'flex flex-col md:flex-row w-full',
  });

  container.append(left, right);
  block.innerHTML = '';
  block.append(container);
}

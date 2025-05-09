import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // Extract Left Content
  const leftTitleEl = block.querySelector("[data-aue-label='LeftTitle']");
  const leftHeadingEl = block.querySelector("[data-aue-label='LeftHeading']");
  const leftDescEl = block.querySelector("[data-aue-label='LeftDescription'] p");
  const leftImgEl = block.querySelector("img[data-aue-label='LeftImage']");
  const leftCtaEl = block.querySelector("p[data-aue-label='Left Button']");
  const leftCtaUrl = block.querySelector("a[href]:not([data-aue-label])")?.getAttribute("href") || '#';

  const linkEls = Array.from({ length: 6 }).map((_, i) =>
    block.querySelector(`p[data-aue-label='Link${i + 1}']`)
  ).filter(Boolean);

  const linkGrid = div({
    class: 'flex flex-wrap w-[344px] items-start content-start gap-2'
  });

  linkEls.forEach((linkEl) => {
    if (linkEl) {
      linkGrid.append(
        span({
          class: 'text-danaherpurple-800 text-center text-sm font-normal leading-[20px] px-3 py-1 bg-purple-50 rounded whitespace-nowrap',
        }, linkEl.textContent.trim())
      );
    }
  });

  const left = div({ class: 'flex flex-col w-[609px] gap-12 px-[60px] py-0 items-start justify-center' });

  if (leftHeadingEl) {
    left.append(p({
      class: 'text-sm text-blue-700 font-semibold leading-[20px] py-1'
    }, leftHeadingEl.textContent.trim()));
  }

  if (leftTitleEl) {
    left.append(h1({
      class: 'text-[40px] leading-[48px] font-normal text-black w-[572px]'
    }, leftTitleEl.textContent.trim()));
  }

  if (leftDescEl) {
    left.append(p({
      class: 'text-[16px] leading-[22px] text-black font-light w-[505px]'
    }, leftDescEl.textContent.trim()));
  }

  if (linkGrid.childNodes.length > 0) {
    left.append(linkGrid);
  }

  if (leftCtaEl) {
    left.append(button({
      class: 'bg-danaherpurple-500 text-white text-sm rounded-[30px] px-[25px] py-[13px] shadow-sm hover:bg-opacity-90 transition',
      onclick: () => window.open(leftCtaUrl, '_blank'),
    }, leftCtaEl.textContent.trim()));
  }

  // Right Content Carousel
  const items = block.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  const slides = [];

  items.forEach((item, index) => {
    const titleEl = item.querySelector("[data-aue-label='Title']");
    const smallTitle = item.querySelector("[data-aue-label='smallTitle']");
    const descEl = item.querySelector("[data-aue-label='RightDescription'] p");
    const imgEl = item.querySelector("img[data-aue-label='RightImage']");
    const rightCtaEl = item.querySelector("p[data-aue-label='Right Button']");
    const rightCtaUrl = item.querySelector("a[href]")?.getAttribute("href") || '#';

    const slide = div({
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} flex flex-col items-center justify-center gap-4 text-center`,
      'data-index': index,
    });

    if (imgEl) {
      slide.append(img({
        src: imgEl.src,
        alt: titleEl?.textContent || 'Slide image',
        class: 'w-[300px] h-[184px] object-cover aspect-[75/46] mix-blend-multiply'
      }));
    }

    if (titleEl) {
      slide.append(h1({
        class: 'text-[32px] font-normal leading-[40px] text-black'
      }, titleEl.textContent.trim()));
    }

    if (smallTitle) {
      slide.append(p({
        class: 'text-[20px] font-normal leading-[28px] text-black'
      }, smallTitle.textContent.trim()));
    }

    if (descEl) {
      slide.append(p({
        class: 'text-[16px] font-light leading-[22px] text-black max-w-[505px]'
      }, descEl.textContent.trim()));
    }

    if (rightCtaEl) {
      slide.append(button({
        class: 'text-white text-sm rounded-[30px] px-[25px] py-[13px] bg-danaherpurple-500 shadow-sm hover:bg-opacity-90 transition flex items-center justify-center',
        onclick: () => window.open(rightCtaUrl, '_blank'),
      }, rightCtaEl.textContent.trim()));
    }

    slides.push(slide);
  });

  const numberIndicator = span({
    class: 'text-black text-[16px] font-bold leading-[22px]'
  }, `1/${slides.length}`);

  let currentIndex = 0;

  const updateSlides = (dir) => {
    const total = slides.length;
    slides[currentIndex].classList.add('hidden');
    currentIndex = (currentIndex + dir + total) % total;
    slides[currentIndex].classList.remove('hidden');
    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
  };

  const controls = div({
    class: 'flex items-center justify-center gap-4 mt-4'
  },
    button({
      class: 'w-8 h-8 flex items-center justify-center border border-danaherpurple-500 text-danaherpurple-500 rounded-full',
      onclick: () => updateSlides(-1),
    }, '←'),
    numberIndicator,
    button({
      class: 'w-8 h-8 flex items-center justify-center border border-danaherpurple-500 text-danaherpurple-500 rounded-full',
      onclick: () => updateSlides(1),
    }, '→')
  );

  const right = div({
    class: 'flex flex-col justify-center items-center bg-gray-100 h-[600px] flex-shrink-0 align-stretch w-full md:w-1/2'
  }, ...slides, controls);

  const container = div({
    class: 'flex flex-col md:flex-row bg-white border-b border-[#D1D5DB]'
  }, left, right);

  block.innerHTML = '';
  block.append(container);
}

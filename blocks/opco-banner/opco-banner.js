import { div, p, img, h1, button, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const leftHeadingEl = block.querySelector("[data-aue-label='LeftHeading']");
  const leftTitleEl = block.querySelector("[data-aue-label='LeftTitle']");
  const leftDescEl = block.querySelector("[data-aue-label='LeftDescription'] p");
  const leftImgEl = block.querySelector("img[data-aue-label='LeftImage']");
  const leftCtaEl = block.querySelector("p[data-aue-label='Left Button']");
  const leftCtaUrl = block.querySelector("a[href]:not([data-aue-label])")?.getAttribute("href") || '#';

  const linkEls = Array.from({ length: 6 }).map((_, i) =>
    block.querySelector(`p[data-aue-label='Link${i + 1}']`)
  ).filter(Boolean);

  const linkWrapper = div({
    class: 'flex flex-wrap gap-2 w-[344px] items-start content-start',
  });

  linkEls.forEach(linkEl => {
    linkWrapper.append(span({
      class: 'text-[14px] leading-[20px] font-normal font-primary text-center text-danaherpurple-800 bg-purple-50 px-2 py-0.5 rounded',
    }, linkEl.textContent.trim()));
  });

  // === LEFT SECTION ===
  const leftContent = div({ class: 'flex flex-col gap-6' });

  if (leftHeadingEl) {
    leftContent.append(p({
      class: 'text-sm text-danaherpurple-600 font-medium',
    }, leftHeadingEl.textContent.trim()));
  }

  if (leftImgEl) {
    leftContent.append(img({
      src: leftImgEl.src,
      alt: leftImgEl.alt || 'Brand Image',
      class: 'w-[120px] h-auto',
    }));
  }

  if (leftTitleEl) {
    leftContent.append(h1({
      class: 'text-[32px] leading-[40px] font-semibold font-primary text-black w-full',
    }, leftTitleEl.textContent.trim()));
  }

  if (leftDescEl) {
    leftContent.append(p({
      class: 'text-[16px] leading-[22px] font-normal font-primary text-black w-full',
    }, leftDescEl.textContent.trim()));
  }

  if (linkWrapper.childNodes.length > 0) {
    leftContent.append(linkWrapper);
  }

  const left = div({
    class: 'flex flex-col gap-6 md:w-1/2 p-10 items-start bg-white',
  }, leftContent);

  if (leftCtaEl) {
    const ctaWrapper = div({
      class: 'w-full flex justify-center md:justify-start',
    }, button({
      class: 'bg-danaherpurple-500 text-white text-sm font-medium rounded-[30px] px-[25px] py-[13px] shadow-sm hover:opacity-90 transition',
      onclick: () => window.open(leftCtaUrl, '_blank'),
    }, leftCtaEl.textContent.trim()));
    left.append(ctaWrapper);
  }

  // === RIGHT CAROUSEL SECTION ===
  const items = block.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  const slides = [];

  items.forEach((item, index) => {
    const titleEl = item.querySelector("[data-aue-label='Title']");
    const smallTitleEl = item.querySelector("[data-aue-label='smallTitle']");
    const descEl = item.querySelector("[data-aue-label='RightDescription'] p");
    const imgEl = item.querySelector("img[data-aue-label='RightImage']");
    const ctaText = item.querySelector("p[data-aue-label='Right Button']");
    const ctaUrl = item.querySelector("a[href]")?.getAttribute("href") || '#';

    const slide = div({
      class: `carousel-slide ${index === 0 ? 'flex' : 'hidden'} flex-col items-center gap-4 text-center w-full`,
      'data-index': index,
    });

    if (imgEl) {
      slide.append(img({
        src: imgEl.src,
        alt: titleEl?.textContent || 'Slide image',
        class: 'w-[300px] h-[184px] object-cover',
        style: 'background: lightgray center / cover no-repeat; mix-blend-mode: multiply;',
      }));
    }

    if (titleEl) {
      slide.append(h1({
        class: 'text-[24px] leading-[32px] font-semibold font-primary text-black text-center'
      }, titleEl.textContent.trim()));
    }

    if (smallTitleEl) {
      slide.append(p({
        class: 'text-[18px] leading-[26px] font-normal font-primary text-black text-center'
      }, smallTitleEl.textContent.trim()));
    }

    if (descEl) {
      slide.append(p({
        class: 'text-[14px] leading-[20px] font-light font-primary text-black text-center max-w-[420px]'
      }, descEl.textContent.trim()));
    }

    if (ctaText) {
      slide.append(button({
        class: 'bg-danaherpurple-500 text-white rounded-[30px] px-[25px] py-[13px] shadow-sm text-sm font-medium flex justify-center items-center hover:opacity-90',
        onclick: () => window.open(ctaUrl, '_blank'),
      }, ctaText.textContent.trim()));
    }

    slides.push(slide);
  });

  // === CAROUSEL CONTROLS ===
  const numberIndicator = span({
    class: 'text-[16px] leading-[22px] font-bold text-black',
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
    class: 'flex items-center justify-center gap-4 mt-4',
  },
    button({
      class: 'w-8 h-8 border border-danaherpurple-500 rounded-full text-danaherpurple-500 flex justify-center items-center',
      onclick: () => updateSlides(-1),
    }, '←'),
    numberIndicator,
    button({
      class: 'w-8 h-8 border border-danaherpurple-500 rounded-full text-danaherpurple-500 flex justify-center items-center',
      onclick: () => updateSlides(1),
    }, '→')
  );

  const right = div({
    class: 'md:w-1/2 w-full bg-gray-100 flex flex-col items-center p-10 gap-6',
  }, ...slides, controls);

  const container = div({
    class: 'flex flex-col md:flex-row w-full gap-12 items-start border-b border-gray-300',
  }, left, right);

  block.append(container);

  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = 'none';
    }
  });
}

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

  const linkGrid = div({ class: 'flex flex-wrap w-[344px] gap-2 items-start content-start' });
  linkEls.forEach((linkEl) => {
    linkGrid.append(
      span({
        class: 'text-purple-800 text-center text-sm font-normal leading-5 px-3 py-1 bg-purple-50 rounded',
      }, linkEl.textContent.trim())
    );
  });

  const left = div({ class: 'md:w-1/2 flex flex-col justify-center gap-6 pl-[60px]' });
  if (leftHeadingEl) {
    left.append(p({ class: 'text-purple-700 text-sm font-normal leading-[20px] py-1 flex items-center justify-center gap-[10px]' }, leftHeadingEl.textContent.trim()));
  }
  if (leftTitleEl) {
    left.append(h1({
      class: 'text-black text-[40px] font-normal leading-[48px] font-[TWK Lausanne Pan]',
      style: 'font-family: TWK Lausanne Pan;',
    }, leftTitleEl.textContent.trim()));
  }
  if (leftDescEl) {
    left.append(p({
      class: 'text-black text-[18px] font-normal leading-[24px] font-[TWK Lausanne Pan]'
    }, leftDescEl.textContent.trim()));
  }
  if (linkGrid.childNodes.length > 0) left.append(linkGrid);
  if (leftCtaEl) {
    left.append(button({
      class: 'bg-purple-600 text-white text-sm font-semibold px-[25px] py-[13px] rounded-full shadow-sm hover:bg-purple-700 transition',
      onclick: () => window.open(leftCtaUrl, '_blank'),
    }, leftCtaEl.textContent.trim()));
  }

  // === Right Carousel Content ===
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
      class: `carousel-slide ${index === 0 ? 'block' : 'hidden'} flex flex-col justify-center items-center h-[600px] bg-gray-100 space-y-4 px-10`,
      'data-index': index,
    });

    if (imgEl) slide.append(img({
      src: imgEl.src,
      alt: titleEl?.textContent || 'Slide image',
      class: 'w-[300px] h-[184px] object-cover aspect-[75/46] mix-blend-multiply',
    }));
    if (titleEl) slide.append(p({
      class: 'text-black text-[32px] font-normal leading-[40px] text-center font-[TWK Lausanne Pan]'
    }, titleEl.textContent.trim()));
    if (smallTitle) slide.append(p({
      class: 'text-black text-[20px] font-normal leading-[28px] text-center font-[TWK Lausanne Pan]'
    }, smallTitle.textContent.trim()));
    if (descEl) slide.append(p({
      class: 'text-black text-[16px] font-extralight leading-[22px] text-center font-[TWK Lausanne Pan]'
    }, descEl.textContent.trim()));

    if (rightCtaEl) {
      slide.append(button({
        class: 'bg-purple-600 text-white text-sm font-semibold px-[25px] py-[13px] rounded-full shadow-sm hover:bg-purple-700 transition',
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

  const controls = div({ class: 'flex items-center justify-center gap-4 mt-4' },
    button({
      class: 'w-[40px] h-[40px] flex justify-center items-center border border-purple-600 rounded',
      onclick: () => updateSlides(-1),
    }, '←'),
    numberIndicator,
    button({
      class: 'w-[40px] h-[40px] flex justify-center items-center border border-purple-600 rounded',
      onclick: () => updateSlides(1),
    }, '→')
  );

  const right = div({
    class: 'md:w-1/2 h-[600px] bg-gray-100 flex flex-col items-center justify-center gap-6',
  }, ...slides, controls);

  const container = div({
    class: 'flex flex-col md:flex-row border-b border-gray-300 bg-white w-full',
  });

  container.append(left, right);
  block.innerHTML = '';
  block.appendChild(container);

  // Hide raw content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = 'none';
    }
  });
}

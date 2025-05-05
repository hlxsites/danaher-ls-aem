import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { div, span, button } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.classList.add('flex', 'flex-col', 'lg:flex-row', 'bg-white', 'gap-4', 'p-4', 'relative', 'overflow-hidden');

  // Split children into left and right
  const children = [...block.children];
  const leftContentDivs = children.filter((child) => !child.dataset.aueModel);
  const rightBannerBlocks = children.filter((child) => child.dataset.aueModel === 'main-banner');

  // --- LEFT SIDE ---
  const left = div({ class: 'carousel-left flex flex-col justify-center max-w-xl p-4' });

  leftContentDivs.forEach((el) => {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('p').forEach((p, i) => {
      if (i === 0) p.className = 'text-3xl font-bold text-danahergray-900 mb-2';
      else p.className = 'text-base text-danahergray-700 mb-4';
    });

    const img = clone.querySelector('img');
    if (img) {
      const pic = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
      pic.classList.add('w-full', 'h-auto', 'my-4', 'rounded-lg');
      img.closest('picture')?.replaceWith(pic);
    }

    const linkP = [...clone.querySelectorAll('p')].find((p) => p.textContent.toLowerCase().includes('browse'));
    if (linkP) {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = linkP.textContent;
      link.className = 'inline-block mt-4 text-danaherpurple-600 font-semibold hover:underline';
      linkP.replaceWith(link);
    }

    left.append(clone);
  });

  // --- RIGHT SIDE CAROUSEL ---
  const carouselWrapper = div({ class: 'carousel-right relative w-full overflow-hidden flex-1' });
  const track = div({ class: 'carousel-track flex transition-transform duration-500 ease-in-out' });

  rightBannerBlocks.forEach((banner) => {
    const slide = div({ class: 'carousel-slide w-full shrink-0 flex flex-col items-center text-center px-4' });

    const brandTitle = banner.querySelector('[data-aue-prop="brand_title"]');
    const brandDesc = banner.querySelector('[data-aue-prop="brand_description"]');
    const img = banner.querySelector('img');
    const link = banner.querySelector('[data-aue-prop="link"]');

    if (brandTitle) {
      const title = document.createElement('h3');
      title.textContent = brandTitle.textContent;
      title.className = 'text-xl font-semibold text-danahergray-900 mb-2';
      slide.append(title);
    }

    if (brandDesc) {
      const desc = document.createElement('p');
      desc.textContent = brandDesc.textContent;
      desc.className = 'text-sm text-danahergray-700 mb-4';
      slide.append(desc);
    }

    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '600' }]);
      picture.querySelector('img').className = 'max-h-60 w-auto mx-auto mb-4 rounded';
      slide.append(picture);
    }

    if (link) {
      const aLink = document.createElement('a');
      aLink.href = '#';
      aLink.textContent = link.textContent;
      aLink.className = 'text-danaherpurple-600 font-semibold hover:underline';
      slide.append(aLink);
    }

    track.append(slide);
  });

  // --- ARROWS ---
  const btnLeft = button({ class: 'carousel-prev absolute left-4 top-1/2 -translate-y-1/2 bg-danahergray-200 rounded-full w-10 h-10 flex items-center justify-center hover:bg-danaherpurple-200' }, '‹');
  const btnRight = button({ class: 'carousel-next absolute right-4 top-1/2 -translate-y-1/2 bg-danahergray-200 rounded-full w-10 h-10 flex items-center justify-center hover:bg-danaherpurple-200' }, '›');

  // Append everything
  carouselWrapper.append(track, btnLeft, btnRight);
  block.innerHTML = ''; // Clear authored content
  block.append(left, carouselWrapper);

  // --- Interactivity ---
  let currentSlide = 0;
  const totalSlides = rightBannerBlocks.length;

  const updateCarousel = () => {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  };

  btnLeft.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });

  btnRight.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  });
}

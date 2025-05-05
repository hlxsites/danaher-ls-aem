import Carousel from '../../scripts/carousel.js';
import { button, img, div, span, h1, p, a } from '../../scripts/dom-builder.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { decorateModals } from '../../scripts/scripts.js';

function configureNavigation(elementControls) {
  const previousBtn = button({ type: 'button', class: 'flex items-center justify-center h-full cursor-pointer group focus:outline-none', 'data-carousel-prev': '' });
  previousBtn.innerHTML = `
    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:bg-danaherpurple-25">
      <svg class="w-3 h-3 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 1 1 5l4 4" />
      </svg>
      <span class="sr-only">Previous</span>
    </span>
  `;

  const nextBtn = button({ type: 'button', class: 'flex items-center justify-center h-full cursor-pointer group focus:outline-none', 'data-carousel-next': '' });
  nextBtn.innerHTML = `
    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:bg-danaherpurple-25">
      <svg class="w-3 h-3 text-danaherpurple-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m1 9 4-4-4-4" />
      </svg>
      <span class="sr-only">Next</span>
    </span>
  `;

  elementControls.prepend(previousBtn);
  elementControls.append(nextBtn);
  return elementControls;
}

export default function decorate(block) {
  block.textContent = ''; // Clear block

  // LEFT SIDE: Extract from authored DOM
  const logoImg = document.querySelector('[data-aue-prop="brand_logo"] img');
  const title = document.querySelector('[data-aue-prop="brand_title"]');
  const description = document.querySelector('[data-aue-prop="brand_description"]');
  const ctaLink = document.querySelector('[data-aue-prop="link"] a');

  const left = div({ class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' });

  if (logoImg) {
    left.appendChild(createOptimizedPicture(logoImg.src, logoImg.alt || '', false, [{ width: 200 }]));
  }

  if (title) {
    left.appendChild(h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, title.textContent));
  }

  if (description) {
    left.appendChild(p({ class: 'text-gray-600' }, description.textContent));
  }

  if (ctaLink) {
    left.appendChild(a({
      href: ctaLink.href,
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
    }, ctaLink.textContent));
  }

  // RIGHT SIDE: Carousel slides
  const bannerItems = document.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  const slides = div({ class: 'carousel-slides relative overflow-hidden w-full' });
  const slidesTrack = div({ class: 'carousel-track flex transition-transform duration-700 ease-in-out' });

  bannerItems.forEach((item) => {
    const slide = div({ class: 'carousel-slide flex-shrink-0 w-full md:w-[400px] px-4' });

    const imageEl = item.querySelector('img');
    if (imageEl) {
      const picture = createOptimizedPicture(imageEl.src, imageEl.alt || '', false, [{ width: 750 }]);
      picture.classList.add('rounded', 'mb-4');
      slide.appendChild(picture);
    }

    const heading = item.querySelector('[data-aue-prop="brand_title"]');
    const desc = item.querySelector('[data-aue-prop="brand_description"]');
    const link = item.querySelector('[data-aue-prop^="link"] a');

    if (heading) {
      slide.appendChild(h1({ class: 'text-lg font-semibold text-gray-800' }, heading.textContent));
    }

    if (desc) {
      slide.appendChild(p({ class: 'text-sm text-gray-600' }, desc.textContent));
    }

    if (link) {
      slide.appendChild(a({
        href: link.href,
        class: 'text-purple-600 text-sm hover:underline mt-2 block',
      }, link.textContent));
    }

    slidesTrack.appendChild(slide);
  });

  slides.appendChild(slidesTrack);

  // Controls only — no pagination
  const controls = div({ class: 'carousel-controls flex justify-between items-center mt-4' });
  configureNavigation(controls);

  // Combine layout
  const wrapper = div({ class: 'carousel md:flex block w-full gap-4' });
  const right = div({ class: 'md:w-1/2 w-full px-4 py-6' }, slides, controls);

  wrapper.append(left, right);
  block.appendChild(wrapper);

  // Initialize Carousel logic (manual only)
  new Carousel(slidesTrack, {
    slidesToShow: 1,
    transitionSpeed: 700,
    autoplay: false, // DISABLED
  });

  decorateModals(block);
}

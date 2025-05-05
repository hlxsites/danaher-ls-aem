import Carousel from '../../scripts/carousel.js';
import { button, img, div, h1, p, a } from '../../scripts/dom-builder.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
import { decorateModals } from '../../scripts/scripts.js';

function configureNavigation(container) {
  const prev = button({
    class: 'carousel-prev flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:bg-danaherpurple-25',
    'aria-label': 'Previous',
  });
  prev.innerHTML = `<svg class="w-3 h-3 text-danaherpurple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 1 1 5l4 4" /></svg>`;

  const next = button({
    class: 'carousel-next flex items-center justify-center w-8 h-8 rounded-full bg-danaherpurple-50 group-hover:bg-danaherpurple-25',
    'aria-label': 'Next',
  });
  next.innerHTML = `<svg class="w-3 h-3 text-danaherpurple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m1 9 4-4-4-4" /></svg>`;

  container.append(prev, next);
}

export default function decorate(block) {
  const children = [...block.children];
  if (children.length === 0) return;

  const [leftRaw, ...carouselItemsRaw] = children;

  block.textContent = ''; // Clear authored HTML

  // === LEFT SIDE ===
  const leftSection = div({ class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' });

  const leftImage = leftRaw.querySelector('img');
  const leftHeading = leftRaw.querySelector('h1, h2, h3');
  const leftDesc = leftRaw.querySelector('p');
  const leftCTA = leftRaw.querySelector('a');

  if (leftImage) {
    leftSection.appendChild(
      createOptimizedPicture(leftImage.src, leftImage.alt || '', false, [{ width: 200 }])
    );
  }

  if (leftHeading) {
    leftSection.appendChild(h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, leftHeading.textContent));
  }

  if (leftDesc) {
    leftSection.appendChild(p({ class: 'text-gray-600' }, leftDesc.textContent));
  }

  if (leftCTA) {
    leftSection.appendChild(
      a(
        {
          href: leftCTA.href,
          class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
        },
        leftCTA.textContent
      )
    );
  }

  // === RIGHT SIDE: CAROUSEL ===
  const track = div({ class: 'carousel-track flex transition-transform duration-700 ease-in-out' });

  carouselItemsRaw.forEach((item) => {
    const image = item.querySelector('img');
    const heading = item.querySelector('h1, h2, h3');
    const desc = item.querySelector('p');
    const cta = item.querySelector('a');

    const slide = div({ class: 'carousel-slide flex-shrink-0 w-full md:w-[400px] px-4' });

    if (image) {
      slide.appendChild(
        createOptimizedPicture(image.src, image.alt || '', false, [{ width: 600 }])
      );
    }

    if (heading) {
      slide.appendChild(h1({ class: 'text-lg font-semibold text-gray-800 mt-4' }, heading.textContent));
    }

    if (desc) {
      slide.appendChild(p({ class: 'text-sm text-gray-600' }, desc.textContent));
    }

    if (cta) {
      slide.appendChild(
        a(
          {
            href: cta.href,
            class: 'text-purple-600 text-sm hover:underline mt-2 block',
          },
          cta.textContent
        )
      );
    }

    track.appendChild(slide);
  });

  const carouselSlides = div({ class: 'carousel-slides overflow-hidden w-full' }, track);
  const carouselControls = div({ class: 'carousel-controls flex justify-end gap-2 mt-4' });
  configureNavigation(carouselControls);

  const rightSection = div({ class: 'md:w-1/2 w-full px-4 py-6' }, carouselSlides, carouselControls);

  const container = div({ class: 'carousel md:flex block w-full gap-4' }, leftSection, rightSection);
  block.appendChild(container);

  new Carousel(track, {
    slidesToShow: 1,
    transitionSpeed: 700,
    autoplay: false, // ❌ No auto sliding
  });

  decorateModals(block);
}

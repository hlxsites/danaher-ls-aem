import Carousel from '../../scripts/carousel.js';
import { button, img, div, h1, p, a } from '../../scripts/dom-builder.js';
import { decorateModals } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function buildLeftSection(contentDiv) {
  const leftImage = contentDiv.querySelector('img');
  const leftHeading = contentDiv.querySelector('h1, h2, h3');
  const leftDesc = contentDiv.querySelector('p');
  const leftCTA = contentDiv.querySelector('a');

  const section = div({ class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' });

  if (leftImage) {
    section.appendChild(
      createOptimizedPicture(leftImage.src, leftImage.alt || '', false, [{ width: 200 }])
    );
  }

  if (leftHeading) {
    section.appendChild(
      h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, leftHeading.textContent.trim())
    );
  }

  if (leftDesc) {
    section.appendChild(
      p({ class: 'text-gray-600 text-base' }, leftDesc.textContent.trim())
    );
  }

  if (leftCTA) {
    section.appendChild(
      a(
        {
          href: leftCTA.href,
          class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition text-sm',
        },
        leftCTA.textContent.trim()
      )
    );
  }

  return section;
}

function buildCarouselItem(itemDiv) {
  const itemImage = itemDiv.querySelector('img');
  const itemHeading = itemDiv.querySelector('h1, h2, h3');
  const itemDesc = itemDiv.querySelector('p');
  const itemCTA = itemDiv.querySelector('a');

  const slide = div({ class: 'carousel-slide w-full flex-shrink-0 px-4' });

  if (itemImage) {
    slide.appendChild(
      createOptimizedPicture(itemImage.src, itemImage.alt || '', false, [{ width: 600 }])
    );
  }

  if (itemHeading) {
    slide.appendChild(h1({ class: 'text-lg font-semibold text-gray-800 mt-4' }, itemHeading.textContent.trim()));
  }

  if (itemDesc) {
    slide.appendChild(p({ class: 'text-sm text-gray-600' }, itemDesc.textContent.trim()));
  }

  if (itemCTA) {
    slide.appendChild(
      a(
        {
          href: itemCTA.href,
          class: 'text-purple-600 text-sm hover:underline mt-2 block',
        },
        itemCTA.textContent.trim()
      )
    );
  }

  return slide;
}

function addCarouselControls(container, track) {
  const controls = div({ class: 'carousel-controls flex gap-2 justify-end mt-4' });

  const prevBtn = button({
    type: 'button',
    class: 'carousel-prev w-8 h-8 bg-danaherpurple-50 rounded-full flex items-center justify-center hover:bg-danaherpurple-25',
    'aria-label': 'Previous',
  });
  prevBtn.innerHTML = `<svg class="w-3 h-3 text-danaherpurple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 1 1 5l4 4"/></svg>`;

  const nextBtn = button({
    type: 'button',
    class: 'carousel-next w-8 h-8 bg-danaherpurple-50 rounded-full flex items-center justify-center hover:bg-danaherpurple-25',
    'aria-label': 'Next',
  });
  nextBtn.innerHTML = `<svg class="w-3 h-3 text-danaherpurple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m1 9 4-4-4-4"/></svg>`;

  controls.append(prevBtn, nextBtn);
  container.append(controls);

  new Carousel(track, {
    slidesToShow: 1,
    transitionSpeed: 700,
    autoplay: false,
  });
}

export default function decorate(block) {
  const children = [...block.children];
  if (!children.length) return;

  const [leftContent, ...carouselItems] = children;

  block.textContent = ''; // clear original content

  // Left Section
  const left = buildLeftSection(leftContent);

  // Right Section
  const track = div({ class: 'carousel-track flex transition-transform ease-in-out duration-500' });
  carouselItems.forEach(item => {
    track.appendChild(buildCarouselItem(item));
  });

  const slidesContainer = div({ class: 'carousel-slides overflow-hidden w-full' }, track);
  const right = div({ class: 'md:w-1/2 w-full px-4 py-6' }, slidesContainer);

  // Add controls
  addCarouselControls(right, track);

  // Final layout
  const wrapper = div({ class: 'carousel md:flex flex-col md:flex-row w-full gap-4' }, left, right);
  block.appendChild(wrapper);

  decorateModals(block);
}

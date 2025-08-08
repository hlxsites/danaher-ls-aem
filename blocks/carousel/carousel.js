// decorateSlidesFromData.js
import { div, h2, p, a } from '../../scripts/dom-builder.js';

const SLIDE_TRANSITION = 1000;

export default function decorateSlidesFromData(block, slidesData) {
  // Clear existing content
  block.innerHTML = '';

  slidesData.forEach((slide, index) => {
    // Slide container
    const slideEl = div({
      class: `card carousel-slider flex snap-start list-none bg-white flex-col duration-${SLIDE_TRANSITION} ease-in-out inset-0 transition-transform transform`,
      'data-carousel-item': index + 1,
    });

    // Left column container for text and buttons
    const leftCol = div({ class: 'lg:w-1/2 px-4 lg:px-8 xl:pr-10' });

    if (slide.left_subheading) {
      leftCol.append(p({ class: 'eyebrow' }, slide.left_subheading));
    }
    if (slide.left_main_heading) {
      leftCol.append(
        h2(
          {
            class:
              'lg:text-[40px] text-2xl md:text-4xl tracking-wide md:tracking-tight m-0 font-medium leading-6 md:leading-[44px]',
          },
          slide.left_main_heading
        )
      );
    }
    if (slide.left_product_info) {
      leftCol.append(
        p({ class: 'text-xl font-extralight tracking-tight leading-7 mt-6' }, slide.left_product_info)
      );
    }

    // Buttons container
    const btnContainer = div({ class: 'flex flex-col md:flex-row gap-5 mt-10' });

    if (slide.left_cta_1_text && slide.left_cta_1_link) {
      const btn1 = div({
        class: 'btn btn-lg font-medium btn-primary-purple rounded-full px-6',
      });
      btn1.append(a({ href: slide.left_cta_1_link, title: 'link' }, slide.left_cta_1_text));
      btnContainer.append(btn1);
    }

    if (slide.left_cta_2_text && slide.left_cta_2_link) {
      const btn2 = div({
        class: 'btn btn-lg font-medium btn-outline-trending-brand rounded-full px-6',
      });
      btn2.append(a({ href: slide.left_cta_2_link, title: 'link' }, slide.left_cta_2_text));
      btnContainer.append(btn2);
    }

    leftCol.append(btnContainer);

    // Right column container for the table or rich HTML content
    const rightCol = div({
      class:
        'relative h-48 w-full md:h-[35rem] block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-auto',
    });

    if (slide.right_text_table) {
      rightCol.innerHTML = slide.right_text_table;
    }

    // Main container wrapping left and right side
    const mainContainer = div({
      class:
        'lg:m-auto w-full h-auto max-w-7xl py-8 lg:py-0 overflow-hidden relative flex flex-col lg:flex-row',
    });

    mainContainer.append(leftCol, rightCol);
    slideEl.append(mainContainer);
    block.append(slideEl);
  });
}

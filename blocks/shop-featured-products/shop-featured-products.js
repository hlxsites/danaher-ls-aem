import {
  div, p, img, span, button, a, h2,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

function updateControls(items, currentIndex, prevDiv, nextDiv, currentPage) {
  const setControls = true;
  const setItemsPerPage = 1;
  const prevEnabled = setControls ? currentIndex > 0 : currentPage > 1;
  const nextEnabled = setControls
    ? currentIndex + setItemsPerPage < items.length
    : currentPage < Math.ceil(items.length / setItemsPerPage);

  if (prevEnabled) {
    prevDiv
      ?.querySelector('span')
      ?.classList.add('[&_svg>use]:stroke-danaherpurple-500');
    prevDiv
      ?.querySelector('span')
      ?.classList.remove('[&_svg>use]:stroke-gray-300');
    prevDiv?.classList.remove('pointer-events-none');
  } else {
    prevDiv
      ?.querySelector('span')
      ?.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
    prevDiv
      ?.querySelector('span')
      ?.classList.add('[&_svg>use]:stroke-gray-300');
    prevDiv?.classList.add('pointer-events-none');
  }
  if (nextEnabled) {
    nextDiv
      ?.querySelector('span')
      ?.classList.add('[&_svg>use]:stroke-danaherpurple-500');
    nextDiv
      ?.querySelector('span')
      ?.classList.remove('[&_svg>use]:stroke-gray-300', 'pointer-events-none');
    nextDiv?.classList.remove('pointer-events-none');
  } else {
    nextDiv
      ?.querySelector('span')
      ?.classList.remove('[&_svg>use]:stroke-danaherpurple-500');
    nextDiv
      ?.querySelector('span')
      ?.classList.add('[&_svg>use]:stroke-gray-300');
    nextDiv?.classList.add('pointer-events-none');
  }
}
export default function decorate(block) {
  document
    .querySelector('.shop-featured-products-wrapper')
    ?.parentElement?.removeAttribute('class');
  document
    .querySelector('.shop-featured-products-wrapper')
    ?.parentElement?.removeAttribute('style');
  const sectionHeading = block
    .querySelector("[data-aue-label='Section Heading']")
    ?.textContent.trim() || '';

  const carouselHead = div({
    class: 'w-full flex sm:flex-row justify-between  gap-3 pb-6',
  });

  const titleContainer = div({
    class: 'flex flex-wrap sm:flex-nowrap  gap-4',
  });
  titleContainer.append(
    div(
      {
        class:
          'text-black text-2xl font-medium leading-loose whitespace-nowrap',
      },
      sectionHeading ?? '',
    ),
  );

  const arrows = div({
    class: 'w-72 inline-flex justify-end items-center gap-6',
  });
  const arrowGroup = div({ class: 'flex justify-start items-center' });
  const prevDiv = button(
    {
      class:
        'carousel-prev-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-left pointer-events-none w-8 h-8 fill-current [&_svg>use]:stroke-gray-300 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const nextDiv = button(
    {
      class:
        'carousel-next-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-right pointer-events-none w-8 h-8 fill-current [&_svg>use]:stroke-gray-300 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  // === RIGHT CAROUSEL SECTION ===
  const items = block.querySelectorAll(
    "[data-aue-label='Shop Featured Products Item']",
  );
  const slides = [];
  let currentIndex = 0;
  const currentPage = 1;
  // === CAROUSEL CONTROLS ===

  const updateSlides = (dir) => {
    const total = slides.length;
    if (slides) {
      slides[currentIndex].style.display = 'none';
    }
    currentIndex = (currentIndex + dir + total) % total;
    if (slides[currentIndex]) {
      slides[currentIndex].style.display = 'flex';
    }
    updateControls(items, currentIndex, prevDiv, nextDiv, currentPage);
  };
  prevDiv.addEventListener('click', () => {
    updateSlides(-1);
  });
  nextDiv.addEventListener('click', () => {
    updateSlides(1);
  });
  updateControls(items, currentIndex, prevDiv, nextDiv, currentPage);
  arrowGroup.append(prevDiv, nextDiv);

  arrows.append(arrowGroup);
  decorateIcons(arrows);
  carouselHead.append(titleContainer, arrows);

  items.forEach((item, index) => {
    const brandTitle = item
      .querySelector('[data-aue-label="Brand Title"]')
      ?.textContent.trim() || '';
    const productTitle = item
      .querySelector("[data-aue-label='Product Title']")
      ?.textContent.trim() || '';
    const productImage = item.querySelector(
      "img[data-aue-label='Product Image']",
    );
    const productSubHeading = item
      .querySelector("[data-aue-label='Product Sub Heading']")
      ?.textContent.trim() || '';
    const productDescription = item.querySelector("[data-aue-label='Product Description']")?.innerHTML
      || '';
    const productButtonLabel = item
      .querySelector("p[data-aue-label='Button Label']")
      ?.textContent.trim() || '';
    const productButtonUrl = item
      .querySelector('a[href]:not([data-aue-label])')
      ?.getAttribute('href') || '#';

    const bgColor = item.querySelector('.button-container a')?.textContent.trim()
      || '#660099';
    // === Left Image Section ===

    if (productImage) {
      productImage.onerror = () => {
        productImage.src = 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
      };
    }
    let fallbackImage = '';
    if (!productImage) {
      fallbackImage = 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
    }
    const leftSection = div(
      {
        class: 'flex md:w-1/2 flex-col items-start',
      },
      div(
        {
          class: 'flex items-center justify-center h-full w-full',
        },
        img({
          src: productImage?.getAttribute('src') || fallbackImage,
          alt: productImage?.getAttribute('alt') || productTitle,
          class: 'w-full h-full object-contain max-h-[450px]',
        }),
      ),
    );

    // === Right Text Section ===
    const rightSection = div(
      {
        class: 'flex md:w-1/2 justify-center items-center p-8 min-h-[413px]',
        style: `background-color: ${bgColor};`,
      },
      div(
        {
          class: 'flex flex-col gap-6',
        },
        p(
          {
            class:
              'text-white text-base font-normal px-0 py-1 flex justify-left items-center gap-2',
          },
          brandTitle,
        ),

        h2(
          {
            class: 'text-white text-2xl leading-loose font-normal ',
          },
          productTitle,
        ),

        p(
          {
            class: 'text-white text-base font-semibold leading-snug ',
          },
          productSubHeading,
        ),

        div(
          {
            class: 'text-white text-base font-extralight leading-snug ',
          },
          ...Array.from(
            new DOMParser().parseFromString(productDescription, 'text/html')
              .body.childNodes,
          ),
        ),
        a(
          {
            href: productButtonUrl,
            class:
              'flex justify-center items-center px-[25px] py-[13px] bg-white text-danaherpurple-500 rounded-full text-base font-semibold hover:bg-opacity-90 transition duration-300 self-start',
          },
          productButtonLabel,
        ),
      ),
    );

    const slide = div(
      {
        id: `featuredProductSlide${index}`,
        'data-index': index,
        class:
          'carousel-slide flex flex-col md:flex-row items-stretch w-full max-w-[1358px] mx-auto overflow-hidden',
        style: index === 0 ? '' : 'display: none;',
      },
      leftSection,
      rightSection,
    );

    slides.push(slide);
  });
  const carouselOuter = div(
    {
      id: 'featuredProductCarouselOuter',
      class:
        'bg-gray-100 flex flex-col md:flex-row items-center  gap-6 relative',
    },
    ...slides,
  );
  const container = div(
    {
      class:
        'w-full gap-12 items-start border-b border-gray-300  dhls-container px-5 lg:px-10 dhlsBp:p-0 ',
    },
    carouselHead,
    carouselOuter,
  );

  //   block.innerHtml = "";
  //   block.textContent = "";
  //   Object.keys(block).forEach((key) => delete block[key]);
  block.append(container);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = 'none';
    }
  });
}

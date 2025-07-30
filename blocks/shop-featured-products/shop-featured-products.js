import {
  div, p, img, span, a, h2,
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
  const [bannerTitle] = block.children;

  const opcoBannerItems = [];
  [...block.children].forEach((child, index) => {
    if (index > 0) {
      opcoBannerItems.push(child);
    }
  });
  block.parentElement.parentElement.style.padding = '0';
  block.parentElement.parentElement.style.margin = '0';
  const sectionHeading = bannerTitle?.textContent.trim().replace(/<[^>]*>/g, '') || '';

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
          'text-black text-2xl font-medium leading-[2.5rem] whitespace-nowrap',
      },
      sectionHeading ?? '',
    ),
  );

  const arrows = div({
    class: 'w-72 inline-flex justify-end items-center gap-6',
  });
  const arrowGroup = div({ class: 'flex justify-start items-center' });
  const prevDiv = div(
    {
      class:
        'carousel-prev-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-left   cursor-pointer pointer-events-none w-8 h-8 fill-current [&_svg>use]:stroke-gray-300 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  const nextDiv = div(
    {
      class:
        'carousel-next-div w-8 h-8 relative overflow-hidden cursor-pointer',
    },
    span({
      class:
        'icon icon-Arrow-circle-right cursor-pointer pointer-events-none w-8 h-8 fill-current [&_svg>use]:stroke-gray-300 [&_svg>use]:hover:stroke-danaherpurple-800',
    }),
  );
  // === RIGHT CAROUSEL SECTION ===
  const items = opcoBannerItems;
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
    let itemTitle;
    let itemHeading;
    let itemSubHeading;
    let itemDescription;
    let itemImage;
    let itemButtonLabel;
    let itemButtonUrl;
    let itemButtonTarget;
    let itemBgColor;
    if (item.children.length > 8) {
      [
        itemTitle,
        itemHeading,
        itemSubHeading,
        itemDescription,
        itemImage,
        itemButtonLabel,
        itemButtonUrl,
        itemButtonTarget,
        itemBgColor,
      ] = item.children;
    } else {
      [
        itemTitle,
        itemHeading,
        itemSubHeading,
        itemDescription,
        itemImage,
        itemButtonLabel,
        itemButtonUrl,
        itemBgColor,
        itemButtonTarget,
      ] = item.children;
    }

    const brandTitle = itemTitle?.textContent?.trim() || '';
    const productTitle = itemHeading?.textContent?.trim() || '';
    const productSubHeading = itemSubHeading?.textContent?.trim() || '';
    const productDescription = itemDescription?.innerHTML || '';
    const productImage = itemImage?.querySelector('img');
    const bgColor = itemBgColor?.textContent?.trim() || '#660099';
    const productButtonUrl = itemButtonUrl?.querySelector('a')?.href;
    const productButtonTarget = itemButtonTarget?.textContent?.trim() || '';
    const productButtonLabel = itemButtonLabel?.textContent?.trim() || '';

    // === Left Image Section ===

    if (productImage) {
      productImage.onerror = () => {
        productImage.src = '/content/dam/danaher/products/fallbackImage.jpeg';
      };
    }
    let fallbackImage = '';
    if (!productImage) {
      fallbackImage = '/content/dam/danaher/products/fallbackImage.jpeg';
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
          class: 'flex flex-col gap-4',
        },
        p(
          {
            class:
              'text-white text-base font-normal m-0 px-0 py-0 flex justify-left items-center gap-2',
          },
          brandTitle,
        ),

        h2(
          {
            class: 'text-white text-2xl m-0 leading-loose font-normal ',
          },
          productTitle,
        ),

        p(
          {
            class: 'text-white text-base m-0 font-semibold leading-snug ',
          },
          productSubHeading,
        ),

        div({
          class:
            'shop-featured-description text-white text-base m-0  leading-snug ',
        }),
        a(
          {
            href: productButtonUrl,
            target: productButtonTarget === 'true' ? '_blank' : '_self',
            class:
              'flex justify-center m-0 items-center px-[25px] py-[13px] bg-white text-danaherpurple-500 rounded-full text-base font-semibold hover:bg-opacity-90 transition duration-300 self-start',
          },
          productButtonLabel,
        ),
      ),
    );
    if (productDescription) {
      rightSection
        ?.querySelector('.shop-featured-description')
        ?.insertAdjacentHTML('beforeend', productDescription);
    }
    const descriptionLinks = rightSection
      ?.querySelector('.shop-featured-description')
      ?.querySelectorAll('a');
    descriptionLinks?.forEach((link) => {
      const linkHref = link?.getAttribute('href');

      link.setAttribute(
        'target',
        linkHref?.includes('http') ? '_blank' : '_self',
      );
    });

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
        'w-full hidden gap-12 items-start  dhls-container px-5 lg:px-10 dhlsBp:p-0 ',
    },
    carouselHead,
    carouselOuter,
  );
  if (items?.length === 0) {
    // container?.classList.add("hidden");
  } else if (container?.classList.contains('hidden')) {
    // container?.classList.remove("hidden");
  }

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

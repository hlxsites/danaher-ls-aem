import {
  div,
  p,
  img,
  h1,
  h2,
  button,
  a,
  span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const [
    bannerTitle,
    bannerHeading,
    bannerDescription,
    bannerImage,
    bannerButtonUrl,
    bannerButtonNewTab,
    bannerButtonLabel,
  ] = block.children;

  const opcoBannerItems = [];
  [...block.children].forEach((child, index) => {
    if (index > 6) {
      opcoBannerItems.push(child);
    }
  });

  const baseUrl = `https://${window.DanaherConfig.host}`;

  const currentPath = window.location.href;

  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

  const opcoBannerTitle = bannerTitle;
  const opcoBannerHeading = bannerHeading;
  const opcoBannerDescription = bannerDescription?.innerHTML;
  const opcoBannerImage = bannerImage?.querySelector('img');
  const opcoBannerButtonLabel = bannerButtonLabel?.textContent?.trim().replace(/<[^>]*>/g, '') || '';
  const opcoBannerButtonTarget = bannerButtonNewTab?.textContent?.trim() || '';
  const opcoBannerButtonUrl = bannerButtonUrl.textContent?.trim();

  const linkWrapper = div({
    class: 'flex flex-wrap gap-2 max-w-[344px] items-start content-start',
  });
  if (
    currentPath.includes('products.html')
    || currentPath.includes('products-eds.html')
  ) {
    const brandsResponse = await fetch(`${baseUrl}/us/en/products-index.json`);

    const brandsRaw = await brandsResponse.json();
    const allProducts = Array.isArray(brandsRaw)
      ? brandsRaw
      : brandsRaw?.data || brandsRaw?.results || [];
    // Build unique filters (exclude brands with commas)
    const brandMap = new Map();

    allProducts.forEach((item) => {
      const brand = item.brand?.trim();
      const path = item.path?.trim();

      if (brand && !brand.includes(',') && !brandMap.has(brand)) {
        brandMap.set(brand, path);
      }
    });

    const allBrands = Array.from(brandMap.entries())
      .map(([name, path]) => ({ name, path }))
      .sort((asr, b) => asr.name.localeCompare(b.name));
    let productsTag = '';
    if (window.location.pathname.includes('products.html')) {
      productsTag = 'products';
    }
    if (window.location.pathname.includes('products-eds.html')) {
      productsTag = 'products-eds';
    }
    allBrands.forEach((pills) => {
      const linkLabel = pills?.name || '';

      const linkTarget = pills?.path || '#';
      let brandLink = '';
      if (linkLabel) {
        if (pills?.name.includes('leica') || pills?.name.includes('Leica')) {
          brandLink = 'leica';
        } else {
          brandLink = pills?.name?.toLowerCase().replace(/\s+/g, '-');
        }
        linkWrapper.appendChild(
          a(
            {
              href: `/us/en/${productsTag}/brands/${brandLink}`,
              target: linkTarget.includes('http') ? '_blank' : '_self',
              class:
                'text-[16px] leading-tight font-medium font-primary text-center text-sm text-danaherpurple-800 bg-danaherpurple-25 px-4 py-1',
            },
            linkLabel,
          ),
        );
      }
    });
  }
  // === LEFT SECTION ===
  const leftContent = div({
    class: 'flex flex-col gap-4 max-w-[567px]',
  });

  if (opcoBannerTitle) {
    leftContent.append(
      p(
        {
          class:
            'text-danaherpurple-800 font-medium text-lg font-medium leading-normal',
        },
        opcoBannerTitle.textContent.trim().replace(/<[^>]*>/g, ''),
      ),
    );
  }
  if (opcoBannerImage) {
    leftContent.append(
      img({
        src: opcoBannerImage.src,
        alt: opcoBannerImage.alt || 'Brand Image',
        class: 'w-[172px] mb-2 md:mb-8 h-auto',
      }),
    );
  }

  if (opcoBannerHeading) {
    leftContent.append(
      h1(
        {
          class:
            'text-4xl leading-[48px] text-lg font-medium text-black w-full m-0 leading-normal',
        },
        opcoBannerHeading.textContent.trim().replace(/<[^>]*>/g, ''),
      ),
    );
  }

  if (opcoBannerDescription) {
    const leftDescription = div({
      id: 'opcoBannerDescription',
      class: 'text-[18px] leading-[22px] font-normal text-black w-full',
    });

    leftDescription.insertAdjacentHTML('beforeend', opcoBannerDescription);
    leftDescription.querySelectorAll('p')?.forEach((ite, inde, arr) => {
      if (inde !== arr.length - 1) {
        ite.classList.add('pb-4');
      }
      if (ite?.textContent?.trim() === '') {
        ite.remove();
      }
    });
    const descriptionLinks = leftDescription?.querySelectorAll('a');
    descriptionLinks?.forEach((link) => {
      link.classList.add(
        'text-black',
        'underline',
        'decoration-danaherpurple-500',
        'hover:bg-danaherpurple-500',
        'hover:text-white',
      );
      const linkHref = link?.getAttribute('href');

      link.setAttribute(
        'target',
        linkHref.includes('http') ? '_blank' : '_self',
      );
    });
    leftContent.append(leftDescription);
  }

  if (linkWrapper.childNodes.length > 0) {
    leftContent.append(linkWrapper);
  }

  if (opcoBannerButtonUrl && opcoBannerButtonLabel) {
    let opcoTarget;

    if (opcoBannerButtonUrl?.includes('http')) {
      opcoTarget = opcoBannerButtonTarget === 'true' ? '_blank' : '_self';
    } else if (opcoBannerButtonUrl?.includes('#')) {
      opcoTarget = '_self';
    } else {
      opcoTarget = opcoBannerButtonTarget === 'true' ? '_blank' : '_self';
    }

    const ctaWrapper = a(
      {
        href: opcoBannerButtonUrl,
        target: opcoTarget,
        class:
          'max-w-max bg-danaherpurple-500 text-danaherpurple-800 text-white text-base font-medium rounded-[30px] px-[25px] py-[13px] shadow-sm hover:bg-danaherpurple-800 transition',
      },
      opcoBannerButtonLabel,
    );
    leftContent.append(ctaWrapper);
  }
  const left = div(
    {
      class:
        'flex flex-col gap-6 md:w-1/2 p-6 dhlsBp:pl-0 items-start bg-white',
    },
    leftContent,
  );

  // === RIGHT CAROUSEL SECTION ===
  const slides = [];

  let realSlideCount = 0;

  const numberIndicator = span(

    {

      class: 'controlsContentText duration-0 ease-in-out justify-start text-black text-base font-bold leading-snug',

    },

    '1/0',

  );

  opcoBannerItems.forEach((item, index) => {
    let itemTitle;
    let itemSubHeading;
    let itemDescription;
    let itemImage;
    let itemBgImage;
    let itemButtonUrl;
    let itemButtonTarget;
    let itemButtonLabel;
    if (item.children.length > 6) {
      [
        itemTitle,
        itemSubHeading,
        itemDescription,
        itemImage,
        itemBgImage,
        itemButtonUrl,
        itemButtonTarget,
        itemButtonLabel,
      ] = item.children;
    } else {
      [
        itemTitle,
        itemSubHeading,
        itemDescription,
        itemImage,
        itemBgImage,
        itemButtonUrl,
        itemButtonLabel,
        itemButtonTarget,
      ] = item.children;
    }

    const opcoBannerItemTitle = itemTitle?.textContent?.trim() || '';
    const opcoBannerItemSubHeading = itemSubHeading?.textContent?.trim();
    const opcoBannerItemDescription = itemDescription?.innerHTML?.trim();
    const opcoBannerItemImage = itemImage?.querySelector('img');
    const opcoBannerItemBgImage = itemBgImage?.querySelector('img');
    const ctaUrl = itemButtonUrl?.textContent?.trim();
    const opcoBannerItemButtonTarget = itemButtonTarget?.textContent?.trim();
    const opcoBannerItemButtonLabel = itemButtonLabel?.textContent?.trim();

    const contentWrapper = div({
      class:
        'min-h-[400px] dhlsBp:pr-0 z-10 flex flex-col items-center justify-center gap-2 text-center w-full max-w-[470px]',
    });

    if (opcoBannerItemImage) {
      contentWrapper.append(
        img({
          src: opcoBannerItemImage?.src,
          alt: opcoBannerItemTitle || 'Slide image',
          class: `${
            opcoBannerItemBgImage ? 'opacity-0' : ''
          } w-[300px] h-[184px] object-contain`,
        }),
      );
    } else {
      contentWrapper.append(
        div({
          class: 'opacity-0  w-[300px] h-[184px] object-contain',
        }),
      );
    }

    if (opcoBannerItemTitle) {
      contentWrapper.append(
        h2(
          {
            class: 'text-3xl  leading-10 font-medium text-black text-center',
          },
          opcoBannerItemTitle,
        ),
      );
    }

    if (opcoBannerItemSubHeading) {
      contentWrapper.append(
        p(
          {
            class:
              'leading-7 !line-clamp-1 text-clip !break-words font-medium text-black text-xl text-center',
          },
          opcoBannerItemSubHeading,
        ),
      );
    }

    if (opcoBannerItemDescription) {
      const descriptionHtml = div();
      descriptionHtml.insertAdjacentHTML(
        'beforeend',
        opcoBannerItemDescription,
      );

      const descriptionLinks = descriptionHtml.querySelectorAll('a');
      descriptionLinks?.forEach((link) => {
        link.classList.add(
          'text-black',
          'underline',
          'decoration-danaherpurple-500',
          'hover:bg-danaherpurple-500',
          'hover:text-white',
        );
        const linkHref = link?.getAttribute('href');

        link.setAttribute(
          'target',
          linkHref?.includes('http') ? '_blank' : '_self',
        );
      });
      contentWrapper.append(
        div(
          {
            class:
              'text-[16px] !line-clamp-2 text-clip !break-words leading-snug text-black font-normal text-center max-w-[420px]',
          },
          descriptionHtml,
        ),
      );
    }

    if (opcoBannerItemButtonLabel && ctaUrl) {
      contentWrapper.append(
        button(
          {
            class:
              'bg-danaherpurple-500 text-white font-medium rounded-[30px] px-[25px] mt-6 mb-6 py-[13px] text-base flex justify-center items-center hover:bg-danaherpurple-800',
            onclick: () => window.open(
              ctaUrl,
              opcoBannerItemButtonTarget === 'true' ? '_blank' : '_self',
            ),
          },
          opcoBannerItemButtonLabel,
        ),
      );
    }
    const overlayWrapper = div({
      class:
        'absolute top-0 w-full h-full  bg-gradient-to-b from-black/0 to-black/95 hidden',
    });
    const slide = div(
      {
        id: `opcoBannerSlide${index}`,
        'data-index': index,
        class: ` ${opcoBannerItemBgImage ? 'hasBg ' : ' '} ${
          opcoBannerItems.length > 1 ? '' : 'justify-center'
        } flex-shrink-0 carousel-slide p-10 flex min-h-[650px] md:min-h-[600px] flex-col items-center w-full relative !duration-1000 !ease-in-out !transition-transform !transform`,
      },
      contentWrapper,
      overlayWrapper,
    );

    if (opcoBannerItemBgImage) {
      overlayWrapper?.classList.remove('hidden');
      slide.style.padding = '2.5rem';
      slide.style.backgroundImage = `url('${opcoBannerItemBgImage.src}')`;
      slide.style.backgroundSize = 'cover';
      slide.style.backgroundSize = 'cover';
      slide.style.backgroundPosition = 'center';
      slide.querySelectorAll('.text-center')?.forEach((it) => {
        it.style.color = '#fff';
      });
    } else {
      overlayWrapper?.classList.add('hidden');
      if (slide.hasAttribute('style')) {
        slide.style.padding = '';
        slide.style.backgroundImage = '';
        slide.style.backgroundSize = '';
        slide.style.backgroundPosition = '';
        slide.querySelectorAll('.text-center')?.forEach((ite) => {
          if (ite.hasAttribute('style')) {
            ite.removeAttribute('style');
          }
        });
      }
    }
    if (!opcoBannerItemImage && !opcoBannerItemTitle) {
      slide.classList.add('hidden');
    } else {
      if (slide.classList.contains('hidden')) {
        slide.classList.remove('hidden');
      }
      if (numberIndicator) {
        numberIndicator.textContent = `1/${index + 1}`;
      }
      slides.push(slide);
      realSlideCount += 1;
    }
  });
  // Add clones for infinite scroll

  const firstClone = slides[0].cloneNode(true);

  const lastClone = slides[slides.length - 1].cloneNode(true);

  slides.unshift(lastClone);

  slides.push(firstClone);

  let currentIndex = 1;

  const updateSlides = (dir) => {
    const total = realSlideCount;

    const carouselTrack = document.getElementById('rigthCarouselTrack');

    currentIndex += dir;

    // Smooth transition for visible shift

    carouselTrack.style.transition = 'transform 0.7s ease-in-out';

    carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Listen once for transition end

    const onTransitionEnd = () => {
      carouselTrack.removeEventListener('transitionend', onTransitionEnd);

      // Jump instantly (no animation) to real first/last slide if on clone

      if (currentIndex === 0) {
        carouselTrack.style.transition = 'none';

        currentIndex = total;

        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      } else if (currentIndex === slides.length - 1 || currentIndex >= slides.length) {
        carouselTrack.style.transition = 'none';

        currentIndex = 1;

        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    };

    carouselTrack.addEventListener('transitionend', onTransitionEnd);

    // Update slide count display

    const displayIndex = currentIndex === 0
      ? total
      : currentIndex === slides.length - 1
        ? 1
        : currentIndex;

    const getSlide = document.querySelector(`#opcoBannerSlide${currentIndex - 1}`);

    if (getSlide?.classList.contains('hasBg')) {
      numberIndicator.style.color = '#fff';
    } else {
      numberIndicator.style.color = '';
    }

    numberIndicator.textContent = `${displayIndex}/${total}`;
  };

  const controls = div(
    {
      id: 'opcoBannerControls',
      class:
        'flex absolute bottom-6 dhlsBp:bottom-12 items-center  justify-center gap-4 w-full',
    },
    button(
      {
        class:
          'w-8 bg-danaherpurple-50 p-2.5 h-8 border transition-colors duration-0 rounded-full text-danaherpurple-500 flex justify-center items-center',
        onclick: () => updateSlides(-1),
      },
      span({
        class: 'icon icon-arrow-left-icon',
      }),
    ),
    numberIndicator,
    button(
      {
        class:
          'w-8 bg-danaherpurple-50 text-base p-2.5 h-8 border rounded-full text-danaherpurple-500 flex justify-center items-center',
        onclick: () => updateSlides(1),
      },
      span({
        class: 'icon icon-arrow-right-icon',
      }),
    ),
  );

  decorateIcons(controls);
  const right = div(
    {
      id: 'opcoBannerCarouselOuter',
      class:
        'md:w-1/2 w-full bg-gray-100 overflow-hidden flex   flex-col items-center  gap-6 relative  duration-1000 ease-in-out transition-transform transform',
    },
    div(
      {
        id: 'rigthCarouselTrack',
        style: `transform: translateX(-${currentIndex * 100}%);`,
        class: 'flex duration-1000 w-[100%] md:w-auto ease-in-out transition-transform transform',
      },
      ...slides,
    ),
    opcoBannerItems.length > 1 ? controls : '',
  );
  const getFirstSlide = right.querySelector('#opcoBannerSlide0');
  if (getFirstSlide && getFirstSlide.classList.contains('hasBg')) {
    numberIndicator.style.color = '#fff';
  }
  const container = div(
    {
      class:
        'flex flex-col md:flex-row w-full dhls-container !mt-0 lg:px-10 dhlsBp:p-0 items-center border-b border-gray-300',
    },
    left,
    right,
  );

  block.append(container);
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = 'none';
    }
  });
}

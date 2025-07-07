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

<<<<<<< HEAD
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

  const baseUrl = 'https://lifesciences.danaher.com';

  const currentPath = window.location.href;
=======
export default function decorate(block) {
  // document
  //   .querySelector(".opco-banner-wrapper")
  //   ?.parentElement?.classList.add("carousel-container");
  // document
  //   .querySelector(".opco-banner-wrapper")
  //   ?.classList.add("carousel-wrapper");
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

<<<<<<< HEAD
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
    || currentPath.includes('/shop-page')
    || currentPath.includes('/shop-home')
    || currentPath.includes('/products-eds1.html')
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
              href: `/us/en/products-eds1/brands/${brandLink}`,
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
=======
  const opcoBannerTitle = block.querySelector(
    "[data-aue-prop='opcoBannerTitle']",
  );
  const opcoBannerHeading = block.querySelector(
    "[data-aue-prop='opcoBannerHeading']",
  );
  const opcoBannerDescription = block.querySelector(
    "[data-aue-prop='opcoBannerDescription']",
  )?.innerHTML;
  const opcoBannerImage = block.querySelector(
    "img[data-aue-prop='opcoBannerImage']",
  );
  const opcoBannerButtonLabel = block.querySelector(
    "p[data-aue-prop='opcoBannerButtonLabel']",
  );
  const opcoBannerButtonUrl = block
    .querySelector('a[href]:not([data-aue-label])')
    ?.getAttribute('href') || '#';

  // const linkEls = Array.from({ length: 7 })
  //   .map((_, i) => block.querySelector(`p[data-aue-label='Link${i + 1}']`))
  //   .filter(Boolean);

  const opcoBannerPills = block.querySelectorAll('a');
  const linkWrapper = div({
    class: 'flex flex-wrap gap-2 max-w-[344px] items-start content-start',
  });

  opcoBannerPills.forEach((pills, index) => {
    if (index < 7 && index > 0) {
      const linkLabel = block.querySelector(
        `p[data-aue-prop='opcoBannerLink${index + 1}Label']`,
      );
      if (linkLabel) {
        linkWrapper.appendChild(
          a(
            {
              href: pills?.textContent || '#',
              class:
                'text-[14px] bg-danaherpurple-500 leading-tight font-medium font-primary text-center text-sm text-danaherpurple-800 bg-purple-50 px-4 py-1',
            },
            linkLabel?.textContent?.trim() || '',
          ),
        );
      }
    }
  });

>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD
        src: opcoBannerImage.src,
        alt: opcoBannerImage.alt || 'Brand Image',
        class: 'w-[172px] mb-2 md:mb-8 h-auto',
=======
        src: opcoBannerImage.src.replace(/<[^>]*>/g, ''),
        alt: opcoBannerImage.alt.replace(/<[^>]*>/g, '') || 'Brand Image',
        class: 'w-[120px] mb-2 md:mb-8 h-auto',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD
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
=======
      class: 'text-[16px] leading-[22px] font-normal text-black w-full',
    });

    leftDescription.insertAdjacentHTML('beforeend', opcoBannerDescription);
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    leftContent.append(leftDescription);
  }

  if (linkWrapper.childNodes.length > 0) {
    leftContent.append(linkWrapper);
  }

  if (opcoBannerButtonUrl && opcoBannerButtonLabel) {
<<<<<<< HEAD
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
          'max-w-max bg-danaherpurple-500 text-danaherpurple-800 text-white text-sm font-medium rounded-[30px] px-[25px] py-[13px] shadow-sm hover:bg-danaherpurple-800 transition',
      },
      opcoBannerButtonLabel,
=======
    const ctaWrapper = button(
      {
        class:
          'max-w-max bg-danaherpurple-500 text-danaherpurple-800 text-white text-sm font-medium rounded-[30px] px-[25px] py-[13px] shadow-sm hover:opacity-90 transition',
        onclick: () => window.open(opcoBannerButtonUrl, '_blank'),
      },
      opcoBannerButtonLabel?.textContent.trim().replace(/<[^>]*>/g, '') || '',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD
=======
  const items = block.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  const slides = [];
  let currentIndex = 0;

  // === CAROUSEL CONTROLS ===
  const numberIndicator = span(
    {
      class:
        'controlsContentText justify-start text-black text-base font-bold leading-snug',
    },
    `1/${slides.length}`,
  );

  const updateSlides = (dir) => {
    const total = slides.length;
    if (slides) {
      slides[currentIndex].style.display = 'none';
    }
    currentIndex = (currentIndex + dir + total) % total;
    if (slides[currentIndex]) {
      slides[currentIndex].style.display = 'flex';
    }
    const getSlides = document.querySelector(`#opcoBannerSlide${currentIndex}`);

    if (getSlides && getSlides.classList.contains('hasBg')) {
      numberIndicator.style.color = '#fff';
    } else {
      numberIndicator.style.color = '';
    }
    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
  };
  const controls = div(
    {
      id: 'opcoBannerControls',
      class:
        'flex absolute bottom-6 dhlsBp:bottom-12 items-center  justify-center gap-4',
    },
    button(
      {
        class:
          'w-8 bg-danaherpurple-50 p-2.5 h-8 border  rounded-full text-danaherpurple-500 flex justify-center items-center',
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
<<<<<<< HEAD
          'w-8 bg-danaherpurple-50 text-base p-2.5 h-8 border rounded-full text-danaherpurple-500 flex justify-center items-center',
=======
          'w-8 bg-danaherpurple-50 p-2.5 h-8 border rounded-full text-danaherpurple-500 flex justify-center items-center',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        onclick: () => updateSlides(1),
      },
      span({
        class: 'icon icon-arrow-right-icon',
      }),
    ),
  );
<<<<<<< HEAD
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
=======
  items.forEach((item, index) => {
    const opcoBannerItemTitle = item.querySelector(
      "[data-aue-prop='opcoBannerItemTitle']",
    );
    const opcoBannerItemSubHeading = item.querySelector(
      "[data-aue-prop='opcoBannerItemSubHeading']",
    );
    const opcoBannerItemDescription = item.querySelector(
      "[data-aue-prop='opcoBannerItemDescription'] p",
    );
    const opcoBannerItemImage = item.querySelector(
      "img[data-aue-prop='opcoBannerItemImage']",
    );
    const opcoBannerItemBgImage = item.querySelector(
      "img[data-aue-prop='opcoBannerItemBgImage']",
    );
    const opcoBannerItemButtonLabel = item.querySelector(
      "p[data-aue-prop='opcoBannerItemButtonLabel']",
    );
    const ctaUrl = item.querySelector('a[href]')?.getAttribute('href') || '#';
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

    const contentWrapper = div({
      class:
        'min-h-[400px] dhlsBp:pr-0 z-10 flex flex-col items-center justify-center gap-2 text-center w-full max-w-[470px]',
    });

    if (opcoBannerItemImage) {
      contentWrapper.append(
        img({
          src: opcoBannerItemImage?.src,
<<<<<<< HEAD
          alt: opcoBannerItemTitle || 'Slide image',
          class: `${
            opcoBannerItemBgImage ? 'opacity-0' : ''
          } w-[300px] h-[184px] object-contain`,
=======
          alt:
            opcoBannerItemTitle?.textContent.replace(/<[^>]*>/g, '')
            || 'Slide image',
          class: `${
            opcoBannerItemBgImage ? 'opacity-0' : ''
          } w-[300px] h-[184px] object-cover`,
          style:
            'background: lightgray center / cover no-repeat; mix-blend-mode: multiply;',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        }),
      );
    }

    if (opcoBannerItemTitle) {
      contentWrapper.append(
        h2(
          {
            class: 'text-3xl leading-10 font-medium text-black text-center',
          },
<<<<<<< HEAD
          opcoBannerItemTitle,
=======
          opcoBannerItemTitle?.textContent.trim().replace(/<[^>]*>/g, '') || '',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        ),
      );
    }

    if (opcoBannerItemSubHeading) {
      contentWrapper.append(
        p(
          {
<<<<<<< HEAD
            class:
              'leading-7 !line-clamp-1 text-clip !break-words font-medium text-black text-xl text-center',
          },
          opcoBannerItemSubHeading,
=======
            class: 'leading-7 font-medium text-black text-xl text-center',
          },
          opcoBannerItemSubHeading?.textContent
            .trim()
            .replace(/<[^>]*>/g, '') || '',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        ),
      );
    }

    if (opcoBannerItemDescription) {
<<<<<<< HEAD
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
          linkHref.includes('http') ? '_blank' : '_self',
        );
      });
      contentWrapper.append(
        div(
          {
            class:
              'text-[16px] !line-clamp-2 text-clip !break-words leading-snug text-black font-normal text-center max-w-[420px]',
          },
          descriptionHtml,
=======
      contentWrapper.append(
        p(
          {
            class:
              'text-[14px] leading-snug font-extralight text-black text-center max-w-[420px]',
          },
          opcoBannerItemDescription?.textContent
            .trim()
            .replace(/<[^>]*>/g, '') || '',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        ),
      );
    }

<<<<<<< HEAD
    if (opcoBannerItemButtonLabel && ctaUrl) {
=======
    if (opcoBannerItemButtonLabel) {
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
      contentWrapper.append(
        button(
          {
            class:
<<<<<<< HEAD
              'bg-danaherpurple-500 text-white font-medium rounded-[30px] px-[25px] mt-6 mb-6 py-[13px] text-base flex justify-center items-center hover:bg-danaherpurple-800',
            onclick: () => window.open(
              ctaUrl,
              opcoBannerItemButtonTarget === 'true' ? '_blank' : '_self',
            ),
          },
          opcoBannerItemButtonLabel,
=======
              'bg-danaherpurple-500 text-white font-medium rounded-[30px] px-[25px] mt-6 mb-6 py-[13px] shadow-sm text-sm flex justify-center items-center hover:opacity-90',
            onclick: () => window.open(ctaUrl, '_blank'),
          },
          opcoBannerItemButtonLabel?.textContent
            .trim()
            .replace(/<[^>]*>/g, '') || '',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD
        class: ` ${opcoBannerItemBgImage ? 'hasBg ' : ' '} ${
          opcoBannerItems.length > 1 ? '' : 'justify-center'
        } carousel-slide p-10 flex  min-h-[650px] md:min-h-[600px] flex-col items-center w-full relative`,
=======
        class: ` ${
          opcoBannerItemBgImage ? 'hasBg ' : ' '
        }carousel-slide p-10 flex  min-h-[650px] md:min-h-[600px] flex-col items-center w-full relative`,
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        style: index === 0 ? '' : 'display: none;',
      },
      contentWrapper,
      overlayWrapper,
    );

<<<<<<< HEAD
=======
    if (numberIndicator) {
      numberIndicator.textContent = `1/${index + 1}`;
    }
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD
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
    }
=======
    slides.push(slide);
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  });
  decorateIcons(controls);
  const right = div(
    {
      id: 'opcoBannerCarouselOuter',
      class:
        'md:w-1/2 w-full bg-gray-100 flex   flex-col items-center  gap-6 relative',
    },
    ...slides,
<<<<<<< HEAD
    opcoBannerItems.length > 1 ? controls : '',
=======
    items.length > 0 ? controls : '',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  );
  const getFirstSlide = right.querySelector('#opcoBannerSlide0');
  if (getFirstSlide && getFirstSlide.classList.contains('hasBg')) {
    numberIndicator.style.color = '#fff';
  }
  const container = div(
    {
      class:
<<<<<<< HEAD
        'flex flex-col md:flex-row w-full dhls-container !mt-0 lg:px-10 dhlsBp:p-0 items-center border-b border-gray-300',
=======
        'flex flex-col md:flex-row w-full dhls-container lg:px-10 dhlsBp:p-0 items-center border-b border-gray-300',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    },
    left,
    right,
  );

  block.append(container);
<<<<<<< HEAD
=======

  // Hide authored AEM content
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = 'none';
    }
  });
}

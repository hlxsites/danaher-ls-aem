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
  // de-structure block children once
  const [
    bannerTitle,
    bannerHeading,
    bannerDescription,
    bannerImage,
    bannerButtonUrl,
    bannerButtonNewTab,
    bannerButtonLabel,
    ...opcoBannerItems
  ] = block.children;
  const baseUrl = 'https://lifesciences.danaher.com';
  const currentPath = window.location.href;
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const opcoBannerButtonText = bannerButtonLabel?.textContent?.trim() || '';
  const opcoBannerButtonTarget =
    bannerButtonNewTab?.textContent?.trim() === 'true' ? '_blank' : '_self';
  const opcoBannerButtonUrl = bannerButtonUrl?.textContent?.trim() || '';
  // === BRANDS FILTER (only for specific pages) ===
  const linkWrapper = div({
    class: 'flex flex-wrap gap-2 max-w-[344px] items-start content-start',
  });
  if (
    currentPath.includes('products.html') ||
    currentPath.includes('/shop-page') ||
    currentPath.includes('/shop-home') ||
    currentPath.includes('/products-eds1.html')
  ) {
    try {
      const res = await fetch(`${baseUrl}/us/en/products-index.json`);
      const data = await res.json();
      const products = Array.isArray(data)
        ? data
        : data?.data || data?.results || [];
      const brands = products
        .filter((item) => item.brand && !item.brand.includes(','))
        .reduce((map, item) => {
          if (!map.has(item.brand)) {
            map.set(item.brand, item.path);
          }
          return map;
        }, new Map());
      Array.from(brands.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([name]) => {
          const slug = name.toLowerCase().replace(/\s+/g, '-');
          linkWrapper.appendChild(
            a(
              {
                href: `/us/en/products-eds1/brands/${slug}`,
                target: '_self',
                class:
                  'text-sm font-medium text-danaherpurple-800 bg-danaherpurple-25 px-4 py-1 text-center',
              },
              name
            )
          );
        });
    } catch (e) {
      console.error('Brand JSON fetch failed:', e);
    }
  }
  // === LEFT SECTION ===
  const leftContent = div({ class: 'flex flex-col gap-4 max-w-[567px]' });
  if (bannerTitle) {
    leftContent.append(
      p(
        { class: 'text-danaherpurple-800 font-medium text-lg' },
        bannerTitle.textContent.trim()
      )
    );
  }
  if (bannerImage?.querySelector('img')) {
    const image = bannerImage.querySelector('img');
    leftContent.append(
      img({
        src: image.src,
        alt: image.alt || 'Brand Image',
        class: 'w-[172px] mb-2 md:mb-8 h-auto',
      })
    );
  }
  if (bannerHeading) {
    leftContent.append(
      h1(
        { class: 'text-4xl leading-[48px] font-medium text-black' },
        bannerHeading.textContent.trim()
      )
    );
  }
  if (bannerDescription) {
    const desc = div({
      id: 'opcoBannerDescription',
      class: 'text-[18px] leading-[22px] text-black',
    });
    desc.innerHTML = bannerDescription.innerHTML;
    desc.querySelectorAll('p').forEach((el, i, arr) => {
      if (i !== arr.length - 1) el.classList.add('pb-4');
      if (!el.textContent.trim()) el.remove();
    });
    desc.querySelectorAll('a').forEach((link) => {
      link.classList.add(
        'underline',
        'text-black',
        'hover:text-white',
        'hover:bg-danaherpurple-500'
      );
      link.target = link.href.includes('http') ? '_blank' : '_self';
    });
    leftContent.append(desc);
  }
  if (linkWrapper.children.length) leftContent.append(linkWrapper);
  if (opcoBannerButtonUrl && opcoBannerButtonText) {
    leftContent.append(
      a(
        {
          href: opcoBannerButtonUrl,
          target: opcoBannerButtonTarget,
          class:
            'bg-danaherpurple-500 text-white rounded-[30px] px-[25px] py-[13px] shadow-sm hover:bg-danaherpurple-800',
        },
        opcoBannerButtonText
      )
    );
  }
  const left = div(
    { class: 'flex flex-col gap-6 md:w-1/2 p-6 items-start bg-white' },
    leftContent
  );
  // === CAROUSEL / RIGHT SECTION ===
  const slides = [];
  opcoBannerItems.forEach((item, i) => {
    const [
      itemTitle,
      itemSubHeading,
      itemDescription,
      itemImage,
      itemBgImage,
      itemButtonUrl,
      itemButtonNewTab,
      itemButtonLabel,
    ] = item.children;
    const title = itemTitle?.textContent?.trim() || '';
    const subHeading = itemSubHeading?.textContent?.trim() || '';
    const descriptionHTML = itemDescription?.innerHTML?.trim() || '';
    const imgElement = itemImage?.querySelector('img');
    const bgImgElement = itemBgImage?.querySelector('img');
    const ctaUrl = itemButtonUrl?.textContent?.trim() || '';
    const ctaLabel = itemButtonLabel?.textContent?.trim() || '';
    const ctaTarget =
      itemButtonNewTab?.textContent?.trim() === 'true' ? '_blank' : '_self';
    const content = div({
      class:
        'z-10 flex flex-col items-center justify-center gap-2 text-center max-w-[470px]',
    });
    if (imgElement) {
      content.append(
        img({
          src: imgElement.src,
          alt: title || 'Slide',
          class: bgImgElement ? 'opacity-0' : '',
        })
      );
    }
    if (title) {
      content.append(
        h2({ class: 'text-3xl font-medium text-black text-center' }, title)
      );
    }
    if (subHeading) {
      content.append(
        p({ class: 'text-xl font-medium text-black text-center' }, subHeading)
      );
    }
    if (descriptionHTML) {
      const descWrap = div();
      descWrap.innerHTML = descriptionHTML;
      descWrap.querySelectorAll('a').forEach((link) => {
        link.classList.add(
          'underline',
          'hover:text-white',
          'hover:bg-danaherpurple-500'
        );
        link.target = link.href.includes('http') ? '_blank' : '_self';
      });
      content.append(
        div({ class: 'text-base text-black text-center' }, descWrap)
      );
    }
    if (ctaLabel && ctaUrl) {
      content.append(
        button(
          {
            class:
              'bg-danaherpurple-500 text-white rounded-[30px] px-[25px] py-[13px] mt-4 hover:bg-danaherpurple-800',
            onclick: () => window.open(ctaUrl, ctaTarget),
          },
          ctaLabel
        )
      );
    }
    const overlay = div({
      class:
        'absolute top-0 w-full h-full bg-gradient-to-b from-black/0 to-black/95 hidden',
    });
    const slide = div(
      {
        id: `opcoBannerSlide${i}`,
        'data-index': i,
        class: `carousel-slide flex flex-col items-center w-full relative min-h-[600px] ${
          bgImgElement ? 'hasBg' : ''
        }`,
        style: i ? 'display:none;' : '',
      },
      content,
      overlay
    );
    if (bgImgElement) {
      slide.style.backgroundImage = `url('${bgImgElement.src}')`;
      slide.style.backgroundSize = 'cover';
      slide.style.backgroundPosition = 'center';
      overlay.classList.remove('hidden');
      slide
        .querySelectorAll('.text-center')
        .forEach((el) => (el.style.color = '#fff'));
    }
    slides.push(slide);
  });
  let currentIndex = 0;
  const numberIndicator = span(
    { class: 'text-base font-bold' },
    `1/${slides.length}`
  );
  const updateSlide = (dir) => {
    slides[currentIndex].style.display = 'none';
    currentIndex = (currentIndex + dir + slides.length) % slides.length;
    slides[currentIndex].style.display = 'flex';
    numberIndicator.textContent = `${currentIndex + 1}/${slides.length}`;
  };
  const controls =
    slides.length > 1
      ? div(
          { class: 'absolute bottom-6 flex gap-4' },
          button(
            { class: 'rounded-full p-2', onclick: () => updateSlide(-1) },
            span({ class: 'icon icon-arrow-left-icon' })
          ),
          numberIndicator,
          button(
            { class: 'rounded-full p-2', onclick: () => updateSlide(1) },
            span({ class: 'icon icon-arrow-right-icon' })
          )
        )
      : '';
  decorateIcons(controls);
  const right = div(
    { class: 'md:w-1/2 flex flex-col items-center relative' },
    ...slides,
    controls
  );
  // === FINAL WRAPPER ===
  block.innerHTML = ''; // safer than appending repeatedly
  block.append(
    div(
      {
        class: 'flex flex-col md:flex-row w-full border-b border-gray-300',
      },
      left,
      right
    )
  );
}

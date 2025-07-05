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

import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  // === clean up wrapper ===

  block?.parentElement?.parentElement?.removeAttribute('class');

  block?.parentElement?.parentElement?.removeAttribute('style');

  // === get block children ===

  const [
    bannerTitle,

    bannerHeading,

    bannerDescription,

    bannerImage,

    bannerButtonUrl,

    bannerButtonNewTab,

    bannerButtonLabel,

    ...carouselItems
  ] = block.children;

  // === build left section ===

  const left = div({ class: 'opco-banner-left flex flex-col gap-4' });

  moveInstrumentation(bannerTitle, left);

  if (bannerTitle) {
    const titleText = bannerTitle.textContent.trim();

    left.append(
      p({ class: 'text-danaherpurple-800 font-medium text-lg' }, titleText)
    );
  }

  const bannerImg = bannerImage?.querySelector('img');

  if (bannerImg) {
    left.append(
      img({
        src: bannerImg.src,

        alt: bannerImg.alt || '',

        class: 'w-[172px] mb-2 md:mb-8',
      })
    );
  }

  if (bannerHeading) {
    const headingText = bannerHeading.textContent.trim();

    left.append(h1({ class: 'text-4xl font-medium text-black' }, headingText));
  }

  if (bannerDescription) {
    const desc = div({ class: 'text-base text-black' });

    desc.innerHTML = bannerDescription.innerHTML;

    desc.querySelectorAll('p').forEach((el, i, arr) => {
      if (i !== arr.length - 1) el.classList.add('pb-4');

      if (!el.textContent.trim()) el.remove();
    });

    desc.querySelectorAll('a').forEach((link) => {
      link.classList.add(
        'underline',
        'hover:bg-danaherpurple-500',
        'hover:text-white'
      );

      link.target = link.href.includes('http') ? '_blank' : '_self';
    });

    left.append(desc);
  }

  // button

  const buttonUrl = bannerButtonUrl?.textContent?.trim();

  const buttonLabel = bannerButtonLabel?.textContent?.trim();

  const buttonTarget =
    bannerButtonNewTab?.textContent?.trim() === 'true' ? '_blank' : '_self';

  if (buttonUrl && buttonLabel) {
    left.append(
      a(
        {
          href: buttonUrl,

          target: buttonTarget,

          class:
            'bg-danaherpurple-500 text-white rounded-[30px] px-6 py-3 hover:bg-danaherpurple-800',
        },
        buttonLabel
      )
    );
  }

  // === brands links (like pills) ===

  const linksWrapper = div({ class: 'flex flex-wrap gap-2 mt-4' });

  const currentPath = window.location.href;

  if (
    currentPath.includes('products.html') ||
    currentPath.includes('/shop-page') ||
    currentPath.includes('/shop-home') ||
    currentPath.includes('/products-eds1.html')
  ) {
    try {
      const res = await fetch(
        'https://lifesciences.danaher.com/us/en/products-index.json'
      );

      const data = await res.json();

      const products = Array.isArray(data)
        ? data
        : data?.data || data?.results || [];

      const brandMap = new Map();

      products.forEach(({ brand, path }) => {
        if (brand && !brand.includes(',') && !brandMap.has(brand)) {
          brandMap.set(brand, path);
        }
      });

      [...brandMap.keys()].sort().forEach((brand) => {
        const brandSlug = /leica/i.test(brand)
          ? 'leica'
          : brand.toLowerCase().replace(/\s+/g, '-');

        linksWrapper.append(
          a(
            {
              href: `/us/en/products-eds1/brands/${brandSlug}`,

              class:
                'text-sm bg-danaherpurple-25 text-danaherpurple-800 px-4 py-1 rounded',
            },
            brand
          )
        );
      });

      left.append(linksWrapper);
    } catch (e) {
      console.error('brands fetch failed', e);
    }
  }

  // === build right slides ===

  const right = div({
    class: 'opco-banner-right relative flex flex-col items-center gap-4',
  });

  const slides = [];

  carouselItems.forEach((item, idx) => {
    moveInstrumentation(item, right);

    const [title, subhead, desc, imgWrap, bgWrap, btnUrl, btnTarget, btnLabel] =
      item.children;

    const slideContent = div({
      class: 'flex flex-col items-center gap-2 text-center',
    });

    if (title) {
      slideContent.append(
        h2(
          { class: 'text-3xl font-medium text-black' },
          title.textContent.trim()
        )
      );
    }

    if (subhead) {
      slideContent.append(
        p(
          { class: 'text-xl font-medium text-black' },
          subhead.textContent.trim()
        )
      );
    }

    if (desc) {
      const descDiv = div();

      descDiv.innerHTML = desc.innerHTML;

      descDiv.querySelectorAll('a').forEach((link) => {
        link.classList.add(
          'underline',
          'hover:bg-danaherpurple-500',
          'hover:text-white'
        );

        link.target = link.href.includes('http') ? '_blank' : '_self';
      });

      slideContent.append(descDiv);
    }

    const itemImg = imgWrap?.querySelector('img');

    if (itemImg) {
      slideContent.append(
        img({
          src: itemImg.src,

          alt: title?.textContent || '',

          class: 'w-[300px] h-[184px]',
        })
      );
    }

    const ctaUrl = btnUrl?.textContent?.trim();

    const ctaLabel = btnLabel?.textContent?.trim();

    const ctaTarget =
      btnTarget?.textContent?.trim() === 'true' ? '_blank' : '_self';

    if (ctaUrl && ctaLabel) {
      slideContent.append(
        button(
          {
            class:
              'bg-danaherpurple-500 text-white rounded-[30px] px-6 py-3 hover:bg-danaherpurple-800',

            onclick: () => window.open(ctaUrl, ctaTarget),
          },
          ctaLabel
        )
      );
    }

    const overlay = div({
      class:
        'absolute inset-0 bg-gradient-to-b from-transparent to-black/90 hidden',
    });

    const slide = div(
      {
        class: `carousel-slide relative flex flex-col items-center min-h-[600px] p-10 ${
          bgWrap?.querySelector('img') ? 'hasBg' : ''
        }`,

        style: idx === 0 ? '' : 'display: none;',
      },
      slideContent,
      overlay
    );

    // add background image

    const bgImg = bgWrap?.querySelector('img');

    if (bgImg) {
      slide.style.backgroundImage = `url(${bgImg.src})`;

      slide.style.backgroundSize = 'cover';

      overlay.classList.remove('hidden');
    }

    slides.push(slide);
  });

  // === build controls ===

  let currentIndex = 0;

  const numberIndicator = span(
    { class: 'text-base font-bold' },
    `1/${slides.length}`
  );

  const updateSlides = (dir) => {
    slides[currentIndex].style.display = 'none';

    currentIndex = (currentIndex + dir + slides.length) % slides.length;

    slides[currentIndex].style.display = 'flex';

    numberIndicator.textContent = `${currentIndex + 1}/${slides.length}`;

    if (slides[currentIndex].classList.contains('hasBg')) {
      numberIndicator.style.color = '#fff';
    } else {
      numberIndicator.style.color = '';
    }
  };

  const controls = div(
    { class: 'flex gap-4 mt-4' },

    button(
      { onclick: () => updateSlides(-1) },
      span({ class: 'icon icon-arrow-left-icon' })
    ),

    numberIndicator,

    button(
      { onclick: () => updateSlides(1) },
      span({ class: 'icon icon-arrow-right-icon' })
    )
  );

  decorateIcons(controls);

  if (slides.length > 1) right.append(...slides, controls);
  else right.append(...slides);

  // === assemble block ===

  const container = div(
    {
      class: 'opco-banner flex flex-col md:flex-row border-b border-gray-300',
    },
    left,
    right
  );

  block.textContent = '';

  block.append(container);
}

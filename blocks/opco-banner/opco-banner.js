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
  // === clean up the outer wrapper ===

  block?.parentElement?.parentElement?.removeAttribute('class');

  block?.parentElement?.parentElement?.removeAttribute('style');

  // === read main banner elements ===

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

  const bannerImg = bannerImage?.querySelector('img');

  const buttonLabel = bannerButtonLabel?.textContent?.trim() || '';

  const buttonTarget =
    bannerButtonNewTab?.textContent?.trim() === 'true' ? '_blank' : '_self';

  const buttonUrl = bannerButtonUrl?.textContent?.trim() || '';

  // === brands link filter ===

  const linkWrapper = div({ class: 'flex flex-wrap gap-2 max-w-[344px]' });

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

      [...brandMap.entries()]

        .sort(([a], [b]) => a.localeCompare(b))

        .forEach(([brand]) => {
          const brandSlug = /leica/i.test(brand)
            ? 'leica'
            : brand.toLowerCase().replace(/\s+/g, '-');

          linkWrapper.append(
            a(
              {
                href: `/us/en/products-eds1/brands/${brandSlug}`,

                target: '_self',

                class:
                  'text-sm text-danaherpurple-800 bg-danaherpurple-25 px-4 py-1',
              },
              brand
            )
          );
        });
    } catch (e) {
      console.error('Brands fetch failed', e);
    }
  }

  // === left section ===

  const left = div({ class: 'flex flex-col gap-4 max-w-[567px]' });

  if (bannerTitle) {
    left.append(
      p(
        { class: 'text-danaherpurple-800 font-medium text-lg' },
        bannerTitle.textContent.trim()
      )
    );
  }

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
    left.append(
      h1(
        { class: 'text-4xl text-black font-medium' },
        bannerHeading.textContent.trim()
      )
    );
  }

  if (bannerDescription) {
    const desc = div({ class: 'text-[18px] text-black' });

    desc.innerHTML = bannerDescription.innerHTML;

    desc.querySelectorAll('p').forEach((p, i, arr) => {
      if (i !== arr.length - 1) p.classList.add('pb-4');

      if (!p.textContent.trim()) p.remove();
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

  if (linkWrapper.childElementCount) left.append(linkWrapper);

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

  // === right slides section ===

  const slides = opcoBannerItems.map((item, idx) => {
    const [title, subhead, desc, imgWrap, bgWrap, btnUrl, btnTarget, btnLabel] =
      item.children;

    const itemImg = imgWrap?.querySelector('img');

    const itemBg = bgWrap?.querySelector('img');

    const cta = btnUrl?.textContent?.trim() || '';

    const ctaLabel = btnLabel?.textContent?.trim() || '';

    const ctaTarget =
      btnTarget?.textContent?.trim() === 'true' ? '_blank' : '_self';

    const content = div({
      class:
        'flex flex-col items-center justify-center text-center gap-2 max-w-[470px]',
    });

    if (itemImg) {
      content.append(
        img({
          src: itemImg.src,

          alt: title?.textContent || '',

          class: itemBg
            ? 'opacity-0 w-[300px] h-[184px]'
            : 'w-[300px] h-[184px]',
        })
      );
    }

    if (title) {
      content.append(
        h2(
          { class: 'text-3xl font-medium text-black' },
          title.textContent.trim()
        )
      );
    }

    if (subhead) {
      content.append(
        p(
          { class: 'text-xl font-medium text-black' },
          subhead.textContent.trim()
        )
      );
    }

    if (desc) {
      const descBlock = div();

      descBlock.innerHTML = desc.innerHTML;

      descBlock.querySelectorAll('a').forEach((link) => {
        link.classList.add(
          'underline',
          'hover:bg-danaherpurple-500',
          'hover:text-white'
        );

        link.target = link.href.includes('http') ? '_blank' : '_self';
      });

      content.append(div({ class: 'text-base text-black' }, descBlock));
    }

    if (cta && ctaLabel) {
      content.append(
        button(
          {
            class:
              'bg-danaherpurple-500 text-white rounded-[30px] px-6 py-3 mt-4 hover:bg-danaherpurple-800',

            onclick: () => window.open(cta, ctaTarget),
          },
          ctaLabel
        )
      );
    }

    const overlay = div({
      class:
        'absolute inset-0 bg-gradient-to-b from-transparent to-black/95 hidden',
    });

    const slide = div(
      {
        id: `opcoBannerSlide${idx}`,

        class: `carousel-slide relative flex flex-col items-center p-10 min-h-[600px] ${
          itemBg ? 'hasBg' : ''
        }`,

        style: idx === 0 ? '' : 'display: none;',
      },
      content,
      overlay
    );

    if (itemBg) {
      slide.style.backgroundImage = `url('${itemBg.src}')`;

      slide.style.backgroundSize = 'cover';

      slide.style.backgroundPosition = 'center';

      overlay.classList.remove('hidden');

      slide
        .querySelectorAll('.text-center')
        .forEach((el) => (el.style.color = '#fff'));
    }

    return slide;
  });

  // === controls ===

  let currentIndex = 0;

  const numberIndicator = span(
    { class: 'text-base font-bold' },
    `1/${slides.length}`
  );

  const updateSlides = (dir) => {
    slides[currentIndex].style.display = 'none';

    currentIndex = (currentIndex + dir + slides.length) % slides.length;

    slides[currentIndex].style.display = 'flex';

    const active = slides[currentIndex];

    if (active.classList.contains('hasBg')) {
      numberIndicator.style.color = '#fff';
    } else {
      numberIndicator.style.color = '';
    }

    numberIndicator.textContent = `${currentIndex + 1}/${slides.length}`;
  };

  const controls =
    slides.length > 1
      ? div(
          { class: 'absolute bottom-6 flex gap-4' },

          button(
            { class: 'rounded-full p-2', onclick: () => updateSlides(-1) },
            span({ class: 'icon icon-arrow-left-icon' })
          ),

          numberIndicator,

          button(
            { class: 'rounded-full p-2', onclick: () => updateSlides(1) },
            span({ class: 'icon icon-arrow-right-icon' })
          )
        )
      : '';

  decorateIcons(controls);

  // === final container ===

  const wrapper = div(
    {
      class: 'flex flex-col md:flex-row border-b border-gray-300',
    },

    div({ class: 'md:w-1/2 p-6' }, left),

    div(
      { class: 'md:w-1/2 relative flex flex-col items-center gap-6' },

      ...slides,

      controls
    )
  );

  block.innerHTML = '';

  block.append(wrapper);
}

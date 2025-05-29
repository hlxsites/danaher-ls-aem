import {
  div, span, img, p, a,
} from '../../scripts/dom-builder.js';

function toggleDetails(event) {
  const detailsText = event.target.previousElementSibling;
  const isCollapsed = detailsText.classList.contains('line-clamp-6');

  if (isCollapsed) {
    detailsText.classList.remove('line-clamp-6');
    event.target.textContent = 'Read Less';
  } else {
    detailsText.classList.add('line-clamp-6');
    event.target.textContent = 'Read More';
  }
}

export default function decorate(block) {
  // Remove any default top margin or padding on the block
  block.classList.add('mt-0', 'pt-0');

  const categoryHeading = block.querySelector('[data-aue-prop="heading"]')?.textContent || '';
  const btnText = block.querySelector('[data-aue-prop="button_text"]')?.textContent || '';
  const btnLink = block.querySelector('div *:not([data-aue-label]) a')?.textContent.trim() || '#';
  const rawCategoryDescription = block.querySelector('[data-aue-prop="short_description"]')?.innerHTML || '';
  const details = block.querySelector('[data-aue-prop="long_desc"]')?.textContent || '';
  const detailsLink = 'Read More';
  const image = block.querySelector('img');
  const alt = image?.getAttribute('alt') || 'category image';

  const categoryBanner = div({
    class: 'category_banner flex flex-col lg:flex-row gap-x-4 gap-y-6 pt-12 lg:pt-0',
  });

  const categoryBannerLeft = div({
    class: 'basis-1/2 pt-6 md:pt-12 flex flex-col justify-start gap-6',
  });

  const categoryBannerRight = div({
    class: 'category_banner-right basis-1/2 relative flex flex-col gap-y-6 justify-center items-center',
  });

  const categoryBannerTitle = p(
    {
      class: 'text-black text-4xl font-normal leading-[48px]',
    },
    categoryHeading,
  );
  const categoryBannerCta = div(
    {
      class: 'inline-flex justify-start items-start gap-4',
    },
    a(
      {
        class: 'px-6 py-3 bg-violet-600 rounded-[30px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center overflow-hidden',
        href: btnLink,
      },
      div(
        {
          class: 'text-right justify-start text-white text-base font-normal leading-snug',
        },
        btnText,
      ),
    ),
  );

  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = rawCategoryDescription;

  tempContainer.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add('text-black');
  });

  tempContainer.querySelectorAll('a').forEach((link) => {
    link.classList.add('text-violet-600', 'mt-8', 'font-medium', 'hover:underline');
  });

  const categoryBannerDescription = div({
    class: 'category_banner-description text-base font-extralight leading-snug mt-0', // Ensure no extra top margin
  });
  categoryBannerDescription.innerHTML = tempContainer.innerHTML;

  const categoryBannerIcon = div(
    { class: 'bg-gray-50 h-[265px] lg:h-[400px] flex items-center' },
    img({
      src: image?.src || '',
      alt,
      class: 'w-full h-full object-contain',
    }),
  );
  const categoryBannerDetails = div(
    {
      class: 'category_banner-details w-full justify-start',
    },
    span(
      {
        class: 'text-black text-base font-extralight leading-snug line-clamp-6',
      },
      details,
    ),
    span(
      {
        class: 'text-violet-600 text-base font-bold leading-snug cursor-pointer',
        onclick: toggleDetails,
      },
      detailsLink,
    ),
  );

  categoryBannerLeft.append(categoryBannerTitle, categoryBannerCta, categoryBannerDescription);
  categoryBannerRight.append(categoryBannerIcon, categoryBannerDetails);

  categoryBanner.append(categoryBannerLeft, categoryBannerRight);
  block.innerHTML = '';
  block.appendChild(categoryBanner);

  const lineBr = div({
    class: 'w-full h-px bg-gray-400 mt-10',
  });
  block.append(lineBr);
}

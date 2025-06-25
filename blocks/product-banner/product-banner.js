import {
  div, span, img, a, h1,
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

export default function productBannerDecorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const productBannerWrapper = div({
    class:
      'flex flex-col md:flex-row gap-6 max-w-[1358px] mx-auto px-5 md:px-[39px]',
  });

  const categoryHeading = block.querySelector('[data-aue-prop="heading"]')?.textContent || '';
  const btnText = block.querySelector('[data-aue-prop="button_text"]')?.textContent || '';
  const btnLink = block.querySelector('div *:not([data-aue-label]) a')?.textContent.trim()
    || '#';
  const rawCategoryDescription = block.querySelector('[data-aue-prop="short_description"]')?.innerHTML || '';
  const details = block.querySelector('[data-aue-prop="long_desc"]')?.innerHTML || '';

  const detailsLink = 'Read More';
  const image = block.querySelector('img');
  const alt = image?.getAttribute('alt') || 'category image';

  // Check if details is non-empty (not just whitespace)
  const hasDetails = details?.trim().length > 0;

  // Check if image exists and has a valid src
  const hasImage = image && image.src && image.src.trim() !== '';

  const categoryBanner = div({
    class:
      'category_banner flex flex-col lg:flex-row gap-x-6 gap-y-6 pt-12 lg:pt-0',
  });

  const categoryBannerLeft = div({
    class:
      'lg:min-w-[608px] basis-1/2 pt-6 md:pt-12 flex flex-col justify-start gap-6',
  });

  const categoryBannerRight = div({
    class:
      'category_banner-right lg:min-w-[608px] basis-1/2 relative flex flex-col gap-y-6 justify-center items-center',
  });

  const categoryBannerTitle = h1(
    {
      class: 'text-black text-4xl font-bold leading-[48px]',
    },
    categoryHeading,
  );

  if (btnText && btnLink) {
    const categoryBannerCta = button(
      {
        class:
          'max-w-max bg-danaherpurple-500 text-danaherpurple-800 text-white text-sm font-medium rounded-[30px] px-[25px] py-[13px] shadow-sm hover:opacity-90 transition',
        onclick: () => window.open(
          btnLink,
          btnLink?.includes('http') ? '_blank' : '_self',
        ),
      },
      btnText.replace(/<[^>]*>/g, '') || '',
    );
    categoryBannerLeft.append(categoryBannerCta);
  }

  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = rawCategoryDescription;

  tempContainer.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add('text-black');
    // Add pb-4 if the paragraph contains an <a> tag
    if (paragraph.querySelector('a')) {
      paragraph.classList.add('pb-4');
    }
  });

  tempContainer.querySelectorAll('a').forEach((link) => {
    // Remove any class that starts with 'btn'
    [...link.classList].forEach((cls) => {
      if (cls === 'btn' || cls.startsWith('btn-')) {
        link.classList.remove(cls);
      }
    });

    // Add the new classes
    link.classList.add('text-violet-600', 'mt-8', 'gap-4', 'font-bold');
  });

  const categoryBannerDescription = div({
    class:
      'category_banner-description text-base font-extralight leading-snug mt-0',
  });
  categoryBannerDescription.innerHTML = tempContainer.innerHTML;

  const categoryBannerIcon = div(
    {
      class: hasImage
        ? 'bg-gray-50 w-full h-[265px] lg:h-[400px] flex justify-center items-center'
        : '',
    },
    hasImage
      ? div(
        { class: 'flex justify-center items-center w-11/12 h-11/12' },
        img({
          src: image.src,
          alt,
          class: 'object-contain',
        }),
      )
      : '',
  );

  // Conditionally create categoryBannerDetails only if details exist
  let categoryBannerDetails;
  if (hasDetails) {
    categoryBannerDetails = div(
      {
        class: 'category_banner-details justify-start',
      },
      span({
        class:
          'long-description text-black text-base font-extralight leading-snug line-clamp-6',
      }),
      span(
        {
          class:
            'text-violet-600 text-base font-bold leading-snug cursor-pointer',
          onclick: toggleDetails,
        },
        detailsLink,
      ),
    );
    const longDescription = categoryBannerDetails.querySelector('.long-description');
    longDescription.innerHTML = details;
    longDescription.querySelectorAll('strong').forEach((strong) => {
      strong.classList.add('text-violet-600', 'font-bold');
    });
  }

  if (
    categoryBannerCta.querySelector('.text-right').textContent.trim().length > 0
  ) {
    categoryBannerLeft.append(
      categoryBannerTitle,
      categoryBannerCta,
      categoryBannerDescription,
    );
  } else {
    categoryBannerLeft.append(categoryBannerTitle, categoryBannerDescription);
  }

  if (hasImage) {
    categoryBannerRight.append(categoryBannerIcon);
  }
  if (hasDetails) {
    categoryBannerRight.append(categoryBannerDetails);
  }
  categoryBanner.append(categoryBannerLeft, categoryBannerRight);
  productBannerWrapper.appendChild(categoryBanner);
  block.innerHTML = '';
  block.appendChild(productBannerWrapper);
}

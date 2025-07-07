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
<<<<<<< HEAD

  const [
    productBannerTitle,
    productBannerLink,
    productBannerLinkTarget,
    productBannerHeading,
  ] = block.children;
  const categoryHeading = productBannerTitle?.textContent.trim() || '';
  const btnText = productBannerLink?.textContent.trim() || '';
  const btnLink = productBannerLinkTarget?.textContent?.trim();
  const rawCategoryDescription = productBannerHeading?.innerHTML.trim() || '';
  const details = block.children[5]?.querySelector('div')?.innerHTML?.trim() || '';
  const detailsLink = 'Read More';
  const image = block?.querySelector('img');
  const alt = image?.getAttribute('alt') || categoryHeading;

  // Render the inner div's content if it exists

  // Add smooth scroll behavior to the html tag
  document.documentElement.style.scrollBehavior = 'smooth';
=======
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  const productBannerWrapper = div({
    class:
      'flex flex-col md:flex-row gap-6 max-w-[1358px] mx-auto px-5 md:px-[39px]',
  });

<<<<<<< HEAD
  // Check if details is non-empty (not just whitespace)
  const hasDetails = details?.trim().length > 0;

  // Check if image exists and has a valid src
  const hasImage = image && image.src && image.src.trim() !== '';
=======
  const categoryHeading = block.querySelector('[data-aue-prop="heading"]')?.textContent || '';
  const btnText = block.querySelector('[data-aue-prop="button_text"]')?.textContent || '';
  const btnLink = block.querySelector('div *:not([data-aue-label]) a')?.textContent.trim()
    || '#';
  const rawCategoryDescription = block.querySelector('[data-aue-prop="short_description"]')?.innerHTML || '';
  const details = block.querySelector('[data-aue-prop="long_desc"]')?.innerHTML || '';

  const detailsLink = 'Read More';
  const image = block.querySelector('img');
  const alt = image?.getAttribute('alt') || 'category image';
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a

  const categoryBanner = div({
    class:
      'category_banner flex flex-col lg:flex-row gap-x-6 gap-y-6 pt-12 lg:pt-0',
  });

  const categoryBannerLeft = div({
<<<<<<< HEAD
    class:
      'lg:min-w-[608px] basis-1/2 pt-6 md:pt-12 flex flex-col justify-start gap-6',
=======
    class: 'basis-1/2 pt-6 md:pt-12 flex flex-col justify-start gap-6',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  });

  const categoryBannerRight = div({
    class:
<<<<<<< HEAD
      'category_banner-right lg:min-w-[608px] basis-1/2 relative flex flex-col gap-y-6 justify-center items-center',
=======
      'category_banner-right basis-1/2 relative flex flex-col gap-y-6 justify-center items-center',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  });

  const categoryBannerTitle = h1(
    {
<<<<<<< HEAD
      class: 'text-black text-4xl font-bold leading-[48px]}',
=======
      class: 'text-black text-4xl font-bold leading-[48px]',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
    },
    categoryHeading,
  );
  const categoryBannerCta = div(
    {
      class: 'inline-flex justify-start items-start gap-4',
    },
    a(
      {
        class:
<<<<<<< HEAD
          'px-6 py-3 bg-danaherpurple-500 hover:bg-danaherpurple-800 rounded-[30px] flex justify-center items-center overflow-hidden',
=======
          'px-6 py-3 bg-violet-600 rounded-[30px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center overflow-hidden',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        href: btnLink,
      },
      div(
        {
          class:
<<<<<<< HEAD
            'text-right justify-start text-white text-base font-medium leading-snug transition}',
=======
            'text-right justify-start text-white text-base font-normal leading-snug',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
        },
        btnText,
      ),
    ),
  );

  const tempContainer = document.createElement('div');
<<<<<<< HEAD

  tempContainer.innerHTML = rawCategoryDescription;
  tempContainer.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add('text-black');
=======
  tempContainer.innerHTML = rawCategoryDescription;

  tempContainer.querySelectorAll('p').forEach((paragraph) => {
    paragraph.classList.add('text-black');
    // Add pb-4 if the paragraph contains an <a> tag
    if (paragraph.querySelector('a')) {
      paragraph.classList.add('pb-4');
    }
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  });

  tempContainer.querySelectorAll('a').forEach((link) => {
    // Remove any class that starts with 'btn'
    [...link.classList].forEach((cls) => {
      if (cls === 'btn' || cls.startsWith('btn-')) {
        link.classList.remove(cls);
      }
    });

    // Add the new classes
<<<<<<< HEAD
    link.classList.add(
      'text-danaherpurple-500',
      'hover:text-danaherpurple-800',
      'mt-8',
      'gap-4',
      'font-bold',
    );
=======
    link.classList.add('text-violet-600', 'mt-8', 'gap-4', 'font-bold');
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  });

  const categoryBannerDescription = div({
    class:
      'category_banner-description text-base font-extralight leading-snug mt-0',
  });
  categoryBannerDescription.innerHTML = tempContainer.innerHTML;

  const categoryBannerIcon = div(
    {
<<<<<<< HEAD
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
            'read-more text-danaherpurple-500 hover:text-danaherpurple-800 text-base font-bold leading-snug cursor-pointer hidden',
          onclick: toggleDetails,
        },
        detailsLink,
      ),
    );
    const longDescription = categoryBannerDetails.querySelector('.long-description');
    longDescription.innerHTML = details;

    const paragraphs = longDescription.querySelectorAll('p');
    paragraphs.forEach((p) => {
      p.classList.add('mb-3');
    });
    if (paragraphs.length > 0) {
      paragraphs[paragraphs.length - 1].classList.remove('mb-3');
    }

    longDescription.querySelectorAll('strong').forEach((strong) => {
      // If <strong> contains an <a>, style the <a>
      const anchor = strong.querySelector('a');
      if (anchor) {
        anchor.classList.add(
          'text-black',
          'underline',
          'decoration-danaherpurple-500',
          'hover:bg-danaherpurple-500',
          'hover:text-white',
        );
      } else {
        strong.classList.add('text-black');
      }
    });

    // Estimate if content is likely to be truncated based on length
    const { textContent } = longDescription;
    const approxCharsPerLine = 60;
    const estimatedLines = textContent.length / approxCharsPerLine;
    const isTruncated = estimatedLines > 6;
    const readMoreLink = categoryBannerDetails.querySelector('.read-more');
    readMoreLink.style.display = isTruncated ? 'inline-block' : 'none';
  }

=======
      class:
        'bg-gray-50 w-full  h-[265px] lg:h-[400px] flex justify-center items-center',
    },
    div(
      { class: 'flex justify-center items-center w-11/12 h-11/12' },
      img({
        src: image?.src || '',
        alt,
        class: 'object-contain',
      }),
    ),
  );
  const categoryBannerDetails = div(
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

  categoryBannerDetails.querySelector('.long-description').innerHTML = details;
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
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
<<<<<<< HEAD

  if (hasImage) {
    categoryBannerRight.append(categoryBannerIcon);
  }
  if (hasDetails) {
    categoryBannerRight.append(categoryBannerDetails);
  }
=======
  categoryBannerRight.append(categoryBannerIcon, categoryBannerDetails);
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  categoryBanner.append(categoryBannerLeft, categoryBannerRight);
  productBannerWrapper.appendChild(categoryBanner);
  block.innerHTML = '';
  block.appendChild(productBannerWrapper);
<<<<<<< HEAD

  block
    .querySelector('.category_banner-description')
    ?.querySelectorAll('a')
    ?.forEach((aEle, index) => {
      if (index === 0) aEle.parentElement.classList.add('pt-4');
      aEle.parentElement.classList.add('pb-4');
    });
=======
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
}

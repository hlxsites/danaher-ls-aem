import {
  div, a, input, span, img,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateModals, makePublicUrl } from '../../scripts/scripts.js';

/**
 * Renders a product card in list view with responsive layout for mobile and desktop.
 * @param {Object} item - Product data containing title, images, price, etc.
 * @returns {HTMLElement} - The rendered list card element.
 */
export default function renderProductListCard(item) {
  const card = div({
    class:
      'w-963px outline outline-1 outline-gray-300 flex flex-col md:flex-row justify-start items-start mx-5 lg:mx-0',
  });

  const fallbackImagePath = '/content/dam/danaher/products/fallbackImage.jpeg';

  // Create image with fallback functionality
  const createImageWithFallback = (src, alt) => {
    const imageElement = img({
      class:
        'md:w-full w-[100px] h-[100px] left-0 top-0 absolute border border-gray-200 object-contain',
      src: src || fallbackImagePath,
      alt: alt || 'Product image',
    });

    imageElement.addEventListener('error', () => {
      imageElement.src = fallbackImagePath;
      imageElement.alt = 'Product image not available';
    });

    return imageElement;
  };

  // Left Section: Image and Content (Mobile and Desktop)
  const leftSection = div({
    class:
      'flex-1 self-stretch p-4 bg-white flex flex-col md:flex-row justify-start items-stretch gap-4',
  });

  // Image Section (used in both mobile and desktop)
  const imageSection = div({
    class:
      'w-[100px] h-[100px] inline-flex flex-col justify-start items-center gap-3',
  });

  const imageWrapper = div({
    class: 'self-stretch relative rounded-md',
  });

  const imageUrl = item.raw?.images?.[0] || '';
  imageWrapper.append(
    div({
      class: 'md:w-full left-0 top-0 absolute bg-white rounded-md',
    }),
    createImageWithFallback(imageUrl, item.title || ''),
  );

  imageSection.append(imageWrapper);

  // Mobile View: Image on Left, Title on Right, Description Below
  const mobileContentSection = div({
    class: 'md:hidden w-full flex flex-col justify-start items-start gap-3',
  });

  const mobileTitleAndImage = div({
    class: 'flex flex-row justify-start items-start gap-4 w-full',
  });

  const mobileTitleSection = div({
    class: 'flex-1 flex flex-col justify-start items-start gap-1',
  });

  mobileTitleSection.append(
    div(
      {
        class: 'text-black font-medium leading-7 line-clamp-2 text-xl',
      },
      (item.title || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  // Swap positions: image on the left, title on the right
  mobileTitleAndImage.append(imageSection, mobileTitleSection);

  const mobileDescSection = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-3',
  });

  // Conditionally render description only if it exists and is non-empty
  mobileDescSection.append(
    div(
      {
        class:
          'self-stretch text-black text-base font-extralight leading-snug line-clamp-4',
      },
      (item?.raw?.description || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  mobileDescSection.append(
    a(
      {
        href: makePublicUrl(item.path || item.clickUri),
        class:
          'group text-danaherpurple-500 hover:text-danaherpurple-800 flex text-base font-bold leading-snug',
      },
      'View Details',
      span({
        class:
          'icon icon-arrow-right !size-5 pl-1.5 fill-current [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800',
      }),
    ),
  );

  decorateIcons(mobileDescSection);
  mobileContentSection.append(mobileTitleAndImage, mobileDescSection);

  // Desktop View: Image on Left, Content on Right
  const desktopContentSection = div({
    class:
      'hidden md:flex flex-1 flex-col justify-start items-start gap-3 min-h-full',
  });

  const desktopTitle = div(
    { class: 'text-black font-medium leading-7 text-xl line-clamp-2' },
    (item.title || '').trim().replace(/<[^>]*>/g, ''),
  );

  const desktopDescSection = div(
    {
      class:
        'self-stretch text-black text-base font-extralight leading-snug line-clamp-4',
    },
    (item?.raw?.description || '').trim().replace(/<[^>]*>/g, ''),
  );

  // Add a spacer div to push the view details to the bottom
  const spacer = div({ class: 'flex-1' });

  const desktopviewdetail = a(
    {
      href: makePublicUrl(item.path || item.clickUri),
      class:
        'group text-danaherpurple-500 hover:text-danaherpurple-800 text-base font-bold flex leading-snug mt-auto',
    },
    'View Details',
    span({
      class:
        'icon icon-arrow-right !size-5 pl-1.5 fill-current [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800',
    }),
  );

  decorateIcons(desktopviewdetail);

  desktopContentSection.append(
    desktopTitle,
    desktopDescSection,
    spacer,
    desktopviewdetail,
  );

  // Create desktop image section with fallback
  const desktopImageSection = div({
    class:
      'w-[100px] h-[100px] inline-flex flex-col justify-start items-center gap-3',
  });

  const desktopImageWrapper = div({
    class: 'self-stretch relative rounded-md',
  });

  desktopImageWrapper.append(
    div({
      class: 'md:w-full left-0 top-0 absolute bg-white rounded-md',
    }),
    createImageWithFallback(imageUrl, item.title || ''),
  );

  desktopImageSection.append(desktopImageWrapper);

  leftSection.append(
    div({ class: 'hidden md:flex' }, desktopImageSection),
    mobileContentSection,
    desktopContentSection,
  );

  // Right Section: Pricing and Action Buttons (Visible on both Mobile and Desktop)
  const rightSection = div({
    class: 'w-full md:w-64 p-4 bg-gray-50 flex flex-col gap-4',
  });

  const price = item.salePrice?.value || 99999.99;
  const availability = item.availability || 78;
  const uom = item.packingUnit || '1/Bundle';
  const minQty = item.minOrderQuantity || 1;

  const pricingDetails = div(
    { class: 'flex flex-col gap-2' },
    div(
      { class: 'text-right text-black text-2xl font-medium leading-loose' },
      `$${price.toLocaleString()}`,
    ),
    div(
      { class: 'flex justify-between items-center w-full' },
      div(
        { class: 'text-black text-sm font-extralight leading-snug' },
        'Availability:',
      ),
      div(
        { class: 'text-black text-sm font-extralight leading-snug' },
        availability,
        span(
          { class: 'text-black text-sm font-bold leading-snug' },
          ' Available',
        ),
      ),
    ),
    div(
      { class: 'flex justify-between items-center w-full' },
      div(
        { class: 'text-black text-sm font-extralight leading-snug' },
        'Unit of Measure:',
      ),
      div({ class: 'text-black text-sm font-bold leading-snug' }, uom),
    ),
    div(
      { class: 'flex justify-between items-center w-full' },
      div(
        { class: 'text-black text-sm font-extralight leading-snug' },
        'Min. Order Qty:',
      ),
      div({ class: 'text-black text-sm font-bold leading-snug' }, minQty),
    ),
  );

  const actionButtons = div(
    { class: 'flex flex-col gap-2' },
    div(
      { class: 'flex items-center gap-2' },
      input({
        type: 'number',
        value: '1',
        min: '1',
        class:
          'w-14 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-medium leading-normal text-center [&::-webkit-inner-spin-button]:mr-2',
      }),
      a(
        {
          href: makePublicUrl(item.path || item.clickUri),
          class:
            'w-20 px-4 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 rounded-[20px] flex justify-center items-center overflow-hidden',
        },
        span({ class: 'text-white text-base font-medium leading-snug' }, 'Buy'),
      ),
      div(
        {
          class:
            'show-modal-btn cursor-pointer text-danaherpurple-500 hover:text-white hover:bg-danaherpurple-500 w-20 px-4 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 flex justify-center items-center overflow-hidden',
        },
        span({ class: 'inherit text-base font-medium leading-snug' }, 'Quote'),
      ),
    ),
  );

  rightSection.append(pricingDetails, actionButtons);

  // Assemble the card
  card.append(leftSection, rightSection);

  decorateModals(card);

  return card;
}

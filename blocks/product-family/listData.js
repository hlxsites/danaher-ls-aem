import {
  div, a, input, span, img,
} from '../../scripts/dom-builder.js';
import { decorateModals, makePublicUrl } from '../../scripts/scripts.js';

/**
 * Renders a product card in list view with responsive layout for mobile and desktop.
 * @param {Object} item - Product data containing title, images, price, etc.
 * @returns {HTMLElement} - The rendered list card element.
 */
export default function renderProductListCard(item) {
  const card = div({
    class: 'w-full outline outline-1 outline-gray-300 flex flex-col md:flex-row justify-start items-start',
  });

  // Left Section: Image and Content (Mobile and Desktop)
  const leftSection = div({
    class: 'flex-1 self-stretch p-4 bg-white flex flex-col md:flex-row justify-start items-start gap-4',
  });

  // Image Section (used in both mobile and desktop)
  const imageSection = div({
    class: 'w-16 md:w-64 inline-flex flex-col justify-start items-center gap-3',
  });

  const imageWrapper = div({
    class: 'self-stretch h-16 md:h-32 relative rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300',
  });

  const imageUrl = item.raw?.images?.[0] || '';
  imageWrapper.append(
    div({
      class: 'w-16 h-16 md:w-full md:h-32 left-0 top-0 absolute bg-white rounded-md',
    }),
    img({
      class: 'w-16 h-16 md:w-full md:h-32 left-0 top-0 absolute rounded-md border border-gray-200 object-cover',
      src: imageUrl,
      alt: item.title || '',
    }),
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
      { class: 'self-stretch text-black text-lg font-normal leading-7 line-clamp-2' },
      (item.title || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  // Swap positions: image on the left, title on the right
  mobileTitleAndImage.append(imageSection, mobileTitleSection);

  const mobileDescSection = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-3',
  });

  // Conditionally render description only if it exists and is non-empty
  if (item.description && typeof item.description === 'string' && item.description.trim() !== '') {
    mobileDescSection.append(
      div(
        { class: 'self-stretch text-gray-700 text-base font-extralight leading-snug line-clamp-3' },
        (item.description || '').trim().replace(/<[^>]*>/g, ''),
      ),
    );
  }

  mobileDescSection.append(
    a(
      { href: makePublicUrl(item.path || item.clickUri), class: 'text-violet-600 text-base font-bold leading-snug' },
      'View Details →',
    ),
  );

  mobileContentSection.append(mobileTitleAndImage, mobileDescSection);

  // Desktop View: Image on Left, Content on Right
  const desktopContentSection = div({
    class: 'hidden md:flex flex-1 flex-col justify-between items-start gap-3',
  });

  const desktopTitle = div(
    { class: 'self-stretch text-black text-lg font-normal leading-7' },
    (item.title || '').trim().replace(/<[^>]*>/g, ''),
  );

  desktopContentSection.append(desktopTitle);

  leftSection.append(
    div({ class: 'hidden md:flex' }, imageSection.cloneNode(true)), // Clone for desktop
    mobileContentSection,
    desktopContentSection,
  );

  // Right Section: Pricing and Action Buttons (Visible on both Mobile and Desktop)
  const rightSection = div({
    class: 'w-full md:w-64 p-4 bg-gray-50 flex flex-col gap-4',
  });

  const price = item.salePrice?.value || 99999.99;
  const uom = item.packingUnit || '1/Bundle';
  const minQty = item.minOrderQuantity || 1;

  const pricingDetails = div(
    { class: 'flex flex-col gap-2' },
    div(
      { class: 'text-right text-black text-2xl font-normal leading-loose' },
      `$${price.toLocaleString()}`,
    ),
    div(
      { class: 'flex justify-between items-center w-full' },
      div({ class: 'text-black text-sm font-extralight leading-snug' }, 'Unit of Measure:'),
      div({ class: 'text-black text-sm font-bold leading-snug' }, uom),
    ),
    div(
      { class: 'flex justify-between items-center w-full' },
      div({ class: 'text-black text-sm font-extralight leading-snug' }, 'Min. Order Qty:'),
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
        class: 'w-14 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-normal leading-normal text-center',
      }),
      a(
        {
          href: makePublicUrl(item.path || item.clickUri),
          class: 'w-20 px-4 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span({ class: 'text-white text-base font-normal leading-snug' }, 'Buy'),
      ),
      div(
        {
          class: 'show-modal-btn cursor-pointer w-20 px-4 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span({ class: 'text-violet-600 text-base font-normal leading-snug' }, 'Quote'),
      ),
    ),
    div(
      { class: 'w-full text-center md:hidden' },
      a(
        { href: makePublicUrl(item.path || item.clickUri), class: 'text-violet-600 text-base font-bold leading-snug' },
        'View Details →',
      ),
    ),
  );

  rightSection.append(pricingDetails, actionButtons);

  // Assemble the card
  card.append(leftSection, rightSection);

  // Add fallback for image if it fails to load
  const imgElement = card.querySelector('img');
  if (imgElement) {
    imgElement.onerror = () => {
      if (!imgElement.getAttribute('data-fallback-applied')) {
        imgElement.src = 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
        imgElement.setAttribute('data-fallback-applied', 'true');
      }
    };
  }

  decorateModals(card);

  return card;
}

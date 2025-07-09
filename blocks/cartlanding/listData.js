import {
  div, img, a, button, input, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateModals } from '../../scripts/scripts.js';
// Helper function to create a badge based on item.carrierFree
function createCarrierFreeBadge(carrierFreeText) {
  return div(
    {
      class:
        'px-4 py-1 bg-violet-50 inline-flex justify-center items-center gap-2.5',
    },
    div(
      {
        class:
          'text-center justify-start text-violet-600 text-sm font-normal leading-tight',
      },
      carrierFreeText,
    ),
  );
}

/**
 * Renders a product card in list view with responsive layout for mobile and desktop.
 * @param {Object} item - Product data containing title, url, images, description, price, etc.
 * @returns {HTMLElement} - The rendered list card element.
 */
export default function renderListCard(item) {
  const imageUrl = item?.images?.[0]
    || 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
  const card = div({
    class:
      'self-stretch w-full outline outline-1 outline-gray-300 inline-flex flex-col md:flex-row justify-start items-center',
  });

  const leftSection = div({
    class:
      'flex-1 self-stretch p-6 bg-white flex flex-col md:flex-row justify-start items-start gap-6',
  });

  const imageSection = div({
    class: 'w-16 md:w-24 inline-flex flex-col justify-start items-center gap-3',
  });

  const imageWrapper = div({
    class:
      'self-stretch h-16 md:h-24 relative rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300',
  });

  imageWrapper.append(
    div({
      class:
        'w-16 h-16 md:w-24 md:h-24 left-0 top-0 absolute bg-white rounded-md',
    }),
    a(
      { title: item.title },
      img({
        class:
          'w-16 h-16 md:w-24 md:h-24 left-0 top-0 absolute rounded-md border border-gray-200 object-contain',
        src: imageUrl,
        alt: item.title || '',
      }),
    ),
  );

  imageSection.append(imageWrapper);

  // Mobile View: Title/Badge on the left, Image on the right
  const mobileContentSection = div({
    class: 'flex flex-row md:hidden justify-start items-start gap-6',
  });

  const mobileTitleSection = div({
    class: 'flex-1 flex flex-col justify-start items-start gap-1',
  });

  const mobileTitleWrapper = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-1',
  });

  mobileTitleWrapper.append(
    ...(item.carrierFree ? [createCarrierFreeBadge(item.carrierFree)] : []),
    div(
      {
        class:
          'self-stretch justify-start text-black text-xl font-normal leading-7 line-clamp-2',
      },
      (item.title || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  mobileTitleSection.append(mobileTitleWrapper);
  mobileContentSection.append(mobileTitleSection, imageSection);

  const mobileDescSection = div({
    class:
      'self-stretch flex flex-col justify-start items-start gap-3 md:hidden',
  });

  mobileDescSection.append(
    div(
      { class: 'self-stretch inline-flex justify-start items-center gap-3' },
      div(
        { class: 'flex-1 inline-flex flex-col justify-start items-start' },
        div(
          {
            class:
              'self-stretch justify-start text-gray-700 text-base font-extralight leading-snug line-clamp-3',
          },
          (item.description || '').trim().replace(/<[^>]*>/g, ''),
        ),
      ),
    ),
    a(
      {
        href: item.url,
        title: item.title,
        class:
          'self-stretch justify-start text-violet-600 text-base font-bold leading-snug',
      },
      'View Details',
      span({
        class:
          'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
  );
  decorateIcons(mobileDescSection);

  // Desktop View: Image on the left, content on the right
  const desktopContentSection = div({
    class:
      'hidden md:flex flex-1 h-44 flex-col justify-between items-start gap-3',
  });

  const desktopTitleAndDesc = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-3',
  });

  const desktopTitleWrapper = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-1',
  });

  desktopTitleWrapper.append(
    div(
      { class: 'self-stretch flex flex-col justify-start items-start gap-1' },
      ...(item.carrierFree ? [createCarrierFreeBadge(item.carrierFree)] : []),
      div(
        {
          class:
            'self-stretch justify-start text-black text-xl font-normal leading-7',
        },
        (item.title || '').trim().replace(/<[^>]*>/g, ''),
      ),
    ),
  );

  desktopTitleAndDesc.append(
    desktopTitleWrapper,
    div(
      { class: 'self-stretch inline-flex justify-start items-center gap-3' },
      div(
        { class: 'flex-1 inline-flex flex-col justify-start items-start' },
        div(
          {
            class:
              'self-stretch justify-start text-gray-700 text-base font-extralight leading-snug line-clamp-3',
          },
          (item.description || '').trim().replace(/<[^>]*>/g, ''),
        ),
      ),
    ),
  );

  // Bottom section with View Details link - SEPARATED
  const desktopViewDetails = div(
    { class: 'w-full flex-col gap-2' },
    a(
      {
        title: item.title,
        class:
          'self-stretch justify-start text-violet-600 text-base font-bold leading-snug',
      },
      'View Details',
      span({
        class:
          'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
  );

  decorateIcons(desktopViewDetails);
  desktopContentSection.append(desktopTitleAndDesc, desktopViewDetails);
  leftSection.append(
    imageSection,
    mobileContentSection,
    mobileDescSection,
    desktopContentSection,
  );

  let rightSection;
  if (item.showCart && item.price !== undefined) {
    rightSection = div({
      class:
        'self-stretch w-full md:w-80 p-6 bg-gray-50 inline-flex flex-col justify-start items-end gap-4',
    });

    const price = div(
      {
        class: 'w-64 text-right justify-start text-black text-2xl font-normal',
      },
      `$${item.price.toLocaleString()}.00`,
    );

    const pricingDetails = div({ class: 'w-64 flex flex-col gap-1' });
    pricingDetails.append(
      div(
        { class: 'flex justify-between items-center' },
        div(
          { class: 'text-black text-base font-extralight leading-snug' },
          'Availability:',
        ),
        div(
          { class: 'text-black text-base font-bold leading-snug' },
          `${item?.availability || ''} Available`,
        ),
      ),
      div(
        { class: 'flex justify-between items-center' },
        div(
          { class: 'text-black text-base font-extralight leading-snug' },
          'Unit of Measure:',
        ),
        div(
          { class: 'text-black text-base font-bold leading-snug' },
          item?.uom || '',
        ),
      ),
      div(
        { class: 'flex justify-between items-center' },
        div(
          { class: 'text-black text-base font-extralight leading-snug' },
          'Min. Order Qty:',
        ),
        div(
          { class: 'text-black text-base font-bold leading-snug' },
          item?.minQty || '',
        ),
      ),
    );

    const actionButtons = div({
      class: 'self-stretch inline-flex justify-start items-center gap-3',
    });
    actionButtons.append(
      input({
        type: 'number',
        value: '1',
        min: '1',
        class:
          'w-14 self-stretch py-1.5 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-normal leading-normal text-center no-spinner',
      }),
      a(
        {
          href: item.url,
          class:
            'w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span(
          {
            class:
              'justify-start text-white text-base font-normal leading-snug',
          },
          'Buy',
        ),
      ),
      button(
        {
          class:
            'show-modal-btn cursor-pointer px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span(
          {
            class: 'text-violet-600 text-base font-normal leading-snug',
          },
          'Quote',
        ),
      ),
    );

    rightSection.append(price, pricingDetails, actionButtons);
  } else {
    rightSection = div({
      class:
        'self-stretch w-full md:w-80 p-6 bg-gray-50 inline-flex flex-col justify-start items-end gap-4',
    });

    const actionButtons = div({
      class: 'self-stretch inline-flex justify-start items-center gap-3',
    });

    if (item.showAvailability) {
      actionButtons.append(
        a(
          {
            href: item.url || '#',
            class:
              'px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
          },
          span(
            {
              class:
                'justify-start text-white text-base font-normal leading-snug',
            },
            'Price & Availability',
          ),
        ),
        button(
          {
            class:
              'show-modal-btn cursor-pointer px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
          },
          span(
            {
              class: 'text-violet-600 text-base font-normal leading-snug',
            },
            'Quote',
          ),
        ),
      );
    } else {
      actionButtons.append(
        button(
          {
            class:
              'show-modal-btn cursor-pointer flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
          },
          span(
            {
              class: 'text-violet-600 text-base font-normal leading-snug',
            },
            'Quote',
          ),
        ),
      );
    }

    rightSection.append(actionButtons);
  }

  card.append(leftSection, rightSection);
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
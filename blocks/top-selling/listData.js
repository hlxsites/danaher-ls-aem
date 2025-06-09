import {
  div, img, a, button, input, span,
} from '../../scripts/dom-builder.js';
import { createModal } from '../../scripts/common-utils.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
// Helper function to create a badge based on item.carrierFree
function createCarrierFreeBadge(carrierFreeText) {
  return div(
    {
      class: 'px-4 py-1 bg-violet-50 inline-flex justify-center items-center gap-2.5',
    },
    div(
      {
        class: 'text-center justify-start text-violet-600 text-sm font-normal leading-tight',
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
  const imageUrl = item?.images?.[0] || 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
  const card = div({
    class: 'self-stretch w-full outline outline-1 outline-gray-300 inline-flex flex-col md:flex-row justify-start items-center px-5 md:px-0',
  });

  const leftSection = div({
    class: 'flex-1 self-stretch p-6 bg-white flex flex-col md:flex-row justify-start items-start gap-6',
  });

  const imageSection = div({
    class: 'w-16 md:w-24 inline-flex flex-col justify-start items-center gap-3',
  });

  const imageWrapper = div({
    class: 'self-stretch h-16 md:h-24 relative rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300',
  });

  imageWrapper.append(
    div({
      class: 'w-16 h-16 md:w-24 md:h-24 left-0 top-0 absolute bg-white rounded-md',
    }),
    a(
      { title: item.title },
      img({
        class: 'w-16 h-16 md:w-24 md:h-24 left-0 top-0 absolute rounded-md border border-gray-200 object-cover',
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
        class: 'self-stretch justify-start text-black text-xl font-normal leading-7 line-clamp-2',
      },
      item.title,
    ),
  );

  mobileTitleSection.append(mobileTitleWrapper);
  mobileContentSection.append(mobileTitleSection, imageSection);

  const mobileDescSection = div({
    class: 'self-stretch flex flex-col justify-start items-start gap-3 md:hidden',
  });

  mobileDescSection.append(
    div(
      { class: 'self-stretch inline-flex justify-start items-center gap-3' },
      div(
        { class: 'flex-1 inline-flex flex-col justify-start items-start' },
        div(
          {
            class: 'self-stretch justify-start text-gray-700 text-base font-extralight leading-snug line-clamp-3',
          },
          item.description,
        ),
      ),
    ),
    a(
      {
        href: item.url,
        title: item.title,
        class: 'self-stretch justify-start text-violet-600 text-base font-bold leading-snug',
      },
      'View Details',
      span({
        class: 'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
  );
  decorateIcons(mobileDescSection);

  // Desktop View: Image on the left, content on the right
  const desktopContentSection = div({
    class: 'hidden md:flex flex-1 h-44 flex-col justify-between items-start gap-3',
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
          class: 'self-stretch justify-start text-black text-xl font-normal leading-7',
        },
        item.title,
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
            class: 'self-stretch justify-start text-gray-700 text-base font-extralight leading-snug line-clamp-3',
          },
          item.description,
        ),
      ),
    ),
    div(
      { class: 'w-full flex-col gap-2 mt-4' },
      a(
        {
          href: item.url,
          title: item.title,
          class: 'self-stretch justify-start text-violet-600 text-base font-bold leading-snug',
        },
        'View Details',
        span({
          class: 'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
        }),
      ),
    ),
  );

  decorateIcons(desktopTitleAndDesc);
  desktopContentSection.append(desktopTitleAndDesc);
  leftSection.append(
    imageSection,
    mobileContentSection,
    mobileDescSection,
    desktopContentSection,
  );

  let rightSection;
  if (item.showCart && item.price !== undefined) {
    rightSection = div({
      class: 'self-stretch w-full md:w-80 p-6 bg-gray-50 inline-flex flex-col justify-start items-end gap-4',
    });

    const price = div(
      {
        class: 'w-64 text-right justify-start text-black text-2xl font-normal leading-loose',
      },
      `$${item.price.toLocaleString()}.00`,
    );

    const pricingDetails = div({ class: 'w-64 flex flex-col gap-2' });
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
        class: 'w-14 self-stretch py-1.5 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-normal leading-normal text-center no-spinner',
      }),
      a(
        {
          href: item.url,
          class: 'w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span(
          {
            class: 'justify-start text-white text-base font-normal leading-snug',
          },
          'Buy',
        ),
      ),
      button(
        {
          class: 'quoteModal cursor-pointer px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
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
      class: 'self-stretch w-full md:w-80 p-6 bg-gray-50 inline-flex flex-col justify-start items-end gap-4',
    });

    const actionButtons = div({
      class: 'self-stretch inline-flex justify-start items-center gap-3',
    });

    if (item.showAvailability) {
      actionButtons.append(
        a(
          {
            href: item.url || '#',
            class: 'px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
          },
          span(
            {
              class: 'justify-start text-white text-base font-normal leading-snug',
            },
            'Price & Availability',
          ),
        ),
        button(
          {
            class: 'quoteModal cursor-pointer px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
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
            class: 'quoteModal cursor-pointer flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
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

  const quoteModalContent = () => {
    const modalContent = div({});
    modalContent.innerHTML = '<dialog id="custom-modal" class="w-full max-w-xl px-6 py-4 text-left relative align-middle transition-all transform " open=""><div><div class="justify-between flex item-center mb-2 text-2xl font-bold leading-6 text-gray-900"><div class="modal-title flex items-center gap-2"><span class="icon icon-chat-bubble flex items-center justify-center flex-shrink-0 mx-auto bg-gray-200 rounded-full w-10 h-10 p-2"><svg data-v-3ebe214a="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 text-danaherblue-600" data-di-rand="1747639296501"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path></svg></span>Request for Quote</div></div><div><div class="mt-3"><label class="text-sm text-gray-500">Describe your problem or desired solution to add to your quote cart and one of our experts will assist in find the best solution for you</label></div><div class="mt-3"><textarea class="quote-textarea block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gray-300 focus:ring-gray-300 sm:text-sm" name="quote" rows="4"></textarea></div><div class="flex justify-between gap-4 mt-4 quote sm:flex-row flex-col"><button class="p-2 text-sm text-danaherpurple-500 bg-white border-2 border-danaherpurple-500 hover:text-white hover:bg-danaherpurple-800 rounded-full" name="continue">Add and continue browsing</button><button class="py-2 text-sm btn btn-primary-purple rounded-full" name="submit">Add and complete request</button></div><div class="p-4 mt-4 rounded-md bg-red-50 hidden quote-error"><div class="flex gap-2"><span class="icon icon-xcircle w-4 h-4 text-red-600"><svg data-v-3ebe214a-s="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-4 h-4 text-red-600" data-di-rand="1747639296502"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span><p class="text-xs font-medium text-red-600">Please enter your problem or desired solution.</p></div></div><div class="flex flex-col p-4 mt-4 rounded-md bg-danaherlightblue-500 bg-opacity-10"><p class="text-xs font-medium text-gray-700 m-0">Quote Tip.</p><p class="font-sans text-xs font-normal text-gray-700">Be as detailed as possible so we can best serve your request.</p></div></div></div></dialog>';
    return modalContent;
  };

  card.querySelectorAll('.quoteModal').forEach((b) => {
    b.addEventListener('click', () => {
      createModal(quoteModalContent(), false, true);
    });
  });

  return card;
}

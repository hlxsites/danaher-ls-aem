import {
  div,
  p,
  img,
  a,
  button,
  input,
  span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateModals } from '../../scripts/scripts.js';

// Helper function to create a badge based on item.carrierFree
function createCarrierFreeBadge(carrierFreeText) {
  return div(
    {
      class:
        'absolute bottom-2 left-2 px-2 py-1 bg-violet-50 inline-flex justify-center items-center gap-2.5 z-10',
    },
    div(
      {
        class:
          'text-center text-violet-600 text-sm font-normal leading-tight truncate max-w-[150px]',
      },
      carrierFreeText,
    ),
  );
}

/**
 * Renders a product card in grid view.
 * @param {Object} item - Product data containing title, url, images, description, price, etc.
 * @returns {HTMLElement} - The rendered grid card element.
 */
export default function renderGridCard(item) {
  const card = div({
    class:
      'w-[331px] md:w-[305px] min-h-[485px] bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start',
  });

  const imageWrapper = div({ class: 'relative w-full' });
  const imageUrl = item.images?.[0]
    || 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
  const imageElement = div(
    { class: 'block w-full' },
    img({
      src: imageUrl,
      alt: item.title,
      class: 'w-full h-[164px] object-contain',
    }),
  );

  imageWrapper.append(
    imageElement,
    ...(item.carrierFree ? [createCarrierFreeBadge(item.carrierFree)] : []),
  );

  const contentWrapper = div({
    class: 'flex flex-col justify-start items-start w-full flex-grow',
  });
  contentWrapper.append(
    p(
      { class: 'p-3 text-black text-xl font-bold leading-7' },
      (item.title || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  const pricingDetails = div({
    class:
      'self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6',
  });
  if (item.showCart && item.price !== undefined) {
    pricingDetails.append(
      div(
        {
          class:
            'text-right justify-start text-black text-2xl font-normal leading-loose',
        },
        `$${item.price.toLocaleString()}`,
      ),
      div(
        { class: 'self-stretch flex flex-col justify-start items-start gap-2' },
        div(
          { class: 'flex justify-between items-center w-full' },
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
          { class: 'flex justify-between items-center w-full' },
          div(
            { class: 'text-black text-base font-extralight leading-snug' },
            'Min. Order Qty:',
          ),
          div(
            { class: 'text-black text-base font-bold leading-snug' },
            item?.minQty || '',
          ),
        ),
      ),
    );
  }

  let actionButtons;
  if (item.showCart && item.price !== undefined) {
    actionButtons = div(
      {
        class:
          'self-stretch px-4 py-3 bg-gray-50 inline-flex justify-start items-center gap-3',
      },
      input({
        type: 'number',
        value: '1',
        min: '1',
        class:
          'w-14 self-stretch py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-normal leading-normal text-center',
      }),
      a(
        {
          href: item.url,
          class:
            'w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span(
          {
            class: 'text-white text-base font-normal leading-snug',
          },
          'Buy',
        ),
      ),
      div(
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
    actionButtons = div(
      {
        class:
          'self-stretch h-48 px-4 py-3 bg-gray-50 inline-flex flex-col justify-center items-center gap-6',
      },
      div(
        {
          class: 'self-stretch h-28 inline-flex justify-start gap-3',
        },
        div(
          { class: 'flex-1 inline-flex flex-col justify-start items-start' },
          div(
            {
              class:
                'self-stretch justify-start text-gray-700 text-base font-extralight leading-snug line-clamp-5',
            },
            (item.description || '').trim().replace(/<[^>]*>/g, ''),
          ),
        ),
      ),
      div(
        { class: 'self-stretch inline-flex justify-start items-center gap-3' },
        ...(item.showAvailability
          ? [
            a(
              {
                href: item.url || '#',
                class:
                    'px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
              },
              div(
                {
                  class:
                      'justify-start text-white text-base font-normalbtn_link leading-snug',
                },
                'Price & Availability',
              ),
            ),
            div(
              {
                class:
                    'show-modal-btn cursor-pointer px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
              },
              div(
                {
                  class:
                      'justify-start text-violet-600 text-base font-normalbtn_link leading-snug',
                },
                'Quote',
              ),
            ),
          ]
          : [
            button(
              {
                class:
                    'show-modal-btn cursor-pointer flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
              },
              div(
                {
                  class: 'text-violet-600 text-base font-normal leading-snug',
                },
                'Quote',
              ),
            ),
          ]),
      ),
    );
  }

  const viewDetailsButton = div(
    { class: 'self-stretch p-3 flex justify-start items-center' },
    a(
      {
        href: item.url,
        class: 'text-violet-600 text-base font-bold leading-snug',
      },
      'View Details',
      span({
        class:
          'icon icon-arrow-right dhls-arrow-right-icon pt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
  );

  decorateIcons(viewDetailsButton);

  card.append(
    imageWrapper,
    contentWrapper,
    pricingDetails,
    actionButtons,
    viewDetailsButton,
  );

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

import {
  div, p, a, input, span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  makePublicUrl,
  imageHelper,
  decorateModals,
} from '../../scripts/scripts.js';

/**
 * Function to render a grid card
 */
export default function renderProductGridCard(item) {
  const card = div({
    class:
      'lg:w-[305px] w-[331px] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start ',
  });

  const imageElement = imageHelper(item.raw.images?.[0] || '', item.title, {
    title: item.title,
    class: 'w-full h-40 object-cover',
  });

  const titleElement = div(
    { class: 'p-3' },
    p(
      { class: 'text-black text-xl font-medium leading-7 line-clamp-2' },
      (item.title || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  const contentWrapper = div({
    class: 'flex flex-col justify-start items-start w-full flex-grow',
  });

  contentWrapper.append(titleElement);

  const pricingDetails = div({
    class:
      'self-stretch inline-flex flex-col justify-start items-end gap-6',
  });

  const price = item.salePrice?.value || 99999.99;
  const uom = item.packingUnit || '1/Bundle';
  const minQty = item.minOrderQuantity || 1;

  pricingDetails.append(
    div(
      {
        class:
          'text-right justify-start text-black text-2xl font-medium',
      },
      `$${price.toLocaleString()}`,
    ),
    div(
      { class: 'self-stretch flex flex-col justify-start items-start gap-2' },
      div(
        { class: 'flex justify-between items-center w-full' },
        div(
          { class: 'text-black text-base font-extralight leading-snug' },
          'Unit of Measure:',
        ),
        div({ class: 'text-black text-base font-bold leading-snug' }, uom),
      ),
      div(
        { class: 'flex justify-between items-center w-full' },
        div(
          { class: 'text-black text-base font-extralight leading-snug' },
          'Min. Order Qty:',
        ),
        div({ class: 'text-black text-base font-bold leading-snug' }, minQty),
      ),
    ),
    div(
      { class: 'inline-flex justify-start items-center ml-3 gap-3' },
      input({
        type: 'number',
        value: '1',
        min: '1',
        class:
          'w-14 self-stretch py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-medium leading-normal text-center [&::-webkit-inner-spin-button]:mr-2',
      }),
      a(
        {
          href: makePublicUrl(item.path || item.clickUri),
          class:
            'w-24 px-5 py-2 bg-danaherpurple-500 hover:bg-danaherpurple-800 rounded-[20px] flex justify-center items-center overflow-hidden',
        },
        span({ class: 'text-white text-base font-medium leading-snug' }, 'Buy'),
      ),
      div(
        {
          class:
            'show-modal-btn cursor-pointer px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-danaherpurple-500 hover:bg-danaherpurple-500 flex justify-center items-center overflow-hidden',
        },
        span(
          { class: 'text-danaherpurple-500 hover:text-white text-base font-medium leading-snug' },
          'Quote',
        ),
      ),
    ),
  );

  const viewDetailsButton = div(
    { class: 'self-stretch p-3 flex justify-start items-center' },
    a(
      {
        href: makePublicUrl(item.path || item.clickUri),
        class: 'text-danaherpurple-500 hover:text-danaherpurple-800 flex items-center text-base font-bold leading-snug',
      },
      'View Details',
      span({
        class:
          'icon icon-arrow-right !size-5 pl-1.5 mt-1 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
      }),
    ),
  );

  decorateIcons(viewDetailsButton);

  const bgWrapper = div({ class: 'bg-gray-50 px-4 py-3' });
  bgWrapper.append(pricingDetails);
  card.append(
    imageElement,
    contentWrapper,
    bgWrapper,
    viewDetailsButton,
  );

  decorateModals(card);
  return card;
}

import {
  div, p, a, input, span,
} from '../../scripts/dom-builder.js';
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
      'lg:w-[305px] w-[331px] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start',
  });

  const imageElement = imageHelper(item.raw.images?.[0] || '', item.title, {
    title: item.title,
    class: 'w-full h-40 object-cover',
  });

  const titleElement = p(
    { class: 'p-3 text-black text-xl font-normal leading-7' },
    (item.title || '').trim().replace(/<[^>]*>/g, ''),
  );

  const contentWrapper = div({
    class: 'flex flex-col justify-start items-start w-full flex-grow',
  });

  contentWrapper.append(titleElement);

  const pricingDetails = div({
    class:
      'self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6',
  });

  const price = item.salePrice?.value || 99999.99;
  const uom = item.packingUnit || '1/Bundle';
  const minQty = item.minOrderQuantity || 1;

  pricingDetails.append(
    div(
      {
        class:
          'text-right justify-start text-black text-2xl font-normal leading-loose',
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
  );

  const actionButtons = div(
    { class: 'inline-flex justify-start items-center ml-3 mt-5 gap-3' },
    input({
      type: 'number',
      value: '1',
      min: '1',
      class:
        'w-14 self-stretch py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-normal leading-normal text-center',
    }),
    a(
      {
        href: makePublicUrl(item.path || item.clickUri),
        class:
          'w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
      },
      span({ class: 'text-white text-base font-normal leading-snug' }, 'Buy'),
    ),
    div(
      {
        class:
          'show-modal-btn cursor-pointer px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
      },
      span(
        { class: 'text-violet-600 text-base font-normal leading-snug' },
        'Quote',
      ),
    ),
  );

  const viewDetailsButton = div(
    { class: 'self-stretch p-3 flex justify-start items-center' },
    a(
      {
        href: makePublicUrl(item.path || item.clickUri),
        class: 'text-violet-600 text-base font-bold leading-snug',
      },
      'View Details →',
    ),
  );

  card.append(
    imageElement,
    contentWrapper,
    pricingDetails,
    actionButtons,
    viewDetailsButton,
  );

  decorateModals(card);
  return card;
}

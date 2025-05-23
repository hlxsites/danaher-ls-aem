import {
  div, p, a, input, span,
} from '../../scripts/dom-builder.js';
import { makePublicUrl, imageHelper } from '../../scripts/scripts.js';

import { createModal } from '../../scripts/common-utils.js';

/**
 * Function to render a list card
 */
export default function renderProductListCard(item) {
  const card = div({
    class: 'w-full min-h-24 mb-4 bg-white outline outline-1 outline-gray-300 flex flex-row justify-start items-start',
  });

  const leftSide = div({
    class: 'flex-none w-64 p-4',
  });

  const imageElement = imageHelper(item.raw.images?.[0] || '', item.title, {
    href: makePublicUrl(item.path || item.clickUri),
    title: item.title,
    class: 'w-full h-32 object-cover mb-2',
  });

  leftSide.append(imageElement);

  const middleSection = div({
    class: 'flex-grow p-4',
  });

  const titleElement = p({ class: 'text-black text-lg font-normal leading-7' }, item.title);

  middleSection.append(titleElement);

  const rightSide = div({
    class: 'flex-none w-64 p-4 bg-gray-50',
  });

  const price = item.salePrice?.value || 99999.99;
  const uom = item.packingUnit || '1/Bundle';
  const minQty = item.minOrderQuantity || 1;

  const pricingDetails = div(
    { class: 'mb-4' },
    div(
      { class: 'text-right text-black text-2xl font-normal leading-loose mb-2' },
      `$${price.toLocaleString()}`,
    ),
    div(
      { class: 'flex justify-between items-center w-full mb-1' },
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
      { class: 'flex items-center gap-2 mb-2' },
      input({
        type: 'number',
        value: '1',
        min: '1',
        class:
          'w-14 px-4 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 text-black text-base font-normal leading-normal text-center',
      }),
      a(
        {
          href: makePublicUrl(item.path || item.clickUri),
          class:
            'w-20 px-4 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span({ class: 'text-white text-base font-normal leading-snug' }, 'Buy'),
      ),
      div(
        {
          class:
            'quoteModal cursor-pointer w-20 px-4 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden',
        },
        span({ class: 'text-violet-600 text-base font-normal leading-snug' }, 'Quote'),
      ),
    ),
    div(
      { class: 'w-full text-center mt-2' },
      a(
        { href: makePublicUrl(item.path || item.clickUri), class: 'text-violet-600 text-base font-bold leading-snug' },
        'View Details →',
      ),
    ),
  );

  rightSide.append(pricingDetails, actionButtons);

  card.append(leftSide, middleSection, rightSide);

  /**
   * Function to generate quote modal content
   */
  function quoteModalContent() {
    const modalContent = div({});
    modalContent.innerHTML = `
      <dialog id="custom-modal" class="w-full max-w-xl px-6 py-4 text-left align-middle relative transition-all transform" open>
        <div>
          <div class="justify-between flex item-center mb-2 text-2xl font-bold leading-6 text-gray-900">
            <div class="modal-title flex items-center gap-2">
              <span class="icon icon-chat-bubble flex items-center justify-center flex-shrink-0 mx-auto bg-gray-200 rounded-full w-10 h-10 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" class="w-6 h-6 text-danaherblue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"></path>
                </svg>
              </span>
              Request for Quote
            </div>
          </div>
          <div>
            <div class="mt-3">
              <label class="text-sm text-gray-500">Describe your problem or desired solution to add to your quote cart and one of our experts will assist in find the best solution for you</label>
            </div>
            <div class="mt-3">
              <textarea class="quote-textarea block w-full px-1 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gray-300 focus:ring-gray-300 sm:text-sm" name="quote" rows="4"></textarea>
            </div>
            <div class="flex justify-between gap-4 mt-4 quote sm:flex-row flex-col">
              <button class="p-2 text-sm text-danaherpurple-500 bg-white border-2 border-danaherpurple-500 hover:text-white hover:bg-danaherpurple-800 rounded-full" name="continue">Add and continue browsing</button>
              <button class="py-2 text-sm btn btn-primary-purple rounded-full" name="submit">Add and complete request</button>
            </div>
            <div class="p-4 mt-4 rounded-md bg-red-50 hidden quote-error">
              <div class="flex gap-2">
                <span class="icon icon-xcircle w-4 h-4 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" class="w-4 h-4 text-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                <p class="text-xs font-medium text-red-600">Please enter your problem or desired solution.</p>
              </div>
            </div>
            <div class="flex flex-col p-4 mt-4 rounded-md bg-danaherlightblue-500 bg-opacity-10">
              <p class="text-xs font-medium text-gray-700 m-0">Quote Tip.</p>
              <p class="font-sans text-xs font-normal text-gray-700">Be as detailed as possible so we can best serve your request.</p>
            </div>
          </div>
        </div>
      </dialog>`;
    return modalContent;
  }

  // Attach quote modal event listener
  card.querySelectorAll('.quoteModal').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      createModal(quoteModalContent(), false, true);
    });
  });

  return card;
}

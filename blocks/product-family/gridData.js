import {
  div, p, a, span, img, button,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import {
  makePublicUrl,
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

  const fallbackImagePath = '/content/dam/danaher/products/fallbackImage.jpeg';

  // Compact image creation with fallback
  const createImageWithFallback = (src, alt) => {
    const imageElement = img({
      src: src || fallbackImagePath,
      alt: alt || 'Product image not available',
      class: 'w-full h-40 object-contain',
    });

    // Add error handler for fallback
    imageElement.addEventListener('error', () => {
      imageElement.src = fallbackImagePath;
      imageElement.alt = 'Product image not available';
    });

    return div({ class: 'w-full h-40 overflow-hidden' }, imageElement);
  };

  const imageElement = createImageWithFallback(item.raw.images?.[0], item.title);

  const titleElement = div(
    { class: 'p-3' },
    p(
      { class: 'text-black text-xl font-medium leading-7 line-clamp-2' },
      (item.title || '').trim().replace(/<[^>]*>/g, ''),
    ),
  );

  const contentWrapper = div({
    class: 'flex flex-col justify-center items-start w-full h-20',
  });

  contentWrapper.append(titleElement);

  const pricingAndActions = div(
    {
      class: 'self-stretch flex flex-col justify-between h-full px-4 py-3',
    },
    div(
      {
        class: 'self-stretch inline-flex justify-start gap-3 flex-1',
      },
      div(
        { class: 'flex-1 inline-flex flex-col justify-start items-start' },
        div(
          {
            class: 'self-stretch justify-start text-black text-base font-extralight leading-snug line-clamp-4',
          },
          item?.raw?.description.trim().replace(/<[^>]*>/g, ''),
        ),
      ),
    ),
    div(
      { class: 'self-stretch inline-flex justify-start items-center gap-3 pt-6' },
      button(
        {
          class:
            'show-modal-btn cursor-pointer text-danaherpurple-500 hover:text-white hover:bg-danaherpurple-500 flex-1 px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#7523FF] flex justify-center items-center overflow-hidden',
        },
        div(
          {
            class: 'inherit text-base font-medium leading-snug',
          },
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
        class: 'group text-danaherpurple-500 hover:text-danaherpurple-800 flex items-center text-base font-bold leading-snug',
      },
      'View Details',
      span({
        class:
          'icon icon-arrow-right !size-5 pl-1.5 fill-current group-hover:[&_svg>use]:stroke-danaherpurple-800 [&_svg>use]:stroke-danaherpurple-500',
      }),
    ),
  );

  decorateIcons(viewDetailsButton);

  const bgWrapper = div({ class: 'bg-gray-50 h-[191px]' });
  bgWrapper.append(pricingAndActions);
  card.append(
    imageElement,
    contentWrapper,
    bgWrapper,
    viewDetailsButton,
  );

  decorateModals(card);
  return card;
}

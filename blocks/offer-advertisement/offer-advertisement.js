import { div, a } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const titleEl = block
    .querySelector('[data-aue-prop="offer_advertisement_title"]')
    ?.textContent?.trim();
  const linkTextEl = block
    .querySelector('[data-aue-prop="offer_text"]')
    ?.textContent?.trim();
  const linkHref = block
    .querySelector('div *:not([data-aue-label]) a')
    ?.getAttribute('href') || '#';

  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const offerAdvertisementWrapper = div({
    class:
      'dhls-container mx-auto flex flex-col md:flex-row gap-6 mt-12 px-5 lg:px-0',
  });

  const titleContainer = titleEl
    ? div(
      {
        class: 'self-stretch flex flex-col justify-start items-start gap-4',
      },
      div(
        {
          class: 'justify-start text-black text-2xl font-normal',
        },
        titleEl,
      ),
    )
    : null;

  const linkContainer = linkTextEl
    ? div(
      {
        class:
            'justify-start text-violet-600 text-base font-bold leading-snug flex items-center gap-1',
      },
      a({ href: linkHref }, linkTextEl),
    )
    : null;

  const outerContainer = div(
    {
      class:
        'w-full bg-gray-200 inline-flex flex-col gap-y-6 md:flex-row md:justify-between md:items-center p-6 md:px-12 py-8',
    },
    ...(titleContainer ? [titleContainer] : []),
    ...(linkContainer ? [linkContainer] : []),
  );

  offerAdvertisementWrapper.appendChild(outerContainer);
  block.innerHTML = '';
  block.appendChild(offerAdvertisementWrapper);
}

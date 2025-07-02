import { div, a, span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');

  const [offerAdvertisement] = block.children;

  const titleEl = offerAdvertisement.querySelector('p');
  const linkHref = offerAdvertisement.querySelector('a')?.getAttribute('href') || '#';
  const linkTextEl = offerAdvertisement?.querySelectorAll('p')?.[1];
  const openNewTab = block.children[1]?.querySelector('p')?.textContent;

  // Only create and append wrapper if there is content
  if (titleEl?.textContent?.trim() || linkTextEl?.textContent?.trim()) {
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
            class: 'justify-start text-black text-2xl font-medium',
          },
          titleEl.textContent.trim(),
        ),
      )
      : null;

    const linkContainer = linkTextEl
      ? div(
        {
          class:
              'justify-start text-danaherpurple-500 hover:text-danaherpurple-800 text-base font-bold leading-snug flex items-center gap-1 group',
        },
        a({ href: linkHref, target: `${openNewTab === 'true' ? '_blank' : '_self'}` }, linkTextEl.textContent.trim()),
        span({
          class: 'icon icon-arrow-right !size-5 pl-1.5 fill-current [&_svg>use]:stroke-danaherpurple-500 group-hover:[&_svg>use]:stroke-danaherpurple-800',
        }),
      )
      : null;
    decorateIcons(linkContainer);

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
}

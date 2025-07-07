import { decorateIcons } from '../../scripts/lib-franklin.js';
<<<<<<< HEAD
import {
  a, div, img, h3, p, span,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
=======
import { a, div, span } from '../../scripts/dom-builder.js';
import { makePublicUrl } from '../../scripts/scripts.js';

export default function decorate(block) {
  // document
  //   .querySelector(".opco-grid-wrapper")
  //   ?.parentElement?.removeAttribute("class");
  // document
  //   .querySelector(".opco-grid-wrapper")
  //   ?.parentElement?.removeAttribute("style");
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
  if (
    block.parentElement.parentElement.classList.contains('opco-grid-container')
  ) {
    block.parentElement.parentElement.classList.remove(
      ...'bg-danaherlightblue-50'.split(' '),
    );
  }

<<<<<<< HEAD
  if (block.classList.contains('cols-4')) block.classList.add('lg:grid-cols-4');
  else block.classList.add('lg:grid-cols-3');

  const opcoGridWrapper = div({
    class:
      'opco-grid cols-4 block list-none m-0 py-0 grid grid-cols-1 dhls-container lg:px-10 dhlsBp:p-0 sm:grid-cols-2 gap-x-5 gap-y-5 mb-12 lg:grid-cols-4',
  });
  const opcoGridItems = [];
  [...block.children].forEach((child) => {
    opcoGridItems.push(child);
  });
  opcoGridItems?.forEach((row) => {
    const cardWrapper = a({});

    const [
      itemImage,
      itemAltText,
      itemTitle,
      itemDescription,
      itemLink,
      itemLinkTarget,
    ] = row.children;

    const readMoreLink = itemLink?.querySelector('a');
    if (readMoreLink) {
      cardWrapper.href = readMoreLink?.href;
      cardWrapper.title = itemTitle?.textContent?.trim() || '';
    }
    cardWrapper.className = 'opco-grid-wrapper  flex flex-col col-span-1 mx-auto justify-center max-w-xl overflow-hidden p-0 border-l-[0.5px] border-gray-300 transform transition duration-500 hover:scale-105';
    cardWrapper.classList.add(
      'cursor-pointer relative transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg'.split(
        ' ',
      ),
    );

    const opcoContent = div(
      {
        class: 'opco-grid-item-body p-3 bg-white rounded-b gap-3 flex flex-col',
      },
      div(
        { class: 'opco-grid-item-image h-[164px] w-[294px] leading-5 mb-0' },
        img({
          src:
            itemImage?.querySelector('img')?.src
            || '/content/dam/danaher/products/fallbackImage.jpeg',
          alt: itemAltText?.textContent.trim() || '',
          class: 'h-[164px] w-[294px] !object-contain',
        }),
      ),
      h3(
        {
          class:
            '!line-clamp-2 font-medium text-black !text-xl !h-16 !m-0 !p-0',
        },
        itemTitle?.textContent.trim() || '',
      ),
      p(
        {
          class:
            'font-normal !m-0 !p-0 text-base text-black !h-16 !line-clamp-3 !break-words leading-snug',
        },
        itemDescription?.textContent.trim() || '',
      ),
    );
    // Add CTA link at the bottom if available
    if (itemLink) {
      const cta = div(
        { class: ' !m-0 !p-0' },
        a(
          {
            href: readMoreLink?.href || '#',
            target:
              itemLinkTarget.textContent.trim() === 'yes' ? '_blank' : '_self',
            class:
              'card-link inline-flex w-full items-center pt-5 text-base text-danaherpurple-500 hover:text-danaherpurple-800 [&_svg>use]:hover:stroke-danaherpurple-800 font-semibold',
          },
          `${itemLink.textContent.trim() || ''}`,
=======
  block.classList.add(
    ...'list-none m-0 py-0 grid grid-cols-1 dhls-container lg:px-10 dhlsBp:p-0 sm:grid-cols-2 gap-x-5 gap-y-5 mb-12'.split(
      ' ',
    ),
  );
  if (block.classList.contains('cols-4')) block.classList.add('lg:grid-cols-4');
  else block.classList.add('lg:grid-cols-3');

  [...block.children].forEach((row) => {
    let type = '';
    const heading = row.querySelector('h2');
    if (heading) heading.className = 'opco-grid-item-title text-gray-900 my-2 font-extrabold text-3xl py-2';

    const h3Heading = row.querySelector('h3')?.textContent?.trim();
    const typeP = h3Heading?.previousElementSibling;
    if (typeP) {
      type = typeP.textContent;
      typeP.remove();
      block.classList.add(type.toLowerCase());
    }

    const readMoreLink = row.querySelector('a');
    const cardWrapper = readMoreLink
      ? a({ href: makePublicUrl(readMoreLink.href), title: readMoreLink.title })
      : div();

    cardWrapper.className = 'opco-grid-wrapper w-[294px] flex flex-col col-span-1 mx-auto justify-center max-w-xl overflow-hidden p-0 border-l-[0.5px] border-gray-300 transform transition duration-500 hover:scale-105';
    row?.classList.add('w-[294px]');
    // if (!block.classList.contains("opco"))
    //   cardWrapper.classList.remove(
    //     ..."border-l-[0.5px]
    //  border-gray-300 pl-8 pr-2 transform
    // transition duration-500 hover:scale-105".split(
    //       " "
    //     )
    //   );
    if (!type) {
      cardWrapper.classList.add(
        'cursor-pointer relative transform transition duration-500 border hover:scale-105 shadow-lg rounded-lg'.split(
          ' ',
        ),
      );
    }

    row.append(heading || '');

    // Remove any duplicate link from DOM before rebuilding
    const existingLink = row.querySelector('p[data-aue-prop="card_href"]');
    const existingLabel = row.querySelector('p[data-aue-prop="card_hrefText"]');
    const linkText = existingLink?.textContent?.trim();
    const linkLabel = existingLabel?.textContent?.trim();
    if (existingLink) existingLink.remove();
    if (existingLabel) existingLabel.remove();

    [...row.children].forEach((elem) => {
      cardWrapper.append(elem);
      elem.querySelector('[data-aue-prop="card_alt"]')?.remove();
      const aTags = elem.querySelectorAll('a');

      aTags?.forEach((anchor) => {
        anchor?.classList.add(
          'card-link',
          'inline-flex',
          'w-full',
          'items-center',
          'pt-5',
          'text-base',
          'text-danaherpurple-500',
          'font-semibold',
        );
        anchor?.classList.remove('btn', 'btn-outline-primary');
        anchor?.insertAdjacentElement(
          'beforeend',
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
          span({
            class:
              'icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
          }),
<<<<<<< HEAD
        ),
      );
      opcoContent.append(cta);
    }
    cardWrapper.append(opcoContent);
    opcoGridWrapper.append(cardWrapper);
  });
  decorateIcons(opcoGridWrapper);
  block.append(opcoGridWrapper);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(opcoGridWrapper)) {
      child.style.display = 'none';
    }
  });
=======
        );
      });
      // Style image container
      if (elem.querySelector('picture, img')) {
        elem.className = 'opco-grid-item-image h-[164px] w-[294px] leading-5 mb-0';
        elem.querySelector('img').classList.add('h-[164px]', 'w-[294px]');
      } else {
        elem.className = 'opco-grid-item-body p-3 bg-white rounded-b gap-3 flex flex-col';
      }

      const h3 = elem?.querySelector('h3');
      const para = elem?.querySelector('p');

      if (para && para.dataset?.aueProp !== 'card_href') {
        para.className = 'text-gray-700  !m-0 !p-0 text-base font-extralight !h-16 !line-clamp-3 !break-words leading-snug';
      }

      if (h3) {
        h3.className = '!line-clamp-2 !h-16 !m-0 !p-0';
      }

      row.append(cardWrapper);
    });
    decorateIcons(cardWrapper);
    // Add CTA link at the bottom if available
    if (linkText && linkLabel) {
      const cta = div(
        { class: ' !m-0 !p-0' },
        a(
          {
            href: linkText,
            class: 'text-blue-600 text-sm font-semibold',
          },
          `${linkLabel}`,
        ),
      );
      cardWrapper.querySelector('div.opco-grid-item-body')?.append(cta);
    }
  });

  // Replace raw <img> with optimized picture
  // block.querySelectorAll("img").forEach((img) => {
  //   const picture = img.closest("picture");
  //   const cardImage = createOptimizedPicture(img.src, img.alt, false, [
  //     { width: "750" },
  //   ]);
  //   if (block.classList.contains("opco-grid-container")) {
  //     cardImage.querySelector("img").className =
  //       "h-[164px] w-full rounded-t !object-contain";
  //   }
  //   if (picture) picture.replaceWith(cardImage);
  // });
>>>>>>> 169f3ab83f962246a350c9954f02dd66c0cc1d2a
}

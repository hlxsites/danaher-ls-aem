import {
  div,
  h2,
  a,
  img,
  section,
  h3,
  span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateModals } from '../../scripts/scripts.js';

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const [insightTitle, insightDescription, ...insightItemsList] = block.children;

  // const insightItemsList = [];
  // [...block.children].forEach((child, index) => {
  //   if (index > 1) {
  //     insightItemsList.push(child);
  //   }
  // });

  // Extract top-level title/description
  const leftTitle = insightTitle?.textContent.trim().replace(/<[^>]*>/g, '') || '';
  const leftDescHTML = insightDescription?.innerHTML;

  // Create structured JSON from insight items
  const insightItems = insightItemsList.map((item) => {
    let itemTitle;
    let itemDescription;
    let itemLinkType;
    let itemButtonUrl;
    let itemButtonTarget;
    let itemButtonLabel;
    let itemImage;

    if (item.children.length > 5) {
      [
        itemTitle,
        itemDescription,
        itemLinkType,
        itemButtonUrl,
        itemButtonTarget,
        itemButtonLabel,
        itemImage,
      ] = item.children;
    } else {
      [
        itemTitle,
        itemDescription,
        itemLinkType,
        itemButtonUrl,
        itemButtonLabel,
        itemImage,
        itemButtonTarget,
      ] = item.children;
    }

    const title = itemTitle?.textContent.trim() || '';
    const description = itemDescription?.textContent.trim() || '';
    const linkUrl = itemButtonUrl?.textContent.trim().replace(/<[^>]*>/g, '') || '#';
    const linkTarget = itemButtonTarget?.textContent.trim() || '';
    const linkType = itemLinkType?.textContent.trim() || 'url';
    const linkLabel = itemButtonLabel?.textContent.trim();

    const imgEl = itemImage?.querySelector('img');

    const imgSrc = imgEl?.getAttribute('src') || '';
    const fullImgSrc = imgSrc && !imgSrc.startsWith('http')
      ? `${window.location.origin}${imgSrc}`
      : imgSrc.replace(/<[^>]*>/g, '');

    return {
      title,
      description,
      linkType,
      linkUrl,
      linkTarget,
      linkLabel,
      imgSrc: fullImgSrc,
    };
  });

  // DOM Rendering
  const eyesection = section({
    class: ' dhls-container px-5 lg:px-10 dhlsBp:p-0 ',
  });
  const wrapper = div({ class: 'flex flex-col md:flex-row gap-6' });

  // LEFT COLUMN
  const leftCol = div(
    { class: 'w-full md:w-1/2 pr-0 md:pr-6' },
    h2(
      { class: 'text-2xl md:text-3xl font-semibold mb-4 mt-0 text-black' },
      leftTitle,
    ),
    div({
      class: 'text-base text-black font-normal leading-relaxed',
      id: 'leftColDescription',
    }),
  );
  leftCol
    ?.querySelector('#leftColDescription')
    ?.insertAdjacentHTML('beforeend', leftDescHTML);

  leftCol
    ?.querySelector('#leftColDescription')
    ?.querySelectorAll('p')
    ?.forEach((ite, inde, arr) => {
      if (inde !== arr.length - 1) {
        ite.classList.add('pb-4');
      }
      if (ite?.textContent?.trim() === '') {
        ite.remove();
      }
    });
  const leftColLinks = leftCol.querySelectorAll('a');
  leftColLinks?.forEach((link) => {
    link.classList.add(
      'text-black',
      'underline',
      'decoration-danaherpurple-500',
      'hover:bg-danaherpurple-500',
      'hover:text-white',
    );
    const linkHref = link?.getAttribute('href');

    link.setAttribute('target', linkHref.includes('http') ? '_blank' : '_self');
  });
  // RIGHT COLUMN
  const rightCol = div({
    class:
      'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-0 md:pl-6 mt-1',
  });

  insightItems.forEach(
    (
      {
        title, description, linkType, linkUrl, linkTarget, linkLabel, imgSrc,
      },
      ind,
    ) => {
      const imageEl = imgSrc
        ? img({
          src: imgSrc,
          alt: title,
          class: 'w-12 mt-[2px] object-contain flex-shrink-0',
        })
        : null;

      const container = div(
        {
          class: `py-8 flex gap-4 ${ind === 0 ? 'pt-0' : ''} ${
            ind === insightItems.length - 1 ? 'pb-0' : ''
          }  `,
        }, // Removed items-start to fix icon alignment
        ...(imageEl ? [imageEl] : []),
        div(
          { class: 'flex flex-col gap-4' },
          h3(
            {
              class: `text-lg font-semibold text-black !m-0 !p-0  ${
                ind === 0 ? 'mt-0' : ''
              } `,
            },
            title,
          ),
          div(
            {
              class:
                'insight-description font-normal text-base textblack mb-3 text-black !m-0 !p-0',
            },
            description,
          ),
          a(
            {
              href: linkType === 'modal' ? '#' : linkUrl,
              target: linkTarget === 'true' ? '_blank' : '_self',
              class: `text-danaherpurple-500  ${
                linkType === 'modal' ? 'show-modal-btn' : ''
              } [&_svg>use]:hover:stroke-danaherpurple-800  hover:text-danaherpurple-800  text-base font-semibold  flex items-center !m-0 !p-0`,
            },
            linkLabel,
            span({
              class:
                'icon icon-arrow-right  dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
            }),
          ),
        ),
      );

      const descriptionLinks = container
        ?.querySelector('.insight-description')
        ?.querySelectorAll('a');
      descriptionLinks?.forEach((link) => {
        link.classList.add(
          'text-black',
          'underline',
          'decoration-danaherpurple-500',
          'hover:bg-danaherpurple-500',
          'hover:text-white',
        );
        const linkHref = link?.getAttribute('href');

        link.setAttribute(
          'target',
          linkHref.includes('http') ? '_blank' : '_self',
        );
      });
      rightCol.appendChild(container);
    },
  );

  // Final Assembly
  wrapper.append(leftCol, rightCol);
  eyesection.appendChild(wrapper);
  decorateIcons(eyesection);
  decorateModals(eyesection);
  const isEditor = document.querySelector('.adobe-ue-edit');
  if (!isEditor) {
    block.textContent = '';
  }
  block.append(eyesection);
  if (isEditor) {
    [...block.children].forEach((child) => {
      if (!child.contains(eyesection)) {
        child.style.display = 'none';
      }
    });
  }
}

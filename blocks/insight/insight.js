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

/**
 * Detects whether the Universal Editor is active.
 */
function isEditorMode() {
  return (
    document.documentElement.classList.contains('hlx-edit') ||
    document.body.classList.contains('hlx-edit') ||
    !!document.querySelector('[data-editor]') ||
    window.location.pathname.includes('/editor.html')
  );
}

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute('class');
  block?.parentElement?.parentElement?.removeAttribute('style');
  const [insightTitle, insightDescription, ...insightItemsList] =
    block.children;

  const leftTitle =
    insightTitle?.textContent.trim().replace(/<[^>]*>/g, '') || '';
  const leftDescHTML = insightDescription?.innerHTML;

  const insightItems = insightItemsList.map((item) => {
    let [
      itemTitle,
      itemDescription,
      itemLinkType,
      itemButtonUrl,
      itemButtonTarget,
      itemButtonLabel,
      itemImage,
    ] =
      item.children.length > 5
        ? item.children
        : [
            item.children[0],
            item.children[1],
            item.children[2],
            item.children[3],
            item.children[5],
            item.children[4],
            item.children[6],
          ];

    const imgEl = itemImage?.querySelector('img');
    const imgSrc = imgEl?.getAttribute('src') || '';
    const fullImgSrc =
      imgSrc && !imgSrc.startsWith('http')
        ? `${window.location.origin}${imgSrc}`
        : imgSrc.replace(/<[^>]*>/g, '');

    return {
      title: itemTitle?.textContent.trim() || '',
      description: itemDescription?.textContent.trim() || '',
      linkType: itemLinkType?.textContent.trim() || 'url',
      linkUrl: itemButtonUrl?.textContent.trim().replace(/<[^>]*>/g, '') || '#',
      linkTarget: itemButtonTarget?.textContent.trim() || '',
      linkLabel: itemButtonLabel?.textContent.trim(),
      imgSrc: fullImgSrc,
    };
  });

  const eyesection = section({
    class: 'dhls-container px-5 lg:px-10 dhlsBp:p-0',
  });
  const wrapper = div({ class: 'flex flex-col md:flex-row gap-6' });

  // LEFT COLUMN
  const leftCol = div(
    { class: 'w-full md:w-1/2 pr-0 md:pr-6' },
    h2(
      { class: 'text-2xl md:text-3xl font-semibold mb-4 mt-0 text-black' },
      leftTitle
    ),
    div({
      class: 'text-base text-black font-normal leading-relaxed',
      id: 'leftColDescription',
    })
  );
  leftCol
    .querySelector('#leftColDescription')
    ?.insertAdjacentHTML('beforeend', leftDescHTML);

  leftCol.querySelectorAll('#leftColDescription p')?.forEach((p, i, arr) => {
    if (i !== arr.length - 1) p.classList.add('pb-4');
    if (!p.textContent.trim()) p.remove();
  });

  leftCol.querySelectorAll('a')?.forEach((link) => {
    link.classList.add(
      'text-black',
      'underline',
      'decoration-danaherpurple-500',
      'hover:bg-danaherpurple-500',
      'hover:text-white'
    );
    const href = link?.getAttribute('href') || '';
    link.setAttribute('target', href.includes('http') ? '_blank' : '_self');
  });

  // RIGHT COLUMN
  const rightCol = div({
    class:
      'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-0 md:pl-6 mt-1',
  });

  insightItems.forEach(
    (
      { title, description, linkType, linkUrl, linkTarget, linkLabel, imgSrc },
      i
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
          class: `py-8 flex gap-4 ${i === 0 ? 'pt-0' : ''} ${
            i === insightItems.length - 1 ? 'pb-0' : ''
          }`,
        },
        ...(imageEl ? [imageEl] : []),
        div(
          { class: 'flex flex-col gap-4' },
          h3(
            {
              class: `text-lg font-semibold text-black !m-0 !p-0 ${
                i === 0 ? 'mt-0' : ''
              }`,
            },
            title
          ),
          div(
            {
              class:
                'insight-description font-normal text-base textblack mb-3 text-black !m-0 !p-0',
            },
            description
          ),
          a(
            {
              href: linkType === 'modal' ? '#' : linkUrl,
              target: linkTarget === 'true' ? '_blank' : '_self',
              class: `text-danaherpurple-500 ${
                linkType === 'modal' ? 'show-modal-btn' : ''
              } [&_svg>use]:hover:stroke-danaherpurple-800 hover:text-danaherpurple-800 text-base font-semibold flex items-center !m-0 !p-0`,
            },
            linkLabel,
            span({
              class:
                'icon icon-arrow-right dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
            })
          )
        )
      );

      container.querySelectorAll('.insight-description a')?.forEach((link) => {
        link.classList.add(
          'text-black',
          'underline',
          'decoration-danaherpurple-500',
          'hover:bg-danaherpurple-500',
          'hover:text-white'
        );
        const href = link?.getAttribute('href') || '';
        link.setAttribute('target', href.includes('http') ? '_blank' : '_self');
      });

      rightCol.appendChild(container);
    }
  );

  // Final Render
  wrapper.append(leftCol, rightCol);
  eyesection.appendChild(wrapper);
  decorateIcons(eyesection);
  decorateModals(eyesection);

  if (!isEditorMode()) {
    block.textContent = '';
  }
  block.append(eyesection);
}

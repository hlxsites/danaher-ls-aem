import {
  div,
  p,
  h2,
  a,
  img,
  section,
  h3,
  span,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  document
    .querySelector('.insight-wrapper')
    ?.parentElement?.removeAttribute('class');
  document
    .querySelector('.insight-wrapper')
    ?.parentElement?.removeAttribute('style');
  const getText = (prop, el = block) => el.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() || '';

  const getHTML = (prop, el = block) => el.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || '';

  // Extract top-level title/description
  const leftTitle = getText('titleText');
  const leftDescHTML = getHTML('description');

  // Create structured JSON from insight items
  const itemElements = [
    ...block.querySelectorAll('[data-aue-model="insight-item"]'),
  ];
  const insightItems = itemElements.map((item) => {
    const title = getText('lefttitle', item);
    const description = getText('leftDes', item);
    const linkUrl = item.querySelector('a').textContent.trim();
    const linkLabel = getText('linklabel', item);
    const imgEl = item.querySelector('img[data-aue-prop="fileReference"]');
    const imgSrc = imgEl?.getAttribute('src') || '';
    const fullImgSrc = imgSrc && !imgSrc.startsWith('http')
      ? `${window.location.origin}${imgSrc}`
      : imgSrc;

    return {
      title,
      description,
      linkUrl,
      linkLabel,
      imgSrc: fullImgSrc,
    };
  });

  // DOM Rendering
  const eyesection = section({
    class: 'dhls-container md:p-0 dhls-mobile-spacing !pt-12',
  });
  const wrapper = div({ class: 'flex flex-col md:flex-row gap-6' });

  // LEFT COLUMN
  const leftCol = div(
    { class: 'w-full md:w-1/2 pr-0 md:pr-6' },
    h2(
      { class: 'text-2xl md:text-3xl font-semibold mb-4 text-black' },
      leftTitle,
    ),
    div(
      { class: 'text-base text-gray-700 leading-relaxed' },
      ...Array.from(
        new DOMParser().parseFromString(leftDescHTML, 'text/html').body
          .childNodes,
      ),
    ),
  );

  // RIGHT COLUMN
  const rightCol = div({
    class:
      'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-0 md:pl-6',
  });

  insightItems.forEach(
    ({
      title, description, linkUrl, linkLabel, imgSrc,
    }, ind) => {
      const imageEl = imgSrc
        ? img({
          src: imgSrc,
          alt: title,
          class: 'w-12 mt-[2px] object-contain flex-shrink-0',
        })
        : null;

      const container = div(
        {
          class: `py-6 flex gap-4 ${ind === 0 ? 'pt-0' : ''} ${
            ind === insightItems.length - 1 ? 'pb-0' : ''
          }  `,
        }, // Removed items-start to fix icon alignment
        ...(imageEl ? [imageEl] : []),
        div(
          { class: 'flex flex-col' },
          h3({ class: 'text-lg font-semibold text-black mb-1' }, title),
          p({ class: 'text-sm text-gray-700 mb-3' }, description),
          a(
            {
              href: linkUrl,
              class:
                'text-danaherpurple-500 text-base font-semibold hover:underline flex items-center gap-1',
            },
            linkLabel,
            span({
              class:
                'icon icon-arrow-right  w-4 h-4 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
            }),
          ),
        ),
      );

      rightCol.appendChild(container);
    },
  );

  // Final Assembly
  wrapper.append(leftCol, rightCol);
  eyesection.appendChild(wrapper);
  decorateIcons(eyesection);
  block.append(eyesection);
  // Hide authored content
  [...block.children].forEach((child) => {
    if (!child.contains(eyesection)) {
      child.style.display = 'none';
    }
  });
}

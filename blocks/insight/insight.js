import {
  div, p, h2, a, img, section, h3, span
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const getText = (prop, el = block) =>
    el.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() || '';

  const getHTML = (prop, el = block) =>
    el.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || '';

  // Extract top-level title/description
  const leftTitle = getText('titleText');
  const leftDescHTML = getHTML('description');

  // Step 1–2: Create structured JSON from insight items
  const itemElements = [...block.querySelectorAll('[data-aue-model="insight-item"]')];
  const insightItems = itemElements.map((item) => {
    const title = getText('lefttitle', item);
    const description = getText('leftDes', item); // plain text
    const linkText = getText('link', item);
    const imgEl = item.querySelector('img[data-aue-prop="fileReference"]');
    const imgSrc = imgEl?.getAttribute('src') || '';
    const fullImgSrc = imgSrc && !imgSrc.startsWith('http') ? `${window.location.origin}${imgSrc}` : imgSrc;

    return {
      title,
      description,
      linkText,
      imgSrc: fullImgSrc,
    };
  });

  // === DOM Rendering ===
  const eyesection = section({ class: 'max-w-[1200px] mx-auto' });
  const wrapper = div({ class: 'flex flex-col md:flex-row gap-6' });

  // === LEFT COLUMN ===
  const leftCol = div(
    { class: 'w-full md:w-1/2 pr-0 md:pr-6' },
    h2({ class: 'text-2xl md:text-3xl font-semibold mb-4 text-black' }, leftTitle),
    div(
      { class: 'text-base text-gray-700 leading-relaxed' },
      ...Array.from(new DOMParser().parseFromString(leftDescHTML, 'text/html').body.childNodes)
    )
  );

  // === RIGHT COLUMN (Using JSON) ===
  const rightCol = div({
    class: 'w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-0 md:pl-6',
  });

  insightItems.forEach(({ title, description, linkText, imgSrc }) => {
    const imageEl = imgSrc
      ? img({
          src: imgSrc,
          alt: title,
          class: 'w-6 h-6 mt-1 object-contain flex-shrink-0',
        })
      : null;

    const container = div(
      { class: 'py-6 flex items-start gap-4' },
      ...(imageEl ? [imageEl] : []),
      div(
        { class: 'flex flex-col' },
        h3({ class: 'text-lg font-semibold text-black mb-1' }, title),
        p({ class: 'text-sm text-gray-700 mb-3' }, description),
        a(
          {
            href: '#',
            class: 'text-purple-700 text-sm font-semibold hover:underline flex items-center gap-1'
          },
          linkText,
          span({ class: 'ml-1' }, '→')
        )
      )
    );

    rightCol.appendChild(container);
  });

  // Assemble and insert
  wrapper.append(leftCol, rightCol);
  eyesection.appendChild(wrapper);
  block.appendChild(eyesection);

  // Hide raw authored HTML
  [...block.children].forEach((child) => {
    if (!child.contains(eyesection)) {
      child.style.display = 'none';
    }
  });
}

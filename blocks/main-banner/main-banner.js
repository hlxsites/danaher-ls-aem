import {
  div, p, img, h2, a, button,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  const right = div({ class: 'md:w-1/2 flex flex-col items-center justify-center bg-gray-50 p-8' });

  // Static content
  const imageHeading = 'SCIEX Triple Quad 6500+ system';
  const subheadings = [
    { text: 'Capillary Electrophoresis Systems', href: '#' },
    { text: 'Triple Quad', href: '#' },
  ];
  const description = 'The QTRAP 6500+ offers revolutionary sensitivity, speed, and performance for your most challenging methods.';
  const imageUrl = 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/sciex-biophase-8800-capillary-electrophoresis-system-big-hero.webp';

  // Build DOM elements
  const imageHeadingEl = h2({ class: 'text-xl font-semibold text-gray-900 text-center mb-2' }, imageHeading);
  const subheadingsEl = div({ class: 'flex justify-center space-x-4 text-sm text-purple-600 font-medium mb-2' },
    ...subheadings.map(({ text, href }) => a({ href, class: 'hover:underline' }, text))
  );
  const descriptionEl = p({ class: 'text-center text-gray-600 mb-4 px-4 md:px-16' }, description);
  const imageEl = img({
    class: 'w-full max-w-md object-contain mb-4',
    src: imageUrl,
    alt: imageHeading,
  });
  const ctaButton = button({
    class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition mb-4',
  }, 'View Product');

  // Assemble section
  right.append(imageHeadingEl, subheadingsEl, descriptionEl, imageEl, ctaButton);
  block.appendChild(right);
}

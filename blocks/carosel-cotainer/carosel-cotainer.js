import { div, p, a } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const [titleDescWrap, imageWrap, ctaWrap] = block.children;

  const title = titleDescWrap?.querySelector('p[data-aue-prop="brand_title"]');
  const desc = titleDescWrap?.querySelector('p[data-aue-prop="brand_description"]');
  const cta = ctaWrap?.querySelector('p[data-aue-prop="link"]');

  block.className = 'carousel-left w-full sm:w-1/2 p-6 flex flex-col justify-center items-start text-left';

  block.innerHTML = '';
  const content = div({ class: 'max-w-md' },
    title && p({ class: 'text-3xl font-semibold text-gray-900 mb-4' }, title.textContent),
    desc && p({ class: 'text-sm text-gray-700 mb-6' }, desc.textContent),
    cta && a({ href: '#', class: 'px-6 py-2 bg-danaherpurple-500 text-white rounded-full text-sm font-semibold' }, cta.textContent),
  );
  block.append(content);
}

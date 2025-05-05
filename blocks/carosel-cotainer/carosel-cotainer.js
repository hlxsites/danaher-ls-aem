import { div, p, img, h1, button } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  const left = div({ class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' },
    img({
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/SCIEX_logo.svg/2560px-SCIEX_logo.svg.png',
      alt: 'SCIEX Logo',
      class: 'h-8 w-auto',
    }),
    h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900' }, 'The power of precision'),
    p({ class: 'text-gray-600' },
      'There, where it counts. Time and time again. Providing the precision detection and quantitation of molecules needed for scientists to make discoveries that change the world.'),
    button({
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition',
    }, 'Browse Categories'),
  );

  block.appendChild(left);
}

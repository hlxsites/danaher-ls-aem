import {
  div, p, img, h1, button
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = "";

  const container = div({
    class: 'flex flex-col md:flex-row h-screen bg-white',
  });

  const bannerInfo = [
    {
      heading: "The world leader in\nmicroscopes and scientific\ninstruments",
      buttonText: "Browse Categories",
    },
  ];
  const { heading, buttonText } = bannerInfo[0];

  // Left Section
  const left = div(
    { class: 'md:w-1/2 flex flex-col justify-center items-start px-10 py-12 space-y-6' },
    p({ class: 'text-sm text-indigo-600 font-medium' }, 'Leica Microsystems'),
    h1({ class: 'text-3xl md:text-4xl font-semibold text-gray-900 whitespace-pre-line' }, heading),
    button({
      class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition'
    }, buttonText)
  );

  // Right Section
  const right = div(
    { class: 'md:w-1/2 flex items-center justify-center bg-gray-50 p-8' },
    img({
      src: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/leica-banner.webp',
      alt: 'Leica Microsystems Logo',
      class: 'w-3/4 max-w-md object-contain'
    })
  );

  container.append(left, right);
  block.appendChild(container);
}

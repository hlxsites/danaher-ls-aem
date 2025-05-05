import {
  div, p, img, h2, a, button, span,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.textContent = '';

  const slides = [
    {
      imageHeading: 'SCIEX Triple Quad 6500+ system',
      subheadings: [
        { text: 'Capillary Electrophoresis Systems', href: '#' },
        { text: 'Triple Quad', href: '#' },
      ],
      description: 'The QTRAP 6500+ offers revolutionary sensitivity, speed, and performance for your most challenging methods.',
      image: 'https://feature-EM1-T14--danaher-ls-aem--hlxsites.aem.page/icons/sciex-biophase-8800-capillary-electrophoresis-system-big-hero.webp',
    },
    {
      imageHeading: 'SCIEX Triple Quad 7500 system',
      subheadings: [
        { text: 'High Resolution Instruments', href: '#' },
        { text: 'Triple Quad', href: '#' },
      ],
      description: 'The QTRAP 7500 delivers unmatched sensitivity and selectivity in a robust and compact form.',
      image: 'https://via.placeholder.com/600x400?text=SCIEX+7500',
    },
    {
      imageHeading: 'SCIEX Triple Quad 8500 system',
      subheadings: [
        { text: 'Precision Applications', href: '#' },
        { text: 'Triple Quad', href: '#' },
      ],
      description: 'The 8500 model is designed for demanding labs with its high-throughput capabilities.',
      image: 'https://via.placeholder.com/600x400?text=SCIEX+8500',
    },
  ];

  let currentSlide = 0;

  const right = div({ class: 'md:w-1/2 flex flex-col items-center justify-center bg-gray-50 p-8' });

  const imageHeadingEl = h2({ class: 'text-xl font-semibold text-gray-900 text-center mb-2' });
  const subheadingsEl = div({ class: 'flex justify-center space-x-4 text-sm text-purple-600 font-medium mb-2' });
  const descriptionEl = p({ class: 'text-center text-gray-600 mb-4 px-4 md:px-16' });
  const imageEl = img({ class: 'w-full max-w-md object-contain mb-4', alt: '' });
  const ctaButton = button({
    class: 'bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition mb-4',
  }, 'View Product');

  const navControls = div({ class: 'flex items-center gap-4 justify-center' });
  const prevButton = button({
    class: 'w-10 h-10 bg-gray-300 hover:bg-gray-400 text-black rounded-full flex items-center justify-center',
    'aria-label': 'Previous',
  }, '←');
  const nextButton = button({
    class: 'w-10 h-10 bg-gray-300 hover:bg-gray-400 text-black rounded-full flex items-center justify-center',
    'aria-label': 'Next',
  }, '→');
  const slideNumber = span({ class: 'text-sm font-bold text-gray-700' });

  navControls.append(prevButton, slideNumber, nextButton);
  right.append(imageHeadingEl, subheadingsEl, descriptionEl, imageEl, ctaButton, navControls);
  block.appendChild(right);

  function renderSlide(index) {
    const slide = slides[index];

    imageHeadingEl.textContent = slide.imageHeading;

    subheadingsEl.innerHTML = '';
    slide.subheadings.forEach(({ text, href }) => {
      subheadingsEl.appendChild(
        a({ href, class: 'hover:underline' }, text)
      );
    });

    descriptionEl.textContent = slide.description;
    imageEl.src = slide.image;
    imageEl.alt = slide.imageHeading;
    slideNumber.textContent = `${index + 1} / ${slides.length}`;
  }

  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    renderSlide(currentSlide);
  });

  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlide(currentSlide);
  });

  renderSlide(currentSlide);
}

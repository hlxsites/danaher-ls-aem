import { div, p, img, a, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const origin = window.location.origin;
  const wrappers = block.querySelectorAll('.tiny-carousel-wrapper');

  const sectionWrapper = div({ class: 'flex flex-col lg:flex-row w-full gap-4' });

  wrappers.forEach((wrapper, index) => {
    const items = wrapper.querySelectorAll('[data-aue-model="tiny-carousel-item"]');
    const authoredTitle = wrapper.querySelector('[data-aue-prop="titleText"]')?.textContent?.trim() || 'Browse';

    let currentIndex = 0;
    const visibleCards = 2;

    const renderedCarousel = div({
      class: `w-full lg:w-1/2 p-4 ${index === 0 ? 'bg-gray-100' : 'bg-gray-200'} rounded`
    });

    const scrollContainer = div({
      class: 'flex transition-all duration-300 ease-in-out space-x-4',
      style: 'transform: translateX(0);'
    });

    items.forEach((item) => {
      const imgEl = item.querySelector('img[data-aue-label="Image"]');
      const image = imgEl?.getAttribute('src') || '';
      const fullImage = image.startsWith('http') ? image : `${origin}${image}`;

      const brand = item.querySelector('[data-aue-prop="brandTitle"]')?.textContent?.trim() || '';
      const title = item.querySelector('[data-aue-prop="card_title"]')?.textContent?.trim() || '';
      const linkText = item.querySelector('[data-aue-prop="card_hrefText"]')?.textContent?.trim() || '';

      const card = div({ class: 'min-w-[48%] w-[48%] flex-shrink-0 bg-white rounded-md border p-3 space-y-2 h-[260px]' },
        fullImage && img({ src: fullImage, alt: title, class: 'w-full h-24 object-contain' }),
        brand && p({ class: 'text-xs font-bold text-purple-600' }, brand),
        title && p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, title),
        linkText && a({ href: '#', class: 'text-purple-600 text-sm font-medium' }, linkText)
      );

      scrollContainer.appendChild(card);
    });

    const leftArrow = span({
      class: 'w-8 h-8 mr-2 border rounded-full flex items-center justify-center cursor-pointer transition opacity-50 pointer-events-none text-blue-600 border-blue-600',
      title: 'Scroll Left'
    }, '←');

    const rightArrow = span({
      class: 'w-8 h-8 border rounded-full flex items-center justify-center cursor-pointer transition text-blue-600 border-blue-600',
      title: 'Scroll Right'
    }, '→');

    const scrollWrapper = div({ class: 'overflow-hidden' }, scrollContainer);

    const titleRow = div({ class: 'flex justify-between items-center mb-4' },
      p({ class: 'text-lg font-semibold text-gray-800' }, authoredTitle),
      div({ class: 'flex items-center' }, leftArrow, rightArrow)
    );

    const totalCards = items.length;

    const updateArrows = () => {
      if (currentIndex <= 0) {
        leftArrow.classList.add('opacity-50', 'pointer-events-none');
      } else {
        leftArrow.classList.remove('opacity-50', 'pointer-events-none');
      }

      if (currentIndex >= totalCards - visibleCards) {
        rightArrow.classList.add('opacity-50', 'pointer-events-none');
      } else {
        rightArrow.classList.remove('opacity-50', 'pointer-events-none');
      }
    };

    const scrollToIndex = (index) => {
      const card = scrollContainer.children[0];
      const cardWidth = card.offsetWidth + 16; // 16px = space-x-4
      scrollContainer.style.transform = `translateX(-${cardWidth * index}px)`;
      currentIndex = index;
      updateArrows();
    };

    leftArrow.addEventListener('click', () => {
      if (currentIndex > 0) scrollToIndex(currentIndex - 2);
    });

    rightArrow.addEventListener('click', () => {
      if (currentIndex < totalCards - visibleCards) scrollToIndex(currentIndex + 2);
    });

    setTimeout(updateArrows, 100);

    renderedCarousel.append(titleRow, scrollWrapper);
    sectionWrapper.append(renderedCarousel);

    // ✅ Hide raw authored children except rendered block
    [...wrapper.children].forEach((child) => {
      if (!child.classList.contains('tiny-carousel-rendered')) {
        child.style.display = 'none';
      }
    });
  });

  block.textContent = '';
  block.appendChild(sectionWrapper);
}

import { div, p, img, a, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const wrapper = block.closest('.tiny-carousel-wrapper');
  const items = wrapper?.querySelectorAll('[data-aue-model="tiny-carousel-item"]') || [];

  if (items.length === 0) return;

  // Section container
  const section = div({ class: 'w-full bg-gray-100 p-4 rounded-lg' });

  // Title Row
  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-lg font-semibold text-gray-800' }, 'Best Offers / New Arrivals')
  );

  const leftArrow = span({
    class: 'w-8 h-8 mr-2 border rounded-full flex items-center justify-center cursor-pointer transition opacity-50 pointer-events-none text-blue-600 border-blue-600',
    title: 'Scroll Left'
  }, '←');

  const rightArrow = span({
    class: 'w-8 h-8 border rounded-full flex items-center justify-center cursor-pointer transition text-blue-600 border-blue-600',
    title: 'Scroll Right'
  }, '→');

  const arrowRow = div({ class: 'flex items-center' }, leftArrow, rightArrow);
  titleRow.appendChild(arrowRow);

  // Carousel Wrapper
  const scrollWrapper = div({ class: 'overflow-hidden' });
  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out space-x-4',
    style: 'transform: translateX(0);',
  });

  // Create cards from authored items
  const cards = Array.from(items).map((item) => {
    const image = item.querySelector('[data-aue-prop="fileReference"]')?.getAttribute('src') || '';
    const brand = item.querySelector('[data-aue-prop="brandTitle"]')?.textContent.trim() || '';
    const title = item.querySelector('[data-aue-prop="card_title"]')?.textContent.trim() || '';
    const cta = item.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || '';

    return div({ class: 'min-w-[48%] w-[48%] flex-shrink-0 bg-white rounded-md border p-3 space-y-2 h-[260px]' },
      image && img({ src: image, alt: title, class: 'w-full h-24 object-contain' }),
      brand && p({ class: 'text-xs text-purple-600 font-medium' }, brand),
      title && p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, title),
      cta && a({ href: '#', class: 'text-purple-600 text-sm font-medium' }, `${cta} →`)
    );
  });

  // Append cards
  cards.forEach(card => scrollContainer.appendChild(card));

  // Carousel functionality
  let currentIndex = 0;
  const visibleCards = 2;
  const totalCards = cards.length;

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
    const cardWidth = card.offsetWidth + 16; // gap of space-x-4
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

  setTimeout(updateArrows, 100); // initialize arrows

  scrollWrapper.appendChild(scrollContainer);
  section.append(titleRow, scrollWrapper);
  block.appendChild(section);
}

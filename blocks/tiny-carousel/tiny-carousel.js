import { div, p, img, a, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // === Extract authored values ===
  const rootModel = block.querySelector('[data-aue-model="tiny-carousel"]');
  const authoredTitle = rootModel?.querySelector('p[data-aue-prop="titleText"]')?.textContent?.trim();

  const items = block.querySelectorAll('[data-aue-model="tiny-carousel-item"]');
  const data = [];

  items.forEach((item) => {
    const imgEl = item.querySelector('img[data-aue-prop="fileReference"]');
    const brand = item.querySelector('p[data-aue-prop="brandTitle"]')?.textContent?.trim();
    const title = item.querySelector('p[data-aue-prop="card_title"]')?.textContent?.trim();
    const linkText = item.querySelector('p[data-aue-prop="card_hrefText"]')?.textContent?.trim();

    if (imgEl && title && brand && linkText) {
      data.push({
        image: imgEl.src,
        brand,
        title,
        linkText,
      });
    }
  });

  // ✅ Keep original content for Universal Editor — just hide the children
  block.querySelectorAll('[data-aue-model]').forEach((el) => {
    el.style.display = 'none';
  });

  // === Build carousel UI ===
  const sectionCard = div({ class: 'w-full bg-gray-100 p-4 rounded-lg' });

  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    authoredTitle && p({ class: 'text-lg font-semibold text-gray-800' }, authoredTitle),
  );

  const leftArrow = span({
    class: 'w-8 h-8 mr-2 border rounded-full flex items-center justify-center cursor-pointer transition opacity-50 pointer-events-none text-blue-600 border-blue-600',
    title: 'Scroll Left',
  }, '←');

  const rightArrow = span({
    class: 'w-8 h-8 border rounded-full flex items-center justify-center cursor-pointer transition text-blue-600 border-blue-600',
    title: 'Scroll Right',
  }, '→');

  const arrowRow = div({ class: 'flex items-center' }, leftArrow, rightArrow);
  titleRow.appendChild(arrowRow);

  const scrollWrapper = div({ class: 'overflow-hidden' });

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out space-x-4',
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = 2;
  const totalCards = data.length;

  data.forEach((item) => {
    const card = div({ class: 'min-w-[48%] w-[48%] flex-shrink-0 bg-white rounded-md border p-3 space-y-2 h-[260px]' },
      img({ src: item.image, alt: item.title, class: 'w-full h-24 object-contain' }),
      p({ class: 'text-xs text-purple-600 font-bold' }, item.brand),
      p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, item.title),
      a({ href: '#', class: 'text-blue-600 text-sm font-medium' }, item.linkText),
    );
    scrollContainer.appendChild(card);
  });

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
    const cardWidth = card.offsetWidth + 16;
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

  scrollWrapper.appendChild(scrollContainer);
  sectionCard.append(titleRow, scrollWrapper);
  block.appendChild(sectionCard);
}

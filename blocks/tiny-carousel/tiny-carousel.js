import { div, p, img, a, span } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const section = block.closest('.tiny-carousel-container');
  if (section) section.classList.add('flex', 'gap-6');

  const index = Array.from(document.querySelectorAll('.tiny-carousel')).indexOf(block);
  const bgColor = index === 0 ? 'bg-gray-100' : 'bg-gray-200';

  block.classList.add('w-full', 'lg:w-1/2', 'p-6', 'rounded-xl', bgColor, 'border-b', 'border-gray-300');

  const items = block.querySelectorAll('[data-aue-model="tiny-carousel-item"]');
  const titleText = block.querySelector('[data-aue-prop="titleText"]')?.textContent?.trim() || 'Continue Browsing';

  const authoredWrapper = div({ class: 'w-full tiny-carousel-rendered flex flex-col gap-4' });

  let currentIndex = 0;
  const visibleCards = 2;

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out space-x-4',
    style: 'transform: translateX(0);',
  });

  const origin = window.location.origin;

  items.forEach((item) => {
    const imagePath = item.querySelector('img[data-aue-prop="fileReference"]')?.getAttribute('src') || '';
    const image = imagePath ? `${origin}${imagePath}` : '';

    const brand = item.querySelector('[data-aue-prop="brandTitle"]')?.textContent?.trim() || '';
    const title = item.querySelector('[data-aue-prop="card_title"]')?.textContent?.trim() || '';
    const linkText = item.querySelector('[data-aue-prop="card_hrefText"]')?.textContent?.trim() || '';

    const card = div({ class: 'min-w-[48%] w-[48%] flex-shrink-0 bg-white rounded-md border p-4 space-y-2 h-[260px]' },
      image && img({ src: image, alt: title, class: 'w-full h-24 object-contain' }),
      brand && p({ class: 'text-xs font-semibold text-purple-600' }, brand),
      title && p({ class: 'text-sm text-black font-normal leading-tight' }, title),
      linkText && a({ href: '#', class: 'text-sm font-medium text-purple-600 flex items-center gap-1' },
        linkText,
        span({ class: 'icon icon-arrow-right w-4 h-4' })
      )
    );

    scrollContainer.appendChild(card);
  });

  const leftArrow = span({
    class: 'w-8 h-8 mr-2 border border-purple-600 rounded-full flex items-center justify-center cursor-pointer transition opacity-50 pointer-events-none',
    title: 'Scroll Left'
  }, span({ class: 'icon icon-arrow-circle-left w-4 h-4 text-purple-600' }));

  const rightArrow = span({
    class: 'w-8 h-8 border border-purple-600 rounded-full flex items-center justify-center cursor-pointer transition',
    title: 'Scroll Right'
  }, span({ class: 'icon icon-arrow-circle-right w-4 h-4 text-purple-600' }));

  const scrollWrapper = div({ class: 'overflow-hidden' }, scrollContainer);

  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-base font-semibold text-black' }, titleText),
    div({ class: 'flex items-center' }, leftArrow, rightArrow)
  );

  authoredWrapper.append(titleRow, scrollWrapper);
  block.append(authoredWrapper);

  const totalCards = items.length;

  const updateArrows = () => {
    leftArrow.classList.toggle('opacity-50', currentIndex <= 0);
    leftArrow.classList.toggle('pointer-events-none', currentIndex <= 0);
    rightArrow.classList.toggle('opacity-50', currentIndex >= totalCards - visibleCards);
    rightArrow.classList.toggle('pointer-events-none', currentIndex >= totalCards - visibleCards);
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

  // Optional: hide raw authored content
  // [...block.children].forEach((child) => {
  //   if (!child.classList.contains('tiny-carousel-rendered')) {
  //     child.style.display = 'none';
  //   }
  // });
}

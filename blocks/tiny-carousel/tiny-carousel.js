import { div, p, img, a, span } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  // Add container styling
  const section = block.closest('.tiny-carousel-container');
  if (section) section.classList.add('flex', 'gap-6');

  const index = Array.from(document.querySelectorAll('.tiny-carousel')).indexOf(block);
  const bgColor = index === 0 ? 'bg-gray-100' : 'bg-gray-200';
  block.classList.add('w-full', 'lg:w-1/2', 'p-4', 'rounded-md', bgColor);

  // Title from authored content
  const titleText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim() || 'Continue Browsing';
  const authoredWrapper = div({ class: 'w-full tiny-carousel-rendered flex flex-col gap-4' });

  // Scroll logic
  let currentIndex = 0;
  const visibleCards = 2;
  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out space-x-4',
    style: 'transform: translateX(0);',
  });

  // 🟣 Step 1: Extract authored product IDs
  const productIdRaw = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = [...new Set(productIdRaw.split(',').map(id => id.trim()).filter(Boolean))];

  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'Continue';

  // 🟣 Step 2: Fetch API responses
  const responses = await Promise.all(productIds.map(async (id) => {
    try {
      const res = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return { id, data };
    } catch (e) {
      console.error(`❌ Failed to fetch for ${id}:`, e);
      return null;
    }
  }));

  // 🟣 Step 3: Render cards
  responses.filter(Boolean).forEach(({ id, data }) => {
    const image = Array.isArray(data.images) && data.images[0] || '';
    const brand = data.ec_brand || '';
    const title = data.title || '';
    const clickUri = data.clickUri || '#';

    const card = div({ class: 'min-w-[48%] w-[48%] flex-shrink-0 bg-white rounded-md border p-3 space-y-2 h-[260px]' },
      image && img({ src: image, alt: title, class: 'w-full h-24 object-contain' }),
      brand && p({ class: 'text-xs font-bold text-purple-600' }, brand),
      title && p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, title),
      a({
        href: clickUri,
        class: 'text-purple-600 text-sm font-medium flex items-center gap-1',
      }, linkText, span({ class: 'ml-1' }, '→'))
    );

    scrollContainer.appendChild(card);
  });

  // Arrows
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
    p({ class: 'text-lg font-semibold text-gray-800' }, titleText),
    div({ class: 'flex items-center' }, leftArrow, rightArrow)
  );

  authoredWrapper.append(titleRow, scrollWrapper);
  block.append(authoredWrapper);

  // Scroll logic
  const totalCards = scrollContainer.children.length;
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

  // Hide authored HTML (preserve Universal Editor)
  [...block.children].forEach((child) => {
    if (!child.classList.contains('tiny-carousel-rendered')) {
      child.style.display = 'none';
    }
  });
}

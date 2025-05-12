import { div, p, h1, img, button, span, a } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const items = [...block.querySelectorAll("[data-aue-model='top-selling-item']")];
  const headingText = block.querySelector('[data-aue-label="HeaderTitle"]')?.textContent?.trim() || 'Top Selling Products';
  const rawIdText = block.querySelector('[data-aue-prop="productid"]')?.textContent?.trim() || '';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent?.trim() || 'View Details';

  const productIds = rawIdText.split(',').map((id) => id.trim()).filter(Boolean);

  const productCache = {};
  const matchedProducts = await Promise.all(
    productIds.map(async (id) => {
      if (productCache[id]) return productCache[id];

      try {
        const res = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
        if (!res.ok) return null;

        const data = await res.json();
        const product = data.results?.[0];
        if (!product) return null;

        const image = product.raw?.images?.[0] || '';
        const productData = {
          id,
          image,
          brand: Array.isArray(product.raw?.ec_brand) ? product.raw.ec_brand[0] : '',
          title: product.title || '',
          url: product.clickUri || '#',
        };

        productCache[id] = productData;
        return productData;
      } catch (e) {
        console.error(`❌ Error fetching product ${id}:`, e);
        return null;
      }
    })
  );

  // === Carousel setup ===
  const carouselContainer = div({ class: 'carousel-container flex flex-col w-full py-6 justify-center' });
  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out space-x-4',
    style: 'transform: translateX(0);',
  });
  const scrollWrapper = div({ class: 'overflow-hidden' }, scrollContainer);

  let currentIndex = 0;
  const visibleCards = 4;

  matchedProducts.forEach((product) => {
    if (!product) return;
    const { image, brand, title, url } = product;

    const card = div({
      class: 'min-w-[25%] w-[25%] flex-shrink-0 bg-white rounded-lg border p-5 space-y-4 h-[360px]',
    },
      img({ src: image, alt: title, class: 'w-full h-32 object-contain' }),
      p({ class: 'text-xs font-bold text-purple-600' }, brand),
      p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, title),
      a({ href: url, class: 'text-purple-600 text-sm font-medium flex items-center gap-1' },
        linkText,
        span({ class: 'ml-1' }, '→')
      )
    );

    scrollContainer.appendChild(card);
  });

  const leftArrow = span({
    class: 'w-8 h-8 mr-2 border rounded-full flex items-center justify-center cursor-pointer transition opacity-50 pointer-events-none text-blue-600 border-blue-600',
    title: 'Scroll Left',
  }, '←');

  const rightArrow = span({
    class: 'w-8 h-8 border rounded-full flex items-center justify-center cursor-pointer transition text-blue-600 border-blue-600',
    title: 'Scroll Right',
  }, '→');

  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-lg font-semibold text-gray-800' }, headingText),
    div({ class: 'flex items-center' }, leftArrow, rightArrow)
  );

  carouselContainer.append(titleRow, scrollWrapper);
  block.append(carouselContainer);

  const totalCards = scrollContainer.children.length;

  const updateArrows = () => {
    leftArrow.classList.toggle('opacity-50', currentIndex <= 0);
    leftArrow.classList.toggle('pointer-events-none', currentIndex <= 0);
    rightArrow.classList.toggle('opacity-50', currentIndex >= totalCards - visibleCards);
    rightArrow.classList.toggle('pointer-events-none', currentIndex >= totalCards - visibleCards);
  };

  const scrollToIndex = (index) => {
    const card = scrollContainer.children[0];
    if (!card) return;

    const cardWidth = card.offsetWidth + 16; // includes gap
    scrollContainer.style.transform = `translateX(-${cardWidth * index}px)`;
    currentIndex = index;
    updateArrows();
  };

  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - visibleCards);
  });

  rightArrow.addEventListener('click', () => {
    if (currentIndex < totalCards - visibleCards) scrollToIndex(currentIndex + visibleCards);
  });

  setTimeout(updateArrows, 100);

  // Hide raw authored DOM
  [...block.children].forEach((child) => {
    if (!carouselContainer.contains(child)) {
      child.style.display = 'none';
    }
  });
}

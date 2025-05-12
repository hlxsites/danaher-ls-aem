import { div, p, img, a, span } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.classList.add('max-w-[2000px]', 'mx-auto', 'flex', 'gap-4', 'justify-center');
  }

  const section = block.closest('.top-selling');
  if (section) section.classList.add('flex', 'gap-6', 'justify-center');

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim() || 'Top Selling Products';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';

  const authoredWrapper = div({ class: 'w-full top-selling-rendered flex flex-col gap-4' });
  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-2',
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = 4;

  const rawIdText = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIdText.split(',').map(id => id.trim()).filter(Boolean);

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

        const image = product.raw?.images?.[0];
        const description = product.raw?.ec_shortdesc || product.raw?.description || '';

        const productData = {
          id,
          image,
          description,
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

  matchedProducts.forEach((product) => {
    if (!product || !product.image) return;
    const { image, description, title, url } = product;

    const card = div({
      class: 'min-w-[25%] w-[25%] flex-shrink-0 bg-white rounded-lg border p-5 space-y-2 h-[380px]'
    },
      img({ src: image, alt: title, class: 'w-full h-32 object-contain' }),
      p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, title),
      description && p({ class: 'text-xs text-gray-700' }, description),
      a({
        href: url,
        class: 'text-purple-600 text-sm font-medium flex items-center gap-1',
      }, linkText, span({ class: 'ml-1' }, '→'))
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
    p({ class: 'text-lg font-semibold text-gray-800' }, headingText),
    div({ class: 'flex items-center' }, leftArrow, rightArrow)
  );

  authoredWrapper.append(titleRow, scrollWrapper);
  block.append(authoredWrapper);

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
    const cardWidth = card.offsetWidth + 8;
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

  [...block.children].forEach((child) => {
    if (!child.classList.contains('top-selling-rendered')) {
      child.style.display = 'none';
    }
  });
}

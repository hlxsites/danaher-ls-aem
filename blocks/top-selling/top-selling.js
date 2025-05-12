import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

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

  const fetchProductDetails = async (id) => {
    try {
      const res = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      const product = data.results?.[0];
      if (!product) return null;

      return {
        id,
        title: product.title || '',
        url: product.clickUri || '#',
        image: product.raw?.images?.[0] || '',
        description: product.raw?.ec_shortdesc || product.raw?.description || '',
        sku: product.raw?.sku || '',
      };
    } catch (e) {
      console.error(`❌ Error fetching product ${id}:`, e);
      return null;
    }
  };

  const fetchSkuDetails = async (sku) => {
    try {
      const res = await fetch(`https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`);
      if (!res.ok) return null;
      const data = await res.json();
      const hasCart = data.attributes?.some(attr => attr.name === 'show_add_to_cart');
      return {
        showAddToCart: hasCart,
        salePrice: data.salePrice,
        minOrderQty: data.minOrderQuantity
      };
    } catch (e) {
      console.error(`❌ Error fetching SKU ${sku}:`, e);
      return null;
    }
  };

  for (const id of productIds) {
    const product = await fetchProductDetails(id);
    if (!product || !product.image) continue;

    const skuDetails = await fetchSkuDetails(product.sku);
    const cardChildren = [
      img({ src: product.image, alt: product.title, class: 'w-full h-32 object-contain' }),
      p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, product.title)
    ];

    if (skuDetails?.showAddToCart) {
      cardChildren.push(
        div({ class: 'text-sm text-black' }, `Unit of Measure: 1 /Bundle`),
        div({ class: 'text-sm text-black' }, `Min. Order Qty: ${skuDetails.minOrderQty || '-'}`),
        div({ class: 'text-2xl font-bold text-black' }, `$${skuDetails.salePrice?.toLocaleString() || '0.00'}`),
        div({ class: 'flex gap-2' },
          div({ class: 'w-14 px-4 py-1.5 bg-white rounded-md outline outline-1 outline-gray-300 text-center text-black' }, '1'),
          button({ class: 'w-20 px-4 py-2 bg-violet-600 text-white rounded-full' }, 'Buy'),
          button({ class: 'w-20 px-4 py-2 text-violet-600 rounded-full border border-violet-600' }, 'Quote')
        )
      );
    } else {
      cardChildren.push(
        p({ class: 'text-xs text-gray-700 bg-gray-100 p-2 rounded' }, product.description),
        button({ class: 'w-full px-4 py-2 text-violet-600 rounded-full border border-violet-600' }, 'Quote')
      );
    }

    cardChildren.push(
      a({
        href: product.url,
        class: 'text-purple-600 text-sm font-medium flex items-center gap-1 mt-2',
      }, linkText, span({ class: 'ml-1' }, '→'))
    );

    const card = div({
      class: 'min-w-[25%] w-[25%] flex-shrink-0 bg-white rounded-lg border p-5 space-y-2 h-[420px]'
    }, ...cardChildren);

    scrollContainer.appendChild(card);
  }

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

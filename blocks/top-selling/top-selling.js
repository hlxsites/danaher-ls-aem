import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.className = ''; // Remove conflicting class
    wrapper.classList.add(
      'w-full',
      'overflow-x-hidden',
      'px-4', 'md:px-10',
      'flex', 'justify-center'
    );
  }

  const headingText = 'Top Selling Products, You may also need';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-3',
    style: 'transform: translateX(0);',
  });

  const visibleCards = 4;
  let currentIndex = 0;

  const getProductInfo = async (id) => {
    try {
      const res1 = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
      const main = await res1.json();
      const product = main.results?.[0];
      if (!product) return null;

      const sku = product.raw?.sku || '';
      const res2 = await fetch(`https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`);
      const shopData = await res2.json();

      const showCart = shopData?.attributes?.some(attr => attr.name === 'show_add_to_cart' && attr.value === 'True');

      return {
        title: product.title || '',
        url: product.clickUri || '#',
        image: product.raw?.images?.[0] || '',
        description: product.raw?.ec_shortdesc || '',
        sku,
        showCart,
        price: shopData.salePrice?.value,
        minQty: shopData.minOrderQuantity,
        unitMeasure: '1/Bundle',
      };
    } catch (e) {
      console.error('Fetch error:', e);
      return null;
    }
  };

  const products = await Promise.all(productIds.map(getProductInfo));

  products.forEach((product) => {
    if (!product) return;
    const { title, url, image, description, showCart, price, unitMeasure, minQty } = product;

    const card = div({
      class: 'w-[23.5%] flex-shrink-0 bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between h-[420px]'
    });

    if (image) {
      card.append(img({
        src: image,
        alt: title,
        class: 'w-full h-24 object-contain mb-2'
      }));
    }

    card.append(p({
      class: 'text-base font-semibold text-black mb-1 line-clamp-2'
    }, title));

    if (showCart && price !== undefined) {
      card.append(p({ class: 'text-right text-lg font-bold text-black mb-1' }, `$${price.toLocaleString()}`));
      card.append(
        div({ class: 'text-sm text-gray-500' }, `Unit of Measure: ${unitMeasure}`),
        div({ class: 'text-sm text-gray-500 mb-2' }, `Min. Order Qty: ${minQty}`)
      );
    } else if (description) {
      card.append(p({ class: 'text-sm text-gray-600 mb-2 line-clamp-4' }, description));
    }

    const actions = showCart
      ? div({ class: 'flex gap-2 mt-auto items-center justify-center' },
          div({ class: 'w-12 px-2 py-1 bg-white rounded border text-center text-sm' }, '1'),
          button({ class: 'px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium' }, 'Buy'),
          button({ class: 'px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-medium' }, 'Quote')
        )
      : div({ class: 'flex justify-center mt-auto' },
          button({ class: 'px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-medium' }, 'Quote')
        );

    card.append(actions);
    card.append(
      a({ href: url, class: 'text-sm text-purple-600 font-medium mt-3 underline' }, linkText, span({ class: 'ml-1' }, '→'))
    );

    scrollContainer.appendChild(card);
  });

  const arrowBase = 'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600';

  const leftArrow = span({
    class: `${arrowBase} mr-2 opacity-50 pointer-events-none`,
    title: 'Scroll Left'
  }, '←');

  const rightArrow = span({
    class: `${arrowBase}`,
    title: 'Scroll Right'
  }, '→');

  const scrollWrapper = div({ class: 'overflow-hidden w-full' }, scrollContainer);

  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-2xl font-semibold text-gray-900' }, headingText),
    div({ class: 'flex items-center' }, leftArrow, rightArrow)
  );

  const rendered = div({
    class: 'top-selling-rendered w-full max-w-[1440px] mx-auto flex flex-col gap-4'
  }, titleRow, scrollWrapper);

  block.append(rendered);

  const updateArrows = () => {
    leftArrow.classList.toggle('opacity-50', currentIndex <= 0);
    leftArrow.classList.toggle('pointer-events-none', currentIndex <= 0);
    rightArrow.classList.toggle('opacity-50', currentIndex >= products.length - visibleCards);
    rightArrow.classList.toggle('pointer-events-none', currentIndex >= products.length - visibleCards);
  };

  const scrollToIndex = (index) => {
    const card = scrollContainer.children[0];
    if (!card) return;
    const cardWidth = card.offsetWidth + 12; // 12px ≈ gap-3
    scrollContainer.style.transform = `translateX(-${cardWidth * index}px)`;
    currentIndex = index;
    updateArrows();
  };

  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - visibleCards);
  });

  rightArrow.addEventListener('click', () => {
    if (currentIndex < products.length - visibleCards) scrollToIndex(currentIndex + visibleCards);
  });

  setTimeout(updateArrows, 100);

  [...block.children].forEach(child => {
    if (!child.classList.contains('top-selling-rendered')) {
      child.style.display = 'none';
    }
  });
}

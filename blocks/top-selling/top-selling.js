import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.classList.add('max-w-[1440px]', 'mx-auto', 'flex', 'justify-center', 'px-4', 'md:px-10');
  }

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim() || 'Top Selling Products';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-4',
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
      class: 'min-w-[25%] w-[25%] flex-shrink-0 bg-white border rounded-lg p-4 flex flex-col justify-between h-[430px]'
    });

    if (image) card.append(img({ src: image, alt: title, class: 'w-full h-32 object-contain mb-2' }));
    if (title) card.append(p({ class: 'text-base font-bold text-black mb-1' }, title));

    if (showCart && price !== undefined) {
      card.append(p({ class: 'text-right text-lg font-semibold text-black' }, `$${price.toLocaleString()}`));
    }

    if (showCart) {
      card.append(
        div({ class: 'text-sm text-gray-700 w-full' }, `Unit of Measure: ${unitMeasure}`),
        div({ class: 'text-sm text-gray-700 w-full' }, `Min. Order Qty: ${minQty}`)
      );
    } else if (description) {
      card.append(p({ class: 'text-xs text-gray-700 bg-gray-50 p-2 rounded leading-snug' }, description));
    }

    const actions = showCart
      ? div({ class: 'flex gap-2 mt-4 justify-center w-full' },
          div({ class: 'w-14 px-3 py-1.5 bg-white rounded border text-center text-sm' }, '1'),
          button({ class: 'px-4 py-2 bg-violet-600 text-white rounded-full text-sm font-medium' }, 'Buy'),
          button({ class: 'px-4 py-2 bg-white text-violet-600 border border-violet-600 rounded-full text-sm font-medium' }, 'Quote')
        )
      : div({ class: 'flex justify-center mt-4' },
          button({ class: 'w-full px-4 py-2 bg-white text-violet-600 border border-violet-600 rounded-full text-sm font-medium' }, 'Quote')
        );

    card.append(actions);
    card.append(a({ href: url, class: 'text-sm text-violet-600 font-medium mt-auto' }, linkText, span({ class: 'ml-1' }, '→')));

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
    p({ class: 'text-2xl font-semibold text-gray-800' }, headingText),
    div({ class: 'flex items-center' }, leftArrow, rightArrow)
  );

  const rendered = div({ class: 'top-selling-rendered w-full flex flex-col gap-4' }, titleRow, scrollWrapper);
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
    const cardWidth = card.offsetWidth + 16;
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

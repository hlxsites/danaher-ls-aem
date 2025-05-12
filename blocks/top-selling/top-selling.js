import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.classList.add(
      'max-w-[1440px]', 'mx-auto', 'flex', 'justify-center', 'px-4', 'md:px-10'
    );
  }

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim() || 'Top Selling Products';
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
    const mainRes = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
    const mainJson = await mainRes.json();
    const product = mainJson.results?.[0];
    if (!product) return null;

    const sku = product.raw?.sku || '';
    const secondaryRes = await fetch(`https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`);
    const secondaryJson = await secondaryRes.json();

    const showCartAttr = secondaryJson?.attributes?.find(attr => attr.name === 'show_add_to_cart');
    const showCart = showCartAttr?.value === 'True';

    return {
      title: product.title,
      url: product.clickUri,
      image: product.raw?.images?.[0] || '',
      description: product.raw?.ec_shortdesc || '',
      sku: sku,
      showCart,
      price: secondaryJson.salePrice?.value,
      minQty: secondaryJson.minOrderQuantity,
      unitMeasure: '1/Bundle',
    };
  };

  const products = await Promise.all(productIds.map(getProductInfo));

  products.forEach((product) => {
    if (!product) return;

    const {
      title, url, image, description, showCart, price,
      unitMeasure, minQty
    } = product;

    const priceBlock = price !== undefined
      ? div({ class: 'flex justify-between w-full text-sm font-semibold text-black' },
          p({}, `Unit of Measure: ${unitMeasure}`),
          p({}, `$${price.toLocaleString()}`)
        )
      : null;

    const qtyBlock = minQty !== undefined
      ? div({ class: 'text-sm text-gray-700 w-full' }, `Min. Order Qty: ${minQty}`)
      : null;

    const actions = showCart
      ? div({ class: 'flex gap-2 mt-4 w-full' },
          div({ class: 'w-12 px-3 py-1.5 bg-white rounded border text-center text-sm' }, '1'),
          button({ class: 'px-4 py-2 bg-violet-600 text-white rounded-full text-sm font-medium' }, 'Buy'),
          button({ class: 'px-4 py-2 bg-white text-violet-600 border border-violet-600 rounded-full text-sm font-medium' }, 'Quote')
        )
      : div({ class: 'flex justify-center mt-4' },
          button({ class: 'w-full px-4 py-2 bg-white text-violet-600 border border-violet-600 rounded-full text-sm font-medium' }, 'Quote')
        );

    const card = div({ class: 'w-[23%] bg-white border rounded-lg p-4 flex flex-col justify-between h-[400px] flex-shrink-0' },
      img({ src: image, alt: title, class: 'w-full h-32 object-contain mb-2' }),
      p({ class: 'text-base font-bold text-black mb-1' }, title),
      !showCart && p({ class: 'text-xs text-gray-700 bg-gray-50 p-2 rounded leading-snug' }, description),
      showCart && priceBlock,
      showCart && qtyBlock,
      actions,
      a({ href: url, class: 'text-sm text-violet-600 font-medium mt-auto self-end' }, linkText, span({ class: 'ml-1' }, '→'))
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
    const cardWidth = card.offsetWidth + 12;
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

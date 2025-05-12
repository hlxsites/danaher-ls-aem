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

  let currentIndex = 0;
  const visibleCards = 4;

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

    const priceTag = price !== undefined
      ? p({ class: 'text-xl font-semibold text-black' }, `$${price.toLocaleString()}`)
      : null;

    const detailBlock = showCart
      ? div({ class: 'flex justify-between text-sm text-gray-700 w-full' },
        p({}, `Unit of Measure: ${unitMeasure}`),
        p({}, `Min. Order Qty: ${minQty}`)
      )
      : null;

    const actions = showCart
      ? div({ class: 'flex gap-3 items-center justify-center mt-3' },
        div({ class: 'w-14 px-3 py-1.5 bg-white rounded-md outline outline-1 outline-gray-300 text-center text-black text-sm' }, '1'),
        button({ class: 'w-20 px-5 py-2 bg-violet-600 text-white rounded-full outline outline-1 outline-violet-600' }, 'Buy'),
        button({ class: 'px-5 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, 'Quote'),
      )
      : div({ class: 'w-full flex justify-center mt-3' },
        button({ class: 'w-full px-5 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, 'Quote')
      );

    const descriptionBlock = !showCart
      ? p({ class: 'text-gray-700 text-sm line-clamp-4 bg-gray-50 rounded p-2' }, description)
      : null;

    const card = div({
      class: 'w-full sm:w-[calc(25%-12px)] bg-white outline outline-1 outline-gray-300 flex flex-col p-4 space-y-3 flex-shrink-0 rounded'
    },
      img({ src: image, alt: title, class: 'h-32 w-full object-contain' }),
      p({ class: 'text-base font-bold text-black' }, title),
      priceTag,
      detailBlock,
      descriptionBlock,
      actions,
      div({ class: 'pt-2' },
        a({ href: url, class: 'text-violet-600 text-sm font-bold hover:underline' }, `${linkText} →`)
      )
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

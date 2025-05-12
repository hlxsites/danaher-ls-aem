import { div, p, img, a, span, button, input } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.classList.add('max-w-[1440px]', 'mx-auto', 'flex', 'gap-4', 'justify-center', 'px-6');
  }

  const section = block.closest('.top-selling');
  if (section) section.classList.add('flex', 'gap-6', 'justify-center', 'px-6');

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim() || 'Top Selling Products';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';

  const authoredWrapper = div({ class: 'w-full top-selling-rendered flex flex-col gap-4' });
  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out space-x-4',
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = 4;

  const rawIdText = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIdText.split(',').map(id => id.trim()).filter(Boolean);

  const productData = await Promise.all(productIds.map(async (id) => {
    try {
      const [metaRes, skuRes] = await Promise.all([
        fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`),
        fetch(`https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${id}`)
      ]);

      if (!metaRes.ok || !skuRes.ok) return null;

      const meta = await metaRes.json();
      const metaData = meta.results?.[0]?.raw || {};
      const skuJson = await skuRes.json();

      const showAddToCart = skuJson.attributes?.some(attr => attr.name === 'show_add_to_cart' && attr.value === 'True');

      return {
        id,
        title: skuJson.productName,
        image: skuJson.images?.[0]?.effectiveUrl || metaData.images?.[0],
        description: metaData.description || '',
        url: metaData.clickableuri || '#',
        showAddToCart,
        price: skuJson.salePrice?.value ? `$${skuJson.salePrice.value}` : null,
        unit: skuJson.packingUnit || '1/Bundle',
        minQty: skuJson.minOrderQuantity || '1'
      };
    } catch (e) {
      console.error('Error fetching product data:', e);
      return null;
    }
  }));

  productData.forEach((product) => {
    if (!product || !product.image) return;

    const {
      image, title, url, description, showAddToCart, price, unit, minQty
    } = product;

    const content = [];

    content.push(img({ src: image, alt: title, class: 'h-48 w-full object-contain' }));
    content.push(p({ class: 'text-black text-sm font-normal leading-tight px-3 pt-3' }, title));

    if (showAddToCart) {
      content.push(div({ class: 'px-3 text-sm text-black flex justify-between mt-2' },
        p({}, `Unit of Measure: ${unit}`),
        p({}, `Min. Order Qty: ${minQty}`)
      ));
      content.push(p({ class: 'px-3 pt-1 text-lg font-bold text-black' }, price));
      content.push(div({ class: 'flex items-center gap-2 px-3 pt-2' },
        div({ class: 'w-12 px-2 py-1.5 bg-white rounded-md outline outline-1 outline-gray-300 text-center text-black' }, '1'),
        button({ class: 'w-20 px-4 py-2 bg-violet-600 text-white rounded-full outline outline-1 outline-violet-600' }, 'Buy'),
        button({ class: 'px-4 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, 'Quote'),
      ));
    } else {
      content.push(p({ class: 'bg-gray-100 text-sm text-gray-800 px-3 pt-2 pb-3 line-clamp-4' }, description));
      content.push(div({ class: 'px-3 pt-2' },
        button({ class: 'w-full px-5 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, 'Quote')
      ));
    }

    content.push(div({ class: 'px-3 pb-3 pt-2' },
      a({ href: url, class: 'text-violet-600 text-base font-bold' }, `${linkText} →`)
    ));

    const card = div({
      class: 'min-w-[23.5%] w-[23.5%] flex-shrink-0 bg-white outline outline-1 outline-gray-300 flex flex-col'
    }, ...content);

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
    const cardWidth = card.offsetWidth + 16;
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

import { div, p, img, a, span, button, input } from '../../scripts/dom-builder.js';

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
        const res1 = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
        if (!res1.ok) return null;
        const data1 = await res1.json();
        const product = data1.results?.[0];
        if (!product) return null;

        const image = product.raw?.images?.[0];
        const title = product.title || '';
        const description = product.raw?.ec_shortdesc || product.raw?.description || '';
        const url = product.clickUri || '#';
        const sku = product.raw?.sku;

        let showCart = false;
        let price = '';
        let minQty = '';
        let unitText = '';

        const res2 = await fetch(`https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`);
        if (res2.ok) {
          const details = await res2.json();
          const attrList = details?.attributes || [];
          showCart = attrList.some(attr => attr.name === 'show_add_to_cart' && attr.value === 'True');
          price = details?.salePrice?.value ? `$${details.salePrice.value.toLocaleString()}` : '';
          minQty = details?.minOrderQuantity || '';
          unitText = details?.packingUnit ? `1 / ${details.packingUnit}` : '1 / Bundle';
        }

        return { id, title, description, image, url, showCart, price, minQty, unitText };
      } catch (e) {
        console.error('❌ Fetch error for product:', id, e);
        return null;
      }
    })
  );

  matchedProducts.forEach((product) => {
    if (!product || !product.image) return;

    const {
      image, title, description, url, showCart, price, minQty, unitText
    } = product;

    const infoSection = div({ class: `self-stretch px-4 py-3 ${showCart ? '' : 'bg-gray-50'} flex flex-col items-end gap-2` });

    if (showCart) {
      infoSection.append(
        div({ class: 'text-black text-xl font-bold text-right' }, price),
        div({ class: 'w-full flex justify-between text-sm' },
          p({}, 'Unit of Measure:'), p({ class: 'font-bold' }, unitText)
        ),
        div({ class: 'w-full flex justify-between text-sm' },
          p({}, 'Min. Order Qty:'), p({ class: 'font-bold' }, minQty)
        ),
        div({ class: 'flex gap-3 items-center mt-2' },
          div({ class: 'w-14 px-4 py-1.5 bg-white rounded-md outline outline-1 outline-gray-300 text-center text-black' }, '1'),
          button({ class: 'w-20 px-5 py-2 bg-violet-600 text-white rounded-full outline outline-1 outline-violet-600' }, 'Buy'),
          button({ class: 'px-5 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, 'Quote')
        )
      );
    } else {
      infoSection.append(
        p({ class: 'text-xs text-gray-700' }, description),
        div({ class: 'w-full flex justify-center mt-2' },
          button({ class: 'px-5 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, 'Quote')
        )
      );
    }

    const card = div({
      class: 'min-w-[25%] w-[25%] flex-shrink-0 bg-white rounded-lg border p-5 space-y-2 h-[460px]'
    },
      img({ src: image, alt: title, class: 'w-full h-32 object-contain' }),
      p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, title),
      infoSection,
      a({
        href: url,
        class: 'text-purple-600 text-sm font-medium flex items-center gap-1'
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

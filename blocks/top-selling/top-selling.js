import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.classList.add('w-full', 'px-4', 'md:px-6', 'flex', 'justify-center');
  }

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim();
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';
  const toggleView = block.querySelector('[data-aue-prop="toggleView"]')?.textContent.trim().toLowerCase() === 'yes';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  const blockWrapper = div({
    class: 'top-selling-rendered w-full max-w-[1200px] mx-auto flex flex-col gap-12 py-[48px] px-4 md:px-6'
  });

  const scrollContainer = div({
    class: 'flex flex-row transition-all duration-300 ease-in-out gap-[48px]',
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = 4;

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

    const cardImage = img({
      src: image,
      alt: title,
      class: 'object-contain'
    });

    const titleEl = p({
      class: 'text-[20px] leading-[28px] font-normal text-black line-clamp-2 mb-2'
    }, title);

    const priceEl = showCart && price !== undefined ?
      p({ class: 'text-[24px] font-normal text-right leading-[32px] text-black mb-2' }, `$${price.toLocaleString()}`) : null;

    const descEl = p({
      class: 'text-[16px] leading-[22px] font-light text-gray-700 mb-3 line-clamp-4 text-left'
    }, description);

    const metaData = showCart && price !== undefined ? div({},
      div({ class: 'flex justify-between text-sm text-gray-600 mb-1' },
        p({}, 'Unit of Measure:'),
        p({ class: 'font-semibold text-black' }, unitMeasure)
      ),
      div({ class: 'flex justify-between text-sm text-gray-600 mb-3' },
        p({}, 'Min. Order Qty:'),
        p({ class: 'font-semibold text-black' }, `${minQty}`)
      )
    ) : null;

    const buttons = div({ class: 'flex gap-2 items-center justify-end mt-4' },
      div({ class: 'w-12 px-2 py-1 bg-white rounded border text-center text-sm text-black' }, '1'),
      button({ class: 'px-[21px] py-[8px] bg-purple-600 text-white rounded-[20px] text-[16px] font-semibold hover:bg-purple-700' }, 'Buy'),
      button({ class: 'px-[21px] py-[8px] bg-white text-purple-600 border border-purple-600 rounded-[20px] text-[16px] font-semibold hover:bg-purple-50' }, 'Quote')
    );

    const viewDetails = div({ class: 'mt-4' },
      a({ href: url, class: 'text-sm text-purple-600 font-medium underline' },
        linkText,
        span({ class: 'ml-1' }, '→')
      )
    );

    const contentBox = div({
      class: 'flex flex-col justify-between flex-1'
    }, titleEl, priceEl, descEl, metaData, buttons, viewDetails);

    const card = div({
      class: 'flex bg-white border border-gray-300 rounded-lg p-4 gap-4 items-start w-full min-h-[200px]'
    },
      div({ class: 'w-[120px] h-[100px] flex-shrink-0' }, cardImage),
      contentBox
    );

    scrollContainer.appendChild(card);
  });

  const leftArrow = span({
    class: 'w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600 opacity-50 pointer-events-none',
    title: 'Scroll Left'
  }, '←');

  const rightArrow = span({
    class: 'w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600',
    title: 'Scroll Right'
  }, '→');

  const gridBtn = img({
    src: '/icons/grid.svg',
    alt: 'Grid View',
    id: 'grid-view-toggle',
    class: 'w-6 h-6 cursor-pointer opacity-100'
  });

  const listBtn = img({
    src: '/icons/list.svg',
    alt: 'List View',
    id: 'list-view-toggle',
    class: 'w-6 h-6 cursor-pointer opacity-50'
  });

  const toggleButtons = div({ class: 'flex items-center gap-2 ml-4' }, gridBtn, listBtn);

  const controls = div({ class: 'flex items-center gap-[12px]' }, leftArrow, rightArrow);
  if (toggleView) controls.append(toggleButtons);

  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-[24px] leading-[32px] font-normal text-black' }, headingText),
    controls
  );

  const scrollWrapper = div({ class: 'overflow-hidden w-full' }, scrollContainer);
  blockWrapper.append(titleRow, scrollWrapper);
  block.append(blockWrapper);

  const scrollToIndex = (index) => {
    const card = scrollContainer.children[0];
    if (!card) return;
    const gap = parseInt(getComputedStyle(scrollContainer).gap) || 0;
    const cardWidth = card.offsetWidth + gap;
    const scrollWidth = scrollContainer.scrollWidth;
    const maxIndex = Math.max(0, Math.ceil(scrollWidth / cardWidth) - visibleCards);

    currentIndex = Math.max(0, Math.min(index, maxIndex));
    scrollContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    updateArrows();
  };

  const updateArrows = () => {
    const card = scrollContainer.children[0];
    const gap = parseInt(getComputedStyle(scrollContainer).gap) || 0;
    const cardWidth = card?.offsetWidth + gap;
    const maxIndex = Math.ceil(scrollContainer.scrollWidth / cardWidth) - visibleCards;

    leftArrow.classList.toggle('opacity-50', currentIndex <= 0);
    leftArrow.classList.toggle('pointer-events-none', currentIndex <= 0);
    rightArrow.classList.toggle('opacity-50', currentIndex >= maxIndex);
    rightArrow.classList.toggle('pointer-events-none', currentIndex >= maxIndex);
  };

  leftArrow.addEventListener('click', () => scrollToIndex(currentIndex - 1));
  rightArrow.addEventListener('click', () => scrollToIndex(currentIndex + 1));

  if (toggleView) {
    gridBtn.addEventListener('click', () => {
      scrollContainer.classList.remove('flex-col');
      scrollContainer.classList.add('flex-row');
      scrollContainer.querySelectorAll('div[style*=transform]').forEach(el => el.style.transform = '');
      gridBtn.classList.add('opacity-100');
      listBtn.classList.remove('opacity-100');
      listBtn.classList.add('opacity-50');
    });

    listBtn.addEventListener('click', () => {
      scrollContainer.classList.remove('flex-row');
      scrollContainer.classList.add('flex-col');
      scrollContainer.style.transform = 'none';
      gridBtn.classList.remove('opacity-100');
      gridBtn.classList.add('opacity-50');
      listBtn.classList.add('opacity-100');
    });
  }

 // setTimeout(updateArrows, 100);

  [...block.children].forEach((child) => {
    if (!child.classList.contains('top-selling-rendered')) {
      child.style.display = 'none';
    }
  });
}

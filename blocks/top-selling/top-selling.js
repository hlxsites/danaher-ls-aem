import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.classList.add('w-full', 'px-4', 'md:px-10', 'flex', 'justify-center');
  }

  const headingText = 'Top Selling Products, You may also need';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  const blockWrapper = div({ class: 'top-selling-rendered w-full max-w-[1440px] mx-auto flex flex-col gap-4' });

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-4',
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

    const card = div({
      class: 'w-[23.5%] min-w-[23.5%] flex-shrink-0 bg-white border border-gray-300 rounded-lg p-4 flex flex-col h-[470px]'
    });

    if (image) {
      card.append(img({
        src: image,
        alt: title,
        class: 'w-full h-32 object-contain mb-4'
      }));
    }

    card.append(p({
      class: 'text-base font-semibold text-black mb-3 line-clamp-2'
    }, title));

    const contentBox = div({
      class: 'bg-gray-100 p-4 rounded-md flex flex-col justify-between flex-1 min-h-[220px] mt-2'
    });

    if (showCart && price !== undefined) {
      contentBox.append(
        p({ class: 'text-right text-xl font-bold text-black mb-3' }, `$${price.toLocaleString()}`),
        div({ class: 'flex justify-between text-sm text-gray-600 mb-1' },
          p({ class: 'text-sm' }, 'Unit of Measure:'),
          p({ class: 'font-semibold text-sm text-black' }, unitMeasure)
        ),
        div({ class: 'flex justify-between text-sm text-gray-600 mb-3' },
          p({ class: 'text-sm' }, 'Min. Order Qty:'),
          p({ class: 'font-semibold text-sm text-black' }, `${minQty}`)
        )
      );

      const actions = div({ class: 'flex flex-col gap-3 mt-auto items-center justify-center' },
        div({ class: 'flex gap-2 items-center' },
          div({
            class: 'w-12 px-2 py-1 bg-white rounded border text-center text-sm text-black',
          }, '1'),
          button({
            class: 'px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700'
          }, 'Buy'),
          button({
            class: 'px-5 py-2.5 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50'
          }, 'Quote')
        )
      );

      contentBox.append(actions);
    } else {
      contentBox.append(
        p({ class: 'text-sm text-gray-700 mb-3 leading-snug line-clamp-4 text-left' }, description),
        div({ class: 'flex mt-auto w-full' },
          button({
            class: 'w-full px-5 py-2.5 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50 text-center'
          }, 'Quote')
        )
      );
    }

    contentBox.append(
      div({ class: 'flex justify-start mt-4' },
        a({ href: url, class: 'text-sm text-purple-600 font-medium underline' },
          linkText,
          span({ class: 'ml-1' }, '→')
        )
      )
    );

    card.append(contentBox);
    scrollContainer.appendChild(card);
  });

  const leftArrow = span({
    class: 'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600 mr-2 opacity-50 pointer-events-none',
    title: 'Scroll Left'
  }, '←');

  const rightArrow = span({
    class: 'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600',
    title: 'Scroll Right'
  }, '→');

  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-2xl font-semibold text-gray-900' }, headingText),
    div({ class: 'flex items-center gap-2' }, leftArrow, rightArrow)
  );

  const scrollWrapper = div({ class: 'overflow-hidden w-full' }, scrollContainer);

  blockWrapper.append(titleRow, scrollWrapper);
  block.append(blockWrapper);

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

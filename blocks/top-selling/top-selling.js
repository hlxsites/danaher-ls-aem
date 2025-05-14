import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.classList.add('w-full', 'px-4', 'md:px-10', 'flex', 'justify-center');
  }

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim();
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';
  const toggleView = block.querySelector('[data-aue-prop="toggleView"]')?.textContent.trim().toLowerCase() === 'yes';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  const blockWrapper = div({ class: 'top-selling-rendered w-full max-w-[1320px] mx-auto flex flex-col gap-4' });

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-4',
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = 4;
  let isListView = false;

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

  const renderCards = () => {
    scrollContainer.innerHTML = '';

    products.forEach((product) => {
      if (!product) return;
      const { title, url, image, description, showCart, price, unitMeasure, minQty } = product;

      const cardClass = isListView
        ? 'w-full flex bg-white border border-gray-300 rounded-lg p-4 gap-4 min-h-[230px]'
        : 'w-[24%] min-w-[24%] flex-shrink-0 bg-white border border-gray-300 rounded-lg p-4 flex flex-col h-[470px]';

      const card = div({ class: cardClass });

      // Image
      if (image) {
        const imageEl = img({
          src: image,
          alt: title,
          class: isListView ? 'w-40 h-32 object-contain' : 'w-full h-32 object-contain mb-4'
        });
        card.append(imageEl);
      }

      // Content wrapper
      const content = div({ class: isListView ? 'flex flex-col justify-between flex-1' : '' });

      // Title
      content.append(p({
        class: 'text-base font-semibold text-black mb-2 line-clamp-2'
      }, title));

      // Description or price
      if (showCart && price !== undefined) {
        content.append(
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
      } else {
        content.append(
          p({ class: 'text-sm text-gray-700 mb-3 leading-snug line-clamp-4 text-left' }, description)
        );
      }

      // Buttons
      const buttons = div({ class: isListView ? 'flex gap-2 items-center mt-4' : 'flex flex-col gap-3 mt-auto items-center justify-center' });

      if (showCart && price !== undefined) {
        buttons.append(
          div({ class: 'flex gap-2 items-center' },
            div({ class: 'w-12 px-2 py-1 bg-white rounded border text-center text-sm text-black' }, '1'),
            button({ class: 'px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700' }, 'Buy'),
            button({ class: 'px-5 py-2.5 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50' }, 'Quote')
          )
        );
      } else {
        buttons.append(
          button({
            class: 'w-full px-5 py-2.5 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50'
          }, 'Quote')
        );
      }

      // View Details
      buttons.append(
        div({ class: 'flex justify-start mt-4' },
          a({ href: url, class: 'text-sm text-purple-600 font-medium underline' },
            linkText,
            span({ class: 'ml-1' }, '→')
          )
        )
      );

      content.append(buttons);
      card.append(content);
      scrollContainer.appendChild(card);
    });
  };

  renderCards();

  // View toggles
  let toggleButtons = null;
  if (toggleView) {
    const gridIcon = img({
      src: '/icons/grid.svg',
      alt: 'Grid View',
      id: 'grid-view-toggle',
      class: 'w-6 h-6 cursor-pointer opacity-100'
    });

    const listIcon = img({
      src: '/icons/list.svg',
      alt: 'List View',
      id: 'list-view-toggle',
      class: 'w-6 h-6 cursor-pointer opacity-50'
    });

    toggleButtons = div({ class: 'flex items-center gap-2 ml-4' }, gridIcon, listIcon);

    gridIcon.addEventListener('click', () => {
      isListView = false;
      gridIcon.classList.add('opacity-100');
      listIcon.classList.remove('opacity-100');
      listIcon.classList.add('opacity-50');
      scrollContainer.classList.remove('flex-col');
      scrollContainer.classList.add('flex-row');
      renderCards();
      updateArrows();
    });

    listIcon.addEventListener('click', () => {
      isListView = true;
      listIcon.classList.add('opacity-100');
      gridIcon.classList.remove('opacity-100');
      gridIcon.classList.add('opacity-50');
      scrollContainer.classList.remove('flex-row');
      scrollContainer.classList.add('flex-col');
      renderCards();
      updateArrows();
    });
  }

  // Arrows
  const leftArrow = span({
    class: 'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600 mr-2 opacity-50 pointer-events-none',
    title: 'Scroll Left'
  }, '←');

  const rightArrow = span({
    class: 'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600',
    title: 'Scroll Right'
  }, '→');

  const controls = div({ class: 'flex items-center gap-2' }, leftArrow, rightArrow);
  if (toggleButtons) controls.append(toggleButtons);

  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-2xl font-semibold text-gray-900' }, headingText),
    controls
  );

  const scrollWrapper = div({ class: 'overflow-hidden w-full' }, scrollContainer);
  blockWrapper.append(titleRow, scrollWrapper);
  block.append(blockWrapper);

  const totalCards = () => scrollContainer.children.length;

  const updateArrows = () => {
    if (isListView) {
      leftArrow.classList.add('opacity-50', 'pointer-events-none');
      rightArrow.classList.add('opacity-50', 'pointer-events-none');
      return;
    }
    leftArrow.classList.toggle('opacity-50', currentIndex <= 0);
    leftArrow.classList.toggle('pointer-events-none', currentIndex <= 0);
    rightArrow.classList.toggle('opacity-50', currentIndex >= totalCards() - visibleCards);
    rightArrow.classList.toggle('pointer-events-none', currentIndex >= totalCards() - visibleCards);
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
    if (!isListView && currentIndex > 0) scrollToIndex(currentIndex - visibleCards);
  });

  rightArrow.addEventListener('click', () => {
    if (!isListView && currentIndex < totalCards() - visibleCards) scrollToIndex(currentIndex + visibleCards);
  });

  setTimeout(updateArrows, 100);

  [...block.children].forEach((child) => {
    if (!child.classList.contains('top-selling-rendered')) {
      child.style.display = 'none';
    }
  });
}

import { div, p, img, a, span, button, input } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) wrapper.classList.add('max-w-[1440px]', 'mx-auto', 'px-6');

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim() || 'Top Selling Products';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';

  const authoredWrapper = div({ class: 'top-selling-rendered flex flex-col gap-4 w-full' });
  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-4',
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = 4;

  const rawIdText = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIdText.split(',').map(id => id.trim()).filter(Boolean);

  const productDataList = await Promise.all(productIds.map(async (id) => {
    try {
      const prodRes = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
      const prodJson = await prodRes.json();
      const prod = prodJson.results?.[0];
      if (!prod) return null;

      const sku = prod.raw?.sku || '';
      const apiRes = await fetch(`https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`);
      const apiJson = await apiRes.json();

      return { product: prod, api: apiJson };
    } catch (e) {
      console.error(`Error loading product ${id}`, e);
      return null;
    }
  }));

  productDataList.forEach((data) => {
    if (!data) return;
    const { product, api } = data;

    const image = product.raw?.images?.[0] || '';
    const title = product.title || '';
    const url = product.clickUri || '#';
    const desc = product.raw?.ec_shortdesc || product.raw?.description || '';

    const hasCart = api?.attributes?.some(a => a.name === 'show_add_to_cart' && a.value === 'True');
    const price = api?.salePrice?.value || '';
    const unit = api?.packingUnit || 'Bundle';
    const minQty = api?.minOrderQuantity || '1';

    const content = div({ class: 'flex flex-col h-full border border-gray-300 bg-white rounded overflow-hidden' });

    if (image) content.append(img({ src: image, alt: title, class: 'w-full h-40 object-contain p-4' }));

    content.append(p({ class: 'px-4 text-sm font-semibold text-black leading-tight' }, title));

    const info = div({ class: 'bg-gray-50 px-4 pt-2 pb-4 flex flex-col gap-2 justify-between flex-grow' });

    if (hasCart) {
      info.append(
        div({ class: 'flex justify-between text-sm text-gray-800' },
          p({}, `Unit of Measure: 1/${unit}`),
          p({}, `Min. Order Qty: ${minQty}`)
        ),
        p({ class: 'text-right text-lg font-bold text-black' }, `$${price}`),
        div({ class: 'flex gap-3 items-center mt-2' },
          div({ class: 'w-12' }, input({ class: 'border border-gray-300 px-2 py-1 rounded w-full', value: '1' })),
          button({ class: 'bg-purple-600 text-white px-4 py-1 rounded-full text-sm' }, 'Buy'),
          button({ class: 'border border-purple-600 text-purple-600 px-4 py-1 rounded-full text-sm' }, 'Quote')
        )
      );
    } else {
      info.append(
        p({ class: 'text-sm text-gray-700 line-clamp-4' }, desc),
        div({ class: 'mt-3' },
          button({ class: 'border border-purple-600 text-purple-600 px-5 py-2 rounded-full w-full text-sm' }, 'Quote')
        )
      );
    }

    content.append(info);

    content.append(div({ class: 'px-4 pb-4' },
      a({ href: url, class: 'text-purple-600 text-sm font-bold hover:underline' }, `${linkText} →`)
    ));

    const card = div({
      class: 'w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] flex-shrink-0',
    }, content);

    scrollContainer.append(card);
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
  block.innerHTML = '';
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

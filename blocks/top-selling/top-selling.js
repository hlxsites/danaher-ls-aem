import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) wrapper.classList.add('max-w-[1440px]', 'mx-auto', 'px-6', 'flex', 'justify-center');

  const section = block.closest('.top-selling');
  if (section) section.classList.add('flex', 'justify-center', 'w-full');

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim() || 'Top Selling Products';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';
  const rawIdText = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIdText.split(',').map(id => id.trim()).filter(Boolean);

  const authoredWrapper = div({ class: 'w-full top-selling-rendered flex flex-col gap-4' });
  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-3',
    style: 'transform: translateX(0);',
  });

  const visibleCards = 4;
  let currentIndex = 0;

  const fetchProductData = async (id) => {
    const primary = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
    const primaryJson = await primary.json();
    const result = primaryJson.results?.[0];
    if (!result) return null;

    const sku = result.raw?.sku;
    const detailsUrl = `https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`;
    const secondary = await fetch(detailsUrl);
    const secondaryJson = await secondary.json();

    const showCartAttr = secondaryJson.attributes?.find(attr => attr.name === 'show_add_to_cart');
    const showCart = showCartAttr?.value === 'True';

    return {
      id,
      title: result.title,
      image: result.raw?.images?.[0],
      url: result.clickUri,
      description: result.raw?.ec_shortdesc || result.raw?.description || '',
      sku,
      showCart,
      price: secondaryJson.salePrice?.value,
      quantity: secondaryJson.minOrderQuantity || 1
    };
  };

  const matchedProducts = await Promise.all(productIds.map(fetchProductData));

  matchedProducts.forEach((product) => {
    if (!product || !product.image) return;
    const { image, title, url, description, showCart, price, quantity } = product;

    const info = div({ class: 'space-y-2' },
      p({ class: 'text-sm text-gray-900 font-normal leading-tight' }, title),
      !showCart && p({ class: 'text-xs text-gray-700 bg-gray-100 p-2 rounded' }, description)
    );

    const footer = div({ class: 'mt-2' });
    if (showCart) {
      footer.append(
        div({ class: 'flex items-center gap-3' },
          div({ class: 'w-14 px-4 py-1.5 bg-white rounded-md outline outline-1 outline-gray-300 text-center text-black' }, quantity.toString()),
          div({ class: 'text-base font-bold text-black' }, `$${price}`)
        )
      );
    } else {
      footer.append(
        button({ class: 'mt-2 px-5 py-2 bg-white text-purple-600 rounded-full outline outline-1 outline-purple-600 w-full' }, 'Request Quote')
      );
    }

    const card = div({
      class: 'min-w-[23%] w-[23%] flex-shrink-0 bg-white rounded-lg border p-5 space-y-2 h-[400px]'
    },
      img({ src: image, alt: title, class: 'w-full h-32 object-contain' }),
      info,
      a({
        href: url,
        class: 'text-purple-600 text-sm font-medium flex items-center gap-1',
      }, linkText, span({ class: 'ml-1' }, '→')),
      footer
    );

    scrollContainer.appendChild(card);
  });

  const leftArrow = span({
    class: 'w-8 h-8 mr-2 border rounded-full flex items-center justify-center cursor-pointer transition text-blue-600 border-blue-600',
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
    const cardWidth = card.offsetWidth + 12;
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

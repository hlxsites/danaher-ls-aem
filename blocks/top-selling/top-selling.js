import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  // 1. Parent container spans 100% width
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.className = '';
    wrapper.classList.add('w-full', 'px-4', 'md:px-10', 'flex', 'justify-center');
  }

  // 2. Gather authored props
  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim();
  const linkText   = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';
  const toggleView = block.querySelector('[data-aue-prop="toggleView"]')?.textContent.trim().toLowerCase() === 'yes';
  const rawIds     = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map((id) => id.trim()).filter(Boolean);

  // 3. Build top-level wrapper
  const blockWrapper = div({
    class: 'top-selling-rendered w-full flex flex-col gap-4'
  });

  // 4. Scroll container for cards
  const scrollContainer = div({
    class: 'flex flex-row transition-all duration-300 ease-in-out gap-4',
    style: 'transform: translateX(0)',
  });

  let currentIndex = 0;
  const visibleCards = 4;

  // 5. Fetch each product's data
  async function getProductInfo(id) {
    try {
      const r1 = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
      const main = await r1.json();
      const prod = main.results?.[0];
      if (!prod) return null;

      const sku = prod.raw?.sku || '';
      const r2 = await fetch(
        `https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`
      );
      const shop = await r2.json();
      const showCart = shop.attributes?.some(a => a.name === 'show_add_to_cart' && a.value === 'True');

      return {
        title:       prod.title || '',
        url:         prod.clickUri || '#',
        image:       prod.raw?.images?.[0] || '',
        description: prod.raw?.ec_shortdesc || '',
        showCart,
        price:       shop.salePrice?.value,
        minQty:      shop.minOrderQuantity,
        unitMeasure: '1/Bundle',
      };
    } catch {
      return null;
    }
  }

  // 6. Load all products
  const products = (await Promise.all(productIds.map(getProductInfo))).filter(Boolean);

  // 7. Render each card
  products.forEach((p) => {
    const { title, url, image, description, showCart, price, unitMeasure, minQty } = p;

    // base card
    const card = div({
      class:
        'card flex-shrink-0 bg-white border border-gray-300 rounded-lg p-4 flex flex-col ' +
        'w-[23.9%] min-w-[23.9%] h-[470px]'
    });

    // image
    if (image) {
      card.append(
        img({
          src: image,
          alt: title,
          class: 'w-full h-32 object-contain mb-4 flex-shrink-0'
        })
      );
    }

    // title
    card.append(
      p({ class: 'text-base font-semibold text-black mb-3 line-clamp-2' }, title)
    );

    // content box (gray background)
    const contentBox = div({
      class:
        'bg-gray-100 p-4 rounded-md flex flex-col justify-between flex-1 ' +
        (showCart && price !== undefined ? 'min-h-[220px]' : 'min-h-[180px]')
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
        ),
        div({ class: 'flex justify-between items-center gap-2 mt-3' },
          div({ class: 'w-12 px-2 py-1 bg-white rounded border text-center text-sm text-black' }, '1'),
          button({ class: 'bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold' }, 'Buy'),
          button({ class: 'bg-white border border-purple-600 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold' }, 'Quote')
        )
      );
    } else {
      contentBox.append(
        p({ class: 'text-sm text-gray-700 mb-3 leading-snug line-clamp-4' }, description),
        button({ class: 'w-full border border-purple-600 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold' }, 'Quote')
      );
    }

    // "View Details" link, left-aligned, no extra bottom gap
    contentBox.append(
      a({
        href: url,
        class: 'text-purple-600 text-sm font-medium mt-4 underline self-start'
      }, linkText, span({ class: 'ml-1' }, '→'))
    );

    card.append(contentBox);
    scrollContainer.append(card);
  });

  // 8. Carousel & toggle controls
  const leftArrow = span({
    class:
      'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ' +
      'bg-gray-200 text-purple-600 opacity-50 pointer-events-none'
  }, '←');
  const rightArrow = span({
    class:
      'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ' +
      'bg-gray-200 text-purple-600'
  }, '→');

  let gridBtn = null, listBtn = null;
  if (toggleView) {
    gridBtn = img({ src: '/icons/grid.svg', alt: 'Grid', class: 'w-6 h-6 cursor-pointer opacity-100' });
    listBtn = img({ src: '/icons/list.svg', alt: 'List', class: 'w-6 h-6 cursor-pointer opacity-50' });
  }

  const controls = div({ class: 'flex items-center gap-2 ml-auto' },
    leftArrow, rightArrow,
    toggleView ? gridBtn : null,
    toggleView ? listBtn : null
  );

  // header row
  const titleRow = div({ class: 'flex items-center mb-4' },
    p({ class: 'text-2xl font-semibold text-gray-900' }, headingText),
    controls
  );

  blockWrapper.append(titleRow, scrollContainer);
  block.append(blockWrapper);

  // 9. View‐mode toggle functions
  function toGrid() {
    scrollContainer.classList.replace('flex-col', 'flex-row');
    scrollContainer.querySelectorAll('.card').forEach((c) => {
      c.classList.replace('w-full', 'w-[23.9%]');
      c.classList.replace('min-w-full', 'min-w-[23.9%]');
      c.classList.replace('flex-row', 'flex-col');
      c.classList.add('h-[470px]');
    });
    gridBtn  && gridBtn.classList.replace('opacity-50','opacity-100');
    listBtn  && listBtn.classList.replace('opacity-100','opacity-50');
    updateArrows();
  }

  function toList() {
    scrollContainer.classList.replace('flex-row', 'flex-col');
    scrollContainer.querySelectorAll('.card').forEach((c) => {
      c.classList.replace('w-[23.9%]', 'w-full');
      c.classList.replace('min-w-[23.9%]', 'min-w-full');
      c.classList.replace('flex-col', 'flex-row');
      c.classList.remove('h-[470px]');
      c.classList.add('items-start', 'gap-4');
    });
    gridBtn  && gridBtn.classList.replace('opacity-100','opacity-50');
    listBtn  && listBtn.classList.replace('opacity-50','opacity-100');
    leftArrow.classList.add('opacity-50','pointer-events-none');
    rightArrow.classList.add('opacity-50','pointer-events-none');
  }

  // 10. Carousel scrolling
  const total = scrollContainer.children.length;
  function updateArrows() {
    leftArrow.classList.toggle('opacity-50', currentIndex <= 0);
    leftArrow.classList.toggle('pointer-events-none', currentIndex <= 0);
    rightArrow.classList.toggle('opacity-50', currentIndex >= total - visibleCards);
    rightArrow.classList.toggle('pointer-events-none', currentIndex >= total - visibleCards);
  }
  function scrollTo(i) {
    const w = scrollContainer.children[0]?.offsetWidth + 16;
    scrollContainer.style.transform = `translateX(-${w * i}px)`;
    currentIndex = i;
    updateArrows();
  }
  leftArrow.addEventListener('click',  () => scrollTo(Math.max(currentIndex - visibleCards, 0)));
  rightArrow.addEventListener('click', () => scrollTo(Math.min(currentIndex + visibleCards, total - visibleCards)));

  // 11. Wire up toggle buttons
  if (toggleView) {
    gridBtn.addEventListener('click', toGrid);
    listBtn.addEventListener('click', toList);
  }

  // 12. Initial state
  if (toggleView) toGrid();
  else updateArrows();
}

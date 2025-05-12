import { div, p, h1, img, button, span, a } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const items = [...block.querySelectorAll("[data-aue-model='top-selling-item']")];
  const headingText = block.querySelector('[data-aue-label="HeaderTitle"]')?.textContent?.trim() || 'Top Selling Products';

  const productIdsText = block.querySelector('[data-aue-label="Product ID"]')?.textContent || '';
  const linkText = block.querySelector('[data-aue-label="Link Text"]')?.textContent || 'View Details';
  const productIds = productIdsText.split(',').map(id => id.trim()).filter(Boolean);

  const matchedProducts = await Promise.all(productIds.map(async (id) => {
    try {
      const res = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
      const data = await res.json();
      const product = data.results?.[0];
      if (!product) return null;

      return {
        id,
        image: product.raw?.images?.[0] || '',
        brand: Array.isArray(product.raw?.ec_brand) ? product.raw.ec_brand[0] : '',
        title: product.title || '',
        url: product.clickUri || '#'
      };
    } catch (e) {
      console.error(`Error fetching product ${id}`, e);
      return null;
    }
  }));

  let currentIndex = 0;
  const cardsPerPage = 4;
  let isGridView = true;

  const carouselContainer = div({ class: 'carousel-container flex flex-col w-full py-6 justify-center' });

  const listBtn = button({
    class: 'toggle-view-list px-3 py-2 bg-white rounded-l-full outline outline-1 outline-violet-600',
    onclick: () => switchView(false),
  }, img({ src: '/icons/View-list.svg', alt: 'List View', class: 'w-6 h-6' }));

  const gridBtn = button({
    class: 'toggle-view-grid px-3 py-2 bg-violet-600 text-white rounded-r-full outline outline-1 outline-violet-600',
    onclick: () => switchView(true),
  }, img({ src: '/icons/View-grid.svg', alt: 'Grid View', class: 'w-6 h-6' }));

  const header = div({ class: 'w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4' },
    div({ class: 'flex flex-wrap sm:flex-nowrap items-center gap-4' },
      div({ class: 'text-black text-2xl font-bold leading-loose whitespace-nowrap' }, headingText),
      a({ href: '#', class: 'text-violet-600 text-base font-bold hover:underline whitespace-nowrap' }, 'Browse 120 Products →')
    ),
    div({ class: 'w-72 inline-flex justify-end items-center gap-6' },
      div({ class: 'flex justify-start items-center gap-3' },
        button({ class: 'carousel-prev-div w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center', onclick: () => changeSlide(-1) },
          img({ src: '/icons/Arrow-circle-left.svg', alt: 'Previous', class: 'w-6 h-6' })
        ),
        button({ class: 'carousel-next-div w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center', onclick: () => changeSlide(1) },
          img({ src: '/icons/Arrow-circle-right.svg', alt: 'Next', class: 'w-6 h-6' })
        )
      ),
      div({ class: 'flex justify-start items-center' }, listBtn, gridBtn)
    )
  );

  const carouselCards = div({ class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full' });

  function renderCard(product) {
    const { image, brand, title, url } = product;
    return div({ class: 'w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] bg-white outline outline-1 outline-gray-300 flex flex-col' },
      img({ src: image, alt: title, class: 'h-48 w-full object-cover' }),
      p({ class: 'p-3 text-black text-xl font-bold' }, title),
      div({ class: 'px-4 pb-4' },
        p({ class: 'text-xs font-bold text-purple-600' }, brand),
        a({ href: url, class: 'text-violet-600 text-base font-bold' }, `${linkText} →`)
      )
    );
  }

  function updateView() {
    carouselCards.innerHTML = '';
    const visibleItems = isGridView ? matchedProducts.slice(currentIndex, currentIndex + cardsPerPage) : matchedProducts;
    visibleItems.filter(Boolean).forEach(product => carouselCards.append(renderCard(product)));
  }

  function changeSlide(direction) {
    if (!isGridView) return;
    const total = matchedProducts.length;
    const maxIndex = Math.max(0, total - cardsPerPage);
    currentIndex += direction * cardsPerPage;
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    updateView();
  }

  function switchView(toGrid) {
    isGridView = toGrid;
    currentIndex = 0;
    updateView();
  }

  updateView();
  carouselContainer.append(header, carouselCards);
  block.append(carouselContainer);

  [...block.children].forEach((child) => {
    if (!carouselContainer.contains(child)) {
      child.style.display = 'none';
    }
  });
}

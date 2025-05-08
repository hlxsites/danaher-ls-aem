import { div, p, h1, img, button, span, a } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const items = [...block.querySelectorAll("[data-aue-model='top-selling-item']")];
  const headingText = block.querySelector('[data-aue-label="HeaderTitle"]')?.textContent || 'Top Selling Products';

  let currentIndex = 0;
  const cardsPerPage = 4;
  let isGridView = true;

  const carouselContainer = div({ class: 'carousel-container flex flex-col w-full py-6 justify-center' });

  const listBtn = button({
    class: 'toggle-view-list px-3 py-2 bg-white rounded-l-full outline outline-1 outline-violet-600',
    onclick: () => switchView(false),
  }, span({ class: 'icon icon-view-list w-6 h-6 text-gray-600' }));

  const gridBtn = button({
    class: 'toggle-view-grid px-3 py-2 bg-violet-600 text-white rounded-r-full outline outline-1 outline-violet-600',
    onclick: () => switchView(true),
  }, span({ class: 'icon icon-view-grid w-6 h-6 text-white' }));

  const header = div({ class: 'w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4' },
    div({ class: 'flex flex-wrap sm:flex-nowrap items-center gap-4' },
      div({ class: 'text-black text-2xl font-bold leading-loose whitespace-nowrap' }, headingText),
      a({ href: '#', class: 'text-violet-600 text-base font-bold hover:underline whitespace-nowrap' }, 'Browse 120 Products →')
    ),
    div({ class: 'w-72 inline-flex justify-end items-center gap-6' },
      div({ class: 'flex justify-start items-center gap-3' },
        button({ class: 'carousel-prev-div w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center', onclick: () => changeSlide(-1) },
          span({ class: 'icon icon-arrow-left w-6 h-6 text-gray-700' })
        ),
        button({ class: 'carousel-next-div w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center', onclick: () => changeSlide(1) },
          span({ class: 'icon icon-arrow-right w-6 h-6 text-violet-600' })
        )
      ),
      div({ class: 'flex justify-start items-center' }, listBtn, gridBtn)
    )
  );

  const carouselCards = div({ class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full' });

  function renderCard(item) {
    const title = item.querySelector('[data-aue-label="Title"]')?.textContent?.trim();
    const image = item.querySelector('img')?.src;
    const price = item.querySelector('[data-aue-label="Price"]')?.textContent?.trim();
    const unitText = item.querySelector('[data-aue-label="Units-Text"]')?.textContent?.trim();
    const unitVal = item.querySelector('[data-aue-label="Units Value"]')?.textContent?.trim();
    const qtyLabel = item.querySelector('[data-aue-label="Qty-Lable-Text"]')?.textContent?.trim();
    const qtyVal = item.querySelector('[data-aue-label="Qty-Value"]')?.textContent?.trim();
    const description = item.querySelector('[data-aue-label="product-Description"] p')?.textContent?.trim();
    const viewText = item.querySelector('[data-aue-label="View-Details"]')?.textContent?.trim() || 'View Details';
    const quoteText = item.querySelector('[data-aue-label="Quote Link"]')?.textContent?.trim();
    const buyText = item.querySelector('[data-aue-label="Buy Link"]')?.textContent?.trim();

    const descElement = description ? p({ class: 'px-3 pb-3 text-gray-700 text-sm line-clamp-4' }, description) : null;

    const buttons = div({ class: 'flex gap-3 items-center mt-3 justify-end w-full' });
    if (buyText) {
      buttons.append(
        div({ class: 'w-14 px-4 py-1.5 bg-white rounded-md outline outline-1 outline-gray-300 text-center text-black' }, '1'),
        button({ class: 'w-24 px-5 py-2 bg-violet-600 text-white rounded-full outline outline-1 outline-violet-600' }, buyText)
      );
    }
    if (quoteText) {
      buttons.append(button({ class: `px-5 py-2 ${buyText ? '' : 'w-full'} bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600 mt-3` }, quoteText));
    }

    return div({ class: 'w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] bg-white outline outline-1 outline-gray-300 flex flex-col justify-between' },
      image && img({ src: image, alt: title || 'Product Image', class: 'h-48 w-full object-cover' }),
      title && p({ class: 'p-3 text-black text-xl font-bold' }, title),
      descElement,
      div({ class: 'self-stretch px-4 py-3 bg-gray-50 flex flex-col items-end gap-4 flex-1' },
        price && div({ class: 'text-black text-2xl font-bold text-right' }, price),
        unitText && unitVal && div({ class: 'w-full flex justify-between' },
          p({ class: 'text-black text-base font-extralight' }, unitText),
          p({ class: 'text-black text-base font-bold' }, unitVal)
        ),
        qtyLabel && qtyVal && div({ class: 'w-full flex justify-between' },
          p({ class: 'text-black text-base font-extralight' }, qtyLabel),
          p({ class: 'text-black text-base font-bold' }, qtyVal)
        ),
        (buyText || quoteText) && buttons
      ),
      viewText && div({ class: 'p-3' },
        a({ href: '#', class: 'text-violet-600 text-base font-bold' }, `${viewText} →`)
      )
    );
  }

  function updateView() {
    carouselCards.innerHTML = '';
    const visibleItems = isGridView ? items.slice(currentIndex, currentIndex + cardsPerPage) : items;
    visibleItems.forEach(item => carouselCards.append(renderCard(item)));
  }

  function changeSlide(direction) {
    if (!isGridView) return;
    const total = items.length;
    const maxIndex = Math.max(0, total - cardsPerPage);
    currentIndex = Math.max(0, Math.min(currentIndex + direction * cardsPerPage, maxIndex));
    updateView();
  }

  function switchView(toGrid) {
    isGridView = toGrid;
    currentIndex = 0;
    if (toGrid) {
      gridBtn.classList.replace('bg-white', 'bg-violet-600');
      gridBtn.querySelector('span').classList.replace('text-gray-600', 'text-white');
      listBtn.classList.replace('bg-violet-600', 'bg-white');
      listBtn.querySelector('span').classList.replace('text-white', 'text-gray-600');
    } else {
      listBtn.classList.replace('bg-white', 'bg-violet-600');
      listBtn.querySelector('span').classList.replace('text-gray-600', 'text-white');
      gridBtn.classList.replace('bg-violet-600', 'bg-white');
      gridBtn.querySelector('span').classList.replace('text-white', 'text-gray-600');
    }
    updateView();
  }

  decorateIcons(gridBtn);
  decorateIcons(listBtn);

  updateView();
  carouselContainer.append(header, carouselCards);
  block.innerHTML = '';
  block.append(carouselContainer);
}

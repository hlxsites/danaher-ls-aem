import { div, p, h1, img, button, span, a } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const items = [...block.querySelectorAll("[data-aue-model='top-selling-item']")];
  const headingText = block.querySelector('[data-aue-label="HeaderTitle"]')?.textContent?.trim() || 'Top Selling Products';

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
    const getText = (selector) => item.querySelector(selector)?.textContent?.trim() || '';
    const getImageSrc = () => item.querySelector('img')?.src || '';
    const getDescription = () => item.querySelector('[data-aue-label="product-Description"] p')?.textContent?.trim() || '';

    const title = getText('[data-aue-label="Title"]');
    const image = getImageSrc();
    const price = getText('[data-aue-label="Price"]');
    const unitText = getText('[data-aue-label="Units-Text"]');
    const unitVal = getText('[data-aue-label="Units Value"]');
    const qtyLabel = getText('[data-aue-label="Qty-Lable-Text"]');
    const qtyVal = getText('[data-aue-label="Qty-Value"]');
    const description = getDescription();
    const viewText = getText('[data-aue-label="View-Details"]') || 'View Details';
    const quoteText = getText('[data-aue-label="Quote Link"]');
    const buyText = getText('[data-aue-label="Buy Link"]');

    const hasBuy = !!buyText;
    const hasQuote = !!quoteText;
    const hasInfoSection = price || unitText || unitVal || qtyLabel || qtyVal || description || hasQuote || hasBuy;

    const infoSection = hasInfoSection
      ? div({ class: `self-stretch px-4 py-3 ${description || hasBuy || hasQuote || price ? 'bg-gray-50' : ''} flex flex-col items-end gap-4` })
      : null;

    if (infoSection) {
      if (price) {
        infoSection.append(div({ class: 'text-black text-2xl font-bold text-right' }, price));
      }

      if (unitText && unitVal) {
        infoSection.append(
          div({ class: 'w-full flex justify-between' },
            p({ class: 'text-black text-base font-extralight' }, unitText),
            p({ class: 'text-black text-base font-bold' }, unitVal)
          )
        );
      }

      if (qtyLabel && qtyVal) {
        infoSection.append(
          div({ class: 'w-full flex justify-between' },
            p({ class: 'text-black text-base font-extralight' }, qtyLabel),
            p({ class: 'text-black text-base font-bold' }, qtyVal)
          )
        );
      }

      if (description) {
        infoSection.append(p({ class: 'text-gray-700 text-sm line-clamp-4 text-left' }, description));
      }

      if (hasBuy) {
        const actionRow = div({ class: 'flex gap-3 items-center mt-3' },
          div({ class: 'w-14 px-4 py-1.5 bg-white rounded-md outline outline-1 outline-gray-300 text-center text-black' }, '1'),
          button({ class: 'w-24 px-5 py-2 bg-violet-600 text-white rounded-full outline outline-1 outline-violet-600' }, buyText),
        );

        if (hasQuote) {
          actionRow.append(
            button({ class: 'px-5 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, quoteText)
          );
        }

        infoSection.append(actionRow);
      } else if (hasQuote) {
        infoSection.append(
          div({ class: 'w-full flex justify-center mt-3' },
            button({ class: 'w-full px-5 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, quoteText)
          )
        );
      }
    }

    return div({ class: 'w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] bg-white outline outline-1 outline-gray-300 flex flex-col' },
      image && img({ src: image, alt: title, class: 'h-48 w-full object-cover' }),
      title && p({ class: 'p-3 text-black text-xl font-bold' }, title),
      infoSection,
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
    currentIndex += direction * cardsPerPage;
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    updateView();
  }

  function switchView(toGrid) {
    isGridView = toGrid;
    currentIndex = 0;
    gridBtn.classList.toggle('bg-white', !toGrid);
    gridBtn.classList.toggle('bg-violet-600', toGrid);
    gridBtn.querySelector('span').classList.toggle('text-white', toGrid);
    gridBtn.querySelector('span').classList.toggle('text-gray-600', !toGrid);

    listBtn.classList.toggle('bg-white', toGrid);
    listBtn.classList.toggle('bg-violet-600', !toGrid);
    listBtn.querySelector('span').classList.toggle('text-white', !toGrid);
    listBtn.querySelector('span').classList.toggle('text-gray-600', toGrid);

    updateView();
  }

  decorateIcons(gridBtn);
  decorateIcons(listBtn);

  updateView();
  carouselContainer.append(header, carouselCards);
  block.innerHTML = '';
  block.append(carouselContainer);
}

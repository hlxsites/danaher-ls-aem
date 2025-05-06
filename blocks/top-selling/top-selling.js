import { div, p, h1, img, button, span, a } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const items = [...block.querySelectorAll("[data-aue-model='top-selling-item']")];
  const headingText = block.querySelector('[data-aue-label="HeaderTitle"]')?.textContent || 'Top Selling Products';

  let currentIndex = 0;
  const cardsPerPage = 4;
  let isGridView = true;

  const carouselContainer = div({ class: 'carousel-container flex flex-col w-full py-6 justify-center' });

  const header = div({ class: 'w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4' },
    div({ class: 'flex flex-wrap sm:flex-nowrap items-center gap-4' },
      div({ class: 'text-black text-2xl font-bold leading-loose whitespace-nowrap' }, headingText),
      a({ href: '#', class: 'text-violet-600 text-base font-bold hover:underline whitespace-nowrap' }, 'Browse 120 Products →')
    ),
    div({ class: 'w-72 inline-flex justify-end items-center gap-6' },
      div({ class: 'flex justify-start items-center gap-3' },
        button({
          class: 'carousel-prev-div w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center',
          onclick: () => changeSlide(-1)
        },
          `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M15 6l-6 6 6 6" stroke="#333" stroke-width="2" fill="none"/></svg>`
        ),
        button({
          class: 'carousel-next-div w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center',
          onclick: () => changeSlide(1)
        },
          `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M9 6l6 6-6 6" stroke="#333" stroke-width="2" fill="none"/></svg>`
        )
      ),
      div({ class: 'flex justify-start items-center' },
        button({
          class: 'toggle-view-list px-3 py-2 bg-white rounded-l-full outline outline-1 outline-violet-600',
          onclick: () => switchView(false),
          innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600"><use href="#icons-sprite-view-list"></use></svg>`
        }),
        button({
          class: 'toggle-view-grid px-3 py-2 bg-violet-600 text-white rounded-r-full outline outline-1 outline-violet-600',
          onclick: () => switchView(true),
          innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white"><use href="#icons-sprite-view-grid"></use></svg>`
        })
      )
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
    const description = item.querySelector('[data-aue-label="RightDescription"] p')?.textContent?.trim();
    const viewText = item.querySelector('[data-aue-label="View-Details"]')?.textContent?.trim();
    const quoteText = item.querySelector('[data-aue-label="Quote Link"]')?.textContent?.trim();
    const buyText = item.querySelector('[data-aue-label="Buy Link"]')?.textContent?.trim();

    const card = div({ class: 'w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start' });

    if (image) card.append(img({ src: image, alt: title || 'Product', class: 'h-48 w-full object-cover' }));
    if (title) card.append(p({ class: 'p-3 text-black text-xl font-bold leading-7' }, title));
    if (description) card.append(p({ class: 'px-3 pb-3 text-gray-700 text-sm line-clamp-4' }, description));

    const details = div({ class: 'self-stretch px-4 py-3 bg-gray-50 flex flex-col items-end gap-4' });

    if (price) details.append(div({ class: 'text-black text-2xl font-bold text-right' }, price));

    if (unitText && unitVal) {
      details.append(div({ class: 'w-full flex justify-between' },
        p({ class: 'text-black text-base font-extralight' }, unitText),
        p({ class: 'text-black text-base font-bold' }, unitVal)
      ));
    }

    if (qtyLabel && qtyVal) {
      details.append(div({ class: 'w-full flex justify-between' },
        p({ class: 'text-black text-base font-extralight' }, qtyLabel),
        p({ class: 'text-black text-base font-bold' }, qtyVal)
      ));
    }

    const buttonGroup = div({ class: 'flex gap-3 items-center mt-3 w-full justify-between' });

    if (buyText) {
      buttonGroup.append(
        div({ class: 'w-14 px-4 py-1.5 bg-white rounded-md outline outline-1 outline-gray-300 text-center text-black' }, '1'),
        button({ class: 'w-24 px-5 py-2 bg-violet-600 text-white rounded-full outline outline-1 outline-violet-600' }, buyText),
        button({ class: 'px-5 py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600' }, quoteText || 'Quote')
      );
    } else if (quoteText) {
      buttonGroup.append(
        button({
          class: 'w-full py-2 bg-white text-violet-600 rounded-full outline outline-1 outline-violet-600 text-center'
        }, quoteText)
      );
    }

    if (buyText || quoteText) details.append(buttonGroup);
    card.append(details);

    if (viewText) {
      card.append(
        div({ class: 'p-3 w-full' },
          a({ href: '#', class: 'text-violet-600 text-base font-bold' }, `${viewText} →`)
        )
      );
    }

    return card;
  }

  function updateView() {
    carouselCards.innerHTML = '';
    const visibleItems = isGridView
      ? items.slice(currentIndex, currentIndex + cardsPerPage)
      : items;

    visibleItems.forEach(item => carouselCards.append(renderCard(item)));
  }

  function changeSlide(direction) {
    if (!isGridView) return;
    const maxIndex = Math.max(0, items.length - cardsPerPage);
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
  block.innerHTML = '';
  block.append(carouselContainer);
}

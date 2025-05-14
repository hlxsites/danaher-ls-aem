
import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default function renderGridView(products, container, linkText) {
  const grid = div({ class: 'flex gap-4 overflow-x-auto px-1' });

  products.forEach((product) => {
    if (!product) return;
    const { title, url, image, description, showCart, price, unitMeasure, minQty } = product;

    const card = div({ class: 'flex flex-col border border-gray-300 bg-white w-[294px] min-h-[485px] rounded p-4' });

    if (image) {
      card.append(img({ src: image, alt: title, class: 'w-full h-32 object-contain mb-4' }));
    }

    card.append(p({ class: 'text-base font-semibold text-black mb-2 line-clamp-2' }, title));

    const info = div({ class: 'bg-gray-100 p-3 rounded flex flex-col flex-1 justify-between' });

    if (showCart && price !== undefined) {
      info.append(
        p({ class: 'text-right text-xl font-bold text-black mb-2' }, `$${price.toLocaleString()}`),
        p({ class: 'text-sm text-gray-600' }, `Unit of Measure: ${unitMeasure}`),
        p({ class: 'text-sm text-gray-600' }, `Min. Order Qty: ${minQty}`)
      );

      info.append(
        div({ class: 'flex justify-between items-center gap-2 mt-3' },
          div({ class: 'w-12 px-2 py-1 bg-white rounded border text-center text-sm text-black' }, '1'),
          button({ class: 'bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold' }, 'Buy'),
          button({ class: 'bg-white border border-purple-600 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold' }, 'Quote')
        )
      );
    } else {
      info.append(
        p({ class: 'text-sm text-gray-700 mb-3 leading-snug line-clamp-4' }, description),
        button({ class: 'w-full mt-auto border border-purple-600 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold' }, 'Quote')
      );
    }

    info.append(a({ href: url, class: 'text-purple-600 text-sm font-medium mt-3 underline flex items-center' }, linkText, span({ class: 'ml-1' }, '→')));

    card.append(info);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

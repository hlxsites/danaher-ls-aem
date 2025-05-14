
import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default function renderListView(products, container, linkText) {
  const list = div({ class: 'flex flex-col gap-6' });

  products.forEach((product) => {
    if (!product) return;
    const { title, url, image, description, showCart, price, unitMeasure, minQty } = product;

    const row = div({ class: 'flex border border-gray-300 rounded p-4 bg-white items-start gap-4' });

    const imageCol = div({ class: 'w-32 flex-shrink-0' });
    if (image) {
      imageCol.append(img({ src: image, alt: title, class: 'w-full h-24 object-contain' }));
    }

    const contentCol = div({ class: 'flex flex-col flex-1' },
      p({ class: 'text-base font-semibold text-black mb-2 line-clamp-2' }, title),
      p({ class: 'text-sm text-gray-700 mb-2 leading-snug line-clamp-4' }, description),
      a({ href: url, class: 'text-purple-600 text-sm font-medium underline flex items-center' }, linkText, span({ class: 'ml-1' }, '→'))
    );

    const actionCol = div({ class: 'flex flex-col items-end gap-2 text-right w-40 flex-shrink-0' });

    if (showCart && price !== undefined) {
      actionCol.append(
        p({ class: 'text-xl font-bold text-black' }, `$${price.toLocaleString()}`),
        p({ class: 'text-sm text-gray-600' }, `Availability`),
        p({ class: 'text-sm text-gray-600' }, `Unit: ${unitMeasure}`),
        p({ class: 'text-sm text-gray-600' }, `Min Qty: ${minQty}`),
        div({ class: 'flex items-center gap-2 mt-1' },
          div({ class: 'w-12 px-2 py-1 bg-white rounded border text-center text-sm text-black' }, '1'),
          button({ class: 'bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold' }, 'Buy'),
          button({ class: 'bg-white border border-purple-600 text-purple-600 px-4 py-1 rounded-full text-sm font-semibold' }, 'Quote')
        )
      );
    } else {
      actionCol.append(button({ class: 'bg-white border border-purple-600 text-purple-600 px-4 py-1 rounded-full text-sm font-semibold' }, 'Quote'));
    }

    row.append(imageCol, contentCol, actionCol);
    list.appendChild(row);
  });

  container.appendChild(list);
}

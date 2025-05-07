import {
  div, p, h2, a, img, span
} from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  console.log('🟣 decorate() started');

  const maxCards = 8;
  const baseUrl = 'https://lifesciences.danaher.com';

  try {
    const response = await fetch(`${baseUrl}/us/en/products-index.json`);
    const raw = await response.json();
    console.log('📦 Raw fetched data:', raw);

    const allProducts = Array.isArray(raw)
      ? raw
      : raw?.data || raw?.results || [];

    console.log('🧩 Total products fetched:', allProducts.length);

    const filtered = allProducts.filter((item) => {
      const category = item.fullCategory || '';
      const isValid = category.toLowerCase() === 'antibodies';
      const hasNoPipe = !category.includes('|');
      return isValid && hasNoPipe;
    });

    console.log(`✅ Filtered products with fullCategory="antibodies" (no pipes): ${filtered.length}`, filtered);

    const selected = filtered.slice(0, maxCards);

    const sectionWrapper = div({
      class: 'w-full py-12 px-6 bg-white'
    });

    const compHeading = block.querySelector('div')?.innerText;
    const header = div({
      class: 'flex flex-col gap-2 mb-6'
    },
      h2({ class: 'text-2xl font-semibold text-gray-900' }, compHeading)
    );

    const grid = div({
      class: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    });

    selected.forEach((item, index) => {
      console.log(`📘 Product #${index + 1}`, item);

      const title = item.title || item.Title || 'Product';
      const clickUri = item.path || item.url || item.ClickUri || '#';
      const image = item.image || item.Image || (item.images?.[0]) || '';

      // ✅ Prefix relative image URL
      const absoluteImg = image.startsWith('http') ? image : `${baseUrl}${image}`;

      const card = div({
        class: 'border border-gray-300 rounded-md overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col'
      },
        image && img({
          src: absoluteImg,
          alt: title,
          class: 'h-40 w-full object-contain p-4'
        }),
        div({ class: 'p-4 flex flex-col gap-3 flex-1' },
          a({
            href: clickUri,
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'text-sm text-purple-600 font-semibold hover:underline mt-auto flex items-center gap-1'
          },
            'Browse Product',
            span({ class: 'text-purple-600' }, '➔')
          )
        )
      );

      grid.appendChild(card);
    });

    sectionWrapper.append(header, grid);
    block.innerHTML = '';
    block.appendChild(sectionWrapper);

    console.log('✅ decorate() completed successfully');

  } catch (err) {
    console.error('❌ Failed to load and render products:', err);
  }
}

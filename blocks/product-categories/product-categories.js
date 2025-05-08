import {
  div, p, h2, a, img, span, button,
} from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const baseUrl = 'https://lifesciences.danaher.com';
  const maxCards = 8;

  const wrapper = block.closest('.product-categories-wrapper');
  const brandEl = wrapper.querySelector("[data-aue-label='Brand']");
  const titleEl = wrapper.querySelector("[data-aue-label='Title']");

  const authoredBrand = brandEl?.textContent?.trim().toLowerCase();
  const authoredTitle = titleEl?.textContent?.trim();

  try {
    const response = await fetch(`${baseUrl}/us/en/products-index.json`);
    const raw = await response.json();
    const allProducts = Array.isArray(raw) ? raw : raw?.data || raw?.results || [];

    const createCard = (item) => {
      const title = item.title || item.Title || 'Product';
      const clickUri = item.path || item.url || item.ClickUri || '#';
      const image = item.image || item.Image || (item.images?.[0]) || '';
      const absImg = image.startsWith('http') ? image : `${baseUrl}${image}`;

      return div({
        class: 'border border-gray-300 rounded-md overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col',
      },
        image && img({ src: absImg, alt: title, class: 'h-40 w-full object-contain p-4' }),
        div({ class: 'p-4 flex flex-col gap-3 flex-1' },
          p({ class: 'text-sm font-medium text-gray-900' }, title),
          a({
            href: clickUri,
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'text-sm text-purple-600 font-semibold hover:underline mt-auto flex items-center gap-1',
          },
            'Browse Products',
            span({ class: 'text-purple-600' }, '➔')
          )
        )
      );
    };

    const sectionWrapper = div({ class: 'w-full py-12 px-6 bg-white' });
    const header = div({ class: 'flex flex-col gap-2 mb-6' },
      h2({ class: 'text-2xl font-semibold text-gray-900' }, authoredTitle || 'All Categories')
    );

    const grid = div({
      class: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    });

    const filterBar = div({
      class: 'flex flex-wrap gap-2 mb-6',
    });

    const renderGrid = (list) => {
      grid.innerHTML = '';
      list.slice(0, maxCards).forEach((item) => {
        grid.appendChild(createCard(item));
      });
    };

    // CASE 1: Authored Brand
    if (authoredBrand && authoredTitle) {
      const filtered = allProducts.filter((item) => {
        const category = item.fullCategory || '';
        return category.toLowerCase() === authoredBrand && !category.includes('|');
      });
      renderGrid(filtered);
      sectionWrapper.append(header, grid);
    } else {
      // CASE 2: All brands with filters from item.brand

      let activeBrand = 'all';

      // Build unique filters (exclude brands with commas)
      const filterSet = new Set();
      allProducts.forEach(item => {
        const brand = item.brand?.trim();
        if (brand && !brand.includes(',')) filterSet.add(brand);
      });
      const allBrands = Array.from(filterSet).sort();

      const createFilterBtn = (label, value) => button({
        class: `px-4 py-1 rounded-full border text-sm font-medium transition ${
          value === activeBrand ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
        }`,
        onclick: (event) => {
          activeBrand = value;
          [...filterBar.children].forEach(btn =>
            btn.classList.remove('bg-purple-600', 'text-white')
          );
          event.target.classList.add('bg-purple-600', 'text-white');

          const list = value === 'all'
            ? allProducts
            : allProducts.filter(p => {
                const brands = p.brand?.split(',').map(b => b.trim().toLowerCase()) || [];
                return brands.includes(value);
              });

          renderGrid(list);
        },
      }, label);

      filterBar.appendChild(createFilterBtn('All', 'all'));
      allBrands.forEach(brand => {
        filterBar.appendChild(createFilterBtn(brand, brand.toLowerCase()));
      });

      renderGrid(allProducts);

      sectionWrapper.append(header, filterBar, grid);
    }

    block.innerHTML = '';
    block.appendChild(sectionWrapper);
    console.log('✅ decorate() complete');
  } catch (err) {
    console.error('❌ Failed to load product categories:', err);
  }
}

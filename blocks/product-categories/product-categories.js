import {
  div, p, h2, a, img, span, button,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const baseUrl = 'https://lifesciences.danaher.com';
  const maxCards = 28;

  document
    .querySelector('.product-categories-wrapper')
    ?.parentElement?.removeAttribute('class');
  document
    .querySelector('.product-categories-wrapper')
    ?.parentElement?.removeAttribute('style');
  const wrapper = block.closest('.product-categories-wrapper');
  const brandEl = wrapper.querySelector("[data-aue-label='Brand']");
  const titleEl = wrapper.querySelector("[data-aue-label='Title']");

  const authoredBrand = brandEl?.textContent?.trim().toLowerCase();
  const authoredTitle = titleEl?.textContent?.trim();

  try {
    const response = await fetch(`${baseUrl}/us/en/products-index.json`);
    const raw = await response.json();
    const allProducts = Array.isArray(raw)
      ? raw
      : raw?.data || raw?.results || [];

    const createCard = (item) => {
      const title = item.title || item.Title || 'Product';
      const clickUri = item.path || item.url || item.ClickUri || '#';
      const image = item.image || item.Image || item.images?.[0] || '';
      const absImg = image.startsWith('http') ? image : `${baseUrl}${image}`;

      return div(
        {
          class:
            'border border-gray-300 overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col',
        },
        image
          && img({
            src: absImg,
            alt: title,
            class: 'h-40 w-full object-contain p-4',
          }),
        div(
          { class: 'p-4 flex flex-col gap-3 flex-1 justify-between' },
          p({ class: 'text-black text-xl font-medium leading-7' }, title),
          a(
            {
              href: clickUri,
              target: '_blank',
              rel: 'noopener noreferrer',
              class:
                'text-danaherpurple-500 hover:underline text-base font-semibold flex items-center gap-1',
            },
            'Browse Products',
            span({
              class:
                'icon icon-arrow-right  w-4 h-4 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800',
            }),
          ),
        ),
      );
    };

    const sectionWrapper = div({
      class: 'w-full bg-white dhls-container md:p-0 dhls-mobile-spacing',
    });
    const header = div(
      { class: 'flex flex-col gap-2 mb-12' },
      h2(
        { class: 'text-2xl font-semibold text-gray-900' },
        authoredTitle || 'All Categories',
      ),
    );

    const grid = div({
      class:
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
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
        return (
          category.toLowerCase() === authoredBrand && !category.includes('|')
        );
      });
      renderGrid(filtered);
      sectionWrapper.append(header, grid);
    } else {
      // CASE 2: All brands with filters from item.brand

      let activeBrand = 'all';

      // Build unique filters (exclude brands with commas)
      const filterSet = new Set();
      allProducts.forEach((item) => {
        const brand = item.brand?.trim();
        if (brand && !brand.includes(',')) filterSet.add(brand);
      });
      const allBrands = Array.from(filterSet).sort();

      const createFilterBtn = (label, value) => button(
        {
          class: `px-4 py-1 bg-gray-100 border-2 border-danaherpurple-500 text-sm text-gray-500 font-medium leading-tight transition ${
            value === activeBrand
              ? 'border-danaherpurple-500'
              : 'border-gray-100'
          }`,
          onclick: (event) => {
            activeBrand = value;
            [...filterBar.children].forEach((btn) => btn.classList.remove(
              'border-danaherpurple-500',
              'border-gray-100',
            ));
            event.target.classList.add('border-danaherpurple-500');

            const list = value === 'all'
              ? allProducts
              : allProducts.filter((pr) => {
                const brands = pr.brand
                  ?.split(',')
                  .map((b) => b.trim().toLowerCase()) || [];
                return brands.includes(value);
              });

            renderGrid(list);
          },
        },
        label,
      );

      filterBar.appendChild(createFilterBtn('All', 'all'));
      allBrands.forEach((brand) => {
        filterBar.appendChild(createFilterBtn(brand, brand.toLowerCase()));
      });

      renderGrid(allProducts);

      sectionWrapper.append(header, filterBar, grid);
    }

    decorateIcons(sectionWrapper);
    block.innerHTML = '';
    block.append(sectionWrapper);
  } catch (err) {
    // return null;
  }
  // return {};
}

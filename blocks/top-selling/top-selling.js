import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

export default async function decorate(block) {
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.className = '';
    wrapper.classList.add('w-full', 'px-4', 'md:px-10', 'flex', 'justify-center');
  }

  const headingText = 'Top Selling Products, You may also need';
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  // ✅ Vertical list container
  const listContainer = div({
    class: 'flex flex-col gap-4 w-full'
  });

  const getProductInfo = async (id) => {
    try {
      const res1 = await fetch(`https://lifesciences.danaher.com/us/en/product-data/?product=${id}`);
      const main = await res1.json();
      const product = main.results?.[0];
      if (!product) return null;

      const sku = product.raw?.sku || '';
      const res2 = await fetch(`https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`);
      const shopData = await res2.json();

      const showCart = shopData?.attributes?.some(attr => attr.name === 'show_add_to_cart' && attr.value === 'True');

      return {
        title: product.title || '',
        url: product.clickUri || '#',
        image: product.raw?.images?.[0] || '',
        description: product.raw?.ec_shortdesc || '',
        sku,
        showCart,
        price: shopData.salePrice?.value,
        minQty: shopData.minOrderQuantity,
        unitMeasure: '1/Bundle',
      };
    } catch (e) {
      console.error('Fetch error:', e);
      return null;
    }
  };

  const products = await Promise.all(productIds.map(getProductInfo));

  products.forEach((product) => {
    if (!product) return;
    const { title, url, image, description, showCart, price, unitMeasure, minQty } = product;

    const card = div({
      class: 'w-full bg-white border border-gray-300 rounded-lg p-4 flex flex-col md:flex-row items-start gap-4'
    });

    // Smaller image
    if (image) {
      card.append(
        img({
          src: image,
          alt: title,
          class: 'w-32 h-20 object-contain flex-shrink-0'
        })
      );
    }

    // Info section
    const content = div({ class: 'flex flex-col justify-between flex-1' });

    content.append(p({ class: 'text-base font-semibold text-black mb-1 line-clamp-2' }, title));

    if (showCart && price !== undefined) {
      content.append(p({ class: 'text-lg font-bold text-black mb-1' }, `$${price.toLocaleString()}`));
      content.append(
        div({ class: 'text-sm text-gray-500' }, `Unit of Measure: ${unitMeasure}`),
        div({ class: 'text-sm text-gray-500 mb-2' }, `Min. Order Qty: ${minQty}`)
      );
    } else if (description) {
      content.append(p({ class: 'text-sm text-gray-600 mb-2 line-clamp-3' }, description));
    }

    // Buttons
    const actions = showCart
      ? div({ class: 'flex gap-2 mt-2 items-center' },
          div({ class: 'w-12 px-2 py-1 bg-white rounded border text-center text-sm' }, '1'),
          button({ class: 'px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium' }, 'Buy'),
          button({ class: 'px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-medium' }, 'Quote')
        )
      : div({ class: 'flex justify-start mt-2' },
          button({ class: 'px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-medium' }, 'Quote')
        );

    content.append(actions);
    content.append(
      a({ href: url, class: 'text-sm text-purple-600 font-medium mt-3 underline' }, linkText, span({ class: 'ml-1' }, '→'))
    );

    card.append(content);
    listContainer.appendChild(card);
  });

  // Header Row
  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-2xl font-semibold text-gray-900' }, headingText)
  );

  const rendered = div({
    class: 'top-selling-rendered w-full max-w-[1440px] mx-auto flex flex-col gap-4'
  }, titleRow, listContainer);

  block.append(rendered);

  // Hide authored fields
  [...block.children].forEach(child => {
    if (!child.classList.contains('top-selling-rendered')) {
      child.style.display = 'none';
    }
  });
}

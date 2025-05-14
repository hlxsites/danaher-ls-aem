
import renderGridView from './gridView.js';
import renderListView from './listView.js';

export default async function decorate(block) {
  const toggleView = block.querySelector('[data-aue-prop="toggleView"]')?.textContent.trim().toLowerCase() === 'yes';
  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim();
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';
  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  const products = await Promise.all(productIds.map(async (id) => {
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
        showCart,
        price: shopData.salePrice?.value,
        minQty: shopData.minOrderQuantity,
        unitMeasure: '1/Bundle',
      };
    } catch (e) {
      console.error('Fetch error:', e);
      return null;
    }
  }));

  block.textContent = '';

  const gridIcon = document.createElement('img');
  const listIcon = document.createElement('img');
  gridIcon.src = '/icons/grid.svg';
  listIcon.src = '/icons/list.svg';
  gridIcon.className = 'w-6 h-6 cursor-pointer opacity-100';
  listIcon.className = 'w-6 h-6 cursor-pointer opacity-50';

  const controls = document.createElement('div');
  controls.className = 'flex items-center gap-2 ml-auto';
  controls.append(gridIcon, listIcon);

  const header = document.createElement('div');
  header.className = 'flex justify-between items-center mb-4';
  header.innerHTML = `<p class="text-2xl font-semibold text-gray-900">${headingText}</p>`;
  header.append(controls);
  block.append(header);

  const contentWrapper = document.createElement('div');
  block.append(contentWrapper);

  const render = (view) => {
    contentWrapper.innerHTML = '';
    view === 'grid'
      ? renderGridView(products, contentWrapper, linkText)
      : renderListView(products, contentWrapper, linkText);
  };

  gridIcon.addEventListener('click', () => {
    gridIcon.classList.replace('opacity-50', 'opacity-100');
    listIcon.classList.replace('opacity-100', 'opacity-50');
    render('grid');
  });

  listIcon.addEventListener('click', () => {
    listIcon.classList.replace('opacity-50', 'opacity-100');
    gridIcon.classList.replace('opacity-100', 'opacity-50');
    render('list');
  });

  render('grid');
}

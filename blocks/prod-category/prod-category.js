import { div, p, a, span, button } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/icons.js';

function renderGridCard(item) {
  const card = div({
    class:
      "w-[23.9%] min-w-[23.9%] flex-shrink-0 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start h-[470px] p-4",
  });

  const imageWrapper = div({
    class: "relative self-stretch overflow-visible",
  });

  const imageUrl = item.raw.images && item.raw.images[0] ? item.raw.images[0] : "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";

  const imageElement = a(
    { href: item.path, title: item.title },
    img({
      src: imageUrl,
      alt: item.title,
      class: "w-full h-32 object-contain mb-4",
    })
  );

  const carrierFreeBadge = div(
    {
      class: "px-4 py-1 absolute left-2 top-[128px] bg-violet-50 inline-flex justify-center items-center gap-2.5 z-10",
      "data-state": "Static",
    },
    div(
      {
        class: "pt-1 text-center text-violet-600 text-sm font-normal leading-tight",
      },
      "Carrier Free"
    )
  );

  imageWrapper.append(imageElement, carrierFreeBadge);

  const titleElement = p(
    { class: "text-base font-semibold text-black mb-3 line-clamp-2" },
    item.title
  );

  const contentWrapper = div({
    class: item.showCart && item.price !== undefined
      ? "bg-gray-100 p-4 rounded-md flex flex-col justify-between flex-1 min-h-[220px]"
      : "bg-gray-100 p-4 rounded-md flex flex-col justify-between flex-1 min-h-[180px]",
  });

  if (item.showCart && item.price !== undefined) {
    contentWrapper.append(
      p({ class: "text-right text-xl font-bold text-black mb-3" }, `$${item.price.toLocaleString()}`),
      div({ class: "flex justify-between text-sm text-gray-600 mb-1" },
        p({ class: "text-sm" }, "Unit of Measure:"),
        p({ class: "font-semibold text-sm text-black" }, item.raw.uom || "1/Bundle")
      ),
      div({ class: "flex justify-between text-sm text-gray-600 mb-3" },
        p({ class: "text-sm" }, "Min. Order Qty:"),
        p({ class: "font-semibold text-sm text-black" }, `${item.raw.minQty || 50}`)
      )
    );

    const actions = div({ class: "flex flex-col gap-3 mt-auto items-center justify-center" },
      div({ class: "flex gap-2 items-center" },
        div({ class: "w-12 px-2 py-1 bg-white rounded border text-center text-sm text-black" }, "1"),
        button({ class: "px-5 py-2.5 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700" }, "Buy"),
        button({ class: "px-5 py-2.5 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50" }, "Quote")
      )
    );

    contentWrapper.append(actions);
  } else {
    contentWrapper.append(
      p({ class: "text-sm text-gray-700 mb-3 leading-snug line-clamp-4 text-left mt-2" }, item.description),
      div({ class: "flex mt-auto w-full" },
        button({
          class: "w-full px-5 py-2.5 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50 text-center"
        }, "Quote")
      )
    );
  }

  contentWrapper.append(
    div({ class: "flex justify-start mt-4" },
      a({ href: item.path, class: "text-sm text-purple-600 font-medium underline" },
        "View Details",
        span({ class: "ml-1" }, "→")
      )
    )
  );

  card.append(imageWrapper, titleElement, contentWrapper);

  const imgElement = card.querySelector("img");
  if (imgElement) {
    imgElement.onerror = function () {
      if (!imgElement.getAttribute('data-fallback-applied')) {
        imgElement.src = 'https://s7d9.scene7.com/is/image/danaherstage/no-image-availble';
        imgElement.setAttribute('data-fallback-applied', 'true');
      }
    };
  }

  return card;
}

export default async function decorate(block) {
  const wrapper = block.closest('.prod-category-wrapper');
  if (wrapper) {
    wrapper.classList.add('w-full', 'px-4', 'md:px-10', 'flex', 'justify-center');
  }

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim();
  const buttonText = block.querySelector('[data-aue-prop="button_text"]')?.textContent.trim();

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  console.log('Product IDs:', productIds);
  console.log('Raw IDs:', rawIds);

  const blockWrapper = div({ class: 'prod-category-rendered w-full max-w-[1440px] mx-auto flex flex-col gap-4' });

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-4 flex-row', // Always grid view
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = 4;

  const getProductInfo = async (id) => {
    console.log(`Fetching product info for ID: ${id}`);
    try {
      const res1 = await fetch(`https://stage.lifesciences.danaher.com/us/en/product-data/?product=${id}`);
      console.log(`First API response for ID ${id}:`, res1.status, res1.statusText);
      const main = await res1.json();
      const product = main.results?.[0];
      if (!product) {
        console.log(`No product found for ID ${id}`);
        return null;
      }

      const sku = product.raw?.sku || '';
      const res2 = await fetch(`https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`);
      console.log(`Second API response for SKU ${sku}:`, res2.status, res2.statusText);
      const shopData = await res2.json();

      const showCart = shopData?.attributes?.some(attr => attr.name === 'show_add_to_cart' && attr.value === 'True');

      return {
        title: product.title || '',
        path: product.clickUri || '#',
        url: product.clickUri || '#',
        raw: {
          images: product.raw?.images || [],
          uom: '1/Bundle',
          minQty: shopData.minOrderQuantity,
          price: shopData.salePrice?.value,
          availability: shopData.availability || 0,
        },
        description: product.raw?.ec_shortdesc || '',
        showCart,
        price: shopData.salePrice?.value,
        minQty: shopData.minOrderQuantity,
        unitMeasure: '1/Bundle',
      };
    } catch (e) {
      console.error(`Fetch error for ID ${id}:`, e);
      return null;
    }
  };

  console.log('Starting API calls...');
  const products = await Promise.all(productIds.map(getProductInfo));
  console.log('API calls completed. Products:', products);
  const filteredProducts = products.filter(product => product !== null);
  console.log('Filtered Products:', filteredProducts);

  if (filteredProducts.length === 0) {
    blockWrapper.append(p({ class: 'text-center text-gray-600' }, 'No products available.'));
  } else {
    filteredProducts.forEach((product) => {
      const card = renderGridCard(product);
      scrollContainer.appendChild(card);
    });
  }

  const totalCards = scrollContainer.children.length;

  const leftArrow = span({
    class: 'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600 mr-2 opacity-50 pointer-events-none',
    title: 'Scroll Left'
  }, '←');

  const rightArrow = span({
    class: 'w-8 h-8 rounded-full flex items-center justify-center cursor-pointer bg-gray-200 text-purple-600',
    title: 'Scroll Right'
  }, '→');

  const controls = div({ class: 'flex items-center gap-2' }, leftArrow, rightArrow);

  const titleRow = div({ class: 'flex justify-between items-center mb-4' },
    p({ class: 'text-2xl font-semibold text-gray-900' }, headingText),
    p({ class: 'text-sm text-purple-600 font-semibold cursor-pointer' }, buttonText
    ),
    controls
  );

  const updateCarousel = () => {
    const card = scrollContainer.children[0];
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    scrollContainer.style.transform = `translateX(-${cardWidth * currentIndex}px)`;

    leftArrow.classList.toggle('opacity-50', currentIndex <= 0);
    leftArrow.classList.toggle('pointer-events-none', currentIndex <= 0);
    rightArrow.classList.toggle('opacity-50', currentIndex >= totalCards - visibleCards);
    rightArrow.classList.toggle('pointer-events-none', currentIndex >= totalCards - visibleCards);
  };

  const scrollToIndex = (index) => {
    currentIndex = index;
    updateCarousel();
  };

  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - visibleCards);
    }
  });

  rightArrow.addEventListener('click', () => {
    if (currentIndex < totalCards - visibleCards) {
      scrollToIndex(currentIndex + visibleCards);
    }
  });

  const scrollWrapper = div({ class: 'overflow-hidden w-full' }, scrollContainer);
  blockWrapper.append(titleRow, scrollWrapper);
  block.append(blockWrapper);

  if (filteredProducts.length > 0) {
    setTimeout(updateCarousel, 100);
  }

  [...block.children].forEach((child) => {
    if (!child.classList.contains('prod-category-rendered')) {
      child.style.display = 'none';
    }
  });
}
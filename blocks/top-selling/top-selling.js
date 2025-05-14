import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';

function renderGridCard(item) {
  const card = div({
    class:
      "w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
  });

  const imageWrapper = div({
    class: "relative self-stretch overflow-visible",
  });

  const imageUrl = item.raw.images && item.raw.images[0] ? item.raw.images[0] : "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";

  const imageElement = a(
    { href: item.url, title: item.title },
    img({
      src: imageUrl,
      alt: item.title,
      class: "self-stretch h-40 object-cover",
    })
  );

  const carrierFreeBadge = div({
    class: "px-4 py-1 absolute left-2 top-40 bg-violet-50 inline-flex justify-center items-center gap-2.5 z-10",
    "data-state": "Static",
  },
    div({
      class: "pt-1 text-center text-violet-600 text-sm font-normal leading-tight"
    }, "Carrier Free")
  );

  imageWrapper.append(imageElement, carrierFreeBadge);

  // Title Element
  const titleElement = p(
    { class: "p-3 text-black text-xl font-normal leading-7" },
    item.title
  );

  // Content Wrapper for Title and Description
  const contentWrapper = div({
    class: "flex flex-col justify-start items-start w-full flex-grow",
  });

  // Add description if showCart is false or price is undefined
  if (!item.showCart || item.price === undefined) {
    contentWrapper.append(
      titleElement,
      p({ class: "px-3 text-sm text-gray-700 mb-3 leading-snug line-clamp-4" }, item.description)
    );
  } else {
    contentWrapper.append(titleElement);
  }

  // Pricing Details - Only show if showCart is true and price is defined
  const pricingDetails = div({
    class: "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
  });

  if (item.showCart && item.price !== undefined) {
    pricingDetails.append(
      div(
        {
          class: "text-right justify-start text-black text-2xl font-normal leading-loose",
        },
        `$${item.price.toLocaleString()}`
      ),
      div(
        { class: "self-stretch flex flex-col justify-start items-start gap-2" },
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class: "text-black text-base font-extralight leading-snug",
            },
            "Unit of Measure:"
          ),
          div(
            {
              class: "text-black text-base font-bold leading-snug",
            },
            item?.raw?.uom || "1/Bundle"
          )
        ),
        div(
          { class: "flex justify-between items-center w-full" },
          div(
            {
              class: "text-black text-base font-extralight leading-snug",
            },
            "Min. Order Qty:"
          ),
          div(
            {
              class: "text-black text-base font-bold leading-snug",
            },
            item?.raw?.minQty || "50"
          )
        )
      )
    );
  }

  // Action Buttons: Conditional rendering
  let actionButtons;
  if (item.showCart && item.price !== undefined) {
    actionButtons = div(
      { class: "inline-flex justify-start items-center ml-3 mt-5 gap-3" },
      div(
        {
          class:
            "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class:
              "justify-start text-black text-base font-normal font-['Inter'] leading-normal",
          },
          "1"
        )
      ),
      div(
        {
          class:
            "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class: "text-white text-base font-normal leading-snug",
          },
          "Buy"
        )
      ),
      div(
        {
          class:
            "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
        },
        div(
          {
            class: "text-violet-600 text-base font-normal leading-snug",
          },
          "Quote"
        )
      )
    );
  } else {
    actionButtons = div(
      { class: "flex mt-auto w-full ml-3 mt-5" }, // Match the provided code's styling
      button({
        class:
          "w-full px-5 py-2.5 bg-white text-purple-600 border border-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50 text-center",
      }, "Quote")
    );
  }

  // View Details Button - Always at the bottom
  const viewDetailsButton = div(
    { class: "self-stretch p-3 flex justify-start items-center" },
    div(
      { class: "text-violet-600 text-base font-bold leading-snug" },
      "View Details →"
    )
  );

  card.append(imageWrapper, contentWrapper, pricingDetails, actionButtons, viewDetailsButton);

  // Add onerror handler to the <img> element inside the card
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
  const wrapper = block.closest('.top-selling-wrapper');
  if (wrapper) {
    wrapper.classList.add('w-full', 'px-4', 'md:px-10', 'flex', 'justify-center');
  }

  const headingText = block.querySelector('[data-aue-prop="titleText"]')?.textContent.trim();
  const linkText = block.querySelector('[data-aue-prop="card_hrefText"]')?.textContent.trim() || 'View Details';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  const blockWrapper = div({ class: 'top-selling-rendered w-full max-w-[1440px] mx-auto flex flex-col gap-4' });

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-4 flex-row', // Always grid view
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = 4;

  const getProductInfo = async (id) => {
    try {
      const res1 = await fetch(`https://stage.lifesciences.danaher.com/us/en/product-data/?product=${id}`);
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
        raw: {
          images: product.raw?.images || [],
          uom: '1/Bundle',
          minQty: shopData.minOrderQuantity,
        },
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
  };

  const products = await Promise.all(productIds.map(getProductInfo));

  products.forEach((product) => {
    if (!product) return;
    const card = renderGridCard(product);
    scrollContainer.appendChild(card);
  });

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
    controls
  );

  const scrollWrapper = div({ class: 'overflow-hidden w-full' }, scrollContainer);
  blockWrapper.append(titleRow, scrollWrapper);
  block.append(blockWrapper);

  const totalCards = scrollContainer.children.length;

  const updateArrows = () => {
    leftArrow.classList.toggle('opacity-50', currentIndex <= 0);
    leftArrow.classList.toggle('pointer-events-none', currentIndex <= 0);
    rightArrow.classList.toggle('opacity-50', currentIndex >= totalCards - visibleCards);
    rightArrow.classList.toggle('pointer-events-none', currentIndex >= totalCards - visibleCards);
  };

  const scrollToIndex = (index) => {
    const card = scrollContainer.children[0];
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    scrollContainer.style.transform = `translateX(-${cardWidth * index}px)`;
    currentIndex = index;
    updateArrows();
  };

  leftArrow.addEventListener('click', () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - visibleCards);
  });

  rightArrow.addEventListener('click', () => {
    if (currentIndex < totalCards - visibleCards) scrollToIndex(currentIndex + visibleCards);
  });

  setTimeout(updateArrows, 100);

  [...block.children].forEach((child) => {
    if (!child.classList.contains('top-selling-rendered')) {
      child.style.display = 'none';
    }
  });
}
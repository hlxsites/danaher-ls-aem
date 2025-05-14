import { div, p, a, span, button } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/icons.js';
import renderListCard from './listData.js'; // Assumed import from prior conversations

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
    { href: item.path, title: item.title },
    img({
      src: imageUrl,
      alt: item.title,
      class: "self-stretch h-40 object-cover",
    })
  );

  const carrierFreeBadge = div(
    {
      class: "px-4 py-1 absolute left-2 top-40 bg-violet-50 inline-flex justify-center items-center gap-2.5 z-10",
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
    { class: "p-3 text-black text-xl font-normal leading-7" },
    item.title
  );

  const contentWrapper = div({
    class: "flex flex-col justify-start items-start w-full flex-grow",
  });

  contentWrapper.append(titleElement);

  const pricingDetails = div(
    {
      class:
        "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
    },
    div(
      {
        class:
          "text-right justify-start text-black text-2xl font-normal leading-loose",
      },
      `$${item?.price ? item.price.toLocaleString() : '1,000.00'}`
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

  const actionButtons = div(
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

  const viewDetailsButton = div(
    { class: "self-stretch p-3 flex justify-start items-center" },
    div(
      { class: "text-violet-600 text-base font-bold leading-snug" },
      "View Details →"
    )
  );

  card.append(imageWrapper, contentWrapper, pricingDetails, actionButtons, viewDetailsButton);

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
  const toggleView = block.querySelector('[data-aue-prop="toggleView"]')?.textContent.trim().toLowerCase() === 'yes';

  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || '';
  const productIds = rawIds.split(',').map(id => id.trim()).filter(Boolean);

  console.log('Product IDs:', productIds);
  console.log('Raw IDs:', rawIds);

  const carouselContainer = div({
    class: "carousel-container flex flex-col w-full py-6 justify-center",
  });

  const carouselHead = div({
    class: "w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4",
  });

  const leftGroup = div({ class: "flex flex-wrap sm:flex-nowrap items-center gap-4" });
  const productTitle = div(
    {
      class: 'text-black text-2xl font-normal font-["TWK_Lausanne_Pan"] leading-loose whitespace-nowrap',
    },
    headingText,
  );
  const browseLink = a(
    {
      href: "#",
      class: 'text-violet-600 text-base font-bold font-["TWK_Lausanne_Pan"] leading-snug hover:underline whitespace-nowrap',
    },
    buttonText,
  );
  leftGroup.append(productTitle, browseLink);

  const arrows = div({ class: "w-72 inline-flex justify-end items-center gap-6" });
  const arrowGroup = div({ class: "flex justify-start items-center gap-3" });
  const prevDiv = div({
    class: "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer bg-gray-200 rounded-full flex items-center justify-center",
  });
  const nextDiv = div({
    class: "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer bg-gray-200 rounded-full flex items-center justify-center",
  });

  prevDiv.append(span({ class: "icon icon-chevron-left w-6 h-6 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600" }));
  nextDiv.append(span({ class: "icon icon-chevron-right w-6 h-6 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600" }));
  decorateIcons(arrowGroup);

  arrowGroup.append(prevDiv, nextDiv);

  let viewModeGroup = null;
  if (toggleView) {
    viewModeGroup = div({ class: "flex justify-start items-center" });
    const listBtn = div(
      {
        class: "px-3 py-2 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
        id: "list-view-toggle",
      },
      div(
        { class: "w-5 h-5 relative overflow-hidden" },
        span({ class: "icon icon-view-list w-6 h-6 absolute fill-current text-gray-600 [&_svg>use]:stroke-gray-600" }),
      ),
    );
    const gridBtn = div(
      {
        class: "px-3 py-2 bg-violet-600 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden cursor-pointer",
        id: "grid-view-toggle",
      },
      div(
        { class: "w-5 h-5 relative overflow-hidden" },
        span({ class: "icon icon-view-grid w-6 h-6 absolute fill-current text-white [&_svg>use]:stroke-white" }),
      ),
    );
    viewModeGroup.append(listBtn, gridBtn);
    decorateIcons(viewModeGroup);
  }

  arrows.append(arrowGroup, viewModeGroup);
  carouselHead.append(leftGroup, arrows);

  const blockWrapper = div({ class: 'prod-category-rendered w-full max-w-[1440px] mx-auto flex flex-col gap-4' });

  const scrollContainer = div({
    class: 'flex transition-all duration-300 ease-in-out gap-4',
    style: 'transform: translateX(0);',
  });

  let currentIndex = 0;
  const visibleCards = { sm: 1, md: 2, lg: 4 };
  const cardWidthPercentage = { sm: '90%', md: '48%', lg: '23.9%' };

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
          availability: shopData.availability || 0, // For renderListCard
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

  const updateCarousel = () => {
    const cardWidth = scrollContainer.children[0]?.getBoundingClientRect().width || 0;
    const translateX = -(currentIndex * (cardWidth + 16));
    scrollContainer.style.transform = `translateX(${translateX}px)`;

    prevDiv.classList.toggle('opacity-50', currentIndex <= 0);
    prevDiv.classList.toggle('pointer-events-none', currentIndex <= 0);
    const cardsPerView = window.innerWidth >= 1024 ? visibleCards.lg : window.innerWidth >= 768 ? visibleCards.md : visibleCards.sm;
    nextDiv.classList.toggle('opacity-50', currentIndex >= totalCards - cardsPerView);
    nextDiv.classList.toggle('pointer-events-none', currentIndex >= totalCards - cardsPerView);
  };

  const scrollToIndex = (index) => {
    currentIndex = index;
    updateCarousel();
  };

  if (filteredProducts.length === 0) {
    blockWrapper.append(p({ class: 'text-center text-gray-600' }, 'No products available.'));
  } else {
    // Initial render in grid view using renderGridCard
    filteredProducts.forEach((product) => {
      const card = renderGridCard(product);
      scrollContainer.appendChild(card);
    });

    const totalCards = filteredProducts.length;

    prevDiv.addEventListener('click', () => {
      if (currentIndex > 0) {
        const cardsPerView = window.innerWidth >= 1024 ? visibleCards.lg : window.innerWidth >= 768 ? visibleCards.md : visibleCards.sm;
        scrollToIndex(Math.max(0, currentIndex - cardsPerView));
      }
    });

    nextDiv.addEventListener('click', () => {
      const cardsPerView = window.innerWidth >= 1024 ? visibleCards.lg : window.innerWidth >= 768 ? visibleCards.md : visibleCards.sm;
      if (currentIndex < totalCards - cardsPerView) {
        scrollToIndex(Math.min(totalCards - cardsPerView, currentIndex + cardsPerView));
      }
    });

    window.addEventListener('resize', updateCarousel);

    if (toggleView) {
      const gridBtn = block.querySelector('#grid-view-toggle');
      const listBtn = block.querySelector('#list-view-toggle');

      const renderGridView = () => {
        scrollContainer.classList.remove('flex-col');
        scrollContainer.classList.add('flex');
        scrollContainer.innerHTML = '';
        filteredProducts.forEach((product) => {
          const card = renderGridCard(product);
          scrollContainer.appendChild(card);
        });
        updateCarousel(); // Call directly after rendering
      };

      const renderListView = () => {
        scrollContainer.classList.remove('flex');
        scrollContainer.classList.add('flex-col');
        scrollContainer.innerHTML = '';
        filteredProducts.forEach((product) => {
          const listCard = renderListCard(product);
          scrollContainer.appendChild(listCard);
        });
      };

      gridBtn.addEventListener('click', () => {
        renderGridView();
        listBtn.classList.remove('bg-violet-600');
        listBtn.classList.add('bg-white');
        listBtn.querySelector('.icon-view-list').classList.remove('text-white');
        listBtn.querySelector('.icon-view-list').classList.add('text-gray-600');
        gridBtn.classList.remove('bg-white');
        gridBtn.classList.add('bg-violet-600');
        gridBtn.querySelector('.icon-view-grid').classList.remove('text-gray-600');
        gridBtn.querySelector('.icon-view-grid').classList.add('text-white');
      });

      listBtn.addEventListener('click', () => {
        renderListView();
        gridBtn.classList.remove('bg-violet-600');
        gridBtn.classList.add('bg-white');
        gridBtn.querySelector('.icon-view-grid').classList.remove('text-white');
        gridBtn.querySelector('.icon-view-grid').classList.add('text-gray-600');
        listBtn.classList.remove('bg-white');
        listBtn.classList.add('bg-violet-600');
        listBtn.querySelector('.icon-view-list').classList.remove('text-gray-600');
        listBtn.querySelector('.icon-view-list').classList.add('text-white');
      });
    }
  }

  const scrollWrapper = div({ class: 'overflow-hidden w-full' }, scrollContainer);
  carouselContainer.append(carouselHead, scrollWrapper);
  blockWrapper.append(carouselContainer);
  block.append(blockWrapper);

  // Call updateCarousel after appending to the DOM
  if (filteredProducts.length > 0) {
    updateCarousel();
  }
}
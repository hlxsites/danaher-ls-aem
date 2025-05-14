import { div, p, img, a, span, button } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/icons.js';
import renderListCard from './listData.js'; // Assuming renderListCard is available

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
  const visibleCards = { sm: 1, md: 2, lg: 4 }; // Responsive visible cards
  const cardWidthPercentage = { sm: '90%', md: '48%', lg: '23.9%' }; // Responsive card widths

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
  const filteredProducts = products.filter(product => product !== null);

  if (filteredProducts.length === 0) {
    blockWrapper.append(p({ class: 'text-center text-gray-600' }, 'No products available.'));
  } else {
    filteredProducts.forEach((product) => {
      const { title, url, image, description, showCart, price, unitMeasure, minQty } = product;

      const card = div({
        class: 'grid-card sm:w-[90%] md:w-[48%] lg:w-[23.9%] sm:min-w-[90%] md:min-w-[48%] lg:min-w-[23.9%] flex-shrink-0 bg-white outline outline-1 outline-gray-300 rounded-lg p-4 flex flex-col h-[485px]',
      });

      if (image) {
        card.append(img({
          src: image,
          alt: title,
          class: 'self-stretch h-40 object-cover mb-4',
        }));
      }

      card.append(p({
        class: 'self-stretch text-black text-xl font-normal font-["TWK_Lausanne_Pan"] leading-7 mb-3 line-clamp-2',
      }, title));

      const contentBox = div({
        class: showCart && price !== undefined
          ? 'bg-gray-50 p-4 rounded-md flex flex-col justify-between flex-1 min-h-[220px]'
          : 'bg-gray-50 p-4 rounded-md flex flex-col justify-between flex-1 min-h-[180px]',
      });

      if (showCart && price !== undefined) {
        contentBox.append(
          p({ class: 'text-right text-2xl font-normal font-["TWK_Lausanne_Pan"] leading-loose text-black mb-3' }, `$${price.toLocaleString()}`),
          div({ class: 'flex justify-between text-base text-black mb-1' },
            p({ class: 'font-extralight font-["TWK_Lausanne_Pan"] leading-snug' }, 'Unit of Measure:'),
            p({ class: 'font-bold font-["TWK_Lausanne_Pan"] leading-snug' }, unitMeasure)
          ),
          div({ class: 'flex justify-between text-base text-black mb-3' },
            p({ class: 'font-extralight font-["TWK_Lausanne_Pan"] leading-snug' }, 'Min. Order Qty:'),
            p({ class: 'font-bold font-["TWK_Lausanne_Pan"] leading-snug' }, `${minQty}`)
          )
        );

        const actions = div({ class: 'flex flex-col gap-3 mt-auto items-center justify-center' },
          div({ class: 'flex gap-2 items-center' },
            div({ class: 'w-14 px-4 py-1.5 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden' },
              div({ class: 'text-black text-base font-normal font-["Inter"] leading-normal' }, '1')
            ),
            button({ class: 'px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden' },
              div({ class: 'text-white text-base font-normal font-["TWK_Lausanne_Pan"] leading-snug' }, 'Buy')
            ),
            button({ class: 'px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden' },
              div({ class: 'text-violet-600 text-base font-normal font-["TWK_Lausanne_Pan"] leading-snug' }, 'Quote')
            )
          )
        );

        contentBox.append(actions);
      } else {
        contentBox.append(
          p({ class: 'text-base font-extralight font-["TWK_Lausanne_Pan"] text-gray-700 mb-3 leading-snug line-clamp-4 text-left mt-2' }, description),
          div({ class: 'flex mt-auto w-full' },
            button({
              class: 'w-full px-5 py-2 bg-white text-violet-600 outline outline-1 outline-offset-[-1px] outline-violet-600 rounded-[20px] flex justify-center items-center overflow-hidden'
            },
              div({ class: 'text-violet-600 text-base font-normal font-["TWK_Lausanne_Pan"] leading-snug' }, 'Quote')
            )
          )
        );
      }

      contentBox.append(
        div({ class: 'flex justify-start mt-4' },
          a({ href: url, class: 'text-violet-600 text-base font-bold font-["TWK_Lausanne_Pan"] leading-snug underline' },
            buttonText || 'View Details',
            span({ class: 'ml-1' }, '→')
          )
        )
      );

      card.append(contentBox);
      scrollContainer.appendChild(card);
    });

    const totalCards = filteredProducts.length;

    const updateCarousel = () => {
      const cardWidth = scrollContainer.children[0]?.getBoundingClientRect().width || 0;
      const translateX = -(currentIndex * (cardWidth + 16)); // 16px for gap-4
      scrollContainer.style.transform = `translateX(${translateX}px)`;

      // Update arrow states
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
        scrollContainer.innerHTML = ''; // Clear existing cards
        filteredProducts.forEach((product) => {
          const { title, url, image, description, showCart, price, unitMeasure, minQty } = product;
          const card = div({
            class: 'grid-card sm:w-[90%] md:w-[48%] lg:w-[23.9%] sm:min-w-[90%] md:min-w-[48%] lg:min-w-[23.9%] flex-shrink-0 bg-white outline outline-1 outline-gray-300 rounded-lg p-4 flex flex-col h-[485px]',
          });

          if (image) {
            card.append(img({
              src: image,
              alt: title,
              class: 'self-stretch h-40 object-cover mb-4',
            }));
          }

          card.append(p({
            class: 'self-stretch text-black text-xl font-normal font-["TWK_Lausanne_Pan"] leading-7 mb-3 line-clamp-2',
          }, title));

          const contentBox = div({
            class: showCart && price !== undefined
              ? 'bg-gray-50 p-4 rounded-md flex flex-col justify-between flex-1 min-h-[220px]'
              : 'bg-gray-50 p-4 rounded-md flex flex-col justify-between flex-1 min-h-[180px]',
          });

          if (showCart && price !== undefined) {
            contentBox.append(
              p({ class: 'text-right text-2xl font-normal font-["TWK_Lausanne_Pan"] leading-loose text-black mb-3' }, `$${price.toLocaleString()}`),
              div({ class: 'flex justify-between text-base text-black mb-1' },
                p({ class: 'font-extralight font-["TWK_Lausanne_Pan"] leading-snug' }, 'Unit of Measure:'),
                p({ class: 'font-bold font-["TWK_Lausanne_Pan"] leading-snug' }, unitMeasure)
              ),
              div({ class: 'flex justify-between text-base text-black mb-3' },
                p({ class: 'font-extralight font-["TWK_Lausanne_Pan"] leading-snug' }, 'Min. Order Qty:'),
                p({ class: 'font-bold font-["TWK_Lausanne_Pan"] leading-snug' }, `${minQty}`)
              )
            );

            const actions = div({ class: 'flex flex-col gap-3 mt-auto items-center justify-center' },
              div({ class: 'flex gap-2 items-center' },
                div({ class: 'w-14 px-4 py-1.5 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden' },
                  div({ class: 'text-black text-base font-normal font-["Inter"] leading-normal' }, '1')
                ),
                button({ class: 'px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden' },
                  div({ class: 'text-white text-base font-normal font-["TWK_Lausanne_Pan"] leading-snug' }, 'Buy')
                ),
                button({ class: 'px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden' },
                  div({ class: 'text-violet-600 text-base font-normal font-["TWK_Lausanne_Pan"] leading-snug' }, 'Quote')
                )
              )
            );

            contentBox.append(actions);
          } else {
            contentBox.append(
              p({ class: 'text-base font-extralight font-["TWK_Lausanne_Pan"] text-gray-700 mb-3 leading-snug line-clamp-4 text-left mt-2' }, description),
              div({ class: 'flex mt-auto w-full' },
                button({
                  class: 'w-full px-5 py-2 bg-white text-violet-600 outline outline-1 outline-offset-[-1px] outline-violet-600 rounded-[20px] flex justify-center items-center overflow-hidden'
                },
                  div({ class: 'text-violet-600 text-base font-normal font-["TWK_Lausanne_Pan"] leading-snug' }, 'Quote')
                )
              )
            );
          }

          contentBox.append(
            div({ class: 'flex justify-start mt-4' },
              a({ href: url, class: 'text-violet-600 text-base font-bold font-["TWK_Lausanne_Pan"] leading-snug underline' },
                buttonText || 'View Details',
                span({ class: 'ml-1' }, '→')
              )
            )
          );

          card.append(contentBox);
          scrollContainer.appendChild(card);
        });
        updateCarousel();
      };

      const renderListView = () => {
        scrollContainer.classList.remove('flex');
        scrollContainer.classList.add('flex-col');
        scrollContainer.innerHTML = ''; // Clear existing cards
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

  [...block.children].forEach((child) => {
    if (!child.classList.contains('prod-category-rendered')) {
      child.style.display = 'none';
    }
  });

  if (filteredProducts.length > 0) {
    setTimeout(updateCarousel, 100);
  }
}
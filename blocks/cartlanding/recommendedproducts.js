
import { addItemToCart, recommendedProduct } from './myCartService.js';
import { showPreLoader, removePreLoader } from '../../scripts/common-utils.js';
import {
  div,
  span,
  button,
} from '../../scripts/dom-builder.js';
import {
  makePublicUrl,
  imageHelper,
} from '../../scripts/scripts.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export const updateCartButton = (itemID) => {
  const addCartButton = document.getElementById(itemID);
  if (addCartButton) {
    addCartButton.innerHTML = 'Added';
  }
};

export const recommendedProducts = () => {
  //   const content = block.querySelector('div');
  const content = div({
    class: 'inline-flex flex-col',
  });
  const productsCategories = recommendedProduct;

  function getCardsPerPage() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    if (window.innerWidth < 1280) return 3;
    return 4;
  }
  let cardsPerPage = getCardsPerPage();
  let currentIndex = 0;

  const carouselContainer = div({
    class: 'carousel-container flex flex-col w-full py-6 justify-center',
  });

  // --- Carousel Header Section ---
  const carouselHead = div({
    class:
      'w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4',
  });

  // Left group: Title + Browse
  const leftGroup = div({
    class: 'flex flex-wrap sm:flex-nowrap items-center gap-4',
  });

  // Title
  const productTitle = div(
    {
      class:
        'text-black text-2xl font-normal  leading-loose whitespace-nowrap',
    },
    'Others also bought',
  );

  // Outer container holding both arrows and toggle (gap between them)
  const arrows = div({
    class: 'w-72 inline-flex justify-end items-center gap-6',
  });

  // Left group: Arrows
  const arrowGroup = div({
    class: 'flex justify-start items-center gap-3',
  });

  const prevDiv = div(
    {
      class:
        'carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer',
    },
    div({
      class:
        'w-7 h-7 left-[5px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-gray-300',
    }),
  );

  const nextDiv = div(
    {
      class:
        'carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer',
    },
    div({
      class:
        'w-7 h-7 left-[5px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-violet-600',
    }),
  );

  arrowGroup.append(prevDiv, nextDiv);

  // Right group: Toggle view buttons
  const viewModeGroup = div({
    class: 'flex justify-start items-center',
  });

  // viewModeGroup.append(listBtn, gridBtn);

  // Final append
  arrows.append(arrowGroup, viewModeGroup);
  leftGroup.append(productTitle);
  carouselHead.append(leftGroup, arrows);
  decorateIcons(viewModeGroup);
  const carouselCards = div({
    class: 'carousel-cards flex flex-wrap justify-start gap-5 w-full',
  });

  function updateCarousel() {
    cardsPerPage = getCardsPerPage();
    carouselCards.innerHTML = '';

    const cardsToDisplay = productsCategories.slice(
      currentIndex,
      currentIndex + cardsPerPage,
    );
    cardsToDisplay.forEach((item) => {
      const card = div({
        class:
          ' sm:w-[calc(50%-10px)] lg:w-[calc(33.33%-13.33px)] xl:w-[calc(25%-15px)] border border-solid border-gray-300 min-h-80 bg-white  flex flex-col justify-start items-start',
      });

      const image = imageHelper(
        'https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg',
        item.name,
        {
          href: makePublicUrl(
            'https://www.merckmillipore.com/waroot/xl/Cell%20test%20kits[Cell%20test%20kits-ALL].jpg',
          ),
          title: item.name,
          class: ' h-40 object-cover',
        },
      );

      const addToCartButton = button(
        {
          class:
            'btn btn-lg font-medium btn-primary-purple rounded-full px-6 m-0',
          sku: item.sku,
          productName: item.productName,
          minOrderQuantity: item.minOrderQuantity,
          manufacturer: item.manufacturer,
          maxOrderQuantity: item.maxOrderQuantity,
          price: item.salePrice.value,
          quantity: 0,
        },
        'Buy',
      );

      addToCartButton.addEventListener('click', async (event) => {
        showPreLoader();
        const itemId = event.target.attributes;
        const res = await addItemToCart(itemId, 'recommended-product');

        if (res) {
          if (res.status === 'success') {
            removePreLoader();
          }
        }
      });

      const itemContainer = div(
        {
          class: 'inline-flex flex-col self-stretch px-4 py-3 gap-3 ',
        },
        div(
          {
            class:
              'relative self-stretch h-40 relative',
          },
          image,
        ),
        div(
          {
            class: '',
          },
          div(
            {
              class:
                'description self-stretch justify-start text-black text-m font-normal break-words line-clamp-4 !h-20 py-4 leading-7',
            },
            item.name,
          ),
          // div(
          //   {
          //     class: 'h-[70px] text-gray-500 text-base font-extralight',
          //   },
          //   `SKU: ${item.sku}`,
          // ),
        ),
        div({
          class: 'self-stretch h-48 bg-gray-50 flex flex-col justify-start items-end gap-6',
        },
        div(
          {
            class: 'text-right justify-start text-black text-2xl font-normal leading-loose',
          },
          // span(
          //   {
          //     class:
          //       'text-gray-900 text-2xl font-bold  leading-loose',
          //   },
            `$${item.salePrice.value}`,
          // ),
          // span(
          //   {
          //     class:
          //       'text-gray-900 text-base font-extralight  leading-snug',
          //   },
          //   '(USD)',
          // ),
        ),

        div(
          {
            class: 'self-stretch flex flex-col justify-start items-start gap-2',
          },
          div({
            class: "flex justify-start items-start"
          },
          div({
            class: "w-32 h-5 justify-start text-black text-base font-extralight leading-snug"
          }, "Unit of Measure:"),
          div({
            class: "w-16 h-5 text-right justify-start text-black text-base font-bold leading-snug"
          }, "1/Bundle")
        ),
        div({
          class: "flex "
        },
        div({
            class: "w-32 h-5 justify-start text-black text-base font-extralight leading-snug"
          }, "Min. Order Qty:"),
           div({
            class: "w-16 h-5 text-right justify-start text-black text-base font-bold leading-snug"
          },item.minOrderQuantity ),
      ),
       div({
    class: "inline-flex justify-start items-center gap-3"
},
div({
    class: "w-14 self-stretch px-4 py-1.5 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden"
},
div({
    class: "justify-start text-black text-base font-normal leading-normal"
}, "1")
),
// div({
//     class: "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden"
// }, div({
//     class: "justify-start text-white text-base font-normal leading-snug"
// }, "Buy")),
addToCartButton,
div({
    class: "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden"
}, div({
    class: "justify-start text-violet-600 text-base font-normal leading-snug"
}, "Quote"))
)
          // addToCartButton,
        ),
      ));
      card.append(itemContainer);
      carouselCards.append(card);
    });
    // cardsToDisplay;
    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
          stroke="${
  currentIndex > 0 ? '#7523FF' : '#D1D5DB'
}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
          stroke="${
  currentIndex + cardsPerPage < productsCategories.length
    ? '#7523FF'
    : '#D1D5DB'
}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  prevDiv.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= cardsPerPage;
      updateCarousel();
    }
  });

  nextDiv.addEventListener('click', () => {
    if (currentIndex + cardsPerPage < productsCategories.length) {
      currentIndex += cardsPerPage;
      updateCarousel();
    }
  });

  window.addEventListener('resize', () => {
    const newCardsPerPage = getCardsPerPage();
    if (newCardsPerPage !== cardsPerPage) {
      currentIndex = 0;
      updateCarousel();
    }
  });

  updateCarousel();

  carouselContainer.append(carouselHead, carouselCards);
  content.append(carouselContainer);
  return content;
};


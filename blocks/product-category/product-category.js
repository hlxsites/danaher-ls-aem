import {
  div,
  h3,
  input,
  label,
  span,
  button,
  fieldset,
  ul,
  li,
  a,
  img,
  p,
} from "../../scripts/dom-builder.js";
import { getProductsForCategories } from "../../scripts/commerce.js";
import {
  makePublicUrl,
  imageHelper,
  generateUUID,
} from "../../scripts/scripts.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

async function fetchProducts() {
  try {
    const productsCategories = await getProductsForCategories();
    console.log("Fetched products categories:", productsCategories?.results);
    return productsCategories?.results || [];
  } catch (error) {
    return [];
  }
}

export default async function decorate(block) {
  block.textContent = "";
  //const content = block.querySelector("div");
  const productsCategories = await fetchProducts();

  let cardsPerPage = getCardsPerPage();
  let currentIndex = 0;

  function getCardsPerPage() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    if (window.innerWidth < 1280) return 3;
    return 4;
  }

  const carouselContainer = div({
    class: "carousel-container flex flex-col w-full py-6 justify-center",
  });

  // --- Carousel Header Section ---
  const carouselHead = div({
    class:
      "w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4",
  });

  // Left group: Title + Browse
  const leftGroup = div({
    class: "flex flex-wrap sm:flex-nowrap items-center gap-4",
  });

  // Title
  const productTitle = div(
    {
      class:
        'text-black text-2xl font-normal font-["TWK_Lausanne_Pan"] leading-loose whitespace-nowrap',
    },
    "Top Selling Products"
  );

  // Browse Link
  const browseLink = a(
    {
      href: "#",
      class:
        'text-violet-600 text-base font-bold font-["TWK_Lausanne_Pan"] leading-snug hover:underline whitespace-nowrap',
    },
    "Browse 120 Products →"
  );

  // Outer container holding both arrows and toggle (gap between them)
  const arrows = div({
    class: "w-72 inline-flex justify-end items-center gap-6",
  });

  // Left group: Arrows
  const arrowGroup = div({
    class: "flex justify-start items-center gap-3",
  });

  const prevDiv = div(
    {
      class:
        "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer",
    },
    div({
      class:
        "w-7 h-7 left-[5px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-gray-300",
    })
  );

  const nextDiv = div(
    {
      class:
        "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer",
    },
    div({
      class:
        "w-7 h-7 left-[5px] top-[5px] absolute outline outline-2 outline-offset-[-1px] outline-violet-600",
    })
  );

  arrowGroup.append(prevDiv, nextDiv);

  // Right group: Toggle view buttons
  const viewModeGroup = div({
    class: "flex justify-start items-center",
  });

  // List Button
  const listBtn = div(
    {
      class:
        "px-3 py-2 bg-white rounded-tl-[20px] rounded-bl-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
    },
    div(
      {
        class: "w-5 h-5 relative overflow-hidden",
      },
      span({
        class:
          "icon icon-view-list w-6 h-6 absolute  fill-current text-gray-600 [&_svg>use]:stroke-gray-600",
      })
    )
  );

  // Grid Button
  const gridBtn = div(
    {
      class:
        "px-3 py-2 bg-violet-600 rounded-tr-[20px] rounded-br-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
    },
    div(
      {
        class: "w-5 h-5 relative overflow-hidden",
      },
      span({
        class:
          "icon icon-view-grid w-6 h-6 absolute  fill-current text-white [&_svg>use]:stroke-white",
      })
    )
  );

  viewModeGroup.append(listBtn, gridBtn);

  // Final append
  arrows.append(arrowGroup, viewModeGroup);

  leftGroup.append(productTitle, browseLink);
  carouselHead.append(leftGroup, arrows);

  decorateIcons(viewModeGroup);

  const carouselCards = div({
    class: "carousel-cards flex flex-wrap justify-start gap-5 w-full",
  });

  function updateCarousel() {
    cardsPerPage = getCardsPerPage();
    carouselCards.innerHTML = "";

    const cardsToDisplay = productsCategories.slice(
      currentIndex,
      currentIndex + cardsPerPage
    );

    cardsToDisplay.forEach((item) => {
      const card = div({
        class:
          "w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.33%-13.33px)] xl:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
      });

      const image = imageHelper(item.raw.images[0], item.title, {
        href: makePublicUrl(item.path),
        title: item.title,
        class: "w-full h-40 object-cover",
      });

      const head = p(
        {
          class: "p-3 text-black text-xl font-normal leading-7",
        },
        item.title
      );

      const desc = p(
        {
          class: "p-3 text-gray-700 text-base font-extralight leading-snug",
        },
        item?.raw?.source
      );

      const details = div(
        {
          class:
            "self-stretch px-4 py-3 bg-gray-50 inline-flex flex-col justify-start items-end gap-6",
        },
        div(
          {
            class:
              "text-right justify-start text-black text-2xl font-normal font-['TWK_Lausanne_Pan'] leading-loose",
          },
          "$1,000.00"
        ),
        div(
          {
            class: "self-stretch flex flex-col justify-start items-start gap-2",
          },
          div(
            { class: "flex justify-between items-center w-full" },
            div(
              {
                class:
                  "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Unit of Measure:"
            ),
            div(
              {
                class:
                  "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "1/Bundle"
            )
          ),
          div(
            { class: "flex justify-between items-center w-full" },
            div(
              {
                class:
                  "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Min. Order Qty:"
            ),
            div(
              {
                class:
                  "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "50"
            )
          )
        ),

        div(
          { class: "inline-flex justify-start items-center gap-3" },
          div(
            {
              class:
                "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
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
              "data-state": "Default",
              "data-type": "Primary",
              class:
                "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
            },
            div(
              {
                class:
                  "justify-start text-white text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Buy"
            )
          ),
          div(
            {
              "data-state": "Default",
              "data-type": "Primary",
              class:
                "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
            },
            div(
              {
                class:
                  "justify-start text-violet-600 text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Quote"
            )
          )
        )
      );

      const spacer = div({ class: "flex-grow" });

      const desc1 = div(
        { class: "self-stretch p-3 flex justify-start items-center" },
        div(
          { class: "text-violet-600 text-base font-bold leading-snug" },
          "View Details →"
        )
      );

      card.append(image, head, desc, details, spacer, desc1);
      carouselCards.append(card);
    });

    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
          stroke="${
            currentIndex > 0 ? "#7523FF" : "#D1D5DB"
          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
          stroke="${
            currentIndex + cardsPerPage < productsCategories.length
              ? "#7523FF"
              : "#D1D5DB"
          }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  prevDiv.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= cardsPerPage;
      updateCarousel();
    }
  });

  nextDiv.addEventListener("click", () => {
    if (currentIndex + cardsPerPage < productsCategories.length) {
      currentIndex += cardsPerPage;
      updateCarousel();
    }
  });

  window.addEventListener("resize", () => {
    const newCardsPerPage = getCardsPerPage();
    if (newCardsPerPage !== cardsPerPage) {
      currentIndex = 0;
      updateCarousel();
    }
  });

  updateCarousel();

  carouselContainer.append(carouselHead, carouselCards);
  block.append(carouselContainer);
}

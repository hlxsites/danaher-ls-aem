import { div, img, a, span } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  const relatedCategories = [
    {
      title: "Recombinant Monoclonal",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/feature-section.png",
      linkText: "Browse All Products →",
    },
    {
      title: "Carrier Free Antibodies",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/aldevron-4c.png",
      linkText: "Browse All Products →",
    },
    {
      title: "Polyclonal Antibodies",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/HemoCue.png",
      linkText: "Browse All Products →",
    },
    {
      title: "Polyclonal Antibodies",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/HemoCue.png",
      linkText: "Browse All Products →",
    },
    {
      title: "Carrier Free Antibodies",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/aldevron-4c.png",
      linkText: "Browse All Products →",
    },
  ];

  const carouselContainer = div({
    class: "carousel-container flex flex-col w-full py-6 justify-center",
  });

  const carouselHead = div({
    class: "w-full flex flex-col sm:flex-row justify-between items-center gap-3 mb-4",
  });

  const leftGroup = div({ class: "flex flex-wrap sm:flex-nowrap items-center gap-4" });
  const productTitle = div(
    {
      class:
        'text-black text-2xl font-normal font-["TWK_Lausanne_Pan"] leading-loose whitespace-nowrap',
    },
    "Related Categories"
  );
  leftGroup.append(productTitle);

  const arrows = div({ class: "w-72 inline-flex justify-end items-center gap-6" });
  const arrowGroup = div({ class: "flex justify-start items-center gap-3" });
  const prevDiv = div({ class: "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer" });
  const nextDiv = div({ class: "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer" });
  arrowGroup.append(prevDiv, nextDiv);

  carouselHead.append(leftGroup, arrows);

  const carouselCards = div({
    class: "carousel-cards flex gap-5 w-full overflow-x-auto",
  });

  relatedCategories.forEach((category) => {
    const categoryCard = div(
      {
        class:
          "w-72 min-h-96 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
      },
      img({
        class: "self-stretch h-40 relative",
        src: category.image,
        alt: category.title,
      }),
      div(
        {
          class: "self-stretch h-52 flex flex-col justify-between items-start",
        },
        div(
          {
            class:
              "self-stretch p-3 bg-white flex flex-col justify-start items-start gap-3",
          },
          div(
            {
              class:
                "self-stretch flex flex-col justify-start items-start gap-1",
            },
            div(
              {
                class:
                  "self-stretch flex flex-col justify-start items-start gap-2",
              },
              div(
                {
                  class:
                    'self-stretch justify-start text-black text-xl font-normal font-["TWK_Lausanne_Pan"] leading-7',
                },
                category.title
              ),
              div(
                {
                  class:
                    "self-stretch inline-flex justify-start items-center gap-3",
                },
                div(
                  {
                    class:
                      "flex-1 inline-flex flex-col justify-start items-start",
                  },
                  div(
                    {
                      class:
                        'self-stretch justify-start text-gray-700 text-base font-extralight font-["TWK_Lausanne_Pan"] leading-snug',
                    },
                    category.description
                  )
                )
              )
            )
          )
        ),
        div(
          {
            class:
              "self-stretch p-3 bg-white inline-flex justify-start items-center",
          },
          div(
            {
              class:
                'justify-start text-violet-600 text-base font-bold font-["TWK_Lausanne_Pan"] leading-snug',
            },
            category.linkText
          )
        )
      )
    );
    carouselCards.append(categoryCard);
  });

  const carousel = div({ class: "carousel flex flex-col items-center gap-6" });
  carousel.append(carouselHead, carouselCards);
  carouselContainer.append(carousel);

  block.innerHTML = "";
  block.appendChild(carouselContainer);

  let currentIndex = 0;
  const cards = carouselCards.children;
  const totalCards = cards.length;

  function updateCarousel() {
    const offset = -currentIndex * 100;
    carouselCards.style.transform = `translateX(${offset}%)`;
  }

  prevDiv.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextDiv.addEventListener("click", () => {
    if (currentIndex < totalCards - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Optional: Add swipe functionality for touch devices
  let startX = 0;
  let isDragging = false;

  carouselCards.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX;
  });

  carouselCards.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const x = e.pageX;
    const diff = x - startX;
    if (diff > 50 && currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      isDragging = false;
    } else if (diff < -50 && currentIndex < totalCards - 1) {
      currentIndex++;
      updateCarousel();
      isDragging = false;
    }
  });

  carouselCards.addEventListener("mouseup", () => {
    isDragging = false;
  });

  carouselCards.addEventListener("mouseleave", () => {
    isDragging = false;
  });
}

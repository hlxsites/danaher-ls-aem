import { div, a, img } from "../../scripts/dom-builder.js";

function renderGridCard(item) {
  const card = div({
    class:
      "w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
  });

  const imageWrapper = div({
    class: "relative w-full",
  });

  const imageElement = img({
    src: item.image,
    alt: item.title,
    class: "w-full h-40 object-cover",
  });

  imageWrapper.append(imageElement);
const contentWrapper = div({
  class: "flex flex-col justify-start items-start w-full flex-grow p-3",
});

const titleElement = div(
  { class: "text-black text-xl font-normal leading-7" },
  item.title
);

const description = div(
  { class: "text-gray-600 text-sm mt-2" },
  item.description
);

const link = a(
  { href: "#", class: "text-violet-600 text-sm font-medium flex items-center mt-auto" }, 
  "Browse All Products →"
);

contentWrapper.append(titleElement, description, link);
card.append(imageWrapper, contentWrapper);


  return card;
}

function getCardsPerPageGrid() {
  return window.innerWidth < 640 ? 1 : 4;
}

export default async function decorate(block) {
  const relatedCategories = [
    {
      title: "Recombinant Monoclonal",
      description: "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/feature-section.png",
    },
    {
      title: "Carrier Free Antibodies",
      description: "Our capillary  challenges.",
      image: "/icons/aldevron-4c.png",
    },
    {
      title: "Polyclonal Antibodies",
      description: "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/HemoCue.png",
    },
    {
      title: "Monoclonal Therapeutics",
      description: "Targeted solutions for therapeutic development and diagnostics.",
      image: "/icons/beckmancoulter.png",
    },
    {
      title: "idbs sds",
      description: "Tailored antibody your research needs.",
      image: "/icons/idbs-4c.png",
    },
    
    {
      title: "IDTT DFFs",
      description: "Targeted solutions development and diagnostics.",
      image: "/icons/idt.png",
    },
  ];

  let cardsPerPageGrid = getCardsPerPageGrid();
  let currentIndex = 0;

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
    "Related Categories"
  );
  leftGroup.append(productTitle);

  const arrowGroup = div({ class: "flex justify-start items-center gap-3" });
  const prevDiv = div({ class: "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer" });
  const nextDiv = div({ class: "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer" });
  arrowGroup.append(prevDiv, nextDiv);

  carouselHead.append(leftGroup, arrowGroup);

  const carouselCards = div({
    class: "carousel-cards flex flex-wrap justify-start gap-5 w-full",
  });

  function updateCarousel() {
    carouselCards.innerHTML = "";

    const cardsToDisplay = relatedCategories.slice(currentIndex, currentIndex + cardsPerPageGrid);
    cardsToDisplay.forEach((item) => carouselCards.append(renderGridCard(item)));

    prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
        stroke="${currentIndex > 0 ? "#7523FF" : "#D1D5DB"}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;

    nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
        stroke="${currentIndex + cardsPerPageGrid < relatedCategories.length ? "#7523FF" : "#D1D5DB"}" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;
  }

  prevDiv.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= cardsPerPageGrid;
      updateCarousel();
    }
  });

  nextDiv.addEventListener("click", () => {
    if (currentIndex + cardsPerPageGrid < relatedCategories.length) {
      currentIndex += cardsPerPageGrid;
      updateCarousel();
    }
  });

  window.addEventListener("resize", () => {
    const newCardsPerPageGrid = getCardsPerPageGrid();
    if (newCardsPerPageGrid !== cardsPerPageGrid) {
      cardsPerPageGrid = newCardsPerPageGrid;
      currentIndex = 0;
      updateCarousel();
    }
  });

  updateCarousel();
  carouselContainer.append(carouselHead, carouselCards);
  block.append(carouselContainer);
}
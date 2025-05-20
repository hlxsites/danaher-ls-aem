import { div, a, img } from "../../scripts/dom-builder.js";

function renderGridCard(item) {
  console.log("Rendering card for item:", item);
  if (!item.title || !item.image || !item.description || !item.path) {
    console.warn("Incomplete item data, skipping card:", item);
    return null; // Skip invalid items
  }

  const card = div({
    class:
      "w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] min-h-80 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
  });

  const imageWrapper = div({ class: "relative w-full" });

  const imageElement = img({
    src: item.image.startsWith("http") ? item.image : `https://lifesciences.danaher.com${item.image}`,
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
    {
      href: item.path,
      class: "text-violet-600 text-sm font-medium flex items-center mt-auto",
    },
    "Browse All Products →"
  );

  contentWrapper.append(titleElement, description, link);
  card.append(imageWrapper, contentWrapper);

  console.log("Created card element:", card);
  return card;
}

function getCardsPerPageGrid() {
  const cards = window.innerWidth < 640 ? 1 : 4;
  console.log("Cards per page:", cards);
  return cards;
}

export default async function decorate(block) {
  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || "";
  const productIds = rawIds.split(",").map((id) => id.trim()).filter(Boolean);

  console.log("productIds (fullCategory values):", productIds);

  let relatedCategories = [];

  try {
    const response = await fetch('https://lifesciences.danaher.com/us/en/products-index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const json = await response.json();
    const data = json.data;

    console.log("Fetched data from API:", data);

    // Normalize productIds to match fullCategory format (lowercase, hyphens)
    const normalizedProductIds = productIds.map((id) =>
      id.toLowerCase().replace(/\s+/g, "-")
    );
    console.log("Normalized productIds:", normalizedProductIds);

    const categoryMap = new Map();
    data.forEach((product) => {
      if (product.fullCategory && normalizedProductIds.includes(product.fullCategory)) {
        if (!categoryMap.has(product.fullCategory)) {
          categoryMap.set(product.fullCategory, {
            title: product.title || product.fullCategory.replace(/-/g, " "),
            image: product.image ? `https://lifesciences.danaher.com${product.image}` : "https://via.placeholder.com/300x160",
            description: product.description || "Explore products in this category.",
            path: product.path ? `https://lifesciences.danaher.com${product.path}` : `/category/${product.fullCategory}`,
          });
        }
      }
    });

    relatedCategories = Array.from(categoryMap.values());
    console.log("Related Categories:", relatedCategories);
  } catch (error) {
    console.error("Error fetching API data:", error.message);
    relatedCategories = productIds.map((category) => ({
      title: category,
      image: "https://via.placeholder.com/300x160",
      description: "Sorry, data is not present.",
      path: `/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
    }));
    console.log("Fallback relatedCategories:", relatedCategories);
  }

  if (relatedCategories.length === 0) {
    console.warn("No related categories to display");
    relatedCategories.push({
      title: "No Categories Available",
      image: "https://via.placeholder.com/300x160",
      description: "No related categories found.",
      path: "#",
    });
  }

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
      class: "text-black text-2xl font-normal leading-loose whitespace-nowrap",
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
    console.log("Updating carousel, currentIndex:", currentIndex, "cardsPerPageGrid:", cardsPerPageGrid);
    carouselCards.innerHTML = "";

    const cardsToDisplay = relatedCategories.slice(currentIndex, currentIndex + cardsPerPageGrid);
    console.log("Cards to display:", cardsToDisplay);

    cardsToDisplay.forEach((item) => {
      const card = renderGridCard(item);
      if (card) {
        carouselCards.append(card);
      }
    });

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
      console.log("Previous clicked, new currentIndex:", currentIndex);
      updateCarousel();
    }
  });

  nextDiv.addEventListener("click", () => {
    if (currentIndex + cardsPerPageGrid < relatedCategories.length) {
      currentIndex += cardsPerPageGrid;
      console.log("Next clicked, new currentIndex:", currentIndex);
      updateCarousel();
    }
  });

  window.addEventListener("resize", () => {
    const newCardsPerPageGrid = getCardsPerPageGrid();
    if (newCardsPerPageGrid !== cardsPerPageGrid) {
      cardsPerPageGrid = newCardsPerPageGrid;
      currentIndex = 0;
      console.log("Window resized, new cardsPerPageGrid:", cardsPerPageGrid);
      updateCarousel();
    }
  });

  updateCarousel();
  console.log("Appending carouselContainer to block:", carouselContainer);
  block.append(carouselContainer);
}
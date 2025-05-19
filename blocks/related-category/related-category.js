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
    src: item.image || "https://via.placeholder.com/300x160", // Fallback image
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
    item.description || "Explore products in this category."
  );

  const link = a(
    {
      href: item.path || `#`, // Use path from API, fallback to #
      class: "text-violet-600 text-sm font-medium flex items-center mt-auto",
    },
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
  const rawIds = block.querySelector('[data-aue-prop="productid"]')?.textContent.trim() || "";
  const productIds = rawIds.split(",").map((id) => id.trim()).filter(Boolean);

  console.log("productIds (fullCategory values):", productIds);

  // Fetch data from the API
  let relatedCategories = [];
  try {
    const response = await fetch('https://lifesciences.danaher.com/us/en/products-index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Group products by fullCategory and select representative data
    const categoryMap = new Map();
    data.forEach((product) => {
      if (product.fullCategory && productIds.includes(product.fullCategory)) {
        if (!categoryMap.has(product.fullCategory)) {
          categoryMap.set(product.fullCategory, {
            title: product.fullCategory, // Use fullCategory as title
            image: product.imageUrl || product.image || null, // Adjust based on API field
            description: product.shortDescription || product.description || null,
            path: product.path || `/category/${product.fullCategory.toLowerCase()}`, // Use path, fallback to constructed URL
          });
        }
      }
    });

    // Convert Map to array for relatedCategories
    relatedCategories = Array.from(categoryMap.values());
    console.log("Related Categories:", relatedCategories);
  } catch (error) {
    console.error("Error fetching API data:", error.message);
    // Fallback: Create placeholder cards for each productId
    relatedCategories = productIds.map((category) => ({
      title: category,
      image: "https://via.placeholder.com/300x160",
      description: "Explore products in this category.",
      path: `/category/${category.toLowerCase()}`, // Fallback path
    }));
  }

  // If no categories found, add a default message or empty state
  if (relatedCategories.length === 0) {
    console.warn("No matching categories found for productIds:", productIds);
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
import { div, p, img, a, span } from "../../scripts/dom-builder.js";

function createCarousel(
  side,
  carouselTitle,
  carouselProducts,
  carouselLinkText
) {
  let currentIndex = 0;
  const visibleCards = 2;
  const bgColor = side === "left" ? "bg-gray-100" : "bg-gray-200";
  const carouselWrapper = div({
    id: `${side}CarouselWrapper`,
    class: `dualCarouselItem flex flex-col gap-6 p-[20px] ${bgColor}`,
  });
  const carouselContent = div({
    class: `${side}CarouselItems flex gap-[20px]`,
  });
  const carouselLeftArrow = span(
    {
      class:
        "w-8 h-8 mr-2 border rounded-full flex items-center justify-center cursor-pointer transition opacity-50 pointer-events-none text-blue-600 border-blue-600",
      title: "Scroll Left",
    },
    "←"
  );

  const carouselRightArrow = span(
    {
      class:
        "w-8 h-8 border rounded-full flex items-center justify-center cursor-pointer transition text-blue-600 border-blue-600",
      title: "Scroll Right",
    },
    "→"
  );
  const carouselTitleWrapper = div(
    {
      class: `${side}CarouselTitleWrapper flex gap-4 flex justify-between items-center mb-4`,
    },
    p({ class: "text-lg font-semibold text-gray-800" }, carouselTitle),
    div({ class: "flex items-center" }, carouselLeftArrow, carouselRightArrow)
  );
  carouselProducts.forEach((product) => {
    if (!product) return;
    const { image, brand, title, url } = product;

    const card = div(
      {
        class:
          "flex-shrink-0 flex flex-col gap-3 bg-white border p-[12px] space-y-4 h-[360px] w-1/2 max-w-[48%]",
      },
      img({ src: image, alt: title, class: "w-full h-40 object-contain" }),
      p({ class: "text-xs font-bold text-purple-600" }, brand),
      p({ class: "text-sm text-gray-900 font-normal leading-tight" }, title),
      a(
        {
          href: url,
          class: "text-purple-600 text-sm font-medium flex items-center gap-1",
        },
        carouselLinkText,
        span({ class: "ml-1" }, "→")
      )
    );

    carouselContent.appendChild(card);
  });

  const totalCards = carouselContent.children.length;

  const updateArrows = () => {
    carouselLeftArrow.classList.toggle("opacity-50", currentIndex <= 0);
    carouselLeftArrow.classList.toggle(
      "pointer-events-none",
      currentIndex <= 0
    );
    carouselRightArrow.classList.toggle(
      "opacity-50",
      currentIndex >= totalCards - visibleCards
    );
    carouselRightArrow.classList.toggle(
      "pointer-events-none",
      currentIndex >= totalCards - visibleCards
    );
  };

  const scrollToIndex = (index) => {
    const card = carouselContent.children[0];
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    carouselContent.style.transform = `translateX(-${cardWidth * index}px)`;
    currentIndex = index;
    updateArrows();
  };

  carouselLeftArrow.addEventListener("click", () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - visibleCards);
  });

  carouselRightArrow.addEventListener("click", () => {
    if (currentIndex < totalCards - visibleCards)
      scrollToIndex(currentIndex + visibleCards);
  });

  setTimeout(updateArrows, 100);

  carouselWrapper.append(carouselTitleWrapper, carouselContent);
  return carouselWrapper;
}
async function getProductsData(products) {
  return await Promise.all(
    products.map(async (id) => {
      try {
        const res = await fetch(
          `https://lifesciences.danaher.com/us/en/product-data/?product=${id}`
        );
        if (!res.ok) return null;

        const data = await res.json();
        const product = data.results?.[0];
        if (!product) return null;

        const image = product.raw?.images?.[0] || "";

        const productData = {
          id,
          image: image || "https://via.placeholder.com/150",
          brand: Array.isArray(product.raw?.ec_brand)
            ? product.raw.ec_brand[0]
            : "",
          title: product.title || "",
          url: product.clickUri || "#",
        };
        return productData;
      } catch (e) {
        console.error(`❌ Error fetching product ${id}:`, e);
        return null;
      }
    })
  );
}
export default async function decorate(block) {
  console.log("type of dual carousel block: ", typeof block);
  console.log("dual carousel block: ", block);

  const dualCarouselWrapper = div({
    class: "max-w-[1280px] mx-auto flex gap-6",
  });
  const leftCarouselTitle = block
    .querySelector('[data-aue-prop="left_carousel_title"]')
    ?.textContent.trim();
  const leftCarouselProductIds = block
    .querySelector('[data-aue-prop="left_carousel_product_id"]')
    ?.textContent.trim()
    .split(",");
  const leftCarouselLinkText =
    block
      .querySelector('[data-aue-prop="left_carousel_link_label"]')
      ?.textContent.trim() || "Continue";
  const rightCarouselTitle = block
    .querySelector('[data-aue-prop="right_carousel_title"]')
    ?.textContent.trim();
  const rightCarouselProductIds = block
    .querySelector('[data-aue-prop="right_carousel_product_id"]')
    ?.textContent.trim()
    .split(",");
  const rightCarouselLinkText =
    block
      .querySelector('[data-aue-prop="right_carousel_link_label"]')
      ?.textContent.trim() || "Continue";

  block.innerHtml = "";
  block.textContent = "";
  Object.keys(block).forEach((key) => delete block[key]);

  const leftCarouselProducts = await getProductsData(leftCarouselProductIds);
  console.log("leftCarouselProducts: ", leftCarouselProducts);

  const leftCarouselScrollWrapper = div(
    {
      id: "leftCarouselScrollWrapper",
      class: "w-1/2 overflow-hidden flex flex-col",
    },
    createCarousel(
      "left",
      leftCarouselTitle,
      leftCarouselProducts,
      leftCarouselLinkText
    )
  );
  dualCarouselWrapper.append(leftCarouselScrollWrapper);
  block.append(dualCarouselWrapper);
}

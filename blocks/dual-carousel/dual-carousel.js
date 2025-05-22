import { div, p, img, a, span } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
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
  const rightCarouselTitle = block
    .querySelector('[data-aue-prop="right_carousel_title"]')
    ?.textContent.trim();
  const rightCarouselProductIds = block
    .querySelector('[data-aue-prop="right_carousel_product_id"]')
    ?.textContent.trim()
    .split(",");

  const leftCarouselProducts = await Promise.all(
    leftCarouselProductIds.map(async (id) => {
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
  console.log("leftCarouselProducts: ", leftCarouselProducts);

  const leftCarouselContainer = div({
    class: "flex transition-all duration-300 ease-in-out space-x-4 bg-gray-100",
    style: "transform: translateX(0);",
  });

  const leftCarouselLinkText =
    block
      .querySelector('[data-aue-prop="left_carousel_link_label"]')
      ?.textContent.trim() || "Continue";
  leftCarouselProducts.forEach((product) => {
    if (!product) return;
    const { image, brand, title, url } = product;

    const card = div(
      {
        class:
          "min-w-[50%] w-[50%] flex-shrink-0 bg-white border p-5 space-y-4 h-[360px]",
      },
      img({ src: image, alt: title, class: "w-full h-32 object-contain" }),
      p({ class: "text-xs font-bold text-purple-600" }, brand),
      p({ class: "text-sm text-gray-900 font-normal leading-tight" }, title),
      a(
        {
          href: url,
          class: "text-purple-600 text-sm font-medium flex items-center gap-1",
        },
        leftCarouselLinkText,
        span({ class: "ml-1" }, "→")
      )
    );

    leftCarouselContainer.appendChild(card);
  });
  const leftCarouselScrollWrapper = div(
    { class: "overflow-hidden" },
    leftCarouselContainer
  );
  const leftCarouselLeftArrow = span(
    {
      class:
        "w-8 h-8 mr-2 border rounded-full flex items-center justify-center cursor-pointer transition opacity-50 pointer-events-none text-blue-600 border-blue-600",
      title: "Scroll Left",
    },
    "←"
  );

  const leftCarouselRightArrow = span(
    {
      class:
        "w-8 h-8 border rounded-full flex items-center justify-center cursor-pointer transition text-blue-600 border-blue-600",
      title: "Scroll Right",
    },
    "→"
  );
  const leftCarouselTitleWrapper = div(
    { class: "flex justify-between items-center mb-4" },
    p({ class: "text-lg font-semibold text-gray-800" }, leftCarouselTitle),
    div(
      { class: "flex items-center" },
      leftCarouselLeftArrow,
      leftCarouselRightArrow
    )
  );
  dualCarouselWrapper.append(
    leftCarouselTitleWrapper,
    leftCarouselScrollWrapper
  );
  block.innerHtml = "";
  block.append(dualCarouselWrapper);
}

import { div, p, img, a, span, button } from "../../scripts/dom-builder.js";
import {
  getProductInfo,
  renderProductJsonResponse,
} from "../../scripts/common-utils.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

function createCarousel(
  side,
  carouselTitle,
  carouselProducts,
  carouselLinkText
) {
  const bgColor = side === "left" ? "bg-gray-100" : "bg-gray-200";
  const carouselWrapper = div({
    id: `${side}CarouselWrapper`,
    class: `dualCarouselItem flex flex-col gap-6 p-[20px] ${bgColor}`,
  });
  const carouselContent = div({
    class: `${side}CarouselItems flex gap-[22px]`,
  });
  const carouselLeftArrow = button(
    {
      class: "",
      title: "Scroll Left",
    },
    span({
      class:
        "icon icon-Arrow-circle-left w-8 h-8 fill-current [&_svg>use]:stroke-gray-300 [&_svg>use]:hover:stroke-gray-500",
    })
  );

  const carouselRightArrow = button(
    {
      class: "",
      title: "Scroll Right",
    },
    span({
      class:
        "icon icon-Arrow-circle-right w-8 h-8 fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
    })
  );
  const carouselTitleWrapper = div(
    {
      class: `${side}CarouselTitleWrapper flex gap-4 flex justify-between items-center mb-4`,
    },
    p({ class: "text-lg font-semibold text-gray-800" }, carouselTitle),
    div({ class: "flex items-center" }, carouselLeftArrow, carouselRightArrow)
  );
  decorateIcons(carouselTitleWrapper);
  carouselProducts.forEach((product) => {
    if (!product) return;

    const card = div(
      {
        class:
          "flex-shrink-0 flex flex-col gap-3 bg-white border p-[12px] space-y-4  w-1/2 max-w-[48%]",
      },
      img({
        src:
          product.images?.[0] ||
          "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble",
        alt: product.title || "",
        class: "w-full h-40 object-contain",
      }),
      p(
        { class: "text-sm font-normal text-danaherpurple-800" },
        product.brand ?? "Carrier Free"
      ),
      p(
        { class: "text-xl text-black font-normal leading-7 h-14" },
        product.title || ""
      ),
      a(
        {
          href: product.url || "",
          class:
            "text-danaherpurple-500 text-base font-semibold flex items-center gap-1",
        },
        carouselLinkText || "",
        span({ class: "ml-1" }, "→")
      )
    );

    carouselContent.appendChild(card);
  });

  const totalCards = carouselContent.children.length;

  let currentIndex = 0;
  const visibleCards = 2;

  const updateArrows = () => {
    carouselLeftArrow.classList.toggle("opacity-50", currentIndex <= 0);
    709770;
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
    const cardWidth = card.offsetWidth + 22;
    carouselContent.style.transform = `translateX(calc(-${
      cardWidth * index
    }px))`;
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
export default async function decorate(block) {
  if (block.hasAttribute("class")) {
    console.log("yes block has classes.");

    block.removeAttribute("class");
  }
  const dualCarouselWrapper = div({
    class: "max-w-[1280px] mx-auto flex flex-col md:flex-row gap-6",
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
      ?.textContent.trim() || "View Details";

  block.innerHtml = "";
  block.textContent = "";
  Object.keys(block).forEach((key) => delete block[key]);

  let leftCarouselProducts = (
    await Promise.all(leftCarouselProductIds.map(getProductInfo))
  ).filter((product) => product.status !== "error");

  if (leftCarouselProducts.length === 0) {
    leftCarouselProducts = renderProductJsonResponse(10);
  }

  let rightCarouselProducts = (
    await Promise.all(rightCarouselProductIds.map(getProductInfo))
  ).filter((product) => product.status !== "error");

  if (rightCarouselProducts.length === 0) {
    rightCarouselProducts = renderProductJsonResponse(10);
  }

  const leftCarouselScrollWrapper = div(
    {
      id: "leftCarouselScrollWrapper",
      class: "md:w-1/2 overflow-hidden flex flex-col",
    },
    createCarousel(
      "left",
      leftCarouselTitle,
      leftCarouselProducts ?? "",
      leftCarouselLinkText
    )
  );

  const rightCarouselScrollWrapper = div(
    {
      id: "rightCarouselScrollWrapper",
      class: "md:w-1/2 overflow-hidden flex flex-col",
    },
    createCarousel(
      "right",
      rightCarouselTitle,
      rightCarouselProducts ?? "",
      rightCarouselLinkText
    )
  );
  dualCarouselWrapper.append(
    leftCarouselScrollWrapper,
    rightCarouselScrollWrapper
  );
  block.append(dualCarouselWrapper);
}

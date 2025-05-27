import {
  div,
  p,
  img,
  section,
  button,
  a,
  h2,
  span,
} from "../../scripts/dom-builder.js";
export default function decorate(block) {
  const sectionHeading =
    block
      .querySelector("[data-aue-label='Section Heading']")
      ?.textContent.trim() || "";

  const bannerSection = section({
    class:
      "flex flex-col md:flex-row items-stretch w-full max-w-[1440px] mx-auto overflow-hidden",
  });
  const carouselHead = div({
    class: "w-full flex sm:flex-row justify-between  gap-3 mb-4",
  });

  const titleContainer = div({
    class: "flex flex-wrap sm:flex-nowrap  gap-4",
  });
  titleContainer.append(
    div(
      {
        class:
          "text-black text-2xl font-normal leading-loose whitespace-nowrap",
      },
      sectionHeading ?? ""
    )
  );

  // === RIGHT CAROUSEL SECTION ===
  const items = block.querySelectorAll(
    "[data-aue-label='Shop Featured Products Item']"
  );
  const slides = [];
  let currentIndex = 0;
  // === CAROUSEL CONTROLS ===

  const updateSlides = (dir) => {
    const total = slides.length;
    if (slides) {
      slides[currentIndex].style.display = "none";
    }
    currentIndex = (currentIndex + dir + total) % total;
    if (slides[currentIndex]) {
      slides[currentIndex].style.display = "flex";
    }
  };

  const arrows = div({
    class: "w-72 inline-flex justify-end items-center gap-6",
  });
  const arrowGroup = div({ class: "flex justify-start items-center gap-3" });
  const prevDiv = button({
    onclick: () => updateSlides(-1),
    class:
      "carousel-prev-div w-10 h-10 relative overflow-hidden cursor-pointer",
  });
  const nextDiv = div({
    onclick: () => updateSlides(1),
    class:
      "carousel-next-div w-10 h-10 relative overflow-hidden cursor-pointer",
  });
  let setControls = true;
  let setItemsPerPage = 1;
  const prevEnabled = setControls ? currentIndex > 0 : currentPage > 1;
  const nextEnabled = setControls
    ? currentIndex + setItemsPerPage < items.length
    : currentPage < Math.ceil(items.length / setItemsPerPage);
  prevDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
        stroke="${
          prevEnabled ? "#7523FF" : "#D1D5DB"
        }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;

  nextDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
        <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
        stroke="${
          nextEnabled ? "#7523FF" : "#D1D5DB"
        }" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>`;
  arrowGroup.append(prevDiv, nextDiv);

  arrows.append(arrowGroup);
  carouselHead.append(titleContainer, arrows);

  items.forEach((item, index) => {
    const brandTitle =
      item
        .querySelector('[data-aue-label="Brand Title"]')
        ?.textContent.trim() || "";
    const productTitle =
      item
        .querySelector("[data-aue-label='Product Title']")
        ?.textContent.trim() || "";
    const productImage = item.querySelector(
      "img[data-aue-label='Product Image']"
    );
    const productSubHeading =
      item
        .querySelector("[data-aue-label='Product Sub Heading']")
        ?.textContent.trim() || "";
    const productDescription =
      item.querySelector("[data-aue-label='Product Description']")?.innerHTML ||
      "";
    const productButtonLabel =
      item
        .querySelector("p[data-aue-label='Button Label']")
        ?.textContent.trim() || "";
    const productButtonUrl =
      item
        .querySelector("a[href]:not([data-aue-label])")
        ?.getAttribute("href") || "#";

    const bgColor =
      item.querySelectorAll(".button-container a")[1]?.textContent.trim() ||
      "#660099";
    // === Left Image Section ===

    if (productImage) {
      productImage.onerror = () => {
        productImage.src =
          "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";
      };
    }
    let fallbackImage = "";
    if (!productImage) {
      fallbackImage =
        "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble";
    }
    const leftSection = div(
      {
        class: "flex w-1/2 flex-col items-start",
      },
      div(
        {
          class: "flex items-center justify-center h-full w-full",
        },
        img({
          src: productImage?.getAttribute("src") || fallbackImage,
          alt: productImage?.getAttribute("alt") || productTitle,
          class: "w-full h-full object-contain",
        })
      )
    );

    // === Right Text Section ===
    const rightSection = div(
      {
        class: "flex w-1/2 justify-center items-center",
        style: `background-color: ${bgColor}; padding: 83.667px 32px 83.563px 32px;`,
      },
      div(
        {
          class: "flex flex-col gap-6",
        },
        p(
          {
            class:
              "text-white text-base font-normal px-0 py-1 flex justify-left items-center gap-2",
          },
          brandTitle
        ),

        h2(
          {
            class: "text-white text-2xl leading-loose font-normal ",
          },
          productTitle
        ),

        p(
          {
            class: "text-white text-base font-semibold leading-snug ",
          },
          productSubHeading
        ),

        div(
          {
            class: "text-white text-base font-extralight leading-snug ",
          },
          ...Array.from(
            new DOMParser().parseFromString(productDescription, "text/html")
              .body.childNodes
          )
        ),
        a(
          {
            href: productButtonUrl,
            class:
              "flex justify-center items-center px-[25px] py-[13px] bg-white text-danaherpurple-500 rounded-full text-base font-semibold hover:bg-opacity-90 transition duration-300 self-start",
          },
          productButtonLabel
        )
      )
    );

    const slide = div(
      {
        id: `featuredProductSlide${index}`,
        "data-index": index,
        class: `carousel-slide h-[405px] flex flex-col md:flex-row items-stretch w-full max-w-[1440px] mx-auto overflow-hidden`,
        style: index === 0 ? "" : "display: none;",
      },
      leftSection,
      rightSection
    );

    slides.push(slide);
  });
  const carouselOuter = div(
    {
      id: "featuredProductCarouselOuter",
      class: "bg-gray-100 flex flex-col items-center  gap-6 relative",
    },
    ...slides
  );
  const container = div(
    {
      class: "w-full gap-12 items-start border-b border-gray-300",
    },
    carouselHead,
    carouselOuter
  );

  //   block.innerHtml = "";
  //   block.textContent = "";
  //   Object.keys(block).forEach((key) => delete block[key]);
  block.append(container);
  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = "none";
    }
  });
}

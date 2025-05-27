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
import { decorateIcons } from "../../scripts/lib-franklin.js";
export default function decorate(block) {
  const sectionHeading =
    block.querySelector("[data-aue-label='Section Heading']") || "";

  const bannerSection = section({
    class:
      "flex flex-col md:flex-row items-stretch w-full max-w-[1440px] mx-auto overflow-hidden",
  });

  // === RIGHT CAROUSEL SECTION ===
  const items = block.querySelectorAll(
    "[data-aue-label='Shop Featured Products Item']"
  );
  const slides = [];
  let currentIndex = 0;

  // === CAROUSEL CONTROLS ===
  const numberIndicator = span(
    {
      class:
        "controlsContentText justify-start text-black text-base font-bold leading-snug",
    },
    `1/${slides.length}`
  );

  const updateSlides = (dir) => {
    const total = slides.length;
    if (slides) {
      slides[currentIndex].style.display = "none";
    }
    currentIndex = (currentIndex + dir + total) % total;
    if (slides[currentIndex]) {
      slides[currentIndex].style.display = "flex";
    }

    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
  };
  const controls = div(
    {
      id: "featuredProductControls",
      class: "flex absolute bottom-4 items-center justify-center gap-4 mt-4",
    },
    button(
      {
        class:
          "w-8 bg-danaherpurple-50 p-2.5 h-8 border  rounded-full text-danaherpurple-500 flex justify-center items-center",
        onclick: () => updateSlides(-1),
      },
      span({
        class: "icon icon-arrow-left-icon",
      })
    ),
    numberIndicator,
    button(
      {
        class:
          "w-8 bg-danaherpurple-50 p-2.5 h-8 border rounded-full text-danaherpurple-500 flex justify-center items-center",
        onclick: () => updateSlides(1),
      },
      span({
        class: "icon icon-arrow-right-icon",
      })
    )
  );
  items.forEach((item, index) => {
    const brandTitle =
      item.querySelector("[data-aue-label='Brand-Title']") || "";
    const productTitle =
      item.querySelector("[data-aue-label='Product-Title']") || "";
    const productImage = item.querySelector(
      "img[data-aue-label='Product Image']"
    );
    const productSubHeading =
      item.querySelector("[data-aue-label='Product-Sub-Heading']") || "";
    const productDescription =
      item.querySelector("[data-aue-label='Product-Description']")?.innerHTML ||
      "";
    const productButtonLabel =
      item.querySelector("p[data-aue-label='Button-Label']") || "";
    const productButtonUrl =
      item
        .querySelector("a[href]:not([data-aue-label])")
        ?.getAttribute("href") || "#";

    const bgColor = item.querySelector("p[data-aue-label='Bg Color']");
    // === Left Image Section ===
    const leftSection = div(
      {
        class: "flex w-1/2 flex-col items-start",
      },
      div(
        {
          class: "flex items-center justify-center h-full w-full",
        },
        img({
          src: productImage?.getAttribute("src") || "",
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

    if (numberIndicator) {
      numberIndicator.textContent = `1/${index + 1}`;
    }
    slides.push(slide);
  });
  decorateIcons(controls);
  const carouselOuter = div(
    {
      id: "featuredProductCarouselOuter",
      class: "bg-gray-100 flex flex-col items-center  gap-6 relative",
    },
    ...slides,
    controls
  );
  const container = div(
    {
      class:
        "flex flex-col md:flex-row w-full gap-12 items-start border-b border-gray-300",
    },
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

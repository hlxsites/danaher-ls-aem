import {
  div,
  p,
  img,
  h1,
  h2,
  button,
  a,
  span,
} from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

export default function decorate(block) {
  document
    .querySelector(".opco-banner-wrapper")
    ?.parentElement?.classList.add("carousel-container");
  document
    .querySelector(".opco-banner-wrapper")
    ?.classList.add("carousel-wrapper");

  const opcoBannerTitle = block.querySelector(
    "[data-aue-prop='opcoBannerTitle']"
  );
  const opcoBannerHeading = block.querySelector(
    "[data-aue-prop='opcoBannerHeading']"
  );
  const opcoBannerDescription = block.querySelector(
    "[data-aue-prop='opcoBannerDescription']"
  );
  const opcoBannerImage = block.querySelector(
    "img[data-aue-prop='opcoBannerImage']"
  );
  const opcoBannerButtonLabel = block.querySelector(
    "p[data-aue-prop='opcoBannerButtonLabel']"
  );
  const opcoBannerButtonUrl =
    block
      .querySelector("a[href]:not([data-aue-label])")
      ?.getAttribute("href") || "#";

  // const linkEls = Array.from({ length: 7 })
  //   .map((_, i) => block.querySelector(`p[data-aue-label='Link${i + 1}']`))
  //   .filter(Boolean);

  const opcoBannerPills = block.querySelectorAll("a");
  const linkWrapper = div({
    class: "flex flex-wrap gap-2 max-w-[344px] items-start content-start",
  });

  opcoBannerPills.forEach((pills, index) => {
    if (index < 7 && index > 0) {
      const linkLabel = block.querySelector(
        `p[data-aue-prop='opcoBannerLink${index + 1}Label']`
      );
      if (linkLabel) {
        linkWrapper.appendChild(
          a(
            {
              href: pills?.textContent || "#",
              class:
                "text-[14px] bg-danaherpurple-500 leading-tight font-medium font-primary text-center text-sm text-danaherpurple-800 bg-purple-50 px-2 py-0.5",
            },
            linkLabel?.textContent?.trim() || ""
          )
        );
      }
    }
  });

  // === LEFT SECTION ===
  const leftContent = div({
    class: "md:mr-6 flex flex-col gap-4 max-w-[567px]",
  });

  if (opcoBannerTitle) {
    leftContent.append(
      p(
        {
          class:
            "text-danaherpurple-800 font-medium text-lg font-medium leading-normal",
        },
        opcoBannerTitle.textContent.trim()
      )
    );
  }
  if (opcoBannerImage) {
    leftContent.append(
      img({
        src: opcoBannerImage.src,
        alt: opcoBannerImage.alt || "Brand Image",
        class: "w-[120px] mb-2 md:mb-8 h-auto",
      })
    );
  }

  if (opcoBannerHeading) {
    leftContent.append(
      h1(
        {
          class:
            "text-4xl leading-[48px] text-lg font-medium text-black w-full m-0 leading-normal",
        },
        opcoBannerHeading.textContent.trim()
      )
    );
  }

  if (opcoBannerDescription) {
    leftContent.append(
      div(
        {
          class:
            "text-[16px] leading-[22px] font-medium font-primary text-black w-full",
        },
        opcoBannerDescription.textContent.trim()
      )
    );
  }

  if (linkWrapper.childNodes.length > 0) {
    leftContent.append(linkWrapper);
  }

  const left = div(
    {
      class: "flex flex-col gap-6 md:w-1/2 p-6 md:pl-14 items-start bg-white",
    },
    leftContent
  );

  if (opcoBannerButtonUrl && opcoBannerButtonLabel) {
    const ctaWrapper = div(
      {
        class: "w-full flex justify-start md:justify-start max-w-[567px]",
      },
      button(
        {
          class:
            "bg-danaherpurple-500 text-danaherpurple-800 text-white text-sm font-medium rounded-[30px] px-[25px] py-[13px] shadow-sm hover:opacity-90 transition",
          onclick: () => window.open(opcoBannerButtonUrl, "_blank"),
        },
        opcoBannerButtonLabel?.textContent.trim() || ""
      )
    );
    left.append(ctaWrapper);
  }

  // === RIGHT CAROUSEL SECTION ===
  const items = block.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
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
    const getSlides = document.querySelector(`#opcoBannerSlide${currentIndex}`);

    if (getSlides && getSlides.classList.contains("hasBg")) {
      numberIndicator.style.color = "#fff";
    } else {
      numberIndicator.style.color = "";
    }
    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
  };
  const controls = div(
    {
      id: "opcoBannerControls",
      class:
        "flex absolute bottom-6 dhlsBp:bottom-12 items-center justify-center gap-4",
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
    const opcoBannerItemTitle = item.querySelector(
      "[data-aue-prop='opcoBannerItemTitle']"
    );
    const opcoBannerItemSubHeading = item.querySelector(
      "[data-aue-prop='opcoBannerItemSubHeading']"
    );
    const opcoBannerItemDescription = item.querySelector(
      "[data-aue-prop='opcoBannerItemDescription'] p"
    );
    const opcoBannerItemImage = item.querySelector(
      "img[data-aue-prop='opcoBannerItemImage']"
    );
    const opcoBannerItemBgImage = item.querySelector(
      "img[data-aue-prop='opcoBannerItemBgImage']"
    );
    const opcoBannerItemButtonLabel = item.querySelector(
      "p[data-aue-prop='opcoBannerItemButtonLabel']"
    );
    const ctaUrl = item.querySelector("a[href]")?.getAttribute("href") || "#";

    const contentWrapper = div({
      class:
        "min-h-[400px] z-10 flex flex-col items-center justify-center gap-2 text-center w-full max-w-[470px]",
    });

    if (opcoBannerItemImage) {
      contentWrapper.append(
        img({
          src: opcoBannerItemImage?.src,
          alt: opcoBannerItemTitle?.textContent || "Slide image",
          class: `${
            opcoBannerItemBgImage ? "opacity-0" : ""
          } w-[300px] h-[184px] object-cover`,
          style:
            "background: lightgray center / cover no-repeat; mix-blend-mode: multiply;",
        })
      );
    }

    if (opcoBannerItemTitle) {
      contentWrapper.append(
        h2(
          {
            class: "text-3xl leading-10 font-medium text-black text-center",
          },
          opcoBannerItemTitle?.textContent.trim() || ""
        )
      );
    }

    if (opcoBannerItemSubHeading) {
      contentWrapper.append(
        p(
          {
            class: "leading-7 font-medium text-black text-xl text-center",
          },
          opcoBannerItemSubHeading?.textContent.trim() || ""
        )
      );
    }

    if (opcoBannerItemDescription) {
      contentWrapper.append(
        p(
          {
            class:
              "text-[14px] leading-snug font-extralight text-black text-center max-w-[420px]",
          },
          opcoBannerItemDescription?.textContent.trim() || ""
        )
      );
    }

    if (opcoBannerItemButtonLabel) {
      contentWrapper.append(
        button(
          {
            class:
              "bg-danaherpurple-500 text-white font-medium rounded-[30px] px-[25px] mt-6 mb-6 py-[13px] shadow-sm text-sm flex justify-center items-center hover:opacity-90",
            onclick: () => window.open(ctaUrl, "_blank"),
          },
          opcoBannerItemButtonLabel?.textContent.trim() || ""
        )
      );
    }
    const overlayWrapper = div({
      class:
        "absolute top-0 w-full h-full  bg-gradient-to-b from-black/0 to-black/95 hidden",
    });
    const slide = div(
      {
        id: `opcoBannerSlide${index}`,
        "data-index": index,
        class: ` ${
          opcoBannerItemBgImage ? "hasBg " : " "
        }carousel-slide p-10 flex  min-h-[650px] md:min-h-[600px] flex-col items-center w-full relative`,
        style: index === 0 ? "" : "display: none;",
      },
      contentWrapper,
      overlayWrapper
    );

    if (numberIndicator) {
      numberIndicator.textContent = `1/${index + 1}`;
    }
    if (opcoBannerItemBgImage) {
      overlayWrapper?.classList.remove("hidden");
      slide.style.padding = "2.5rem";
      slide.style.backgroundImage = `url('${opcoBannerItemBgImage.src}')`;
      slide.style.backgroundSize = "cover";
      slide.style.backgroundSize = "cover";
      slide.style.backgroundPosition = "center";
      slide.querySelectorAll(".text-center")?.forEach((it) => {
        it.style.color = "#fff";
      });
    } else {
      overlayWrapper?.classList.add("hidden");
      if (slide.hasAttribute("style")) {
        slide.style.padding = "";
        slide.style.backgroundImage = "";
        slide.style.backgroundSize = "";
        slide.style.backgroundPosition = "";
        slide.querySelectorAll(".text-center")?.forEach((ite) => {
          if (ite.hasAttribute("style")) {
            ite.removeAttribute("style");
          }
        });
      }
    }
    slides.push(slide);
  });
  decorateIcons(controls);
  const right = div(
    {
      id: "opcoBannerCarouselOuter",
      class:
        "md:w-1/2 w-full bg-gray-100 flex flex-col items-center  gap-6 relative",
    },
    ...slides,
    controls
  );
  const getFirstSlide = right.querySelector("#opcoBannerSlide0");
  if (getFirstSlide && getFirstSlide.classList.contains("hasBg")) {
    numberIndicator.style.color = "#fff";
  }
  const container = div(
    {
      class:
        "flex flex-col md:flex-row w-full items-center border-b border-gray-300",
    },
    left,
    right
  );

  block.append(container);

  // Hide authored AEM content
  [...block.children].forEach((child) => {
    if (!child.contains(container)) {
      child.style.display = "none";
    }
  });
}

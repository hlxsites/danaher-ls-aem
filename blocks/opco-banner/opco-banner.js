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

export default async function decorate(block) {
  const baseUrl = "https://lifesciences.danaher.com";
  // document
  //   .querySelector(".opco-banner-wrapper")
  //   ?.parentElement?.classList.add("carousel-container");
  // document
  //   .querySelector(".opco-banner-wrapper")
  //   ?.classList.add("carousel-wrapper");

  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");

  const opcoBannerTitle = block.querySelector(
    "[data-aue-prop='opcoBannerTitle']"
  );
  const opcoBannerHeading = block.querySelector(
    "[data-aue-prop='opcoBannerHeading']"
  );
  const opcoBannerDescription = block.querySelector(
    "[data-aue-prop='opcoBannerDescription']"
  )?.innerHTML;
  const opcoBannerImage = block.querySelector(
    "img[data-aue-prop='opcoBannerImage']"
  );
  const opcoBannerButtonLabel = block.querySelector(
    "p[data-aue-prop='opcoBannerButtonLabel']"
  );
  const opcoBannerButtonTarget = block.querySelector(
    "p[data-aue-prop='opcoBannerButtonTarget']"
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

  const brandsResponse = await fetch(`${baseUrl}/us/en/products-index.json`);

  const brandsRaw = await brandsResponse.json();
  let allProducts = Array.isArray(brandsRaw)
    ? brandsRaw
    : brandsRaw?.data || brandsRaw?.results || [];
  // Build unique filters (exclude brands with commas)
  const filterSet = new Set();
  allProducts.forEach((item) => {
    if (item.type === "Category") {
      const brand = { name: item.brand?.trim(), path: item.path?.trim() };
      if (brand && !brand.includes(",")) filterSet.add(brand);
    }
  });
  const allBrands = Array.from(filterSet).sort();
  console.log("all brands: ", allBrands);

  allBrands.forEach((pills, index) => {
    const linkLabel = block.querySelector(
      `p[data-aue-prop='opcoBannerLink${index + 1}Label']`
    );

    const linkTarget = block.querySelector(
      `p[data-aue-prop='opcoBannerLink${index + 1}Target']`
    );
    if (linkLabel) {
      linkWrapper.appendChild(
        a(
          {
            href: pills?.textContent || "#",
            target: linkTarget ? "_blank" : "_self",
            class:
              "text-[16px] leading-tight font-medium font-primary text-center text-sm text-danaherpurple-800 bg-danaherpurple-25 px-4 py-1",
          },
          linkLabel?.textContent?.trim() || ""
        )
      );
    }
  });

  // === LEFT SECTION ===
  const leftContent = div({
    class: "flex flex-col gap-4 max-w-[567px]",
  });

  if (opcoBannerTitle) {
    leftContent.append(
      p(
        {
          class:
            "text-danaherpurple-800 font-medium text-lg font-medium leading-normal",
        },
        opcoBannerTitle.textContent.trim().replace(/<[^>]*>/g, "")
      )
    );
  }
  if (opcoBannerImage) {
    leftContent.append(
      img({
        src: opcoBannerImage.src.replace(/<[^>]*>/g, ""),
        alt: opcoBannerImage.alt.replace(/<[^>]*>/g, "") || "Brand Image",
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
        opcoBannerHeading.textContent.trim().replace(/<[^>]*>/g, "")
      )
    );
  }

  if (opcoBannerDescription) {
    const leftDescription = div({
      id: "opcoBannerDescription",
      class: "text-[18px] leading-[22px] font-normal text-black w-full",
    });

    leftDescription.insertAdjacentHTML("beforeend", opcoBannerDescription);
    const descriptionLinks = leftDescription?.querySelectorAll("a");
    descriptionLinks?.forEach((link) => {
      const linkHref = link?.getAttribute("href");

      link.setAttribute(
        "target",
        linkHref.includes("http") ? "_blank" : "_self"
      );
    });
    leftContent.append(leftDescription);
  }

  if (linkWrapper.childNodes.length > 0) {
    leftContent.append(linkWrapper);
  }

  if (opcoBannerButtonUrl && opcoBannerButtonLabel) {
    const ctaWrapper = button(
      {
        class:
          "max-w-max bg-danaherpurple-500 text-danaherpurple-800 text-white text-sm font-medium rounded-[30px] px-[25px] py-[13px] shadow-sm hover:bg-danaherpurple-800 transition",
        onclick: () =>
          window.open(
            opcoBannerButtonUrl,
            opcoBannerButtonTarget ? "_blank" : "_self"
          ),
      },
      opcoBannerButtonLabel?.textContent.trim().replace(/<[^>]*>/g, "") || ""
    );
    leftContent.append(ctaWrapper);
  }
  const left = div(
    {
      class:
        "flex flex-col gap-6 md:w-1/2 p-6 dhlsBp:pl-0 items-start bg-white",
    },
    leftContent
  );

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
        "flex absolute bottom-6 dhlsBp:bottom-12 items-center  justify-center gap-4",
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
          "w-8 bg-danaherpurple-50 text-base p-2.5 h-8 border rounded-full text-danaherpurple-500 flex justify-center items-center",
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
      "[data-aue-prop='opcoBannerItemDescription']"
    )?.innerHTML;
    const opcoBannerItemImage = item.querySelector(
      "img[data-aue-prop='opcoBannerItemImage']"
    );
    const opcoBannerItemBgImage = item.querySelector(
      "img[data-aue-prop='opcoBannerItemBgImage']"
    );
    const opcoBannerItemButtonLabel = item.querySelector(
      "p[data-aue-prop='opcoBannerItemButtonLabel']"
    );
    const opcoBannerItemButtonTarget = item.querySelector(
      "p[data-aue-prop='opcoBannerItemButtonTarget']"
    );
    const ctaUrl = item.querySelector("a[href]")?.getAttribute("href") || "#";

    const contentWrapper = div({
      class:
        "min-h-[400px] dhlsBp:pr-0 z-10 flex flex-col items-center justify-center gap-2 text-center w-full max-w-[470px]",
    });

    if (opcoBannerItemImage) {
      contentWrapper.append(
        img({
          src: opcoBannerItemImage?.src,
          alt:
            opcoBannerItemTitle?.textContent.replace(/<[^>]*>/g, "") ||
            "Slide image",
          class: `${
            opcoBannerItemBgImage ? "opacity-0" : ""
          } w-[300px] h-[184px] object-cover`,
        })
      );
    }

    if (opcoBannerItemTitle) {
      contentWrapper.append(
        h2(
          {
            class: "text-3xl leading-10 font-medium text-black text-center",
          },
          opcoBannerItemTitle?.textContent.trim().replace(/<[^>]*>/g, "") || ""
        )
      );
    }

    if (opcoBannerItemSubHeading) {
      contentWrapper.append(
        p(
          {
            class:
              "leading-7 !line-clamp-1 text-clip !break-words font-medium text-black text-xl text-center",
          },
          opcoBannerItemSubHeading?.textContent
            .trim()
            .replace(/<[^>]*>/g, "") || ""
        )
      );
    }

    if (opcoBannerItemDescription) {
      const descriptionHtml = div();
      descriptionHtml.insertAdjacentHTML(
        "beforeend",
        opcoBannerItemDescription
      );

      const descriptionLinks = descriptionHtml.querySelectorAll("a");
      descriptionLinks?.forEach((link) => {
        const linkHref = link?.getAttribute("href");

        link.setAttribute(
          "target",
          linkHref.includes("http") ? "_blank" : "_self"
        );
      });
      contentWrapper.append(
        div(
          {
            class:
              "text-[16px] !line-clamp-2 text-clip !break-words leading-snug text-black font-normal text-center max-w-[420px]",
          },
          descriptionHtml
        )
      );
    }

    if (opcoBannerItemButtonLabel) {
      contentWrapper.append(
        button(
          {
            class:
              "bg-danaherpurple-500 text-white font-medium rounded-[30px] px-[25px] mt-6 mb-6 py-[13px] text-base flex justify-center items-center hover:bg-danaherpurple-800",
            onclick: () =>
              window.open(
                ctaUrl,
                opcoBannerItemButtonTarget ? "_blank" : "_self"
              ),
          },
          opcoBannerItemButtonLabel?.textContent
            .trim()
            .replace(/<[^>]*>/g, "") || ""
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
    if (!opcoBannerItemImage && !opcoBannerItemTitle) {
      slide.classList.add("hidden");
    } else {
      if (slide.classList.contains("hidden")) {
        slide.classList.remove("hidden");
      }
      if (numberIndicator) {
        numberIndicator.textContent = `1/${index + 1}`;
      }
      slides.push(slide);
    }
  });
  decorateIcons(controls);
  const right = div(
    {
      id: "opcoBannerCarouselOuter",
      class:
        "md:w-1/2 w-full bg-gray-100 flex   flex-col items-center  gap-6 relative",
    },
    ...slides,
    items.length > 0 ? controls : ""
  );
  const getFirstSlide = right.querySelector("#opcoBannerSlide0");
  if (getFirstSlide && getFirstSlide.classList.contains("hasBg")) {
    numberIndicator.style.color = "#fff";
  }
  const container = div(
    {
      class:
        "flex flex-col md:flex-row w-full dhls-container !mt-0 lg:px-10 dhlsBp:p-0 items-center border-b border-gray-300",
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

import { div, p, img, h1, button, a, span } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  const leftHeadingEl = block.querySelector("[data-aue-label='LeftHeading']");
  const leftTitleEl = block.querySelector("[data-aue-label='LeftTitle']");
  const leftDescEl = block.querySelector(
    "[data-aue-label='LeftDescription'] p"
  );
  const leftImgEl = block.querySelector("img[data-aue-label='LeftImage']");
  const leftCtaEl = block.querySelector("p[data-aue-label='Left Button']");
  const leftCtaUrl =
    block
      .querySelector("a[href]:not([data-aue-label])")
      ?.getAttribute("href") || "#";

  // const linkEls = Array.from({ length: 7 })
  //   .map((_, i) => block.querySelector(`p[data-aue-label='Link${i + 1}']`))
  //   .filter(Boolean);

  const linkEls = block.querySelectorAll("a");
  const linkWrapper = div({
    class: "flex flex-wrap gap-2 w-[344px] items-start content-start",
  });

  linkEls.forEach((linkEl, index) => {
    if (index < 7 && index > 0) {
      const linkLabel = block.querySelector(
        `p[data-aue-label='Link ${index + 1} Label']`
      );

      linkWrapper.appendChild(
        a(
          {
            href: linkEl?.textContent || "#",
            class:
              "text-[14px] bg-danaherpurple-500 leading-tight font-medium font-primary text-center text-sm text-danaherpurple-800 bg-purple-50 px-2 py-0.5",
          },
          linkLabel?.textContent?.trim() || ""
        )
      );
    }
  });

  // === LEFT SECTION ===
  const leftContent = div({ class: "flex flex-col gap-6" });

  if (leftHeadingEl) {
    leftContent.append(
      p(
        {
          class:
            "text-danaherpurple-800 font-medium text-lg font-medium leading-normal",
        },
        leftHeadingEl.textContent.trim()
      )
    );
  }

  if (leftImgEl) {
    leftContent.append(
      img({
        src: leftImgEl.src,
        alt: leftImgEl.alt || "Brand Image",
        class: "w-[120px] h-auto",
      })
    );
  }

  if (leftTitleEl) {
    leftContent.append(
      h1(
        {
          class:
            "text-[32px] leading-[40px] text-lg font-medium text-black w-full  leading-normal",
        },
        leftTitleEl.textContent.trim()
      )
    );
  }

  if (leftDescEl) {
    leftContent.append(
      p(
        {
          class:
            "text-[16px] leading-[22px] font-medium font-primary text-black w-full",
        },
        leftDescEl.textContent.trim()
      )
    );
  }

  if (linkWrapper.childNodes.length > 0) {
    leftContent.append(linkWrapper);
  }

  const left = div(
    {
      class: "flex flex-col gap-6 md:w-1/2 p-10 items-start bg-white",
    },
    leftContent
  );

  if (leftCtaEl) {
    const ctaWrapper = div(
      {
        class: "w-full flex justify-center md:justify-start",
      },
      button(
        {
          class:
            "bg-danaherpurple-500 text-danaherpurple-800 text-white text-sm font-medium rounded-[30px] px-[25px] py-[13px] shadow-sm hover:opacity-90 transition",
          onclick: () => window.open(leftCtaUrl, "_blank"),
        },
        leftCtaEl.textContent.trim()
      )
    );
    left.append(ctaWrapper);
  }

  // === RIGHT CAROUSEL SECTION ===
  const items = block.querySelectorAll("[data-aue-label='Opco-Banner-Item']");
  const slides = [];
  let currentIndex = 0;

  items.forEach((item, index) => {
    const titleEl = item.querySelector("[data-aue-label='Title']");
    const smallTitleEl = item.querySelector("[data-aue-label='smallTitle']");
    const descEl = item.querySelector("[data-aue-label='RightDescription'] p");
    const imgEl = item.querySelector("img[data-aue-label='RightImage']");
    const ctaText = item.querySelector("p[data-aue-label='Right Button']");
    const ctaUrl = item.querySelector("a[href]")?.getAttribute("href") || "#";

    const contentWrapper = div({
      class:
        "min-h-[400px] flex flex-col items-center justify-center gap-4 text-center w-full",
    });

    if (imgEl) {
      contentWrapper.append(
        img({
          src: imgEl.src,
          alt: titleEl?.textContent || "Slide image",
          class: "w-[300px] h-[184px] object-cover",
          style:
            "background: lightgray center / cover no-repeat; mix-blend-mode: multiply;",
        })
      );
    }

    if (titleEl) {
      contentWrapper.append(
        h1(
          {
            class:
              "text-[24px] leading-[32px] font-semibold font-primary text-black text-center",
          },
          titleEl.textContent.trim()
        )
      );
    }

    if (smallTitleEl) {
      contentWrapper.append(
        p(
          {
            class:
              "leading-7 font-medium font-primary text-black text-xl text-center",
          },
          smallTitleEl.textContent.trim()
        )
      );
    }

    if (descEl) {
      contentWrapper.append(
        p(
          {
            class:
              "text-[14px] leading-snug font-light font-primary text-black text-center max-w-[420px]",
          },
          descEl.textContent.trim()
        )
      );
    }

    if (ctaText) {
      contentWrapper.append(
        button(
          {
            class:
              "bg-danaherpurple-500 text-white rounded-[30px] px-[25px] py-[13px] shadow-sm text-sm font-medium flex justify-center items-center hover:opacity-90",
            onclick: () => window.open(ctaUrl, "_blank"),
          },
          ctaText.textContent.trim()
        )
      );
    }

    const slide = div(
      {
        class: "carousel-slide flex flex-col items-center w-full",
        style: index === 0 ? "" : "display: none;",
        "data-index": index,
      },
      contentWrapper
    );

    slides.push(slide);
  });

  // === CAROUSEL CONTROLS ===
  const numberIndicator = span(
    {
      class: "text-[16px] leading-[22px] font-bold text-black",
    },
    `1/${slides.length}`
  );

  const updateSlides = (dir) => {
    const total = slides.length;
    slides[currentIndex].style.display = "none";
    currentIndex = (currentIndex + dir + total) % total;
    slides[currentIndex].style.display = "flex";
    numberIndicator.textContent = `${currentIndex + 1}/${total}`;
  };

  const controls = div(
    {
      class: "flex items-center justify-center gap-4 mt-4",
    },
    button(
      {
        class:
          "w-8 h-8 border border-danaherpurple-500 rounded-full text-danaherpurple-500 flex justify-center items-center",
        onclick: () => updateSlides(-1),
      },
      "←"
    ),
    numberIndicator,
    button(
      {
        class:
          "w-8 h-8 border border-danaherpurple-500 rounded-full text-danaherpurple-500 flex justify-center items-center",
        onclick: () => updateSlides(1),
      },
      "→"
    )
  );

  const right = div(
    {
      class:
        "md:w-1/2 w-full bg-gray-100 flex flex-col items-center p-10 gap-6",
    },
    ...slides,
    controls
  );

  const container = div(
    {
      class:
        "flex flex-col md:flex-row w-full gap-12 items-start border-b border-gray-300",
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

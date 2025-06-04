import { div, p, h2, img, a, section } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const title1 =
    block.querySelector('[data-aue-prop="title1"]')?.textContent.trim() || "";
  const title2 =
    block.querySelector('[data-aue-prop="title2"]')?.textContent.trim() || "";
  const title3 =
    block.querySelector('[data-aue-prop="title3"]')?.textContent.trim() || "";
  const descriptionHTML =
    block.querySelector('[data-aue-prop="description"]')?.innerHTML || "";
  const imgEl = block.querySelector('img[data-aue-prop="fileReference"]');
  const ctaText =
    block.querySelector('[data-aue-prop="linklabel"]')?.textContent.trim() ||
    "Learn More";
  const ctaLink =
    block.querySelector("div *:not([data-aue-label]) a")?.textContent.trim() ||
    "#";
  const rightColor =
    block.querySelectorAll(".button-container a")[1]?.textContent.trim() ||
    "#660099";

  const imgSrc = imgEl?.getAttribute("src") || "";
  const imgAlt = imgEl?.getAttribute("alt") || title1;

  const bannerSection = section({
    class:
      "flex flex-col md:flex-row  items-stretch  dhls-container px-5 lg:px-10 dhlsBp:p-0  w-full overflow-hidden",
  });

  // === Left Image Section ===
  const leftSection = div(
    {
      class: "flex md:w-1/2 flex-col items-start",
    },
    div(
      {
        class: "flex items-center justify-center h-full w-full",
      },
      img({
        src: imgSrc,
        alt: imgAlt,
        class: "w-full h-full object-contain",
      })
    )
  );

  // === Right Text Section ===
  const rightSection = div(
    {
      class: "flex md:w-1/2 justify-center items-center p-8 min-h-[413px]",
      style: `background-color: ${rightColor};`,
    },
    div(
      {
        class: "flex flex-col gap-4",
      },
      p(
        {
          class:
            "text-white text-lg font-medium px-0 py-1 flex justify-left items-center gap-2",
        },
        title1
      ),

      h2(
        {
          class: "text-white !text-2xl leading-loose !font-medium ",
        },
        title2
      ),

      p(
        {
          class: "text-white text-base font-semibold leading-snug ",
        },
        title3
      ),

      div(
        {
          class: "text-white text-base font-extralight leading-snug ",
        },
        ...Array.from(
          new DOMParser().parseFromString(descriptionHTML, "text/html").body
            .childNodes
        )
      ),
      a(
        {
          href: ctaLink,
          class:
            "flex justify-center items-center px-[25px] py-[13px] bg-white text-danaherpurple-500 rounded-full text-base font-semibold hover:bg-opacity-90 transition duration-300 self-start",
        },
        ctaText
      )
    )
  );

  bannerSection.append(leftSection, rightSection);
  block.innerHTML = "";
  block.appendChild(bannerSection);
}

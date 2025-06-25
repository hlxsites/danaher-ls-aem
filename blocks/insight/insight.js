import {
  div,
  h2,
  a,
  img,
  section,
  h3,
  span,
} from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

export default function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const getText = (prop, el = block) =>
    el
      .querySelector(`[data-aue-prop="${prop}"]`)
      ?.textContent.trim()
      .replace(/<[^>]*>/g, "") || "";

  const getHTML = (prop, el = block) =>
    el.querySelector(`[data-aue-prop="${prop}"]`)?.innerHTML || "";

  // Extract top-level title/description
  const leftTitle = getText("titleText");
  const leftDescHTML = getHTML("description");

  // Create structured JSON from insight items
  const itemElements = [
    ...block.querySelectorAll('[data-aue-model="insight-item"]'),
  ];
  const insightItems = itemElements.map((item) => {
    const title = getText("lefttitle", item);
    const description = getText("leftDes", item);
    const linkUrl =
      item
        .querySelector("a")
        ?.textContent.trim()
        .replace(/<[^>]*>/g, "") || "#";
    const linkLabel = getText("linklabel", item);
    const linkTarget = getText("insightlinkTarget", item);
    const imgEl = item.querySelector('img[data-aue-prop="fileReference"]');
    const imgSrc = imgEl?.getAttribute("src") || "";
    const fullImgSrc =
      imgSrc && !imgSrc.startsWith("http")
        ? `${window.location.origin}${imgSrc}`
        : imgSrc.replace(/<[^>]*>/g, "");

    return {
      title,
      description,
      linkUrl,
      linkTarget,
      linkLabel,
      imgSrc: fullImgSrc,
    };
  });

  // DOM Rendering
  const eyesection = section({
    class: " dhls-container px-5 lg:px-10 dhlsBp:p-0 ",
  });
  const wrapper = div({ class: "flex flex-col md:flex-row gap-6" });

  // LEFT COLUMN
  const leftCol = div(
    { class: "w-full md:w-1/2 pr-0 md:pr-6" },
    h2(
      { class: "text-2xl md:text-3xl font-semibold mb-4 mt-0 text-black" },
      leftTitle
    ),
    div(
      { class: "text-base text-black font-normal leading-relaxed" },
      ...Array.from(
        new DOMParser().parseFromString(leftDescHTML, "text/html").body
          .childNodes
      )
    )
  );

  const leftColLinks = leftCol.querySelectorAll("a");
  leftColLinks?.forEach((link) => {
    const linkHref = link?.getAttribute("href");

    link.setAttribute("target", linkHref.includes("http") ? "_blank" : "_self");
  });
  // RIGHT COLUMN
  const rightCol = div({
    class:
      "w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-0 md:pl-6 mt-1",
  });

  insightItems.forEach(
    ({ title, description, linkUrl, linkTarget, linkLabel, imgSrc }, ind) => {
      const imageEl = imgSrc
        ? img({
            src: imgSrc,
            alt: title,
            class: "w-12 mt-[2px] object-contain flex-shrink-0",
          })
        : null;

      const container = div(
        {
          class: `py-8 flex gap-4 ${ind === 0 ? "pt-0" : ""} ${
            ind === insightItems.length - 1 ? "pb-0" : ""
          }  `,
        }, // Removed items-start to fix icon alignment
        ...(imageEl ? [imageEl] : []),
        div(
          { class: "flex flex-col gap-4" },
          h3(
            {
              class: `text-lg font-semibold text-black !m-0 !p-0  ${
                ind === 0 ? "mt-0" : ""
              } `,
            },
            title
          ),
          div(
            {
              class:
                "insight-description font-normal text-base textblack mb-3 text-black !m-0 !p-0",
            },
            description
          ),
          a(
            {
              href: linkUrl,
              target: linkTarget ? "_blank" : "_self",
              class:
                "text-danaherpurple-500 text-base font-semibold  flex items-center !m-0 !p-0",
            },
            linkLabel,
            span({
              class:
                "icon icon-arrow-right  dhls-arrow-right-icon fill-current [&_svg>use]:stroke-danaherpurple-500 [&_svg>use]:hover:stroke-danaherpurple-800",
            })
          )
        )
      );

      const descriptionLinks = container
        ?.querySelector(".insight-description")
        ?.querySelectorAll("a");
      descriptionLinks?.forEach((link) => {
        const linkHref = link?.getAttribute("href");

        link.setAttribute(
          "target",
          linkHref.includes("http") ? "_blank" : "_self"
        );
      });
      rightCol.appendChild(container);
    }
  );

  // Final Assembly
  wrapper.append(leftCol, rightCol);
  eyesection.appendChild(wrapper);
  decorateIcons(eyesection);
  block.append(eyesection);
  // Hide authored content
  [...block.children].forEach((child) => {
    if (!child.contains(eyesection)) {
      child.style.display = "none";
    }
  });
}

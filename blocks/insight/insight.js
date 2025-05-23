import {
  div,
  p,
  h2,
  a,
  img,
  section,
  h3,
  span,
} from "../../scripts/dom-builder.js";

export default function decorate(block) {
  console.log("insight block: ", block);

  const getText = (prop, el = block) =>
    el.querySelector(`[data-aue-prop="${prop}"]`)?.textContent.trim() || "";

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
    const linkText = getText("link", item);
    const linkLabel = getText("linklabel", item);
    const imgEl = item.querySelector('img[data-aue-prop="fileReference"]');
    const imgSrc = imgEl?.getAttribute("src") || "";
    const fullImgSrc =
      imgSrc && !imgSrc.startsWith("http")
        ? `${window.location.origin}${imgSrc}`
        : imgSrc;

    return {
      title,
      description,
      linkText,
      linkLabel,
      imgSrc: fullImgSrc,
    };
  });

  // DOM Rendering
  const eyesection = section({ class: "max-w-[1200px] mx-auto" });
  const wrapper = div({ class: "flex flex-col md:flex-row gap-6" });

  // LEFT COLUMN
  const leftCol = div(
    { class: "w-full md:w-1/2 pr-0 md:pr-6" },
    h2(
      { class: "text-2xl md:text-3xl font-semibold mb-4 text-black" },
      leftTitle
    ),
    div(
      { class: "text-base text-gray-700 leading-relaxed" },
      ...Array.from(
        new DOMParser().parseFromString(leftDescHTML, "text/html").body
          .childNodes
      )
    )
  );

  // RIGHT COLUMN
  const rightCol = div({
    class:
      "w-full md:w-1/2 flex flex-col divide-y divide-gray-200 pl-0 md:pl-6",
  });

  insightItems.forEach(
    ({ title, description, linkText, linkLabel, imgSrc }) => {
      const imageEl = imgSrc
        ? img({
            src: imgSrc,
            alt: title,
            class: "w-6 mt-[2px] object-contain flex-shrink-0",
          })
        : null;

      const container = div(
        { class: "py-6 flex gap-4" }, // Removed items-start to fix icon alignment
        ...(imageEl ? [imageEl] : []),
        div(
          { class: "flex flex-col" },
          h3({ class: "text-lg font-semibold text-black mb-1" }, title),
          p({ class: "text-sm text-gray-700 mb-3" }, description),
          a(
            {
              href: linkText,
              class:
                "text-purple-700 text-sm font-semibold hover:underline flex items-center gap-1",
            },
            linkLabel,
            span({ class: "ml-1" }, "→")
          )
        )
      );

      rightCol.appendChild(container);
    }
  );

  // Final Assembly
  wrapper.append(leftCol, rightCol);
  eyesection.appendChild(wrapper);
  block.append(eyesection);
  // Hide authored content
  [...block.children].forEach((child) => {
    if (!child.contains(eyesection)) {
      child.style.display = "none";
    }
  });
}

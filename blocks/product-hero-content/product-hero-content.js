import { div, span, a } from "../../scripts/dom-builder.js";

export default async function decorate(block) {
  const subProductData = [
    {
      subProductTitle: block.querySelector('[data-aue-prop="prod_hero_title"]')?.textContent,
      subProductDescription: block.querySelector('[data-aue-prop="prod_hero_description"]')?.innerHTML,
    },
  ];

  subProductData.forEach((banner) => {
    const { subProductTitle, subProductDescription } = banner;

    // Left Div (w-96 div and its child)
    const leftDiv = div(
      {
        class: "w-96 flex justify-start items-center gap-12",
      },
      div(
        {
          class: "flex-1 text-black text-3xl font-normal leading-10",
        },
        subProductTitle || ""
      )
    );

    // Parse the description HTML for validation
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = subProductDescription || "";

    // Apply styles to paragraphs for validation
    tempContainer.querySelectorAll("p").forEach((paragraph) => {
      paragraph.classList.add("text-black", "mb-2");
    });

    // Apply styles to links for validation
    tempContainer.querySelectorAll("a").forEach((link) => {
      link.classList.add("text-violet-600", "font-bold", "font-['TWK_Lausanne_Pan']", "leading-snug", "inline");
    });

    // Extract the paragraph and link content
    const paragraph = tempContainer.querySelector("p");
    const link = paragraph?.querySelector("a");
    
    // Extract the text content before the link
    let descriptionText = "";
    if (paragraph) {
      const childNodes = Array.from(paragraph.childNodes);
      descriptionText = childNodes
        .filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node !== link))
        .map(node => node.textContent)
        .join("")
        .trim();
    }

    // Create the description span with textContent
    const descriptionSpan = span(
      {
        class: "text-black text-base font-extralight leading-snug",
      },
      descriptionText || ""
    );

    // Create the link element manually
    const linkElement = link
      ? a(
          {
            class: "text-violet-600 font-bold leading-snug inline",
            href: link.getAttribute("href") || "#",
            title: link.getAttribute("title") || "Read More",
            target: link.getAttribute("target") || "_blank",
            rel: link.getAttribute("rel") || "noopener",
          },
          link.textContent || "Read More"
        )
      : span(
          {
            class: "text-violet-600 font-bold leading-snug inline",
          },
          "Read More"
        );

    // Right Div (flex-1 self-stretch div and its child)
    const rightDiv = div(
      {
        class: "flex-1 self-stretch inline-flex flex-col justify-start items-start gap-4",
      },
      div(
        {
          class: "self-stretch h-16 justify-start",
        },
        descriptionSpan,
        " ", // Add a space between the description and the link
        linkElement
      )
    );

    // Inner Container
    const innerContainer = div(
      {
        class: "self-stretch inline-flex justify-start items-start gap-5",
      },
      leftDiv,
      rightDiv
    );

    // Outer Container
    const outerContainer = div(
      {
        class: "self-stretch py-12 bg-white border-b border-gray-400 inline-flex flex-col justify-center items-start gap-12 overflow-hidden",
      },
      innerContainer
    );

    block.innerHTML = "";
    block.appendChild(outerContainer);
  });
}
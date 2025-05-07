import { div, p, img, a, span } from "../../scripts/dom-builder.js"

export default function decorate(block) {
  const titleEl = block.querySelector('[data-aue-prop="offer_title"]')
  const imgEl = block.querySelector('img[data-aue-prop="fileReference"]')
  const linkTextEl = block.querySelector('[data-aue-prop="link"]')
  const bgColorEl = block.querySelector('[data-aue-prop="bg-color"]')

  const title = titleEl?.textContent?.trim() || ""
  const imgSrc = imgEl?.getAttribute("src") || ""
  const imgAlt = imgEl?.getAttribute("alt") || ""
  const linkText = linkTextEl?.textContent?.trim() || ""
  const bgColor = bgColorEl?.textContent?.trim() || "bg-gray-100"

  // Check if image exists
  const hasImage = imgSrc !== ""

  const bannerSection = div(
    {
      class: `${bgColor} py-10 flex items-center justify-between gap-8 max-w-[1200px] mx-auto rounded-md`,
    },

    // Content wrapper
    div(
      {
        class: `flex ${hasImage ? "flex-row items-center gap-16" : "flex-col items-start"} w-full`,
      },

      // Logo (only if image exists)
      hasImage
        ? img({
            src: imgSrc,
            alt: imgAlt,
            class: "h-16 w-auto shrink-0",
          })
        : null,

      // Text Block
      div(
        {
          class: `flex flex-col items-start ${hasImage ? "max-w-3xl" : "w-full"}`,
        },

        // Main Message
        p(
          {
            class: `text-2xl font-bold text-gray-900 leading-snug`,
          },
          title,
        ),
      ),
    ),

    // Discover Link (positioned differently based on image presence)
    linkText
      ? a(
          {
            href: "#",
            class: `text-sm text-violet-600 font-semibold flex items-center gap-1 hover:underline`,
          },
          linkText,
          span({
            class: "text-violet-600",
            textContent: "→",
          }),
        )
      : null,
  )

  block.innerHTML = ""
  block.appendChild(bannerSection)
}

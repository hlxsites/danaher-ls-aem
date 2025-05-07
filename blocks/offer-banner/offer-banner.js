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
      class: `${bgColor} py-10 px-6 md:px-24 flex items-center justify-between gap-8 max-w-[1200px] mx-auto rounded-md`,
    },

    div(
      {
        class: `flex ${hasImage ? "flex-row items-center gap-16" : "flex-col items-start"} w-full`,
      },

      hasImage &&
        img({
          src: imgSrc,
          alt: imgAlt,
          class: "h-16 w-auto shrink-0",
        }),

      div(
        {
          class: `flex flex-col items-start ${hasImage ? "max-w-3xl" : "w-full"}`,
        },

        p(
          {
            class: `text-2xl font-bold text-gray-900 leading-snug ${hasImage ? "pl-8" : ""}`,
          },
          title,
        ),
      ),
    ),

    linkText &&
      a(
        {
          href: "#",
          class: `text-sm ${hasImage ? "text-purple-700" : "text-indigo-600"} font-semibold ${hasImage ? "mt-4 pl-8 self-start" : ""} flex items-center gap-1 hover:underline`,
        },
        linkText,
        span({
          class: hasImage ? "text-purple-700" : "text-indigo-600",
          textContent: "→",
        }),
      ),
  )

  block.innerHTML = ""
  block.appendChild(bannerSection)
}

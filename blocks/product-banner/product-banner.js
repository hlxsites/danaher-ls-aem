import { div, span, img, p } from "../../scripts/dom-builder.js";

export default function decorate(block) {
  console.log("PROD block", block);

  const categoryHeading =
    block.querySelector('[data-aue-prop="heading"]')?.textContent || "";
  const linkText =
    block.querySelector('[data-aue-prop="button_text"]')?.textContent || "";
  const categoryDescription =
    block.querySelector('[data-aue-prop="short_desc"]')?.textContent || "";
  
  const details =
    block.querySelector('[data-aue-prop="long_desc"]')?.textContent || "";
  const detailsLink = "Read More";
  const image = block.querySelector("img");
  const alt = image?.getAttribute("alt") || "category image";
 console.log("categoryDescription",categoryDescription)
  const categoryBanner = div({
    class:
      "category_banner flex flex-col lg:flex-row self-stretch justify-start items-center",
  });

  const categoryBannerLeft = div({
    class:
      "category_banner-left mr-4 w-80 lg:w-[600px] pt-6 lg:pt-12 flex flex-col justify-start items-start",
  });

  const categoryBannerRight = div({
    class:
      "category_banner-right ml-4 w-80 lg:w-[600px] relative flex flex-col justify-start items-start",
  });

  const categoryBannerTitle = p(
    {
      class: "text-black text-4xl font-normal leading-[48px]",
    },
    categoryHeading
  );

  const categoryBannerCta = div(
    {
      class:
        "category_banner-cta flex flex-wrap justify-start items-start mb-4 mt-4",
    },
    div(
      {
        class:
          "px-6 py-3 bg-violet-600 rounded-[30px] shadow-md flex justify-center items-center overflow-hidden",
      },
      div(
        {
          class: "text-white text-base font-normal leading-snug",
        },
        linkText
      )
    )
  );

  const categoryBannerDescription = div(
    {
      class:
        "category_banner-description text-black-800 text-base font-extralight leading-snug",
    },
    categoryDescription
  );

  // const categoryBannerLinks = div(
  //   {
  //     class: "category_banner-links self-stretch flex flex-col mt-4",
  //   },
  //   ...links.map((text) =>
  //     div(
  //       {
  //         class: "text-violet-600 text-base font-bold leading-snug",
  //       },
  //       text
  //     )
  //   )
  // );

  const categoryBannerIcon = img({
    src: image?.src || "",
    alt,
    class: "h-[460px] object-contain",
  });

  const categoryBannerDetails = div(
    {
      class: "category_banner-details w-full justify-start",
    },
    span(
      {
        class:
          "text-black text-base font-extralight leading-snug line-clamp-6",
      },
      details
    ),
    span(
      {
        class:
          "text-violet-600 text-base font-bold leading-snug cursor-pointer",
        onclick: toggleDetails,
      },
      detailsLink
    )
  );

  categoryBannerLeft.append(
    categoryBannerTitle,
    categoryBannerCta,
    categoryBannerDescription,
    categoryBannerLinks
  );

  categoryBannerRight.append(categoryBannerIcon, categoryBannerDetails);

  categoryBanner.append(categoryBannerLeft, categoryBannerRight);
  console.log("categoryBanner", block, categoryBanner);
  block.innerHTML = "";
  block.appendChild(categoryBanner);

  // Line break
  const lineBr = div({
    class: "w-full h-px bg-gray-400 mt-10",
  });
  block.append(lineBr);
}

function toggleDetails(event) {
  const detailsText = event.target.previousElementSibling;
  const isCollapsed = detailsText.classList.contains("line-clamp-6");

  if (isCollapsed) {
    detailsText.classList.remove("line-clamp-6");
    event.target.textContent = "Read Less";
  } else {
    detailsText.classList.add("line-clamp-6");
    event.target.textContent = "Read More";
  }
}

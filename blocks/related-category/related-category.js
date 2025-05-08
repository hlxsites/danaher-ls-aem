  //Related categories
  const relatedCategories = [
    {
      title: "Recombinant Monoclonal",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/feature-section.png",
      linkText: "Browse All Products →",
    },
    {
      title: "Carrier Free Antibodies",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/aldevron-4c.png",
      linkText: "Browse All Products →",
    },
    {
      title: "Polyclonal Antibodies",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "/icons/HemoCue.png",
      linkText: "Browse All Products →",
    },
  ];
  
  
  const relatedCategoriesSection = div({
    class:
      "self-stretch flex flex-col lg:flex-row justify-start items-start gap-5 mt-12",
  });

  const leftTitle = div(
    {
      class:
        'w-72 text-black text-3xl font-normal font-["TWK_Lausanne_Pan"] leading-10',
    },
    "Related\nCategories"
  );

  const cardsContainer = div({
    class:
      "w-full flex flex-col lg:flex-row justify-end items-start gap-5 lg:gap-12",
  });

  relatedCategories.forEach((category) => {
    const categoryCard = div(
      {
        class:
          "w-full lg:w-72 min-h-96 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
      },
      img({
        class: "self-stretch h-40 relative",
        src: category.image,
        alt: category.title,
      }),
      div(
        {
          class: "self-stretch h-52 flex flex-col justify-between items-start",
        },
        div(
          {
            class:
              "self-stretch p-3 bg-white flex flex-col justify-start items-start gap-3",
          },
          div(
            {
              class:
                "self-stretch flex flex-col justify-start items-start gap-1",
            },
            div(
              {
                class:
                  "self-stretch flex flex-col justify-start items-start gap-2",
              },
              div(
                {
                  class:
                    "self-stretch flex flex-col justify-start items-start gap-3",
                },
                div(
                  {
                    class:
                      'self-stretch justify-start text-black text-xl font-normal font-["TWK_Lausanne_Pan"] leading-7',
                  },
                  category.title
                ),
                div(
                  {
                    class:
                      "self-stretch inline-flex justify-start items-center gap-3",
                  },
                  div(
                    {
                      class:
                        "flex-1 inline-flex flex-col justify-start items-start",
                    },
                    div(
                      {
                        class:
                          'self-stretch justify-start text-gray-700 text-base font-extralight font-["TWK_Lausanne_Pan"] leading-snug',
                      },
                      category.description
                    )
                  )
                )
              )
            )
          )
        ),
        div(
          {
            class:
              "self-stretch p-3 bg-white inline-flex justify-start items-center",
          },
          div(
            {
              class:
                'justify-start text-violet-600 text-base font-bold font-["TWK_Lausanne_Pan"] leading-snug',
            },
            category.linkText
          )
        )
      )
    );
    cardsContainer.append(categoryCard);
  });
  relatedCategoriesSection.append(leftTitle, cardsContainer);

  content.append(relatedCategoriesSection);

  import { div, span, a, img } from "../../scripts/dom-builder.js"

  export default async function decorate(block) {
    const relatedCategories = [
      {
        title: "Recombinant Monoclonal",
        description: "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
        image: "/icons/feature-section.png",
        linkText: "Browse All Products →",
      },
      {
        title: "Carrier Free Antibodies",
        description: "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
        image: "/icons/aldevron-4c.png",
        linkText: "Browse All Products →",
      },
      {
        title: "Polyclonal Antibodies",
        description: "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
        image: "/icons/HemoCue.png",
        linkText: "Browse All Products →",
      },
      {
        title: "Monoclonal Therapeutics",
        description: "Targeted solutions for therapeutic development and diagnostics.",
        image: "/icons/tertiary-antibody-image.svg",
        linkText: "Browse All Products →",
      },
      {
        title: "Custom Antibody Services",
        description: "Tailored antibody production to meet your research needs.",
        image: "/icons/custom-service.png",
        linkText: "Browse All Products →",
      },
    ]
    const container = div({ class: "related-categories-container w-full py-6" })
  
    const header = div({ class: "flex justify-between items-center mb-4" })
    const title = div({ class: "text-black text-xl font-medium" }, "Related Categories")
  
    const arrowGroup = div({ class: "flex items-center gap-3" })
    const prevDiv = div({ class: "carousel-prev-div w-10 h-10 cursor-pointer" })
    const nextDiv = div({ class: "carousel-next-div w-10 h-10 cursor-pointer" })
    arrowGroup.append(prevDiv, nextDiv)
  
    header.append(title, arrowGroup)
    container.append(header)
  
    // Outer wrapper to hide overflow and limit visible cards
    const cardsWrapper =div({
      class:
        "self-stretch flex flex-col lg:flex-row justify-start items-start gap-5 mt-12",
    });
  
    const cardsContainer = div({
      class:
        "w-full flex flex-col lg:flex-row justify-end items-start gap-5 lg:gap-12",
    });
  
    relatedCategories.forEach((category) => {
      const card = div({
        class:
          "w-72 min-h-96 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start flex-shrink-0",
      })
  
      const iconContainer = div(
        {
          class:
            "w-full lg:w-72 min-h-96 bg-white outline outline-1 outline-gray-300 flex flex-col justify-start items-start",
        },
        img({
          class: "self-stretch h-40 relative",
          src: category.image,
          alt: category.title,
        })
      )
  
      const cardTitle = div({ class: "text-black text-base font-medium mb-2" }, category.title)
      const description = div({ class: "text-gray-600 text-sm mb-4" }, category.description)
  
      const link = a({ href: "#", class: "text-violet-600 text-sm font-medium flex items-center" }, category.linkText)
  
      const arrowIcon = span({ class: "ml-1" })
      arrowIcon.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
      link.append(arrowIcon)
  
      card.append(iconContainer, cardTitle, description, link)
      cardsContainer.append(card)
    })
  
    cardsWrapper.append(cardsContainer)
    container.append(cardsWrapper)
  
    // Carousel logic
    const cards = Array.from(cardsContainer.children)
    let currentIndex = 0
    const cardsPerView = 4
    const cardWidth = 288 // card width (w-72 = 288px) + gap (16px)
  
    function updateCarousel() {
      const offset = currentIndex * cardWidth
      cardsContainer.style.transform = `translateX(-${offset}px)`
  
      // Update navigation buttons
      prevDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
          <path d="M18.3333 25L13.3333 20M13.3333 20L18.3333 15M13.3333 20L26.6667 20M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20Z"
          stroke="${currentIndex > 0 ? "#7523FF" : "#D1D5DB"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
  
      nextDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
          <path d="M21.6667 15L26.6667 20M26.6667 20L21.6667 25M26.6667 20L13.3333 20M35 20C35 28.2843 28.2843 35 20 35C11.7157 35 5 28.2843 5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20Z"
          stroke="${currentIndex + cardsPerView < cards.length ? "#7523FF" : "#D1D5DB"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    }
  
    prevDiv.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--
        updateCarousel()
      }
    })
  
    nextDiv.addEventListener("click", () => {
      if (currentIndex + cardsPerView < cards.length) {
        currentIndex++
        updateCarousel()
      }
    })
  
    updateCarousel()
    block.innerHTML = ""
    block.appendChild(container)
  }
  
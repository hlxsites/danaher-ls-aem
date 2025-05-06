import {
  div,
  h3,
  input,
  label,
  span,
  button,
  fieldset,
  ul,
  li,
  a,
  img,
  p,
} from "../../scripts/dom-builder.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

export default async function decorate(block) {

  console.log("PROD block", block, );
  //category section
  const heading = block.querySelector('[data-aue-prop="content_heading"]')?.textContent || '';
    const subHeading = block.querySelector('[data-aue-prop="content_heading1"]')?.textContent || '';
    const longDescription = block.querySelector('[data-aue-prop="content_heading2"]')?.textContent || '';
    const shortDescription = block.querySelector('[data-aue-prop="content_desc"]')?.textContent || '';
    const button1 = block.querySelector('[data-aue-prop="carousel_button1Text"]')?.textContent || '';
    const button2 = block.querySelector('[data-aue-prop="carousel_button2"]')?.textContent || '';
    const imageEl = block.querySelector('img[data-aue-prop="category_image"]');
    const altImage = imageEl?.getAttribute('alt') || 'category image';

  const categoryHeroBanner = [
    {
      categoryHeading: heading,
      linkText: subHeading,
      categoryDescription:longDescription,
      image: imageEl,
      alt: altImage,
      details:shortDescription,
      detailsLink: "Read More",
      links: [button1, button2],
    },
  ];

  categoryHeroBanner.forEach((banner) => {
    const {
      categoryHeading,
      categoryDescription,
      linkText,
      image,
      alt,
      details,
      detailsLink,
      links,
    } = banner;
  
    const categoryBanner = div({
      class:
        "category_banner flex flex-col lg:flex-row self-stretch justify-start items-center",
    });
  
    const categoryBannerLeft = div({
      class:
        "category_banner-left ml-4 w-80 lg:w-[600px] pt-6 lg:pt-12 flex flex-col justify-start items-start",
    });
  
    const categoryBannerRight = div({
      class:
        "category_banner-right mr-4 w-80 lg:w-[600px] relative flex flex-col justify-start items-start",
    });
  
    const categoryBannerTitle = p(
      {
        class:
          'text-black text-4xl font-normal  leading-[48px]',
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
            class:
              'text-white text-base font-normal  leading-snug',
          },
          linkText
        )
      )
    );
  
    const categoryBannerDescription = div(
      {
        class:
          'category_banner-description text-gray-800 text-base font-extralight  leading-snug',
      },
      categoryDescription
    );
  
    const categoryBannerLinks = div(
      {
        class: "category_banner-links self-stretch flex flex-col mt-4",
      },
      ...links.map((text) =>
        div(
          {
            class:
              'text-violet-600 text-base font-bold  leading-snug',
          },
          text
        )
      )
    );
  
    const categoryBannerIcon = img({
      src: image,
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
            'text-black text-base font-extralight  leading-snug',
        },
        details
      ),
      span(
        {
          class:
            'text-violet-600 text-base font-bold  leading-snug ml-2',
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
  
    block.append(categoryBanner);
  });
  
  //line break
  const lineBr = div({
    class: 'w-full h-px bg-gray-400 mt-10',
  });
  block.append(lineBr);
  
  const subProductData=[{
    subProductTitle: "Primary Antibodies",
    "subRead": "Read More",
    subProductDescription:
      "Our extensive primary antibody catalog features widely referenced monoclonal and polyclonal antibodies, along with an exceptional selection of recombinant monoclonal antibodies. Additionally, we provide a wide selection of fluorescently conjugated antibodies and carrier-free, conjugation-ready antibodies.",
  }]

  subProductData.forEach((banner) => {
    const {
      subProductTitle, subProductDescription, subRead,
    } = banner;
  // ---- Primary Antibodies Section ----
  const primaryAntibodies = div({
    class:
      "primary_antibodies self-stretch py-12 bg-white border-b border-gray-400 inline-flex flex-col justify-center items-start gap-12 overflow-hidden",
  });

  const primaryHeader = div({
    class:
      "primary_antibodies-header self-stretch flex flex-col justify-start items-start gap-5",
  });

  const primaryTitleWrapper = div(
    {
      class: "self-stretch inline-flex justify-start items-center gap-12",
    },
    div(
      {
        class:
          'flex-1 justify-start text-black text-3xl font-normal  leading-10',
      },
      subProductTitle
    )
  );

  const primaryDescription = div(
    {
      class: "self-stretch flex flex-col justify-start items-start gap-4",
    },
    div(
      {
        class: "self-stretch justify-start",
      },
      span(
        {
          class:
            'text-black text-base font-extralight  leading-snug',
        },
        subProductDescription
      ),
      span(
        {
          class:
            'text-violet-600 text-base font-bold  leading-snug',
        },
        subRead
      )
    )
  );

  primaryHeader.append(primaryTitleWrapper, primaryDescription);
  primaryAntibodies.append(primaryHeader);
  block.append(primaryAntibodies);
  });

  // feature

  const featureHighlight = {
    category: "Antibodies",
    title:
      "Anti-SARS-CoV-2 S antibody [EPR24852-116] - Human IgG1 (Chimeric) - BSA and Azide free(AB323002)",
    description:
      "Human Recombinant Monoclonal SPIKE antibody. Carrier free. Suitable for WB, I-ELISA and reacts with SARS-CoV-2 samples.",
    image: {
      src: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/feature-section.png",
      alt: "feature-section",
    },
    button: {
      text: "Learn More",
    },
  };
  
  const {
    category,
    title,
    description,
    image,
    button
  } = featureHighlight;
  
  const featureDiv = div({
    class: "flex flex-col lg:flex-row w-full mt-12",
  });
  
  const blackBoxSection = div(
    {
      class:
        "w-full lg:w-1/2 bg-black/5 flex flex-col justify-start items-start overflow-hidden",
    },
    span(
      {
        class: "w-full aspect-[2/1] origin-top-left",
      },
      img({
        src: image.src,
        alt: image.alt,
        class: "w-full h-full object-contain",
      })
    )
  );
  
  const violetSection = div(
    {
      class:
        "w-full lg:w-1/2 p-8 bg-violet-600 flex flex-col justify-center items-start gap-6",
    },
    div(
      {
        class: "w-full flex flex-col justify-start items-start gap-4",
      },
      div(
        {
          class:
            'text-white text-lg font-normal  leading-normal',
        },
        category
      ),
      div(
        {
          class:
            'text-white text-2xl font-normal  leading-loose',
        },
        title
      ),
      div(
        {
          class:
            'text-white text-base font-extralight  leading-snug',
        },
        description
      ),
      div(
        {
          class: "inline-flex justify-start items-start gap-4",
        },
        div(
          {
            dataState: "Hover",
            dataTheme: "Default",
            class:
              "px-6 py-3 bg-white rounded-[30px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex justify-center items-center overflow-hidden",
          },
          div(
            {
              class:
                'text-violet-600 text-base font-bold  leading-snug',
            },
            button.text
          )
        )
      )
    )
  );
  
  featureDiv.append(blackBoxSection, violetSection);
  block.append(featureDiv);
  
  //Related categories
  const relatedCategories = [
    {
      title: "Recombinant Monoclonal",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/feature-section.png",
      linkText: "Browse All Products →",
    },
    {
      title: "Carrier Free Antibodies",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/aldevron-4c.png",
      linkText: "Browse All Products →",
    },
    {
      title: "Polyclonal Antibodies",
      description:
        "Our capillary electrophoresis systems are designed to address your analytical needs and challenges.",
      image: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/HemoCue.png",
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
        'w-72 text-black text-3xl font-normal  leading-10',
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
                      'self-stretch justify-start text-black text-xl font-normal  leading-7',
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
                          'self-stretch justify-start text-gray-700 text-base font-extralight  leading-snug',
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
                'justify-start text-violet-600 text-base font-bold  leading-snug',
            },
            category.linkText
          )
        )
      )
    );
    cardsContainer.append(categoryCard);
  });
  relatedCategoriesSection.append(leftTitle, cardsContainer);

  block.append(relatedCategoriesSection);

  // Features, appln
  const data = {
    features: {
      title: "Key features of antibodies used for research",
      content: [
        "The centrifuge instrument delivers exceptional performance, ensuring precise and efficient separation for bioprocessing applications while maintaining high maximum speeds for industrial centrifugation needs.",
        "With a strong emphasis on quality and durability, our centrifuge equipment is built to withstand rigorous demands, providing reliable and long-lasting performance.",
        "We also emphasize sustainability in our centrifuge offerings, considering environmental factors in our design and manufacturing processes.",
        "Our centrifuge instruments are designed with user-friendly interfaces, making them easy to operate and maintain.",
        "Advanced safety features are integrated into our centrifuge equipment to ensure the protection of users and samples during operation.",
      ],
    },
    applications: {
      title: "Research-grade antibodies",
      content: [
        "The centrifuge instrument delivers exceptional performance, ensuring precise and efficient separation for bioprocessing applications while maintaining high maximum speeds for industrial centrifugation needs.",
        "With a strong emphasis on quality and durability, our centrifuge equipment is built to withstand rigorous demands, providing reliable and long-lasting performance.",
        "Our centrifuge instruments are versatile and can be used in various research applications, including cell culture, protein purification, and DNA extraction.",
        "The compact design of our centrifuge equipment allows for efficient use of laboratory space, making it ideal for both small and large research facilities.",
      ],
    },
    advantages: {
      title: "",
      content: [
        "High precision: Leica scientific microscopes are capable of precise measurements, making them valuable tools for applications such as live-cell imaging, 3D-cell-culture investigations, tissue screening, material-science and nanotechnology research.",
        "Non-destructive observation: Leica microscopes allow users to study a specimen without causing damage or altering its properties.",
        "Versatility: The different microscopes in our range can be used in various fields to study different types of samples and specimens, making them a versatile tool for research and discovery.",
        "Enhanced imaging capabilities: Leica microscopes offer advanced imaging features, including fluorescence and phase contrast, to provide detailed and accurate observations.",
        "User-friendly design: Leica microscopes are designed with intuitive controls and ergonomic features to enhance user comfort and efficiency during prolonged use.",
      ],
    },
  };
  const splitContentToLi = (contentArray) => {
    return contentArray.map((text) =>
      li({ class: "self-stretch justify-start" }, text)
    );
  };

  const productInfoFooter = div({
    class:
      "self-stretch flex flex-col justify-start items-start gap-12 pt-12 px-4 md:px-0",
  });

  const productInfoSections = [
    {
      productHeading:
        "Innovatively integrated solutions from Danaher engineering, science and technology leaders",
      productDescription: `Every day, scientists around the world are working to understand the causes of disease, 
  develop new therapies and vaccines and test new drugs. Danaher Life Sciences, a group of businesses 
  at Danaher Corporation, make this leading-edge scientific research possible. Our capabilities 
  extend beyond research to power the creation of biopharmaceuticals, cell and gene therapies 
  and other breakthrough treatments to advance patient health and improve treatment outcomes.`,
    },
  ];
  const { productHeading, productDescription } = productInfoSections[0];

  productInfoFooter.append(
    div({
      class: 'w-full h-px bg-gray-400 mt-10',
    }),
    div(
      { class: "self-stretch flex flex-col justify-start items-start gap-5" },
      div(
        {
          class:
            'self-stretch text-black text-3xl font-normal  leading-10',
        },
        productHeading
      ),
      div(
        {
          class:
            'self-stretch text-black text-xl font-extralight  leading-relaxed',
        },
        productDescription      
      )
    ),
    div({
      class: 'w-full h-px bg-gray-400',
    })
  );

  const sectionWrapper = ul({
    class: "w-full flex flex-col justify-start items-start gap-10",
  });

  Object.entries(data).forEach(([sectionKey, sectionData]) => {
    const sectionElement = li(
      {
        class:
          "self-stretch flex flex-col lg:flex-row justify-start items-start gap-6 mb-5",
      },

      div(
        {
          class:
            'w-full lg:w-96 justify-start text-black text-4xl  leading-[48px]',
        },
        sectionKey.toUpperCase()
      ),
      div(
        {
          class:
            "w-full lg:w-[921px] flex flex-col justify-start items-start gap-4",
        },
        div(
          {
            class:
              'self-stretch mt-2 text-black text-2xl font-bold  leading-snug',
          },
          sectionData.title
        ),
        ul(
          {
            class:
              'ml-10 self-stretch justify-start leading-8 list-disc text-xl font-normal text-black  leading-loose',
          },
          ...splitContentToLi(sectionData.content)
        )
      )
    );

    sectionWrapper.append(sectionElement);
  });

  productInfoFooter.append(sectionWrapper);
  block.append(productInfoFooter);
}

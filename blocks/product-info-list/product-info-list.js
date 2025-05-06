import {
    div,
    span,
  } from "../../scripts/dom-builder.js";
export default async function decorate(block) {
console.log('product-info-content.js',block);

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
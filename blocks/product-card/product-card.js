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
  const main = document.querySelector("main");
  const content = block.querySelector("div");

  const conjugatedSection = div({
    class: "flex flex-col w-full gap-6 bg-white p-8",
  });

const topSellingHeading = div(
  {
    class: "self-stretch flex-col justify-center items-start gap-6 inline-flex",
  },
  div(
    {
      class:
        "self-stretch px-8 py-6 bg-white border border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4",
    },
    div(
      {
        class: "flex flex-wrap sm:flex-nowrap items-center gap-4",
      },
      div(
        {
          class:
            "text-black text-xl font-bold font-['TWK_Lausanne_Pan'] leading-7 whitespace-nowrap",
        },
        "Top Selling Products"
      ),
      a(
        {
          href: "#",
          class:
            "text-violet-600 text-sm font-medium font-['TWK_Lausanne_Pan'] leading-tight hover:underline whitespace-nowrap",
        },
        "Browse 120 Products →"
      )
    ),
    div(
      {
        class: "flex items-center gap-3",
      },
      div({
        class: "carousel-prev-div p-2 rounded-full cursor-pointer",
      }),
      div({
        class: "carousel-next-div p-2 rounded-full cursor-pointer",
      })
    )
  )
);


  const createProductCard = ({
    tag,
    productName,
    productType,
    brand,
    price,
    imageUrl,
    sku,
    description,
    availability,
    unit,
    minQty,
    quantity,
  }) =>
    div(
      {
        class:
          "self-stretch outline outline-1 outline-gray-300 inline-flex justify-start items-center",
      },
      div(
        {
          class:
            "flex-1 self-stretch p-6 bg-white flex justify-start items-start gap-6",
        },
        div(
          {
            class:
              "w-24 inline-flex flex-col justify-start items-center gap-3",
          },
          div(
            {
              class:
                "self-stretch h-24 relative rounded-md outline outline-1 outline-offset-[-1px] outline-gray-900",
            },
            div({
              class:
                "w-24 h-24 left-0 top-0 absolute bg-white rounded-md",
            }),
            img({
              class:
                "w-24 h-24 left-0 top-0 absolute rounded-md border border-gray-200",
              src: imageUrl,
            })
          )
        ),
        div(
          {
            class: "self-stretch h-44 inline-flex flex-col justify-between items-start",
          },
          div(
            {
              class: "self-stretch flex flex-col justify-start items-start gap-3",
            },
            div(
              {
                class: "self-stretch flex flex-col justify-start items-start gap-1",
              },
              div(
                {
                  class: "self-stretch flex flex-col justify-start items-start gap-1",
                },
                tag &&
                  div(
                    {
                      class:
                        "px-4 py-1 bg-violet-50 inline-flex justify-center items-center gap-2.5",
                    },
                    div(
                      {
                        class:
                          "text-center justify-start text-violet-600 text-sm font-normal font-['TWK_Lausanne_Pan'] leading-tight",
                      },
                      tag
                    )
                  ),
                div(
                  {
                    class:
                      "self-stretch justify-start text-black text-xl font-normal font-['TWK_Lausanne_Pan'] leading-7",
                  },
                  productName
                )
              ),
              div(
                {
                  class: "self-stretch inline-flex justify-start items-center gap-3",
                },
                div(
                  {
                    class: "flex-1 inline-flex flex-col justify-start items-start",
                  },
                  div(
                    {
                      class:
                        "w-64 justify-start text-gray-700 text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
                    },
                    sku
                  )
                )
              )
            ),
            div(
              {
                class: "self-stretch inline-flex justify-start items-center gap-3",
              },
              div(
                {
                  class: "flex-1 inline-flex flex-col justify-start items-start",
                },
                div(
                  {
                    class:
                      "self-stretch justify-start text-gray-700 text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
                  },
                  description
                )
              )
            )
          ),
          div(
            {
              class:
                "self-stretch justify-start text-violet-600 text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
            },
            "View Details →"
          )
        )
      ),        
      div(
        {
          class:
            "self-stretch p-6 bg-gray-50 inline-flex flex-col justify-start items-end gap-4",
        },
        div(
          {
            class:
              "w-64 text-right justify-start text-black text-2xl font-normal font-['TWK_Lausanne_Pan'] leading-loose",
          },
          `$${price}`
        ),
        div(
          {
            class: "w-64 flex flex-col gap-2",
          },
          div(
            {
              class: "flex justify-between items-center",
            },
            div(
              {
                class: "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Availability:"
            ),
            div(
              {
                class: "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
              },
              `${availability} Available`
            )
          ),
          div(
            {
              class: "flex justify-between items-center",
            },
            div(
              {
                class: "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Unit of Measure:"
            ),
            div(
              {
                class: "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
              },
              `${unit}`
            )
          ),
          div(
            {
              class: "flex justify-between items-center",
            },
            div(
              {
                class: "text-black text-base font-extralight font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Min. Order Qty:"
            ),
            div(
              {
                class: "text-black text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
              },
              `${minQty}`
            )
          )
        ),        
        div(
          {
            class: "inline-flex justify-start items-center gap-3",
          },
          div(
            {
              class:
                "w-14 self-stretch px-4 py-1.5 bg-white rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-300 flex justify-center items-center overflow-hidden",
            },
            div(
              {
                class:
                  "justify-start text-black text-base font-normal font-['Inter'] leading-normal",
              },
              `${quantity}`
            )
          ),
          div(
            {
              class:
                "w-24 px-5 py-2 bg-violet-600 rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
            },
            div(
              {
                class:
                  "justify-start text-white text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Buy"
            )
          ),
          div(
            {
              class:
                "px-5 py-2 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-violet-600 flex justify-center items-center overflow-hidden",
            },
            div(
              {
                class:
                  "justify-start text-violet-600 text-base font-normal font-['TWK_Lausanne_Pan'] leading-snug",
              },
              "Quote"
            )
          )
        )
      )
      
    );

  const productList = div(
    {
      class: "w-full flex flex-col gap-6",
    },
    createProductCard({
      tag: "Carrier Free",
      productName: "Anti-FoxP3 Antibody (236A/E7) - BSA and Azide Free",
      productType: "Primary Antibody",
      brand: "eBioscience",
      price: "7,500.00",
      imageUrl: "https://placehold.co/100x100",
      sku: "00F-457-768N",
      description:
        "Our STED (stimulated emission depletion) heydhdj djdksm sjdjdkd kdskdkld technology joins the STELLARIS platform to provide you the...",
      availability: "78",
      unit: "1/Bundle",
      minQty: "50",
      quantity: "1",
    }),
    createProductCard({
      tag: "",
      productName: "Antshsjs asi-FoxP3 Antibody (236A/E7) - BSA and Azide Free",
      productType: "sec Antibody",
      brand: "hdjslms",
      price: "2,500.00",
      imageUrl: "https://placehold.co/100x100",
      sku: "01F-457-768N",
      description:
        "Our shajs djdjd STED (stimulated emission depletion) technology joins the STELLARIS platform to provide you the...",
      availability: "28",
      unit: "3/Bundle",
      minQty: "20",
      quantity: "2",
    })
  );

  conjugatedSection.append(topSellingHeading, productList);
  content.append(conjugatedSection);
}

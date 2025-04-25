import { div, button, input, span } from "../../scripts/dom-builder.js";

export const addProducts = () => {
  const productContainer = div(
    {
      class: "",
    },
    div(
      {
        class:
          "w-[683px] mt-12 justify-start text-black text-3xl font-normal font-['TWK_Lausanne_Pan'] leading-10",
      },
      "Want to add more products?"
    ),
    div(
      {
        class:
          "self-stretch justify-start text-black text-base font-extralight",
      },
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vestibulum semper mollis. Integer pharetra dui sed urna cursus, eu pretium tortor sodales. "
    ),
    div({
      class: "w-24 h-10 left-[63px] top-[57px]  bg-white",
    }),
    div(
      {
        class:
          "w-80 justify-start text-gray-700 text-base font-bold font-['TWK_Lausanne_Pan'] leading-snug",
      },
      "Search for a product"
    ),
    div({
      class: "w-10 h-4 left-[63px] top-[57px]  bg-white",
    }),
    div(
      {
        class: "inline-flex gap-2 bg-white",
      },
      div(
        {
          class:
            "w-[75px] h-10 px-6 border-solid border-2 rounded-md inline-flex justify-between items-center",
        },
        div(
          {
            class: "",
          },
          "🔍"
        ),
        div({
          class: "flex-1 justify-start text-gray-500 font-extralight text-base ",
         
           
        }, "Search by name or SKU ID")
      ),
      button(
        {
          class: "h-10 btn btn-lg font-medium btn-primary-purple rounded-full ",
        },
        "Get started"
      )
    ),

    div({
      class: "w-24 h-10 left-[63px] top-[57px]  bg-white",
    })
  );
  return productContainer;
};

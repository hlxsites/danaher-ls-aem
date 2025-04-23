import { div, button, hr } from "../../scripts/dom-builder.js";

export const price = () => {
  let userLoggedInStatus = true;
  const priceContainerWrapper = div({
    class: "inline-flex flex-col",
  });
  const priceContainer = div(
    {
      class: "inline-flex flex-col gap-4",
    },
    div(
      {
        class: "inline-flex justify-between",
      },
      div(
        {
          class: "text-black text-base font-bold ",
        },
        "Subtotal"
      ),
      div(
        {
          class: " text-right text-black text-base font-bold ",
        },
        "$5,657.49"
      )
    ),
    div(
      {
        class: "inline-flex justify-between",
      },
      div(
        {
          class: "text-black text-base",
        },
        "Discount"
      ),
      div(
        {
          class: " text-right text-black text-base",
        },
        "$434.34"
      )
    ),
    div(
      {
        class:
          "w-80 text-right justify-start text-gray-500 text-xs font-normal",
      },
      "10% off first order"
    ),
    div(
      {
        class: "inline-flex justify-between",
      },
      div(
        {
          class: "w-20 justify-start text-black text-base font-extralight",
        },
        "Sales Tax*"
      ),
      div(
        {
          class:
            "text-right justify-start text-indigo-300 text-sm font-normal font-['Inter'] underline leading-tight",
        },
        "Tax exempt?"
      ),
      div(
        {
          class:
            "w-40 text-right justify-start text-black text-base font-extralight",
        },
        "$92.60"
      )
    ),
    div(
      {
        class: "inline-flex justify-between",
      },
      div(
        {
          class: "text-black text-base",
        },
        "Shipping"
      ),
      div(
        {
          class: " text-right text-black text-base",
        },
        "$32.80"
      )
    ),
    div({
      class: "border-black-300",
    }),
    div(
      {
        class: "inline-flex justify-between",
      },
      div(
        {
          class:
            "w-40 justify-start text-black text-xl font-bold leading-relaxed",
        },
        "Total (3 items)"
      ),
      div(
        {
          class: "w-40 text-right justify-start text-black text-xl font-bold",
        },
        "$5287.47"
      )
    )
  );

  // const pricingTotal = div(
  //   {
  //     class: "inline-flex justify-between",
  //   },
  //   div(
  //     {
  //       class: "text-black text-base font-bold ",
  //     },
  //     "Subtotal"
  //   ),
  //   div(
  //     {
  //       class: " text-right text-black text-base font-bold ",
  //     },
  //     "$5,657.49"
  //   )

  // );
  // const discount = div(
  //   {
  //     class: "inline-flex justify-between",
  //   },
  //   div(
  //     {
  //       class: "text-black text-base",
  //     },
  //     "Discount"
  //   ),
  //   div(
  //     {
  //       class: " text-right text-black text-base",
  //     },
  //     "$434.34"
  //   )
  // );
  // const percentOff = div(
  //   {
  //     class: "w-80 text-right justify-start text-gray-500 text-xs font-normal",
  //   },
  //   "10% off first order"
  // );
  // const sales = div(
  //   {
  //     class: "inline-flex justify-between",
  //   },
  //   div(
  //     {
  //       class: "w-20 justify-start text-black text-base font-extralight",
  //     },
  //     "Sales Tax*"
  //   ),
  //   div(
  //     {
  //       class:
  //         "text-right justify-start text-indigo-300 text-sm font-normal font-['Inter'] underline leading-tight",
  //     },
  //     "Tax exempt?"
  //   ),
  //   div(
  //     {
  //       class:
  //         "w-40 text-right justify-start text-black text-base font-extralight",
  //     },
  //     "$92.60"
  //   )
  // );
  // const shipping = div(
  //   {
  //     class: "inline-flex justify-between",
  //   },
  //   div(
  //     {
  //       class: "text-black text-base",
  //     },
  //     "Shipping"
  //   ),
  //   div(
  //     {
  //       class: " text-right text-black text-base",
  //     },
  //     "$32.80"
  //   )
  // );

  const divider = hr({
    class: "w-80 border-black-300",
  });

  const total = div(
    {
      class: "inline-flex justify-between",
    },
    div(
      {
        class:
          "w-40 justify-start text-black text-xl font-bold leading-relaxed",
      },
      "Total (3 items)"
    ),
    div(
      {
        class: "w-40 text-right justify-start text-black text-xl font-bold",
      },
      "$5287.47"
    )
  );

  const checkoutButton = button(
    {
      class: "btn btn-lg font-medium btn-primary-purple rounded-full px-6",
    },
    "Checkout"
  );

  const disclaimer = div(
    {
      class:
        "w-80 justify-start text-gray-500 text-xs font-normal font-['TWK_Lausanne_Pan'] leading-none",
    },
    "*estimated sales tax. Additional tax may apply upon actual calculation of order"
  );

  const loggedOutUserDiv = div(
    {
      class: "inline-flex flex-col gap-4",
    },
    div(
      {
        class:
          "w-80 justify-start text-black text-3xl font-bold font-['TWK_Lausanne_Pan'] leading-10",
      },
      "Let’s get started"
    ),

    button(
      {
        class: "btn btn-primary-checkout rounded-full px-6",
      },
      "Login / Create Account"
    ),
    button(
      {
        class: "btn btn-outline-primary rounded-full px-6",
      },
      "Checkout as Guest"
    ),
    hr({
      class:"border-black-300"
    }),
    div({
      class:""
    })

  );

  // priceContainer.append(pricingTotal);
  // priceContainer.append(discount);
  // priceContainer.append(percentOff);
  // priceContainer.append(sales);
  // priceContainer.append(shipping);
  // priceContainer.append(divider);
  // priceContainer.append(total);
  if (userLoggedInStatus) {
    priceContainerWrapper.append(priceContainer);
    priceContainerWrapper.append(checkoutButton);    
  } else {
    priceContainerWrapper.append(loggedOutUserDiv);
    priceContainerWrapper.append(priceContainer);  
  }
  priceContainerWrapper.append(disclaimer);
  return priceContainerWrapper;
};

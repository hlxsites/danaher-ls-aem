import {
  div,
  h6,
  p,
  h2,
  a,
  img,
  h4,
  h1,
  button,
} from "../../scripts/dom-builder.js";

export default function decorate(block) {
  block.textContent = "";

  const mainDiv = div(
    {
      class: "flex justify-between items-start max-w-[1100px] mx-auto bg-white",
    },

    // LEFT SIDE
    div(
      { class: "p-2 w-[65%]" },

      // Order Submitted Block
      div(
        { class: "mb-5" },
        h1(
          { class: "text-[28px] font-bold text-black mb-1" },
          "Order Submitted"
        ),
        h2(
          { class: "text-[18px] font-normal text-gray-800 mb-2" },
          "Order number: DHR134578-8978"
        ),
        p(
          { class: "text-[14px] text-gray-600" },
          "Congratulations! Your order is submitted. Get ready for the excitement as we process your purchase."
        )
      ),

      // Shipping & Payment
      div(
        { class: "flex justify-between" },

        // Shipping Address
        div(
          {
            class:
              "border border-gray-300 p-4 w-1/2 bg-white mt-4 shadow-sm pl-2 text-sm",
          },
          p({ class: "text-[16px] font-bold mb-1" }, "Shipping address"),
          p({}, "ATTN: Barbara Smith"),
          p({}, "5300 Sciences Ave"),
          p({}, "San Francisco, CA 90228")
        ),

        // Payment
        div(
          {
            class:
              "border border-gray-300 p-4 w-[340px] bg-white mt-4 shadow-sm pl-2 text-sm",
          },
          p({ class: "text-[16px] font-bold mb-1" }, "Payment"),
          p({}, "Credit Card"),
          p({}, "**** **** **** 4242")
        )
      ),

      // Estimated & Notes
      div(
        { class: "flex justify-between items-start gap-[130px] mt-4" },

        // Estimated
        div(
          { class: "w-[340px]" },
          div(
            { class: "text-sm text-gray-700 space-y-1 mt-2" },
            h6({ class: "font-bold" }, "Estimated Shipping"),
            h6({}, "4-7 Days USPS Parcel Select Ground")
          ),
          div(
            { class: "text-sm text-gray-700 space-y-1 mt-2" },
            h6({ class: "font-bold" }, "Estimated Delivery"),
            h6({}, "April 4–11")
          )
        ),

        // Notes
        div(
          { class: "mt-4 w-[340px]" },
          div(
            { class: "text-sm text-gray-700 space-y-1" },
            h6({ class: "font-bold" }, "Notes"),
            h6(
              {},
              "This is the notes block to test. It contains data which is entered by user."
            )
          )
        )
      ),

      // Product list
      div(
        { class: "mt-6 space-y-4" },

        // Product 1
        div(
          {
            class: "flex gap-4 border border-gray-200 rounded-lg p-4 shadow-sm",
          },
          img({
            src: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/sciex-7500-system-beyond01-hero.avif",
            alt: "Neutral Capillary",
            class: "w-[60px] h-[60px] object-contain",
          }),
          div(
            { class: "flex flex-col" },
            h4(
              { class: "font-semibold text-[16px] text-black" },
              "Neutral Capillary 50 µm ID x 67 cm"
            ),
            p({ class: "text-[13px] text-gray-500 mt-1" }, "SKU-2762411"),
            p(
              { class: "text-[13px] text-gray-600 mt-2" },
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel dolor, ultricies velit."
            )
          )
        ),

        // Product 2
        div(
          {
            class: "flex gap-4 border border-gray-200 rounded-lg p-4 shadow-sm",
          },
          img({
            src: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/sciex-7500-system-beyond01-hero.avif",
            alt: "DNA Capillary",
            class: "w-[60px] h-[60px] object-contain",
          }),
          div(
            { class: "flex flex-col" },
            h4(
              { class: "font-semibold text-[16px] text-black" },
              "DNA Capillary"
            ),
            p({ class: "text-[13px] text-gray-500 mt-1" }, "SKU-2762417")
          )
        ),

        // Product 3
        div(
          {
            class: "flex gap-4 border border-gray-200 rounded-lg p-4 shadow-sm",
          },
          img({
            src: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/sciex-7500-system-beyond01-hero.avif",
            alt: "N-CHO Capillary",
            class: "w-[60px] h-[60px] object-contain",
          }),
          div(
            { class: "flex flex-col" },
            h4(
              { class: "font-semibold text-[16px] text-black" },
              "N-CHO Capillary"
            ),
            p({ class: "text-[13px] text-gray-500 mt-1" }, "SKU-2762413")
          )
        )
      )
    ),

    // RIGHT SIDEBAR
    div(
      {
        class:
          "w-[30%] text-left flex flex-col items-end pt-[50px] pr-[20px] mt-[100px]",
      },

      div(
        { class: "text-[14px] text-gray-500 mb-4 text-right" },
        div(
          { class: "text-sm text-gray-700 space-y-1" },
          h6({ class: "font-bold" }, "Stay Up to Date"),
          h6(
            {},
            "Stay informed about your recent orders by tracking them online."
          )
        )
      ),

      button(
        {
          class:
            "bg-[#1b2dd3] hover:bg-[#040f79] text-white font-bold rounded-full px-[30px] py-[12px] w-[250px] mt-2 transition-all",
        },
        "Track your orders"
      ),

      button(
        {
          class:
            "bg-transparent hover:bg-[#040f79] text-[#1b2dd3] hover:text-white font-bold rounded-full px-[30px] py-[12px] border-2 border-[#1b2dd3] w-[250px] mt-2 transition-all",
        },
        "Continue Shopping"
      )
    )
  );

  block.appendChild(mainDiv);
}

import { div, span, button } from "../../scripts/dom-builder.js";
import {
  changeStep,
  taxExemptModal,
  getCheckoutSummary,
  checkoutConfig,
} from "./checkoutUtilities.js";
// import  functions / modules from common utilities...
import { createModal } from "../../scripts/common-utils.js";

// generates the checkout summary module.......
export const checkoutSummary = async () => {
  // checkout config to use some predeinfed set of values
  const checoutConfigProps = checkoutConfig();

  // get price type if its net or gross....
  const checkoutPriceType = checoutConfigProps.data.pricing.priceType;

  //const currencyCode = checoutConfigProps.data.general.defaultCurrency;
  const currencyCode = "$";

  const checkoutSummaryData = getCheckoutSummary();

  const getTotalValue = (type) =>
    `${currencyCode}${
      checkoutSummaryData.data.totals[type][
        checkoutPriceType === "net" ? "net" : "gross"
      ].value
    }`;

  // map the data from checkout summary (basket) to the keys....
  const checkoutSummaryKeys = {
    totalProductQuantity: checkoutSummaryData.data.totalProductQuantity,
    undiscountedItemTotal: getTotalValue("undiscountedItemTotal"),
    itemTotal: getTotalValue("itemTotal"),
    undiscountedShippingTotal: getTotalValue("undiscountedShippingTotal"),
    shippingTotal: getTotalValue("shippingTotal"),
    total: getTotalValue("grandTotal"),
    tax: `${currencyCode} ${checkoutSummaryData.data.totals.grandTotal.tax.value}`,
    discounts: checkoutSummaryData.data.discounts ? "$77" : "0",
  };

  const summaryModule = div(
    {
      class: "  flex flex-col justify-start items-start gap-4 pt-6 mt-6",
    },
    div(
      {
        class: " flex flex-col justify-start items-start gap-6",
      },
      div(
        {
          class: " flex flex-col justify-start items-start gap-4",
        },
        div(
          {
            class:
              "checkout-summary-subtotal  flex justify-between w-full gap-9",
            id: "checkoutSummarySubtotal",
          },
          span(
            {
              class: " justify-start text-black text-base font-bold ",
            },
            "Subtotal"
          ),
          span(
            {
              class:
                " text-right justify-start text-black text-base font-bold ",
            },
            checkoutSummaryKeys.itemTotal
          )
        ),
        div(
          {
            class: "checkoutSummaryDiscount  flex justify-between w-full",
            id: "checkoutSummaryDiscount",
          },
          span(
            {
              class:
                " justify-start text-black text-base text-right font-extralight ",
            },
            "Discount"
          ),
          div(
            {
              class: " flex flex-col",
            },
            span(
              {
                class: "text-right text-black text-base font-extralight ",
              },
              checkoutSummaryKeys.discounts
            ),
            span(
              {
                class:
                  " w-80 text-right  text-gray-500 text-xs font-normal leading-none",
              },
              "10% off first order"
            )
          )
        ),
        div(
          {
            class: "checkoutSummaryTax  flex justify-between w-full gap-4",
            id: "checkoutSummaryTax",
          },
          div(
            {
              class: " flex justify-start items-start gap-4",
            },
            span(
              {
                class:
                  "w-20 justify-start text-black text-base font-extralight ",
              },
              "Sales Tax*"
            ),
            span(
              {
                id: "checkoutSummaryTaxExempt",
                class:
                  "text-right text-violet-600 text-sm cursor-pointer text-danaherpurple-500 hover:text-danaherpurple-800 font-normal underline",
              },
              "Tax exempt?"
            )
          ),
          span(
            {
              class:
                " text-right justify-start text-black text-base font-extralight ",
            },
            checkoutSummaryKeys.tax
          )
        ),
        div(
          {
            class:
              "checkout-summary-shipping flex justify-between w-full gap-4",
            id: "checkoutSummaryShipping",
          },
          span(
            {
              class: "w-20 justify-start text-black text-base font-extralight ",
            },
            "Shipping*"
          ),
          span(
            {
              class:
                " text-right justify-start text-black text-base font-extralight ",
            },
            checkoutSummaryKeys.shippingTotal
          )
        ),
        div({
          class: " flex justify-start items-start gap-9",
        })
      ),
      div(
        {
          class:
            "checkout-summary-total border-t justify-between flex w-full  border-gray-200 border-solid mb-4 pt-6",
          id: "checkoutSummaryTotal",
        },
        span(
          {
            class: " justify-start text-black text-xl font-bold ",
          },
          `Total (${checkoutSummaryKeys["totalProductQuantity"]} items)`
        ),
        span(
          {
            class: " text-right justify-start text-black text-xl font-bold ",
          },
          checkoutSummaryKeys.total
        )
      )
    ),
    div(
      {
        class: " flex flex-col justify-center w-full items-start gap-4",
      },
      button(
        {
          class:
            "proceed-button w-full text-white text-xl font-extralight btn btn-lg font-medium btn-primary-purple rounded-full px-6",
          id: "proceed-button",
          "data-tab": "shippingMethods",
        },
        "Proceed to Shipping"
      ),
      div(
        {
          class:
            "w-full justify-start text-black-500 text-xs font-normal leading-none",
        },
        "*estimated sales tax. Additional tax may apply upon actual calculation of order"
      )
    )
  );

  // button to change steps when clicked on proceed or step icon.....
  const proceedButton = summaryModule.querySelector("#proceed-button");
  proceedButton.addEventListener("click", function (e) {
    e.preventDefault();
    changeStep(this);
  });

  const showShippingModalButton =
    summaryModule.querySelector("#showShippingModal");
  if (showShippingModalButton) {
    showShippingModalButton.addEventListener("click", function (e) {
      e.preventDefault();
      const shippingFormModal = shippingAddressForm();
      createModal(shippingFormModal, true, false);
    });
  }
  if (summaryModule) {
    const checkoutSummaryTaxExempt = summaryModule.querySelector(
      "#checkoutSummaryTaxExempt"
    );
    if (checkoutSummaryTaxExempt) {
      checkoutSummaryTaxExempt.addEventListener("click", function () {
        const taxModal = taxExemptModal();
        createModal(taxModal, false, true);
      });
    }
  }
  return summaryModule;
};

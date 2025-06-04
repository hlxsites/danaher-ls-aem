import {
  div,
  span,
  p,
  h5,
  button,
  strong,
  hr,
} from "../../scripts/dom-builder.js";
import {
  addressForm,
  changeStep,
  taxExemptModal,
  getPromotionDetails,
  getBasketDetails,
  getUseAddresses,
} from "../../scripts/cart-checkout-utils.js";
import { getAuthenticationToken } from "../../scripts/token-utils.js";
/*
::::::::
 import  functions / modules from common utilities...
 :::::::::::::::::
 */
import {
  getStoreConfigurations,
  createModal,
} from "../../scripts/common-utils.js";

/*
 ::::::::::::::::
 store config to use some predefined set of rules/values
 :::::::::::::::::::::::::::::
 */
const storeConfigurations = await getStoreConfigurations();
/*
:::::::::::::::
get price type if its net or gross
....:::::::::::::::::::
*/
const checkoutPriceType = storeConfigurations?.pricing?.priceType ?? "net";
const currencyCode = "$";

/*
*
*
:::::::::::::::
 generates the checkout summary module.......
 ::::::::::::::::::
 *
 *
 */
export default async function checkoutSummary() {
  const getCheckoutSummaryData = await getBasketDetails();
  let discountCode = "";
  let discountLabelData = "";
  let discountDetails = "";
  let discountPromoCode = "";
  let discountLabel = "";
  let discountPrice = "";
  let checkoutSummaryData = false;
  if (getCheckoutSummaryData?.status === "success") {
    checkoutSummaryData = getCheckoutSummaryData.data.data;
    console.log("checkoutSummaryData", checkoutSummaryData);
    discountCode =
      getCheckoutSummaryData?.data?.data?.discounts?.valueBasedDiscounts?.[0] ??
      "";
    discountDetails =
      getCheckoutSummaryData?.data?.included?.discounts[`${discountCode}`] ??
      "";
    discountPromoCode = discountDetails?.promotion ?? "";
    discountLabelData = await getPromotionDetails(discountPromoCode);

    if (discountLabelData?.status === "success") {
      discountLabel = discountLabelData?.data?.name ?? "";
      discountPrice =
        discountDetails?.amount[`${checkoutPriceType}`]?.value ?? "";
    }
  }

  let userLoggedInStatus = false;
  const authenticationToken = await getAuthenticationToken();
  console.log("authenticationToken", authenticationToken);
  if (authenticationToken?.status === "error") {
    window.location.href =
      "/us/en/eds-stage-test/login.html?ref=feature-cart-checkout-summary";
    // return { status: 'error', data: 'Unauthorized access.' };
  }
  if (authenticationToken.access_token) {
    userLoggedInStatus = true;
  } else {
    userLoggedInStatus = false;
  }

  /*
::::::::::::::
 common function to get key value from checout summary object
 ::::::::::::::::::::::::::::
  */
  const getTotalValue = (type) => {
    const totalValue = `${
      checkoutSummaryData?.totals[type][
        checkoutPriceType === "net" ? "net" : "gross"
      ]?.value ?? ""
    }`;
    return totalValue > 0 ? `${currencyCode}${totalValue}` : "";
  };

  /*
  ::::::::::::::
  map the data from checkout summary (basket) to the keys.
  ::::::::::::::
  */
  const checkoutSummaryKeys = {
    totalProductQuantity: checkoutSummaryData?.totalProductQuantity || "$0",
    undiscountedItemTotal: checkoutSummaryData?.totals?.undiscountedItemTotal
      ? getTotalValue("undiscountedItemTotal")
      : "",
    itemTotal: checkoutSummaryData?.totals?.itemTotal
      ? getTotalValue("itemTotal")
      : "$0",
    undiscountedShippingTotal: checkoutSummaryData?.totals
      ?.undiscountedShippingTotal
      ? getTotalValue("undiscountedShippingTotal")
      : "",
    shippingTotal: checkoutSummaryData?.totals?.shippingTotal
      ? getTotalValue("shippingTotal")
      : "$0",
    total: checkoutSummaryData?.totals?.grandTotal
      ? getTotalValue("grandTotal")
      : "$0",
    tax: checkoutSummaryData?.totals?.grandTotal
      ? `${currencyCode} ${
          checkoutSummaryData?.totals?.grandTotal?.tax?.value ?? ""
        }`
      : "$0",
    discountPrice: discountPrice ? `${currencyCode}${discountPrice}` : "",
    discountLabel,
  };

  const loggedOutUserDiv = div(
    {
      class: "inline-flex flex-col gap-4",
    },
    div(
      {
        class: "w-80 justify-start text-black text-3xl font-bold  leading-10",
      },
      "Let’s get started"
    ),

    button(
      {
        class: "h-12 btn btn-lg btn-primary-purple rounded-full px-6",
      },
      "Login / Create Account"
    ),
    button(
      {
        class:
          "btn btn-outline-primary border-solid border-purple rounded-full px-6",
      },
      "Checkout as Guest"
    ),
    hr({
      class: "border-black-300",
    }),
    div({
      class: "",
    })
  );

  /*
  :::::::::::::
  generate checkout summary  module
  ::::::::::::::::::::::::::::::
  */
  const summaryModule = div(
    {
      class: "flex flex-col justify-start items-start gap-4",
    },
    div(
      {
        class: " flex flex-col justify-start items-start gap-y-6",
        id: "checkoutSummaryWrapper",
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
          /*
 ::::::::::::
 subtotal
 ::::::::::::::::::
   */ span(
            {
              class: " justify-start text-black text-base font-bold ",
            },
            "Subtotal"
          ),
          span(
            {
              class:
                " text-right flex flex-col justify-start text-black text-base font-bold ",
            },
            strong(
              {
                class: "",
              },
              checkoutSummaryKeys.itemTotal
            ),
            strong(
              {
                class:
                  "line-through decoration-danaherpurple-500 text-extralight font-normal",
              },
              checkoutSummaryKeys.undiscountedItemTotal !==
                checkoutSummaryKeys.itemTotal
                ? checkoutSummaryKeys.undiscountedItemTotal
                : ""
            )
          )
        ),
        /*
 ::::::::::::
 discount
 ::::::::::::::::::
   */ div(
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
              checkoutSummaryKeys.discountPrice
            ),
            span(
              {
                class:
                  " w-80 text-right  text-gray-500 text-xs font-normal leading-none",
              },
              checkoutSummaryKeys.discountLabel
            )
          )
        ),
        /*
 ::::::::::::
 sales tax
 ::::::::::::::::::
   */
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
        /*
 ::::::::::::
 shipping costs
 ::::::::::::::::::
   */ div(
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
                " text-right flex flex-col justify-start text-black text-base font-extralight ",
            },
            strong(
              {
                class: "",
              },
              checkoutSummaryKeys.shippingTotal
            ),
            strong(
              {
                class:
                  "line-through decoration-danaherpurple-500 text-extralight font-normal",
              },
              checkoutSummaryKeys.undiscountedShippingTotal !==
                checkoutSummaryKeys.shippingTotal
                ? checkoutSummaryKeys.undiscountedShippingTotal
                : ""
            )
          )
        )
      ),
      /*
 ::::::::::::
 total
 ::::::::::::::::::
   */
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
          `Total (${checkoutSummaryKeys.totalProductQuantity} items)`
        ),
        span(
          {
            class: " text-right justify-start text-black text-xl font-bold ",
          },
          checkoutSummaryKeys.total
        )
      )
    ),
    /*
 ::::::::::::
 proceed button
 ::::::::::::::::::
   */
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
        window.location.href.includes("cartlanding")
          ? "Proceed to Checkout"
          : "Proceed to Shipping"
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

  /*
 ::::::::::::
 button to change steps when clicked on proceed or step icon
 ::::::::::::::::::
   */
  const proceedButton = summaryModule.querySelector("#proceed-button");
  if (proceedButton) {
    proceedButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.location.href.includes("cartlanding")) {
        window.location.href =
          "/us/en/eds-stage-test/checkout.html?ref=feature-cart-checkout-summary";
      } else {
        changeStep(e);
      }
    });
  }
  const checkoutSummaryWrapper = summaryModule.querySelector(
    "#checkoutSummaryWrapper"
  );
  if (checkoutSummaryWrapper) {
    const getUseAddressesResponse = await getUseAddresses();

    if (getUseAddressesResponse) {
      /*
 ::::::::::::
 check if billing address exists in basket and not same as the shipping address
 ::::::::::::::::::
   */
      if (
        getUseAddressesResponse?.data?.invoiceToAddress &&
        getUseAddressesResponse?.data?.invoiceToAddress?.id !==
          getUseAddressesResponse?.data?.commonShipToAddress?.id
      ) {
        const invoiceToAddress = div(
          {
            id: "checkoutSummaryCommonBillToAddress",
            class:
              "flex-col w-full border-solid border-2 rounded border-gray-400 px-4 my-4",
          },
          div(
            {
              class: " flex flex-col pb-2",
            },
            h5(
              {
                class: "font-bold mb-2 mt-2",
              },
              "Bill to Address"
            ),
            h5(
              {
                class: "font-normal m-0",
              },
              getUseAddressesResponse?.data?.invoiceToAddress?.companyName2 ??
                ""
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              getUseAddressesResponse?.data?.invoiceToAddress?.addressLine1 ??
                ""
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              getUseAddressesResponse?.data?.invoiceToAddress?.city ?? ""
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              `${
                getUseAddressesResponse?.data?.invoiceToAddress?.mainDivision ??
                ""
              }, ${
                getUseAddressesResponse?.data?.invoiceToAddress?.countryCode ??
                ""
              }, ${
                getUseAddressesResponse?.data?.invoiceToAddress?.postalCode ??
                ""
              }`
            )
          )
        );
        if (invoiceToAddress) {
          if (window.location.href.includes("cartlanding")) {
            if (!userLoggedInStatus) {
              checkoutSummaryWrapper.insertAdjacentElement(
                "afterbegin",
                loggedOutUserDiv
              );
            } else {
              checkoutSummaryWrapper.insertAdjacentElement(
                "afterbegin",
                div({
                  class: "h-[0px]",
                })
              );
            }
          } else {
            checkoutSummaryWrapper.insertAdjacentElement(
              "afterbegin",
              invoiceToAddress
            );
          }
        }
      }
      /*
 ::::::::::::
 check if shipping address exists in basket
 ::::::::::::::::::
   */
      if (getUseAddressesResponse?.data?.commonShipToAddress) {
        const commonShipToAddress = div(
          {
            id: "checkoutSummaryCommonShipAddress",
            class:
              "flex-col w-full border-solid border-2 rounded border-gray-400 px-4",
          },
          div(
            {
              class: " flex flex-col pb-2",
            },
            h5(
              {
                class: "font-bold mb-2 mt-2",
              },
              "Shipping Address"
            ),
            h5(
              {
                class: "font-normal m-0",
              },
              getUseAddressesResponse?.data?.commonShipToAddress
                ?.companyName2 ?? ""
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              getUseAddressesResponse?.data?.commonShipToAddress
                ?.addressLine1 ?? ""
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              getUseAddressesResponse?.data?.commonShipToAddress?.city ?? ""
            ),
            p(
              {
                class: "text-black text-base font-extralight",
              },
              `${
                getUseAddressesResponse?.data?.commonShipToAddress
                  ?.mainDivision ?? ""
              }, ${
                getUseAddressesResponse?.data?.commonShipToAddress
                  ?.countryCode ?? ""
              }, ${
                getUseAddressesResponse?.data?.commonShipToAddress
                  ?.postalCode ?? ""
              }`
            )
          )
        );
        if (commonShipToAddress) {
          if (window.location.href.includes("cartlanding")) {
            if (!userLoggedInStatus) {
              checkoutSummaryWrapper.insertAdjacentElement(
                "afterbegin",
                loggedOutUserDiv
              );
            } else {
              checkoutSummaryWrapper.insertAdjacentElement(
                "afterbegin",
                div({
                  class: "h-[0px]",
                })
              );
            }
          } else {
            checkoutSummaryWrapper.insertAdjacentElement(
              "afterbegin",
              commonShipToAddress
            );
          }
        }
      }
    }
  }

  const showShippingModalButton =
    summaryModule.querySelector("#showShippingModal");
  if (showShippingModalButton) {
    showShippingModalButton.addEventListener("click", (e) => {
      e.preventDefault();
      const shippingFormModal = addressForm("shipping", "");
      createModal(shippingFormModal, true, false);
    });
  }
  if (summaryModule) {
    const checkoutSummaryTaxExempt = summaryModule.querySelector(
      "#checkoutSummaryTaxExempt"
    );
    if (checkoutSummaryTaxExempt) {
      checkoutSummaryTaxExempt.addEventListener("click", () => {
        const taxModal = taxExemptModal();
        createModal(taxModal, false, true);
      });
    }
  }
  return summaryModule;
}

export async function updateCheckoutSummary() {
  const checkoutSummaryWrapper = document.querySelector(
    "#checkoutSummaryWrapper"
  );
  if (checkoutSummaryWrapper) {
    const updatedCheckoutSummary = await checkoutSummary();

    checkoutSummaryWrapper.innerHTML = "";
    checkoutSummaryWrapper.append(updatedCheckoutSummary);
  }
}

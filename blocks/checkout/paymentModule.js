import {
  h2,
  h5,
  div,
  p,
  img,
  textarea,
  button,
} from "../../scripts/dom-builder.js";
import {
  getStoreConfigurations,
  removePreLoader,
  showPreLoader,
} from "../../scripts/common-utils.js";

import {
  getBasketDetails,
  getShippingMethods,
  setShippingMethod,
} from "../../scripts/cart-checkout-utils.js";
import { updateBasketDetails } from "../cartlanding/cartSharedFile.js";

/*
 :::::::::::::::
 generates the shipping address module for the checkout module/page
 ::::::::::::::
 */
const paymentModule = async () => {
  const storeConfigurations = await getStoreConfigurations();
  /*
  ::::::::::::::
  get price type if its net or gross.
  ::::::::::::::
  */
  let checkoutPriceType = "net";
  if (storeConfigurations.pricing?.priceType) {
    checkoutPriceType = storeConfigurations.pricing.priceType;
  }
  const currencyCode = "$";
  try {
    const moduleContent = div({});
    const moduleHeader = div(
      {
        class:
          "border-b relative border-black border-solid flex flex-col pt-6 pb-6 mb-4",
      },
      h2({}, "Choose your payment method"),
      p(
        {},
        "Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business."
      )
    );

    /*
  ::::::::::::::
  get current basket/cart details.
  ::::::::::::::
  */
    const getCurrentBasketDetails = await getBasketDetails();
    let basketShippingNotes = "";
    /*
  ::::::::::::::
  check if the shipping notes exists
  ::::::::::::::
  */
    if (
      getCurrentBasketDetails?.status === "success" &&
      getCurrentBasketDetails?.data?.data?.attributes
    ) {
    }
    moduleContent?.append(moduleHeader);

    return moduleContent;
  } catch (error) {
    return div(h5({ class: "text-red" }, "Error Loading Payment Module."));
  }
};

export default paymentModule;

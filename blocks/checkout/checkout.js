import { getAuthorization, getCommerceBase } from "../../scripts/commerce.js";
import { div } from "../../scripts/dom-builder.js";
import {
  submitForm,
  progressModule,
  initializeModules,
} from "./checkoutUtilities.js";

// intershop base url
const baseApiURL = getCommerceBase();

// autorization function to make the api calls
const authHeader = getAuthorization();

export default function decorate(block) {
  block.innerHtml = "";
  const main = document.querySelector("main");
  const content = block.querySelector("div");
  //content.parentNode.classList.add(..."px-6".split(" "));

  // Create container
  const checkoutWrapper = div({
    class: "checkout-wrapper w-full flex flex-col",
  });

  // Create container
  const hiddenContainer = div({
    class:
      "hidden shipping-address-list-item-actions border-r border-solid items-end",
  });
  checkoutWrapper.append(hiddenContainer);

  // Create Modules outer
  const modulesContent = div({
    class: "checkout-content flex gap-16 justify-center ",
  });

  // Create Modules container
  const modulesContainer = div({
    class: "checkout-modules-wrapper w-7/10",
  });

  const progressBar = progressModule();
  checkoutWrapper.appendChild(progressBar);
  // Append container to document body
  block.appendChild(checkoutWrapper);

  // initialize the shipping address, shipping methods and payment module at page load
  initializeModules()
    .then((modules) => {
      // Append modules to container
      modules.forEach((module) => {
        if (module.getAttribute("id") === "checkout-details") {
          const modulesContent = document.querySelector(".checkout-content");
          module.className = "";
          module.className = "checkout-summary-wrapper w-3/10";
          modulesContent.appendChild(module);
        } else {
          modulesContainer.appendChild(module);
        }
      });
      const saveShippingAddressButton = document.querySelector(
        "#saveShippingAddress"
      );
      saveShippingAddressButton.addEventListener("click", function () {
        submitForm("shippingAddressForm");
      });
    })
    .catch((error) => {
      console.error(`Error initializing modules: ${error}`);
    });

  modulesContent.append(modulesContainer);
  checkoutWrapper.append(modulesContent);
}

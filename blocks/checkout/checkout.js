import { getAuthorization, getCommerceBase } from "../../scripts/commerce.js";
import { div } from "../../scripts/dom-builder.js";
import {
  progressModule,
  initializeModules,
  shippingAddressList,
} from "./checkoutUtilities.js";
import { submitForm } from "../../scripts/common-utils.js";

export default function decorate(block) {
  block.innerHtml = "";

  // Create container
  const checkoutWrapper = div({
    class: "checkout-wrapper w-full flex flex-col mx-auto flex justify-between",
  });

  // Create hidden container
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
    })
    .catch((error) => {
      console.error(`Error initializing modules: ${error}`);
    });

  modulesContent.append(modulesContainer);
  checkoutWrapper.append(modulesContent);
}

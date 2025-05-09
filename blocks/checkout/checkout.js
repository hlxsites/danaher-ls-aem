import { div } from "../../scripts/dom-builder.js";
import { progressModule, initializeModules } from "./checkoutUtilities.js";

export default function decorate(block) {
  block.innerHtml = "";

  // Create container
  const checkoutWrapper = div({
    class: "checkout-wrapper w-full flex flex-col mx-auto flex justify-between",
  });

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
      return { status: "error", data: error.message };
    });

  modulesContent.append(modulesContainer);
  checkoutWrapper.append(modulesContent);
}

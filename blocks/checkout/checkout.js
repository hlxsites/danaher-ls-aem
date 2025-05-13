import { div } from "../../scripts/dom-builder.js";
import { progressModule, initializeModules } from "./checkoutUtilities.js";

export default function decorate(block) {
  showPreLoader();
  block.innerHtml = "";

  //:::::::::::::: Create container::::::::::::::
  const checkoutWrapper = div({
    class: "checkout-wrapper w-full flex flex-col mx-auto flex justify-between",
  });

  // ::::::::::::::Create Modules outer::::::::::::::
  const modulesContent = div({
    class: "checkout-content flex flex-col gap-16 justify-center  lg:flex-row",
  });

  // ::::::::::::::Create Modules container::::::::::::::
  const modulesContainer = div({
    class: "checkout-modules-wrapper w-7/10",
  });

  const progressBar = progressModule();
  checkoutWrapper.appendChild(progressBar);
  // ::::::::::::::Append container to document body::::::::::::::
  block.appendChild(checkoutWrapper);

  //:::::::::::::: initialize the shipping address, shipping methods and payment module at page load::::::::::::::
  initializeModules()
    .then((modules) => {
      // Append modules to container
      modules.forEach((module) => {
        if (module.getAttribute("id") === "checkout-details") {
          const modulesContent = document.querySelector(".checkout-content");
          module.className = "";
          module.className = "checkout-summary-wrapper flex justify-center";
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

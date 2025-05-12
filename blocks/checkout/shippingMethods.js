import {
  h2,
  h3,
  h5,
  span,
  div,
  p,
  img,
  textarea,
  button,
} from "../../scripts/dom-builder.js";
import {
  getStoreConfigurations,
  getBasketDetails,
  preLoader,
  removePreLoader,
  updateBasketDetails,
} from "../../scripts/common-utils.js";

import { getShippingMethods, setShippingMethod } from "./checkoutUtilities.js";

// ::::::::::::::generates the shipping address module for the checkout module/page::::::::::::::
export const shippingMethodsModule = async () => {
  const storeConfigurations = await getStoreConfigurations();
  // ::::::::::::::get price type if its net or gross.::::::::::::::
  let checkoutPriceType = "net";
  if (storeConfigurations.pricing?.priceType) {
    checkoutPriceType = storeConfigurations.pricing.priceType;
  }
  //const currencyCode = checoutConfigProps.data.general.defaultCurrency;
  const currencyCode = "$";
  try {
    const moduleContent = div({});
    const moduleHeader = div(
      {
        class:
          "border-b relative border-black border-solid flex flex-col pt-6 pb-6 mb-4",
      },
      h2({}, "Confirm your shipping method(s)"),
      p(
        {},
        "Your choice, your speed. Select your preferred shipping method. Have a special note thats okay add that to the notes field and we will do our best to facilitate."
      )
    );
    const moduleOpcos = div(
      {
        class:
          "flex items-center justify-between mb-[30px] border-b border-danaherpurple-100 border-solid pb-6 mb-9 mt-9",
      },
      div(
        {
          class: "flex",
        },
        img({
          src: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/sciex-4c.png",
        }),
        img({
          src: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/sciex-4c.png",
        })
      ),
      div({}, p({ class: "font-bold" }, "3 items"))
    );
    const moduleToggleButtonsWrapper = div(
      {
        class: "flex justify-between mt-[50px]",
      },
      div(
        {
          class: "flex gap-6 flex-col",
        },
        div(
          {
            class: "flex gap-6",
          },
          button(
            {
              class:
                "w-lg text-white text-l text-uppercase font-extralight btn btn-lg font-medium btn-primary-purple rounded-full px-6 m-0",
            },
            "Ship for me"
          ),
          button(
            {
              class:
                "m-0 text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium bg-white btn-outline-primary rounded-full px-6",
            },
            "Use my carrier"
          )
        ),
        p(
          {
            class: "w-full",
          },
          "Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business."
        )
      )
    );

    const getCurrentBasketDetails = await getBasketDetails();
    let basketShippingNotes = "";
    if (getCurrentBasketDetails?.data.attributes) {
      const getNotes = getCurrentBasketDetails.data.attributes[0];

      if (getNotes.name === "ShippingNotes") {
        basketShippingNotes = getNotes.value;
        console.log("current basket notes: ", basketShippingNotes);
      }
    }
    const modulesMethodsWrapper = div(
      { class: "flex-col gap-4 w-full" },
      div({
        id: "modulesMethodsItemsWrapper",
        class: "flex flex-wrap gap-4 my-6",
      }),
      div(
        {
          class: "my-6 flex flex-col gap-4",
        },
        p(
          {
            class: "text-extralight",
          },
          "Notes"
        ),
        textarea(
          {
            id: "shippingNotes",
            name: "notes",
            autocomplete: "off",
            "data-required": false,
            rows: "3",
            cols: "50",
            class:
              "input-focus text-base w-full block px-2 rounded py-4 font-extralight border border-solid border-gray-400",
            "aria-label": "notes",
            label: "Notes",
            placeholder: "Add a note",
            value: `${basketShippingNotes}`,
          },
          `${basketShippingNotes}`
        )
      )
    );
    if (moduleContent) {
      moduleHeader ? moduleContent.append(moduleHeader) : "";
      moduleOpcos ? moduleContent.append(moduleOpcos) : "";
      moduleToggleButtonsWrapper
        ? moduleContent.append(moduleToggleButtonsWrapper)
        : "";

      // ::::::::::::::get shipping bucket/methods with  id ::::::::::::::
      const shippingMethods = await getShippingMethods();
      /*    const shippingMethods = {
        data: [
          {
            attributes: [
              {
                name: "description",
                type: "String",
                value: "International Express Delivery",
              },
              {
                name: "displayName",
                type: "String",
                value: "International Express Delivery",
              },
              {
                name: "shortName",
                type: "String",
                value: "Int'l Express Delivery",
              },
            ],
            deliveryTimeMax: "P5D",
            deliveryTimeMin: "P3D",
            description: "International Express Delivery",
            digitalDelivery: false,
            id: "INT",
            name: "International Express Delivery",
            shippingCosts: {
              gross: {
                currency: "USD",
                value: 51.44,
              },
              net: {
                currency: "USD",
                value: 51.44,
              },
            },
            shippingInstructionsSupported: false,
            shortName: "Int'l Express Delivery",
          },
        ],
      }; */
      if (shippingMethods && shippingMethods.length > 0) {
        const modulesMethodsItemsWrapper = modulesMethodsWrapper.querySelector(
          "#modulesMethodsItemsWrapper"
        );

        if (modulesMethodsWrapper) {
          let highlightDefaultShippingMethod = "";
          let checkDefaultShippingMethod = "";

          if (getCurrentBasketDetails?.data.commonShippingMethod) {
            highlightDefaultShippingMethod = "border-danaherpurple-500";
            checkDefaultShippingMethod =
              getCurrentBasketDetails?.data.commonShippingMethod;
          }
          if (getCurrentBasketDetails) {
            const defaultShippingMethodIcon =
              '<svg class="absolute right-2 bottom-2" width="29" height="32" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.1543 16L13.1543 18L17.1543 14M23.1543 16C23.1543 20.9706 19.1249 25 14.1543 25C9.18373 25 5.1543 20.9706 5.1543 16C5.1543 11.0294 9.18373 7 14.1543 7C19.1249 7 23.1543 11.0294 23.1543 16Z" stroke="#7523FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            // :::::::::::::::::: generates shipping methods cards ::::::::::::::::::::::::::::::::::::::::
            shippingMethods.forEach((method) => {
              const methodData = div(
                {
                  id: method.id,
                  class: `flex relative flex-col shippingMethod gap-2 hover:border-danaherpurple-500  cursor-pointer max-w-[184px] border-solid border-2 rounded-lg border-gray-400 p-4 ${
                    method.id === checkDefaultShippingMethod
                      ? highlightDefaultShippingMethod
                      : ""
                  }`,
                },
                p(
                  {
                    class: "font-bold text-sm",
                  },
                  method.name || ""
                ),
                p(
                  {
                    class: "text-extralight text-sm",
                  },
                  method.description || ""
                ),
                p(
                  {
                    class: "text-extralight text-sm",
                  },
                  `${currencyCode}${
                    method.shippingCosts[
                      checkoutPriceType === "net" ? "net" : "gross"
                    ].value
                  }` || ""
                )
              );
              if (methodData) {
                if (defaultShippingMethodIcon) {
                  method.id === checkDefaultShippingMethod
                    ? methodData.insertAdjacentHTML(
                        "beforeend",
                        defaultShippingMethodIcon
                      )
                    : "";
                }
                modulesMethodsItemsWrapper?.append(methodData);
              }
            });
            if (modulesMethodsWrapper) {
              // :::::::::::::::::: attach event listener to set methods as default shipping method ::::::::::::::::::::::::::::::::::::::::
              modulesMethodsWrapper.addEventListener(
                "click",
                async function (event) {
                  event.preventDefault();
                  const selectedMethod = event.target.parentElement;
                  if (
                    selectedMethod &&
                    selectedMethod.classList.contains("shippingMethod")
                  )
                    if (selectedMethod?.id) {
                      selectedMethod.insertAdjacentElement(
                        "beforeend",
                        preLoader()
                      );
                      selectedMethod.parentElement.style.opacity = 0.5;
                      selectedMethod.parentElement.style.pointerEvents = "none";
                      const setShippingMethodResponse = await setShippingMethod(
                        selectedMethod.id
                      );
                      if (setShippingMethodResponse) {
                        let highlightShippingMethod = false;
                        if (setShippingMethodResponse.status !== "error") {
                          //  ::::::::::::::::::::::  update basket with selected shipping method :::::::::::::::::::::::::::::::
                          await updateBasketDetails();
                          const getAllShippingMethods =
                            modulesMethodsWrapper.querySelectorAll(
                              ".shippingMethod"
                            );
                          if (getAllShippingMethods) {
                            getAllShippingMethods.forEach((method) => {
                              if (
                                method.classList.contains(
                                  "border-danaherpurple-500"
                                )
                              ) {
                                method.classList.remove(
                                  "border-danaherpurple-500"
                                );
                              }
                              if (method.querySelector("svg")) {
                                method.querySelector("svg").remove();
                              }
                            });
                          }
                          highlightShippingMethod =
                            modulesMethodsWrapper.querySelector(
                              `#${setShippingMethodResponse}`
                            );

                          if (highlightShippingMethod) {
                            removePreLoader();
                            highlightShippingMethod.parentElement.removeAttribute(
                              "style"
                            );
                            highlightShippingMethod.classList.add(
                              "border-danaherpurple-500"
                            );
                            if (defaultShippingMethodIcon) {
                              highlightShippingMethod.insertAdjacentHTML(
                                "beforeend",
                                defaultShippingMethodIcon
                              );
                            }
                          }
                        } else {
                          removePreLoader();
                          modulesMethodsItemsWrapper?.removeAttribute("style");
                        }
                      }
                    }
                }
              );
            }
          }
        }
      }
      modulesMethodsWrapper ? moduleContent.append(modulesMethodsWrapper) : "";
    }

    return moduleContent;
  } catch (error) {
    return div(
      h5({ class: "text-red" }, "Error Loading Shipping Address Module.")
    );
  }
};

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
  createModal,
  getStoreConfigurations,
} from "../../scripts/common-utils.js";

import { getShippingMethods } from "./checkoutUtilities.js";
// prebuilt function to render icons based on the class used i.e: icon icon-search
import { decorateIcons } from "../../scripts/lib-franklin.js";

// generates the shipping address module for the checkout module/page........
export const shippingMethodsModule = async () => {
  const storeConfigurations = await getStoreConfigurations();
  // get price type if its net or gross....
  const checkoutPriceType = storeConfigurations.pricing.priceType;
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
        textarea({
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
        })
      )
    );
    if (moduleContent) {
      moduleHeader ? moduleContent.append(moduleHeader) : "";
      moduleOpcos ? moduleContent.append(moduleOpcos) : "";
      moduleToggleButtonsWrapper
        ? moduleContent.append(moduleToggleButtonsWrapper)
        : "";

      // get shipping bucket/methods with  id: 1240523576
      //const shippingMethods = await getShippingMethods("1240523576");
      const shippingMethods = {
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
      };
      //   if (shippingMethods && shippingMethods.status === "success") {
      const modulesMethodsItemsWrapper = modulesMethodsWrapper.querySelector(
        "#modulesMethodsItemsWrapper"
      );

      shippingMethods.data.forEach((method) => {
        if (modulesMethodsWrapper) {
          const methodData = div(
            {
              class:
                "flex-col border-solid border-2 rounded border-gray-400 p-4",
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
          modulesMethodsItemsWrapper?.append(methodData);
        }
      });
      // }
      modulesMethodsWrapper ? moduleContent.append(modulesMethodsWrapper) : "";
    }

    return moduleContent;
  } catch (error) {
    return div(
      h5({ class: "text-red" }, "Error Loading Shipping Address Module.")
    );
  }
};

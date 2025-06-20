import { h2, h5, div, p, img, input } from "../../scripts/dom-builder.js";

/*
 :::::::::::::::
 generates the shipping address module for the checkout module/page
 ::::::::::::::
 */
const paymentModule = async () => {
  /*
  ::::::::::::::
  get price type if its net or gross.
  ::::::::::::::
  */
  try {
    const moduleContent = div({});
    const moduleHeader = div(
      {
        class: "border-b relative flex flex-col pt-6 pb-6 mb-4",
      },
      h2({}, "Choose your payment method"),
      p(
        {},
        "Simplify your logistics by shipping with our trusted carrier. Enjoy competitive rates, real-time tracking, and reliable delivery for all your products. Let us handle the shipping while you focus on your business."
      )
    );

    const paymentMethodsWrapper = div({
      id: "paymentMethodsWrapper",
      class: "border-solid flex flex-col border-2 border-gray-300 w-full",
    });
    const paymentMethods = div(
      {
        class: "border-2 border-gray-300 flex flex-col",
      },
      div(
        {
          class: "flex px-4 py-3 w-full justify-between",
        },
        input({
          name: `creditCard`,
          type: "radio",
          id: `creditCard`,
        }),
        img({
          src: "icons/creditCards.png",
          class: "w-[176px]",
        })
      )
    );

    paymentMethodsWrapper?.append(paymentMethods);
    moduleContent?.append(moduleHeader, paymentMethodsWrapper);

    return moduleContent;
  } catch (error) {
    return div(h5({ class: "text-red" }, "Error Loading Payment Module."));
  }
};

export default paymentModule;

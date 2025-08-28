import { div } from "../../scripts/dom-builder.js";
export const customerInformation = (userOrderDetailsResponse) => {
    const custInfo = userOrderDetailsResponse.data.buyer;
    const shippinfInfo = userOrderDetailsResponse.included.commonShipToAddress;
    const billingInfo = userOrderDetailsResponse.included.invoiceToAddress;
    const shipObjKey = Object.keys(shippinfInfo)[0];
    const billObjKey = Object.keys(billingInfo)[0];
       const setAddressDetails = {
              companyName2:
                shippinfInfo[shipObjKey]
                  ?.companyName2 ?? '',
              addressLine1:
                shippinfInfo[shipObjKey]
                  ?.addressLine1 ?? '',
              city:
                shippinfInfo[shipObjKey]?.city ?? '',
              mainDivision:
                shippinfInfo[shipObjKey]
                  ?.mainDivision ?? '',
              countryCode:
                shippinfInfo[shipObjKey]
                  ?.countryCode ?? '',
              postalCode:
                shippinfInfo[shipObjKey]
                  ?.postalCode ?? '',
            };
        const setBillingAddressDetails = {
              addressLine1:
                billingInfo[billObjKey]
                  ?.addressLine1 ?? '',
              city:
                billingInfo[billObjKey]?.city ?? '',
              mainDivision:
                billingInfo[billObjKey]
                  ?.mainDivision ?? '',
              countryCode:
                billingInfo[billObjKey]
                  ?.countryCode ?? '',
              postalCode:
                billingInfo[billObjKey]
                  ?.postalCode ?? '',
            };
  const customerInformationWrapper = div({
    class:
      "w-[325px] self-stretch border border-solid border-gray-300 p-[20px] bg-white inline-flex flex-col justify-start items-start gap-6",
  });
  const customerInfoDiv = div(
    {
      class: "self-stretch flex flex-col justify-start items-start gap-3",
    },
    div(
      {
        class: "self-stretch flex flex-col justify-start items-start gap-3",
      },
      div(
        {
          class:
            "self-stretch h-10 border-b border-gray-300 flex flex-col justify-start items-start gap-2.5",
        },
        div(
          {
            class: "self-stretch inline-flex justify-start items-start gap-5",
          },
          div(
            {
              class:
                "justify-start text-black text-[20px] font-extralight  leading-relaxed",
            },
            "Customer Information"
          )
        )
      ),
      div(
        {
          class: "self-stretch flex flex-col justify-start items-start",
        },
        div(
          {
            class:
              "self-stretch justify-start text-black text-[14px] font-normal  leading-tight",
          },
          "Name"
        ),
        div(
          {
            class:
              "self-stretch justify-start text-black text-[16px] font-bold  leading-snug",
          },
          `${custInfo.firstName + " " + custInfo.lastName}`
        )
      ),
      div(
        {
          class: "self-stretch flex flex-col justify-start items-start",
        },
        div(
          {
            class:
              "self-stretch justify-start text-black text-[14px] font-normal  leading-tight",
          },
          "Email"
        ),
        div(
          {
            class:
              "self-stretch justify-start text-black text-[16px] font-bold  leading-snug",
          },
          `${custInfo.email}`
        )
      ),
      div(
        {
          class: "self-stretch flex flex-col justify-start items-start",
        },
        div(
          {
            class:
              "self-stretch justify-start text-black text-[14px] font-normal  leading-tight",
          },
          "Contact Number"
        ),
        div(
          {
            class:
              "self-stretch justify-start text-black text-[16px] font-bold  leading-snug",
          },
          "-"
        )
      )
    )
  );
  const shippingInfoDiv = div(
    {
      class: "self-stretch flex flex-col justify-start items-start gap-3",
    },
    div(
      {
        class: "self-stretch flex flex-col justify-start items-start gap-3",
      },
      div(
        {
          class:
            "self-stretch h-10 border-b border-gray-300 flex flex-col justify-start items-start gap-2.5",
        },
        div(
          {
            class: "self-stretch inline-flex justify-start items-start gap-5",
          },
          div(
            {
              class:
                "justify-start text-black text-[20px] font-extralight leading-relaxed",
            },
            "Shipping Address"
          )
        )
      ),
      div(
        {
          class: "self-stretch flex flex-col justify-start items-start",
        },
        div(
          {
            class:
              "self-stretch justify-start text-black text-[14px] font-normal leading-tight",
          },
          "Address"
        ),
        div(
          {
            class:
              "self-stretch justify-start text-black text-[16px] font-bold leading-snug",
          },
          setAddressDetails.companyName2, ", ", " ", setAddressDetails.addressLine1, ", ", " ", setAddressDetails.city, ", ", " ",
          setAddressDetails.mainDivision,", ",  " ", setAddressDetails.countryCode, ", ", " ", setAddressDetails.postalCode
        )
      )
    )
  );
  const billingInfoDiv = div(
    {
      class: "self-stretch flex flex-col justify-start items-start gap-3",
    },
    div(
      {
        class:
          "self-stretch h-10 border-b border-gray-300 flex flex-col justify-start items-start gap-2.5",
      },
      div(
        {
          class: "self-stretch inline-flex justify-start items-start gap-5",
        },
        div(
          {
            class:
              "justify-start text-black text-[20px] font-extralight leading-relaxed",
          },
          "Billing Address"
        )
      )
    ),
    div(
      {
        class: "self-stretch flex flex-col justify-start items-start",
      },
      div(
        {
          class:
            "self-stretch justify-start text-black text-[14px] font-normal leading-tight",
        },
        "Address"
      ),
      div(
        {
          class:
            "self-stretch justify-start text-black text-[16px] font-bold leading-snug",
        },
         setBillingAddressDetails.addressLine1, ", ", " ", setBillingAddressDetails.city, ", ", " ",
          setBillingAddressDetails.mainDivision,", ",  " ", setBillingAddressDetails.countryCode, ", ", " ", setBillingAddressDetails.postalCode
      )
    )
  );
  customerInformationWrapper.append(customerInfoDiv);
  customerInformationWrapper.append(shippingInfoDiv);
  customerInformationWrapper.append(billingInfoDiv);
  return customerInformationWrapper;
};

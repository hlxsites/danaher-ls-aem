import { div } from "../../scripts/dom-builder.js";
export const requesterInformation = (quoteDetailsResponse) => {
    const custInfo = quoteDetailsResponse.address;
   
  const requesterInformationWrapper = div({
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
            "self-stretch h-10 border-b-2 border-dashed border-gray-300 flex flex-col justify-start items-start gap-2.5",
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
            "Requester Information"
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
          `${quoteDetailsResponse.email}`
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
  
  requesterInformationWrapper.append(customerInfoDiv);
  return requesterInformationWrapper;
};

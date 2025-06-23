import {
  div, button,
} from '../../scripts/dom-builder.js';
import { submitSearchQuery } from "../header/header.js";

export default function addProducts() {
  
     
  const searchBlock = div(
    {
      class:
        "w-full py-12 px-0 inline-flex justify-start gap-5",
    },
    div(
      {
        class: "w-[450px] inline-flex flex-col justify-start items-start gap-4",
      },
      div(
        {
          class: "justify-start text-black text-3xl font-normal",
        },
        "Want to add more products?"
      ),
      div(
        {
          class: "justify-start text-black text-base font-extralight",
        },
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vestibulum semper mollis. Integer pharetra dui sed urna cursus, eu pretium tortor sodales. "
      )
    ),
    div(
      {
        class: "inline-flex flex-col justify-start items-start",
      },
      div(
        {
          class: "w-px h-20 flex flex-col justify-end items-start gap-4",
        },
        div(
          {
            class: "w-80 justify-start text-gray-700 text-base font-bold",
          },
          "Search for a product"
        ),
        div(
          {
            class: "inline-flex justify-start items-start gap-4",
          },
          div(
            {
              class:
                "w-[455px] px-3 py-3 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-600 flex justify-start items-center gap-2 overflow-hidden",
            },
            div({}), //modal search
            div(
              {
                class:
                  "justify-start text-gray-500 text-base font-normal font-['Inter'] leading-normal",
              },
              "Search by name and SKU ID"
            )
          ),
          div({
          class:"w-36 self-stretch px-6 py-3"
        },
      button(
        {
          class: "h-10 btn btn-lg font-medium btn-primary-purple rounded-full m-0",
        },
        "Search"
      ))
        ),
        
      )
    )
  );
  searchBlock
    ?.querySelector("button")
    ?.addEventListener("click", function () {
      const searchValue = {
        value:"dmi"
      }
      submitSearchQuery(searchValue, "searchboxSubmit");
      
    });
  return searchBlock;
}

import { div, h1, p, span } from "../../scripts/dom-builder.js";
import {
  showPreLoader,
  removePreLoader,
  capitalizeFirstLetter,
} from "../../scripts/common-utils.js";
import { getAuthenticationToken } from "../../scripts/token-utils.js";
const siteID = window.DanaherConfig?.siteID;
const hostName = window.location.hostname;
let env;
if (hostName.includes("local")) {
  env = "local";
} else if (hostName.includes("dev")) {
  env = "dev";
} else if (hostName.includes("stage")) {
  env = "stage";
} else {
  env = "prod";
}
export default async function decorate(block) {
  showPreLoader();
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  document.querySelector("main").style = "background: #f4f4f4";
  const authenticationToken = await getAuthenticationToken();
  let userData = {};
  if (authenticationToken?.status === "error") {
  } else {
    userData = JSON.parse(authenticationToken.user_data);
  }

  const dashboardTitle = block.querySelector(
    "[data-aue-prop='dashboardTitle']"
  );

  const wrapper = div({
    id: "dashboardWrapper",
    class:
      "flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:py-12",
  });
  const sidebar = div(
    {
      id: "dashboardSidebar",
      class: "bg-white gap-5 p-6 w-full md:w-[20%] flex flex-col items-center",
    },
    div({
      class:
        "h-[131px] w-full bg-danaherpurple-800 justify-center  flex flex-col items-center",
    }),
    div(
      {
        class:
          "h-[100px] w-[100px] mt-[-75px] border-2 bg-danaherpurple-500 border-white rounded-full flex items-center justify-center",
      },
      p(
        {
          class: "text-white !text-4xl font-medium leading-[48px]",
        },
        userData?.userData?.firstName?.charAt(0).toUpperCase(),
        userData?.userData?.lastName?.charAt(0).toUpperCase()
      )
    ),
    p(
      {
        class: "text-xl text-black font-medium leading-7",
      },
      capitalizeFirstLetter(userData?.userData?.firstName) +
        " " +
        capitalizeFirstLetter(userData?.userData?.lastName)
    ),
    p(
      {
        class: "text-sm text-black font-medium leading-tight",
      },
      capitalizeFirstLetter(userData?.customerData?.companyName)
    )
  );
  const content = div(
    {
      id: "dashboardContent",
      class: "flex p-6 pt-0 w-full flex-col gap-5 md:w-[80%]",
    },
    h1(
      {
        class: "p-0 m-0",
      },
      dashboardTitle ?? ""
    ),
    div(
      {
        class: "flex ",
      },
      div(
        {
          class: "bg-white flex gap-4",
        },
        span(
          {
            class: "icon",
          },
          "icon"
        ),
        div(
          {
            class: "flex flex-col",
          },
          p(
            {
              class: "text-black",
            },
            "14"
          ),
          p(
            {
              class: "text-black",
            },
            "Open Order"
          )
        )
      ),
      div(
        {
          class: "bg-white flex gap-4",
        },
        span(
          {
            class: "icon",
          },
          "icon"
        ),
        div(
          {
            class: "flex flex-col",
          },
          p(
            {
              class: "text-black",
            },
            "25"
          ),
          p(
            {
              class: "text-black",
            },
            "Requested Quote Item"
          )
        )
      )
    )
  );

  wrapper.append(sidebar, content);

  block.append(wrapper);
  removePreLoader();
}

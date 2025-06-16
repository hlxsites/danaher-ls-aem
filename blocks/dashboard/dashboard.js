import { div, h1, p } from "../../scripts/dom-builder.js";
import { showPreLoader, removePreLoader } from "../../scripts/common-utils.js";
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
  document.querySelector("main")?.classList.add("bg-gray-100");
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
    class:
      "flex flex-col gap-5 md:flex-row w-full dhls-container lg:px-10 dhlsBp:p-0 items-center",
  });
  const sidebar = div(
    {
      class: "bg-white p-6 w-full md:w-[20%] flex flex-col items-center",
    },
    div({
      class:
        "h-[131px] w-full bg-danaherpurple-800 justify-center  flex flex-col items-center",
    }),
    div(
      {
        class:
          "h-[100px] w-[100px] border-2 border-white rounded-full flex items-center justify-center",
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
      userData?.userData?.firstName + " " + userData?.userData?.lastName
    ),
    p(
      {
        class: "text-sm text-black font-medium leading-tight",
      },
      userData?.customerData?.companyName
    )
  );
  const content = div(
    {
      class: "bg-white flex items-center p-6 w-full md:w-[80%]",
    },
    h1({}, dashboardTitle ?? "")
  );

  wrapper.append(sidebar, content);

  block.append(wrapper);
  removePreLoader();
}

import { div, button } from "../../scripts/dom-builder.js";
import { userLogin } from "../../scripts/auth-utils.js";
import { preLoader, removePreLoader } from "../../scripts/common-utils.js";
export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  const loginWrapper = div({
    class:
      "dhls-container px-5 lg:px-10 dhlsBp:p-0 mb-12 bg-danaher-purple-100 p-12 flex items-center justify-center",
  });
  const loginButton = button(
    {
      class: "mt-8 w-[100px] z-10 right-0 top-[50px] absolute",
      id: "tempLoginButton",
    },
    "Login"
  );
  loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    loginButton.insertAdjacentElement("beforeend", preLoader());
    const loginResponse = await userLogin("customer");
    if (loginResponse && loginResponse.status !== "error") {
      removePreLoader();
      return true;
    }
    return false;
  });
  loginWrapper.append(loginButton);
  block.innerHtml = "";
  block.append(loginWrapper);
}

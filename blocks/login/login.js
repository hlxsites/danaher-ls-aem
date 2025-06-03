import { button } from "./dom-builder.js";
import { loginUser } from "../../scripts/auth-utils.js";
import { preLoader, removePreLoader } from "../../scripts/common-utils.js";
export async function decorate(block) {
  const loginWrapper = div({
    class:
      "dhls-container bg-danaher-purple-100 p-12 flex items-center justify-center",
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
    const loginResponse = await loginUser("customer");
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

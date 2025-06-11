import { div, button, h1, h2, p, h3, form } from "../../scripts/dom-builder.js";
import { userLogin } from "../../scripts/auth-utils.js";
import {
  removePreLoader,
  showPreLoader,
  buildInputElement,
  buildButton,
} from "../../scripts/common-utils.js";

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  console.log("login block: ", block);

  const loginHeading = block.querySelector("[data-aue-prop='loginHeading']");
  const loginSubHeading = block.querySelector(
    "[data-aue-prop='loginSubHeading']"
  );
  const loginFormTitle = block.querySelector(
    "[data-aue-prop='loginFormTitle']"
  );
  const loginFormSubHeading = block.querySelector(
    "[data-aue-prop='loginFormSubHeading']"
  );
  const loginFormEmailLabel = block.querySelector(
    "[data-aue-prop='loginFormEmailLabel']"
  );
  const loginFormPasswordLabel = block.querySelector(
    "[data-aue-prop='loginFormPasswordLabel']"
  );
  const loginFormCheckboxText = block.querySelector(
    "[data-aue-prop='loginFormCheckboxText']"
  );
  const loginFormForgotPasswordLabel = block.querySelector(
    "[data-aue-prop='loginFormForgotPasswordLabel']"
  );
  const loginFormForgotPasswordLink = block.querySelector(
    "[data-aue-prop='loginFormForgotPasswordLink']"
  );
  const loginFormSubmitButtonLabel = block.querySelector(
    "[data-aue-prop='loginFormSubmitButtonLabel']"
  );
  const loginFormNewAccountText = block.querySelector(
    "[data-aue-prop='loginFormNewAccountText']"
  );
  const loginFormNewAccountButtonLabel = block.querySelector(
    "[data-aue-prop='loginFormNewAccountButtonLabel']"
  );
  const loginFormNewAccountButtonLink = block.querySelector(
    "[data-aue-prop='loginFormNewAccountButtonLink']"
  );
  const backgroundImage = block.querySelector(
    "[data-aue-prop='backgroundImage']"
  );

  // object to map data with html

  const contentObject = {
    loginHeading:
      loginHeading?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    loginSubHeading:
      loginSubHeading?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    loginFormTitle:
      loginFormTitle?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    loginFormSubHeading:
      loginFormSubHeading?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    loginFormEmailLabel:
      loginFormEmailLabel?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    loginFormPasswordLabel:
      loginFormPasswordLabel?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    loginFormCheckboxText: loginFormCheckboxText?.textContent.trim() || "",
    loginFormForgotPasswordLabel:
      loginFormForgotPasswordLabel?.textContent
        .trim()
        .replace(/<[^>]*>/g, "") || "",
    loginFormForgotPasswordLink:
      loginFormForgotPasswordLink?.textContent.trim().replace(/<[^>]*>/g, "") ||
      "",
    loginFormSubmitButtonLabel:
      loginFormSubmitButtonLabel?.textContent.trim().replace(/<[^>]*>/g, "") ||
      "",
    loginFormNewAccountText:
      loginFormNewAccountText?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    loginFormNewAccountButtonLabel:
      loginFormNewAccountButtonLabel?.textContent
        .trim()
        .replace(/<[^>]*>/g, "") || "",
    loginFormNewAccountButtonLink:
      loginFormNewAccountButtonLink?.textContent
        .trim()
        .replace(/<[^>]*>/g, "") || "",
    loginFormNewAccountButtonLink:
      loginFormEmailLabel?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    backgroundImage:
      backgroundImage?.src ??
      "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble",
  };
  console.log("content object:L ", contentObject);

  const contentWrapper = div(
    {
      class: "items-center flex flex-col w-full md:w-1/2 p-8",
    },
    h2(
      {
        class: "text-black text-4xl font-medium leading-[48px]",
      },
      contentObject.loginHeading
    ),
    p(
      {
        class: "text-black text-2xl font-medium leading-loose",
      },
      contentObject.loginSubHeading
    )
  );
  const loginForm = form(
    {
      id: `loginForm`,
      class: `text-sm w-full max-w-xl box-border overflow-hidden rounded-xl`,
      action: "",
      method: "POST",
    },
    div(
      {
        class: "form-title flex  gap-2",
      },
      h3(
        {
          class: "justify-start text-black text-2xl font-normal  leading-loose",
        },
        contentObject.loginFormTitle
      )
    ),
    buildInputElement(
      "userName",
      contentObject.loginFormEmailLabel,
      "text",
      "userName",
      false,
      true,
      "userName",
      ""
    ),
    buildInputElement(
      "password",
      contentObject.loginFormPasswordLabel,
      "text",
      "password",
      false,
      true,
      "password",
      ""
    ),
    buildButton(
      contentObject.loginFormSubmitButtonLabel,
      `login`,
      "proceed-button text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6"
    )
  );
  const formWrapper = div(
    {
      class: "flex flex-col items-center gap-8 w-full p-8 md:w-1/2",
    },
    h1({
      class: "text-4xl font-medium text-black leading-[48px] m-0 p-0",
    })
  );
  formWrapper.append(loginForm);
  const loginButton = button(
    {
      class: " w-[100px]",
      id: "tempLoginButton",
    },
    "Login"
  );
  loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    showPreLoader();
    const loginResponse = await userLogin("customer");
    if (loginResponse && loginResponse.status !== "error") {
      removePreLoader();
      return true;
    }
    return false;
  });
  const loginOuter = div({
    class: "h-screen w-screen  bg-cover bg-no-repeat flex items-center",
    style: `background-image: url(${contentObject.backgroundImage});`,
  });
  const loginWrapper = div({
    class:
      "dhls-container px-5 lg:px-10 dhlsBp:p-0 mb-12 bg-danaher-purple-100 flex items-center gap-5 justify-center flex-col md:flex-row",
  });
  loginWrapper.append(contentWrapper, formWrapper);
  loginOuter.append(loginWrapper);
  block.innerHtml = "";
  block.textContent = "";
  block.append(loginOuter);
}

import { div, button } from "../../scripts/dom-builder.js";
import { userLogin } from "../../scripts/auth-utils.js";
import { removePreLoader, showPreLoader } from "../../scripts/common-utils.js";

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  console.log("login block: ", block);

  // object to map data with html

  const contentObject = {
    loginHeading: "Innovative integrated solutions",
    loginSubHeading: "Innovation at the speed of life",
    loginFormTitle: "Sign in",
    loginFormSubHeading: "Please login to continue to your account.",
    loginFormEmailLabel: "Email address or phone number",
    loginFormPasswordLabel: "Password",
    loginFormCheckboxText:
      "By clicking the Submit button, you confirm that you have reviewed and agree with the Terms and Use and the Privacy Policy",
    loginFormForgotPasswordLabel: "Forgot Password",
    loginFormForgotPasswordLink: "#",
    loginFormSubmitButtonLabel: "Sign In",
    loginFormNewAccountText: "Need an account?",
    loginFormNewAccountButtonLabel: "Create Account",
    loginFormNewAccountButtonLink: "#",
    backgroundImage: "Innovative integrated solutions",
  };

  const contentWrapper = div(
    {
      class: "items-center flex flex-col",
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
      class: "flex flex-col items-center gap-8",
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
  const loginWrapper = div({
    class:
      "dhls-container px-5 lg:px-10 dhlsBp:p-0 mb-12 bg-danaher-purple-100 flex items-center justify-center",
    style: `background-image: ${contentObject.backgroundImage};`,
  });
  loginWrapper.append(contentWrapper, formWrapper);
  block.innerHtml = "";
  block.textContent = "";
  block.append(loginWrapper);
}

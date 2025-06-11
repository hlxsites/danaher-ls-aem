import {
  div,
  h1,
  h2,
  p,
  form,
  a,
  img,
  span,
} from "../../scripts/dom-builder.js";
import { userLogin } from "../../scripts/auth-utils.js";
import {
  removePreLoader,
  showPreLoader,
  buildInputElement,
  buildButton,
  formValidate,
} from "../../scripts/common-utils.js";

export default async function decorate(block) {
  block?.parentElement?.parentElement?.removeAttribute("class");
  block?.parentElement?.parentElement?.removeAttribute("style");
  document.querySelector("header")?.remove();
  document.querySelector("breadcrumb")?.remove();
  document.querySelector("footer")?.remove();

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

  const contentWrapper = div(
    {
      class: "items-center flex flex-col w-full md:w-1/2",
    },
    h2(
      {
        class: "text-black text-center text-4xl font-medium leading-[48px]",
      },
      contentObject.loginHeading
    ),
    p(
      {
        class: "text-black text-center text-2xl font-medium leading-loose",
      },
      contentObject.loginSubHeading
    )
  );
  const loginForm = form(
    {
      id: `loginForm`,
      class: `text-sm w-full mt-[60px]  max-w-xl box-border flex flex-col gap-5 overflow-hidden `,
      action: "",
      method: "POST",
    },
    h1(
      {
        class: "text-4xl font-medium text-black leading-[48px] m-0 p-0",
      },
      contentObject.loginFormTitle
    ),
    p(
      {
        class: "justify-start text-black text-2xl font-normal  leading-loose",
      },
      contentObject.loginFormSubHeading
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
      "password",
      "password",
      false,
      true,
      "password",
      ""
    ),
    div(
      {
        class: "text-black text-base font-extralight leading-snug m-0 p-0",
      },
      contentObject.loginFormCheckboxText
    ),
    p(
      {
        class:
          "text-black text-base font-extralight leading-snug m-0 p-0 flex justify-end",
      },
      a(
        {
          href: contentObject.loginFormForgotPasswordLink,
          class: "text-danaherpurple-500 font-semibold text-base leading-snug",
        },
        contentObject.loginFormForgotPasswordLabel
      )
    ),
    buildButton(
      contentObject.loginFormSubmitButtonLabel,
      `login`,
      "proceed-button w-full text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6"
    ),
    div(
      {
        class:
          "self-stretch w-full inline-flex justify-start items-center gap-2.5",
      },
      div({
        class:
          "flex-1 h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-300",
      }),
      div(
        {
          class:
            "justify-start text-gray-500 text-base font-medium leading-normal",
        },
        "OR"
      ),
      div({
        class:
          "flex-1 h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-300",
      })
    ),
    div(
      {
        class: "flex gap-1 items-center justify-center  w-full",
      },
      span(
        {
          class: "text-base font-extralight leading-snug text-neutral-500",
        },
        contentObject.loginFormNewAccountText
      ),
      a(
        {
          href: contentObject.loginFormNewAccountButtonLink,
          class: "text-danaherpurple-500 font-semibold text-base leading-snug",
        },
        contentObject.loginFormNewAccountButtonLabel
      )
    )
  );
  const loginFormInputWrapper = loginForm.querySelectorAll(".field-wrapper");

  if (loginFormInputWrapper) {
    loginFormInputWrapper.forEach((fw) => {
      fw.classList.add("w-full", "flex", "flex-col");
    });
  }
  const loginFormInput = loginForm.querySelectorAll("input");
  if (loginFormInput) {
    loginFormInput.forEach((inp) => {
      inp.className = "";
      inp.className =
        "self-stretch p-3 bg-white shadow-sm outline outline-1 outline-offset-[-1px] outline-gray-700 inline-flex justify-start items-center overflow-hidden";
    });
  }
  const formWrapper = div({
    class:
      "flex flex-col items-center gap-8 w-full p-5 md:p-[52px] md:w-1/2 md:h-[100vh] bg-white justify-center",
  });

  const logoImage = div(
    {
      class: "w-full flex flex-start justify-start",
    },
    img({
      src: "./media_1432d4ece3aa7b62fce1ec23cc1955601ce3c6212.svg?width=750&format=svg&optimize=medium",
      class: "w-36 h-20",
    })
  );
  formWrapper.append(logoImage, loginForm);
  const loginButton = loginForm.querySelector("#login");
  // submitting the form
  loginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    showPreLoader();
    const formToSubmit = document.querySelector(`#loginForm`);

    const formData = new FormData(formToSubmit);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    const loginResponse = await userLogin("customer", formData);
    if (loginResponse && loginResponse.status !== "error") {
      removePreLoader();
      window.location.href =
        "/us/en/eds-stage-test/cartlanding.html?ref=feature-cart-checkout-summary";
      return true;
    }
    return false;
  });
  const loginOuter = div({
    class:
      "h-screen w-screen bg-center bg-cover bg-no-repeat flex items-center",
    style: `background-image: url(${contentObject.backgroundImage});`,
  });
  const loginWrapper = div({
    class:
      "dhls-container !mt-0 p-0 mx-auto bg-danaher-purple-100 flex items-center gap-5 justify-center flex-col md:flex-row",
  });
  loginWrapper.append(contentWrapper, formWrapper);
  loginOuter.append(loginWrapper);
  block.innerHtml = "";
  block.textContent = "";
  block.append(loginOuter);
}

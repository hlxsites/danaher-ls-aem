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
    loginFormCheckboxText: loginFormCheckboxText || "",
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
        class: "text-black text-center !text-4xl !font-medium leading-[48px]",
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
      id: "loginForm",
      class:
        "text-sm w-full mt-[60px]  max-w-xl box-border flex flex-col gap-5",
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
    div({
      id: "formCheckboxWrapper",
      class: "text-black text-base font-extralight leading-snug m-0 p-0",
    }),
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
    p({
      id: "formResponse",
      class:
        "flex items-center justify-center hidden w-full p-3 text-xl font-normal",
    }),
    buildButton(
      contentObject.loginFormSubmitButtonLabel,
      "login",
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
  loginForm
    .querySelector("#formCheckboxWrapper")
    ?.append(contentObject.loginFormCheckboxText);
  loginForm
    .querySelector(".proceed-button")
    ?.parentElement?.classList.remove("mt-6");
  const formContentLinks = loginForm.querySelectorAll("a");
  formContentLinks.forEach((lin) => {
    lin.classList.add(
      "border-b",
      "hover:text-danaherpurple-500",
      "border-danaherpurple-500"
    );
  });
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
    const formToSubmit = document.querySelector("#loginForm");

    const formData = new FormData(formToSubmit);
    const formObject = {};
    let formValidation = false;
    formData.forEach((value, key) => {
      const formFieldByKey = formToSubmit.querySelector(`#${key}`);
      if (value === "") {
        formFieldByKey.classList.add("outline-red-700");
        if (formFieldByKey.classList.contains("outline-gray-700")) {
          formFieldByKey.classList.remove("outline-gray-700");
        }
        formValidation = false;
      } else {
        formFieldByKey.classList.add("outline-gray-700");
        if (formFieldByKey.classList.contains("outline-red-700")) {
          formFieldByKey.classList.remove("outline-red-700");
        }
        formValidation = true;
      }
      formObject[key] = value;
    });

    // username: "aadi28@tdhls.com",
    // password: "!InterShop00!12345",

    if (formValidation) {
      const formResponse = document.querySelector("#formResponse");
      const loginResponse = await userLogin("customer", formObject);

      if (loginResponse && loginResponse.status !== "error") {
        formResponse.classList.remove("hidden");
        formResponse.classList.add("text-green-700");
        if (formResponse.classList.contains("text-red-700")) {
          formResponse.classList.remove("text-red-700");
        }
        formResponse.textContent = "Login Successfull";
        window.location.href =
          "/us/en/eds-stage-test/cartlanding.html?ref=feature-cart-checkout-summary";
        return true;
      } else {
        formResponse.classList.remove("hidden");
        formResponse.classList.add("text-red-700");
        if (formResponse.classList.contains("text-green-700")) {
          formResponse.classList.remove("text-green-700");
        }
        formResponse.textContent = "Error Login, please try again.";
      }
    }
    removePreLoader();
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

import { div, h1, h2, p, form, img } from "../../scripts/dom-builder.js";
import { userRegister } from "../../scripts/auth-utils.js";
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

  const registerHeading = block.querySelector(
    "[data-aue-prop='registerHeading']"
  );
  const registerSubHeading = block.querySelector(
    "[data-aue-prop='registerSubHeading']"
  );
  const registerFormTitle = block.querySelector(
    "[data-aue-prop='registerFormTitle']"
  );
  const registerFormSubHeading = block.querySelector(
    "[data-aue-prop='registerFormSubHeading']"
  );
  const registerFormEmailLabel = block.querySelector(
    "[data-aue-prop='registerFormEmailLabel']"
  );
  const registerFormFirstNameLabel = block.querySelector(
    "[data-aue-prop='registerFormFirstNameLabel']"
  );
  const registerFormLastNameLabel = block.querySelector(
    "[data-aue-prop='registerFormLastNameLabel']"
  );
  const registerFormCompanyNameLabel = block.querySelector(
    "[data-aue-prop='registerFormCompanyNameLabel']"
  );
  const registerFormPasswordLabel = block.querySelector(
    "[data-aue-prop='registerFormPasswordLabel']"
  );
  const registerFormConfirmPasswordLabel = block.querySelector(
    "[data-aue-prop='registerFormConfirmPasswordLabel']"
  );
  const registerFormCheckboxText = block.querySelector(
    "[data-aue-prop='registerFormCheckboxText']"
  );
  const registerFormSubmitButtonLabel = block.querySelector(
    "[data-aue-prop='registerFormSubmitButtonLabel']"
  );
  const backgroundImage = block.querySelector(
    "[data-aue-prop='backgroundImage']"
  );

  // object to map data with html
  console.log("registerFormCheckboxText : ", registerFormCheckboxText);

  const contentObject = {
    registerHeading:
      registerHeading?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    registerSubHeading:
      registerSubHeading?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    registerFormTitle:
      registerFormTitle?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    registerFormSubHeading:
      registerFormSubHeading?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    registerFormEmailLabel:
      registerFormEmailLabel?.textContent.trim().replace(/<[^>]*>/g, "") || "",
    registerFormFirstNameLabel:
      registerFormFirstNameLabel?.textContent.trim().replace(/<[^>]*>/g, "") ||
      "",
    registerFormLastNameLabel:
      registerFormLastNameLabel?.textContent.trim().replace(/<[^>]*>/g, "") ||
      "",
    registerFormCompanyNameLabel:
      registerFormCompanyNameLabel?.textContent
        .trim()
        .replace(/<[^>]*>/g, "") || "",
    registerFormPasswordLabel:
      registerFormPasswordLabel?.textContent.trim().replace(/<[^>]*>/g, "") ||
      "",
    registerFormConfirmPasswordLabel:
      registerFormConfirmPasswordLabel?.textContent
        .trim()
        .replace(/<[^>]*>/g, "") || "",
    registerFormCheckboxText: registerFormCheckboxText || "",
    registerFormSubmitButtonLabel:
      registerFormSubmitButtonLabel?.textContent
        .trim()
        .replace(/<[^>]*>/g, "") || "",
    backgroundImage:
      backgroundImage?.src ??
      "https://s7d9.scene7.com/is/image/danaherstage/no-image-availble",
  };

  console.log(" dataobject : ", contentObject);

  const contentWrapper = div(
    {
      class: "items-center flex flex-col w-full md:w-1/2",
    },
    h2(
      {
        class: "text-black text-center !text-4xl !font-medium leading-[48px]",
      },
      contentObject.registerHeading
    ),
    p(
      {
        class: "text-black text-center text-2xl font-medium leading-loose",
      },
      contentObject.registerSubHeading
    )
  );
  const registerForm = form(
    {
      id: "registerForm",
      class:
        "text-sm w-full mt-[60px]  max-w-xl box-border flex flex-col gap-5 ",
      action: "",
      method: "POST",
    },
    h1(
      {
        class: "text-4xl font-medium text-black leading-[48px] m-0 p-0",
      },
      contentObject.registerFormTitle
    ),
    p(
      {
        class: "justify-start text-black text-2xl font-normal  leading-loose",
      },
      contentObject.registerFormSubHeading
    ),
    buildInputElement(
      "firstName",
      contentObject.registerFormFirstNameLabel,
      "text",
      "firstName",
      false,
      true,
      "firstName",
      ""
    ),
    buildInputElement(
      "lastName",
      contentObject.registerFormLastNameLabel,
      "text",
      "lastName",
      false,
      true,
      "lastName",
      ""
    ),
    buildInputElement(
      "companyName",
      contentObject.registerFormCompanyNameLabel,
      "text",
      "companyName",
      false,
      true,
      "companyName",
      ""
    ),
    buildInputElement(
      "userName",
      contentObject.registerFormEmailLabel,
      "text",
      "userName",
      false,
      true,
      "userName",
      ""
    ),
    buildInputElement(
      "password",
      contentObject.registerFormPasswordLabel,
      "password",
      "password",
      false,
      true,
      "password",
      ""
    ),
    buildInputElement(
      "confirmPassword",
      contentObject.registerFormConfirmPasswordLabel,
      "password",
      "confirmPassword",
      false,
      true,
      "confirmPassword",
      ""
    ),
    div({
      id: "formCheckboxWrapper",
      class: "text-black text-base font-extralight leading-snug m-0 p-0",
    }),
    p({
      id: "formResponse",
      class:
        "flex items-center justify-center hidden w-full p-3 text-xl font-normal",
    }),
    buildButton(
      contentObject.registerFormSubmitButtonLabel,
      "register",
      "proceed-button w-full text-xl font-extralight border-danaherblue-500 border-solid btn btn-lg font-medium btn-primary-purple rounded-full px-6"
    )
  );
  registerForm
    .querySelector(".proceed-button")
    ?.parentElement?.classList.remove("mt-6");
  registerForm
    .querySelector("#formCheckboxWrapper")
    .append(contentObject.registerFormCheckboxText);
  const formContentLinks = registerForm.querySelectorAll("a");
  formContentLinks.forEach((lin) => {
    lin.classList.add("text-danaherpurple-500");
  });
  const registerFormInputWrapper =
    registerForm.querySelectorAll(".field-wrapper");

  if (registerFormInputWrapper) {
    registerFormInputWrapper.forEach((fw) => {
      fw.classList.add("w-full", "flex", "flex-col");
    });
  }
  const registerFormInput = registerForm.querySelectorAll("input");
  if (registerFormInput) {
    registerFormInput.forEach((inp) => {
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
  formWrapper.append(logoImage, registerForm);
  const registerButton = registerForm.querySelector("#register");
  // submitting the form
  registerButton.addEventListener("click", async (event) => {
    event.preventDefault();
    showPreLoader();
    const formToSubmit = document.querySelector("#registerForm");

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

    const passwordField = document.querySelector("#password");
    const confirmPasswordField = document.querySelector("#confirmPassword");

    if (
      passwordField.value !== confirmPasswordField.value ||
      passwordField.value === "" ||
      confirmPasswordField.value === ""
    ) {
      passwordField.classList.add("outline-red-700");
      confirmPasswordField.classList.add("outline-red-700");
      if (passwordField.classList.contains("outline-gray-700")) {
        passwordField.classList.remove("outline-gray-700");
      }
      if (confirmPasswordField.classList.contains("outline-gray-700")) {
        confirmPasswordField.classList.remove("outline-gray-700");
      }
      removePreLoader();
      return false;
    } else {
      passwordField.classList.add("outline-gray-700");
      confirmPasswordField.classList.add("outline-gray-700");
      if (passwordField.classList.contains("outline-red-700")) {
        passwordField.classList.remove("outline-red-700");
      }
      if (confirmPasswordField.classList.contains("outline-red-700")) {
        confirmPasswordField.classList.remove("outline-red-700");
      }
    }
    if (formValidation) {
      const formResponse = document.querySelector("#formResponse");
      const registerResponse = await userRegister(formObject);

      if (registerResponse && registerResponse.status !== "error") {
        formResponse.classList.remove("hidden");
        formResponse.classList.add("text-green-700");
        if (formResponse.classList.contains("text-red-700")) {
          formResponse.classList.remove("text-red-700");
        }
        formResponse.textContent = "Registration Successfull";
        removePreLoader();
      } else {
        formResponse.classList.remove("hidden");
        formResponse.classList.add("text-red-700");
        if (formResponse.classList.contains("text-green-700")) {
          formResponse.classList.remove("text-green-700");
        }
        formResponse.textContent = "Error Creating Account, please try again.";
        removePreLoader();
      }
    }
    removePreLoader();
    return false;
  });
  const registerOuter = div({
    class:
      "h-screen w-screen bg-center bg-cover bg-no-repeat flex items-center",
    style: `background-image: url(${contentObject.backgroundImage});`,
  });
  const registerWrapper = div({
    class:
      "dhls-container !mt-0 p-0 mx-auto bg-danaher-purple-100 flex items-center gap-5 justify-center flex-col md:flex-row",
  });
  registerWrapper.append(contentWrapper, formWrapper);
  registerOuter.append(registerWrapper);
  block.innerHtml = "";
  block.textContent = "";
  block.append(registerOuter);
}

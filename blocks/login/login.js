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
  console.log("block: ", block);
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
  // const loginFormNewAccountButtonLink = block.querySelector(
  //   "[data-aue-prop='loginFormNewAccountButtonLink']"
  // );
  const backgroundImage = block.querySelector(
    "[data-aue-prop='backgroundImage']"
  );
  console.log("loginFormNewAccountButtonLink: ", block.querySelectorAll("a"));
}

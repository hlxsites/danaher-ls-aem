import {
  div,
  p,
  h2,
  input,
  label,
  span,
  button,
  select,
  option,
} from "../../scripts/dom-builder.js";
import {
  getAuthorization,
  getCommerceBase,
  isLoggedInUser,
  makeCoveoApiRequest,
} from "./commerce.js";
import { getCookie } from "./scripts.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

const baseURL = getCommerceBase();
const authHeader = getAuthorization();

// api function to make api calls... flexible to make POST GET
const request = async (url, method = "GET", data = {}, headers = {}) => {
  const options = {
    method,
    headers,
  };

  if (data && method.toUpperCase() !== "GET") {
    options.body = data;
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Error fetching data");
    }
    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};

// get api data.. make use of the request function.....
export const getApiData = async (url, headers, requireAuth) => {
  return request(url, "GET", {}, ...Object.fromEntries(headers));
};

// post api data.. make use of the request function.....
export const postApiData = async (url, data, headers) => {
  return await request(url, "POST", data, headers);
};

export const loginUser = async (url, data) => {
  console.log(data.username);
  console.log(data.password);

  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "password");
  urlencoded.append("scope", "openid+profile");
  urlencoded.append("username", data.username);
  urlencoded.append("password", data.password);
  console.log(urlencoded);

  return await request(url, "POST", urlencoded, headers);
};

export function formValidate() {
  let isValid = true;
  document.querySelectorAll("[data-required]").forEach((el) => {
    if (el.dataset.required === "true") {
      const msgEl = document.querySelector(`[data-name=${el.name}]`);
      if (msgEl !== null) {
        if (el.value.length === 0) {
          msgEl.innerHTML = "This field is required";
          isValid = false;
        } else {
          msgEl.innerHTML = "";
        }
      }
    }
  });
  return isValid;
}
// create modal function... can be used anywhere just by importing it ...
export const createModal = (content, hasCancelButton, hasCloseButton) => {
  const modalWrapper = div({
    id: "utilityModal",
  });
  const modalContainer = div({
    class: "relative max-w-xl w-full items-center bg-white",
    id: "utilityModalWrapper",
  });

  let modalBody = div({});
  if (content) {
    modalBody = div(
      {
        class: "modal-body py-6 pb-6",
      },
      content
    );
  }
  let cancelButton = "";
  if (hasCancelButton) {
    cancelButton = span(
      {
        class: "mt-6 text-danaherpurple-500 cursor-pointer",
        id: "closeUtilityModal",
      },
      "Cancel"
    );
    if (content && modalBody) {
      const getModalButtonWrapper = modalBody.querySelector(".button-wrapper");
      if (getModalButtonWrapper) {
        getModalButtonWrapper.classList.add(
          "flex",
          "justify-between",
          "items-center"
        );
        getModalButtonWrapper.append(cancelButton);
      }
    }
    cancelButton.addEventListener("click", function (e) {
      e.preventDefault();
      closeUtilityModal();
    });
  }
  if (hasCloseButton) {
    const modalCloseButton = p(
      {
        class: "close-button",
        name: "close",
      },
      span({
        class: "icon icon-close cursor-pointer",
      })
    );
    modalCloseButton.addEventListener("click", function (e) {
      e.preventDefault();
      closeUtilityModal();
    });

    decorateIcons(modalCloseButton);
    modalContainer.append(modalCloseButton);
  }
  modalContainer.append(modalBody);

  modalWrapper.append(modalContainer);
  const banner = document.querySelector("main");
  banner.append(modalWrapper);
};

export const buildButton = (label, id, classes) => {
  return div(
    { class: "space-y-2 button-wrapper" },
    button(
      {
        type: "button",
        class: classes,
        id: id,
      },
      label
    )
  );
};

export const buildInputElement = (
  lable,
  field,
  inputType,
  inputName,
  autoCmplte,
  required,
  dtName
) => {
  const dataRequired = required ? span({ class: "text-red-500" }, "*") : "";
  return div(
    { class: "space-y-2 field-wrapper   mt-4" },
    label(
      {
        for: lable,
        class: "font-normal text-sm leading-4 rounded-md",
      },
      field,
      dataRequired
    ),
    input({
      type: inputType,
      name: inputName,
      id: inputName,
      autocomplete: autoCmplte,
      "data-required": required,
      class:
        "input-focus text-base w-full block px-2 py-4 text-gray-600 font-extralight border border-solid border-gray-300",
      "aria-label": dtName,
    }),
    span({
      id: "msg",
      "data-name": dtName,
      class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
    })
  );
};

// custom function to render select box
export const buildSelectBox = (
  lable,
  field,
  inputName,
  required,
  dtName,
  itemsList
) => {
  const dataRequired = required ? span({ class: "text-red-500" }, "*") : "";

  return div(
    { class: "space-y-2 field-wrapper  mt-4" },
    label(
      {
        for: lable,
        class: "font-normal text-sm leading-4",
      },
      field,
      dataRequired
    ),
    select(
      {
        id: inputName,
        "aria-label": dtName,
        name: inputName,
        "data-required": required,
        class:
          "input-focus text-base w-full block px-2 py-4 font-extralight border border-solid border-gray-300",
      },
      ...itemsList.map((item) => {
        const value = item.toLowerCase().replace(/ /g, "-");
        const options = option({ value }, item);
        return options;
      })
    ),
    span({
      id: "msg",
      "data-name": dtName,
      class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
    })
  );
};

export function createDropdown(itemsList) {
  // Ensure itemsList is an array without reassigning the parameter
  const items = Array.isArray(itemsList) ? itemsList : [itemsList];
  const list = document.createElement("ul");
  list.classList.add(
    ..."absolute w-full max-h-48 overflow-scroll hidden peer-checked:block z-10 bg-white py-2 text-sm text-gray-700 rounded-lg shadow".split(
      " "
    )
  );
  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add(
      ..."block px-4 py-2 hover:bg-danaherpurple-50 cursor-pointer".split(" ")
    );
    li.textContent = item;
    list.append(li);
  });
  return list;
}

export function buildSelectElement(
  lableFor,
  fieldName,
  inputType,
  inputId,
  dataName,
  inputList
) {
  const selectIcon = div(
    { class: "space-y-2" },
    label(
      {
        for: lableFor,
        class: "font-normal text-sm leading-4",
      },
      fieldName,
      span({ class: "text-red-500" }, "*")
    ),
    div(
      { class: "relative bg-white" },
      input({
        type: inputType,
        id: inputId,
        class: "peer hidden",
      }),
      label(
        {
          for: inputId,
          class:
            "w-full flex justify-between items-center p-4 text-base text-gray-600 font-extralight border border-solid border-gray-300 cursor-pointer focus:outline-none focus:ring-danaherpurple-500",
        },
        span({ class: "text-gray-600" }, "Select"),
        span({ class: "icon icon-dropdown w-3 h-3" })
      ),
      createDropdown(inputList),
      span({
        id: "msg",
        "data-name": dataName,
        class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
      })
    )
  );
  return selectIcon;
}

export const buildCheckboxElement = (
  lable,
  field,
  inputType,
  inputName,
  value,
  required
) =>
  div(
    { class: "flex items-baseline gap-2" },
    input({
      type: inputType,
      name: inputName,
      checked: "checked",
      class: "input-focus-checkbox",
      id: inputName,
      value,
      "data-required": required,
      "aria-label": inputName,
    }),
    label(
      {
        for: lable,
        class: "pl-2",
      },
      field
    )
  );
// utility function to close the modal...can be imported and used globally for the modal created using checkout-utlility createModal function
export const closeUtilityModal = () => {
  const utilityModal = document.querySelector("#utilityModal");
  if (utilityModal) {
    utilityModal.remove();
  }
};

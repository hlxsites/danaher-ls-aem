import {
  div,
  p,
  input,
  label,
  span,
  img,
  button,
  select,
  option,
} from "../../scripts/dom-builder.js";
import { getAuthorization, getCommerceBase } from "./commerce.js";
import { getCookie } from "./scripts.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";

export const baseURL = getCommerceBase();
export const authHeader = getAuthorization();
export const siteID = window.DanaherConfig?.siteID;
export const hostName = window.location.hostname;
export const env = hostName.includes("local")
  ? "local"
  : hostName.includes("dev")
  ? "dev"
  : hostName.includes("stage")
  ? "stage"
  : "prod";

export const preLoader = () => {
  return div(
    {
      class: "flex w-full relative h-24 justify-start items-center",
      id: "preLoader",
    },
    img({
      class: "max-w-sm h-24",
      src: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/loading_icon.gif",
    })
  );
};

export const authenticationToken = sessionStorage.getItem(
  `${siteID}_${env}_apiToken`
);
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

    return { status: "success", data: apiResponse };
  } catch (error) {
    return { status: "error", data: error };
  }
};

// get api data.. make use of the request function.....
export const getApiData = async (url, headers) => {
  try {
    return await request(url, "GET", {}, headers);
  } catch (error) {
    return { status: "error", data: error };
  }
};

// post api data.. make use of the request function.....
export const postApiData = async (url, data, headers) => {
  try {
    return await request(url, "POST", data, headers);
  } catch (error) {
    return { status: "error", data: error };
  }
};

// login function
export const loginUser = async (url, data) => {
  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("scope", "openid+profile");
    urlencoded.append("username", data.username);
    urlencoded.append("password", data.password);
    return await request(url, "POST", urlencoded, headers);
  } catch (error) {
    return { status: "error", data: error };
  }
};

// ::::Get authorization token for loggedin user::::::::::::::::::::::

export const getLoggedinToken = async () => {
  try {
    const loginData = {
      username: "sumit.lakawde@dhlscontractors.com",
      password: "!InterShop00!12345",
    };
    const userLoggedIn = await loginUser(`${baseURL}/token`, loginData);
    if (userLoggedIn.status === "success") {
      sessionStorage.setItem(
        `${siteID}_${env}_apiToken`,
        userLoggedIn.data["access_token"]
      );
      sessionStorage.setItem(
        `${siteID}_${env}_refresh-token`,
        userLoggedIn.data["refresh_token"]
      );
    }
    return userLoggedIn.data;
  } catch (error) {
    return { status: "error", data: error };
  }
};

// check token if already set else call for a new token  :::::::::::::::::::::::::::::::
getLoggedinToken();
if (
  !authHeader ||
  !(authHeader.has("authentication-token") || authHeader.has("Authorization"))
) {
  //getLoggedinToken();
}
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

      const removePreLoader = document.querySelector("#preLoader");
      //:::::::::::: remove preloader :::::::::::::
      if (removePreLoader) {
        removePreLoader.remove();
      }
    }
  });
  return isValid;
}

// form submission can be done with this function via the api calls..... make use of the request function.....
export const submitForm = async (id, action, data) => {
  const formToSubmit = document.querySelector(`#${id}`);
  if (formToSubmit) {
    if (formValidate()) {
      if (
        authHeader &&
        (authHeader.has("authentication-token") ||
          authHeader.has("Authorization"))
      ) {
        if (authenticationToken) {
          const url = `${baseURL}${action}`;

          const defaultHeaders = new Headers();
          defaultHeaders.append("Content-Type", "Application/json");
          defaultHeaders.append("authentication-token", authenticationToken);
          const submitFormResponse = await postApiData(
            url,
            JSON.stringify(data),
            defaultHeaders
          );
          return submitFormResponse;
        } else {
          return { status: "unauthorized", data: "Unauthorized request" };
        }
      }
    } else {
      const removePreLoader = document.querySelector(
        ".checkout-shippingAddress-content #preLoader"
      );
      if (removePreLoader) {
        removePreLoader.remove();
      }
    }
  } else {
    return { status: "error", data: "Error Submitting form." };
  }
};
// create modal function... can be used anywhere just by importing it ...
export const createModal = (content, hasCancelButton, hasCloseButton) => {
  const modalWrapper = div({
    class:
      "inset-0 fixed w-full  bg-black z-50 bg-opacity-50 flex items-center justify-center",
    id: "utilityModal",
  });
  const modalContainer = div({
    class: "relative max-w-xl w-full items-center bg-white p-8",
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
        class: "close-button absolute right-10 top-6",
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
  const mainContainer = document.querySelector("main");
  if (mainContainer) {
    mainContainer.append(modalWrapper);
  }
};
// utility function to close the modal...can be imported and used globally for the modal created using utlility createModal function
export const closeUtilityModal = () => {
  const utilityModal = document.querySelector("#utilityModal");
  if (utilityModal) {
    utilityModal.remove();
  }
};

export const buildButton = (label, id, classes) => {
  return div(
    { class: "space-y-2 button-wrapper mt-6 flex items-center" },
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

export const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const buildInputElement = (
  lable,
  field,
  inputType,
  inputName,
  autoCmplte,
  required,
  dtName,
  value = ""
) => {
  const dataRequired = required ? span({ class: "text-red-500" }, "*") : "";
  const hiddenField = inputType === "hidden" ? "hidden" : "";
  return div(
    {
      class: `space-y-2 field-wrapper   mt-4 ${hiddenField}`,
    },
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
      value: value,
      id: inputName,
      autocomplete: autoCmplte,
      "data-required": required,
      class:
        "input-focus text-base w-full block text-gray-600 font-extralight border border-solid border-gray-300 rounded-md px-3 py-2",
      "aria-label": dtName,
    }),
    span({
      id: "msg",
      "data-name": dtName,
      class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
    })
  );
};

// custom function to build a search input field with icon...
export const buildSearchWithIcon = (
  lable,
  field,
  inputType,
  inputName,
  autoCmplte,
  required,
  dtName,
  placeholder
) => {
  const dataRequired = required ? span({ class: "text-red-500" }, "*") : "";
  const searchElement = div(
    {
      class: "space-y-2 field-wrapper relative",
      id: "searchWithIcon",
    },
    div(
      {
        class: "search-with-icon relative",
      },
      span({
        class: " icon icon-search absolute mt-2 ml-2",
      }),
      input({
        type: inputType,
        name: inputName,
        id: inputName,
        placeholder: placeholder,
        autocomplete: autoCmplte,
        "data-required": required,
        class:
          " min-w-[320px] h-10 rounded-md pl-9 input-focus text-base w-full block px-2 py-4 text-gray-600 font-extralight border border-solid border-gray-300",
        "aria-label": dtName,
      })
    ),
    span({
      id: "msg",
      "data-name": dtName,
      class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
    })
  );
  decorateIcons(searchElement);
  return searchElement;
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
  required,
  extraClasses = "",
  hidden = ""
) => {
  const hiddenField = hidden ? "hidden" : "";
  return div(
    { class: `flex items-baseline gap-2 ${hiddenField} ${extraClasses}` },
    input({
      type: inputType,
      name: inputName,
      checked: "checked",
      class: "input-focus-checkbox",
      id: field,
      value: value,
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
};
//  countries will get from api
export async function getCountries() {
  try {
    const countriesList = localStorage.getItem("countries");
    if (countriesList) {
      return true;
    } else {
      if (authenticationToken) {
        localStorage.removeItem("countires");
        const url = `${baseURL}countries`;
        const defaultHeaders = new Headers();
        defaultHeaders.append("Content-Type", "Application/json");
        defaultHeaders.append("authentication-token", authenticationToken);
        const response = await getApiData(url, defaultHeaders);

        if (response.status === "success") {
          localStorage.setItem("countries", JSON.stringify(response.data.data));
        } else {
          return [];
        }
      }
    }
  } catch (error) {
    return { status: "error", data: error };
  }
}
// update countries will get from api
export async function updateCountries() {
  try {
    if (authenticationToken) {
      localStorage.removeItem("countires");
      const url = `${baseURL}countries`;
      const defaultHeaders = new Headers();
      defaultHeaders.append("Content-Type", "Application/json");
      defaultHeaders.append("authentication-token", authenticationToken);
      const response = await getApiData(url, defaultHeaders);

      if (response.status === "success") {
        localStorage.setItem("countries", JSON.stringify(response.data.data));
      } else {
        return [];
      }
    }
  } catch (error) {
    return { status: "error", data: error };
  }
}

//  states will get from api
export async function getStates(countryCode) {
  try {
    if (authenticationToken) {
      localStorage.removeItem("countires");
      const url = `${baseURL}countries/${countryCode}/main-divisions`;
      const defaultHeaders = new Headers();
      defaultHeaders.append("Content-Type", "Application/json");
      defaultHeaders.append("authentication-token", authenticationToken);
      const response = await getApiData(url, defaultHeaders);

      if (response.status === "success") {
        return response.data.data;
      } else {
        return [];
      }
    }
  } catch (error) {
    return { status: "error", data: error };
  }
}

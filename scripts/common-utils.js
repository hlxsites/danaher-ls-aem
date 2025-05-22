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
import { getCommerceBase } from "./commerce.js";
import { decorateIcons } from "../../scripts/lib-franklin.js";
import {
  getAddressDetails,
  setUseAddress,
} from "../blocks/checkout/checkoutUtilities.js";

export const baseURL = getCommerceBase(); // base url for the intershop api calls
export const siteID = window.DanaherConfig?.siteID;
export const hostName = window.location.hostname;
export const env = hostName.includes("local")
  ? "local"
  : hostName.includes("dev")
  ? "dev"
  : hostName.includes("stage")
  ? "stage"
  : "prod";

/*
:::::::::::::::
 Login the user (Customer/Guest) 
 ::::::::::::::::::::::::::: 
*/
export async function loginUser(type) {
  let loginData = {};
  sessionStorage.clear();
  try {
    if (type === "customer") {
      loginData = {
        username: "aadi28@tdhls.com",
        password: "!InterShop00!12345",
        grant_type: "password",
        checkoutType: "customer",
      };
    } else {
      loginData = {
        grant_type: "anonymous",
        checkoutType: "guest",
      };
    }

    const grant_type = type === "customer" ? "password" : "anonymous";
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", grant_type);
    if (grant_type === "password") {
      urlencoded.append("scope", "openid+profile");
      urlencoded.append("username", loginData.username);
      urlencoded.append("password", loginData.password);
    }
    try {
      const userLoggedIn = await postApiData(
        `${baseURL}token`,
        urlencoded,
        headers
      );

      if (userLoggedIn?.status === "success") {
        sessionStorage.removeItem("addressList");
        sessionStorage.setItem(
          `${siteID}_${env}_apiToken`,
          userLoggedIn.data["access_token"]
        );
        sessionStorage.setItem(
          `${siteID}_${env}_refresh-token`,
          userLoggedIn.data["refresh_token"]
        );
        sessionStorage.setItem(
          `${siteID}_${env}_user_data`,
          JSON.stringify(loginData)
        );
        sessionStorage.setItem(
          `${siteID}_${env}_user_type`,
          type === "guest" ? "guest" : "customer"
        );

        /*
 :::::::::::: 
 get the basket details and create if doen't exists 
 ::::::::::::::::::
   */
        const basketData = await getBasketDetails();

        if (basketData.status === "success") {
          const useAddressObject = {};
          let addressDetails = "";
          let addressURI = "";
          if (basketData.data.data.invoiceToAddress) {
            addressURI = basketData.data.data.invoiceToAddress.split(":")[4];
            addressDetails = await getAddressDetails(
              `customers/-/addresses/${addressURI}`
            );
            Object.assign(useAddressObject, {
              invoiceToAddress: addressDetails,
            });
          }
          if (basketData.data.data.commonShipToAddress) {
            addressURI = basketData.data.data.commonShipToAddress.split(":")[4];
            addressDetails = await getAddressDetails(
              `customers/-/addresses/${addressURI}`
            );
            Object.assign(useAddressObject, {
              commonShipToAddress: addressDetails,
            });
          }

          sessionStorage.setItem(
            "useAddress",
            JSON.stringify({ status: "success", data: useAddressObject })
          );
        }
        return await userLoggedIn.data;
      } else {
        return { status: "error", data: userLoggedIn.data };
      }
    } catch (error) {
      return { status: "error", data: error.message };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
::::::::::::::: 
Gets the Authentication-Token for user (Customer/Guest) 
::::::::::::::::::::::::::: 
*/
export const getAuthenticationToken = async () => {
  try {
    if (sessionStorage.getItem(`${siteID}_${env}_apiToken`)) {
      return {
        access_token: sessionStorage.getItem(`${siteID}_${env}_apiToken`),
        refresh_token: sessionStorage.getItem(`${siteID}_${env}_refresh-token`),
        user_type: sessionStorage.getItem(`${siteID}_${env}_user_type`),
        user_data: sessionStorage.getItem(`${siteID}_${env}_user_data`),
      };
    } else {
      const userToken = await loginUser("customer");

      if (userToken) {
        return {
          access_token: sessionStorage.getItem(`${siteID}_${env}_apiToken`),
          refresh_token: sessionStorage.getItem(
            `${siteID}_${env}_refresh-token`
          ),
          user_type: sessionStorage.getItem(`${siteID}_${env}_user_type`),
          user_data: sessionStorage.getItem(`${siteID}_${env}_user_data`),
        };
      }
      return { status: "error", data: userToken.data };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
};

/*
 :::::::::::::::::::: 
 Show preloader (animation) 
 :::::::::::::::::
 */
export function showPreLoader() {
  const mainPreLoader = document.querySelector("#mainPreLoader");
  mainPreLoader?.classList.remove("hidden");
}

/*
 :::::::::::::::::::: 
 creates a preloader (animation) 
 :::::::::::::::::
 */
export function preLoader() {
  return div(
    {
      class:
        " flex w-full relative top-1/2 left-[46%] justify-start items-center",
      id: "preLoader",
    },
    img({
      class: " h-24",
      src: "https://feature-em15--danaher-ls-aem--hlxsites.hlx.page/icons/loading_icon.gif",
    })
  );
}

/*
:::::::::::::::::::::: 
function to remove preloader whenever required 
:::::::::::::::::::::::
*/
export function removePreLoader() {
  const mainPreLoader = document.querySelector("#mainPreLoader");
  setTimeout(function () {
    mainPreLoader?.classList.add("hidden");
  });
}

/*
 :::::::::::::::::::: 
 creates a preloader for expired login session (animation)
  :::::::::::::::::
 */
export function sessionPreLoader() {
  const sessionPreLoaderContent = div(
    {
      class:
        "text-center flex flex-col w-full relative h-24 justify-center items-center ",
      id: "sessionPreLoader",
    },
    span(
      {
        class: "text-red-500",
      },
      "Session Expired. Please login to continue."
    ),
    span(
      {
        id: "tempLoginButton",
        class: "mt-6 text-green-500 font-bold cursor-pointer",
      },
      "Login Again"
    )
  );
  const tempLoginButton =
    sessionPreLoaderContent.querySelector("#tempLoginButton");
  if (tempLoginButton) {
    tempLoginButton.addEventListener("click", async function (event) {
      event.preventDefault();
      tempLoginButton.insertAdjacentElement("beforeend", preLoader());
      const loginResponse = await loginUser("customer");
      if (loginResponse && loginResponse.status !== "error") {
        removePreLoader();
        removeSessionPreLoader();
      } else {
        return false;
      }
    });
  }
  return createModal(sessionPreLoaderContent, true, true);
}

/*
:::::::::::::::::::::: 
function to remove session preloader whenever required 
:::::::::::::::::::::::
*/
export function removeSessionPreLoader() {
  setTimeout(function () {
    const sessionPreLoader = document.querySelector("#sessionPreLoader");
    sessionPreLoader?.remove();
  }, 1000);
}

/*
::::::::::::::::::::::::::::::: 
 Validates the form to check for empty fields 
 :::::::::::::::::::::::::::::::: 
  @param: {string} : Form ID
*/
export function formValidate(formId) {
  const formToSubmit = document.querySelector(`#${formId}`);
  if (formToSubmit) {
    let isValid = true;
    formToSubmit.querySelectorAll("[data-required]").forEach((el) => {
      if (el.dataset.required === "true") {
        const msgEl = formToSubmit.querySelector(`[data-name=${el.name}]`);
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
  } else {
    return false;
  }
}
/*
:::::::::::::::::::::::::::::::  
Submits the form asper the passed parameters
 :::::::::::::::::::::::::::::::: 
  @param: {string} : Form ID
  @param {String}  : action. Endpoints for the API to submit the form
  @param {String} : method. POST/PUT
  @param {Object} : data. Pass the form data to be handeled by the API.
*/
export async function submitForm(id, action, method, data) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized." };
  }
  try {
    const formToSubmit = document.querySelector(`#${id}`);

    if (formToSubmit && formValidate(id)) {
      const url = `${baseURL}${action}`;

      const defaultHeaders = new Headers();
      defaultHeaders.append("Content-Type", "Application/json");
      defaultHeaders.append(
        "authentication-token",
        authenticationToken.access_token
      );
      const requestedMethod = method === "POST" ? postApiData : putApiData;
      const submitFormResponse = await requestedMethod(
        url,
        JSON.stringify(data),
        defaultHeaders
      );
      return submitFormResponse;
    } else {
      return { status: "error", data: "Error Submitting Form." };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  } finally {
    removePreLoader();
  }
}
/* 
  create modal function... Creates a popup/modal with the input content
  @param: content : html content to load into the modal
  @param hasCancelButton : boolean. Optional cancel button
  @param hasCloseButton : boolean. Optional close button
*/
export function createModal(content, hasCancelButton, hasCloseButton) {
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
}
/*
 ::::::::::::::::::::::::
 utility function to close the modal...can be imported and used globally for the modal created using utlility createModal function 
 ::::::::::::::::::::::::::::::::::::
*/
export function closeUtilityModal() {
  const utilityModal = document.querySelector("#utilityModal");
  if (utilityModal) {
    utilityModal.remove();
  }
}
/*
 ::::::::::::::::::::::::
 Capitalize any string 
 ::::::::::::::::::::::::::::::::::::
*/
export function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/*
::::::::::::::::::::::::::: 
Function to get states from the api based oncountry
:::::::::::::::::::::::::::
 * @param {string} countryCode - The country code to get the states.
*/
export async function getCountries() {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    const countriesList = JSON.parse(localStorage.getItem("countries"));
    if (countriesList?.status === "success") return await countriesList;
    localStorage.removeItem("countires");
    const url = `${baseURL}/countries`;
    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "Application/json");
    const response = await getApiData(url, defaultHeaders);

    if (response.status === "success") {
      localStorage.setItem("countries", JSON.stringify(response));
    }
    return response;
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
::::::::::::::::::::::::::: 
Function to get countries from the API 
:::::::::::::::::::::::::::
*/
export async function updateCountries() {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }

  try {
    localStorage.removeItem("countires");
    const url = `${baseURL}countries`;
    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "Application/json");
    const response = await getApiData(url, defaultHeaders);

    if (response.status === "success") {
      localStorage.setItem("countries", JSON.stringify(response));
    }
    return response;
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
::::::::::::::::::::::::::: 
Function to get states from the api based oncountry
:::::::::::::::::::::::::::
 * @param {string} countryCode - The country code to get the states.
*/
export async function getStates(countryCode) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  try {
    const url = `${baseURL}countries/${countryCode}/main-divisions`;
    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "Application/json");
    defaultHeaders.append(
      "authentication-token",
      authenticationToken.access_token
    );
    const response = await getApiData(url, defaultHeaders);
    if (response.status === "success") {
      return response;
    } else {
      return [];
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
::::::::::::::::::::::::::: 
Function to get general store configurations 
:::::::::::::::::::::::::::
*/
export async function getStoreConfigurations() {
  try {
    const configurations = sessionStorage.getItem("generalConfigurations");
    if (configurations) return await JSON.parse(configurations);
    sessionStorage.removeItem("generalConfigurations");
    const url = `${baseURL}configurations`;
    const defaultHeaders = new Headers();
    defaultHeaders.append("Content-Type", "Application/json");
    //defaultHeaders.append("authentication-token", authenticationToken);
    const response = await getApiData(url, defaultHeaders);

    if (response.status === "success") {
      sessionStorage.setItem("generalConfigurations", JSON.stringify(response));
    }
    return response;
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
::::::::::::::::::::::::::: 
Function to remove any key from the object
 :::::::::::::::::::::::::::

 * @param {string} keyToRemove - The key to be removed from the object.
 * @param {Object} dataObject - The object from which the key to be removed.
*/
export function removeObjectKey(dataObject, keyToRemove) {
  if (dataObject.hasOwnProperty(keyToRemove)) {
    delete dataObject[keyToRemove];
  }
  return dataObject;
}
/*
:::::::::::::::::::::::::::
 Function to create basket
  :::::::::::::::::::::::::::
*/
export const createBasket = async () => {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  const defaultHeader = new Headers({
    "Content-Type": "Application/json",
    "Authentication-Token": authenticationToken.access_token,
    Accept: "application/vnd.intershop.basket.v1+json",
  });
  const url = `${baseURL}/baskets`;
  const data = JSON.stringify({});
  try {
    await postApiData(url, data, defaultHeader);
  } catch (error) {
    return {
      data: error.message,
      status: "error",
    };
  }
};
/*
::::::::::::::::::::::::::: 
Function to get current basket details 
:::::::::::::::::::::::::::
*/
export async function getBasketDetails() {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  const defaultHeader = new Headers({
    "Content-Type": "Application/json",
    "Authentication-Token": authenticationToken.access_token,
    Accept: "application/vnd.intershop.basket.v1+json",
  });
  const basketData = JSON.parse(sessionStorage.getItem("basketData"));

  if (basketData?.status === "success") return basketData;
  const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
  try {
    const response = await getApiData(url, defaultHeader);

    if (response && response.status === "success") {
      sessionStorage.setItem("basketData", JSON.stringify(response));

      return response;
    } else {
      const response = await createBasket();
      if (response.status === "success") {
        sessionStorage.setItem("basketData", JSON.stringify(response));
        if (response.data.invoiceToAddress) {
          const setUseBillingAddress =
            response.data.invoiceToAddress.split(":")[4];
          await setUseAddress(setUseBillingAddress, "billing");
        }
      }
      return response;
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
::::::::::::::::::::::::::: 
Function to update current basket details 
:::::::::::::::::::::::::::
*/
export async function updateBasketDetails() {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  const defaultHeader = new Headers({
    "Content-Type": "Application/json",
    "Authentication-Token": authenticationToken.access_token,
    Accept: "application/vnd.intershop.basket.v1+json",
  });
  const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
  try {
    sessionStorage.removeItem("basketData");
    const response = await getApiData(url, defaultHeader);
    sessionStorage.setItem("basketData", JSON.stringify(response));
    return response;
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
::::::::::::::::::::::::::::::::::::::::::::::: 
 API POST/GET/PUT/PATH operations 
 ::::::::::::::::::::::::::::::
*/

/*
 * Request function to perform fetch, based on the parameters
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {string} method - The method to make the API call.
 * @param {Object} headers - Optional headers for the request.
 * @params {Object} - Returns the response object from the API or an error object.
 
*/
export async function validateBasket(type) {
  const authenticationToken = await getAuthenticationToken();
  if (!authenticationToken) {
    return { status: "error", data: "Unauthorized access." };
  }
  const defaultHeader = new Headers({
    "Content-Type": "Application/json",
    "Authentication-Token": authenticationToken.access_token,
    Accept: "application/vnd.intershop.basket.v1+json",
  });
  const url = `${baseURL}/baskets/current?include=invoiceToAddress,commonShipToAddress,commonShippingMethod,discounts,lineItems,lineItems_discounts,lineItems_warranty,payments,payments_paymentMethod,payments_paymentInstrument`;
  try {
    sessionStorage.removeItem("basketData");
    const response = await getApiData(url, defaultHeader);
    sessionStorage.setItem("basketData", JSON.stringify(response));
    return response;
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
::::::::::::::::::::::::::::::::::::::::::::::: 
 API POST/GET/PUT/PATH operations 
 ::::::::::::::::::::::::::::::
*/

/*
 * Request function to perform fetch, based on the parameters
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {string} method - The method to make the API call.
 * @param {Object} headers - Optional headers for the request.
 * @params {Object} - Returns the response object from the API or an error object.
 
*/
async function request(url, method = "GET", data = {}, headers = {}) {
  const options = {
    method,
    headers,
    redirect: "follow",
  };

  if (data && method.toUpperCase() !== "GET") {
    options.body = data;
  }
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = "";
      if (response.status === 400)
        errorMessage = "Bad request! please try again.";
      if (response.status === 401)
        errorMessage = "Unauthorized! please try again.";
      if (response.status === 403)
        errorMessage = "Request failed! URL was forbidden, please try again.";
      if (response.status === 404)
        errorMessage = "Request not found, please try again.";
      if (response.status === 422)
        errorMessage = "Unprocess the request, please try again.";
      if (response.status === 500)
        errorMessage = "Server error, unable to get the response.";
      throw new Error(errorMessage);
    }
    const apiResponse = await response.json();

    return { status: "success", data: apiResponse };
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
 * Get data from a specified API endpoint with provided  headers.
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 */
export async function getApiData(url, headers) {
  try {
    return await request(url, "GET", {}, headers);
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
 * Sends a POST request to the specified API endpoint with provided data and headers.
 *
 * @param {string} url - The URL of the API endpoint.
 * @param {Object} data - The data to be sent in the request body.
 * @param {Object} headers - Optional headers for the request.
 * @returns {<Object>} - Returns the response object from the API or an error object.
 */

export async function postApiData(url, data, headers) {
  try {
    return await request(url, "POST", data, headers);
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
// post api data.. make use of the request function.....
export async function patchApiData(url, data, headers) {
  try {
    return await request(url, "PATCH", data, headers);
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
// put api data.. make use of the request function.....
export async function putApiData(url, data, headers) {
  try {
    return await request(url, "PUT", data, headers);
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
export async function getCategoryInfo(category) {
   const api = true;

  if (api) {
  try {
    const res = await fetch(`https://lifesciences.danaher.com/us/en/products-index.json`);
    if (!res.ok) {
      console.error(`API request failed with status ${res.status}`);
      return {};
    }
    const data = await res.json();

    const products = data.data;
    if (!Array.isArray(products)) {
      console.error("API response 'data' is not an array:", products);
      return {};
    }

    const product = products.find(item => item.fullCategory === category);
    if (!product) {
      console.warn(`No product found for category: ${category}`);
      return {};
    }

    return {
      title: product.title,
      path: product.path,
      image: product.image,
      description: product.description,
    };
  } catch (e) {
    console.error("Error in getProductInfo:", e);
    return {};
  }
   } else {
    // Placeholder for future API implementation
    return {};
  }
}

/**
 * Fetches product information from APIs based on product ID.
 * @param {string} id - Product ID to fetch data for.
 * @returns {Promise<Object|null>} - Product data or null if fetch fails.
 */
export async function getProductInfo(id) {
  const api = true;

  if (api) {
    try {
      const res1 = await fetch(
        `https://stage.lifesciences.danaher.com/us/en/product-datafproductInfo/?product=${id}`
      );
      if (!res1.ok) {
        return {};
      }
      const main = await res1.json();
      const product = main.results?.[0];
      if (!product) return {};

      const sku = product.raw?.sku || "";
      const res2 = await fetch(
        `https://stage.shop.lifesciences.danaher.com/INTERSHOP/rest/WFS/DANAHERLS-LSIG-Site/-/products/${sku}`
      );
      if (!res2.ok) {
        return {};
      }
      const shopData = await res2.json();

      const showCart = shopData?.attributes?.some(
        (attr) => attr.name === "show_add_to_cart" && attr.value === "True"
      );

      return {
        title: product.title || "",
        url: product.clickUri || "#",
        images: product.raw?.images || [],
        availability: shopData.availability?.inStockQuantity,
        uom:
          shopData.packingUnit > 0
            ? shopData.packingUnit + "/Bundle"
            : "1/Bundle",
        minQty: shopData.minOrderQuantity,
        description: product.raw?.ec_shortdesc || "",
        showCart,
        price: shopData.salePrice?.value,
      };
    } catch (e) {
      return { status: "error", data: e };
    }
  } else {
    // Placeholder for future API implementation
    return {};
  }
}
export function renderProductJsonResponse(iterations) {
  let productsArray = [];
  for (let i = 0; i <= iterations; i++) {
    const productSample = {
      systitle: "DMi1 Inverted Microscope for Cell Culture",

      showonlms: "true",

      ec_images:
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-hero;https://danaherls.scene7.com/is/image/danaher/leica-dmi1-inverted-microscope-16-hero;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-product-image1;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-objectives-product-image3;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-expansion-product-image7;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-sliders-product-image-5;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image35;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4-1;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image41;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image31;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image47;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image37;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image39;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image12;https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image9",
      imageslms: [
        "https://danaherls.scene7.com/is/image/danaher/leica-dmi1-inverted-microscope-16-hero",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-hero",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-product-image1",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-objectives-product-image3",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-expansion-product-image7",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image9",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image12",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image31",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image35",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image37",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image39",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image41",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image47",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-sliders-product-image-5",
        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4-1",
      ],

      sysurihash: "s3u5QJOWwvd0zzsr",

      inriverentityid: "535",

      urihash: "s3u5QJOWwvd0zzsr",

      workflowname: [
        "Monoclonal Antibody (MAbs)",

        "Monoclonal Antibody (MAbs)|Cell Line Development",

        "Oligonucleotide Therapy",

        "Oligonucleotide Therapy|Antisense Oligonucleotide Development and Manufacturing",

        "mRNA Therapy",

        "mRNA Therapy|mRNA Development and Manufacturing",

        "Gene Therapy",

        "Cell Therapy",

        "Plasmid DNA Development and Manufacturing",
      ],

      externallink:
        "https://www.leica-microsystems.com/products/light-microscopes/p/leica-dmi1/",

      sysuri:
        "https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html",

      sysprintableuri:
        "https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html",

      systransactionid: 340578,

      normalmodesamplevolumemetricmicrol: 0,

      public: "true",

      sysconcepts:
        "smart choice ; cell culture ; DMi1 ; microscopes ; variety of accessories ; concentrate ; handling ; LED illumination ; Leica Microsystems ; color temperature ; energy costs ; low maintenance ; S40 condenser ; flexibility",

      concepts:
        "smart choice ; cell culture ; DMi1 ; microscopes ; variety of accessories ; concentrate ; handling ; LED illumination ; Leica Microsystems ; color temperature ; energy costs ; low maintenance ; S40 condenser ; flexibility",

      printableuri:
        "https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html",

      locale: "en-us",

      mappingtype: "Family",

      responsiblebu: "CM",

      contenttype: "Product",

      sysindexeddate: 1744811961000,

      categoriesname: [
        "Microscopes",

        "Microscopes|Light Microscopes",

        "Microscopes|Light Microscopes|Inverted Light Microscopes",
      ],

      description:
        "The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\nJust Right – Smart Choice",

      permanentid: "dmi1-inverted-microscopes",

      workflow: [
        "mabs",

        "mabs|cell-line-development",

        "oligonucleotide-therapy",

        "oligonucleotide-therapy|antisense-oligonucleotide-development-manufacturing",

        "mrna-therapy",

        "mrna-therapy|mrna-development-manufacturing",

        "gene-therapy",

        "cell-therapy",

        "pdna-synthesis",
      ],

      syslanguage: ["English"],

      opco: "Leica Microsystems",

      discontinued: "false",

      transactionid: 340578,

      shopenabledcountry: ["EN-US"],

      title: "DMi1 Inverted Microscope for Cell Culture",

      urlslug: "dmi1-inverted-microscopes",

      ec_brand: ["Leica Microsystems"],

      typo3uid: "34845",

      date: 1744811961000,

      objecttype: "Family",

      richlongdescription:
        "<h3>Just Right For Your Live Cell Lab</h3>\n<p>The well-thought-out design and quality control elements enable you to work in comfort, even during long routines</p>\n<h3>Cost Saving, Color Safe LED Illumination</h3>\n<p>All DMi1 microscopes feature 5W LED illumination for constant color temperature through all stages of intensity</p>\n<h3>All-In-One Visualization And Data Storage</h3>\n<p>The DMi1 camera version is an all-in-one solution for image capturing and cell culture documentation</p>\n<h3>Just Right For Your Live Cell Lab &ndash; Smart Choice For Quick Checks</h3>\n<p>The microscope&rsquo;s flexibility in accommodating an S40 condenser (40 &ndash; 50 mm working distance) or switching to an S80 condenser (80 mm working distance) is achieved by just a few hand moves. High-quality Leica objectives provide brilliant images.</p>\n<p>The well-thought-out design and quality control elements enable you to work in comfort, even during long routines.</p>\n<p>Smart features make your workflow smooth and efficient, saving time and resources. High-quality imaging technology from Leica Microsystems provides precise results and reduces the risk of errors.</p>\n<p>The microscope&rsquo;s LED illumination means low energy costs and minimal downtime. No need to replace lamps often, or wait for the right color temperature to develop.</p>\n<p>The DMi1 is the smart choice for excellent quality.</p>\n<h3>10x to 20x to 40x Phase Contrast With One Hand Move</h3>\n<p>The DMi1 is easy to use for phase contrast observation.</p>\n<p>With 40x PH1 objective from Leica Microsystems you can switch from 10x to 20x to 40x phase contrast by simply swiveling the nosepiece. There is no need to change the light ring in the slider &ndash; the PH1 light ring matches all three objectives!</p>\n<h3>Cost Saving, Color Safe LED Illumination</h3>\n<p>All DMi1 microscopes feature 5W LED illumination for constant color temperature through all stages of intensity.</p>\n<p>The cool LED light provides a perfect climate for delicate live specimens. There are no distortions of the device due to heat, which provides unchanged focus.</p>\n<p>Moreover, LED lamps make great economic sense. LED technology and a twohour auto-off-function reduce energy costs. Up to 20 years life cycle (40 working hrs / week) per lamp under regular conditions mean less downtime and low maintenance costs.</p>\n<h3>Auto Intensity</h3>\n<p>A smart sensor integrated in the slider makes sure that the light intensity automatically adjusts between brightfield and phase contrast. This feature protects the eyes, saves time, and adds comfort for the user.</p>\n<h3>Quick Change From 40 to 50 or 80 Millimeters Working Distance</h3>\n<p>A wide range of working distances makes the DMi1 the perfect partner for your live cell laboratory. Use the S40 condenser for optimal resolution with slides, petri dishes, multi-well dishes, and most types of flasks: The S40 provides an extra 10 mm of free space by simply moving it up.</p>\n<p>When working with taller flasks, simply exchange the S40 for an S80 condenser with a few steps. There is no need to remove the whole illumination arm.</p>\n<h3>All-In-One Visualization And Data Storage</h3>\n<p>The DMi1 camera version is an all-in-one solution for image capturing and cell culture documentation. The Leica 12 megapixel Flexacam C1 camera transforms your microscope into a stand-alone digital imaging station with no need for a PC. Simply connect the camera to your microscope, preferred viewing device such as HDMI monitor, and network and start working! Save images directly on a USB stick or to your local network.</p>\n<p>The camera is mounted at the back of the stand. No additional trinocular tube is needed, and you will have a clear view and easy access to the working area.</p>\n<p>Connect any HDMI monitor to the camera and discuss your observations without need of a PC.</p>\n<h3>Solid Construction</h3>\n<p>The Leica DMi1 is extremely stable due to its low center of gravity. The use of high-grade materials &ndash; almost exclusively metal &ndash; also helps avoid vibrations and resulting image blur. A scratch-resistant stage, high quality optical components, and a wide range of accessories promote a long product life with low maintenance costs.</p>\n<h3>Modular Expansion</h3>\n<p>More flexibility and cost savings by using existing Leica components across platforms. The object guide (accessory) allows the use of different holding frames for flasks, dishes, and multi-well plates.</p>",

      numresources: 6,

      richdescription:
        '<p>The DMi1 inverted microscope supports your specific work routine in your <span style="color: #e03e2d;">cell culture</span> lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.</p>\n<h4>Just Right &ndash; Smart Choice</h4>',

      obsolete: "false",

      longdescription:
        "Just Right – Smart Choice\n\nThe DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\n\nJust Right For Your Live Cell Lab – Smart Choice For Quick Checks\nThe microscope’s flexibility in accommodating an S40 condenser (40 – 50 mm working distance) or switching to an S80 condenser (80 mm working distance) is achieved by just a few hand moves. High-quality Leica objectives provide brilliant images.\nThe well-thought-out design and quality control elements enable you to work in comfort, even during long routines.\nSmart features make your workflow smooth and efficient, saving time and resources. High-quality imaging technology from Leica Microsystems provides precise results and reduces the risk of errors.\nThe microscope’s LED illumination means low energy costs and minimal downtime. No need to replace lamps often, or wait for the right color temperature to develop.\nThe DMi1 is the smart choice for excellent quality.\n\n10x to 20x to 40x Phase Contrast With One Hand Move\nThe DMi1 is easy to use for phase contrast observation.\nWith 40x PH1 objective from Leica Microsystems you can switch from 10x to 20x to 40x phase contrast by simply swiveling the nosepiece. There is no need to change the light ring in the slider – the PH1 light ring matches all three objectives!\n\nCost Saving, Color Safe LED Illumination\nAll DMi1 microscopes feature 5W LED illumination for constant color temperature through all stages of intensity.\nThe cool LED light provides a perfect climate for delicate live specimens. There are no distortions of the device due to heat, which provides unchanged focus.\nMoreover, LED lamps make great economic sense. LED technology and a twohour auto-off-function reduce energy costs. Up to 20 years life cycle (40 working hrs / week) per lamp under regular conditions mean less downtime and low maintenance costs.\n\nAuto Intensity\nA smart sensor integrated in the slider makes sure that the light intensity automatically adjusts between brightfield and phase contrast. This feature protects the eyes, saves time, and adds comfort for the user.\n\nQuick Change From 40 to 50 or 80 Millimeters Working Distance\nA wide range of working distances makes the DMi1 the perfect partner for your live cell laboratory. Use the S40 condenser for optimal resolution with slides, petri dishes, multi-well dishes, and most types of flasks: The S40 provides an extra 10 mm of free space by simply moving it up.\nWhen working with taller flasks, simply exchange the S40 for an S80 condenser with a few steps. There is no need to remove the whole illumination arm.\n\nAll-In-One Visualization And Data Storage\nThe DMi1 camera version is an all-in-one solution for image capturing and cell culture documentation. The Leica 12 megapixel Flexacam C1 camera transforms your microscope into a stand-alone digital imaging station with no need for a PC. Simply connect the camera to your microscope, preferred viewing device such as HDMI monitor, and network and start working!  Save images directly on a USB stick or to your local network.\nThe camera is mounted at the back of the stand. No additional trinocular tube is needed, and you will have a clear view and easy access to the working area.\n\nSolid Construction\nThe Leica DMi1 is extremely stable due to its low center of gravity. The use of high-grade materials – almost exclusively metal – also helps avoid vibrations and resulting image blur. A scratch-resistant stage, high quality optical components, and a wide range of accessories promote a long product life with low maintenance costs.\n\nModular Expansion\nMore flexibility and cost savings by using existing Leica components across platforms. The object guide (accessory) allows the use of different holding frames for flasks, dishes, and multi-well plates.",

      metadescriptionlsig:
        "Discover the Leica DMi1 inverted microscope for efficient cell culture work. Its smart features streamline workflows. Enhance your research today!",

      metatitlelsig:
        "DMi1 Inverted Microscope for Cell Culture | Danaher Life Sciences",

      activeinsfdc: "true",

      rowid: "1744811961047226807",

      titlelsig: "DMi1 Inverted Microscope for Cell Culture",

      specificationsjson: "{}",

      ec_shortdesc:
        "The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\nJust Right – Smart Choice",

      size: 36,

      ec_name: "DMi1 Inverted Microscope for Cell Culture",

      detectedtitle:
        "Just Right For Your Live Cell Lab – Smart Choice For Quick Checks",

      urlsluglsig: "dmi1-inverted-microscopes",

      clickableuri:
        "https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html",

      syssource: "PIM Catalog Source",

      model: "DMi1",

      orderingid: 1744811950965,

      status: "Current",

      syssize: 36,

      sysdate: 1744811961000,

      numspecifications: 0,

      categories: [
        "microscopes",

        "microscopes|light-microscopes",

        "microscopes|light-microscopes|inverted-light-microscopes",
      ],

      primaryid: "OMZXKNKRJJHVO53WMQYHU6TTOIXDKOBUHE2C4ZDFMZQXK3DU",

      familyid: ["dmi1-inverted-microscopes"],

      wordcount: 322,

      sku: "dmi1-inverted-microscopes",

      numbundles: 2,

      ec_category: ["microscopes|light-microscopes|inverted-light-microscopes"],

      showonlsig: "true",

      source: "PIM Catalog Source",

      ec_description:
        "Just Right – Smart Choice\n\nThe DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\n\nJust Right For Your Live Cell Lab – Smart Choice For Quick Checks\nThe microscope’s flexibility in accommodating an S40 condenser (40 – 50 mm working distance) or switching to an S80 condenser (80 mm working distance) is achieved by just a few hand moves. High-quality Leica objectives provide brilliant images.\nThe well-thought-out design and quality control elements enable you to work in comfort, even during long routines.\nSmart features make your workflow smooth and efficient, saving time and resources. High-quality imaging technology from Leica Microsystems provides precise results and reduces the risk of errors.\nThe microscope’s LED illumination means low energy costs and minimal downtime. No need to replace lamps often, or wait for the right color temperature to develop.\nThe DMi1 is the smart choice for excellent quality.\n\n10x to 20x to 40x Phase Contrast With One Hand Move\nThe DMi1 is easy to use for phase contrast observation.\nWith 40x PH1 objective from Leica Microsystems you can switch from 10x to 20x to 40x phase contrast by simply swiveling the nosepiece. There is no need to change the light ring in the slider – the PH1 light ring matches all three objectives!\n\nCost Saving, Color Safe LED Illumination\nAll DMi1 microscopes feature 5W LED illumination for constant color temperature through all stages of intensity.\nThe cool LED light provides a perfect climate for delicate live specimens. There are no distortions of the device due to heat, which provides unchanged focus.\nMoreover, LED lamps make great economic sense. LED technology and a twohour auto-off-function reduce energy costs. Up to 20 years life cycle (40 working hrs / week) per lamp under regular conditions mean less downtime and low maintenance costs.\n\nAuto Intensity\nA smart sensor integrated in the slider makes sure that the light intensity automatically adjusts between brightfield and phase contrast. This feature protects the eyes, saves time, and adds comfort for the user.\n\nQuick Change From 40 to 50 or 80 Millimeters Working Distance\nA wide range of working distances makes the DMi1 the perfect partner for your live cell laboratory. Use the S40 condenser for optimal resolution with slides, petri dishes, multi-well dishes, and most types of flasks: The S40 provides an extra 10 mm of free space by simply moving it up.\nWhen working with taller flasks, simply exchange the S40 for an S80 condenser with a few steps. There is no need to remove the whole illumination arm.\n\nAll-In-One Visualization And Data Storage\nThe DMi1 camera version is an all-in-one solution for image capturing and cell culture documentation. The Leica 12 megapixel Flexacam C1 camera transforms your microscope into a stand-alone digital imaging station with no need for a PC. Simply connect the camera to your microscope, preferred viewing device such as HDMI monitor, and network and start working!  Save images directly on a USB stick or to your local network.\nThe camera is mounted at the back of the stand. No additional trinocular tube is needed, and you will have a clear view and easy access to the working area.\n\nSolid Construction\nThe Leica DMi1 is extremely stable due to its low center of gravity. The use of high-grade materials – almost exclusively metal – also helps avoid vibrations and resulting image blur. A scratch-resistant stage, high quality optical components, and a wide range of accessories promote a long product life with low maintenance costs.\n\nModular Expansion\nMore flexibility and cost savings by using existing Leica components across platforms. The object guide (accessory) allows the use of different holding frames for flasks, dishes, and multi-well plates.",

      collection: "default",

      detectedlanguage: 1,

      indexeddate: 1744811961000,

      defaultcategoryname: "Inverted Light Microscopes",

      filetype: "txt",

      categoryclass: ["Categories"],

      descriptionlsig:
        "The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Its operation is so intuitive, its handling so comfortable that you can fully concentrate on your work. Choose the functions you need, and, if necessary, you can easily add a variety of accessories that are important for your work.\nJust Right – Smart Choice",

      metatitle: "Inverted Microscope for Cell Culture",

      sysclickableuri:
        "https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html",

      metadescription:
        "The DMi1 inverted microscope supports your specific work routine in your cell culture lab. Intuitive operation and comfortable handling - fully concentrate on your work.",

      sysfiletype: "txt",

      language: ["English"],

      defaultcategory:
        "microscopes/light-microscopes/inverted-light-microscopes",

      sysrowid: "1744811961047226807",

      uri: "https://lifesciences.danaher.com/us/en/products/family/dmi1-inverted-microscopes.html",

      numproducts: 2,

      clickableurilms:
        "https://shop.leica-microsystems.com/us/en/products/family/dmi1-inverted-microscopes.html",

      syscollection: "default",

      images: [
        "https://danaherls.scene7.com/is/image/danaher/leica-dmi1-inverted-microscope-16-hero",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-hero",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-product-image1",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-objectives-product-image3",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-expansion-product-image7",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image9",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image12",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image31",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image35",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image37",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image39",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image41",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-image47",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-sliders-product-image-5",

        "https://danaherls.scene7.com/is/image/danaher/leica-microsystems-dmi1-colorsafe-led-ilumination-product-image4-1",
      ],

      productid: "dmi1-inverted-microscopes",
    };
    productsArray.push(productSample);
  }
  return productsArray;
}
/*

::::::::::::::::::::::::::: 
inbuilt and custom dom functions 
::::::::::::::::::::::::::::::

*/

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
      class: `space-y-2 field-wrapper    ${hiddenField}`,
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

/*
::::::::::::::::::
 custom function to build a search input field with icon...
 ::::::::::::::::::::::
 */
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
/*
::::::::::::::::::::::
 custom function to render select box
 :::::::::::::::::::::::
 */
export const buildSelectBox = (
  lable,
  field,
  inputName,
  required,
  dtName,
  itemsList
) => {
  const dataRequired = required ? span({ class: "text-red-500" }, "*") : "";
  let options = [];
  if (itemsList && itemsList.length > 0) {
    options = itemsList.map((item) => {
      const value = item.id;
      const options = option({ value }, item.name);
      return options;
    });
  }
  return div(
    { class: "space-y-2 field-wrapper " },
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
      options
    ),
    span({
      id: "msg",
      "data-name": dtName,
      class: "mt-1 text-sm font-normal leading-4 text-danaherpurple-500",
    })
  );
};
export function createDropdown(itemsList) {
  /*
  ::::::::::::::::
   Ensure itemsList is an array without reassigning the parameter
   :::::::::::::::::::
   */
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
      class: "input-focus-checkbox",
      id: inputName,
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

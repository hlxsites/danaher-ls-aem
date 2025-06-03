import { div, span } from "./dom-builder.js";
import { postApiData } from "./api-utils.js";
import { getCommerceBase } from "./commerce.js";
import {
  preLoader,
  showPreLoader,
  removePreLoader,
  createModal,
} from "./common-utils.js";
import { setAuthenticationToken } from "./token-utils.js";
import { getBasketDetails, getAddressDetails } from "./cart-checkout-utils.js";

const baseURL = getCommerceBase(); // base url for the intershop api calls
/*
:::::::::::::::
 Login the user (Customer/Guest)
 :::::::::::::::::::::::::::
*/
export async function userLogin(type) {
  showPreLoader();
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

        setAuthenticationToken(userLoggedIn.data, loginData, type);
        /*
 ::::::::::::
 get the basket details and create if doen't exists
 ::::::::::::::::::
   */

        const basketData = await getBasketDetails();

        if (basketData.status === "success") {
          const useAddressObject = {};
          let addressDetails = "";
          if (basketData?.data?.data?.invoiceToAddress) {
            const invoiceToAddressURI =
              basketData?.data?.data?.invoiceToAddress?.split(":")[4];
            addressDetails = await getAddressDetails(
              `customers/-/addresses/${invoiceToAddressURI}`
            );
            Object.assign(useAddressObject, {
              invoiceToAddress: addressDetails,
            });
          }
          if (basketData.data.data.commonShipToAddress) {
            const commonShipToAddressURI =
              basketData?.data?.data?.commonShipToAddress?.split(":")[4];
            addressDetails = await getAddressDetails(
              `customers/-/addresses/${commonShipToAddressURI}`
            );
            Object.assign(useAddressObject, {
              commonShipToAddress: addressDetails,
            });
          }

          sessionStorage.setItem(
            "useAddress",
            JSON.stringify({ status: "success", data: useAddressObject })
          );
          window.location.href =
            "/us/en/eds-stage-test/checkout.html?ref=em1-t112-checkout-summary-opti";
        }
        return await userLoggedIn.data;
      }
      return { status: "error", data: userLoggedIn.data };
    } catch (error) {
      return { status: "error", data: error.message };
    }
  } catch (error) {
    return { status: "error", data: error.message };
  }
}

/*
::::::::::::::::::::::
function to remove session preloader whenever required
:::::::::::::::::::::::
*/
export function removeSessionPreLoader() {
  setTimeout(() => {
    const sessionPreLoaderContainer =
      document.querySelector("#sessionPreLoader");
    sessionPreLoaderContainer?.remove();
  }, 1000);
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
    tempLoginButton.addEventListener("click", async (event) => {
      event.preventDefault();
      tempLoginButton.insertAdjacentElement("beforeend", preLoader());
      const loginResponse = await loginUser("customer");
      if (loginResponse && loginResponse.status !== "error") {
        removePreLoader();
        removeSessionPreLoader();
        return true;
      }
      return false;
    });
  }
  return createModal(sessionPreLoaderContent, true, true);
}

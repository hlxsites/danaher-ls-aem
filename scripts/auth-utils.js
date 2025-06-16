import { div, span } from "./dom-builder.js";
import { postApiData, getApiData } from "./api-utils.js";
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
 Register the user (Customer)
 :::::::::::::::::::::::::::
*/
export async function userRegister(data = {}) {
  showPreLoader();
  try {
    let dataObject = {};
    if (data) {
      dataObject = {
        isBusinessCustomer: "true",
        customerNo: data.userName,
        companyName: data.companyName,
        user: {
          title: " ",
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.userName,
          businessPartnerNo: data.userName,
          preferredLanguage: "en_US",
        },
        credentials: {
          login: data.userName,
          password: data.password,
        },
      };
    }
    // eslint-disable-next-line
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const userRegistered = await postApiData(
      `${baseURL}customers`,
      JSON.stringify(dataObject),
      headers
    );
    if (userRegistered?.status === "success") {
      return userRegistered;
    }
    return {
      status: "error",
      data: "Error Registration. Please try again.",
    };
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
/*
:::::::::::::::
 Login the user (Customer/Guest)
 :::::::::::::::::::::::::::
*/
export async function userLogin(type, data = {}) {
  showPreLoader();
  let loginData = {};
  sessionStorage.clear();
  try {
    if (type === "customer" && data) {
      loginData = {
        username: data.userName,
        password: data.password,
        grant_type: "password",
        checkoutType: "customer",
      };
    } else {
      loginData = {
        grant_type: "anonymous",
        checkoutType: "guest",
      };
    }
    // eslint-disable-next-line
    const grant_type = type === "customer" ? "password" : "anonymous";
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", grant_type);
    // eslint-disable-next-line
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
        const userLoggedInData = await getUserData(
          userLoggedIn?.data?.access_token
        );
        if (userLoggedInData.status === "success") {
          setAuthenticationToken(
            userLoggedIn.data,
            userLoggedInData.data,
            type
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
          }
          return userLoggedIn;
        } else {
          return { status: "error", data: userLoggedIn.data };
        }
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
:::::::::::::::
 Login the user (Customer/Guest)
 :::::::::::::::::::::::::::
*/
async function getUserData(token) {
  try {
    const defaultHeader = new Headers({
      "Authentication-Token": token,
    });
    const userCustomerData = await getApiData(
      `${baseURL}customers/-`,
      defaultHeader
    );
    if (userCustomerData?.status === "success") {
      const userData = await getApiData(
        `${baseURL}customers/-/users/`,
        defaultHeader
      );
      console.log("userData auth utils: ", userData);
      if (userData?.status === "success") {
        return {
          status: "success",
          data: {
            customerData: userCustomerData.data,
            userData: userData.data,
          },
        };
      } else {
        return { status: "error", data: "User Not found." };
      }
    } else {
      return { status: "error", data: "User Not found." };
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
      const loginResponse = await userLogin("customer");
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

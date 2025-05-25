import { div, span } from "./dom-builder.js";
import { postApiData, getApiData } from "./api-utils.js";
import { getCommerceBase } from "./commerce.js";
import { preLoader, removePreLoader, createModal } from "./shared-utils.js";
import { setUseAddress } from "./cart-checkout-utils.js";

const siteID = window.DanaherConfig?.siteID;
const hostName = window.location.hostname;
let env;
if (hostName.includes("local")) {
  env = "local";
} else if (hostName.includes("dev")) {
  env = "dev";
} else if (hostName.includes("stage")) {
  env = "stage";
} else {
  env = "prod";
}
const baseURL = getCommerceBase(); // base url for the intershop api calls

/*
:::::::::::::::::::::::::::
 Function to create basket
  :::::::::::::::::::::::::::
*/
export const createBasket = async () => {
  const authenticationToken = sessionStorage.getItem(
    `${siteID}_${env}_apiToken`
  );
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
    return await postApiData(url, data, defaultHeader);
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
    const basketResponse = await getApiData(url, defaultHeader);

    if (basketResponse && basketResponse.status === "success") {
      sessionStorage.setItem("basketData", JSON.stringify(basketResponse));

      return basketResponse;
    }
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
  } catch (error) {
    return { status: "error", data: error.message };
  }
}
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
          userLoggedIn.data.access_token
        );
        sessionStorage.setItem(
          `${siteID}_${env}_refresh-token`,
          userLoggedIn.data.refresh_token
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
          const { getAddressDetails } = await import(
            "./cart-checkout-utils.js"
          );
          if (basketData?.data?.data?.invoiceToAddress) {
            const [, , , , addressURI] =
              basketData.data.data.invoiceToAddress.split(":")[4];
            addressDetails = await getAddressDetails(
              `customers/-/addresses/${addressURI}`
            );
            Object.assign(useAddressObject, {
              invoiceToAddress: addressDetails,
            });
          }
          if (basketData.data.data.commonShipToAddress) {
            const [, , , , addressURI] =
              basketData.data.data.commonShipToAddress.split(":")[4];
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
    }
    const userToken = await loginUser("customer");

    if (userToken) {
      return {
        access_token: sessionStorage.getItem(`${siteID}_${env}_apiToken`),
        refresh_token: sessionStorage.getItem(`${siteID}_${env}_refresh-token`),
        user_type: sessionStorage.getItem(`${siteID}_${env}_user_type`),
        user_data: sessionStorage.getItem(`${siteID}_${env}_user_data`),
      };
    }
    return { status: "error", data: userToken.data };
  } catch (error) {
    return { status: "error", data: error.message };
  }
};
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

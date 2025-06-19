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
    return { status: "error", data: "Login Session Expired." };
  } catch (error) {
    return { status: "error", data: error.message };
  }
};

/*
:::::::::::::::
Gets the Authentication-Token for user (Customer/Guest)
:::::::::::::::::::::::::::
*/
export const setAuthenticationToken = (tokenData, loginData, type) => {
  try {
    sessionStorage.setItem(`${siteID}_${env}_apiToken`, tokenData.access_token);
    sessionStorage.setItem(
      `${siteID}_${env}_refresh-token`,
      tokenData.refresh_token
    );
    sessionStorage.setItem(
      `${siteID}_${env}_user_data`,
      JSON.stringify(loginData)
    );
    sessionStorage.setItem(
      `${siteID}_${env}_user_type`,
      type === "guest" ? "guest" : "customer"
    );
    return {};
  } catch (error) {
    return { status: "error", data: error.message };
  }
};

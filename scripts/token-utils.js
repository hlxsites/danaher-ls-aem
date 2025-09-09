// eslint-disable-next-line import/no-cycle
import { getCookie, setCookie } from './scripts.js';

export const siteID = window.DanaherConfig?.siteID;
const hostName = window.location.hostname;
export let env;
if (hostName.includes('local')) {
  env = 'local';
} else if (hostName.includes('dev')) {
  env = 'dev';
} else if (hostName.includes('stage')) {
  env = 'stage';
} else {
  env = 'prod';
}
export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/*
:::::::::::::::
Gets the Authentication-Token for user (Customer/Guest)
:::::::::::::::::::::::::::
*/
export const getAuthenticationToken = async () => {
  try {
    if (getCookie(`em_${siteID}_${env}_apiToken`)) {
      return {
        access_token: getCookie(`em_${siteID}_${env}_apiToken`),
        refresh_token: getCookie(`em_${siteID}_${env}_refresh-token`),
        user_type: getCookie(`em_${siteID}_${env}_user_type`),
        user_data: JSON.stringify(getCookie(`em_${siteID}_${env}_user_data`)),
        status: getCookie(`em_${siteID}_${env}_authorized`),
      };
    }
    return { status: 'error', data: 'Login Session Expired.' };
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};

/*
:::::::::::::::
Gets the Authentication-Token for user (Customer/Guest)
:::::::::::::::::::::::::::
*/
export const setAuthenticationToken = (tokenData, loginData, type) => {
  try {
    deleteCookie(`em_${siteID}_${env}_apiToken`);
    deleteCookie(`em_${siteID}_${env}_refresh-token`);
    deleteCookie(`em_${siteID}_${env}_user_data`);
    deleteCookie(`em_${siteID}_${env}_user_type`);
    deleteCookie(`em_${siteID}_${env}_authorized`);
    sessionStorage.setItem(`em_${siteID}_${env}_apiToken`, tokenData.access_token);
    setCookie(`em_${siteID}_${env}_apiToken`, tokenData.access_token);
    setCookie(`em_${siteID}_${env}_refresh-token`, tokenData.refresh_token, tokenData.refresh_expires_in);
    setCookie(`em_${siteID}_${env}_user_data`, JSON.stringify(loginData));
    setCookie(`em_${siteID}_${env}_user_type`, type === 'guest' ? 'guest' : 'customer');
    setCookie(`em_${siteID}_${env}_authorized`, 'success');
    // sessionStorage.setItem(
    //   `em_${siteID}_${env}_refresh-token`,
    //   tokenData.refresh_token,
    // );
    // sessionStorage.setItem(
    //   `em_${siteID}_${env}_user_data`,
    //   JSON.stringify(loginData),
    // );
    // sessionStorage.setItem(
    //   `em_${siteID}_${env}_user_type`,
    //   type === 'guest' ? 'guest' : 'customer',
    // );
    // sessionStorage.setItem(
    //   `em_${siteID}_${env}_authorized`,
    //   'success',
    // );
    return {};
  } catch (error) {
    return { status: 'error', data: error.message };
  }
};
